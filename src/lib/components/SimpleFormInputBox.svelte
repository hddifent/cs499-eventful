<script lang="ts">
	import type { Snippet } from 'svelte';
	import type { FullAutoFill, HTMLInputTypeAttribute } from 'svelte/elements';

	interface FormInputBoxData {
		name: string;
		inputLabel: Snippet;
		type: HTMLInputTypeAttribute;
		autocomplete?: FullAutoFill;
		value?: string;
		errorMessage?: string;
	}

	let {
		name,
		inputLabel,
		type,
		autocomplete = 'off',
		value = $bindable(''),
		errorMessage
	}: FormInputBoxData = $props();
</script>

<div class="space-y-2">
	<label class="flex space-x-4" for={name}>
		<div class="flex items-center gap-2 text-lg font-bold">
			{@render inputLabel()}
		</div>
	</label>
	<input
		{name}
		{type}
		{autocomplete}
		bind:value
		class="w-full rounded-lg border-2 bg-bg px-4 shadow-md ring-0 transition-colors outline-none focus:ring-0"
		class:border-transparent={!errorMessage}
		class:border-error={errorMessage}
	/>
	{#if errorMessage}
		<span class="text-sm text-error">{errorMessage}</span>
	{/if}
</div>
