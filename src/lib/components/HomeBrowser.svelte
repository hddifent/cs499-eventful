<script lang="ts">
	import CardSquare from './CardSquare.svelte';
	import GridDisplay from './GridDisplay.svelte';

	import { Tabs } from 'melt/builders';

	const tabNames = ['Recomended', 'Upcoming', 'Apply for Booth'] as const;
	type TabId = (typeof tabNames)[number];
	const tabs = new Tabs<TabId>({
		value: tabNames[0]
	});
</script>

<!-- Tab Buttons -->
<div
	{...tabs.triggerList}
	class="flex w-full flex-wrap items-center justify-center gap-x-16 gap-y-8 overflow-x-clip"
>
	{#each tabNames as id}
		<button
			class="group max-w-full min-w-0 bg-transparent font-bold text-ellipsis whitespace-nowrap transition outline-none"
			{...tabs.getTrigger(id)}
		>
			<div
				class="overflow-clip px-4 transition group-data-active:text-primary group-[&:not([data-active]):hover]:text-secondary"
			>
				{id}
			</div>
		</button>
	{/each}
</div>

<!-- Horizontal Line -->
<span class="flex w-full items-center justify-center px-16 py-4">
	<hr class="w-full border border-fg/50" />
</span>

<!-- Tab Contents -->
{#each tabNames as id}
	<div {...tabs.getContent(id)}>
		<div class="mx-auto w-10/12">
			<GridDisplay>
				{#if id === 'Recomended'}
					<CardSquare data={[{ text: 'Recomended 1', importance: 'title' }]} />
					<CardSquare data={[{ text: 'Recomended 2', importance: 'title' }]} />
					<CardSquare data={[{ text: 'Recomended 3', importance: 'title' }]} />
					<CardSquare
						imgSrc="https://github.com/hddifent.png"
						data={[{ text: 'Recomended 4', importance: 'title' }]}
					/>
					<CardSquare data={[{ text: 'Recomended 5', importance: 'title' }]} />
					<CardSquare
						imgSrc="https://github.com/anuken.png"
						data={[{ text: 'Recomended 6', importance: 'title' }]}
					/>
					<CardSquare data={[{ text: 'Recomended 7', importance: 'title' }]} />
				{:else if id === 'Upcoming'}
					<CardSquare data={[{ text: 'Upcoming 1', importance: 'title' }]} />
					<CardSquare data={[{ text: 'Upcoming 2', importance: 'title' }]} />
					<CardSquare data={[{ text: 'Upcoming 3', importance: 'title' }]} />
					<CardSquare data={[{ text: 'Upcoming 4', importance: 'title' }]} />
				{:else if id === 'Apply for Booth'}
					<CardSquare data={[{ text: 'Apply for Booth 1', importance: 'title' }]} />
					<CardSquare data={[{ text: 'Apply for Booth 2', importance: 'title' }]} />
					<CardSquare data={[{ text: 'Apply for Booth 3', importance: 'title' }]} />
					<CardSquare data={[{ text: 'Apply for Booth 4', importance: 'title' }]} />
					<CardSquare data={[{ text: 'Apply for Booth 5', importance: 'title' }]} />
					<CardSquare data={[{ text: 'Apply for Booth 6', importance: 'title' }]} />
					<CardSquare data={[{ text: 'Apply for Booth 7', importance: 'title' }]} />
					<CardSquare data={[{ text: 'Apply for Booth 8', importance: 'title' }]} />
					<CardSquare data={[{ text: 'Apply for Booth 9', importance: 'title' }]} />
					<CardSquare data={[{ text: 'Apply for Booth 10', importance: 'title' }]} />
					<CardSquare data={[{ text: 'Apply for Booth 11', importance: 'title' }]} />
				{:else}
					<span>Something went wrong... Terribly wrong...</span>
				{/if}
			</GridDisplay>
		</div>
	</div>
{/each}

<style>
	.display-grid {
		grid-template-columns: repeat(auto-fill, minmax(calc(var(--spacing) * 60), 1fr));
	}
</style>
