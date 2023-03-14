
<script lang=ts>
	import { validateSession } from "$lib/state";
	import { beforeNavigate,afterNavigate, goto } from "$app/navigation";
	
	let show = false
	
	// Promise.all([
	// 	faceapi.nets.tinyFaceDetector.loadFromUri(models),
	// 	faceapi.nets.faceLandmark68TinyNet.loadFromUri(models),
	// 	faceapi.nets.faceRecognitionNet.loadFromUri(models),
	// ])
	
	async function auth() {
		const { valid, type } = await validateSession()
		if (valid){
			if ( !location.pathname.startsWith(`/${type}`) ){ return goto(`/${type}`) }
			return
		}
		return goto('/')
	}
	
	beforeNavigate(()=>show = true)
	afterNavigate(()=>show = false)
</script>

<div class="loading-wrap">
	<div style="display:{show ? 'block' : 'none'}">Loading...</div>
</div>

{#await auth()}
<div style="position: fixed;width: 100vw;height:100vh;display:grid;place-items: center;">
	<h1>Mengautentikasi...</h1>
</div>
{:then _}
<slot/>
{/await}

<style>
	.loading-wrap{
		width: 100vw;
		position: fixed;
		bottom: 4rem;
		display: grid;
		place-items: center;
	}
	.loading-wrap > div{
		text-align: center;
		background-color: white;
		color: black;
		width: min-content;
		padding: .7rem 1rem;
		border-radius: 30px;
		font-weight: 700;
	}
</style>