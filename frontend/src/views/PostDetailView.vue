<template>
  <section class="post-detail">
    <div v-if="loading" class="card">
      <p>Loading post…</p>
    </div>

    <div v-else-if="!post" class="card">
      <p>Post not found.</p>
      <RouterLink to="/" class="back-link">← Back to timeline</RouterLink>
    </div>

    <template v-else>
      <header class="view-header">
        <RouterLink to="/" class="back-link">← Timeline</RouterLink>
        <h1>Graph post</h1>
      </header>

      <div class="card post-card">
        <div class="post-header">
          <span class="equation">{{ post.equation_text }}</span>
          <span class="meta">x ∈ [{{ post.x_min }}, {{ post.x_max }}]</span>
        </div>
        <p v-if="post.caption" class="caption">{{ post.caption }}</p>
        <div class="post-footer">
          <span class="stats">{{ post.like_count }} likes · {{ post.comment_count }} comments</span>
        </div>
      </div>

      <div class="card comments-section">
        <h2 class="comments-title">Comments</h2>
        <p class="comments-placeholder">Comments will appear here when the API is available.</p>
      </div>
    </template>
  </section>
</template>

<script setup lang="ts">
import { ref, onMounted, watch } from "vue";
import { useRoute } from "vue-router";
import { useAuthStore } from "@/features/auth/stores/useAuthStore";
import * as postsApi from "@/features/posts/api/posts";
import type { PostPublic } from "@/features/posts/api/posts";

const props = defineProps<{ id: string }>();
const route = useRoute();
const auth = useAuthStore();

const post = ref<PostPublic | null>(null);
const loading = ref(true);

async function load() {
  const id = props.id ?? (route.params.id as string);
  if (!id) {
    loading.value = false;
    return;
  }
  loading.value = true;
  try {
    post.value = await postsApi.fetchPostById(id, auth.token);
  } catch {
    post.value = null;
  } finally {
    loading.value = false;
  }
}

onMounted(() => load());
watch(() => props.id, () => load());
</script>

<style scoped>
.view-header {
  margin-bottom: 1rem;
}

.view-header h1 {
  font-size: 1.6rem;
  margin: 0.5rem 0 0;
}

.back-link {
  font-size: 0.9rem;
  color: #38bdf8;
  text-decoration: none;
}

.back-link:hover {
  text-decoration: underline;
}

.card {
  margin-top: 1rem;
  padding: 1.5rem 1.25rem;
  border-radius: 1rem;
  background: rgba(15, 23, 42, 0.9);
  border: 1px solid rgba(148, 163, 184, 0.5);
}

.post-header {
  display: flex;
  flex-wrap: wrap;
  align-items: baseline;
  gap: 0.5rem;
}

.equation {
  font-family: ui-monospace, monospace;
  font-size: 1.1rem;
  color: #e5e7eb;
}

.meta {
  font-size: 0.85rem;
  color: #94a3b8;
}

.caption {
  margin: 0.5rem 0 0;
  font-size: 0.95rem;
  color: #cbd5e1;
}

.post-footer {
  margin-top: 0.75rem;
}

.stats {
  font-size: 0.85rem;
  color: #94a3b8;
}

.comments-section {
  margin-top: 1.5rem;
}

.comments-title {
  font-size: 1.1rem;
  margin: 0 0 0.5rem;
}

.comments-placeholder {
  font-size: 0.9rem;
  color: #94a3b8;
  margin: 0;
}
</style>
