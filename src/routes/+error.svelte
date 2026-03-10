<script lang="ts">
	import { page } from '$app/state';
</script>

<div class="py-8">
	<div class="space-y-2 px-8">
		<div class="space-x-2">
			<span class="text-5xl font-bold">{page.status}</span>
			{#if page.error}
				<span class="text-2xl">{page.error.message}</span>
			{/if}
		</div>
		<span>Ah, shuck... Let's try that again, shall we?</span>
	</div>
</div>
