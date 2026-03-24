import { fail, redirect } from '@sveltejs/kit';
import type { Actions } from './$types';
import { z } from 'zod';
import {
	zDisplayNameLikeField,
	zPasswordLikeField,
	zUsernameLikeField
} from '$lib/snippets/zodFields';

const registerSchema = z
	.object({
		email: z.email({ message: 'Invalid email address.' }),
		username: zUsernameLikeField(),
		displayName: zDisplayNameLikeField(),
		password: zPasswordLikeField(),
		confirmPassword: z.string()
	})
	.refine((data) => data.password === data.confirmPassword, {
		message: 'Passwords do not match.',
		path: ['confirmPassword']
	});

interface RegistrationReturnBody {
	validationError?: {
		fieldErrors: {
			email?: string[];
			username?: string[];
			displayName?: string[];
			password?: string[];
			confirmPassword?: string[];
		};
		formErrors: string[];
	};
	message?: string;
	data?: {
		email?: string;
		username?: string;
		displayName?: string;
	};
}

export const actions = {
	default: async ({ request, fetch }) => {
		const formData = Object.fromEntries(await request.formData());

		const validationResult = registerSchema.safeParse(formData);
		if (!validationResult.success) {
			const fieldErrors = z.flattenError(validationResult.error);
			const body: RegistrationReturnBody = {
				validationError: fieldErrors,
				data: {
					email: formData.email as string,
					username: formData.username as string,
					displayName: formData.displayName as string
				}
			};
			return fail(400, body);
		}

		const { email, username, displayName, password } = validationResult.data;
		const reqPayload = {
			user_email: email,
			username: username,
			user_display_name: displayName,
			user_pwd: password
		};

		const res = await fetch('/api/users/register', {
			method: 'POST',
			headers: { 'Content-Type': 'application/json' },
			body: JSON.stringify(reqPayload)
		});

		if (!res.ok) {
			const errorData = await res.json().catch(() => ({}));
			const body: RegistrationReturnBody = {
				message: errorData.detail || res.statusText,
				data: { email, username, displayName }
			};
			return fail(res.status, body);
		}

		throw redirect(303, '/login');
	}
} satisfies Actions;
