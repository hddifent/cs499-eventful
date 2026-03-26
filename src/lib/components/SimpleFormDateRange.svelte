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
		valueStart = $bindable(),
		valueEnd = $bindable(),
		errorMessage
	}: FormInputBoxData = $props();

	const minDate = new SvelteDate();
	const maxDate = new SvelteDate();
	maxDate.setFullYear(maxDate.getFullYear() + 1);
</script>

<div class="custom-date-wrapper space-y-2" class:has-error={errorMessage}>
	<label class="flex space-x-4" for={name}>
		<div class="flex items-center gap-2 text-lg font-bold">
			{@render inputLabel()}
		</div>
	</label>

	<input name="{name}Start" type="datetime" {autocomplete} bind:value={valueStart} hidden />
	<input name="{name}End" type="datetime" {autocomplete} bind:value={valueEnd} hidden />

	<div class="flex w-full items-center gap-4">
		<div class="flex flex-1 items-center gap-2">
			<span class="w-12 shrink-0">Start</span>
			<div class="w-full">
				<DateInput
					bind:value={valueStart}
					min={minDate}
					max={valueEnd ?? maxDate}
					timePrecision="minute"
					placeholder=""
					format="dd/MM/yyyy HH:mm"
					closeOnSelection={true}
				/>
			</div>
		</div>

		<div class="flex flex-1 items-center gap-2">
			<span class="w-12 shrink-0">End</span>
			<div class="w-full">
				<DateInput
					bind:value={valueEnd}
					min={valueStart ?? minDate}
					max={maxDate}
					timePrecision="minute"
					placeholder=""
					format="dd/MM/yyyy HH:mm"
					closeOnSelection={true}
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
