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

<div>
	<label>
		<input
			{name}
			{type}
			{autocomplete}
			bind:value
			class="w-full rounded-lg border-2 bg-bg px-4 shadow-md ring-0 transition-colors outline-none focus:ring-0"
			class:border-transparent={!errorMessage}
			class:border-error={errorMessage}
			class:filled={value.length > 0}
		/>
		<span class="flex items-center gap-2 rounded-lg">
			{@render inputLabel()}
		</span>
	</label>
	{#if errorMessage}
		<span class="text-sm text-error">{errorMessage}</span>
	{/if}
</div>

<style>
	label {
		position: relative;
		display: block;
	}

	label span {
		position: absolute;
		transform: translate(0, -50%);
		left: calc(var(--spacing) * 4);
		top: 50%;
		transition: all 0.25s ease-in-out;
		font-weight: bold;
		background-color: transparent;
		pointer-events: none;
	}

	label input:focus ~ span,
	label input.filled ~ span {
		transform: translate(0, -50%);
		left: calc(var(--spacing) * 2);
		top: 0;
		font-size: small;
		background-color: var(--color-bg);
		padding: 0 calc(var(--spacing) * 2);
	}
</style>
