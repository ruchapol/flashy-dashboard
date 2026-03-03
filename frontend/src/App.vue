<template>
  <div class="app-shell">
    <header class="top-bar">
      <div class="logo">Flashy Dashboard</div>
      <nav class="nav-actions">
        <RouterLink to="/create" class="primary-button">Create Equation</RouterLink>
      </nav>
      <div class="user-avatar">
        <span class="avatar-circle">U</span>
      </div>
    </header>

    <main class="app-main">
      <RouterView />
    </main>
  </div>
</template>

<script setup lang="ts"></script>

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

.user-avatar {
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

.app-main {
  flex: 1;
  padding: 1.5rem;
  max-width: 960px;
  margin: 0 auto;
  width: 100%;
}
</style>

