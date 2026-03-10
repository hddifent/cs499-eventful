<script lang="ts">
	import { enhance } from '$app/forms';
	import type { ActionData, SubmitFunction } from './$types';

	import banner from '$lib/assets/bannner.png';

	import TopCard from '$lib/components/TopCard.svelte';

	import FormInputBox from '$lib/components/FormInputBox.svelte';
	import {
		emailLabel,
		usernameLabel,
		displayNameLabel,
		passwordLabel,
		confirmPasswordLabel
	} from '$lib/components/FormInputLabel.svelte';

	let { form }: { form: ActionData } = $props();

	let isRegistering = $state(false);

	let _t_pwd = $state('');
	let _t_cpwd = $state('');

	const handleRegister: SubmitFunction = () => {
		isRegistering = true;
		return async ({ update, result }) => {
			isRegistering = false;
			await update();
			_t_pwd = '';
			_t_cpwd = '';
		};
	};
</script>

<TopCard imgSrc={banner} title="Register" />

<div class="py-8">
	<div class="mx-auto w-lg max-w-10/12 space-y-4 rounded-lg bg-gray1 p-4 shadow-md">
		<form
			method="post"
			class="flex flex-col justify-center gap-y-4"
			use:enhance={handleRegister}
			novalidate
		>
			<FormInputBox
				name={'email'}
				type={'email'}
				inputLabel={emailLabel}
				value={form?.data?.email}
				errorMessage={form?.validationError?.fieldErrors.email?.[0]}
			/>
			<FormInputBox
				name={'username'}
				type={'text'}
				inputLabel={usernameLabel}
				value={form?.data?.username}
				errorMessage={form?.validationError?.fieldErrors.username?.[0]}
			/>
			<FormInputBox
				name={'displayName'}
				type={'text'}
				inputLabel={displayNameLabel}
				value={form?.data?.displayName}
				errorMessage={form?.validationError?.fieldErrors.displayName?.[0]}
			/>
			<FormInputBox
				name={'password'}
				type={'password'}
				inputLabel={passwordLabel}
				bind:value={_t_pwd}
				errorMessage={form?.validationError?.fieldErrors.password?.[0]}
			/>
			<FormInputBox
				name={'confirmPassword'}
				type={'password'}
				inputLabel={confirmPasswordLabel}
				bind:value={_t_cpwd}
				errorMessage={form?.validationError?.fieldErrors.confirmPassword?.[0]}
			/>
			<button
				type="submit"
				class="rounded-lg border-0 bg-primary p-2 font-bold shadow-md hover:bg-primary-hover"
				disabled={isRegistering}
			>
				{isRegistering ? 'Please hold...' : 'Register'}
			</button>
		</form>
		{#if form?.validationError?.formErrors}
			<div class="mx-auto w-max text-error">{form.validationError.formErrors[0]}</div>
		{/if}
		{#if form?.message}
			<div class="mx-auto w-max text-error">{form.message}</div>
		{/if}
		<div class="mx-auto w-max text-sm">
			Already have an account?
			<a href="/login" class="font-bold text-secondary hover:text-primary">Log in</a>
			here!
		</div>
	</div>
</div>
