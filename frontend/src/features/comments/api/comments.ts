import { API_BASE } from "@/shared/config";
import type { Comment, CreateCommentPayload } from "../types";

async function handleResponse<T>(res: Response): Promise<T> {
  const text = await res.text();
  const data = text ? (JSON.parse(text) as T) : ({} as T);
  if (!res.ok) {
    const detail = (data as { detail?: string })?.detail ?? res.statusText;
    throw new Error(typeof detail === "string" ? detail : JSON.stringify(detail));
  }
  return data;
}

export async function fetchCommentsForPost(
  postId: string,
  token: string | null
): Promise<Comment[]> {
  const headers: Record<string, string> = {};
  if (token) headers.Authorization = `Bearer ${token}`;
  const res = await fetch(`${API_BASE}/posts/${postId}/comments`, { headers });
  return handleResponse<Comment[]>(res);
}

export async function createCommentForPost(
  postId: string,
  token: string,
  payload: CreateCommentPayload
): Promise<Comment> {
  const res = await fetch(`${API_BASE}/posts/${postId}/comments`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${token}`,
    },
    body: JSON.stringify(payload),
  });
  return handleResponse<Comment>(res);
}

