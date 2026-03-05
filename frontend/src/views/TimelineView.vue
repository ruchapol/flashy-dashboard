<template>
  <section class="timeline">
    <header class="timeline-header">
      <h1>Timeline</h1>
      <p>Newest graph posts first. Load more when you reach the bottom.</p>
    </header>

    <div v-if="loading && posts.length === 0" class="timeline-placeholder">
      <p>Loading…</p>
    </div>

    <div v-else-if="error && posts.length === 0" class="timeline-placeholder">
      <p>{{ error }}</p>
      <RouterLink v-if="auth.isAuthenticated" class="ghost-button" to="/create">
        Create your first equation
      </RouterLink>
      <RouterLink v-else class="ghost-button" to="/register">Sign up to create posts</RouterLink>
    </div>

    <template v-else>
      <ul class="post-list">
        <li v-for="post in posts" :key="post.id">
          <PostCard :post="post" :showView="true" />
        </li>
      </ul>
      <div v-if="hasMore && !loadingMore" class="load-more">
        <button type="button" class="ghost-button" @click="loadMore">Load more</button>
      </div>
      <div v-else-if="loadingMore" class="load-more">
        <span class="loading-text">Loading…</span>
      </div>
      <div v-else-if="posts.length === 0" class="timeline-placeholder">
        <p>No posts yet.</p>
        <RouterLink v-if="auth.isAuthenticated" class="ghost-button" to="/create">
          Create your first equation
        </RouterLink>
      </div>
    </template>
  </section>
</template>

<script setup lang="ts">
import { ref, onMounted } from "vue";
import PostCard from "@/components/PostCard.vue";
import { useAuthStore } from "@/features/auth/stores/useAuthStore";
import * as postsApi from "@/features/posts/api/posts";
import type { PostPublic } from "@/features/posts/api/posts";

const auth = useAuthStore();
const posts = ref<PostPublic[]>([]);
const nextCursor = ref<string | null>(null);
const loading = ref(true);
const loadingMore = ref(false);
const error = ref("");
const hasMore = ref(true);

async function load(append: boolean) {
  if (append) loadingMore.value = true;
  else loading.value = true;
  error.value = "";
  try {
    const token = auth.token ?? null;
    const cursor = append ? nextCursor.value ?? undefined : undefined;
    const result = await postsApi.fetchPostsSafe(token, cursor);
    if (append) {
      posts.value.push(...result.items);
    } else {
      posts.value = result.items;
    }
    nextCursor.value = result.next_cursor;
    hasMore.value = !!result.next_cursor;
  } catch (e) {
    const msg = e instanceof Error ? e.message : "Failed to load posts";
    if (!append) error.value = msg;
  } finally {
    loading.value = false;
    loadingMore.value = false;
  }
}

function loadMore() {
  if (!nextCursor.value || loadingMore.value) return;
  load(true);
}

onMounted(() => load(false));
</script>

<style scoped>
.timeline-header h1 {
  font-size: 1.6rem;
  margin-bottom: 0.25rem;
}

.timeline-header p {
  color: #9ca3af;
  font-size: 0.9rem;
}

.post-list {
  list-style: none;
  padding: 0;
  margin: 1.5rem 0 0;
  display: flex;
  flex-direction: column;
  gap: 0.75rem;
}

.load-more {
  margin-top: 1rem;
  text-align: center;
}

.loading-text {
  font-size: 0.9rem;
  color: #94a3b8;
}

.timeline-placeholder {
  margin-top: 1.5rem;
  padding: 2rem;
  border-radius: 1rem;
  border: 1px dashed rgba(148, 163, 184, 0.7);
  text-align: center;
  color: #e5e7eb;
  background: radial-gradient(circle at top, rgba(56, 189, 248, 0.08), transparent);
}

.ghost-button {
  margin-top: 0.75rem;
  display: inline-flex;
  padding: 0.4rem 0.9rem;
  border-radius: 999px;
  border: 1px solid rgba(148, 163, 184, 0.8);
  text-decoration: none;
  color: #e5e7eb;
  font-size: 0.85rem;
  background: transparent;
  cursor: pointer;
  font-family: inherit;
}

.ghost-button:hover {
  background: rgba(148, 163, 184, 0.15);
}

a.ghost-button {
  cursor: pointer;
}
</style>
