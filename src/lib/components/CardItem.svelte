<script lang="ts">
	import MdiUser from 'virtual:icons/mdi/account';
	import MdiNoImage from 'virtual:icons/mdi/image-off-outline';

	import { Avatar } from 'melt/builders';
	import type { Snippet } from 'svelte';

	type CardType = 'USER' | 'ITEM';

	interface CardData {
		type: CardType;
		imgSrc?: string;
		title: string;
		subtitle?: string;
		clickLink?: string;
		actionItems?: Snippet;
	}

	let { type, imgSrc = '', title, subtitle, clickLink, actionItems }: CardData = $props();

	const avatar = new Avatar({ src: () => imgSrc });

	const rounded = $derived(type === 'USER' ? 'rounded-full' : 'rounded-lg');

	let hovered = $state(false);
</script>

{#snippet card()}
	<div class="flex items-center gap-x-4">
		<!-- Avatar -->
		<div class="h-16 min-h-16 w-16 min-w-16 rounded-full">
			<img {...avatar.image} alt="" class="h-full w-full {rounded} object-cover" />
			<span
				{...avatar.fallback}
				class="flex h-full w-full items-center justify-center {rounded} bg-secondary text-bg"
			>
				{#if type === 'USER'}
					<MdiUser class="text-2xl" />
				{:else if type === 'ITEM'}
					<MdiNoImage class="text-2xl" />
				{/if}
			</span>
		</div>

		<!-- Names -->
		<div class="w-full">
			<div class="text-2xl font-bold">{title}</div>
			{#if subtitle}
				<div>{type === 'USER' ? '@' : ''}{subtitle}</div>
			{/if}
		</div>
	</div>
{/snippet}

<div
	class="carditem flex items-center gap-x-4 rounded-lg bg-gray1 px-4 py-2"
	class:bg-gray2={hovered}
>
	<div class="w-full">
		{#if clickLink}
			<!-- eslint-disable -->
			<a
				href={clickLink}
				onmouseenter={() => {
					hovered = true;
				}}
				onmouseleave={() => {
					hovered = false;
				}}
			>
				{@render card()}
			</a>
		{:else}
			{@render card()}
		{/if}
	</div>

	<!-- Action Items -->
	{#if actionItems}
		{@render actionItems()}
	{/if}
</div>

<style>
	.carditem {
		transition: all var(--default-transition-duration) ease-in-out;
	}
</style>
