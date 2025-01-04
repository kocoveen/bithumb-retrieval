<script>
	import '../app.css';
	let { children } = $props();

	import { afterNavigate } from "$app/navigation";

	afterNavigate(() => {
		// Runs after navigating between pages
		window.HSStaticMethods.autoInit();
	});
</script>

{@render children()}
