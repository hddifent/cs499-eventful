import { error } from '@sveltejs/kit';
import type { PageServerLoad } from './$types';

interface AccountReturnBody {
	user: {
		username: string;
		displayName: string;
		pfpUrl: string;
	};
}

export const load: PageServerLoad = async ({ fetch, cookies }) => {
	const res = await fetch('/api/users/me', {
		method: 'GET'
	});

	if (res.ok) {
		const data = await res.json();
		const body: AccountReturnBody = {
			user: {
				username: data.username,
				displayName: data.user_display_name,
				pfpUrl: data.pfp_url
			}
		};
		return body;
	}

	if (res.status === 401) {
		cookies.delete('session_token', { path: '/' });
	}

	const errorData = await res.json().catch(() => ({}));
	throw error(res.status, errorData.detail || res.statusText);
};
