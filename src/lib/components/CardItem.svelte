<script lang="ts">
	import MdiUser from 'virtual:icons/mdi/account';
	import MdiNoImage from 'virtual:icons/mdi/image-off-outline';

	import { Avatar } from 'melt/builders';

	type CardType = 'USER' | 'ITEM';

	interface CardData {
		type: CardType;
		imgSrc?: string;
		title: string;
		subtitle?: string;
		clickLink?: string;
	}

	let { type, imgSrc = '', title, subtitle, clickLink }: CardData = $props();

	const avatar = new Avatar({ src: () => imgSrc });

	const rounded = $derived(type === 'USER' ? 'rounded-full' : 'rounded-lg');
</script>

{#snippet card()}
	<div class="flex items-center gap-x-4 rounded-lg bg-gray1 px-4 py-2">
		<!-- Avatar -->
		<div class="h-16 w-16 rounded-full">
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
		<div>
			<div class="text-2xl font-bold">{title}</div>
			{#if subtitle}
				<div>{type === 'USER' ? '@' : ''}{subtitle}</div>
			{/if}
		</div>
	</div>
{/snippet}

<div class="rounded-lg">
	{#if clickLink}
		<!-- eslint-disable-next-line -->
		<a href={clickLink}>
			{@render card()}
		</a>
	{:else}
		{@render card()}
	{/if}
</div>
