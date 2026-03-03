<template>
  <section class="auth-view">
    <div class="auth-card">
      <h1>Log in</h1>
      <p class="subtitle">Use your email and password.</p>
      <p class="note">Form wiring will be added after auth API is ready.</p>
    </div>
  </section>
</template>

<script setup lang="ts"></script>

<style scoped>
.auth-view {
  display: flex;
  justify-content: center;
  align-items: center;
  min-height: 60vh;
}

.auth-card {
  width: 100%;
  max-width: 360px;
  padding: 2rem;
  border-radius: 1rem;
  background: rgba(15, 23, 42, 0.95);
  border: 1px solid rgba(148, 163, 184, 0.5);
  text-align: center;
}

h1 {
  font-size: 1.4rem;
  margin-bottom: 0.25rem;
}

.subtitle {
  color: #9ca3af;
  font-size: 0.9rem;
}

.note {
  margin-top: 1rem;
  font-size: 0.85rem;
  color: #e5e7eb;
}
</style>

