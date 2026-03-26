<script lang="ts">
	import MdiGroup from 'virtual:icons/mdi/account-group';
	import MdiEvent from 'virtual:icons/mdi/calendar';
	import MdiSettings from 'virtual:icons/mdi/cog';

	import MdiGroupAdd from 'virtual:icons/mdi/account-multiple-plus';

	import MdiAccept from 'virtual:icons/mdi/check';
	import MdiDeny from 'virtual:icons/mdi/close';

	import { Tabs } from 'melt/builders';
	import type { ActionData, PageServerData, SubmitFunction } from './$types';
	import UserBanner from '$lib/components/UserBanner.svelte';
	import { resolve } from '$app/paths';
	import CardItem from '$lib/components/CardItem.svelte';
	import type { Snippet } from 'svelte';
	import { enhance } from '$app/forms';

	const { data, form }: { data: PageServerData; form: ActionData } = $props();
	let isUploading = $state(false);

	const tabNames = ['My Organizer Groups', 'My Events', 'Settings'] as const;
	type TabId = (typeof tabNames)[number];
	const accountTabs = new Tabs<TabId>({
		value: tabNames[0],
		orientation: 'vertical'
	});

	const COMMON_ACTIONBUTTON_STYLE =
		'flex h-12 min-h-12 w-12 min-w-12 items-center justify-center rounded-full';

	const handleInviteResponse: SubmitFunction = () => {
		return async ({ update }) => {
			await update();
		};
	};
</script>

{#snippet tabIcon(tab: TabId)}
	{#if tab === 'My Organizer Groups'}
		<MdiGroup />
	{:else if tab === 'My Events'}
		<MdiEvent />
	{:else if tab === 'Settings'}
		<MdiSettings />
	{/if}
{/snippet}

{#snippet orgInviteAcceptAction(uniqueName: string)}
	<form method="POST" action="?/respondInvite" use:enhance={handleInviteResponse}>
		<input type="hidden" name="orgUniqueName" value={uniqueName} />
		<input type="hidden" name="answer" value="acceptinvite" />
		<button class="{COMMON_ACTIONBUTTON_STYLE} bg-primary text-bg">
			<MdiAccept class="text-2xl" />
		</button>
	</form>
{/snippet}

{#snippet orgInviteDenyAction(uniqueName: string)}
	<form method="POST" action="?/respondInvite" use:enhance={handleInviteResponse}>
		<input type="hidden" name="orgUniqueName" value={uniqueName} />
		<input type="hidden" name="answer" value="rejectinvite" />
		<button class="{COMMON_ACTIONBUTTON_STYLE} bg-error text-bg">
			<MdiDeny class="text-2xl" />
		</button>
	</form>
{/snippet}

{#snippet orgList(
	label: string,
	data: { uniqueName: string; displayName: string }[],
	linkTo: 'manage' | 'details',
	actions?: Snippet<[string]>[]
)}
	<div class="text-2xl font-bold">{label} ({data.length})</div>
	{#if data.length > 0}
		{#each data as d (d.uniqueName)}
			{#snippet rowActions()}
				{#if actions}
					<div class="flex items-center gap-x-2">
						{#each actions as action (action)}
							{@render action(d.uniqueName)}
						{/each}
					</div>
				{/if}
			{/snippet}
			<CardItem
				type="USER"
				title={d.displayName}
				subtitle={d.uniqueName}
				clickLink={resolve(`/orgs/${linkTo}/${d.uniqueName}`)}
				actionItems={rowActions}
			/>
		{/each}
	{:else}
		<div>None</div>
	{/if}
{/snippet}

{#snippet orgGroupContent()}
	<div class="space-y-2">
		<a
			href={resolve('/orgs/create')}
			class="flex w-fit items-center gap-x-2 rounded-lg bg-primary px-4 py-2 hover:bg-primary-hover"
		>
			<MdiGroupAdd /> Create a new group
		</a>

		<span class="flex w-full items-center justify-center py-2">
			<hr class="w-full border border-fg/50" />
		</span>

		{@render orgList('My Groups', data.orgs.joined, 'manage')}

		<span class="flex w-full items-center justify-center py-2">
			<hr class="w-full border border-fg/50" />
		</span>

		{@render orgList('Invitations', data.orgs.invited, 'details', [
			orgInviteAcceptAction,
			orgInviteDenyAction
		])}
	</div>
{/snippet}

{#snippet eventList(label: string, events: any[])}
	<div class="text-2xl font-bold">{label} ({events.length})</div>
	{#if events.length > 0}
		<div class="mt-4 space-y-4">
			{#each events as e (e.eventSlug)}
				<CardItem
					type="ITEM"
					title={e.eventName}
					subtitle="Booth {e.assignedBooth} - {e.startDate.toLocaleDateString()}"
					clickLink={`/events/${e.eventSlug}`}
				/>
			{/each}
		</div>
	{:else}
		None
	{/if}
{/snippet}

{#snippet eventContent()}
	<div class="space-y-2">
		{@render eventList('Attended & Ongoing', data.events.attended)}

		<span class="flex w-full items-center justify-center py-2">
			<hr class="w-full border border-fg/50" />
		</span>

		{@render eventList('Upcoming', data.events.upcoming)}
	</div>
{/snippet}

{#snippet settingsContent()}
	<div class="space-y-2">
		<form
			method="POST"
			action="?/uploadPfp"
			enctype="multipart/form-data"
			use:enhance={() => {
				isUploading = true;
				return async ({ update }) => {
					isUploading = false;
					await update();
				};
			}}
			class="flex flex-col gap-4 sm:flex-row sm:items-end"
		>
			<div class="grow space-y-2">
				<label for="pfp" class="block text-2xl font-bold text-fg"
					>Upload new Profile Picture</label
				>
				<input
					id="pfp"
					name="file"
					type="file"
					accept="image/png, image/jpeg, image/jpg"
					class="w-full rounded border border-fg/20 bg-bg px-3 py-2 outline-none focus:border-primary"
					required
				/>
			</div>
			<button
				type="submit"
				class="rounded-lg bg-primary px-8 py-2 transition hover:bg-primary-hover disabled:opacity-50"
				disabled={isUploading}
			>
				{isUploading ? 'Uploading...' : 'Upload'}
			</button>
		</form>

		{#if form?.pfpMessage}
			<div
				class="mt-4 rounded bg-bg p-3 text-sm font-bold {form?.pfpSuccess
					? 'text-primary'
					: 'text-error'}"
			>
				{form.pfpMessage}
			</div>
		{/if}
	</div>
{/snippet}

<div class="p-8">
	<!-- Flex User Profile -->
	<UserBanner
		username={data.user.username}
		displayName={data.user.displayName}
		pfpUrl={data.user.pfpUrl}
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
					{#if t === 'My Organizer Groups'}
						{@render orgGroupContent()}
					{:else if t === 'My Events'}
						{@render eventContent()}
					{:else if t === 'Settings'}
						{@render settingsContent()}
					{/if}
				</div>
			{/each}
		</div>
	</div>
</div>
