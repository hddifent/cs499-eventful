<script lang="ts">
	import { enhance } from '$app/forms';
	import type { ActionData, SubmitFunction } from './$types';

	import TopCard from '$lib/components/TopCard.svelte';
	import FormInputBox from '$lib/components/FormInputBox.svelte';
	import { usernameLabel, passwordLabel } from '$lib/components/FormInputLabel.svelte';

	let { form }: { form: ActionData } = $props();

	let isLoggingIn = $state(false);

	const handleLogin: SubmitFunction = () => {
		isLoggingIn = true;
		return async ({ update }) => {
			isLoggingIn = false;
			await update();
		};
	};
</script>

<TopCard imgSrc="https://github.com/hddifent.png" title="Log In" />

<div class="py-8">
	<div class="mx-auto w-lg max-w-10/12 space-y-4 rounded-lg bg-gray1 p-4 shadow-md">
		<form method="post" class="flex flex-col justify-center gap-y-4" use:enhance={handleLogin}>
			<FormInputBox name={'username'} type={'text'} inputLabel={usernameLabel} />
			<FormInputBox name={'password'} type={'password'} inputLabel={passwordLabel} />
			<button
				type="submit"
				class="rounded-lg border-0 bg-primary p-2 font-bold shadow-md hover:bg-primary-hover"
				disabled={isLoggingIn}
			>
				{isLoggingIn ? 'Please hold...' : 'Log In'}
			</button>
		</form>
		<div class="mx-auto w-max text-sm">
			Don't have an account yet?
			<a href="/register" class="font-bold text-secondary hover:text-primary">Register</a>
			here!
		</div>
	</div>
</div>
