import type { RequestHandler } from "@sveltejs/kit";

export const POST: RequestHandler = async ({ request, fetch }) => {
    const formData = await request.formData();

    const res = await fetch('/api/map/process', {
        method: 'POST',
        body: formData
    });

    if (!res.ok) {
        return new Response(await res.text(), { status: res.status });
    }

    return new Response(JSON.stringify(await res.json()), {
        headers: { 'Content-Type': 'application/json' }
    });
};
