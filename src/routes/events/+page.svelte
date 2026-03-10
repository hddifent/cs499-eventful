<script lang="ts">
	import TopCard from '$lib/components/TopCard.svelte';
	import CardSquare from '$lib/components/CardSquare.svelte';
	import GridDisplay from '$lib/components/GridDisplay.svelte';
	import MultipleCombobox from '$lib/components/MultipleCombobox.svelte';

	import MdiFilter from 'virtual:icons/mdi/filter';
	import MdiTag from 'virtual:icons/mdi/tag';
	import MdiCalendar from 'virtual:icons/mdi/calendar';
	import MdiStatus from 'virtual:icons/mdi/tooltip-question';
	import MdiSort from 'virtual:icons/mdi/sort-ascending';

	import { Dialog } from 'melt/builders';

	import type { PageData } from './$types';

	// Loaded data from API
	const { data }: { data: PageData } = $props();

	// Dialog Setups
	const filterDialog = new Dialog({ closeOnOutsideClick: false });

	// Tags
	const tags = [
		{ label: 'Cosplay OK', aliases: ['cosplay ok'] },
		{ label: 'Only-Event', aliases: ['only event', 'only-event'] },
		{ label: 'Comic', aliases: ['comic'] },
		{ label: 'Handmade', aliases: ['handmade'] },
		{ label: 'Other', aliases: ['other', '...'] }
	].sort((a, b) => (a.label > b.label ? 1 : -1));

	let selectedTags: string[] = $state([]);
	let appliedTags: string[] = $state([]);

	const applyFilter = () => {
		appliedTags = selectedTags;
		filterDialog.open = false;
	};

	const resetFilter = () => {
		selectedTags = [];
	};

	const openFilter = () => {
		selectedTags = appliedTags;
		filterDialog.open = true;
	};
</script>

<TopCard
	imgSrc="https://github.com/hddifent.png"
	title="Events"
	desc="Discover events happening right now."
/>

<div class="py-8">
	<div class="mx-auto w-10/12">
		<!-- Filter Button -->
		<button
			{...filterDialog.trigger}
			onclick={openFilter}
			class="flex items-center justify-center gap-4 rounded-lg bg-primary px-4 py-2 text-bg shadow-md ring-0 outline-none focus:ring-0"
		>
			<MdiFilter />
			<p class="font-bold">Filters</p>
		</button>

		<span class="flex w-full items-center justify-center py-2"></span>

		<!-- Events Display -->
		<GridDisplay>
			{#each data.events as event}
				<CardSquare
					data={[
						{ text: event.title, importance: 'title' },
						{ text: event.description, importance: 'description' }
					]}
				/>
			{/each}
		</GridDisplay>
	</div>
</div>

<!-- Dialog Overlay -->
<div {...filterDialog.overlay}></div>

<!-- Filter Dialog -->
<dialog
	{...filterDialog.content}
	class="abs-center z-20 w-3/4 max-w-xl overflow-visible rounded-lg bg-bg p-4 text-fg shadow-md"
>
	<div class="space-y-2">
		<!-- Label -->
		<div class="text-lg font-bold">Filters</div>

		<!-- Horizontal Line -->
		<span class="flex w-full items-center justify-center py-2">
			<hr class="w-full border border-fg/50" />
		</span>

		<!-- Actual Menu -->
		<!-- Tags -->
		<div class="flex gap-x-4">
			<div class="mt-1 flex w-1/6 gap-x-2">
				<MdiTag />
				<p>Tags</p>
			</div>
			<MultipleCombobox items={tags} bind:selectedItems={selectedTags} />
		</div>

		<!-- Date -->
		<div class="flex gap-x-4">
			<div class="mt-1 flex w-1/6 gap-x-2">
				<MdiCalendar />
				<p>Date</p>
			</div>
		</div>

		<!-- Status -->
		<div class="flex gap-x-4">
			<div class="mt-1 flex w-1/6 gap-x-2">
				<MdiStatus />
				<p>Status</p>
			</div>
		</div>

		<!-- Sort -->
		<div class="flex gap-x-4">
			<div class="mt-1 flex w-1/6 gap-x-2">
				<MdiSort />
				<p>Sort By</p>
			</div>
		</div>

		<!-- Confirmation Buttons -->
		<div class="flex justify-end gap-4">
			<button onclick={() => (filterDialog.open = false)} class="rounded-lg bg-gray2 px-4 py-2">
				Cancel
			</button>
			<button onclick={resetFilter} class="rounded-lg bg-error px-4 py-2 text-bg">Reset</button>
			<button onclick={applyFilter} class="rounded-lg bg-primary px-4 py-2 text-bg">Apply</button>
		</div>
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
