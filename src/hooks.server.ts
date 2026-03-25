import { redirect, type Handle } from '@sveltejs/kit';
import { BACKEND_API_URL } from '$env/static/private';

export const handle: Handle = async ({ event, resolve }) => {
	// Catch API fetch
	if (event.url.pathname.startsWith('/api')) {
		const targetUrl = `${BACKEND_API_URL}${event.url.pathname}${event.url.search}`;

		const response = await fetch(targetUrl, {
			method: event.request.method,
			headers: event.request.headers,
			body: event.request.body,
			// @ts-expect-error - Node.js requires duplex for streaming bodies
			duplex: 'half'
		});

		return response;
	}

	// Catch protected routes
	const protectedRoutes = ['/account', '/orgs/manage', '/orgs/create'];
	const acessingProtected = protectedRoutes.some((route) => event.url.pathname.startsWith(route));
	const sessionExists = event.cookies.get('session_token') != undefined;

	if (acessingProtected && !sessionExists) {
		throw redirect(303, '/login');
	}

	const response = await resolve(event);

	if (acessingProtected) {
		response.headers.set('Cache-Control', 'no-cache');
		response.headers.set('Pragma', 'no-store');
		response.headers.set('Expires', '0');
	}

	return response;
};
