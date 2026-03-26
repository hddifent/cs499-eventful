import { error, fail } from '@sveltejs/kit';
import type { Actions, PageServerLoad } from './$types';
import { verifyAuth } from '$lib/server/basicAuth';
import z from 'zod';
import { zDisplayNameLikeField } from '$lib/snippets/zodFields';

const updateEventSchema = z
	.object({
		eventName: zDisplayNameLikeField('Event name'),
		eventDesc: z.string().min(10, 'Description must not be empty.'),
		eventLoc: z
			.string()
			.min(1, 'Location must not be empty.')
			.max(256, 'Location must not exceed 256 chracters.'),
		eventApplicationLink: z.url('Must be a valid URL.').or(z.literal('')),
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

type EventStatus = 'DRAFT' | 'PUBLIC';

interface APIEventDay {
	eventday_date: string;
	eventday_time_start: string;
	eventday_time_end: string;
	eventday_timezone: string;
}

interface APIEventPrivatePageResponse {
	event_name: string;
	event_description: string | null;
	event_location: string | null;
	event_application_info: string | null;
	event_application_accept_start: string | null;
	event_application_accept_end: string | null;
	event_publication_status: EventStatus;
	event_days: APIEventDay[];
	event_map_url: string | null;
	event_map_data_url: string | null;
}

interface RetEventDay {
	start: Date;
	end: Date;
}

interface ManageEventReturnBody {
	general: {
		eventName: string;
		eventDesc: string;
		eventLoc: string;
		eventApplicationLink: string;
		applicationPeriodStart: Date;
		applicationPeriodEnd: Date;
		eventDays: RetEventDay[];
		eventStatus: EventStatus;
	};
	map: {
		displayMapUrl: string | null;
		boothData: any | null;
	};
}

interface UpdateEventReturnBody {
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
	success?: boolean;
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

function _apiEventDaysToFrontendDays(data: APIEventDay[]): RetEventDay[] {
	return data.map((d) => ({
		// Combining the separate date and time strings into a standard ISO-like string
		start: new Date(`${d.eventday_date}T${d.eventday_time_start}`),
		end: new Date(`${d.eventday_date}T${d.eventday_time_end}`),
		timezone: d.eventday_timezone
	}));
}

export const prerender = false;

export const load: PageServerLoad = async (event) => {
	await verifyAuth(event);

	const { event_name } = event.params;

	const res = await event.fetch(`/api/events/info/${event_name}/full`, {
		method: 'GET'
	});

	if (!res.ok) {
		const errorData = await res.json().catch(() => ({}));
		throw error(res.status, errorData.detail || 'Failed to load event data');
	}

	const eventData = (await res.json()) as APIEventPrivatePageResponse;

	let fetchedBoothData = null;
	if (eventData.event_map_data_url) {
		try {
			const dataRes = await fetch(eventData.event_map_data_url);
			if (dataRes.ok) {
				fetchedBoothData = await dataRes.json();
			}
		} catch (e) {
			console.error('Failed to load booth data JSON from storage:', e);
		}
	}

	const body: ManageEventReturnBody = {
		general: {
			eventName: eventData.event_name,
			eventDesc: eventData.event_description || '',
			eventLoc: eventData.event_location || '',
			eventApplicationLink: eventData.event_application_info || '',
			applicationPeriodStart: eventData.event_application_accept_start
				? new Date(eventData.event_application_accept_start)
				: new Date(),
			applicationPeriodEnd: eventData.event_application_accept_end
				? new Date(eventData.event_application_accept_end)
				: new Date(Date.now() + 86400000),
			eventDays: _apiEventDaysToFrontendDays(eventData.event_days),
			eventStatus: eventData.event_publication_status
		},
		map: {
			displayMapUrl: eventData.event_map_url,
			boothData: fetchedBoothData
		}
	};

	return body;
};

export const actions = {
	updateBasicInfo: async (event) => {
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

		const validationResult = updateEventSchema.safeParse(rawData);
		if (!validationResult.success) {
			const fieldErrors = z.flattenError(validationResult.error);
			const body: UpdateEventReturnBody = {
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

		const res = await event.fetch(`/api/events/general/${event.params.event_name}`, {
			method: 'PATCH',
			headers: { 'Content-Type': 'application/json' },
			body: JSON.stringify(reqPayload)
		});

		if (!res.ok) {
			const errorData = await res.json().catch(() => ({}));
			const body: UpdateEventReturnBody = {
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

		return {
			success: true,
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
	},

	updateEventMap: async (event) => {
		await verifyAuth(event);
		const formData = await event.request.formData();

		const displayMap = formData.get('displayMap') as File | null;
		const boothData = formData.get('boothData') as string | null;

		if (!displayMap || displayMap.size === 0) {
			const body: UpdateEventReturnBody = {
				message: 'Display map image is required.'
			};
			return fail(400, body);
		}
		if (!boothData) {
			const body: UpdateEventReturnBody = {
				message: 'Booth mapping data is missing. Please process the map first.'
			};
			return fail(400, body);
		}

		try {
			JSON.parse(boothData);
		} catch {
			const body: UpdateEventReturnBody = {
				message: 'Invalid booth mapping data format.'
			};
			return fail(400, body);
		}

		const reqPayload = new FormData();
		reqPayload.append('file', displayMap);
		reqPayload.append('data', boothData);
		reqPayload.append('org_unique_name', event.params.org_name);

		const res = await event.fetch(`/api/events/map/${event.params.event_name}`, {
			method: 'PATCH',
			body: reqPayload
		});

		if (!res.ok) {
			const errorData = await res.json().catch(() => ({}));
			console.log(errorData.detail[0].loc);
			const body: UpdateEventReturnBody = {
				message: errorData.detail || res.statusText
			};
			return fail(res.status, body);
		}

		return {
			success: true
		};
	},

	publishEvent: async (event) => {
		await verifyAuth(event);

		const res = await event.fetch(`/api/events/publish/${event.params.event_name}`, {
			method: 'PATCH'
		});

		if (!res.ok) {
			const errorData = await res.json().catch(() => ({}));
			return fail(res.status, {
				message:
					errorData.detail || 'Failed to publish event. Please ensure all data is filled.'
			});
		}

		return {
			success: true,
			message: 'Event is now public.'
		};
	}
} satisfies Actions;
