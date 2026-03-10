import { error } from "@sveltejs/kit";
import type { PageLoad } from "./$types";

export const load: PageLoad = async ({ fetch, params }) => {
    try {
        const res = await fetch('/api/events', {
            method: 'GET'
        });

        if (res.ok) {
            const data = await res.json();
            return {
                events: data
            };
        }
        else {
            const errorData = await res.json().catch(() => ({}));
            throw error(res.status, errorData.detail || "Could not fetch events. Please try again.");
        }
    }
    catch (err) {
        console.error("Event fetch error:", err)
        throw error(500, "Could not connect to the server.");
    }
}
