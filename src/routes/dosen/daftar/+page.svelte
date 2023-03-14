
<script lang=ts>
	import { flatten, getUiTime, hariMap } from "$lib/lib";
  import { dosenInfo, state } from "$lib/state";
	
	$: filteredPresensi = $dosenInfo.presensi.filter(e=>(e.jadwal.dosen as any as string) == $state.user.nama)
		.filter(e=>e.waktu.split(',')[0] == hariMap[(new Date()).getDay()])
		.filter(e=>filter == '' ? true : e.mhs.kelompok == filter)
	
	let availableFilter = flatten($dosenInfo.mhs.map(e=>e.kelompok),e=>e)
	let filter = ''
</script>

<main>
	<h1>Dashboard Dosen</h1>

	<h1 class="pt">Daftar Presensi</h1>
	<h1 id="dates">{getUiTime()}</h1>
	
	<div class="recent">
			<h2>Siswa Izin Hari Ini</h2>
			<div class="selected">
					<select name="class" id="class" bind:value={filter}>
						<option value="">Pilih Kelas</option>
						{#each availableFilter as f}
							<option>{f}</option>
						{/each}
					</select>
			</div>
			<br>
			<table>
					<thead>
							<tr>
									<th>NO.</th>
									<th>Nama</th>
									<th>Kelompok</th>
									<th>Keterangan</th>
							</tr>
					</thead>
					<tbody>
						{#each filteredPresensi as a}
						<tr>
								<td>3.</td>
								<td>{a.mhs.nama}</td>
								<td>{a.mhs.kelompok}</td>
								<td class="primary">{a.status == 1 ? 'HADIR' : a.status == 2 ? 'IZIN' : 'SAKIT'}</td>
						</tr>
						{/each}
						
					</tbody>
			</table>
	</div>

</main>
<!-- Akhiran Main -->