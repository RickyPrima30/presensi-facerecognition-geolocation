<script lang=ts>
	import * as faceapi from "@vladmandic/face-api";
  import { onDestroy, onMount } from "svelte";
	import { delay, getCamera, models, size } from "$lib/faceapi";
	
	async function main() {
		
		if (preparing){
			msg = 'Arahkan wajah anda'
			setTimeout(() => {
				if (stop) return
				setTimeout(() => {
					msg = '3'
					if (stop) return
					setTimeout(() => {
						if (stop) return
						msg = '2'
						setTimeout(() => {
							if (stop) return
							msg = '1'
							setTimeout(() => {
								if (stop) return
								prepared = true
								msg = 'Mendeteksi...'
							}, countdownLen);
						}, countdownLen);
					}, countdownLen);
				}, countdownLen)
			}, countdownLen)
			preparing = false
		}
		
		// new faceapi.TinyFaceDetectorOptions({ inputSize: size, scoreThreshold })
    const detections = video ? await faceapi.detectSingleFace(video)
			.withFaceLandmarks()
			.withFaceDescriptor() : undefined;
			
		if (stop) { return }
		if (detections){
			ctx.clearRect(0,0,size,size);
			
			if ( !detected && prepared ){
				msg = '<span style="color:green">Berhasil mendeteksi</span>'
				descriptor = detections.descriptor
				console.log('Captured')
				detected = true
			}
			
			faceapi.draw.drawDetections(canvas,detections)
			
    } else {
			if (!detected && prepared) msg = 'Mendeteksi...'
    }
		
		if (!stop){
			setTimeout(main,delay);
		}
  }
	
	export let close: () => void
	export let onSuccess: ((nama:string,descriptor: Float32Array) => void)
	
  // const models = 'https://raw.githubusercontent.com/justadudewhohacks/face-api.js/master/weights'
	// const size = 416 // 128, 416, 512, 608
	// const delay = 10
	const countdownLen = 700
	
	let camera = getCamera()
	
	let preparing = true
	let prepared = false
	
	let descriptor: Float32Array | null = null
	let detected = false
	
	let video: HTMLVideoElement
	let canvas: HTMLCanvasElement
	let ctx: CanvasRenderingContext2D
	
	let nama: string
	let stop = false
	let msg = 'Memulai face-api...'
	
	onMount(async ()=>{
		await Promise.all([
			faceapi.nets.faceLandmark68Net.loadFromUri(models),
			faceapi.nets.faceRecognitionNet.loadFromUri(models),
			faceapi.nets.ssdMobilenetv1.loadFromUri(models),
		])
		
		if (stop) { return }
		
		ctx = canvas?.getContext('2d') ?? {} as any
		
		msg = 'meminta akses kamera...'
		const stream = await camera.start()
		if (stop) { camera.stop();return; }
    video.srcObject = stream
		
		msg = 'memulai face-detector...'
    video.addEventListener('play',main)
	})
	
	onDestroy(()=>{
		camera.stop()
		stop=true
	})
	
</script>

<!-- svelte-ignore a11y-click-events-have-key-events -->
<div class="wrapp" on:click={close}>
	<div on:click|stopPropagation={()=>{}}>
		
		<div class="min">
			<video width="{size}" height="{size}" autoplay muted bind:this={video}></video>
			<canvas width="{size}" height="{size}" bind:this={canvas}></canvas>
		</div>
		
		<div>
			<h2 class="text-2xl font-bold">{@html msg}</h2>
			<input style="outline: 2px solid var(--color-primary);padding:.7rem 1rem" type="text" bind:value={nama} placeholder="Masukan nama">
				
			<button disabled={nama==''||!detected} on:click={()=>{
				onSuccess(nama,descriptor ?? new Float32Array());
				close()
			}}>Tambahkan</button>
		</div>
		
	</div>
</div>


<style>
	.wrapp{
		position: fixed;
		display: grid;
		place-items: center;
		left: 0;
		width: 100vw;
		height: 100vh;
		background-color: rgb(0, 0, 0, .4);
	}
	.wrapp > div {
		background-color: white;
		border-radius: 10px;
		padding: 2rem;
		display: grid;
		grid-template-columns: 1fr;
		justify-content: center;
		/* aspect-ratio: 1/1; */
		/* min-width: 24rem; */
		min-width: 539px;
		min-height: 90vh;
	}
	.min{ position: relative; }
	.min > video { position: absolute;top: 0;left: 0;width: 100%;height: 100%; }
	.min > canvas { position: relative;top: 0;left: 0;width: 100%; }
	/* .za-form{
		background-color: var(--color-background);
		width: min-content;
		height: min-content;
		padding: .7rem 1.2rem;
  	border-radius: 6px;
		outline: 2px solid var(--color-primary);
	} */
</style>