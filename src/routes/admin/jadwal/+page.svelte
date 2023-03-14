<script lang=ts>
  import { flatten, hariMap } from "$lib/lib";
  import Popup from "$lib/Popup.svelte";
	import { adminInfo, client, fetchAdminInfo, validateData } from "$lib/state";
  import type { User } from "$lib/types";
	
	async function onAdd() {
		const dataJadwal = [data.jadwal1]
		if (data.jadwal2.hari != '' || data.jadwal2.ruang != '' || data.jadwal2.time1 != '' || data.jadwal2.time2 != ''){
			dataJadwal.push(data.jadwal2)
		}
		
		load = true
		const { data: supaData, error } = await client.from('jadwal')
			.insert(
				dataJadwal.map(e=>{return {
					dosen: data.dosen, kelompok: data.kelompok, matkul1: data.matkul.toString(), ruang: e.ruang,
					jadwal1: `${e.hari},${e.time1.replaceAll(':','.')}-${e.time2.replaceAll(':','.')}`
				}})
			)
		console.log(supaData,error)
		
		// MAIN
		if (error){
			msg = error.details;
			load = false
			return
		} else { await validateData() }
		load = false
		hidePopup()
	}
	async function onDelete(){
		load = true
		const { data: supaData, error } = await client.from('mhs').delete()//.eq('nim', data.nim);
		console.log(supaData,error)
		
		// MAIN
		if (error){ msg = error.details;load = false;return	} else { await validateData() }
		load = false
		hidePopup()
	}
	async function onEdit() {
		load = true
		const { data: supaData, error } = await client.from('jadwal')
			.update([ { kelompok: data.kelompok } ])
			// .eq('nim', data.nim);
		console.log(supaData,error)
		
		// MAIN
		if (error){ msg = error.details;load = false;return	} else { await validateData() }
		load = false
		hidePopup()
	}
	function openDelete(e: string) {
		return () => {
			actionType = 'delete'
			submitAction = onDelete
			showPopup()
		}
	}
	function openAdd() {
		data.jadwal1.ruang = data.jadwal2.ruang = data.jadwal1.time1 = 
		data.jadwal2.time1 = data.jadwal1.time2 = data.jadwal2.time2 =
		data.jadwal1.hari = data.jadwal2.hari = data.kelompok = data.matkul = 
		data.dosen = data.prodi = '';
		data=data
		actionType = 'add'
		submitAction = onAdd
		msg = ''
		showPopup()
	}
	function openEdit(e: User) {
		return () => {
			data.kelompok = e.kelompok
			data.prodi = 'Teknik Informatika'
			data=data
			actionType = 'edit'
			submitAction = onEdit
			msg = ''
			showPopup()
		}
	}
	let submitAction = onAdd
	
	let actionType: 'edit'|'add'|'delete' = 'add'
	let hidePopup = () => {}
	let showPopup = () => {}
	let load = false
	let msg = ''
	let data = {
		kelompok:'',
		prodi:'',
		matkul:'',
		dosen:'',
		jadwal1: {
			hari: '',
			time1: '',
			time2: '',
			ruang: ''
		},
		jadwal2: {
			hari: '',
			time1: '',
			time2: '',
			ruang: ''
		}
	}
	// POPUP=======================================================================
	
	let mergeJadwal:any = {}
	
	$adminInfo?.jadwal.forEach(e=>{
		let id = `${e.dosen}${e.kelompok}`
		
		if (!mergeJadwal[id]){
			mergeJadwal[id] = { kelompok: '', matkul: { nama: '' }, jadwal1: e.jadwal1, jadwal2: null }
		} else {
			mergeJadwal[id].jadwal2 = e.jadwal1
		}
		mergeJadwal[id].kelompok = e.kelompok
		mergeJadwal[id].matkul.nama = e.matkul.nama
	})
	
	let parsed: any[] = Object.values(mergeJadwal)
	let search = ''
	
	let kelompok = flatten($adminInfo.mhs.filter(e=>e.kelompok!=null).map(e=>e.kelompok),e=>e)
	let matkul = Object.values(Object.fromEntries($adminInfo.jadwal.map(e=>[e.matkul.id,e.matkul])))
	let dosen = $adminInfo.mhs.filter(e=>e.type=='dosen')
	
	let mergeMatkul = {} as any
	$adminInfo.jadwal.forEach(e=>{
		mergeMatkul[e.matkul.nama] = true
	})
	
	let filterKelompok = ''
	let filterMatkul = ''
	
	$:result = parsed.filter(e=>{
			if (filterKelompok == '') return true
			else return e.kelompok==filterKelompok
		}).filter(e=>{
			if (filterMatkul == '') return true
			else return e.matkul.nama==filterMatkul
		}).filter(e=>{
			if (search == '') return true
			else return e.matkul.nama.toLowerCase().startsWith(search.toLowerCase())
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
		<select disabled={load} name="kelompok" id="" class="za-form" required bind:value={data.kelompok}>
			<option value="">Pilih Kelompok</option>
			{#each kelompok as f}
				<option>{f}</option>
			{/each}
		</select>
		<select disabled={load} name="prodi" id="" class="za-form" required>
			<option value="">Pilih Prodi</option>
			<option>Teknik Informatika</option>
		</select>
		<select disabled={load} name="matkul" id="" class="za-form" required bind:value={data.matkul}>
			<option value="">Pilih Matkul</option>
			{#each matkul as m}
			<option value={m.id}>{m.nama}</option>
			{/each}
		</select>
		<select disabled={load} name="dosen" id="" class="za-form" required bind:value={data.dosen}>
			<option value="">Pilih Dosen</option>
			{#each dosen as m}
			<option>{m.nama}</option>
			{/each}
		</select>
		
		<div style="display: grid;grid-template-columns: 1fr 1fr;">
			<div style="padding: 1rem;" class="form-down">
				<div>Jadwal 1</div>
				<select disabled={load} name="hari" id="" class="za-form" required bind:value={data.jadwal1.hari}>
					<option value="">Pilih Hari</option>
					{#each hariMap as m}
					<option>{m}</option>
					{/each}
				</select>
				<label for="time1">Dari Jam:</label>
				<input type="time" name="time1" bind:value={data.jadwal1.time1} required class="za-form">
				<label for="time2">Sampai Jam:</label>
				<input type="time" name="time2" bind:value={data.jadwal1.time2} required class="za-form">
				<input type="text" name="ruang" class="za-form" bind:value={data.jadwal1.ruang} placeholder="ruang" required>
			</div>
			
			
			<div style="padding: 1rem;" class="form-down">
				<div>Jadwal 2</div>
				<select disabled={load} name="hari" id="" class="za-form" bind:value={data.jadwal2.hari}>
					<option value="">Pilih Hari</option>
					{#each hariMap as m}
					<option>{m}</option>
					{/each}
				</select>
				<label for="time1">Dari Jam:</label>
				<input type="time" name="time1" bind:value={data.jadwal2.time1} class="za-form">
				<label for="time2">Sampai Jam:</label>
				<input type="time" name="time2" bind:value={data.jadwal2.time2} class="za-form">
				<input type="text" name="ruang" class="za-form" bind:value={data.jadwal2.ruang} placeholder="ruang">
			</div>
		</div>
		
		
		
		<div>
			<input disabled={load} type="submit" id="" class="za-form" value="Tambahkan">
			<span style:color={"red"}>{msg}</span>
		</div>
		{/if}
	</div>
</Popup>

<main>
	<h1>Daftar Jadwal</h1>
	<div class="recent">
			<h2>Kelompok</h2>
			 <div class="selected">
					<select name="class" id="class" bind:value={filterKelompok}>
						<option value="">Pilih Kelas</option>
						{#each kelompok as k}
						<option>{k}</option>
						{/each}
					</select>
			</div><br>
			<div class="selected">
					<select name="class" id="class">
						<option value="">Pilih Program Studi</option>
						<option value="ti">Teknik Informatika</option>
					</select>
			</div><br>
			<div class="selected">
					<select name="class" id="class" bind:value={filterMatkul}>
						<option value="">Pilih Mata Kuliah</option>
						{#each Object.keys(mergeMatkul) as m}
						<option>{m}</option>
						{/each}
					</select>
			</div><br><button class="btn-download" on:click={openAdd}><span class="material-symbols-outlined">add</span></button><br><br>
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
							<th>Kelompok</th>
							<th>Prodi</th>
							<th>Matkul</th>
							<th>JAM 1</th>
							<th>JAM 2</th>
							<th>AKSI</th>
						</tr>
					</thead>
					<tbody>
						{#each result as { kelompok, matkul: { nama }, jadwal1, jadwal2 }, i}
							<tr>
								<td>{i+1}.</td>
								<td>{kelompok}</td>
								<td>Teknik Informatika</td>
								<td>{nama}</td>
								<td class="success">{jadwal1.split(',')[1]}</td>
								<td class="danger">{jadwal2?.split(',')[1] ?? '-'}</td>
								<td><button><span class="material-symbols-outlined">edit</span></button><button><span class="material-symbols-outlined">delete</span></button></td>
							</tr>
						{/each}
					</tbody>
			</table>
	</div>
</main>
<!-- Akhiran Main -->