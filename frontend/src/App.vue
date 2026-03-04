<template>
  <div class="app-shell">
    <header class="top-bar">
      <RouterLink to="/" class="logo">Flashy Dashboard</RouterLink>
      <nav class="nav-actions">
        <template v-if="auth.isAuthenticated">
          <RouterLink to="/create" class="primary-button">Create Equation</RouterLink>
          <div class="user-menu">
            <span class="avatar-circle">{{ avatarLetter }}</span>
            <span class="username">{{ auth.user?.username }}</span>
            <button type="button" class="ghost-btn" @click="auth.logout()">Log out</button>
          </div>
        </template>
        <template v-else>
          <RouterLink to="/login" class="ghost-button">Log in</RouterLink>
          <RouterLink to="/register" class="primary-button">Sign up</RouterLink>
        </template>
      </nav>
    </header>

    <main class="app-main">
      <RouterView />
    </main>
  </div>
</template>

<script setup lang="ts">
import { computed } from "vue";
import { useAuthStore } from "@/features/auth/stores/useAuthStore";

const auth = useAuthStore();
const avatarLetter = computed(() =>
  auth.user?.username?.charAt(0)?.toUpperCase() ?? "U"
);
</script>

<style scoped>
.app-shell {
  min-height: 100vh;
  display: flex;
  flex-direction: column;
  background: radial-gradient(circle at top left, #1f2937, #020617);
  color: #f9fafb;
}

.top-bar {
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 0.75rem 1.5rem;
  backdrop-filter: blur(16px);
  background: rgba(15, 23, 42, 0.85);
  border-bottom: 1px solid rgba(148, 163, 184, 0.3);
}

.logo {
  font-weight: 700;
  letter-spacing: 0.08em;
  text-transform: uppercase;
  font-size: 0.9rem;
}

.nav-actions {
  display: flex;
  gap: 0.75rem;
}

.primary-button {
  padding: 0.4rem 0.9rem;
  border-radius: 999px;
  background: linear-gradient(135deg, #22c55e, #14b8a6);
  color: #020617;
  font-size: 0.85rem;
  font-weight: 600;
  text-decoration: none;
  box-shadow: 0 8px 20px rgba(34, 197, 94, 0.5);
}

.primary-button:hover {
  filter: brightness(1.05);
}

.logo {
  text-decoration: none;
}

.user-menu {
  display: flex;
  align-items: center;
  gap: 0.5rem;
}

.avatar-circle {
  width: 28px;
  height: 28px;
  border-radius: 999px;
  background: radial-gradient(circle at 30% 20%, #38bdf8, #6366f1);
  display: inline-flex;
  align-items: center;
  justify-content: center;
  font-size: 0.8rem;
  font-weight: 600;
}

.username {
  font-size: 0.85rem;
  color: #e5e7eb;
}

.ghost-button {
  padding: 0.4rem 0.9rem;
  border-radius: 999px;
  border: 1px solid rgba(148, 163, 184, 0.8);
  color: #e5e7eb;
  font-size: 0.85rem;
  text-decoration: none;
}

.ghost-button:hover {
  background: rgba(148, 163, 184, 0.15);
}

.ghost-btn {
  padding: 0.35rem 0.75rem;
  border-radius: 999px;
  border: 1px solid rgba(148, 163, 184, 0.6);
  background: transparent;
  color: #94a3b8;
  font-size: 0.8rem;
  cursor: pointer;
}

.ghost-btn:hover {
  background: rgba(148, 163, 184, 0.15);
  color: #e5e7eb;
}

.app-main {
  flex: 1;
  padding: 1.5rem;
  max-width: 960px;
  margin: 0 auto;
  width: 100%;
}
</style>

