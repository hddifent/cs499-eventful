<script lang="ts">
	import type { ActionData } from './$types';
	import { page } from '$app/state';

	import banner from '$lib/assets/bannner.png';
	import TopCard from '$lib/components/TopCard.svelte';

	import EventInfoForm from '$lib/components/EventInfoForm.svelte';

	let { form }: { form: ActionData } = $props();
</script>

<TopCard
	imgSrc={banner}
	title="Create a new Event"
	desc="Creating an event in @{page.params.org_name} Organizer Group"
/>

<div class="py-8">
	<div class="mx-auto w-10/12 min-w-lg space-y-4 rounded-lg bg-gray1 p-4 shadow-md">
		<EventInfoForm
			submitText="Create Event"
			loadingText="Creating..."
			initialData={form?.data || {}}
			fieldErrors={form?.validationError?.fieldErrors || {}}
			formError={form?.validationError?.formErrors?.[0] || ''}
			message={form?.message || ''}
		/>
	</div>
</div>
