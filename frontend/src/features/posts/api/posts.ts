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

export function buildPostsUrl(limit: number, cursor?: string): string {
  const params = new URLSearchParams({ limit: String(limit) });
  if (cursor) params.set("cursor", cursor);

  // Use the frontend proxy by default (Vite proxies /api -> backend)
  const base = API_BASE.replace(/\/$/, "");
  return `${base}/posts?${params.toString()}`;
}

export async function fetchPosts(
  token: string | null,
  cursor?: string,
  limit = 10
): Promise<{ items: PostPublic[]; next_cursor: string | null }> {
  const url = buildPostsUrl(limit, cursor);
  const headers: Record<string, string> = {};
  if (token) headers.Authorization = `Bearer ${token}`;
  const res = await fetch(url, { headers });
  return handleResponse(res);
}

export async function fetchPostsMock(
  _token: string | null,
  cursor?: string,
  limit = 10
): Promise<{ items: PostPublic[]; next_cursor: string | null }> {
  const url = buildPostsUrl(limit, cursor);

  console.groupCollapsed("[mock] fetchPosts");
  console.log("API_BASE", API_BASE);
  console.log("cursor", cursor);
  console.log("limit", limit);
  console.log("built url", url);
  console.groupEnd();

  const now = new Date().toISOString();
  const items: PostPublic[] = Array.from({ length: Math.min(limit, 3) }).map(
    (_, i) => ({
      id: `mock-${cursor ?? "first"}-${i}`,
      author_id: "mock-author",
      equation_text: "sin(x)",
      x_min: -10,
      x_max: 10,
      y_min: null,
      y_max: null,
      y_auto: true,
      caption: "Mock post (no network)",
      created_at: now,
      like_count: 0,
      comment_count: 0,
    })
  );

  // Simulate pagination
  const next_cursor = cursor ? null : "mock-next";
  return { items, next_cursor };
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
  limit = 10
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
