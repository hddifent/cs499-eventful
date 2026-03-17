import { error } from '@sveltejs/kit';
import type { PageServerLoad } from './$types';

interface APIOrg {
	org_unique_name: string;
	org_display_name: string;
}

interface APIResponse {
	username: string;
	user_display_name: string;
	pfp_url?: string;
	user_orgs_invited: APIOrg[];
	user_orgs_joined: APIOrg[];
}

interface Org {
	uniqueName: string;
	displayName: string;
}

interface AccountReturnBody {
	user: {
		username: string;
		displayName: string;
		pfpUrl?: string;
	};
	orgs: {
		invited: Org[];
		joined: Org[];
	};
}

function _apiOrgToOrgList(data: APIOrg[]): Org[] {
	return data.map((d) => ({
		uniqueName: d.org_unique_name,
		displayName: d.org_display_name
	}));
}

export const load: PageServerLoad = async ({ fetch, cookies }) => {
	const res = await fetch('/api/users/profile', {
		method: 'GET'
	});

	if (res.ok) {
		const data = (await res.json()) as APIResponse;
		const body: AccountReturnBody = {
			user: {
				username: data.username,
				displayName: data.user_display_name,
				pfpUrl: data.pfp_url
			},
			orgs: {
				invited: _apiOrgToOrgList(data.user_orgs_invited),
				joined: _apiOrgToOrgList(data.user_orgs_joined)
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
