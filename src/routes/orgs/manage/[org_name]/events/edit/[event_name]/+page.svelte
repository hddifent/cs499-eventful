<script lang="ts">
	import MdiGeneral from 'virtual:icons/mdi/information';
	import MdiMap from 'virtual:icons/mdi/map';
	import MdiAccountMultiple from 'virtual:icons/mdi/account-multiple';

	import { Tabs } from 'melt/builders';
	import type { ActionData, PageServerData } from './$types';
	import { page } from '$app/state';
	import EventInfoForm from '$lib/components/EventInfoForm.svelte';
	import Toaster from '$lib/components/Toaster.svelte';
	import { addToast } from '$lib/components/Toaster.svelte';
	import EventMapManager from '$lib/components/EventMapManager.svelte';
	import { enhance } from '$app/forms';
	import CardItem from '$lib/components/CardItem.svelte';
	import { resolve } from '$app/paths';

	const { data, form }: { data: PageServerData; form: ActionData } = $props();

	// Tabs
	const tabNames = ['General Information', 'Event Map', 'Event Applications'] as const;
	type TabId = (typeof tabNames)[number];
	const orgManageTabs = new Tabs<TabId>({
		value: tabNames[0],
		orientation: 'vertical',
		onValueChange: clearMessage
	});

	// Booths
	let availableBooths = $derived.by(() => {
		if (!data.map.boothData) return [];

		const allBooths = Object.keys(data.map.boothData);
		const takenBooths = data.applications
			.filter((app) => app.status === 'ACCEPTED' && app.assigned_booth)
			.map((app) => app.assigned_booth as string);

		return allBooths.filter((booth) => !takenBooths.includes(booth)).toSorted();
	});

	let pendingApps = $derived(data.applications.filter((app) => app.status === 'PENDING'));
	let acceptedApps = $derived(data.applications.filter((app) => app.status === 'ACCEPTED'));

	function clearMessage() {
		if (!form) return;
		form.message = '';
	}

	function isMenuDisabled(tab: TabId): boolean {
		const publicFirst: TabId[] = ['Event Applications'];
		if (data.general.eventStatus === 'DRAFT') {
			return publicFirst.includes(tab);
		}
		return false;
	}

	function updateSuccess() {
		addToast({
			data: {
				title: 'Success',
				description: 'The event is updated.'
			}
		});
	}

	$effect(() => {
		if (form?.success) {
			updateSuccess();
		}
	});
</script>

{#snippet tabIcon(tab: TabId)}
	{#if tab === 'General Information'}
		<MdiGeneral />
	{:else if tab === 'Event Map'}
		<MdiMap />
	{:else if tab === 'Event Applications'}
		<MdiAccountMultiple />
	{/if}
{/snippet}

{#snippet generalInformationTab()}
	<div class="space-y-4 rounded-lg bg-gray1 p-6 shadow-md">
		<div class="flex items-center justify-between">
			<div class="text-xl font-bold">Basic Information</div>
			<div class="flex items-center space-x-2">
				<span
					class="rounded-full px-3 py-1 text-sm {data.general.eventStatus === 'PUBLIC'
						? 'bg-primary'
						: 'bg-gray2'} w-fit"
				>
					{data.general.eventStatus}
				</span>
				<form
					method="post"
					action="?/publishEvent"
					use:enhance={() => {
						return async ({ update }) => {
							await update();
						};
					}}
				>
					<button
						type="submit"
						class="rounded-lg bg-primary px-4 py-2 font-bold text-bg shadow-md transition hover:bg-primary-hover disabled:opacity-50"
						disabled={data.general.eventStatus === 'PUBLIC'}
					>
						{data.general.eventStatus === 'PUBLIC'
							? 'Event Published'
							: 'Publish Event'}
					</button>
				</form>
			</div>
		</div>

		<span class="flex w-full items-center justify-center">
			<hr class="w-full border border-fg/50" />
		</span>

		{#key form || data}
			<EventInfoForm
				action="?/updateBasicInfo"
				submitText="Save Changes"
				loadingText="Saving..."
				initialData={{
					eventName: form?.data?.eventName ?? data.general.eventName,
					eventDesc: form?.data?.eventDesc ?? data.general.eventDesc,
					eventLoc: form?.data?.eventLoc ?? data.general.eventLoc,
					eventApplicationLink:
						form?.data?.eventApplicationLink ?? data.general.eventApplicationLink,
					applicationPeriodStart:
						form?.data?.applicationPeriodStart ?? data.general.applicationPeriodStart,
					applicationPeriodEnd:
						form?.data?.applicationPeriodEnd ?? data.general.applicationPeriodEnd,
					eventDays: form?.data?.eventDays ?? data.general.eventDays
				}}
				fieldErrors={form?.validationError?.fieldErrors || {}}
				formError={form?.validationError?.formErrors?.[0] || ''}
				message={form?.message || ''}
			/>
		{/key}
	</div>
{/snippet}

{#snippet eventMapTab()}
	<EventMapManager
		action="?/updateEventMap"
		initialDisplayMapUrl={data.map.displayMapUrl}
		initialBoothData={data.map.boothData}
	/>
{/snippet}

{#snippet eventApplicationsTab()}
	<div class="space-y-4">
		<div class="space-y-4 rounded-lg bg-gray1 p-6 shadow-md">
			<h2 class="text-xl font-bold">
				Pending Applications ({pendingApps.length})
			</h2>

			<span class="flex w-full items-center justify-center">
				<hr class="w-full border border-fg/50" />
			</span>

			{#if pendingApps.length === 0}
				<p class="text-fg/70 italic">No pending applications.</p>
			{:else}
				<div class="space-y-4">
					{#each pendingApps as app}
						<CardItem
							type="USER"
							title={app.user.user_display_name}
							subtitle={app.user.username}
							imgSrc={app.user.pfp_url}
							clickLink={resolve(`/users/${app.user.username}`)}
						>
							{#snippet actionItems()}
								<form
									method="post"
									action="?/assignBooth"
									class="flex gap-2"
									use:enhance={() => {
										return async ({ update }) => {
											await update();
										};
									}}
								>
									<input
										type="hidden"
										name="username"
										value={app.user.username}
									/>
									<select
										name="assignedBooth"
										required
										class="rounded border border-fg/20 bg-bg px-3 py-2 pr-8 outline-none focus:border-primary"
									>
										<option value="" disabled selected>Select Booth...</option>
										{#each availableBooths as booth}
											<option value={booth}>{booth}</option>
										{/each}
									</select>
									<button
										type="submit"
										class="w-max rounded bg-primary px-4 py-2 font-bold text-bg transition hover:bg-primary-hover disabled:opacity-50"
										disabled={availableBooths.length === 0}
									>
										Assign & Accept
									</button>
								</form>
							{/snippet}
						</CardItem>
					{/each}
				</div>
			{/if}
		</div>

		<div class="space-y-4 rounded-lg bg-gray1 p-6 shadow-md">
			<h2 class="text-xl font-bold">
				Assigned Booths ({acceptedApps.length})
			</h2>

			<span class="flex w-full items-center justify-center">
				<hr class="w-full border border-fg/50" />
			</span>

			{#if acceptedApps.length === 0}
				<p class="text-fg/70 italic">No booths assigned yet.</p>
			{:else}
				<div class="grid grid-cols-1 gap-4 lg:grid-cols-2">
					{#each acceptedApps as app}
						<CardItem
							type="USER"
							title={app.user.user_display_name}
							subtitle={app.user.username}
							imgSrc={app.user.pfp_url}
							clickLink={resolve(`/users/${app.user.username}`)}
						>
							{#snippet actionItems()}
								<div
									class="rounded bg-primary/20 px-3 py-1 font-bold whitespace-nowrap text-primary"
								>
									Booth {app.assigned_booth}
								</div>
							{/snippet}
						</CardItem>
					{/each}
				</div>
			{/if}
		</div>
	</div>
{/snippet}

<div class="p-8">
	<div class="space-y-2">
		<div class="text-2xl">@{page.params.org_name}</div>
		<div class="text-5xl font-bold">{data.general.eventName}</div>
	</div>

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
					disabled={isMenuDisabled(t)}
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
					{#if t === 'General Information'}
						{@render generalInformationTab()}
					{:else if t === 'Event Map'}
						{@render eventMapTab()}
					{:else if t === 'Event Applications'}
						{@render eventApplicationsTab()}
					{:else}
						{t} Contents
					{/if}
				</div>
			{/each}
		</div>
	</div>
</div>

<Toaster />
