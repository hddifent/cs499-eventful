<script lang="ts">
	import MdiHome from 'virtual:icons/mdi/home';
	import MdiSearch from 'virtual:icons/mdi/magnify';
	import MdiAccount from 'virtual:icons/mdi/account';
	import MdiList from 'virtual:icons/mdi/invoice-list';
	import MdiLogin from 'virtual:icons/mdi/login';
	import MdiLogout from 'virtual:icons/mdi/logout';

	import { Avatar, Popover } from 'melt/builders';
	import { scale } from 'svelte/transition';
	import { resolve } from '$app/paths';
	import { invalidateAll } from '$app/navigation';

	interface NavbarConfig {
		isLoggedIn: boolean;
		profilePicUrl?: string;
		minimalInfoMode?: boolean;
	}

	let { isLoggedIn, profilePicUrl, minimalInfoMode = false }: NavbarConfig = $props();

	let searchQuery = $state('');

	const avatar = new Avatar({ src: () => profilePicUrl ?? '' });
	const userMenu = new Popover({
		floatingConfig: {
			computePosition: {
				placement: 'bottom-end',
				strategy: 'fixed'
			}
		}
	});

	const handleShoppingListClick = () => {
		console.log('SPEND!!!');
	};
</script>

<nav
	class="sticky top-0 z-50 flex items-center justify-between gap-8 bg-primary px-4 py-2 text-lg font-bold text-fg shadow-md"
>
	<!-- Left -->
	<div class="flex min-w-1/8 items-center gap-8 text-bg">
		<a href={resolve('/')} class="py-2 text-2xl"><MdiHome /></a>
		{#if !minimalInfoMode}
			<a href={resolve('/events')} class="py-2">Events</a>
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
			{#if isLoggedIn}
				<!-- Logged IN -->
				<button {...userMenu.trigger} class="h-10 w-10 rounded-full bg-secondary">
					<img {...avatar.image} alt="" class="h-full w-full rounded-full object-cover" />
					<span
						{...avatar.fallback}
						class="flex h-full w-full items-center justify-center rounded-full bg-secondary text-bg"
					>
						<MdiAccount class="text-xl" />
					</span>
				</button>

				{#if userMenu.open}
					<div
						{...userMenu.content}
						class="popup-content min-w-40 space-y-2 rounded-lg bg-gray1 p-4 text-base font-normal text-fg shadow-md"
						transition:scale={{ duration: 200, start: 0.9 }}
					>
						<a
							href={resolve('/account')}
							class="flex items-center gap-x-2"
							data-sveltekit-preload-data="off"
							onclick={() => {
								userMenu.open = false;
							}}
						>
							<MdiAccount /> My Profile
						</a>

						<hr class="w-full border border-fg/50" />

						<form action="/logout" method="POST">
							<button
								class="flex items-center gap-x-2 text-error"
								onclick={async () => {
									await invalidateAll();
								}}
							>
								<MdiLogout /> Logout
							</button>
						</form>
					</div>
				{/if}
			{:else}
				<!-- Logged OUT -->
				<a
					href={resolve('/login')}
					class="flex items-center gap-x-2 rounded-lg bg-secondary px-4 py-2"
				>
					<MdiLogin class="text-xl" /> Log In
				</a>
			{/if}
		</div>
	{/if}
</nav>
