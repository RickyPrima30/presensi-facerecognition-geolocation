

<script lang=ts>
	let shown = false
	export let prevent = false
	
	export function show() {
		if (prevent) { return }
		shown=true
	}
	
	export function hide(force: boolean) {
		if ( force ) { shown = false }
		if (prevent) { return }
		shown=false
	}
	
	export let submit: (e: SubmitEvent) => void = () => {}
	
</script>

<!-- svelte-ignore a11y-click-events-have-key-events -->

<div style:display={shown ? 'grid' : 'none'} style="place-items: center;" class="wrapp" on:mousedown={()=>hide(false)}>
	<form class="za-form" on:mousedown|stopPropagation={()=>{}} on:submit|preventDefault={submit}>
		<slot/>
	</form>
</div>

<style>
	.wrapp{
		top: 0;
		left: 0;
		margin:0;
		padding:0;
		position: fixed;
		height: 100vh;
		max-height: 100vh;
		width: 100vw;
		max-width: 100vw;
		background-color: #0005;
	}
	.za-form{
		background-color: var(--color-background);
		width: min-content;
		height: min-content;
		min-height: 20vh;
		min-width: 20vw;
		padding:2rem;
		border-radius: 20px;
	}
	
</style>