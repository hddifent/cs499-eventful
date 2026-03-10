<script lang="ts">
	import { page } from '$app/state';
	import { browser } from '$app/environment';
	import { onMount } from 'svelte';

	let countdown = $state(3);

	onMount(() => {
		if (browser && page.status === 401) {
			const interval = setInterval(() => {
				countdown -= 1;

				if (countdown <= 0) {
					clearInterval(interval);
					window.location.href = '/login';
				}
			}, 1000);

			return () => clearInterval(interval);
		}
	});
</script>

<div class="py-8">
	<div class="space-y-2 px-8">
		<div class="space-x-2">
			<span class="text-5xl font-bold">{page.status}</span>
			<span class="text-2xl">{page.error?.message}</span>
		</div>
		{#if page.status === 401}
			<div>
				Your session has expired due to inactivity or it has been a while since you verified
				yourself.
			</div>
			<div>
				Redirecting to
				<a href="/login" class="text-secondary hover:text-primary">login</a>
				page in {countdown} second{countdown != 1 ? 's' : ''}.
			</div>
		{:else}
			<div>Ah, shuck... Let's try that again, shall we?</div>
		{/if}
	</div>
</div>
