<script lang="ts">
	import MdiAccount from 'virtual:icons/mdi/account';

	import { Avatar } from 'melt/builders';
	import type { PageServerData } from './$types';

	const { data }: { data: PageServerData } = $props();
	const avatar = new Avatar({ src: () => data.pfp_url });
</script>

<div class="p-8">
	<div class="flex items-center gap-x-4">
		<!-- Avatar -->
		<div class="h-24 w-24 rounded-full bg-secondary text-bg">
			<img {...avatar.image} alt="" class="h-full w-full rounded-full object-cover" />
			<span {...avatar.fallback} class="flex h-full w-full items-center justify-center">
				<MdiAccount class="text-5xl" />
			</span>
		</div>

		<!-- Names -->
		<div class="space-y-2">
			<div class="text-5xl font-bold">{data.user_display_name}</div>
			<div class="text-2xl">@{data.username}</div>
		</div>
	</div>
</div>
