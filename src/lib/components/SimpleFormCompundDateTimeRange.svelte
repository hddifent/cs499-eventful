<script lang="ts">
	import { untrack, type Snippet } from 'svelte';
	import type { FullAutoFill } from 'svelte/elements';
	import DateInput from 'date-picker-svelte/DateInput.svelte';

	interface FormInputBoxData {
		name: string;
		inputLabel: Snippet;
		autocomplete?: FullAutoFill;
		valueStart?: Date;
		valueEnd?: Date;
		errorMessage?: string;
	}

	let {
		name,
		inputLabel,
		autocomplete = 'off',
		valueStart = $bindable(),
		valueEnd = $bindable(),
		errorMessage
	}: FormInputBoxData = $props();

	const oneHourLater = 60 * 60 * 1000;

	// Svelte 5 -> 4 hack
	let localStart = $state(valueStart instanceof Date ? valueStart : new Date());
	let localEnd = $state(
		valueEnd instanceof Date ? valueEnd : new Date(Date.now() + oneHourLater)
	);

	let baseDate = $state(new Date(localStart.getTime()));

	function toTimeString(d: Date): string {
		return `${d.getHours().toString().padStart(2, '0')}:${d.getMinutes().toString().padStart(2, '0')}`;
	}

	let startTimeStr = $state(toTimeString(localStart));
	let endTimeStr = $state(toTimeString(localEnd));

	// 1. SYNC OUT
	$effect(() => {
		// Track the local variables OUTSIDE untrack
		const start = localStart;
		const end = localEnd;

		untrack(() => {
			valueStart = start;
			valueEnd = end;
		});
	});

	// 2. COMPUTE
	$effect(() => {
		// Track base inputs OUTSIDE untrack
		const year = baseDate.getFullYear();
		const month = baseDate.getMonth();
		const date = baseDate.getDate();
		const startStr = startTimeStr;
		const endStr = endTimeStr;

		untrack(() => {
			if (startStr) {
				const [h, m] = startStr.split(':').map(Number);
				const newStart = new Date(year, month, date, h, m, 0, 0);

				// Because we are inside untrack, reading localStart.getTime() here
				// will NOT cause Svelte to loop when we write to localStart.
				if (localStart.getTime() !== newStart.getTime()) {
					localStart = newStart;
				}
			}

			if (endStr) {
				const [h, m] = endStr.split(':').map(Number);
				const newEnd = new Date(year, month, date, h, m, 0, 0);
				if (localEnd.getTime() !== newEnd.getTime()) {
					localEnd = newEnd;
				}
			}
		});
	});

	// 3. SYNC IN
	$effect(() => {
		// Track the parent variables OUTSIDE untrack
		const vStart = valueStart;
		const vEnd = valueEnd;

		untrack(() => {
			if (vStart) {
				const parsed = vStart instanceof Date ? vStart : new Date(vStart);
				if (parsed.getTime() !== localStart.getTime()) {
					localStart = parsed;
					baseDate = new Date(parsed.getTime());
					startTimeStr = toTimeString(parsed);
				}
			}
			if (vEnd) {
				const parsed = vEnd instanceof Date ? vEnd : new Date(vEnd);
				if (parsed.getTime() !== localEnd.getTime()) {
					localEnd = parsed;
					endTimeStr = toTimeString(parsed);
				}
			}
		});
	});

	const minDate = new Date();
	const maxDate = new Date();
	maxDate.setFullYear(maxDate.getFullYear() + 1);

	const nativeInputClasses =
		'h-10 w-full rounded-lg border-2 bg-bg px-4 shadow-md ring-0 outline-none transition-colors focus:ring-0';
</script>

<div class="custom-date-wrapper space-y-4" class:has-error={errorMessage}>
	<label class="flex space-x-4" for={name}>
		<div class="flex items-center gap-2 text-lg font-bold">
			{@render inputLabel()}
		</div>
	</label>

	<input name="{name}Start" {autocomplete} value={localStart.toISOString()} hidden />
	<input name="{name}End" {autocomplete} value={localEnd.toISOString()} hidden />

	<div class="flex w-full items-center gap-4">
		<div class="flex flex-1 items-center gap-2">
			<span class="w-12 shrink-0">Date</span>
			<div class="w-full">
				<DateInput
					bind:value={baseDate}
					min={minDate}
					max={maxDate}
					format="dd/MM/yyyy"
					placeholder=""
					closeOnSelection={true}
				/>
			</div>
		</div>

		<div class="flex flex-1 items-center gap-4">
			<div class="flex flex-1 items-center gap-2">
				<span class="w-12 shrink-0">Start</span>
				<input
					type="time"
					bind:value={startTimeStr}
					max={endTimeStr}
					class="{nativeInputClasses} {errorMessage
						? 'border-error'
						: 'border-transparent'}"
				/>
			</div>

			<div class="flex flex-1 items-center gap-2">
				<span class="w-12 shrink-0">End</span>
				<input
					type="time"
					bind:value={endTimeStr}
					min={startTimeStr}
					class="{nativeInputClasses} {errorMessage
						? 'border-error'
						: 'border-transparent'}"
				/>
			</div>
		</div>
	</div>

	{#if errorMessage}
		<span class="text-sm text-error">{errorMessage}</span>
	{/if}
</div>

<style lang="postcss">
	@reference "tailwindcss";

	.custom-date-wrapper {
		--date-input-width: 100%;
		--date-picker-background: var(--color-bg);
		--date-picker-foreground: var(--color-fg);
		--date-picker-highlight-border: var(--color-primary);
		--date-picker-highlight-shadow: var(--color-gray1);
		--date-picker-selected-background: var(--color-gray1);
	}

	:global(.custom-date-wrapper input[type='text']) {
		@apply w-full rounded-lg border-2 px-4 shadow-md ring-0 transition-colors outline-none focus:ring-0;
		height: 2.5rem;
		box-sizing: border-box;
		background-color: var(--color-bg);
	}

	:global(.custom-date-wrapper:not(.has-error) input[type='text']) {
		@apply border-transparent;
	}

	:global(.custom-date-wrapper.has-error input[type='text']) {
		border-color: var(--color-error);
	}
</style>
