<script lang=ts>
	import { adminInfo, client, fetchAdminInfo } from "$lib/state";
	import Popup from "$lib/Popup.svelte"
  import type { User } from "$lib/types"
	
	$: dosen = $adminInfo.mhs.filter(e=>e.type=='dosen')
	$: availableFilter = dosen.map(e=>e.keterangan)
	
	let filter = ''
	let search = ''
	
	$: filteredDosen = dosen.filter(e=>{
		if (filter=='') { return true }
		return e.keterangan == filter
	})
		.filter(e=>{
			if (search == '') { return true }
			return e.nama.toLowerCase().startsWith(search.toLowerCase())
		})
	

	// SUBMISSION
	let addShow = () => {}
	let addClose = () => {}
	
	let editId = $adminInfo.mhs.find(e=>e.type=='mhs') ?? {}
	let editShow = () => {}
	let editClose = () => {}
	
	let delId = $adminInfo.mhs.find(e=>e.type=='mhs') ?? {}
	let delShow = () => {}
	let delClose = () => {}
	
	// let msg = ''
	// let load = false
	// let [nom,nam,mat] = ['','','']
	// const submission = async () => {
	// 	load = true
		
	// 	const { data, error } = await client.from('mhs').insert([ { nim: nom, nama: nam, type: 'dosen', keterangan: mat } ])
	// 	console.log(data,error)
		
	// 	// MAIN
	// 	if (error){
	// 		if (error.code == '23505'){ msg = 'NIM Tidak tersedia' }
	// 		msg = error.details	
	// 	} else { adminInfo.set(await fetchAdminInfo()) }
	// 	load = false
	// 	close(true)
	// }
	
	// // DELETION
	// let delShow,delClose,delId = ''
	// let delAction = async ()=> {
	// 	load = true
	// 	const { data, error } = await client.from('mhs').delete().eq('nim', delId)
	// 	// MAIN
	// 	if (error) { msg = error.details	} else { adminInfo.set(await fetchAdminInfo()) }
	// 	load = false
	// 	delClose(true)
	// }
	
	
	// // EDITION
	
	// let edId: User = {} as any
	// let edAction = async ()=> {
	// 	load = true
	// 	const { data, error } = await client.from('mhs')
	// 		.update({ nama: edId.nama, keterangan: edId.keterangan })
	// 		.eq('nim', edId.nim)
	// 	// MAIN
	// 	if (error) { msg = error.details	} else { adminInfo.set(await fetchAdminInfo()) }
	// 	load = false
	// 	edClose(true)
	// }
	
</script>

<!-- <Popup bind:prevent={load} bind:show submit={submission} bind:hide={close}>
	<div class="form-down">
		<input disabled={load} required type="text" bind:value={nom} class="za-form" placeholder="Nomor Dosen">
		<input disabled={load} required type="text" bind:value={nam} class="za-form" placeholder="Nama">
		<input disabled={load} required type="text" bind:value={mat} class="za-form" placeholder="Matkul">
		<div>
			<input disabled={load} type="submit" id="" class="za-form" value="Tambahkan">
			<span style:color={"red"}>{msg}</span>
		</div>
	</div>
</Popup>
<Popup bind:prevent={load} bind:show={delShow} bind:hide={delClose}>
	<div class="form-down">
		<h1>Hapus Akun ?</h1>
		<div>
			<button disabled={load} on:click={delAction}>Ya</button>
			<button disabled={load} on:click={delClose}>Tidak</button>
		</div>
	</div>
</Popup>
<Popup bind:prevent={load} bind:show={edShow} submit={edAction} bind:hide={edClose}>
	<div class="form-down">
		<input disabled={load} required type="text" bind:value={edId.nama} class="za-form" placeholder="Nama">
		<input disabled={load} required type="text" bind:value={edId.keterangan} class="za-form" placeholder="Matkul">
		<div>
			<input disabled={load} type="submit" id="" class="za-form" value="Edit">
			<span style:color={"red"}>{msg}</span>
		</div>
	</div>
</Popup> -->



<main>
	<h1>Daftar Dosen</h1>
	<div class="recent">
			<h2>Program Studi</h2>
			<div class="selected">
					<select name="class" id="class" bind:value={filter}>
						<option value="">Pilih Program Studi</option>
						{#each availableFilter as f}
						<option>{f}</option>
						{/each}
					</select>
			</div><br><br>
			<button class="btn-download" on:click={addShow}><span class="material-symbols-outlined">add</span></button><br><br>
			<div class="containers">
					<div class="search-box">
							<div class="search-icon"><i class="fas fa-search"></i></div>
							<div class="search-input" style={search == '' ? '' : 'width: 230px;margin-left: 8px;'}>
									<input type="text" class="input" placeholder="Cari..." bind:value={search}>
							</div>
					</div>
			</div>
			<table>
					<thead>
							<tr>
									<th>NO.</th>
									<th>Foto</th>
									<th>NAMA</th>
									<th>Matkul</th>
									<th>AKSI</th>
							</tr>
					</thead>
					<tbody>
						{#each filteredDosen as d, i}
						<tr>
								<td>{i+1}.</td>
								<td><img src="/img/admin.png" alt="" style="width: 70px;"></td>
								<td>{d.nama}</td>
								<td>{d.keterangan}</td>
								<td>
									<button on:click={()=>{editId = d;editShow()}}><span class="material-symbols-outlined">edit</span></button>
									<button on:click={()=>{delId = d;delShow();}}><span class="material-symbols-outlined">delete</span></button>
								</td>
						</tr>
						{/each}
					</tbody>
			</table>
	</div>
</main>
<!-- Akhiran Main -->