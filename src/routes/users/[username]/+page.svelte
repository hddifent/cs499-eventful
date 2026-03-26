<script lang="ts">
	import type { PageServerData } from './$types';
	import UserBanner from '$lib/components/UserBanner.svelte';

	const { data }: { data: PageServerData } = $props();
</script>

<div class="p-8">
	<!-- Flex User Profile -->
	<UserBanner
		username={data.profile.username}
		displayName={data.profile.user_display_name}
		pfpUrl={data.profile.pfp_url}
	/>

	<span class="flex w-full items-center justify-center py-4">
		<hr class="w-full border border-fg/50" />
	</span>
</div>
