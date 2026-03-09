import { redirect } from '@sveltejs/kit';
import type { RequestHandler } from './$types';

export const POST: RequestHandler = async ({ cookies, fetch }) => {
    await fetch("/api/users/logout", {
        method: 'POST'
    });
    cookies.delete('session_token', { path: '/' });
    throw redirect(303, '/');
}