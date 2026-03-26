import { error } from '@sveltejs/kit';
import type { RequestEvent } from '@sveltejs/kit';

export async function verifyAuth(event: RequestEvent) {
	const res = await event.fetch('/api/users/verifysession', { method: 'GET' });

	if (!res.ok) {
		if (res.status === 401) {
			event.cookies.delete('session_token', { path: '/' });
		}

		const errorData = await res.json().catch(() => ({}));
		throw error(res.status, errorData.detail || res.statusText);
	}

	return true;
}
