<script lang="ts">
	let { minSize = 60, children } = $props();
</script>

<div class="display-grid grid gap-4" style="--min-size: {minSize};">
	{@render children()}
</div>

<style>
	.display-grid {
		grid-template-columns: repeat(auto-fill, minmax(calc(var(--spacing) * var(--min-size)), 1fr));
	}
</style>
