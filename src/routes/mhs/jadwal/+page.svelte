<script lang=ts>
  import { getDate } from "$lib/lib";
  import { jadwal } from "$lib/state";
	
	let filteredJadwal = $jadwal.filter(e=>{
		const [hari] = e.jadwal1.split(',')
		return getDate().hari == hari
	})

</script>
<main>
	<h1>Presensi Mahasiswa</h1>
	<div class="recent">
			<h2>Jadwal yang akan datang</h2>
			<table>
					<thead>
							<tr>
									<th>NO.</th>
									<th>Mata Kuliah</th>
									<th>RUANGAN</th>
									<th>Kelompok</th>
									<th>HARI</th>
									<th>JAM</th>
							</tr>
					</thead>
					<tbody>
						{#each filteredJadwal as { matkul, jadwal1, ruang }, i}
						{@const [hari, jam] = jadwal1.split(',')}
						<tr>
							<td>{i+1}.</td>
							<td>{matkul.nama}</td>
							<td>{ruang}</td>
							<td>A11-4113</td>
							<td>{hari}</td>
							<td class="success">{jam}</td>
						</tr>
						{:else}
							<td colspan="6" style="text-align:center">Hari ini tidak ada absen</td>
						{/each}
					</tbody>
			</table>
	</div>
</main>