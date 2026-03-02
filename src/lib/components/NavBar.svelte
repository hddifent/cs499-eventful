<script lang="ts">
	import MdiHome from 'virtual:icons/mdi/home';
	import MdiSearch from 'virtual:icons/mdi/magnify';
	import MdiAccount from 'virtual:icons/mdi/account';
	import MdiList from 'virtual:icons/mdi/invoice-list';

	import { Debounced } from 'runed';

	import { Avatar } from 'melt/builders';

	interface NavbarConfig {
		minimalInfoMode?: boolean;
	}

	let { minimalInfoMode = false }: NavbarConfig = $props();

	// TODO: replace this with real logic
	let isSignedIn = $state(false);
	let searchQuery = $state('');

	const avatar = new Avatar({ src: () => 'https://github.com/hddifent.png' });

	const handleShoppingListClick = () => {
		console.log('SPEND!!!');
	};

	const handleAvatarClick = () => {
		console.log('AVATAR!!!');
	};
</script>

<nav
	class="sticky top-0 z-50 flex items-center justify-between gap-8 bg-primary px-4 py-2 text-lg font-bold text-fg shadow-md"
>
	<!-- Left -->
	<div class="flex min-w-1/8 items-center gap-8 text-bg">
		<a href="/" class="py-2 text-2xl"><MdiHome /></a>
		{#if !minimalInfoMode}
			<a href="/events" class="py-2">Events</a>
			<!-- <button class="py-2">Manual</button> -->
		{/if}
	</div>

	{#if !minimalInfoMode}
		<!-- Center -->
		<div class="w-full max-w-1/2">
			<div class="flex items-center rounded-lg bg-bg px-4">
				<MdiSearch />
				<input
					type="text"
					class="w-full border-0 bg-transparent px-4 ring-0 outline-none placeholder:text-fg/50 focus:ring-0"
					placeholder="Search by anything..."
					bind:value={searchQuery}
				/>
			</div>
		</div>

		<!-- Right -->
		<div class="flex min-w-1/8 items-center justify-end gap-4 text-bg">
			{#if isSignedIn}
				<button onclick={handleShoppingListClick} class="py-2 text-2xl"><MdiList /></button>
				<button class="h-10 w-10 rounded-full bg-secondary" onclick={handleAvatarClick}>
					<img {...avatar.image} alt="" class="h-[inherit] rounded-full object-cover" />
					<span {...avatar.fallback}><MdiAccount class="w-full text-center text-xl" /></span>
				</button>
			{:else}
				<a href="/login" class="rounded-lg bg-secondary px-4 py-2"> Log In </a>
			{/if}
		</div>
	{/if}
</nav>
