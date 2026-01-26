<script lang="ts">
	import MdiNoImage from 'virtual:icons/mdi/image-off-outline';

	import { Avatar } from 'melt/builders';

	type DataImportance = 'title' | 'subtitle' | 'description';

	const textClass: Record<DataImportance, string> = {
		title: 'font-black',
		subtitle: 'text-secondary text-sm',
		description: 'text-fg/80 text-sm'
	};

	interface DisplayData {
		text: string;
		importance: DataImportance;
	}

	interface CardData {
		imgSrc?: string;
		data?: DisplayData[];
		href?: string;
	}

	let { imgSrc = '', data = [], href }: CardData = $props();

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
		{#each data as d}
			<div class={textClass[d.importance]}>{d.text}</div>
		{/each}
	</div>
{/snippet}

<div class="rounded-lg">
	{#if href}
		<a {href}>
			{@render card()}
		</a>
	{:else}
		{@render card()}
	{/if}
</div>
