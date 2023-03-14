<script lang=ts>
	import { state, jadwal } from "$lib/state";
	
	let mergeJadwal: { [key: string]: {matkul: any,jadwal:string[]} } = {}
	
	$jadwal.forEach(e=>{
		if (!mergeJadwal[e.matkul.nama]){
			mergeJadwal[e.matkul.nama] = { matkul: e.matkul, jadwal: [] }
		}
		mergeJadwal[e.matkul.nama].jadwal.push(e.jadwal1.replace(',',' '))
	})
	
</script>

<main>
	<h1>Presensi Mahasiswa</h1>
	<div class="recent">
			<h2>Mata Kuliah</h2>
			<table>
					<thead>
							<tr>
									<th>NO.</th>
									<th>Mata Kuliah</th>
									<th>SKS</th>
									<th>Kelompok</th>
									<th>JAM 1</th>
									<th>JAM 2</th>
							</tr>
					</thead>
					<tbody>
						{#each Object.entries(mergeJadwal) as [,{matkul, jadwal}], i}
						<tr>
								<td>{i+1}.</td>
								<td>{matkul.nama}</td>
								<td>{matkul.sks}</td>
								<td>{$state.user.kelompok}</td>
								<td class="success">{ jadwal[0] }</td>
								<td class="danger">{ jadwal[1] ?? '-' }</td>
						</tr>
						{/each}
					</tbody>
			</table>
	</div>
</main>