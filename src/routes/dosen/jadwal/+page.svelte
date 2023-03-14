<script lang=ts>
  import { getDate } from "$lib/lib"
  import { jadwal } from "$lib/state";
	
	let filteredJadwal = $jadwal.filter(e=>{
		const [hari] = e.jadwal1.split(',')
		return getDate().hari == hari
	})
	
	
	import type { Snapshot } from './$types';
	
	let semua = false
  export const snapshot: Snapshot = {
    capture: () => semua,
    restore: (value) => semua = value
  };
	
</script>

<main>
	<h1>Dashboard Dosen</h1>
	<div class="recent">
			<h2>Jadwal Mengajar yang akan datang</h2>
			<input type="button" value="{semua ? 'Semua' : 'Hari ini'}" on:click={()=>semua=!semua} style="
				padding: .6rem 1rem;
				margin-bottom: .5rem;
				border-radius: 10px;
				border: 2px solid var(--color-primary);
				color: {semua ? 'white':'var(--color-primary)'};
				{semua ? 'background-color: var(--color-primary)': 'background-color: var(--color-white)'};
				transition: background-color .3s;
				cursor: pointer;
			">
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
						{#each semua ? $jadwal : filteredJadwal as { matkul, ruang, kelompok, jadwal1  }, i}
						{@const [hari,jam] = jadwal1.split(',')}
						<tr>
								<td>{i+1}.</td>
								<td>{matkul.nama}</td>
								<td>{ruang}</td>
								<td>{kelompok}</td>
								<td>{hari}</td>
								<td class="success">{jam}</td>
						</tr>
						{:else}
						<td colspan="6" style="text-align:center">Hari ini tidak ada jadwal mengajar</td>
						{/each}
					</tbody>
			</table>
	</div>
</main>
<!-- Akhiran Main -->