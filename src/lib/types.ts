import type { Session } from "@supabase/supabase-js"

export interface _User {
	nama: string
	nim: string
	type: 'mhs' | 'dosen' | 'admin'
	kelompok: string
	keterangan: string
	email: string
	photo: string
}
export interface _Jadwal {
	dosen: {
		keterangan: string,
		nama: string,
		nim: string,
		type: 'dosen'
	}
	matkul: {
		id: number
		nama: string
		sks: number
	}
	id: number
	jadwal1:string
	kelompok: string
	ruang: string
	status: boolean
	stamp: number
	dadakan: boolean
	len: number
}
export interface AdminInfo {
	jadwal: Jadwal[]
	mhs: User[]
	prodi: {
		id: number
		kelompok: string
		mhs: string
		prodi: string
	}[]
}
export interface DosenInfo {
	mhs: User[]
	presensi: Presensi[]
}
export interface State {
	session: Session | null
	user: User
}
//==========================================================================================
export interface Matkul{
	id: number
	nama: string
	sks: number
}
export interface User {
	nim: string
	nama: string
	type: 'mhs' | 'dosen' | 'admin'
	keterangan: string
	kelompok: string
	email: string
	photo: string
	prodi: string
	dummy: boolean
}
export interface Jadwal {
	id: number
	kelompok: string
	jadwal1: string
	matkul: Matkul
	dosen: User
	ruang: string
	status: boolean
	stamp: number
	dadakan: boolean
	len: number
}
export interface Presensi {
	id: number
	mhs: User
	waktu: string
	status: number
	jadwal: Jadwal
}