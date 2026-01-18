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
					<CardSquare imgSrc="" title="Recomended 1" />
					<CardSquare imgSrc="" title="Recomended 2" />
					<CardSquare imgSrc="" title="Recomended 3" />
					<CardSquare imgSrc="https://github.com/hddifent.png" title="Recomended 4" />
					<CardSquare imgSrc="" title="Recomended 5" />
					<CardSquare imgSrc="https://github.com/anuken.png" title="Recomended 6" />
					<CardSquare imgSrc="" title="Recomended 7" />
				{:else if id === 'Upcoming'}
					<CardSquare imgSrc="" title="Upcoming 1" />
					<CardSquare imgSrc="" title="Upcoming 2" />
					<CardSquare imgSrc="https://github.com/saacsos.png" title="Upcoming 3" />
					<CardSquare imgSrc="" title="Upcoming 4" />
					<CardSquare imgSrc="" title="Upcoming 5" />
					<CardSquare imgSrc="" title="Upcoming 6" />
					<CardSquare imgSrc="" title="Upcoming 7" />
					<CardSquare imgSrc="" title="Upcoming 8" />
					<CardSquare imgSrc="" title="Upcoming 9" />
					<CardSquare imgSrc="" title="Upcoming 10" />
					<CardSquare imgSrc="" title="Upcoming 11" />
					<CardSquare imgSrc="" title="Upcoming 12" />
					<CardSquare imgSrc="" title="Upcoming 13" />
					<CardSquare imgSrc="" title="Upcoming 14" />
					<CardSquare imgSrc="" title="Upcoming 15" />
					<CardSquare imgSrc="" title="Upcoming 16" />
					<CardSquare imgSrc="" title="Upcoming 17" />
					<CardSquare imgSrc="" title="Upcoming 18" />
					<CardSquare imgSrc="" title="Upcoming 19" />
				{:else if id === 'Apply for Booth'}
					<CardSquare imgSrc="" title="Apply for Booth 1" />
					<CardSquare imgSrc="https://github.com/omise.png" title="Apply for Booth 2" />
					<CardSquare imgSrc="" title="Apply for Booth 3" />
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
