<script lang="ts">
	import MdiGeneral from 'virtual:icons/mdi/information';
	import MdiMap from 'virtual:icons/mdi/map';

	import { Tabs } from 'melt/builders';
	import type { ActionData, PageServerData } from './$types';
	import { page } from '$app/state';
	import EventInfoForm from '$lib/components/EventInfoForm.svelte';
	import Toaster from '$lib/components/Toaster.svelte';
	import { addToast } from '$lib/components/Toaster.svelte';
	import EventMapManager from '$lib/components/EventMapManager.svelte';

	const { data, form }: { data: PageServerData; form: ActionData } = $props();

	// Tabs
	const tabNames = [
		'General Information',
		'Event Map',
		'Event Applications',
		'Booth Management'
	] as const;
	type TabId = (typeof tabNames)[number];
	const orgManageTabs = new Tabs<TabId>({
		value: tabNames[0],
		orientation: 'vertical',
		onValueChange: clearMessage
	});

	function clearMessage() {
		if (!form) return;
		form.message = '';
	}

	function isMenuDisabled(tab: TabId): boolean {
		const publicFirst: TabId[] = ['Event Applications', 'Booth Management'];
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
	{/if}
{/snippet}

{#snippet generalInformationTab()}
	<div class="space-y-4 rounded-lg bg-gray1 p-6 shadow-md">
		<div class="flex items-center justify-between">
			<div class="text-xl font-bold">Basic Information</div>
			<span
				class="rounded-full px-3 py-1 text-sm {data.general.eventStatus === 'PUBLIC'
					? 'bg-primary'
					: 'bg-gray2'}"
			>
				{data.general.eventStatus}
			</span>
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
					{:else}
						{t} Contents
					{/if}
				</div>
			{/each}
		</div>
	</div>
</div>

<Toaster />
