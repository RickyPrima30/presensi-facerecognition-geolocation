<script context=module lang=ts>
	export let active = writable(location.pathname)
	export let news = writable<any[]>([])
	
</script>

<script lang=ts>
	import { darkMode, footerGetDate } from "$lib/lib";
  import { logout, state } from "$lib/state";
  import { writable } from "svelte/store";
	import { moreMhs } from "./+page.svelte";
	
	let dark = darkMode(false,true)
	let sideMenu: HTMLElement	
	
	let nama = $state.user.nama || '<default>'
	
	const sidebar = [
		{
			href: '/admin',
			mat: 'grid_view',
			text: 'Dashboard',
		},
		{
			href: '/admin/dosen',
			mat: 'person',
			text: 'Dosen',
		},
		{
			href: '/admin/mhs',
			mat: 'groups',
			text: 'Mahasiswa',
		},
		// {
		// 	href: '/admin/kelompok',
		// 	mat: 'add_business',
		// 	text: 'Tambah Kelompok',
		// },
		{
			href: '/admin/prodi',
			mat: 'school',
			text: 'Program Studi',
		},
		{
			href: '/admin/jadwal',
			mat: 'schedule',
			text: 'Jadwal',
		},
		{
			href: "/admin/public",
			mat: "add_a_photo",
			text: "Public",
		},
		{
			href: "/admin/kelas",
			mat: "add_a_photo",
			text: "Kelas",
		},
	]
</script>
<div class="container">
	<aside bind:this={sideMenu}>
			<div class="top">
					<div class="logo">
							<img src="/logo.jpg" alt="logo">
							<h2>PRESENSI <span class="primary">ONLINE</span></h2>
					</div>
					<!-- svelte-ignore a11y-click-events-have-key-events -->
					<div class="close" id="close-btn" on:click={() =>sideMenu.style.display = 'none'}>
							<span class="material-symbols-outlined">close</span>
					</div>
			</div>
			<div class="sidebar">
				{#each sidebar as { text, href, mat }}
				<a href="{href}" class:active={$active==href} on:click={()=>$active=href}>
						<span class="material-symbols-outlined">{mat}</span>
						<h3>{@html text ?? 'Public'}</h3>
				</a>
				{/each}
					<a href="#logout" on:click={()=>{logout();active.set('/admin')}}>
							<span class="material-symbols-outlined">logout</span>
							<h3>Log Out</h3>
					</a>
			</div>
	</aside>
	<!-- AKHIRAN ASIDE -->
	<slot/>
	<div class="right">
			<div class="top">
					<button id="menu-btn" on:click={() =>sideMenu.style.display = 'block'}>
							 <span class="material-symbols-outlined">menu</span>
					</button>
					<!-- svelte-ignore a11y-click-events-have-key-events -->
					<div class="theme-toggler" on:click={()=>{dark = darkMode(dark)}}>
							<span class="material-symbols-outlined" class:active={!dark}>light_mode</span>
							<span class="material-symbols-outlined" class:active={dark}>dark_mode</span>
					</div>
					<div class="profile">
							<div class="info">
									<p>Halo, <b>{nama}</b></p>
									<small class="text-muted">{$state.user.keterangan}</small>
							</div>
							<div class="profile-photo">
									<img src="/img/admin.png" alt="">
							</div>
					</div>
			</div>
			<!-- AKHIRAN TOP -->
			<div class="recent-updates">
					<h2>Update Terbaru</h2>
					{#each $news as n}
					<div class="updates" style="margin-bottom: 0.5rem;">
							<div class="update">
									<div class="profile-photo">
											<img src="/img/admin.png" alt="logo">
									</div>
									<div class="message">
											<p><b>{n.nama}</b> Telah mendaftar pada jam</p>
											<small class="text-muted success">{n.time}</small>
									</div>
							</div>
					</div>
					{/each}
			</div>
			<!-- AKHIRAN UPDATE TERBARU -->
			<div class="absensi-analytics">
					<h2>Analisa Presensi</h2>
					<div class="item online">
							<div class="right">
									<span class="material-symbols-outlined icon">groups</span>
									<h3>Teknik Informatika</h3>
									<div class="info">
											<h5 class="success">{$moreMhs} Mahasiswa</h5>
											<small class="text-muted">Hari ini</small>
									</div>
							</div>
					</div>
			</div>
	</div>
</div>

<footer>
	<p id="date">{footerGetDate()}</p>
</footer>
