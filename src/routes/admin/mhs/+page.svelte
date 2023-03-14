
<script lang=ts>
  import { flatten } from "$lib/lib";
	import Popup from "$lib/Popup.svelte"
	import { adminInfo, fetchAdminInfo, client, validateData } from "$lib/state"
	import { getImgLink } from "$lib/utility";
  import type { User } from "$lib/types";
	
	function imgErr(e: any) {
		if (e.currentTarget.src != '/img/admin.png')
			e.currentTarget.src = '/img/admin.png'
	}
	async function onAdd() {
		load = true
		const { data: supaData, error } = await client.from('mhs').insert([ { nim: data.nim, nama: data.nama, type: 'mhs', keterangan: data.ta, kelompok: data.kelompok } ])
		console.log(supaData,error)
		
		// MAIN
		if (error){
			msg = error.code === '23505' ? 'NIM Tidak tersedia' : error.details;
			load = false
			return
		} else { await validateData() }
		load = false
		hidePopup()
	}
	async function onDelete(){
		load = true
		const { data: supaData, error } = await client.from('mhs').delete().eq('nim', data.nim);
		console.log(supaData,error)
		
		// MAIN
		if (error){ msg = error.details;load = false;return	} else { await validateData() }
		load = false
		hidePopup()
	}
	async function onEdit() {
		load = true
		const { data: supaData, error } = await client.from('mhs')
			.update([ { nama: data.nama, keterangan: data.ta, kelompok: data.kelompok } ])
			.eq('nim', data.nim);
		console.log(supaData,error)
		
		// MAIN
		if (error){ msg = error.details;load = false;return	} else { await validateData() }
		load = false
		hidePopup()
	}
	function openDelete(e: string) {
		return () => {
			data.nim = e
			actionType = 'delete'
			submitAction = onDelete
			showPopup()
		}
	}
	function openAdd() {
		data.nama = 
		data.nim = 
		data.ta = '';
		data.kelompok = 'Pilih Kelompok';
		data.prodi = 'Pilih Prodi';
		data=data
		actionType = 'add'
		submitAction = onAdd
		msg = ''
		showPopup()
	}
	function openEdit(e: User) {
		return () => {
			data.kelompok = e.kelompok
			data.nama = e.nama
			data.nim = e.nim
			data.prodi = 'Teknik Informatika'
			data.ta = e.keterangan
			data=data
			actionType = 'edit'
			submitAction = onEdit
			msg = ''
			showPopup()
		}
	}
	let submitAction = onAdd
	
	let actionType: 'edit'|'add'|'delete' = 'add'
	let hidePopup: () => {}
	let showPopup: () => {}
	let load = false
	let msg = ''
	let data = {
		nim:'',
		nama:'',
		kelompok:'Pilih Kelompok',
		prodi:'Pilih Prodi',
		ta:''
	}
	
	
	// ==================================================================
	let search = ''
	
	$: mhs = $adminInfo.mhs.filter(e=>e.type=='mhs')
	$: availableFilter1 = flatten(mhs.map(e=>e.kelompok),e=>e)
	
	let filter1 = ''
	let popup: HTMLDivElement
	
	$: res = mhs.filter(e=>{
		if (filter1 == '') { return true }
		return e.kelompok==filter1
	})
	.filter(e=>{
		if (search == '') {return true}
		return e.nama.toLowerCase().startsWith(search.toLowerCase())
	})
</script>

<Popup bind:show={showPopup} bind:hide={hidePopup} bind:prevent={load} submit={submitAction}>
	<div class="form-down">
		{#if actionType == 'delete'}
		<div>
			<h1>Hapus Akun ?</h1>
			<div>
				<button disabled={load} on:click|preventDefault={onDelete}>Ya</button>
				<button disabled={load} on:click|preventDefault={hidePopup}>Tidak</button>
			</div>
		</div>
		{:else}
		<input disabled={load||actionType=='edit'} type="text" class="za-form" placeholder="NIM" bind:value={data.nim}>
		<input disabled={load} type="text" class="za-form" placeholder="Nama" bind:value={data.nama}>
		<select disabled={load} name="kelompok" id="" class="za-form" required bind:value={data.kelompok}>
			<option>Pilih Kelompok</option>
			{#each availableFilter1 as f}
				<option>{f}</option>
			{/each}
		</select>
		<select disabled={load} name="prodi" id="" class="za-form" required>
			<option>Pilih Prodi</option>
			<option>Teknik Informatika</option>
		</select>
		<input disabled={load} type="text" class="za-form" placeholder="Tahun Ajaran" bind:value={data.ta}>
		<div>
			<input disabled={load} type="submit" id="" class="za-form" value="Tambahkan">
			<span style:color={"red"}>{msg}</span>
		</div>
		{/if}
	</div>
</Popup>


<main>
	<h1>Daftar Mahasiswa</h1>
	<div class="recent">
			<h2>Kelas</h2>
			 <div class="selected">
					<select name="class" id="class" bind:value={filter1}>
						<option value="">Pilih Kelas</option>
						{#each availableFilter1 as f}
						<option>{f}</option>
						{/each}
					</select>
			</div><br>
			<div class="selected">
					<select name="class" id="class">
						<option>Pilih Program Studi</option>
						<option>Teknik Informatika</option>
					</select>
			</div><br>
			<button class="btn-download" on:click={openAdd}>
				<span class="material-symbols-outlined">add</span>
			</button>
			<br><br>
			<div class="containers">
					<div class="search-box" >
							<div class="search-icon"><i class="fas fa-search"></i></div>
							<div class="search-input" style={search == '' ? '' : 'width: 230px;margin-left: 8px;'}>
								<input type="text" bind:value={search} class="input" placeholder="Cari...">
							</div>
					</div>
			</div>
			<table>
					<thead>
							<tr>
									<th>NO.</th>
									<th>Foto</th>
									<th>NAMA</th>
									<th>NIM</th>
									<th>Kelompok</th>
									<th>Angkatan</th>
									<th>AKSI</th>
							</tr>
					</thead>
					<tbody>
						{#each res as r,i}
						<tr>
								<td>{i+1}.</td>
								<td><img src={getImgLink(r.nama)  ?? '/img/admin.png'} on:error={imgErr} style="width: 70px;" alt=""></td>
								<td>{r.nama}</td>
								<td>{r.nim}</td>
								<td>{r.kelompok}</td>
								<td>{r.keterangan}</td>
								<td>
									<button on:click={openEdit(r)}><span class="material-symbols-outlined">edit</span></button>
									<button on:click={openDelete(r.nim)}><span class="material-symbols-outlined">delete</span></button>
								</td>
						</tr>
						{/each}
					</tbody>
			</table>
	</div>
</main>
<!-- Akhiran Main -->


<!-- svelte-ignore a11y-click-events-have-key-events -->
<div id="popup" class="popup" style="max-height: 100vh" bind:this={popup}>
	<div class="popup-content">
		<form style="display: flex;flex-direction: column;">
			<span id="close" class="close" style="text-align:right;" on:click={()=>popup.style.display = "none"}>&times;</span>
			<input type="text" name="nama" placeholder="Nama..." class="common" autocomplete="off" required>
			<input type="text" name="nim" placeholder="NIM..." class="common" autocomplete="off" required>
			
			<select name="kelompok" id="" class="common" required>
				<option value="">Pilih Kelompok</option>
				<option value="">dummy</option>
				<option value="">dummy</option>
				<option value="">dummy</option>
			</select>
			<select name="prodi" id="" class="common" required>
				<option value="">Pilih Prodi</option>
				<option value="">dummy</option>
				<option value="">dummy</option>
				<option value="">dummy</option>
			</select>
			<input type="text" name="keterangan" placeholder="cth: tahun ajaran" class="common" autocomplete="off" required>
			
			<div style="text-align:right;">
				<button style="right:0"><span class="material-symbols-outlined">add</span></button>
			</div>
			
		</form>
	</div>
</div>
