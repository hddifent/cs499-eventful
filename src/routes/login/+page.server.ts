import { fail, redirect } from '@sveltejs/kit';
import type { Actions } from './$types';
import { z } from 'zod';

import { dev } from '$app/environment';

const loginSchema = z.object({
	username: z.string().min(1, { message: 'Please fill out this field.' }),
	password: z.string().min(1, { message: 'Please fill out this field.' })
});

interface LoginReturnBody {
	validationError?: {
		fieldErrors: {
			username?: string[];
			password?: string[];
		};
		formErrors: string[];
	};
	message?: string;
	data?: {
		username?: string;
	};
}

export const actions = {
	default: async ({ request, fetch, cookies }) => {
		const formData = Object.fromEntries(await request.formData());

		const validationResult = loginSchema.safeParse(formData);
		if (!validationResult.success) {
			const fieldErrors = z.flattenError(validationResult.error);
			const body: LoginReturnBody = {
				validationError: fieldErrors,
				data: {
					username: formData.username as string
				}
			};
			return fail(400, body);
		}

		const { username, password } = validationResult.data;
		const reqPayload = {
			username: username,
			user_pwd: password
		};

		const res = await fetch('/api/users/login', {
			method: 'POST',
			headers: { 'Content-Type': 'application/json' },
			body: JSON.stringify(reqPayload)
		});

		if (!res.ok) {
			const errorData = await res.json().catch(() => ({}));
			const body: LoginReturnBody = {
				message: errorData.detail || res.statusText,
				data: { username }
			};
			return fail(res.status, body);
		}

		const data = await res.json();
		cookies.set('session_token', data.session_token, {
			path: '/',
			httpOnly: true,
			sameSite: 'lax',
			secure: !dev,
			maxAge: data.session_maxage
		});

		throw redirect(303, '/');
	}
} satisfies Actions;
