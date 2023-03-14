<script lang=ts>
	import { flatten, hariMap } from "$lib/lib";
  import { dosenInfo, state } from "$lib/state";
	
	
	async function getCsv() {
		const link = document.createElement('a')
		link.href = '/api'
		link.setAttribute('download','')
		link.click()
		// fetch('/api').then(e=>e.text()).then(console.log)
	}
	
	let filter = ''
	
	const filteredPresensi = $dosenInfo.presensi.filter(e=>(e.jadwal.dosen as any as string) == $state.user.nama)
		.filter(e=>e.waktu.split(',')[0] == hariMap[(new Date()).getDay()])
		.filter(e=>filter == '' ? true : e.mhs.kelompok == filter)
	
	let mhses = flatten(filteredPresensi,e=>e.mhs.nama).map(e=>{return{kelompok:'',nim:'',nama: e,hadir:0,izin:0,sakit:0}})
		
	filteredPresensi.map((e,_,arr)=>{
		const mhs = mhses.find(mhs=>mhs.nama==e.mhs.nama) ?? {} as any
		mhs.nim = e.mhs.nim
		mhs.kelompok = e.mhs.kelompok
		if (e.status == 1){
			mhs.hadir++
		}else if (e.status == 2){
			mhs.izin++
		}else if (e.status == 3){
			mhs.sakit++
		}
		
		return mhs
	})
	let availableFilter = flatten($dosenInfo.mhs.map(e=>e.kelompok),e=>e)
	
</script>



<main>
	<h1>Dashboard Dosen</h1>
	<h1 class="pt">Laporan Presensi</h1>
	<div class="recent">
			<h1>Dasar Pemrograman</h1>
			<h2>Laporan</h2>
			<div class="selected">
					<select name="class" id="class" bind:value={filter}>
						<option value="">Pilih Kelas</option>
						{#each availableFilter as f}
						<option>{f}</option>
						{/each}
					</select>
			</div>
			<br>
			<button class="btn-download" on:click={getCsv}><img style="width: 80px; display: flex; justify-content: center;" alt="" src="/img/excel.png"></button>
			<br><br>
			<h1>Kelas {filter}</h1>
			<br>
			<div class="containers">
			<table>
					<thead>
							<tr>
									<th>NO.</th>
									<th>Nama</th>
									<th>NIM</th>
									<th>Kelompok</th>
									<th>Masuk</th>
									<th>Izin</th>
									<th>Sakit</th>
							</tr>
					</thead>
					<tbody>
						{#each mhses as mhs, i}
						<tr>
								<td>{i+1}.</td>
								<td>{mhs.nama}</td>
								<td>{mhs.nim}</td>
								<td>{mhs.kelompok}</td>
								<td class="primary">{mhs.hadir} Kali</td>
								<td class="primary">{mhs.izin} Kali</td>
								<td class="primary">{mhs.sakit} Kali</td>
						</tr>
						{/each}
					</tbody>
			</table>
			</div>
	</div>
</main>

<!-- Akhiran Main -->