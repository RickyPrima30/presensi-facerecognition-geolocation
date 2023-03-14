<script lang=ts>
	import * as faceapi from "@vladmandic/face-api";
  import { onDestroy, onMount } from "svelte";
	import { datas } from "./+page.svelte";
	import { delay, getCamera, models, size } from "$lib/faceapi";
	
	
	async function main() {
		// new faceapi.TinyFaceDetectorOptions({ inputSize: size, scoreThreshold })
    const detections = video ? await faceapi.detectAllFaces(video)
			.withFaceLandmarks()
			.withFaceDescriptors() : undefined;
			
		if (stop) { return }
		if (detections){
			ctx.clearRect(0,0,height,size);
			
			const boxes = detections.map(detection=>{
				const result = faceMatcher.findBestMatch(detection.descriptor)
				const nama = result.label == 'unknown' ? 'Tidak dikenali' : result.label
				// return new faceapi.LabeledFaceDescriptors(nama, [detection.descriptor] )
				return {label: nama,detect: detection.detection}
			})
			
			msg = "Sukses, halo " + boxes.map(e=>e.label == 'Tidak dikenali' ? '' : e.label).join(', ')
			
			boxes.forEach(({ label, detect })=>{
				const box = new faceapi.draw.DrawBox(detect.box,{ label })
				box.draw(canvas)
			})
			
    } else {
      msg = 'Mendeteksi...'
    }
		
		if (!stop){
			setTimeout(main,delay);
		}
		
  }
	
	export let close: () => void
	const height = 4/3 * size
	
	let camera = getCamera(height,size)
	
	let video: HTMLVideoElement
	let canvas: HTMLCanvasElement
	let ctx: CanvasRenderingContext2D
	let faceMatcher: faceapi.FaceMatcher
	
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
		
		
		// LOAD DATA
		const labels = Object.entries($datas).map(([nama,descriptor]: [string,any])=>{
			return new faceapi.LabeledFaceDescriptors(nama, [descriptor] )
		})
		
		faceMatcher = new faceapi.FaceMatcher(labels,.6)
		
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
			<video width="{height}" height="{size}" autoplay muted bind:this={video}></video>
			<canvas width="{height}" height="{size}" bind:this={canvas}></canvas>
		</div>
		
		<div>
			<h2 class="text-2xl font-bold"> {@html msg} </h2>
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
		/* min-width: 44rem; */
		min-width: 539px;
		min-height: 90vh;
	}
	.min{ position: relative; }
	.min > video { position: absolute;top: 0;left: 0;width: 100%; }
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