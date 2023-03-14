
<script lang=ts>
  import { darkMode, footerGetDate } from "$lib/lib"
	import Refresh from "$lib/Refresh.svelte";
	import { logout, state } from "$lib/state"
	
	let dark = darkMode(false,true)
	let sideMenu: HTMLElement	
	let active = location.pathname
	
	// User data
	let nama = $state.user.nama

	const sidebar = [{
			href: '/dosen',
			mat: 'grid_view',
			text: 'Dashboard'
		},{
			href: '/dosen/jadwal',
			mat: 'schedule',
			text: 'Jadwal'
		},{
			href: '/dosen/daftar',
			mat: 'edit_square',
			text: 'Daftar Presensi'
		},{
			href: '/dosen/rekap',
			mat: 'dataset',
			text: 'Rekap Presensi'
		},{
			href: '/dosen/pengganti',
			mat: 'add_business',
			text: 'Tambah Kelas Pengganti'
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
				{#each sidebar as { href, mat, text } (href)}
				<a href={href} class:active={active==href} on:click={()=>active=href}> 
						<span class="material-symbols-outlined">{mat}</span>
						<h3>{@html text}</h3>
				</a>
				{/each}
				<a href="#a" on:click={logout}>
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
									<small class="text-muted">DOSEN</small>
							</div>
							<div class="profile-photo">
									<img src="/img/admin.png" alt="">
							</div>
					</div>
			</div>
			<!-- AKHIRAN TOP -->
			<div class="recent-updates">
				<Refresh/>
				<h2>Update Terbaru</h2>
			</div>
			<!-- AKHIRAN UPDATE TERBARU -->
	</div>
</div>

<footer>
	<p id="date">{footerGetDate()}</p>
</footer>
