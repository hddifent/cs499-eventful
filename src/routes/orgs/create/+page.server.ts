import { fail, redirect } from '@sveltejs/kit';
import type { Actions, PageServerLoad } from './$types';
import { z } from 'zod';
import { zDisplayNameLikeField, zUsernameLikeField } from '$lib/snippets/zodFields';
import { verifyAuth } from '$lib/server/basicAuth';

const createOrgSchema = z.object({
	uniqueName: zUsernameLikeField('Unique name'),
	displayName: zDisplayNameLikeField()
});

interface RegistrationReturnBody {
	validationError?: {
		fieldErrors: {
			uniqueName?: string[];
			displayName?: string[];
		};
		formErrors: string[];
	};
	message?: string;
	data?: {
		uniqueName?: string;
		displayName?: string;
	};
}

export const prerender = false;

export const load: PageServerLoad = async (event) => {
	await verifyAuth(event);
};

export const actions = {
	default: async (event) => {
		await verifyAuth(event);

		const formData = Object.fromEntries(await event.request.formData());

		const validationResult = createOrgSchema.safeParse(formData);
		if (!validationResult.success) {
			const fieldErrors = z.flattenError(validationResult.error);
			const body: RegistrationReturnBody = {
				validationError: fieldErrors,
				data: {
					uniqueName: formData.uniqueName as string,
					displayName: formData.displayName as string
				}
			};
			return fail(400, body);
		}

		const { uniqueName, displayName } = validationResult.data;
		const reqPayload = {
			org_unique_name: uniqueName,
			org_display_name: displayName
		};

		const res = await event.fetch('/api/orgs/new', {
			method: 'POST',
			headers: { 'Content-Type': 'application/json' },
			body: JSON.stringify(reqPayload)
		});

		if (!res.ok) {
			const errorData = await res.json().catch(() => ({}));
			const body: RegistrationReturnBody = {
				message: errorData.detail || res.statusText,
				data: { uniqueName, displayName }
			};
			return fail(res.status, body);
		}

		throw redirect(303, `/orgs/manage/${uniqueName}`);
	}
} satisfies Actions;
