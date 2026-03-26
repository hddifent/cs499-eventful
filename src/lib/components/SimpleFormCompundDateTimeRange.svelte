<script lang="ts">
	import type { Snippet } from 'svelte';
	import type { FullAutoFill } from 'svelte/elements';
	import DateInput from 'date-picker-svelte/DateInput.svelte';
	import { SvelteDate } from 'svelte/reactivity';

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
		valueStart = $bindable(new SvelteDate()),
		valueEnd = $bindable(new SvelteDate(Date.now() + 60 * 60 * 1000)),
		errorMessage
	}: FormInputBoxData = $props();

	let baseDate = new SvelteDate(valueStart.getTime());

	function toTimeString(d: Date): string {
		return `${d.getHours().toString().padStart(2, '0')}:${d.getMinutes().toString().padStart(2, '0')}`;
	}

	let startTimeStr = $state(toTimeString(valueStart));
	let endTimeStr = $state(toTimeString(valueEnd));

	$effect(() => {
		const year = baseDate.getFullYear();
		const month = baseDate.getMonth();
		const date = baseDate.getDate();

		if (
			valueStart.getFullYear() !== year ||
			valueStart.getMonth() !== month ||
			valueStart.getDate() !== date
		) {
			valueStart.setFullYear(year, month, date);
		}
		if (
			valueEnd.getFullYear() !== year ||
			valueEnd.getMonth() !== month ||
			valueEnd.getDate() !== date
		) {
			valueEnd.setFullYear(year, month, date);
		}
	});

	$effect(() => {
		if (startTimeStr) {
			const [hours, minutes] = startTimeStr.split(':').map(Number);
			if (valueStart.getHours() !== hours || valueStart.getMinutes() !== minutes) {
				valueStart.setHours(hours, minutes, 0, 0);
			}
		}
	});

	$effect(() => {
		if (endTimeStr) {
			const [hours, minutes] = endTimeStr.split(':').map(Number);
			if (valueEnd.getHours() !== hours || valueEnd.getMinutes() !== minutes) {
				valueEnd.setHours(hours, minutes, 0, 0);
			}
		}
	});

	const minDate = new SvelteDate();
	const maxDate = new SvelteDate();
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

	<input name="{name}Start" type="datetime" {autocomplete} bind:value={valueStart} hidden />
	<input name="{name}End" type="datetime" {autocomplete} bind:value={valueEnd} hidden />

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
