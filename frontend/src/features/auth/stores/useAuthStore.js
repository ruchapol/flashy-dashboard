import { defineStore } from "pinia";
import { ref, computed } from "vue";
import * as authApi from "@/features/auth/api/auth";
const TOKEN_KEY = "flashy_token";
function getStoredToken() {
    return localStorage.getItem(TOKEN_KEY);
}
function setStoredToken(token) {
    if (token)
        localStorage.setItem(TOKEN_KEY, token);
    else
        localStorage.removeItem(TOKEN_KEY);
}
export const useAuthStore = defineStore("auth", () => {
    const token = ref(getStoredToken());
    const user = ref(null);
    const initDone = ref(false);
    const isAuthenticated = computed(() => !!token.value);
    async function init() {
        if (initDone.value)
            return;
        initDone.value = true;
        const t = getStoredToken();
        if (!t)
            return;
        token.value = t;
        try {
            user.value = await authApi.fetchMe(t);
        }
        catch {
            token.value = null;
            setStoredToken(null);
        }
    }
    async function login(email, password) {
        const { access_token } = await authApi.login(email, password);
        token.value = access_token;
        setStoredToken(access_token);
        user.value = await authApi.fetchMe(access_token);
    }
    async function register(username, email, password) {
        await authApi.register({ username, email, password });
        await login(email, password);
    }
    function logout() {
        token.value = null;
        user.value = null;
        setStoredToken(null);
    }
    function getAuthHeaders() {
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
