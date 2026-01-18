<script lang="ts">
	import { onMount, onDestroy } from 'svelte';

	import MdiCheck from 'virtual:icons/mdi/check';
	import MdiDown from 'virtual:icons/mdi/chevron-down';
	import MdiUp from 'virtual:icons/mdi/chevron-up';

	import {
		Combobox,
		type ComboboxRootProps,
		useListCollection
	} from '@skeletonlabs/skeleton-svelte';

	interface ComboboxItem {
		label: string;
		aliases: string[];
	}

	interface ComboboxData {
		items: ComboboxItem[];
		selectedItems?: string[];
	}

	let { items = $bindable(), selectedItems = $bindable([]) }: ComboboxData = $props();

	let rootElement: HTMLElement | null = null;
	let itemListElement: HTMLElement[] = $state([]);

	onMount(() => {
		const onPointerDown = (event: PointerEvent) => {
			if (!rootElement) {
				return;
			}
			if (!rootElement!.contains(event.target as Node)) {
				isBoxOpened = false;
				highlightedItem = null;
			}
		};

		document.addEventListener('pointerdown', onPointerDown);
		onDestroy(() => {
			document.removeEventListener('pointerdown', onPointerDown);
		});
	});

	let searchingItems = $state(items);
	const searchingCollection = $derived(
		useListCollection({
			items: searchingItems,
			itemToString: (item) => item.label,
			itemToValue: (item) => item.aliases[0]
		})
	);
	let highlightedItem: string | null = $state(null);
	let isBoxOpened = $state(false);

	const onInputValueChange: ComboboxRootProps['onInputValueChange'] = (event) => {
		isBoxOpened = event.inputValue !== '';
		searchingItems = items.filter((item) =>
			item.aliases.some((alias) => alias.toLowerCase().includes(event.inputValue.toLowerCase()))
		);
		highlightedItem = searchingItems.length > 0 ? searchingItems[0].aliases[0] : null;
	};

	const onValueChange: ComboboxRootProps['onValueChange'] = (event) => {
		isBoxOpened = false;
		highlightedItem = null;
		selectedItems = event.value;
	};

	const onKeyDown: ComboboxRootProps['onkeydown'] = (event) => {
		if (!isBoxOpened || searchingItems.length === 0) {
			return;
		}

		const currentIndex = highlightedItem
			? searchingItems.findIndex((item) => item.aliases[0] === highlightedItem)
			: -1;
		const allowedKeys = ['ArrowDown', 'ArrowUp', 'Enter', 'Escape'];

		if (allowedKeys.includes(event.key)) {
			event.preventDefault();

			if (event.key === 'ArrowDown') {
				let next = (currentIndex + 1) % searchingItems.length;
				highlightedItem = searchingItems[next].aliases[0];

				itemListElement[next]?.scrollIntoView({ block: 'nearest' });
			} else if (event.key === 'ArrowUp') {
				let next = currentIndex - 1;
				next = next < 0 ? searchingItems.length - 1 : next;
				highlightedItem = searchingItems[next].aliases[0];

				itemListElement[next]?.scrollIntoView({ block: 'nearest' });
			} else if (event.key === 'Enter' && highlightedItem) {
				if (!selectedItems.includes(highlightedItem)) {
					selectedItems = [...selectedItems, highlightedItem];
				} else {
					selectedItems = selectedItems.filter((si) => si !== highlightedItem);
				}
			} else if (event.key === 'Escape') {
				isBoxOpened = false;
				highlightedItem = null;
			}
		}
	};

	const handleClearItems = () => {
		selectedItems = [];
	};
</script>

<div class="w-full space-y-2" bind:this={rootElement}>
	<Combobox
		placeholder="Add a tag..."
		value={selectedItems}
		collection={searchingCollection}
		{onInputValueChange}
		{onValueChange}
		onkeydown={onKeyDown}
		inputBehavior="autohighlight"
		multiple
		open={isBoxOpened}
		highlightedValue={highlightedItem}
	>
		<!-- Inputs -->
		<Combobox.Control class="flex items-center gap-2 rounded-lg bg-gray2 pr-1 text-fg">
			<Combobox.Input
				class="border-0 bg-transparent ring-0 outline-none placeholder:text-fg/50 focus:ring-0"
			/>
			<button
				onclick={() => {
					isBoxOpened = !isBoxOpened;
				}}
				class="rounded-lg p-1 hover:bg-fg/10"
			>
				{#if isBoxOpened}
					<MdiUp />
				{:else}
					<MdiDown />
				{/if}
			</button>

			<!-- Clear -->
			<button
				onclick={handleClearItems}
				disabled={selectedItems.length === 0}
				class="bg-gray-1 w-fit rounded-lg bg-gray2 px-2 py-1 text-sm text-fg hover:bg-error hover:text-bg disabled:cursor-not-allowed disabled:hover:bg-transparent disabled:hover:text-fg"
			>
				Clear
			</button>
		</Combobox.Control>

		<!-- Contents -->
		{#if isBoxOpened}
			<Combobox.Positioner>
				<div
					class="combobox-options z-30 max-h-60 space-y-1 overflow-y-auto scroll-smooth rounded-lg border-0 bg-gray2 p-2 text-fg shadow-md ring-0 outline-none"
				>
					{#each searchingItems as item, i (item.aliases[0])}
						<button
							class="flex w-full items-center justify-between rounded-md px-2 py-1 ring-0 outline-none focus:ring-0"
							class:is-highlighted={highlightedItem === item.aliases[0]}
							class:is-selected={selectedItems.includes(item.aliases[0])}
							onmouseenter={() => {
								highlightedItem = item.aliases[0];
							}}
							onmouseleave={() => {
								if (highlightedItem === item.aliases[0]) {
									highlightedItem = null;
								}
							}}
							onclick={() => {
								if (!selectedItems.includes(item.aliases[0])) {
									selectedItems = [...selectedItems, item.aliases[0]];
								} else {
									selectedItems = selectedItems.filter((si) => si !== item.aliases[0]);
								}
							}}
							bind:this={itemListElement[i]}
						>
							<span>{item.label}</span>
							{#if selectedItems.includes(item.aliases[0])}
								<MdiCheck class="text-xl" />
							{/if}
						</button>
					{/each}
				</div>
			</Combobox.Positioner>
		{/if}
	</Combobox>

	<!-- Selected Item Chips -->
	{#if selectedItems.length > 0}
		<div class="flex flex-wrap gap-2">
			{#each selectedItems as item (item)}
				<button
					class="rounded-full bg-gray1 px-4 py-1 text-sm hover:bg-error hover:text-bg"
					onclick={() => {
						selectedItems = selectedItems.filter((si) => si !== item);
					}}
				>
					{item}
				</button>
			{/each}
		</div>
	{/if}
</div>

<style>
	.is-selected {
		background-color: var(--color-primary);
		color: var(--color-bg);
	}

	.is-highlighted {
		background-color: color-mix(in oklab, var(--color-primary) 50%, transparent);
	}

	.combobox-options::-webkit-scrollbar {
		width: 8px;
	}

	.combobox-options::-webkit-scrollbar-track {
		background: transparent;
	}

	.combobox-options::-webkit-scrollbar-thumb {
		background-color: color-mix(in oklab, var(--color-fg) 25%, transparent);
		border-radius: calc(infinity * 1px);
	}

	.combobox-options::-webkit-scrollbar-thumb:hover {
		background-color: color-mix(in oklab, var(--color-fg) 50%, transparent);
	}

	.combobox-options {
		scrollbar-width: thin;
		scrollbar-color: color-mix(in oklab, var(--color-fg) 50%, transparent) transparent;
	}
</style>
