import { error } from '@sveltejs/kit';
import type { PageServerLoad } from './$types';

type MemberStatus = 'INVITED' | 'JOINED';

interface APIUser {
	username: string;
	user_display_name: string;
	pfp_url?: string;
}

interface APIMember {
	status: MemberStatus;
	user: APIUser;
}

interface APIResponse {
	org_unique_name: string;
	org_display_name: string;
	pfp_url?: string;

	head_user: APIUser;
	org_members: APIMember[];
}

interface RetUser {
	username: string;
	displayName: string;
	pfpUrl?: string;
}

interface OrgManageReturnBody {
	org: {
		headUser: RetUser;
		uniqueName: string;
		displayName: string;
		pfpUrl?: string;
	};
	members: {
		joined: RetUser[];
		invited: RetUser[];
	};
}

function _apiMemberToUserList(data: APIMember[], memberStatus: MemberStatus): RetUser[] {
	const filteredData = data.filter((d) => d.status == memberStatus);
	return filteredData.map((d) => ({
		username: d.user.username,
		displayName: d.user.user_display_name,
		pfpUrl: d.user.pfp_url
	}));
}

export const load: PageServerLoad = async ({ fetch, cookies, params }) => {
	const res = await fetch(`/api/orgs/${params.org_name}/full`, {
		method: 'GET'
	});

	if (res.ok) {
		const data = (await res.json()) as APIResponse;
		const body: OrgManageReturnBody = {
			org: {
				headUser: {
					username: data.head_user.username,
					displayName: data.head_user.user_display_name
				},
				uniqueName: data.org_unique_name,
				displayName: data.org_display_name,
				pfpUrl: data.pfp_url
			},
			members: {
				joined: _apiMemberToUserList(data.org_members, 'JOINED'),
				invited: _apiMemberToUserList(data.org_members, 'INVITED')
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
