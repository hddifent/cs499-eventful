import { fail, redirect } from '@sveltejs/kit';
import type { Actions, PageServerLoad } from './$types';
import z from 'zod';
import { zDisplayNameLikeField } from '$lib/snippets/zodFields';
import { verifyAuth } from '$lib/server/basicAuth';

const createEventSchema = z
	.object({
		eventName: zDisplayNameLikeField('Event name'),
		eventDesc: z.string().min(10, 'Description must not be empty.'),
		eventLoc: z
			.string()
			.min(1, 'Location must not be empty.')
			.max(256, 'Location must not exceed 256 chracters.'),
		eventApplicationLink: z.url('Must be a valid URL.'),
		applicationPeriodStart: z.coerce.date('Invalid date.'),
		applicationPeriodEnd: z.coerce.date('Invalid date.'),
		eventDays: z
			.array(
				z.object({
					start: z.coerce.date(),
					end: z.coerce.date(),
					timezone: z.string().min(1)
				})
			)
			.min(1, 'At least one event day is required.')
			.superRefine((days, ctx) => {
				days.forEach((day, index) => {
					if (day.end <= day.start) {
						ctx.addIssue({
							code: 'custom',
							message: 'End time must be after start time.',
							path: [index, 'end']
						});
					}
				});
			})
	})
	.refine((data) => data.applicationPeriodEnd > data.applicationPeriodStart, {
		message: 'Application end date must be after start date.',
		path: ['applicationPeriodEnd']
	})
	.refine(
		(data) => {
			if (data.eventDays.length === 0) return true;

			const startTimestamps = data.eventDays.map((day) => day.start.getTime());
			const earliestStartTimestamp = Math.min(...startTimestamps);
			const earliestStartDate = new Date(earliestStartTimestamp);

			return earliestStartDate > data.applicationPeriodEnd;
		},
		{
			message: 'The first event day must begin after the application period closes.',
			path: ['applicationPeriodEnd']
		}
	);

interface CreateEventReturnBody {
	validationError?: {
		fieldErrors: {
			eventName?: string[];
			eventDesc?: string[];
			eventLoc?: string[];
			eventApplicationLink?: string[];
			applicationPeriodStart?: string[];
			applicationPeriodEnd?: string[];
			eventDays?: string[];
		};
		formErrors: string[];
	};
	message?: string;
	data?: {
		eventName?: string;
		eventDesc?: string;
		eventLoc?: string;
		eventApplicationLink?: string;
		applicationPeriodStart?: Date;
		applicationPeriodEnd?: Date;
		eventDays?: {
			start: Date;
			end: Date;
		}[];
	};
}

export const prerender = false;

export const load: PageServerLoad = async (event) => {
	await verifyAuth(event);
};

export const actions = {
	default: async (event) => {
		await verifyAuth(event);
		const formData = await event.request.formData();

		const clientTimezone = Intl.DateTimeFormat().resolvedOptions().timeZone;

		const rawData: Record<string, unknown> = {
			eventName: formData.get('eventName'),
			eventDesc: formData.get('eventDesc'),
			eventLoc: formData.get('eventLoc'),
			eventApplicationLink: formData.get('eventApplicationLink'),
			applicationPeriodStart: formData.get('applicationPeriodStart'),
			applicationPeriodEnd: formData.get('applicationPeriodEnd'),
			eventDays: []
		};
		const days: { start: unknown; end: unknown; timezone: string }[] = [];
		let i = 0;
		while (formData.has(`eventDay_${i}Start`)) {
			days.push({
				start: formData.get(`eventDay_${i}Start`),
				end: formData.get(`eventDay_${i}End`),
				timezone: clientTimezone
			});
			i++;
		}
		rawData.eventDays = days;

		console.log(rawData);

		const validationResult = createEventSchema.safeParse(rawData);
		if (!validationResult.success) {
			const fieldErrors = z.flattenError(validationResult.error);
			const body: CreateEventReturnBody = {
				validationError: fieldErrors,
				data: {
					eventName: rawData.eventName as string,
					eventDesc: rawData.eventDesc as string,
					eventLoc: rawData.eventLoc as string,
					eventApplicationLink: rawData.eventApplicationLink as string,
					applicationPeriodStart: rawData.applicationPeriodStart as Date,
					applicationPeriodEnd: rawData.applicationPeriodEnd as Date,
					eventDays: rawData.eventDays as {
						start: Date;
						end: Date;
					}[]
				}
			};
			console.log(body);
			return fail(400, body);
		}

		const {
			eventName,
			eventDesc,
			eventLoc,
			eventApplicationLink,
			applicationPeriodStart,
			applicationPeriodEnd,
			eventDays
		} = validationResult.data;

		const reqPayload = {
			org_unique_name: event.params.org_name,
			event_name: eventName,
			event_desc: eventDesc,
			event_loc: eventLoc,
			event_application_link: eventApplicationLink,
			application_period_start: applicationPeriodStart,
			application_period_end: applicationPeriodEnd,
			event_days: eventDays
		};

		const res = await event.fetch('/api/events/new', {
			method: 'POST',
			headers: { 'Content-Type': 'application/json' },
			body: JSON.stringify(reqPayload)
		});

		if (!res.ok) {
			const errorData = await res.json().catch(() => ({}));
			const body: CreateEventReturnBody = {
				message: errorData.detail || res.statusText,
				data: {
					eventName,
					eventDesc,
					eventLoc,
					eventApplicationLink,
					applicationPeriodStart,
					applicationPeriodEnd,
					eventDays
				}
			};
			return fail(res.status, body);
		}

		const resData = await res.json();

		throw redirect(
			303,
			`/orgs/manage/${event.params.org_name}/events/edit/${resData.event_slug}`
		);
	}
} satisfies Actions;
