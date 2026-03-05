import { API_BASE } from "@/shared/config";

export interface Token {
  access_token: string;
  token_type: string;
}

export interface UserPublic {
  id: string;
  username: string;
  email: string;
  role: string;
  created_at: string;
}

export interface UserCreate {
  username: string;
  email: string;
  password: string;
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


export async function register(user: UserCreate): Promise<UserPublic> {
  const res = await fetch(`${API_BASE}/auth/register`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(user),
  });
  return handleResponse<UserPublic>(res);
}

export async function login(email: string, password: string): Promise<Token> {
  const body = new URLSearchParams({ username: email, password });
  const res = await fetch(`${API_BASE}/auth/login`, {
    method: "POST",
    headers: { "Content-Type": "application/x-www-form-urlencoded" },
    body: body.toString(),
  });
  return handleResponse<Token>(res);
}

export async function fetchMe(token: string): Promise<UserPublic> {
  const res = await fetch(`${API_BASE}/auth/me`, {
    headers: { Authorization: `Bearer ${token}` },
  });
  return handleResponse<UserPublic>(res);
}
