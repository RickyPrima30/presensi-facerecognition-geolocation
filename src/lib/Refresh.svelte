
<script>
	import { validateData } from "./state";
	let refreshing = false
	async function refresh() {
		refreshing = true
		await validateData()
		refreshing = false
	}
</script>


<input type="button" value="refresh" on:click={refresh} disabled={refreshing} class="refresh-btn"/>

<style>
	.refresh-btn{
		padding:.7rem 1rem;
		
		border-radius:10px;
		cursor:pointer;
		
		color:white;
		background-color: var(--color-primary);
	}
	.refresh-btn:disabled {
		color:gray;
	}
</style>