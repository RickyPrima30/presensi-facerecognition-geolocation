

<script lang=ts>
  import { flatten, hariMap } from "$lib/lib"
  import { client, dosenInfo, fetchDosenJadwal, jadwal, state, validateData } from "$lib/state";
  
	const matkul = $state.user.keterangan
	
	async function submitAction() {
		load = true
		const { data: crMatkul, error: id_error } = await client.from('matkul').select('id').eq('nama',matkul).single()
		
		const { error } = await client.from('jadwal')
			.insert([
				{ kelompok: data.kelompok, jadwal1: `${hariMap[(new Date()).getDay()]},${data.waktu1}-${data.waktu2}`, matkul1: (crMatkul ?? {}).id,
				dosen: $state.user.nama, ruang: data.ruang, status: true, stamp: Date.now(), dadakan: true, len: data.len
			}])
		
		
		// MAIN
		if (error){
			msg = error.message;
			load = false
			return
		}
		await validateData()
		load = false
		hidePopup(true)
	}

	let showPopup = () => show = true
	let hidePopup = (isthis?: boolean) => {
		if (isthis) show = false
		if (!load) show = false
	}
	
	
	let show = false
	let data = {kelompok:'',waktu1:'',waktu2:'',ruang:'',len:0}
	let kelompokFilter = flatten($dosenInfo.mhs,e=>e.kelompok)
	let load = false
	let msg = ''
	
</script>

<!-- <svelte:window on:click={win} /> -->

<main>
	<h1>Dashboard Dosen</h1>
	<div class="recent">
			<h2>Tambahkan Kelas Pengganti</h2>
			<table>
					<thead>
							<tr>
									<th>NO.</th>
									<th>Mata Kuliah</th>
									<th>AKSI</th>
							</tr>
					</thead>
					<tbody>
							<tr>
									<td>1.</td>
									<td>{matkul}</td>
									<td><button id="popup-button" on:click={showPopup} class="btn-download"><span class="material-symbols-outlined">add</span></button></td>
							</tr>
					</tbody>
			</table>
	</div>
</main>


<!-- <input disabled={load||actionType=='edit'} type="text" class="za-form" placeholder="NIM" bind:value={data.nim}>
<input disabled={load} type="text" class="za-form" placeholder="Nama" bind:value={data.nama}> -->
<!-- <Popup bind:show={showPopup} bind:hide={hidePopup} bind:prevent={load} submit={submitAction}>
	<div class="form-down">
		
		<input type="text" disabled value={matkul} class="za-form">
		<select disabled={load} class="za-form" required bind:value={data.kelompok}>
			<option value="">Pilih Kelompok</option>
			{#each kelompokFilter as f}
			<option>{f}</option>
			{/each}
		</select>
		<label for="">Dari</label>
		<input type="time" bind:value={data.waktu1} class="za-form">
		<label for="">Sampai</label>
		<input type="time" bind:value={data.waktu2} class="za-form">
		<input type="text" bind:value={data.ruang} placeholder="ruang" class="za-form">
		<label for="">Dibuka selama</label>
		<input type="number" bind:value={data.len} class="za-form">
		<div>
			<input disabled={load} type="submit" id="" class="za-form" value="Tambahkan">
			<span style:color={"red"}>{msg}</span>
		</div>
		
	</div>
</Popup> -->
<!-- Akhiran Main -->


<!-- svelte-ignore a11y-click-events-have-key-events -->

{#if show}
	
<div class="wrapp" on:click={()=>hidePopup()}>
	<div on:click|stopPropagation={()=>{}}>
		<div class="form-down">
			
			<input type="text" disabled value={matkul} class="za-form">
			<select disabled={load} class="za-form" required bind:value={data.kelompok}>
				<option value="">Pilih Kelompok</option>
				{#each kelompokFilter as f}
				<option>{f}</option>
				{/each}
			</select>
			<label for="">Dari</label>
			<input type="time" bind:value={data.waktu1} class="za-form">
			<label for="">Sampai</label>
			<input type="time" bind:value={data.waktu2} class="za-form">
			<input type="text" bind:value={data.ruang} placeholder="ruang" class="za-form">
			<label for="">Dibuka selama</label>
			<input type="number" bind:value={data.len} class="za-form">
			<div>
				<input disabled={load} on:click={submitAction} type="submit" id="" class="za-form" value="Tambahkan">
				<span style:color={"red"}>{msg}</span>
			</div>
			
		</div>
	</div>
</div>

{/if}

<style>
	
	.form-down{
		margin: 0;
		padding: 0;
		outline: 0;
		appearance: none;
		border: 0;
		text-decoration: 0;
		list-style: none;
		box-sizing: border-box;
	}

</style>