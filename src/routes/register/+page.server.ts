import { fail, redirect } from '@sveltejs/kit';
import type { Actions } from './$types';
import { z } from 'zod'

const registerSchema = z.object({
    email: z.email({ message: "Invalid email address." }),

    username: z.string()
        .min(1, { message: "Username cannot be empty." })
        .max(32, { message: "Username must not exceed 32 characters." })
        .regex(/^[a-zA-Z]/, { message: "Username must start with a letter." })
        .regex(/^(?!.*[_.]{2})/, { message: "Username cannot have consecutive underscores or periods." })
        .regex(/^[a-zA-Z0-9_.]+$/, { message: "Username can only contain letters, numbers, underscores, or periods." }),

    displayName: z.string()
        .trim()
        .min(1, { message: "Display name cannot be empty." })
        .max(100, { message: "Display name must not exceed 100 characters." })
        .regex(/^[a-zA-Z0-9_. -]+$/, { message: "Display name contains invalid characters." }),

    password: z.string()
        .min(8, { message: "Password must be at least 8 characters." })
        .max(64, { message: "Password must not exceed 64 characters." }),

    confirmPassword: z.string()
}).refine((data) => data.password === data.confirmPassword, {
    message: "Passwords do not match.",
    path: ["confirmPassword"]
});

interface RegistrationReturnBody {
    validationError?: {
        fieldErrors: {
            email?: string[],
            username?: string[],
            displayName?: string[],
            password?: string[],
            confirmPassword?: string[]
        }
        formErrors: string[]
    };
    message?: string;
    data?: {
        email?: string,
        username?: string,
        displayName?: string
    };
}

export const actions = {
    default: async ({ request, fetch }) => {
        const formData = Object.fromEntries(await request.formData());

        const validationResult = registerSchema.safeParse(formData);
        if (!validationResult.success) {
            const fieldErrors = z.flattenError(validationResult.error)
            const body: RegistrationReturnBody = {
                validationError: fieldErrors,
                data: {
                    email: formData.email as string,
                    username: formData.username as string,
                    displayName: formData.displayName as string,
                }
            }
            return fail(400, body);
        }

        const { email, username, displayName, password } = validationResult.data;
        const reqPayload = {
            user_email: email,
            username: username,
            user_display_name: displayName,
            user_pwd: password
        }

        try {
            const res = await fetch('/api/users/register', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(reqPayload)
            });

            if (!res.ok) {
                const errorData = await res.json().catch(() => ({}));
                const body: RegistrationReturnBody = {
                    message: errorData.detail || 'Registration failed. Please try again.',
                    data: { email, username, displayName }
                }
                return fail(res.status, body);
            }
        }
        catch (err) {
            console.error('Register error:', err);
            const body: RegistrationReturnBody = {
                message: 'Could not connect to the server.',
                data: { email, username, displayName }
            }
            return fail(500, body);
        }

        throw redirect(303, '/login');
    }
} satisfies Actions;