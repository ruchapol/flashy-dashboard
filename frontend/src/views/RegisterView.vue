<template>
  <section class="auth-view">
    <div class="auth-card">
      <h1>Sign up</h1>
      <p class="subtitle">Choose a username, email, and password.</p>

      <form class="auth-form" @submit.prevent="onSubmit">
        <input
          v-model="username"
          type="text"
          placeholder="Username"
          required
          minlength="3"
          maxlength="32"
          autocomplete="username"
          class="input"
        />
        <input
          v-model="email"
          type="email"
          placeholder="Email"
          required
          autocomplete="email"
          class="input"
        />
        <input
          v-model="password"
          type="password"
          placeholder="Password (min 8 characters)"
          required
          minlength="8"
          autocomplete="new-password"
          class="input"
        />
        <p v-if="error" class="error">{{ error }}</p>
        <button type="submit" class="submit-btn" :disabled="loading">
          {{ loading ? "Creating account…" : "Sign up" }}
        </button>
      </form>

      <p class="footer">
        Already have an account?
        <RouterLink to="/login" class="link">Log in</RouterLink>
      </p>
    </div>
  </section>
</template>

<script setup lang="ts">
import { ref } from "vue";
import { useRouter } from "vue-router";
import { useAuthStore } from "@/features/auth/stores/useAuthStore";

const router = useRouter();
const auth = useAuthStore();

const username = ref("");
const email = ref("");
const password = ref("");
const error = ref("");
const loading = ref(false);

async function onSubmit() {
  error.value = "";
  loading.value = true;
  try {
    await auth.register(username.value, email.value, password.value);
    await router.push("/");
  } catch (e) {
    error.value = e instanceof Error ? e.message : "Sign up failed";
  } finally {
    loading.value = false;
  }
}
</script>

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
  margin-bottom: 1.25rem;
}

.auth-form {
  display: flex;
  flex-direction: column;
  gap: 0.75rem;
  text-align: left;
}

.input {
  width: 100%;
  padding: 0.6rem 0.75rem;
  border-radius: 0.5rem;
  border: 1px solid rgba(148, 163, 184, 0.5);
  background: rgba(15, 23, 42, 0.8);
  color: #f9fafb;
  font-size: 0.95rem;
}

.input::placeholder {
  color: #6b7280;
}

.error {
  font-size: 0.85rem;
  color: #f87171;
  margin: 0;
}

.submit-btn {
  margin-top: 0.25rem;
  padding: 0.6rem 1rem;
  border-radius: 0.5rem;
  border: none;
  background: linear-gradient(135deg, #22c55e, #14b8a6);
  color: #020617;
  font-weight: 600;
  cursor: pointer;
}

.submit-btn:disabled {
  opacity: 0.7;
  cursor: not-allowed;
}

.footer {
  margin-top: 1.25rem;
  font-size: 0.9rem;
  color: #9ca3af;
}

.link {
  color: #38bdf8;
  text-decoration: none;
}

.link:hover {
  text-decoration: underline;
}
</style>
