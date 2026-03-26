<script lang="ts">
	import { enhance } from '$app/forms';
	import type { ActionData, SubmitFunction } from './$types';
	import { page } from '$app/state';

	import banner from '$lib/assets/bannner.png';
	import TopCard from '$lib/components/TopCard.svelte';

	import MdiDelete from 'virtual:icons/mdi/delete-outline';
	import MdiAdd from 'virtual:icons/mdi/plus';

	import {
		applicationDateLabel,
		eventApplyLinkLabel,
		eventDaysLabel,
		eventDaysTimeLabel,
		eventDescriptionLabel,
		eventLocationLabel,
		eventNameLabel
	} from '$lib/components/FormInputLabel.svelte';
	import SimpleFormInputBox from '$lib/components/SimpleFormInputBox.svelte';
	import SimpleFormTextArea from '$lib/components/SimpleFormTextArea.svelte';
	import SimpleFormDateRange from '$lib/components/SimpleFormDateRange.svelte';
	import SimpleFormCompundDateTimeRange from '$lib/components/SimpleFormCompundDateTimeRange.svelte';
	import { SvelteDate } from 'svelte/reactivity';

	let { form }: { form: ActionData } = $props();

	let isCreating = $state(false);

	const oneHoursInMs = 60 * 60 * 1000;

	let eventDays = $state([
		{
			id: crypto.randomUUID(),
			valueStart: new SvelteDate(),
			valueEnd: new SvelteDate(Date.now() + oneHoursInMs)
		}
	]);

	const addEventDay = () => {
		eventDays.push({
			id: crypto.randomUUID(),
			valueStart: new SvelteDate(),
			valueEnd: new SvelteDate(Date.now() + oneHoursInMs)
		});
	};

	const removeEventDay = (id: string) => {
		if (eventDays.length > 1) {
			eventDays = eventDays.filter((day) => day.id !== id);
		}
	};

	const handleRegister: SubmitFunction = () => {
		isCreating = true;
		return async ({ update }) => {
			isCreating = false;
			await update();
		};
	};
</script>

<TopCard
	imgSrc={banner}
	title="Create a new Event"
	desc="Creating an event in @{page.params.org_name} Organizer Group"
/>

<div class="py-8">
	<div class="mx-auto w-10/12 min-w-lg space-y-4 rounded-lg bg-gray1 p-4 shadow-md">
		<form
			method="post"
			class="flex flex-col justify-center gap-y-4"
			use:enhance={handleRegister}
			novalidate
		>
			<SimpleFormInputBox
				name="eventName"
				type="text"
				inputLabel={eventNameLabel}
				value={form?.data?.eventName}
				errorMessage={form?.validationError?.fieldErrors.eventName?.[0]}
			/>
			<SimpleFormTextArea
				name="eventDesc"
				inputLabel={eventDescriptionLabel}
				value={form?.data?.eventDesc}
				errorMessage={form?.validationError?.fieldErrors.eventDesc?.[0]}
			/>
			<SimpleFormInputBox
				name="eventLoc"
				type="text"
				inputLabel={eventLocationLabel}
				value={form?.data?.eventLoc}
				errorMessage={form?.validationError?.fieldErrors.eventLoc?.[0]}
			/>
			<SimpleFormInputBox
				name="eventApplicationLink"
				type="url"
				inputLabel={eventApplyLinkLabel}
				value={form?.data?.eventApplicationLink}
				errorMessage={form?.validationError?.fieldErrors.eventApplicationLink?.[0]}
			/>
			<SimpleFormDateRange
				name="applicationPeriod"
				inputLabel={applicationDateLabel}
				valueStart={form?.data?.applicationPeriodStart}
				valueEnd={form?.data?.applicationPeriodEnd}
				errorMessage={form?.validationError?.fieldErrors.applicationPeriodStart?.[0] ||
					form?.validationError?.fieldErrors.applicationPeriodEnd?.[0]}
			/>

			<div class="flex items-center gap-2 text-lg font-bold">{@render eventDaysLabel()}</div>
			<div class="space-y-4">
				{#each eventDays as day, index (day.id)}
					{#snippet dayLabel()}
						{@render eventDaysTimeLabel(index + 1)}
					{/snippet}
					<div class="relative flex items-start gap-4 rounded-lg bg-bg p-4 shadow-md">
						<div class="flex-1">
							<SimpleFormCompundDateTimeRange
								name="eventDay_{index}"
								inputLabel={dayLabel}
								bind:valueStart={day.valueStart}
								bind:valueEnd={day.valueEnd}
							/>
						</div>

						{#if eventDays.length > 1}
							<button
								type="button"
								onclick={() => removeEventDay(day.id)}
								class="mt-10 rounded-lg bg-error p-2 text-bg transition hover:bg-error/80"
								title="Remove Day"
							>
								<MdiDelete class="text-2xl" />
							</button>
						{/if}
					</div>
				{/each}

				<button
					type="button"
					onclick={addEventDay}
					class="flex w-full items-center justify-center gap-2 rounded-lg border-2 border-dashed border-primary p-2 font-bold text-primary transition hover:bg-primary/10"
				>
					<MdiAdd class="text-2xl" /> Add Another Day
				</button>
			</div>

			<button
				type="submit"
				class="mt-4 rounded-lg border-0 bg-primary p-2 font-bold text-bg shadow-md transition hover:bg-primary-hover disabled:opacity-50"
				disabled={isCreating}
			>
				{isCreating ? 'Please hold...' : 'Create'}
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
