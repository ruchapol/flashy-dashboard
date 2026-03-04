import { API_BASE } from "@/shared/config";
async function handleResponse(res) {
    const text = await res.text();
    const data = text ? JSON.parse(text) : {};
    if (!res.ok) {
        const detail = data?.detail ?? res.statusText;
        throw new Error(typeof detail === "string" ? detail : JSON.stringify(detail));
    }
    return data;
}
export async function fetchPosts(token, cursor, limit = 20) {
    const url = new URL(`${API_BASE}/posts`);
    url.searchParams.set("limit", String(limit));
    if (cursor)
        url.searchParams.set("cursor", cursor);
    const headers = {};
    if (token)
        headers.Authorization = `Bearer ${token}`;
    const res = await fetch(url.toString(), { headers });
    return handleResponse(res);
}
export async function fetchPostById(id, token) {
    const headers = {};
    if (token)
        headers.Authorization = `Bearer ${token}`;
    const res = await fetch(`${API_BASE}/posts/${id}`, { headers });
    if (res.status === 404)
        return null;
    return handleResponse(res);
}
export async function fetchPostsSafe(token, cursor, limit = 20) {
    try {
        return await fetchPosts(token, cursor, limit);
    }
    catch {
        return { items: [], next_cursor: null };
    }
}
export async function createPost(token, body) {
    const res = await fetch(`${API_BASE}/posts`, {
        method: "POST",
        headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(body),
    });
    return handleResponse(res);
}
