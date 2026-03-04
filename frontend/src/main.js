import { createApp } from "vue";
import { createPinia } from "pinia";
import App from "./App.vue";
import { router } from "./router";
import { useAuthStore } from "@/features/auth/stores/useAuthStore";
import "./style.css";
const app = createApp(App);
const pinia = createPinia();
app.use(pinia);
app.use(router);
router.beforeEach(async (to) => {
    const auth = useAuthStore();
    await auth.init();
    const requiresAuth = to.meta.requiresAuth === true;
    if (requiresAuth && !auth.isAuthenticated) {
        return { name: "login", query: { redirect: to.fullPath } };
    }
    return true;
});
app.mount("#app");
