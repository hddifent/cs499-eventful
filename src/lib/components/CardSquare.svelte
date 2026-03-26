<script lang="ts">
	import MdiNoImage from 'virtual:icons/mdi/image-off-outline';

	import { Avatar } from 'melt/builders';

	type DataImportance = 'title' | 'subtitle' | 'description';

	const textClass: Record<DataImportance, string> = {
		title: 'font-black truncate',
		subtitle: 'text-secondary font-bold text-sm line-clamp-2',
		description: 'text-fg/80 text-sm line-clamp-3'
	};

	interface DisplayData {
		text: string;
		importance: DataImportance;
	}

	interface CardData {
		imgSrc?: string;
		clickLink?: string;
		data?: DisplayData[];
	}

	let { imgSrc = '', clickLink, data = [] }: CardData = $props();

	const avatar = new Avatar({ src: () => imgSrc });
</script>

{#snippet card()}
	<!-- Cover Image -->
	<div class="h-32 rounded-t-lg bg-gray2">
		<img {...avatar.image} alt="" class="h-[inherit] w-full rounded-t-lg object-cover" />
		<span
			{...avatar.fallback}
			class="flex h-[inherit] items-center justify-center gap-4 text-fg/50"
		>
			<MdiNoImage class="text-2xl" />
			<p class="text-lg">NO IMAGE</p>
		</span>
	</div>

	<!-- Descriptions -->
	<div class="h-fit overflow-clip rounded-b-lg bg-gray1 px-4 py-2 text-ellipsis shadow-md">
		{#each data as d (d)}
			<div class={textClass[d.importance]}>{d.text}</div>
		{/each}
	</div>
{/snippet}

<div class="rounded-lg">
	{#if clickLink}
		<a href={clickLink}>
			{@render card()}
		</a>
	{:else}
		{@render card()}
	{/if}
</div>
