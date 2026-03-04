<template>
  <article class="post-card">
    <div class="post-header">
      <span class="equation">{{ post.equation_text }}</span>
      <span class="meta">x ∈ [{{ post.x_min }}, {{ post.x_max }}]</span>
    </div>
    <p v-if="post.caption" class="caption">{{ post.caption }}</p>
    <div class="post-footer">
      <span class="stats">{{ post.like_count }} likes · {{ post.comment_count }} comments</span>
      <RouterLink :to="postLink" class="link">View</RouterLink>
    </div>
  </article>
</template>

<script setup lang="ts">
import { computed } from "vue";
import type { PostPublic } from "@/features/posts/api/posts";

const props = defineProps<{ post: PostPublic }>();

const postLink = computed(() => `/post/${props.post.id}`);
</script>

<style scoped>
.post-card {
  padding: 1rem 1.25rem;
  border-radius: 0.75rem;
  background: rgba(15, 23, 42, 0.9);
  border: 1px solid rgba(148, 163, 184, 0.4);
}

.post-header {
  display: flex;
  flex-wrap: wrap;
  align-items: baseline;
  gap: 0.5rem;
}

.equation {
  font-family: ui-monospace, monospace;
  font-size: 1rem;
  color: #e5e7eb;
}

.meta {
  font-size: 0.8rem;
  color: #94a3b8;
}

.caption {
  margin: 0.5rem 0 0;
  font-size: 0.9rem;
  color: #cbd5e1;
}

.post-footer {
  margin-top: 0.75rem;
  display: flex;
  justify-content: space-between;
  align-items: center;
}

.stats {
  font-size: 0.8rem;
  color: #94a3b8;
}

.link {
  font-size: 0.85rem;
  color: #38bdf8;
  text-decoration: none;
}

.link:hover {
  text-decoration: underline;
}
</style>
