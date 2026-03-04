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
export async function register(user) {
    const res = await fetch(`${API_BASE}/auth/register`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(user),
    });
    return handleResponse(res);
}
export async function login(email, password) {
    const body = new URLSearchParams({ username: email, password });
    const res = await fetch(`${API_BASE}/auth/login`, {
        method: "POST",
        headers: { "Content-Type": "application/x-www-form-urlencoded" },
        body: body.toString(),
    });
    return handleResponse(res);
}
export async function fetchMe(token) {
    const res = await fetch(`${API_BASE}/auth/me`, {
        headers: { Authorization: `Bearer ${token}` },
    });
    return handleResponse(res);
}
