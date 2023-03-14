import type { Jadwal } from "./types"

export function range(from:number, to: number) {
	return {
		[Symbol.iterator]: () => {
			let i = from
			let done = false
			return {
				next(){
					done = i++ >= to
					return {
						value: i, done
					}
				}
			}
		}
	}
}

export const hariMap = ["Minggu","Senin","Selasa","Rabu","Kamis","Jum'at","Sabtu"]
export const bulanMap = ["Januari","Februari","Maret","April","Mei","Juni","Juli","Agustus","September","Oktober","November","Desember"]

export function getDate() {
	const date = new Date();
	return {
		tanggal: date.getDate(),
		hari: hariMap[date.getDay()],
		bulan: bulanMap[date.getMonth()],
		tahun: date.getFullYear()
	}
}

export function footerGetDate() {
	const { hari, tanggal, bulan, tahun} = getDate();
	return `© ${hari}, ${tanggal} ${bulan} ${tahun} | PRESENSI ONLINE | All Right Reserved`
}

export function getUiTime() {
	const { hari, tanggal, bulan, tahun} = getDate()
	return `${hari}, ${tanggal} ${bulan} ${tahun}`
}

export function filterNow(jadwal: Jadwal[]) {
	return jadwal.filter(e=>hariMap.findIndex(hari=>e.jadwal1.split(',')[0] == hari) == (new Date()).getDay())
}

export function flatten<T>(arr: T[],cb: (arg: T) => string) {
	const out = {} as any
	arr.forEach(e=>{
		out[cb(e)] = true
	})
	return Object.keys(out)
}
export function detectLocation(x: number,y: number, jarakCustom?: number) {
	
	let JARAK_UDINUS = 0.4
	
	return ( Math.pow(x-(-6.981362),2) + Math.pow(y-110.409407,2) ) * 100000 <= (jarakCustom ?? JARAK_UDINUS)
}
export function darkMode(current = false,isInit = false) {
	let dark = current
	
	if (isInit){ if ((localStorage.getItem('theme') ?? 'light') == 'dark'){ doit() } }
	else{ doit() }
	
	function doit() {
		document.body.classList.toggle('dark-theme-variables');
		dark = !dark;
		localStorage.setItem('theme',dark ? 'dark' : 'light')
	}
	
	return dark
}