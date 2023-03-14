export function getImgLink(nama: string) {
	return `https://nfqvhulsxmlzekgpayuk.supabase.co/storage/v1/object/public/bucket/${nama.trim().replaceAll(' ','_')}.jpg`
}
export function getDate(state?: number) {
	const d = state ? new Date(state) : new Date()
	return {
		d: d.getDay(),
		h: d.getHours(),
		m: d.getMinutes(),
		s: d.getSeconds()
	}
}