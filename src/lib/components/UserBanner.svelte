<script lang="ts">
	import MdiAccount from 'virtual:icons/mdi/account';
	import { Avatar } from 'melt/builders';

	interface UserBannerData {
		username: string;
		displayName: string;
		pfpUrl?: string;
	}

	const { username, displayName, pfpUrl }: UserBannerData = $props();

	const avatar = new Avatar({ src: () => pfpUrl });
</script>

<div class="flex items-center gap-x-4">
	<!-- Avatar -->
	<div class="h-24 w-24 rounded-full">
		<img {...avatar.image} alt="" class="h-full w-full rounded-full object-cover" />
		<span
			{...avatar.fallback}
			class="flex h-full w-full items-center justify-center rounded-full bg-secondary text-bg"
		>
			<MdiAccount class="text-5xl" />
		</span>
	</div>

	<!-- Names -->
	<div class="space-y-2">
		<div class="text-5xl font-bold">{displayName}</div>
		<div class="text-2xl">@{username}</div>
	</div>
</div>
