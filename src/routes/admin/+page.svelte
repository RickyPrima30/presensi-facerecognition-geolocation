<script lang=ts context=module>
	export let moreMhs = writable(0)
	
</script>


<script lang=ts>
  import { filterNow, flatten, getUiTime } from "$lib/lib";
	import { active } from "./+layout.svelte";
	import { adminInfo } from "$lib/state";
  import { writable } from "svelte/store";
	
	function lerp(a:number,b:number,t:number) {
		return a + (b - a) * t
	}
	function ilerp(a:number,b:number,v:number) {
		return (v - a) / (b - a)
	}
	
	$: range = lerp(32,266,(100-c)/100)
	$: $moreMhs = mhsAktif
	// from 32 full
	// to 266 none
	let c = 0
	
	let jadwalNow = filterNow($adminInfo.jadwal)
	
	let flattenKelompokNow = flatten(jadwalNow,e=>e.kelompok)
	
	let mhsAktif = $adminInfo.mhs.filter(e=>flattenKelompokNow.find(f=>e.kelompok==f)).length
	let totalMhs = $adminInfo.mhs.filter(e=>e.type=='mhs').length
	let radMhs = lerp(266,32,ilerp(0,totalMhs,mhsAktif))
	
	let flattenDosenNow = flatten(jadwalNow,e=>(e.dosen as unknown as string))
	console.log(jadwalNow,flattenDosenNow)
	let totalDosen = $adminInfo.mhs.filter(e=>e.type=='dosen').length
	let dosenAktif = $adminInfo.mhs.filter(e=>flattenDosenNow.find(f=>e.nama==f)).length
	let radDosen = lerp(266,32,ilerp(0,totalDosen,dosenAktif))
	
</script>

<main>
	<h1>Dashboard ADMIN</h1>
	<!-- svelte-ignore a11y-missing-content -->
	<h1 id="dates">{getUiTime()}</h1>

	<div class="insights">
		
			<div class="dosen">
					<span class="material-symbols-outlined">person</span>
					<div class="middle">
							<div class="left">
									<h3>Total Dosen</h3>
									<h1>{dosenAktif}</h1>
							</div>
							<div class="progress">
								<svg>
										<circle style="stroke-dashoffset: {radDosen}%;stroke-dasharray: 255;" cx="38" cy="38" r="36"></circle>
									</svg>
									<div class="number">
											<p>{Math.floor((dosenAktif/totalDosen)*100)}%</p>
									</div>
							</div>
					</div>
					<small class="text-muted">Aktif Hari Ini</small>
			</div>
			<!-- AKHIRAN DOSEN -->
			
			
			<div class="mahasiswa">
					<span class="material-symbols-outlined">groups</span>
					<div class="middle">
							<div class="left">
									<h3>Total Mahasiswa</h3>
									<h1>{mhsAktif}</h1>
							</div>
							<div class="progress">
									<svg>
											<circle style="stroke-dashoffset: {radMhs}%;stroke-dasharray: 255;" cx="38" cy="38" r="36"></circle>
									</svg>
									<div class="number">
											<p>{Math.ceil((mhsAktif/totalMhs)*100)}%</p>
									</div>
							</div>
					</div>
					<small class="text-muted">Aktif Hari Ini</small>
			</div>
			<!-- AKHIRAN MAHASISWA -->
			
			
			<div class="fakultas">
					<span class="material-symbols-outlined">school</span>
					<div class="middle">
							<div class="left">
									<h3>Total Fakultas</h3>
									<h1>1</h1>
							</div>
							<div class="progress">
									<svg>
											<circle style="stroke-dashoffset: {32}%;stroke-dasharray: 255;" cx="38" cy="38" r="36"></circle>
									</svg>
									<div class="number">
											<p>100%</p>
									</div>
							</div>
					</div>
					<small class="text-muted">Aktif Hari Ini</small>
			</div>
			<!-- AKHIRAN FAKULTAS -->
			
			
	</div>
	<!-- AKHIRAN INSIGHTS -->

	<div class="recent">
			<h2>Presensi Baru Baru ini</h2>
			<table>
					<thead>
							<tr>
									<th>NIM</th>
									<th>NAMA</th>
									<th>Kelompok</th>
									<th>JAM</th>
									<th></th>
							</tr>
					</thead>
					<tbody>
						<tr>
							<td colspan="5" style="text-align: center;">Tidak ada presensi</td>
						</tr>
					</tbody>
			</table>
			<a href="/admin/mhs" on:click={()=>$active='/admin/mhs'}>Lihat Semua...</a>
	</div>
</main>
<!-- Akhiran Main -->
