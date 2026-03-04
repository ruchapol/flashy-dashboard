import { defineStore } from "pinia";
import { ref, computed } from "vue";
import * as authApi from "@/features/auth/api/auth";
import type { UserPublic } from "@/features/auth/api/auth";

const TOKEN_KEY = "flashy_token";

function getStoredToken(): string | null {
  return localStorage.getItem(TOKEN_KEY);
}

function setStoredToken(token: string | null): void {
  if (token) localStorage.setItem(TOKEN_KEY, token);
  else localStorage.removeItem(TOKEN_KEY);
}

export const useAuthStore = defineStore("auth", () => {
  const token = ref<string | null>(getStoredToken());
  const user = ref<UserPublic | null>(null);
  const initDone = ref(false);

  const isAuthenticated = computed(() => !!token.value);

  async function init(): Promise<void> {
    if (initDone.value) return;
    initDone.value = true;
    const t = getStoredToken();
    if (!t) return;
    token.value = t;
    try {
      user.value = await authApi.fetchMe(t);
    } catch {
      token.value = null;
      setStoredToken(null);
    }
  }

  async function login(email: string, password: string): Promise<void> {
    const { access_token } = await authApi.login(email, password);
    token.value = access_token;
    setStoredToken(access_token);
    user.value = await authApi.fetchMe(access_token);
  }

  async function register(
    username: string,
    email: string,
    password: string
  ): Promise<void> {
    await authApi.register({ username, email, password });
    await login(email, password);
  }

  function logout(): void {
    token.value = null;
    user.value = null;
    setStoredToken(null);
  }

  function getAuthHeaders(): Record<string, string> {
    const t = token.value;
    return t ? { Authorization: `Bearer ${t}` } : {};
  }

  return {
    token,
    user,
    initDone,
    isAuthenticated,
    init,
    login,
    register,
    logout,
    getAuthHeaders,
  };
});
