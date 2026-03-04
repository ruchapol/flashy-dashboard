import { API_BASE } from "@/shared/config";

export interface PostPublic {
  id: string;
  author_id: string;
  equation_text: string;
  x_min: number;
  x_max: number;
  y_min: number | null;
  y_max: number | null;
  y_auto: boolean;
  caption: string;
  created_at: string;
  like_count: number;
  comment_count: number;
}

export interface PostCreate {
  equation_text: string;
  x_min: number;
  x_max: number;
  y_min?: number | null;
  y_max?: number | null;
  y_auto?: boolean;
  caption?: string;
}

async function handleResponse<T>(res: Response): Promise<T> {
  const text = await res.text();
  const data = text ? (JSON.parse(text) as T) : ({} as T);
  if (!res.ok) {
    const detail = (data as { detail?: string })?.detail ?? res.statusText;
    throw new Error(typeof detail === "string" ? detail : JSON.stringify(detail));
  }
  return data;
}

export async function fetchPosts(
  token: string | null,
  cursor?: string,
  limit = 20
): Promise<{ items: PostPublic[]; next_cursor: string | null }> {
  const url = new URL(`${API_BASE}/posts`);
  url.searchParams.set("limit", String(limit));
  if (cursor) url.searchParams.set("cursor", cursor);
  const headers: Record<string, string> = {};
  if (token) headers.Authorization = `Bearer ${token}`;
  const res = await fetch(url.toString(), { headers });
  return handleResponse(res);
}

export async function fetchPostById(
  id: string,
  token: string | null
): Promise<PostPublic | null> {
  const headers: Record<string, string> = {};
  if (token) headers.Authorization = `Bearer ${token}`;
  const res = await fetch(`${API_BASE}/posts/${id}`, { headers });
  if (res.status === 404) return null;
  return handleResponse<PostPublic>(res);
}

export async function fetchPostsSafe(
  token: string | null,
  cursor?: string,
  limit = 20
): Promise<{ items: PostPublic[]; next_cursor: string | null }> {
  try {
    return await fetchPosts(token, cursor, limit);
  } catch {
    return { items: [], next_cursor: null };
  }
}

export async function createPost(
  token: string,
  body: PostCreate
): Promise<PostPublic> {
  const res = await fetch(`${API_BASE}/posts`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${token}`,
    },
    body: JSON.stringify(body),
  });
  return handleResponse<PostPublic>(res);
}
