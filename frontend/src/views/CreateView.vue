<template>
  <section class="create-equation">
    <header class="view-header">
      <h1>Create Equation</h1>
      <p>Enter your formula, set ranges, then post to the timeline.</p>
    </header>

    <div class="card">
      <form class="create-form" @submit.prevent="onSubmit">
        <label class="label">Equation (e.g. x^2, sin(x))</label>
        <input
          v-model="form.equation_text"
          type="text"
          placeholder="x^2"
          required
          maxlength="512"
          class="input"
        />

        <div class="row">
          <div class="field">
            <label class="label">x min</label>
            <input v-model.number="form.x_min" type="number" step="any" required class="input" />
          </div>
          <div class="field">
            <label class="label">x max</label>
            <input v-model.number="form.x_max" type="number" step="any" required class="input" />
          </div>
        </div>

        <div class="row">
          <div class="field">
            <label class="label">y min (optional)</label>
            <input v-model.number="form.y_min" type="number" step="any" class="input" />
          </div>
          <div class="field">
            <label class="label">y max (optional)</label>
            <input v-model.number="form.y_max" type="number" step="any" class="input" />
          </div>
        </div>

        <label class="label checkbox-label">
          <input v-model="form.y_auto" type="checkbox" />
          Auto y range
        </label>

        <label class="label">Caption (optional)</label>
        <textarea
          v-model="form.caption"
          placeholder="Describe your graph…"
          maxlength="280"
          rows="2"
          class="textarea"
        />

        <p v-if="error" class="error">{{ error }}</p>
        <button type="submit" class="submit-btn" :disabled="loading">
          {{ loading ? "Posting…" : "Post to timeline" }}
        </button>
      </form>
    </div>
  </section>
</template>

<script setup lang="ts">
import { ref, reactive } from "vue";
import { useRouter } from "vue-router";
import { useAuthStore } from "@/features/auth/stores/useAuthStore";
import * as postsApi from "@/features/posts/api/posts";

const router = useRouter();
const auth = useAuthStore();

const form = reactive({
  equation_text: "",
  x_min: -10,
  x_max: 10,
  y_min: null as number | null,
  y_max: null as number | null,
  y_auto: true,
  caption: "",
});

const error = ref("");
const loading = ref(false);

async function onSubmit() {
  if (!auth.token) {
    error.value = "You must be logged in to post.";
    return;
  }
  error.value = "";
  loading.value = true;
  try {
    const post = await postsApi.createPost(auth.token, {
      equation_text: form.equation_text.trim(),
      x_min: form.x_min,
      x_max: form.x_max,
      y_min: form.y_min ?? undefined,
      y_max: form.y_max ?? undefined,
      y_auto: form.y_auto,
      caption: form.caption.trim(),
    });
    await router.push(`/post/${post.id}`);
  } catch (e) {
    error.value = e instanceof Error ? e.message : "Failed to create post";
  } finally {
    loading.value = false;
  }
}
</script>

<style scoped>
.view-header h1 {
  font-size: 1.6rem;
  margin-bottom: 0.25rem;
}

.view-header p {
  color: #9ca3af;
  font-size: 0.9rem;
}

.card {
  margin-top: 1.5rem;
  padding: 2rem;
  border-radius: 1rem;
  background: rgba(15, 23, 42, 0.9);
  border: 1px solid rgba(148, 163, 184, 0.5);
}

.create-form {
  display: flex;
  flex-direction: column;
  gap: 1rem;
  max-width: 28rem;
}

.label {
  font-size: 0.9rem;
  color: #e5e7eb;
}

.checkbox-label {
  display: flex;
  align-items: center;
  gap: 0.5rem;
  cursor: pointer;
}

.row {
  display: flex;
  gap: 1rem;
}

.field {
  flex: 1;
  display: flex;
  flex-direction: column;
  gap: 0.25rem;
}

.input,
.textarea {
  width: 100%;
  padding: 0.6rem 0.75rem;
  border-radius: 0.5rem;
  border: 1px solid rgba(148, 163, 184, 0.5);
  background: rgba(15, 23, 42, 0.8);
  color: #f9fafb;
  font-size: 0.95rem;
  font-family: inherit;
}

.textarea {
  resize: vertical;
  min-height: 2.5rem;
}

.error {
  font-size: 0.85rem;
  color: #f87171;
  margin: 0;
}

.submit-btn {
  padding: 0.6rem 1rem;
  border-radius: 0.5rem;
  border: none;
  background: linear-gradient(135deg, #22c55e, #14b8a6);
  color: #020617;
  font-weight: 600;
  cursor: pointer;
  font-size: 1rem;
}

.submit-btn:disabled {
  opacity: 0.7;
  cursor: not-allowed;
}
</style>
