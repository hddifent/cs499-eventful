<script lang="ts">
	import { enhance } from '$app/forms';
	import type { SubmitFunction } from '@sveltejs/kit';

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

	interface EventFormData {
		eventName?: string;
		eventDesc?: string;
		eventLoc?: string;
		eventApplicationLink?: string;
		applicationPeriodStart?: Date;
		applicationPeriodEnd?: Date;
		eventDays?: { start: Date; end: Date }[];
	}

	let {
		action = '',
		submitText = 'Submit',
		loadingText = 'Please hold...',
		initialData = {} as EventFormData,
		fieldErrors = {} as Record<string, string[]>,
		formError = '',
		message = ''
	} = $props();

	let isSubmitting = $state(false);

	const oneHoursInMs = 60 * 60 * 1000;

	// Svelte 5 -> 4 hack
	let appStart = $state(
		initialData.applicationPeriodStart
			? new Date(initialData.applicationPeriodStart)
			: undefined
	);
	let appEnd = $state(
		initialData.applicationPeriodEnd ? new Date(initialData.applicationPeriodEnd) : undefined
	);

	let eventDays = $state(
		initialData.eventDays && initialData.eventDays.length > 0
			? initialData.eventDays.map((d) => ({
					id: crypto.randomUUID(),
					valueStart: new Date(d.start),
					valueEnd: new Date(d.end)
				}))
			: [
					{
						id: crypto.randomUUID(),
						valueStart: new Date(),
						valueEnd: new Date(Date.now() + oneHoursInMs)
					}
				]
	);

	const addEventDay = () => {
		eventDays.push({
			id: crypto.randomUUID(),
			valueStart: new Date(),
			valueEnd: new Date(Date.now() + oneHoursInMs)
		});
	};

	const removeEventDay = (id: string) => {
		if (eventDays.length > 1) {
			eventDays = eventDays.filter((day) => day.id !== id);
		}
	};

	const handleSubmit: SubmitFunction = () => {
		isSubmitting = true;
		return async ({ update }) => {
			isSubmitting = false;
			await update();
		};
	};
</script>

<form
	method="post"
	{action}
	class="flex flex-col justify-center gap-y-4"
	use:enhance={handleSubmit}
	novalidate
>
	<SimpleFormInputBox
		name="eventName"
		type="text"
		inputLabel={eventNameLabel}
		value={initialData.eventName}
		errorMessage={fieldErrors.eventName?.[0]}
	/>
	<SimpleFormTextArea
		name="eventDesc"
		inputLabel={eventDescriptionLabel}
		value={initialData.eventDesc}
		errorMessage={fieldErrors.eventDesc?.[0]}
	/>
	<SimpleFormInputBox
		name="eventLoc"
		type="text"
		inputLabel={eventLocationLabel}
		value={initialData.eventLoc}
		errorMessage={fieldErrors.eventLoc?.[0]}
	/>
	<SimpleFormInputBox
		name="eventApplicationLink"
		type="url"
		inputLabel={eventApplyLinkLabel}
		value={initialData.eventApplicationLink}
		errorMessage={fieldErrors.eventApplicationLink?.[0]}
	/>
	<SimpleFormDateRange
		name="applicationPeriod"
		inputLabel={applicationDateLabel}
		bind:valueStart={appStart}
		bind:valueEnd={appEnd}
		errorMessage={fieldErrors.applicationPeriodStart?.[0] ||
			fieldErrors.applicationPeriodEnd?.[0]}
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
		disabled={isSubmitting}
	>
		{isSubmitting ? loadingText : submitText}
	</button>
</form>

{#if formError}
	<div class="mx-auto mt-2 w-max text-error">{formError}</div>
{/if}
{#if message}
	<div class="mx-auto mt-2 w-max text-error">{message}</div>
{/if}
