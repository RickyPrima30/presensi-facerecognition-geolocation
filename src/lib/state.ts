import { goto } from "$app/navigation";
import { createClient, type Session } from "@supabase/supabase-js";
import { writable } from "svelte/store";
import type { AdminInfo, DosenInfo, Jadwal, Presensi, State, User } from "./types";

export const client = createClient("https://nfqvhulsxmlzekgpayuk.supabase.co",'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Im5mcXZodWxzeG1semVrZ3BheXVrIiwicm9sZSI6ImFub24iLCJpYXQiOjE2NzU5MDI2MzAsImV4cCI6MTk5MTQ3ODYzMH0.TcYsuIfSXZ31mSVkvJCdbUXOVtzngLVnD6Wo-sHwpws')


export const state = writable<State>()
export const jadwal = writable<Jadwal[]>()
export const adminInfo = writable<AdminInfo>()
export const dosenInfo = writable<DosenInfo>()
export const userPresensi = writable<Presensi[]>()

let user: User = ({} as any)
let session: Session | null = null


export async function login(nim: string, password: string) {
	
	const { data: userData, error: userErr } = await fetchUserData({ nim })
	if (userErr) {
		console.error('NIM Error:',userErr)
		return { valid: false, error: 'NIM atau password salah' }
	}
	
	const { error: err } = await client.auth.signInWithPassword({
		email: (userData as User).email, password
	})
	if (err) {
		console.error('Credential error:',err)
		return { valid: false, error: 'NIM atau password salah' }
	}
	
	await validateSession()
	
	return { valid: true, error: null, type: (userData as User).type }
}

export async function logout() {
	const { error: supaError } = await client.auth.signOut()
	if (supaError) { console.error('err logout:',supaError) }
	goto('/')
}

export async function validateData() {
	switch (user.type) {
		case 'mhs':{
			return await Promise.all([
				fetchMhsJadwal(),
				fetchUserPresensi(),
			])
		}
		case 'dosen':{
			return await Promise.all([
				fetchDosenJadwal(),
				fetchDosenInfo()
			])
		}
		case 'admin':{
			await fetchAdminInfo()
			return
		}
	}
}
export async function validateSession() {
	const { data: { session: supaSession }, error: supaErr } = await client.auth.getSession()
	if (supaErr){
		console.error('err validating session',supaErr)
		return { valid: false, type: undefined }
	}
	
	session = supaSession
	
	if (session){
		const { data: userData, error: userErr } = await fetchUserData({ email: session?.user.email })
		if (userErr){
			console.error('err validating session',userErr)
			return { valid: false, type: undefined }
		}
		user = userData as User
		user.photo = `https://nfqvhulsxmlzekgpayuk.supabase.co/storage/v1/object/public/bucket/${user.nama.replaceAll(' ','_')}.jpg`
	}
	
	state.set({ session, user })
	
	if (user){
		await validateData()
	}
	return { valid: Boolean(session), type: user?.type }
}

export async function fetchUserData({nim, email}:{ nim?: string, email?: string }){
	return client.from('mhs').select('*').eq(nim ? 'nim' : 'email',nim ?? email).single()
}


export async function fetchMhsJadwal() {
	jadwal.set((await client.from('jadwal').select('*, matkul(*), dosen(*)').eq('kelompok',user.kelompok.toUpperCase())).data as any)
}
export async function fetchUserPresensi() {
	userPresensi.set((await client.from('presensi').select('*, jadwal(*,matkul(*))').eq('mhs',user.nama)).data as any)
}


export async function fetchDosenJadwal () {
	jadwal.set((await client.from('jadwal').select('*, matkul(*), dosen(*)').eq('dosen',user.nama)).data as any)
}
export async function fetchDosenInfo() {
	const res = await Promise.all([
		client.from('presensi').select('*, jadwal(*), mhs(*)'),
		client.from('mhs').select('*').eq('type','mhs'),
	])
	
	dosenInfo.set( Object.fromEntries( res.map(
		({data, error: cr },i) =>[i == 0 ? 'presensi' : 'mhs',data]
	)) as any)
}



export async function fetchAdminInfo () {
	const res = await Promise.all([
		client.from('mhs').select('*'),
		client.from('jadwal').select('*, matkul(id,nama)'),
	])
	adminInfo.set( Object.fromEntries(res.map(
		({data, error: cr},i) => [i == 0 ? 'mhs' : 'jadwal',data]
	)) as any)
}

export async function bukaPresensi(jadwal: Jadwal) {
	return await client.from('jadwal')
		.update([ { status: true, stamp: Date.now() } ])
		.eq('id',jadwal.id)
}