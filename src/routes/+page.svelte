<script>
	/** @type {import('./$types').PageData} */
	export let data;

	$: ({ jwtToken, config } = data);
</script>

<div>
	<h2>JWT Token:</h2>
	<div class="token-display">{jwtToken}</div>
</div>

<div>
	<h2>Config:</h2>
	<div class="config-display">{JSON.stringify(config, null, 2)}</div>
</div>

<style>
    .token-display, .config-display {
        background-color: #f0f0f0;
        padding: 10px;
        border-radius: 5px;
        font-family: monospace;
        white-space: pre-wrap;
        word-break: break-all;
    }
</style>