<script lang="ts">
	import MdiGroup from 'virtual:icons/mdi/account-group';
	import MdiEvent from 'virtual:icons/mdi/calendar';

	import MdiUserAdd from 'virtual:icons/mdi/account-plus';
	import MdiUser from 'virtual:icons/mdi/account';

	import { Tabs, Dialog } from 'melt/builders';
	import type { ActionData, PageServerData } from './$types';
	import UserBanner from '$lib/components/UserBanner.svelte';
	import CardItem from '$lib/components/CardItem.svelte';
	import { resolve } from '$app/paths';
	import type { SubmitFunction } from '@sveltejs/kit';
	import { enhance } from '$app/forms';
	import { page } from '$app/state';

	const { data, form }: { data: PageServerData; form: ActionData } = $props();

	// Tabs
	const tabNames = ['Group Members', 'Organized Events'] as const;
	type TabId = (typeof tabNames)[number];
	const orgManageTabs = new Tabs<TabId>({
		value: tabNames[0],
		orientation: 'vertical'
	});

	// Invite Dialog
	const inviteDialog = new Dialog({ closeOnOutsideClick: false });
	let inviteUsername: string | undefined = $state('');
	let searchedUser: { username: string; displayName: string; pfpUrl?: string } | null =
		$state(null);
	let isSendingInvite = $state(false);

	$effect(() => {
		if (!inviteUsername || inviteUsername.trim() === '') {
			searchedUser = null;
			return;
		}

		const timeout = setTimeout(async () => {
			try {
				const res = await fetch(`/api/users/profile/${inviteUsername}`);
				if (res.ok) {
					const fetchedUser = await res.json();
					searchedUser = {
						username: fetchedUser.username,
						displayName: fetchedUser.user_display_name,
						pfpUrl: fetchedUser.pfp_url
					};
				} else {
					searchedUser = null;
				}
			} catch {
				searchedUser = null;
			}
		}, 500);

		return () => clearTimeout(timeout);
	});

	const handleSendInvite: SubmitFunction = () => {
		isSendingInvite = true;
		return async ({ update }) => {
			isSendingInvite = false;
			await update();
			searchedUser = null;
			inviteUsername = '';
		};
	};

	const openInvite = () => {
		searchedUser = null;
		inviteUsername = '';
		inviteDialog.open = true;
	};

	function checkDuplicateInvite(username: string): boolean {
		return (
			data.members.joined.some((d) => d.username === username) ||
			data.members.invited.some((d) => d.username === username)
		);
	}
</script>

{#snippet tabIcon(tab: TabId)}
	{#if tab === 'Group Members'}
		<MdiGroup />
	{:else if tab === 'Organized Events'}
		<MdiEvent />
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
			{...inviteDialog.trigger}
			onclick={openInvite}
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

{#snippet eventsContent()}
	<div class="space-y-2">
		<a
			href={resolve(`/orgs/manage/${page.params.org_name}/events/new`)}
			class="flex w-fit items-center gap-x-2 rounded-lg bg-primary px-4 py-2 hover:bg-primary-hover"
		>
			<MdiEvent /> Create a new event
		</a>

		<span class="flex w-full items-center justify-center py-2">
			<hr class="w-full border border-fg/50" />
		</span>

		<div class="text-2xl font-bold">Organized Events ({data.events.length})</div>

		{#if data.events.length > 0}
			<div class="space-y-4">
				{#each data.events as e (e.eventSlug)}
					<CardItem
						type="ITEM"
						title={e.eventName}
						subtitle={e.eventSlug}
						clickLink={resolve(
							`/orgs/manage/${page.params.org_name}/events/edit/${e.eventSlug}`
						)}
					>
						{#snippet actionItems()}
							<div
								class="rounded px-3 py-1 text-sm {e.status === 'PUBLIC'
									? 'bg-primary'
									: 'bg-gray2'}"
							>
								{e.status}
							</div>
						{/snippet}
					</CardItem>
				{/each}
			</div>
		{:else}
			<div>None</div>
		{/if}
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
		<div {...orgManageTabs.triggerList} class="w-min min-w-1/5 space-y-1">
			{#each tabNames as t (t)}
				<button
					class="group w-full bg-transparent font-bold text-ellipsis whitespace-nowrap transition outline-none"
					{...orgManageTabs.getTrigger(t)}
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
				<div {...orgManageTabs.getContent(t)}>
					{#if t === 'Group Members'}
						{@render membersContent()}
					{:else if t === 'Organized Events'}
						{@render eventsContent()}
					{/if}
				</div>
			{/each}
		</div>
	</div>
</div>

<!-- Dialog Overlay -->
<div {...inviteDialog.overlay}></div>

<!-- Invite Dialog -->
<dialog
	{...inviteDialog.content}
	class="abs-center z-20 w-3/4 max-w-xl overflow-visible rounded-lg bg-bg p-4 text-fg shadow-md"
>
	<div class="space-y-2">
		<!-- Label -->
		<div class="text-lg font-bold">Invite a member</div>

		<!-- Horizontal Line -->
		<span class="flex w-full items-center justify-center py-2">
			<hr class="w-full border border-fg/50" />
		</span>

		<!-- Actual Menu -->
		<form
			method="post"
			action="?/invite"
			use:enhance={handleSendInvite}
			autocomplete="off"
			novalidate
			class="space-y-2"
		>
			<!-- Input Box -->
			<div class="w-full">
				<div class="flex items-center space-x-4 rounded-lg bg-gray1 px-4">
					<MdiUser />
					<div class="flex items-center">
						@
						<input
							name="username"
							type="text"
							class="w-full border-0 bg-transparent pl-0 ring-0 outline-none placeholder:text-fg/50 focus:ring-0"
							placeholder="username"
							bind:value={inviteUsername}
						/>
					</div>
				</div>
				{#if form?.validationError?.fieldErrors.username}
					<span class="text-sm text-error">
						{form?.validationError?.fieldErrors.username[0]}
					</span>
				{/if}
			</div>

			<!-- Display -->
			<CardItem
				type="USER"
				title={searchedUser?.displayName ?? '???'}
				subtitle={searchedUser?.username ?? '???'}
				imgSrc={searchedUser?.pfpUrl}
			/>

			<!-- Errors -->
			{#if searchedUser != null && checkDuplicateInvite(searchedUser.username)}
				<div class="text-center text-sm text-error">User already invited.</div>
			{/if}
			{#if form?.validationError?.formErrors}
				<div class="mx-auto w-max text-error">{form.validationError.formErrors[0]}</div>
			{/if}
			{#if form?.message}
				<div class="mx-auto w-max text-error">{form.message}</div>
			{/if}

			<!-- Confirmation Buttons -->
			<div class="flex justify-end gap-4">
				<button
					type="button"
					onclick={() => (inviteDialog.open = false)}
					class="rounded-lg bg-gray2 px-4 py-2"
				>
					Cancel
				</button>
				<button
					type="submit"
					class="rounded-lg bg-primary px-4 py-2 text-bg"
					disabled={isSendingInvite ||
						searchedUser == null ||
						checkDuplicateInvite(searchedUser.username)}
				>
					Invite
				</button>
			</div>
		</form>
	</div>
</dialog>

<style>
	dialog {
		opacity: 0;
		scale: 0.9;
		transition: all 200ms ease-in-out;
	}

	dialog::backdrop {
		display: none;
	}

	dialog[data-open] {
		opacity: 1;
		scale: 1;
	}

	[data-melt-dialog-overlay] {
		position: fixed;
		width: 100%;
		height: 100%;
		background: color-mix(in oklab, var(--color-fg) 50%, transparent);
		opacity: 0;
		transition: opacity 200ms ease-in-out;
	}

	[data-melt-dialog-overlay][data-open] {
		opacity: 1;
	}
</style>
