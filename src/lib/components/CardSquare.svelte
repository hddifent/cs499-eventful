<script lang="ts">
	import MdiNoImage from 'virtual:icons/mdi/image-off-outline';

	import { Avatar } from 'melt/builders';

	interface CardData {
		imgSrc: string;
		title: string;
	}

	let { imgSrc, title, ...data }: CardData = $props();

	const avatar = new Avatar({ src: () => imgSrc });
</script>

<div class="rounded-lg">
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
		<span class="font-black">{title}</span>
	</div>
</div>
