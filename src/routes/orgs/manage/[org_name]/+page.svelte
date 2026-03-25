<script lang="ts">
	import MdiGeneral from 'virtual:icons/mdi/information';
	import MdiGroup from 'virtual:icons/mdi/account-group';

	import MdiUserAdd from 'virtual:icons/mdi/account-plus';

	import { Tabs } from 'melt/builders';
	import type { PageServerData } from './$types';
	import UserBanner from '$lib/components/UserBanner.svelte';
	import CardItem from '$lib/components/CardItem.svelte';
	import { resolve } from '$app/paths';

	const { data }: { data: PageServerData } = $props();

	const tabNames = ['General', 'Group Members'] as const;
	type TabId = (typeof tabNames)[number];
	const accountTabs = new Tabs<TabId>({
		value: tabNames[0],
		orientation: 'vertical'
	});
</script>

{#snippet tabIcon(tab: TabId)}
	{#if tab === 'General'}
		<MdiGeneral />
	{:else if tab === 'Group Members'}
		<MdiGroup />
	{/if}
{/snippet}

{#snippet membersList(
	label: string,
	data: {
		username: string;
		displayName: string;
		pfpUrl?: string;
	}[]
)}
	<div class="text-2xl font-bold">{label} ({data.length})</div>
	{#if data.length > 0}
		{#each data as d (d.username)}
			<CardItem
				type="USER"
				title={d.displayName}
				subtitle={d.username}
				imgSrc={d.pfpUrl}
				clickLink={resolve(`/users/${d.username}`)}
			/>
		{/each}
	{:else}
		<div>None</div>
	{/if}
{/snippet}

{#snippet membersContent()}
	<div class="space-y-2">
		<button
			class="flex w-fit items-center gap-x-2 rounded-lg bg-primary px-4 py-2 hover:bg-primary-hover"
		>
			<MdiUserAdd /> Invite users
		</button>

		<span class="flex w-full items-center justify-center py-2">
			<hr class="w-full border border-fg/50" />
		</span>

		{@render membersList('Members', data.members.joined)}

		<span class="flex w-full items-center justify-center py-2">
			<hr class="w-full border border-fg/50" />
		</span>

		{@render membersList('Invited', data.members.invited)}
	</div>
{/snippet}

<div class="p-8">
	<!-- Flex User Profile -->
	<UserBanner
		username={data.org.uniqueName}
		displayName={data.org.displayName}
		pfpUrl={data.org.pfpUrl}
	/>

	<span class="flex w-full items-center justify-center py-4">
		<hr class="w-full border border-fg/50" />
	</span>

	<!-- Menu -->
	<div class="flex space-x-4">
		<!-- Tab Menu -->
		<div {...accountTabs.triggerList} class="w-min min-w-1/5 space-y-1">
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
					{#if t === 'General'}
						<!-- {@render orgGroupContent()} -->
					{:else if t === 'Group Members'}
						{@render membersContent()}
					{:else}
						{t} Contents
					{/if}
				</div>
			{/each}
		</div>
	</div>
</div>
