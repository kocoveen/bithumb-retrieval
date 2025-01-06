<script>
	import '../app.css';
	import { afterNavigate } from "$app/navigation";

	afterNavigate(() => {

		// Runs after navigating between pages
		window.HSStaticMethods.autoInit();
	});
	let { children } = $props();
</script>

{@render children()}
