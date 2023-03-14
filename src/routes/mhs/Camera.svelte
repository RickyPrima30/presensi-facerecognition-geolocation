<script lang=ts>
  import { detectLocation } from "$lib/lib";
  import { state } from "$lib/state";
  import * as faceapi from "@vladmandic/face-api"
  import { onDestroy, onMount } from "svelte";
  import { models, delay, size, getCamera, useGeo, isMobileDevice } from "$lib/faceapi";
  
  const nama = $state.user.nama
	
	export let close: () => void
  export let onSuccessCallback: (() => Promise<void>) | (() => void)
	
  let canvas: HTMLCanvasElement
  let video: HTMLVideoElement
  let faceMatcher: faceapi.FaceMatcher
  let ctx: CanvasRenderingContext2D
  
  let msg = 'sabar...'
  let camera = getCamera()
  let stop = false
  
  // CLEANING UP
  
  
  onMount
	(async ()=>{
    await Promise.all([
      // isMobileDevice() ? 
      // faceapi.nets.tinyYolov2.loadFromUri(models),
      faceapi.nets.ssdMobilenetv1.loadFromUri(models),
      faceapi.nets.faceLandmark68Net.loadFromUri(models),
      faceapi.nets.faceRecognitionNet.loadFromUri(models),
    ])
    
    msg = 'memuat data...';
    ctx = canvas.getContext('2d') ?? ({} as any)
    
    // IMAGES
    let err = null
    const img = await fetch(`/${nama.trim().replaceAll(' ','_')}.json`, { cache: "force-cache" }).then(e=>e.json()).catch(e=>err = e)
    if (err){
      msg = `<div style="color:red">Data "${nama}" tidak ditemukan</div>`
      stop = true
      return
    }
    
    // FACE MATCHER
    let label = new faceapi.LabeledFaceDescriptors(nama,[ new Float32Array(Object.values(img)) ])
    // SEMAKIN RENDAH, SEMAKIN KETAT
    faceMatcher = new faceapi.FaceMatcher(label,.1)
    
    msg = 'meminta akses kamera...'
    video.srcObject = await camera.start()
    
    if (useGeo){
      refreshCoor().then(e=>{
        if (!e){
          msg = '<div style="color:red">Anda Harus berada di Udinus</div>'
          stop = true
        }
      })
    }
    
    msg = 'memulai face-detector...'
    video.addEventListener('play',main)
  })
  
  onDestroy(()=>{
    camera.stop()
    stop = true
  })
  
  async function main() {
    if (stop) { return }
    
    const detections = await faceapi.detectSingleFace(video).withFaceLandmarks().withFaceDescriptor()
    ctx.clearRect(0,0,size,size);
    
    if (stop) { return }
    if (detections){
      try {
        const res = faceMatcher.findBestMatch(detections.descriptor)
        if (res.distance < .46){
          msg = nama.trim() + ', Memproses...'
          await onSuccessCallback()
          close()
          return
        } else { msg = 'Wajah tidak dikenali' }
        
        if (stop) { return }
        
        faceapi.draw.drawDetections(canvas,detections)
      } catch (error) { console.error(error) }
    } else { msg = 'Mendeteksi...' }
    
    setTimeout(main,delay);
  }
  
  // GEO
	async function refreshCoor(): Promise<boolean> {
    return new Promise((res,rej)=>{
      navigator.geolocation.getCurrentPosition((e)=>{        
        let result: boolean
        result = detectLocation(e.coords.latitude,e.coords.longitude)
        res(result)
      },err=>rej(err))
    })
  }
  
</script>

<!-- svelte-ignore a11y-media-has-caption -->
<!-- svelte-ignore a11y-click-events-have-key-events -->

<!-- Specific only for mhs page -->

<div class="wrapp" on:click={close}>
	<div class="max-w-6xl">
		<div class="min">
			<video width="{size}" height="{size}" autoplay muted bind:this={video}></video>
			<canvas width="{size}" height="{size}" bind:this={canvas}></canvas>
		</div>
		<div>
			<h2 class="text-2xl font-bold">{@html msg}</h2>
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
		min-width: 24rem;
	}
	.min{
		position: relative;
		
	}
	.min > video {
		position: absolute;top: 0;left: 0;width: 100%;height: 100%;
	}
	.min > canvas {
		position: relative;top: 0;left: 0;width: 100%;
	}
</style>