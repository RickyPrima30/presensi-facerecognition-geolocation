<script lang=ts context=module>
	export let datas = writable<any>({})
		
</script>

<script lang=ts>
	import Adder from "./Adder.svelte";
  import Scanner from "./Scanner.svelte";
	import { news } from "../+layout.svelte";
  import { writable } from "svelte/store";
	
	function onSuccess(nama: string, descriptor: Float32Array) {
		datas.update(e=>{
			e[nama] = descriptor
			return e
		})
		console.log('ADDED',nama)
		news.update(e=>{
			if (e.length == 3){
				e.pop()
			}
			const d = new Date()
			const h = d.getHours()
			const m = d.getMinutes()
			e.unshift({ nama, time: `${h<10?'0':''}${h}.${m<10?'0':''}${m}` })
			
			return e
		})
	}
	
	let showAdder = false
	let showScanner = false
	
</script>

{#if showAdder}
	<Adder close={()=>showAdder=false} {onSuccess} />
{/if}
{#if showScanner}
	<Scanner close={()=>showScanner=false} />
{/if}

<main>
	<h1>Public Recognition</h1>
	<div class="recent">
		{#if !showScanner}
		<button on:click={()=>showAdder=true}>Daftar</button>
		<button on:click={()=>showScanner=true}>Scan</button>
		{/if}
		
		<br><br><br>
		<table>
			<thead>
					<tr>
							<th>NO.</th>
							<th>Nama</th>
							<th></th><th></th><th></th><th></th>
							<th></th><th></th><th></th><th></th>
							<th>Aksi</th>
					</tr>
			</thead>
			<tbody>
				{#each Object.keys($datas).reverse() as nama, i}
				<tr>
					<td>{i+1}</td>
					<td colspan="9">{nama}</td>
					<!-- svelte-ignore a11y-click-events-have-key-events -->
					<td><span class="material-symbols-outlined" style="cursor: pointer;" on:click={()=>{
						datas.update(e=>{ delete e[nama];return e})
					}}>delete</span></td>
				</tr>
				{/each}
			</tbody>
	</table>
	</div>
</main>


