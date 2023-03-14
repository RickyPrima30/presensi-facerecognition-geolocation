<script context=module lang=ts>
	
	export let active = writable<string>(location.pathname)
	export let IMAGES = writable<Blob[]>()
	
</script>

<script lang=ts>
  import { footerGetDate, darkMode, hariMap } from "$lib/lib"
	import { sidebars } from "./data"
	import { logout, state, userPresensi } from "$lib/state"
  import { derived, writable } from "svelte/store";
	import Refresh from "$lib/Refresh.svelte";
	
	let dark = darkMode(false,true)
	let sideMenu: HTMLElement
	
	// USER DATA
	let nama = $state.user.nama || '<default>'
	
		
	let presensiNow = derived(userPresensi,$userPresensi=>
		$userPresensi.filter(e=> e.waktu.split(',')[0] == hariMap[(new Date()).getDay()] )
	)
	
	
</script>

<div class="container">
	<aside bind:this={sideMenu}>
		<div class="top">
			<div class="logo">
				<img src="/logo.jpg" alt="logo">
				<h2>PRESENSI <span class="primary">ONLINE</span></h2>
			</div>
			<!-- svelte-ignore a11y-click-events-have-key-events -->
			<div class="close" id="close-btn" on:click={()=>sideMenu.style.display = 'none'}>
				<span class="material-symbols-outlined">close</span>
			</div>
		</div>
		<div class="sidebar">
			{#each sidebars as s}
				<a href={s.href} class:active={$active == s.href} on:click={() => ($active = s.href)}>
					<span class="material-symbols-outlined">{s.mat}</span>
					<h3>{@html s.msg}</h3>
				</a>
			{/each}
				<a href="#a" on:click={logout}>
					<span class="material-symbols-outlined">logout</span>
					<h3>Log Out</h3>
				</a>
		</div>
	</aside>
	
	<slot />

	<div class="right">
		<div class="top">
			<!-- svelte-ignore a11y-click-events-have-key-events -->
			<button id="menu-btn" on:click={()=>sideMenu.style.display = 'block'}>
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
					<small class="text-muted">Mahasiswa {$state.user.keterangan}</small>
				</div>
				<div class="profile-photo">
					<img src={$state.user.photo} alt="admin-img" />
				</div>
			</div>
		</div>
		
		<div class="recent-updates">
			<Refresh/>
			<h2>Update Terbaru</h2>
			<!-- DATA -->
			{#each $presensiNow as e}
			<div class="updates" style="margin-bottom: .5rem;">
				<div class="update">
					<div class="profile-photo">
						<span class="material-symbols-outlined">checklist</span>
					</div>
					<div class="message">
						<p><b>Anda</b> Telah berhasil melakukan abseni</p>
						<small class="text-muted success">Mata Kuliah {e.jadwal.matkul.nama}</small>
					</div>
				</div>
			</div>
			{/each}
		</div>
		
	</div>
</div>

<footer>
	<p id="date">{footerGetDate()}</p>
</footer>

