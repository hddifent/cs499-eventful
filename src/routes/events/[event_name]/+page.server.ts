import { error, fail } from '@sveltejs/kit';
import type { Actions, PageServerLoad } from './$types';
import { verifyAuth } from '$lib/server/basicAuth';

interface PublicEventResponse {
	event_name: string;
	event_description: string;
	event_location: string;
	event_application_accept_start: string;
	event_application_accept_end: string;
	event_map_url: string | null;
	event_map_data_url: string | null;
	accepted_booths: {
		assigned_booth: string;
		user: { username: string; user_display_name: string; pfp_url: string };
	}[];
}

export const load: PageServerLoad = async (event) => {
	const { event_name } = event.params;

	const res = await event.fetch(`/api/events/info/${event_name}`, {
		method: 'GET'
	});

	if (!res.ok) {
		throw error(res.status, 'Event not found.');
	}

	const eventData = (await res.json()) as PublicEventResponse;

	let fetchedBoothData = null;
	if (eventData.event_map_data_url) {
		try {
			const dataRes = await fetch(eventData.event_map_data_url);
			if (dataRes.ok) {
				fetchedBoothData = await dataRes.json();
			}
		} catch (e) {
			console.error('Failed to load booth data JSON.', e);
		}
	}

	return {
		event: eventData,
		mapData: fetchedBoothData
	};
};

export const actions = {
	applyForBooth: async (event) => {
		await verifyAuth(event);

		const res = await event.fetch(`/api/events/apply/${event.params.event_name}`, {
			method: 'POST'
		});

		if (!res.ok) {
			const errorData = await res.json().catch(() => ({}));
			return fail(res.status, {
				message: errorData.detail || res.statusText
			});
		}

		return {
			success: true,
			message: 'Application submitted successfully! Please wait for the organizer to review.'
		};
	}
} satisfies Actions;
