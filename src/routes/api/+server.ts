import { createClient } from "@supabase/supabase-js";
import { error, type RequestHandler } from "@sveltejs/kit";

export const GET: RequestHandler = async () => {
	const client = createClient("https://nfqvhulsxmlzekgpayuk.supabase.co",'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Im5mcXZodWxzeG1semVrZ3BheXVrIiwicm9sZSI6ImFub24iLCJpYXQiOjE2NzU5MDI2MzAsImV4cCI6MTk5MTQ3ODYzMH0.TcYsuIfSXZ31mSVkvJCdbUXOVtzngLVnD6Wo-sHwpws')
	const { data, error: supaErr } = await client.from('presensi').select('*').csv()
	
	if (supaErr){
		throw error(404,supaErr.details)
	}
	
	let parsedData = (data ?? {} as any).split('\n')
	const finalData = parsedData.map(e=>{
		let sp = e.split(',')
		sp[4] = sp[4] == '1' ? 'Hadir' : sp[4] == '2' ? 'Izin' : 'Sakit'
		return sp.join(',')
	}).join('\n')
	
	const res = new Response(finalData);
	
	res.headers.set('Content-Type','text/plain')
	res.headers.set('Content-Disposition','attachement; filename=Rekap Presensi.csv')
	
	return res
};
