import type { PageLoad } from "./$types";

export const load: PageLoad = async ({ fetch, params }) => {
    try {
        const res = await fetch('/api/events', {
            method: 'GET'
        });

        if (res.ok) {
            const data = await res.json();
            return data;
        }
        else {
            const errorText = await res.text();
            console.error(`Fetch Error! >>> (${res.status}): ${errorText}`);
            return {};
        }
    }
    catch (err) {
        console.error("Network Error! >>> ", err)
        return {};
    }
}
