import { error } from "@sveltejs/kit";
import type { PageServerLoad } from "./$types";

export const load: PageServerLoad = async ({ fetch, cookies }) => {
    try {
        const res = await fetch('/api/users/me', {
            method: 'GET'
        });

        if (res.ok) {
            const data = await res.json();
            return data;
        }

        if (res.status == 401) {
            cookies.delete("session_token", { path: "/" })
            throw error(401, "Session expired.");
        }

        const errorData = await res.json().catch(() => ({}));
        throw error(res.status, errorData.detail || "Could not fetch user profile. Please try again.");
    }
    catch (err) {
        console.error("Event fetch error:", err)
        throw error(500, "Could not connect to the server.");
    }
};