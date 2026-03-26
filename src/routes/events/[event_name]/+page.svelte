<script lang="ts">
	import { enhance } from '$app/forms';
	import type { ActionData, PageServerData } from './$types';
	import MdiLocation from 'virtual:icons/mdi/map-marker';
	import MdiCalendar from 'virtual:icons/mdi/calendar';
	import MdiClock from 'virtual:icons/mdi/clock-outline';
	import MdiInformation from 'virtual:icons/mdi/information-outline';

	let { data, form }: { data: PageServerData; form: ActionData } = $props();

	const acceptedBoothsMap = new Map(
		data.event.accepted_booths.map((app) => [app.assigned_booth, app.user])
	);

	type UserProfile = { username: string; user_display_name: string; pfp_url: string };
	let selectedBooth: { label: string; user: UserProfile | null } | null = $state(null);

	let displayBoothImageElement: HTMLImageElement | null = $state(null);
	let imgNaturalWidth: number = $state(0);
	let imgNaturalHeight: number = $state(0);

	const handleImageLoad = () => {
		if (displayBoothImageElement) {
			imgNaturalWidth = displayBoothImageElement.naturalWidth;
			imgNaturalHeight = displayBoothImageElement.naturalHeight;
		}
	};

	const now = new Date();
	const appStart = new Date(data.event.event_application_accept_start);
	const appEnd = new Date(data.event.event_application_accept_end);

	const isAppOpen = now >= appStart && now <= appEnd;
	const isAppFuture = now < appStart;
	const isAppPast = now > appEnd;

	let buttonText = 'Request Booth Space';
	if (isAppFuture) buttonText = 'Applications Open Soon';
	if (isAppPast) buttonText = 'Applications Closed';
</script>

{#snippet boothDetailsCard()}
	{#if selectedBooth}
		<div class="mt-4 space-y-2 rounded-lg border-0 bg-gray2 p-4 shadow-md transition-all">
			<div class="text-xl font-bold">
				Booth {selectedBooth.label}
			</div>

			<span class="flex w-full items-center justify-center">
				<hr class="w-full border border-fg/50" />
			</span>

			{#if selectedBooth.user}
				<div class="flex items-center gap-4">
					{#if selectedBooth.user.pfp_url}
						<img
							src={selectedBooth.user.pfp_url}
							alt="Profile"
							class="h-16 w-16 rounded-full object-cover shadow-sm"
						/>
					{:else}
						<div
							class="flex h-16 w-16 items-center justify-center rounded-full bg-bg text-xl font-bold text-fg/50 shadow-sm"
						>
							{selectedBooth.user.user_display_name.charAt(0).toUpperCase()}
						</div>
					{/if}
					<div>
						<div class="text-lg font-bold">{selectedBooth.user.user_display_name}</div>
						<div class="text-sm text-fg/60">@{selectedBooth.user.username}</div>
					</div>
				</div>
			{:else}
				<div class="text-fg/80 italic">This booth is unoccupied.</div>
			{/if}
		</div>
	{/if}
{/snippet}

{#snippet mapDisplay()}
	{#if data.event.event_map_url && data.mapData}
		{@const booths = Object.entries(data.mapData)}
		<div class="space-y-4 rounded-lg bg-gray1 p-6 shadow-md">
			<h2 class="text-xl font-bold">Event Map</h2>
			<div class="relative inline-block w-full overflow-hidden rounded-lg bg-bg shadow-inner">
				<img
					bind:this={displayBoothImageElement}
					src={data.event.event_map_url}
					onload={handleImageLoad}
					class="h-auto w-full object-contain"
					alt="Event Map"
				/>

				{#if imgNaturalWidth > 0 && imgNaturalHeight > 0}
					{#each booths as [label, boothData] (label)}
						{@const [[x1, y1], [x2, y2]] = boothData.bounding_box}
						{@const left = (x1 / imgNaturalWidth) * 100}
						{@const top = (y1 / imgNaturalHeight) * 100}
						{@const width = ((x2 - x1) / imgNaturalWidth) * 100}
						{@const height = ((y2 - y1) / imgNaturalHeight) * 100}

						{@const assignedUser = acceptedBoothsMap.get(label)}
						{@const isSelected = selectedBooth?.label === label}

						<button
							class="group absolute flex items-center justify-center bg-primary/25 text-sm font-bold text-fg transition-colors hover:bg-primary/75
								{isSelected ? 'ring-opacity-50 z-10 ring-2 ring-primary' : 'z-0'}"
							style="left: {left}%; top: {top}%; width: {width}%; height: {height}%;"
							onclick={() => (selectedBooth = { label, user: assignedUser || null })}
							aria-label="View details for Booth {label}"
						>
							<span class="opacity-0 transition-opacity group-hover:opacity-100"
								>{label}</span
							>
						</button>
					{/each}
				{/if}
			</div>

			{@render boothDetailsCard()}
		</div>
	{/if}
{/snippet}

<div class="space-y-4 p-8">
	<div class="space-y-4">
		<h1 class="text-5xl font-bold">{data.event.event_name}</h1>
		<div class="flex items-center gap-2 text-fg/80">
			<MdiLocation />
			{data.event.event_location}
		</div>
	</div>

	<span class="flex w-full items-center justify-center">
		<hr class="w-full border border-fg/50" />
	</span>

	<div class="grid grid-cols-1 gap-8 lg:grid-cols-3">
		<div class="space-y-6 lg:col-span-1">
			<div class="rounded-lg bg-gray1 p-6 shadow-md">
				<h2 class="mb-4 text-xl font-bold">About This Event</h2>
				<p class="whitespace-pre-wrap text-fg/90">{data.event.event_description}</p>
			</div>

			<div class="rounded-lg bg-gray1 p-6 shadow-md">
				<h2 class="mb-4 flex items-center gap-2 text-xl font-bold">
					<MdiCalendar /> Event Schedule
				</h2>
				<ul class="space-y-3">
					{#each data.event.event_days as day}
						<li class="flex flex-col border-l-4 border-primary pl-3">
							<span class="font-bold text-fg">
								{new Date(day.eventday_date).toLocaleDateString(undefined, {
									weekday: 'long',
									month: 'short',
									day: 'numeric'
								})}
							</span>
							<span class="flex items-center gap-1 text-sm text-fg/80">
								<MdiClock class="text-xs" />
								{day.eventday_time_start.slice(0, 5)} - {day.eventday_time_end.slice(
									0,
									5
								)} (Local Time)
							</span>
						</li>
					{/each}
				</ul>
			</div>

			<div class="rounded-lg border-2 border-primary/20 bg-gray1 p-6 text-center shadow-md">
				<h3 class="mb-2 text-xl font-bold">Want to participate?</h3>

				<div class="mb-6 rounded bg-bg p-3 text-sm text-fg/80">
					<span class="block font-bold">Application Window:</span>
					{appStart.toLocaleDateString()}
					{appStart.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
					-
					{appEnd.toLocaleDateString()}
					{appEnd.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
				</div>

				<form
					method="post"
					action="?/applyForBooth"
					use:enhance={() => {
						return async ({ update }) => {
							await update();
						};
					}}
				>
					<button
						type="submit"
						class="w-full rounded-lg px-8 py-3 font-bold shadow-md transition
								{isAppOpen
							? 'bg-primary text-bg hover:bg-primary/90'
							: 'cursor-not-allowed bg-gray-400 text-gray-700'}"
						disabled={!isAppOpen}
					>
						{buttonText}
					</button>
				</form>

				{#if form?.message}
					<div
						class="mt-4 flex items-center justify-center gap-2 rounded-md p-3 text-sm font-bold {form?.success
							? 'bg-primary/20 text-primary'
							: 'bg-error/20 text-error'}"
					>
						<MdiInformation />
						{form.message}
					</div>
				{/if}
			</div>
		</div>

		<div class="lg:col-span-2">
			{@render mapDisplay()}
		</div>
	</div>
</div>
