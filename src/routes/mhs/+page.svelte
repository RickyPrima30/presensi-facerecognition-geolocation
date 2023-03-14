
<script lang=ts>
  import { onMount } from "svelte";
	import { getUiTime, hariMap } from "$lib/lib";
  import { client, userPresensi, jadwal, state, validateData } from "$lib/state";
	import { active } from "./+layout.svelte";
  import Camera from "./Camera.svelte";
	import { getDate } from "$lib/utility";
	import { derived, writable } from "svelte/store";
	
	
	let showCamera = false
	const def = { min: 0, sec: '0', time: 0, counter: '', isHide: false }
	let data = [Object.create(def),Object.create(def),def]
	let current_jadwal_id = 0
	
	const timer = writable(0)
	
	const filteredJadwal = derived([jadwal,timer],([$jadwal,$timer])=>{
		return $jadwal.filter((e)=>{
			const [hari] = e.jadwal1.split(',')
			return hariMap[getDate().d] == hari
		})
			.sort((e)=>e.dadakan ? -1 : 1)
			.filter((_,i)=> i <= 2 )
			.map((e,i)=>{
				if (!e.status) { return e }
				
				const { h: openHour, m: openMin, s: openSec } = getDate(e.stamp)
				const { h: currentHour, m: currentMin, s: currentSec} = getDate()
				
				const roundSec = openSec - currentSec
				const roundMin = (openMin + (e.len ?? 3)) - currentMin
				const rounded = roundMin * 60 + roundSec + ((openHour - currentHour) * 3600)
				
				const displaySec = rounded % 60
				const displayMin = Math.floor(rounded / 60)
				
				data[i].time = rounded
				
				data[i].counter = `${displayMin < 10 ? '0' : ''}${displayMin}:${displaySec < 10 ? '0' : ''}${displaySec}`;
				
				return e
			})
	})
	
	async function onSuccessCallback() {
		const { h, m, d } = getDate()
		const hour = `${h < 10 ? '0' : ''}${h}`
		const minute: string = `${m < 10 ? '0' : ''}${m}`
		let waktu = `${hariMap[d]},${hour}.${minute}`
		await client.from('presensi')
			.insert([
				{ mhs: $state.user.nama, jadwal_id: current_jadwal_id, waktu, status: 1 }
			])
		await validateData()
	}
	
	onMount(()=>{ setInterval(()=>$timer += 1, 1000) })
	
	// Face app
	const absenCallback = (jadwal: number) => () => {
		current_jadwal_id = jadwal
		showCamera = true
	}
	
</script>

{#if showCamera}
	<Camera {onSuccessCallback} close={()=>showCamera=false} />
{/if}

<main>
	<h1>Presensi Mahasiswa</h1>
	<h1 class="pt">Presensi Yang akan ditutup</h1>
	<h1 id="dates">{getUiTime()}</h1>
		
	<div class="insights">
		{#each $filteredJadwal as { dosen, matkul, ruang, status, jadwal1, id }, i (i)}
		<div class="dosen">
			<span class="material-symbols-outlined">menu_book</span>
			<div class="middle">
				<div class="left">
					<h3>{matkul.nama}</h3>
					<h1>{dosen.nama}</h1>
				</div>
				<div class="progress">
					
					{#if Boolean($userPresensi.find(e=>e.jadwal.id == id))}
					<h2>Anda Telah Presensi</h2>
					
					{:else if status && data[i].time > 0}
					
					<h1 id="countdown" class="countdown">{data[i].counter}</h1>
					<button class="btn-absen" on:click={absenCallback(id)}>Presensi</button>
					
					{:else}
						<h2 style="z-index: -1000;">Presensi Di tutup</h2>
					{/if}
					
				</div>
			</div>
			<small><div class="text-muted">Ruang {ruang}, {jadwal1.split(',')[1]}</div></small>
			<small class="text-muted">Pertemuan 1</small>
		</div>
		{/each}
	</div>
	<!-- AKHIRAN INSIGHTS -->

		<div class="recent">
				<h2>Jadwal yang akan datang</h2>
				<table>
						<thead>
								<tr>
									<th>No.</th>
									<th>Mata Kuliah</th>
									<th>RUANGAN</th>
									<th>Kelompok</th>
									<th>HARI</th>
									<th>JAM</th>
								</tr>
						</thead>
						<tbody>
							{#each $filteredJadwal as { matkul, jadwal1, ruang }, i}
							{@const [hari, jam] = jadwal1.split(',')}
							<tr>
									<td>{i+1}.</td>
									<td>{matkul.nama}</td>
									<td>{ruang}</td>
									<td>{$state.user.kelompok}</td>
									<td>{hari}</td>
									<td class="success">{jam}</td>
							</tr>
							{:else}
								<td colspan="6" style="text-align:center">Hari ini tidak ada absen</td>
							{/each}
						</tbody>
				</table>
				<a style="margin-top: 6rem" href="/mhs/jadwal" on:click={()=>$active="/mhs/jadwal"}>Lihat Semua</a>
				<!-- <h2>Hari ini tidak ada absen</h2> -->
		</div>
</main>
<!-- Akhiran Main -->
