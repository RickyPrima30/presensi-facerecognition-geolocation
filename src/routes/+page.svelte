
<script lang=ts>
	import '../css/login.css'
  import { goto } from '$app/navigation'
  import { login } from '$lib/state'
	
	let msg = ''
	let loading = false
	let [nim,password] = ['','']
	
	async function submit() {
		loading = true
		const { valid, error, type } = await login(nim, password)
		
		if (valid) { goto(`/${type}`) } else {
			msg = error ?? ''
			loading = false
		}
	}
	
</script>

<div class="top-container">
	<div class="box">
		<form on:submit|preventDefault={submit}>
			<h2>LOGIN PRESENSI ONLINE</h2>
			<div class="inputBox">
				<input type="text" id="nim" name="nim" required bind:value={nim} disabled={loading}/>
				<span>NIM</span>
				<i></i>
			</div>
			
			<div class="inputBox">
				<input type="password" id="password" name="password" required bind:value={password} disabled={loading}/>
				<span>Password</span>
				<i></i>
			</div>
			
			<div class="links"><div style="color: brown;">{msg}</div></div>
			<input type="submit" value="LOGIN" disabled={loading}/>
		</form>
	</div>
</div>
