
<script lang=ts>
  import { onMount } from "svelte";
	import { hariMap } from "$lib/lib";
  import { client, userPresensi, jadwal, state, validateData } from "$lib/state";
	import { getDate } from "$lib/utility";
	import { derived, writable } from "svelte/store";
	
	
	
	const def = { min: 0, sec: '0', time: 0, counter: '', isHide: false }
	let data = [Object.create(def),Object.create(def),def]
	
	let current_jadwal_id = 0
	let current_status = 0
	
	const timer = writable(0)
	
	const filteredJadwal = derived([jadwal,timer],([$jadwal,$timer])=>{
		return $jadwal.filter((e,i)=>{
			const [hari] = e.jadwal1.split(',')
			return hariMap[getDate().d] == hari
		})
			.sort((e)=>e.dadakan ? -1 : 1)
			.filter((_,i)=> i <= 2 )
			.map((e,i)=>{
				if (!e.status) { return e }
				
				const { h: openHour, m: openMin, s: openSec } = getDate(e.stamp)
				const { h: currentHour, m: currentMin, s: currentSec} = getDate()
				
				const counterSec = Math.abs(openSec - currentSec)
				const counterMin = ( openMin + (e.len ?? 3) ) - currentMin - (openSec < currentSec ? 1 : 0 )
				
				data[i].counter = `${counterMin < 10 ? '0' : ''}${counterMin}:${counterSec < 10 ? '0' : ''}${counterSec}`;
				
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
	const presensi = (jadwal: number, status: number) => () => {
		return () => {
			current_jadwal_id = jadwal
			current_status = status
			onSuccessCallback()
		}
	}
	
</script>


<main>
	<h1>PRESENSI Mahasiswa</h1>
	<div class="recent">
			<h2>INPUT IZIN</h2>
			<table>
					<thead>
							<tr>
									<th>Mata Kuliah</th>
									<th>HARI</th>
									<th>JAM</th>
									<th>IZIN</th>
							</tr>
					</thead>
					<tbody>
						{#each $filteredJadwal as { id, matkul, jadwal1, status},i}
						{@const [hari,jam] = jadwal1.split(',')}
						<tr>
								<td>{matkul.nama}</td>
								<td>{hari}</td>
								<td class="success">{jam}</td>
								{#if status && data[i].time > 0}
								<td><button on:click={presensi(id,3)}>SAKIT</button><button on:click={presensi(id,2)}>IZIN</button></td>
								{:else if $userPresensi.find(e=>e.jadwal.id == id)}
								<td>
									<div>Anda Telah Presensi</div>
								</td>
								{:else}
								<td> </td>
								{/if}
									
						</tr>
						{:else}
							<td colspan="6" style="text-align:center">Hari ini tidak ada absen</td>
						{/each}
					</tbody>
			</table>
	</div>
</main>