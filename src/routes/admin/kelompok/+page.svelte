<!-- <script lang=ts>
  import { flatten } from "$lib/lib";
	import { adminInfo } from "$lib/state";
	
	let kel = flatten($adminInfo.mhs.filter(e=>e.type=='mhs').map(e=>e.kelompok),e=>e)
	
</script> -->

<!-- <main>
	<h1>Daftar Kelompok</h1>


	<div class="recent">
			<h2>Kelompok</h2>

			<br>

			<div class="selected">
					<select name="class" id="class">
						<option>Pilih Program Studi</option>
						<option value="ti">Teknik Informatika</option>
					</select>
			</div>

			<br>

			<button class="btn-download"><span class="material-symbols-outlined">add</span></button>
			
			<br><br>

			<div class="containers">
					<div class="search-box">
							<div class="search-icon">
									<i class="fas fa-search"></i>
							</div>
							<div class="search-input">
									<input type="text" class="input" placeholder="Cari...">
							</div>
					</div>
			</div>

			<table>
					<thead>
							<tr>
									<th>NO.</th>
									<th>Kelompok</th>
									<th>Program Studi</th>
									<th>AKSI</th>
							</tr>
					</thead>
					<tbody>
						{#each kel as k,i}
						<tr>
								<td>{i+1}.</td>
								<td>{k}</td>
								<td>Teknik Informatika</td>
								<td><button><span class="material-symbols-outlined">edit</span></button><button><span class="material-symbols-outlined">delete</span></button></td>
						</tr>
						{/each}
					</tbody>
			</table>
	</div>
</main> -->
<!-- Akhiran Main -->