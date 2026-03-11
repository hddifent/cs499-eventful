import { error } from '@sveltejs/kit';
import type { PageLoad } from './$types';

export const load: PageLoad = async ({ fetch }) => {
	const res = await fetch('/api/events', {
		method: 'GET'
	});

	if (res.ok) {
		const data = await res.json();
		return {
			events: data
		};
	}

	const errorData = await res.json().catch(() => ({}));
	throw error(res.status, errorData.detail || res.statusText);
};
