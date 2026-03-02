<script lang="ts">
	import { enhance } from '$app/forms';
	import type { ActionData, SubmitFunction } from './$types';

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

	const handleRegister: SubmitFunction = () => {
		isRegistering = true;
		return async ({ update }) => {
			isRegistering = false;
			await update();
		};
	};
</script>

<TopCard imgSrc="https://github.com/hddifent.png" title="Register" />

<div class="py-8">
	<div class="mx-auto w-lg max-w-10/12 space-y-4 rounded-lg bg-gray1 p-4 shadow-md">
		<form method="post" class="flex flex-col justify-center gap-y-4" use:enhance={handleRegister}>
			<FormInputBox name={'email'} type={'email'} inputLabel={emailLabel} />
			<FormInputBox name={'username'} type={'text'} inputLabel={usernameLabel} />
			<FormInputBox name={'displayName'} type={'text'} inputLabel={displayNameLabel} />
			<FormInputBox name={'password'} type={'password'} inputLabel={passwordLabel} />
			<FormInputBox name={'confirmPassword'} type={'password'} inputLabel={confirmPasswordLabel} />
			<button
				type="submit"
				class="rounded-lg border-0 bg-primary p-2 font-bold shadow-md hover:bg-primary-hover"
				disabled={isRegistering}
			>
				{isRegistering ? 'Please hold...' : 'Register'}
			</button>
		</form>
		<div class="mx-auto w-max text-sm">
			Already have an account?
			<a href="/login" class="font-bold text-secondary hover:text-primary">Log in</a>
			here!
		</div>
	</div>
</div>
