import { error, fail } from '@sveltejs/kit';
import type { Actions, PageServerLoad } from './$types';
import z from 'zod';
import { zUsernameLikeField } from '$lib/snippets/zodFields';
import { verifyAuth } from '$lib/server/basicAuth';

const inviteSchema = z.object({
	username: zUsernameLikeField()
});

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

interface InviteReturnBody {
	validationError?: {
		fieldErrors: {
			username?: string[];
		};
		formErrors: string[];
	};
	message?: string;
	data?: {
		username?: string;
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

export const prerender = false;

export const load: PageServerLoad = async ({ fetch, cookies, params }) => {
	const res = await fetch(`/api/orgs/profile/${params.org_name}/full`, {
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

export const actions = {
	invite: async (event) => {
		await verifyAuth(event);

		const formData = Object.fromEntries(await event.request.formData());

		const validationResult = inviteSchema.safeParse(formData);
		if (!validationResult.success) {
			const fieldErrors = z.flattenError(validationResult.error);
			const body: InviteReturnBody = {
				validationError: fieldErrors,
				data: {
					username: formData.username as string
				}
			};
			return fail(400, body);
		}

		const { username } = validationResult.data;
		const reqPayload = {
			org_unique_name: event.params.org_name,
			username: username
		};

		const res = await event.fetch('/api/orgs/invite', {
			method: 'POST',
			headers: { 'Content-Type': 'application/json' },
			body: JSON.stringify(reqPayload)
		});

		if (!res.ok) {
			const errorData = await res.json().catch(() => ({}));
			const body: InviteReturnBody = {
				message: errorData.detail || res.statusText,
				data: { username }
			};
			return fail(res.status, body);
		}
	}
} satisfies Actions;
