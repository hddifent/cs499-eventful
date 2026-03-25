<script lang="ts">
	import { enhance } from '$app/forms';
	import type { ActionData, SubmitFunction } from './$types';

	import banner from '$lib/assets/bannner.png';

	import TopCard from '$lib/components/TopCard.svelte';

	import FormInputBox from '$lib/components/FormInputBox.svelte';
	import { orgUniqueNameLabel, orgDisplayNameLabel } from '$lib/components/FormInputLabel.svelte';

	let { form }: { form: ActionData } = $props();

	let isRegistering = $state(false);

	const handleRegister: SubmitFunction = () => {
		isRegistering = true;
		return async ({ update }) => {
			isRegistering = false;
			await update();
		};
	};
</script>

<TopCard imgSrc={banner} title="Create a new Organizer Group" />

<div class="py-8">
	<div class="mx-auto w-lg max-w-10/12 space-y-4 rounded-lg bg-gray1 p-4 shadow-md">
		<form
			method="post"
			class="flex flex-col justify-center gap-y-4"
			use:enhance={handleRegister}
			novalidate
		>
			<FormInputBox
				name="uniqueName"
				type="text"
				inputLabel={orgUniqueNameLabel}
				value={form?.data?.uniqueName}
				errorMessage={form?.validationError?.fieldErrors.uniqueName?.[0]}
			/>
			<FormInputBox
				name="displayName"
				type="text"
				inputLabel={orgDisplayNameLabel}
				value={form?.data?.displayName}
				errorMessage={form?.validationError?.fieldErrors.displayName?.[0]}
			/>
			<button
				type="submit"
				class="rounded-lg border-0 bg-primary p-2 font-bold shadow-md hover:bg-primary-hover"
				disabled={isRegistering}
			>
				{isRegistering ? 'Please hold...' : 'Create'}
			</button>
		</form>
		{#if form?.validationError?.formErrors}
			<div class="mx-auto w-max text-error">{form.validationError.formErrors[0]}</div>
		{/if}
		{#if form?.message}
			<div class="mx-auto w-max text-error">{form.message}</div>
		{/if}
	</div>
</div>
