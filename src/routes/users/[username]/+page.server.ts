import { error } from '@sveltejs/kit';
import type { PageServerLoad } from './$types';

interface UserPublicProfile {
	username: string;
	user_display_name: string;
	pfp_url: string;
}

export const load: PageServerLoad = async ({ params, fetch }) => {
	const res = await fetch(`/api/users/profile/${params.username}`, {
		method: 'GET'
	});

	if (!res.ok) {
		throw error(res.status, 'User not found');
	}

	const profile = (await res.json()) as UserPublicProfile;

	return {
		profile
	};
};
