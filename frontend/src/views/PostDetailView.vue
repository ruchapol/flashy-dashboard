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

      <div class="card">
        <PostCard :post="post" :borderless="true" :showView="false" />
      </div>

      <div class="card comments-section">
        <h2 class="comments-title">Comments</h2>

        <div v-if="commentsLoading" class="comments-placeholder">
          Loading comments…
        </div>
        <div v-else-if="commentsError" class="comments-error">
          {{ commentsError }}
        </div>
        <ul v-else-if="comments.length" class="comments-list">
          <li v-for="comment in comments" :key="comment.id" class="comment-item">
            <div class="comment-meta">
              <span class="comment-author">{{ comment.author_username }}</span>
              <span class="comment-separator">•</span>
              <span class="comment-date">
                {{ new Date(comment.created_at).toLocaleString() }}
              </span>
            </div>
            <p class="comment-text">
              {{ comment.text }}
            </p>
          </li>
        </ul>
        <p v-else class="comments-placeholder">No comments yet. Be the first to comment.</p>

        <div class="comment-form">
          <textarea
            v-model="newCommentText"
            class="comment-input"
            :placeholder="
              auth.token
                ? 'Write a comment…'
                : 'Sign in to add a comment.'
            "
            :disabled="!auth.token || submittingComment"
          />
          <div class="comment-actions">
            <button
              type="button"
              class="btn-secondary"
              @click="onCancelComment"
              :disabled="submittingComment || !newCommentText"
            >
              Cancel
            </button>
            <button
              type="button"
              class="btn-primary"
              @click="onSubmitComment"
              :disabled="
                submittingComment ||
                !auth.token ||
                !newCommentText.trim().length
              "
            >
              {{ submittingComment ? "Submitting…" : "Submit" }}
            </button>
          </div>
        </div>
      </div>
    </template>
  </section>
</template>

<script setup lang="ts">
import { ref, onMounted, watch } from "vue";
import { useRoute } from "vue-router";
import PostCard from "@/components/PostCard.vue";
import { useAuthStore } from "@/features/auth/stores/useAuthStore";
import * as postsApi from "@/features/posts/api/posts";
import type { PostPublic } from "@/features/posts/api/posts";
import type { Comment } from "@/features/comments/types";
import {
  fetchCommentsForPost,
  createCommentForPost,
} from "@/features/comments/api/comments";

const props = defineProps<{ id: string }>();
const route = useRoute();
const auth = useAuthStore();

const post = ref<PostPublic | null>(null);
const loading = ref(true);
const comments = ref<Comment[]>([]);
const commentsLoading = ref(false);
const commentsError = ref<string | null>(null);
const newCommentText = ref("");
const submittingComment = ref(false);

async function load() {
  const id = props.id ?? (route.params.id as string);
  if (!id) {
    loading.value = false;
    return;
  }
  loading.value = true;
  try {
    post.value = await postsApi.fetchPostById(id, auth.token);
    if (post.value) {
      await loadComments(post.value.id);
    } else {
      comments.value = [];
    }
  } catch {
    post.value = null;
    comments.value = [];
  } finally {
    loading.value = false;
  }
}

async function loadComments(postId: string) {
  commentsLoading.value = true;
  commentsError.value = null;
  try {
    comments.value = await fetchCommentsForPost(postId, auth.token);
  } catch (error) {
    const message =
      error instanceof Error ? error.message : "Failed to load comments.";
    commentsError.value = message;
    comments.value = [];
  } finally {
    commentsLoading.value = false;
  }
}

async function onSubmitComment() {
  if (!post.value || !auth.token) {
    return;
  }
  const text = newCommentText.value.trim();
  if (!text) {
    return;
  }

  submittingComment.value = true;
  commentsError.value = null;
  try {
    const created = await createCommentForPost(post.value.id, auth.token, {
      text,
    });
    comments.value.push(created);
    newCommentText.value = "";
  } catch (error) {
    const message =
      error instanceof Error ? error.message : "Failed to submit comment.";
    commentsError.value = message;
  } finally {
    submittingComment.value = false;
  }
}

function onCancelComment() {
  newCommentText.value = "";
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

.comments-error {
  font-size: 0.9rem;
  color: #fca5a5;
  margin: 0 0 0.5rem;
}

.comments-list {
  list-style: none;
  padding: 0;
  margin: 0 0 1rem;
  display: flex;
  flex-direction: column;
  gap: 0.75rem;
}

.comment-item {
  padding: 0.75rem 0.85rem;
  border-radius: 0.75rem;
  background: rgba(15, 23, 42, 0.8);
  border: 1px solid rgba(148, 163, 184, 0.45);
}

.comment-meta {
  display: flex;
  flex-wrap: wrap;
  gap: 0.35rem;
  font-size: 0.8rem;
  color: #94a3b8;
  margin-bottom: 0.25rem;
}

.comment-author {
  font-weight: 500;
}

.comment-separator {
  opacity: 0.7;
}

.comment-date {
  opacity: 0.9;
}

.comment-text {
  margin: 0;
  font-size: 0.9rem;
  color: #e5e7eb;
}

.comment-form {
  margin-top: 1rem;
  display: flex;
  flex-direction: column;
  gap: 0.5rem;
}

.comment-input {
  width: 100%;
  min-height: 80px;
  resize: vertical;
  border-radius: 0.75rem;
  border: 1px solid rgba(148, 163, 184, 0.6);
  padding: 0.75rem 0.85rem;
  background: rgba(15, 23, 42, 0.8);
  color: #e5e7eb;
  font-size: 0.9rem;
}

.comment-input::placeholder {
  color: #64748b;
}

.comment-input:focus {
  outline: none;
  border-color: #38bdf8;
  box-shadow: 0 0 0 1px rgba(56, 189, 248, 0.4);
}

.comment-actions {
  display: flex;
  justify-content: flex-end;
  gap: 0.5rem;
}

.btn-primary,
.btn-secondary {
  padding: 0.45rem 0.9rem;
  border-radius: 999px;
  font-size: 0.85rem;
  border: 1px solid transparent;
  cursor: pointer;
  transition: background-color 0.15s ease, color 0.15s ease, border-color 0.15s ease,
    opacity 0.15s ease, transform 0.05s ease;
}

.btn-primary {
  background: linear-gradient(135deg, #38bdf8, #0ea5e9);
  color: #0b1120;
  font-weight: 600;
}

.btn-primary:hover:not(:disabled) {
  background: linear-gradient(135deg, #0ea5e9, #38bdf8);
  transform: translateY(-0.5px);
}

.btn-secondary {
  background: transparent;
  color: #e5e7eb;
  border-color: rgba(148, 163, 184, 0.6);
}

.btn-secondary:hover:not(:disabled) {
  background: rgba(15, 23, 42, 0.9);
}

.btn-primary:disabled,
.btn-secondary:disabled {
  opacity: 0.5;
  cursor: default;
  transform: none;
}
</style>
