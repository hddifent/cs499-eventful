<script lang="ts">
	interface TopCardData {
		imgSrc: string;
		title: string;
		desc?: string;
		height?: number;
	}

	let { imgSrc, title, desc, height = 48 }: TopCardData = $props();
</script>

<div class="top-card relative w-full" style="--set-h: {height}">
	<!-- Splash Image -->
	<img src={imgSrc} alt="" class="absolute inset-0 h-full w-full object-cover" />

	<!-- Overlay -->
	<div class="absolute inset-0 bg-linear-to-b from-bg/0 to-bg"></div>

	<!-- Texts -->
	<div class="relative z-10 flex h-full items-center justify-center">
		<div class="text-center">
			<h1 class="mb-2 text-4xl font-black text-fg">{title}</h1>
			{#if desc}
				<p class="text-fg">{desc}</p>
			{/if}
		</div>
	</div>
</div>

<style>
	.top-card {
		height: calc(var(--spacing) * var(--set-h));
	}
</style>
