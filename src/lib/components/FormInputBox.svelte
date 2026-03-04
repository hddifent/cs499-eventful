<script lang="ts">
	import type { Snippet } from 'svelte';
	import type { FullAutoFill, HTMLInputTypeAttribute } from 'svelte/elements';

	interface FormInputBoxData {
		name: string;
		inputLabel: Snippet;
		type: HTMLInputTypeAttribute;
		autocomplete?: FullAutoFill;
	}

	let { name, inputLabel, type, autocomplete = 'off' }: FormInputBoxData = $props();
</script>

<label>
	<input
		{name}
		{type}
		{autocomplete}
		class="rounded-lg border-0 bg-bg px-4 shadow-md ring-0 outline-none focus:ring-0"
	/>
	<span class="flex items-center gap-2 rounded-lg">
		{@render inputLabel()}
	</span>
</label>

<style>
	label {
		position: relative;
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

	label input {
		width: 100%;
	}

	label input:focus ~ span,
	label input:valid ~ span {
		transform: translate(0, -50%);
		left: calc(var(--spacing) * 2);
		top: 0;
		font-size: small;
		background-color: var(--color-bg);
		padding: 0 calc(var(--spacing) * 2);
	}
</style>
