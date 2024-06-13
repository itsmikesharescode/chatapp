<script>
	import Footer from '$lib/components/general/footer.svelte';
	import '../app.css';

	const { children } = $props();
</script>

{@render children()}
<Footer />
