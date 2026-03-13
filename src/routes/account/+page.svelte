<script lang="ts">
	import MdiAccount from 'virtual:icons/mdi/account';

	import { Avatar, Tabs } from 'melt/builders';
	import type { PageServerData } from './$types';

	const { data }: { data: PageServerData } = $props();

	const avatar = new Avatar({ src: () => data.user.pfpUrl });

	const tabNames = ['General', 'My Organizer Groups', 'My Events', 'Settings'] as const;
	type TabId = (typeof tabNames)[number];
	const accountTabs = new Tabs<TabId>({
		value: tabNames[0],
		orientation: 'vertical'
	});
</script>

<div class="p-8">
	<!-- Flex User Profile -->
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
			<div class="text-5xl font-bold">{data.user.displayName}</div>
			<div class="text-2xl">@{data.user.username}</div>
		</div>
	</div>

	<span class="flex w-full items-center justify-center py-4">
		<hr class="w-full border border-fg/50" />
	</span>

	<!-- Menu -->
	<div class="flex space-x-4">
		<!-- Tab Menu -->
		<div {...accountTabs.triggerList} class="w-min space-y-1">
			{#each tabNames as t (t)}
				<button
					class="group w-full bg-transparent font-bold text-ellipsis whitespace-nowrap transition outline-none"
					{...accountTabs.getTrigger(t)}
				>
					<div
						class="overflow-clip rounded-lg px-4 py-2 text-left transition group-data-active:bg-primary group-[&:not([data-active]):hover]:bg-primary/50"
					>
						{t}
					</div>
				</button>
			{/each}
		</div>

		<!-- Divider -->
		<span class="flex h-auto w-0 border border-fg/50"></span>

		<!-- Tab Contents -->
		<div class="mt-2">
			{#each tabNames as t (t)}
				<div {...accountTabs.getContent(t)}>
					{t} Contents
				</div>
			{/each}
		</div>
	</div>
</div>
