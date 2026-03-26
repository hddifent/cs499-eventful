import { error, fail } from '@sveltejs/kit';
import type { Actions, PageServerLoad } from './$types';
import z from 'zod';
import { zUsernameLikeField } from '$lib/snippets/zodFields';
import { verifyAuth } from '$lib/server/basicAuth';

const orgActionSchema = z.object({
	orgUniqueName: zUsernameLikeField(),
	answer: z.enum(['acceptinvite', 'rejectinvite'])
});

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

interface OrgActionReturnBody {
	success: boolean;
}

function _apiOrgToOrgList(data: APIOrg[]): Org[] {
	return data.map((d) => ({
		uniqueName: d.org_unique_name,
		displayName: d.org_display_name
	}));
}

export const prerender = false;

export const load: PageServerLoad = async (event) => {
	const res = await event.fetch('/api/users/profile', {
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
		event.cookies.delete('session_token', { path: '/' });
	}

	const errorData = await res.json().catch(() => ({}));
	throw error(res.status, errorData.detail || res.statusText);
};

export const actions = {
	default: async (event) => {
		await verifyAuth(event);

		const formData = Object.fromEntries(await event.request.formData());

		const validationResult = orgActionSchema.safeParse(formData);
		if (!validationResult.success) {
			const body: OrgActionReturnBody = {
				success: false
			};
			return fail(400, body);
		}

		const { orgUniqueName, answer } = validationResult.data;
		const reqPayload = {
			org_unique_name: orgUniqueName
		};

		const res = await event.fetch(`/api/orgs/${answer}`, {
			method: 'POST',
			headers: { 'Content-Type': 'application/json' },
			body: JSON.stringify(reqPayload)
		});

		if (!res.ok) {
			const body: OrgActionReturnBody = {
				success: false
			};
			return fail(res.status, body);
		}

		const body: OrgActionReturnBody = {
			success: true
		};
		return body;
	}
} satisfies Actions;
