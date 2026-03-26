<script lang="ts" module>
	import MdiDeny from 'virtual:icons/mdi/close';

	type ToastData = {
		title: string;
		description: string;
	};

	const toaster = new Toaster<ToastData>();

	export const addToast = toaster.addToast;
</script>

<script lang="ts">
	import { Toaster } from 'melt/builders';
</script>

<div {...toaster.root} class="fixed right-0! bottom-0! flex flex-col space-y-2 bg-transparent p-4">
	{#each toaster.toasts as toast (toast.id)}
		<div
			{...toast.content}
			class="flex items-start space-x-4 rounded-lg bg-gray2 p-4 text-fg shadow-md"
		>
			<div>
				<div class="font-bold" {...toast.title}>{toast.data.title}</div>
				<div {...toast.description}>{toast.data.description}</div>
			</div>
			<button {...toast.close} aria-label="dismiss alert"><MdiDeny /></button>
		</div>
	{/each}
</div>

<style>
	:global([popover]) {
		inset: unset;
	}
</style>
