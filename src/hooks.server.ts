import type { Handle } from '@sveltejs/kit';
import { BACKEND_API_URL } from '$env/static/private';

export const handle: Handle = async ({ event, resolve }) => {
    if (event.url.pathname.startsWith('/api/')) {
        const targetUrl = `${BACKEND_API_URL}${event.url.pathname}${event.url.search}`;

        const response = await fetch(targetUrl, {
            method: event.request.method,
            headers: event.request.headers,
            body: event.request.body
        });

        return response;
    }

    return resolve(event);
};