import type { LayoutServerLoad } from './$types';

interface LayoutReturnData {
	isLoggedIn: boolean;
	profilePicUrl?: string;
}

// TODO: Check if try/catch is needed.
export const load: LayoutServerLoad = async ({ fetch, cookies }) => {
	const session_token = cookies.get('session_token');
	if (!session_token) {
		const body: LayoutReturnData = {
			isLoggedIn: false
		};
		return body;
	}

	const res = await fetch('/api/users/me', {
		method: 'GET'
	});

	if (res.ok) {
		const data = await res.json();
		const body: LayoutReturnData = {
			isLoggedIn: true,
			profilePicUrl: data.pfp_url
		};
		return body;
	}

	if (res.status === 401) {
		cookies.delete('session_token', { path: '/' });
	}

	const body: LayoutReturnData = {
		isLoggedIn: false
	};
	return body;
};
