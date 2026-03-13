<script lang="ts">
	import MdiAccount from 'virtual:icons/mdi/account';
	import MdiGeneral from 'virtual:icons/mdi/information';
	import MdiGroup from 'virtual:icons/mdi/account-group';
	import MdiEvent from 'virtual:icons/mdi/calendar';
	import MdiShop from 'virtual:icons/mdi/cart';
	import MdiSettings from 'virtual:icons/mdi/cog';

	import MdiGroupAdd from 'virtual:icons/mdi/account-multiple-plus';

	import { Avatar, Tabs } from 'melt/builders';
	import type { PageServerData } from './$types';

	const { data }: { data: PageServerData } = $props();

	const avatar = new Avatar({ src: () => data.user.pfpUrl });

	const tabNames = [
		'General',
		'My Organizer Groups',
		'My Events',
		'My Shopping List',
		'Settings'
	] as const;
	type TabId = (typeof tabNames)[number];
	const accountTabs = new Tabs<TabId>({
		value: tabNames[0],
		orientation: 'vertical'
	});
</script>

{#snippet tabIcon(tab: TabId)}
	{#if tab === 'General'}
		<MdiGeneral />
	{:else if tab === 'My Organizer Groups'}
		<MdiGroup />
	{:else if tab === 'My Events'}
		<MdiEvent />
	{:else if tab === 'My Shopping List'}
		<MdiShop />
	{:else if tab === 'Settings'}
		<MdiSettings />
	{/if}
{/snippet}

{#snippet orgGroupContent()}
	<div class="space-y-2">
		<button class="rounded-lg bg-primary px-4 py-2 hover:bg-primary-hover">
			<span class="flex items-center gap-x-2"><MdiGroupAdd /> Create a new group</span>
		</button>

		<span class="flex w-full items-center justify-center py-2">
			<hr class="w-full border border-fg/50" />
		</span>

		<div class="text-2xl font-bold">Invitations (0)</div>
		<div>None</div>

		<span class="flex w-full items-center justify-center py-2">
			<hr class="w-full border border-fg/50" />
		</span>

		<div class="text-2xl font-bold">My Groups (0)</div>
		<div>None</div>
	</div>
{/snippet}

{#snippet eventContent()}
	<div class="space-y-2">
		<div class="text-2xl font-bold">Attended (0)</div>
		<div>None</div>

		<span class="flex w-full items-center justify-center py-2">
			<hr class="w-full border border-fg/50" />
		</span>

		<div class="text-2xl font-bold">Upcoming (0)</div>
		<div>None</div>
	</div>
{/snippet}

<div class="p-8">
	<!-- Flex User Profile -->
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
						<span class="flex items-center gap-x-2">{@render tabIcon(t)} {t}</span>
					</div>
				</button>
			{/each}
		</div>

		<!-- Divider -->
		<span class="flex h-auto w-0 border border-fg/50"></span>

		<!-- Tab Contents -->
		<div class="w-full">
			{#each tabNames as t (t)}
				<div {...accountTabs.getContent(t)}>
					{#if t === 'My Organizer Groups'}
						{@render orgGroupContent()}
					{:else if t === 'My Events'}
						{@render eventContent()}
					{:else}
						{t} Contents
					{/if}
				</div>
			{/each}
		</div>
	</div>
</div>
