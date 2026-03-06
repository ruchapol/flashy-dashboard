<template>
  <article :class="['post-card', { 'post-card--borderless': borderless }]">
    <div class="post-header">
      <div class="post-header-main">
        <span class="equation">{{ post.equation_text }}</span>
        <span class="meta">x ∈ [{{ post.x_min }}, {{ post.x_max }}]</span>
      </div>
      <span class="author">by {{ post.author_username }}</span>
    </div>

    <div v-if="svgPath" class="graph-preview">
      <svg :viewBox="`0 0 ${SVG_WIDTH} ${SVG_HEIGHT}`" role="img" aria-hidden="true">
        <path :d="svgPath" />
      </svg>
    </div>

    <p v-if="post.caption" class="caption">{{ post.caption }}</p>
    <div class="post-footer">
      <div class="post-footer-left">
        <button
          v-if="auth.isAuthenticated"
          type="button"
          class="like-button"
          :class="{ 'like-button--active': liked }"
          :disabled="isLiking"
          @click="toggleLike"
        >
          <span class="like-icon">♥</span>
          <span class="like-label">{{ liked ? "Liked" : "Like" }}</span>
        </button>
        <span class="stats">
          {{ likeCount }} likes · {{ post.comment_count }} comments
        </span>
      </div>
      <RouterLink v-if="showView !== false" :to="postLink" class="link">
        View
      </RouterLink>
    </div>
  </article>
</template>

<script setup lang="ts">
import { computed, ref } from "vue";
import { useAuthStore } from "@/features/auth/stores/useAuthStore";
import type { PostPublic } from "@/features/posts/api/posts";
import * as postsApi from "@/features/posts/api/posts";

const props = defineProps<{
  post: PostPublic;
  borderless?: boolean;
  showView?: boolean;
}>();

const auth = useAuthStore();

const SVG_WIDTH = 260;
const SVG_HEIGHT = 120;
const SAMPLE_POINTS = 1000;

function makeEvaluator(expr: string): ((x: number) => number) | null {
  try {
    // For parametric expressions "x_expr;y_expr", preview only the first part.
    const firstPart = (expr.split(";")[0] ?? expr).trim();

    // First, normalize common "e^(...)" syntax into Math.exp(...).
    const withExp = firstPart.replace(/\be\^\s*\(/g, "Math.exp(");

    // Then normalize caret to JS exponent operator for any remaining uses.
    const normalized = withExp.replace(/\^/g, "**");

    // Fix unary-minus exponent inside Math.exp, e.g. "Math.exp(-x**2)" →
    // "Math.exp(-(x**2))" to satisfy JS exponentiation precedence rules.
    const finalExpr = normalized.replace(/Math\.exp\(-([^()]+)\)/g, "Math.exp(-($1))");

    // eslint-disable-next-line no-console
    console.log("[PostCard] evaluator expression", {
      raw: expr,
      firstPart,
      withExp,
      normalized,
      finalExpr,
    });

    // Provide helpers for common math notations that aren't on Math directly:
    // - `e`   → Math.E
    // - `ln`  → Math.log (natural log)
    // - `sec` → 1 / cos
    // - `rand`→ Math.random
    // eslint-disable-next-line no-new-func
    const fn = new Function(
      "x",
      [
        "const e = Math.E;",
        "const ln = Math.log;",
        "const rand = Math.random;",
        "const sec = (v) => 1 / Math.cos(v);",
        "with (Math) { return " + finalExpr + "; }",
      ].join(" ")
    ) as (x: number) => number;

    // Smoke test
    void fn(0);
    return fn;
  } catch (err) {
    // Debug evaluator creation failures
    // eslint-disable-next-line no-console
    console.warn("[PostCard] makeEvaluator failed", { expr, error: err });
    return null;
  }
}

const svgPath = computed(() => {
  const { equation_text, x_min, x_max, y_min, y_max, y_auto } = props.post;
  const evalFn = makeEvaluator(equation_text);
  if (!evalFn || x_min === x_max) {
    // eslint-disable-next-line no-console
    console.warn("[PostCard] No evalFn or invalid x-range", {
      equation_text,
      x_min,
      x_max,
      hasEvalFn: !!evalFn,
    });
    return "";
  }

  const xs: number[] = [];
  for (let i = 0; i < SAMPLE_POINTS; i += 1) {
    const t = i / (SAMPLE_POINTS - 1);
    xs.push(x_min + (x_max - x_min) * t);
  }

  const samples: { x: number; y: number }[] = [];
  for (const x of xs) {
    try {
      const y = evalFn(x);
      if (Number.isFinite(y)) samples.push({ x, y });
    } catch (err) {
      // eslint-disable-next-line no-console
      console.warn("[PostCard] Evaluation error at x", { x, equation_text, error: err });
      // Skip bad points
    }
  }
  if (samples.length === 0) {
    // eslint-disable-next-line no-console
    console.warn("[PostCard] No finite samples for equation", { equation_text });
    return "";
  }

  let minY: number;
  let maxY: number;
  if (!y_auto && y_min != null && y_max != null && y_min !== y_max) {
    minY = y_min;
    maxY = y_max;
  } else {
    minY = Math.min(...samples.map((p) => p.y));
    maxY = Math.max(...samples.map((p) => p.y));
    if (!Number.isFinite(minY) || !Number.isFinite(maxY) || minY === maxY) {
      minY -= 1;
      maxY += 1;
      // eslint-disable-next-line no-console
      console.warn("[PostCard] Adjusted Y-range due to invalid/flat data", {
        equation_text,
        computedMinY: minY + 1,
        computedMaxY: maxY - 1,
        adjustedMinY: minY,
        adjustedMaxY: maxY,
      });
    }
  }

  const xSpan = x_max - x_min || 1;
  const ySpan = maxY - minY || 1;

  const toSvg = (p: { x: number; y: number }) => {
    const nx = (p.x - x_min) / xSpan;
    const ny = (p.y - minY) / ySpan;
    const sx = nx * SVG_WIDTH;
    const sy = SVG_HEIGHT - ny * SVG_HEIGHT;
    return { sx, sy };
  };

  const mapped = samples.map(toSvg);
  let d = `M ${mapped[0].sx} ${mapped[0].sy}`;
  for (let i = 1; i < mapped.length; i += 1) {
    d += ` L ${mapped[i].sx} ${mapped[i].sy}`;
  }
  return d;
});

const postLink = computed(() => `/post/${props.post.id}`);

const likeCount = ref(props.post.like_count);
const liked = ref(props.post.is_current_user_liked);
const isLiking = ref(false);

async function toggleLike() {
  if (!auth.token || isLiking.value) return;

  isLiking.value = true;
  try {
    if (liked.value) {
      await postsApi.unlikePost(props.post.id, auth.token);
      liked.value = false;
      likeCount.value = Math.max(0, likeCount.value - 1);
    } else {
      await postsApi.likePost(props.post.id, auth.token);
      liked.value = true;
      likeCount.value += 1;
    }
  } catch (error) {
    // eslint-disable-next-line no-console
    console.warn("[PostCard] toggleLike failed", error);
  } finally {
    isLiking.value = false;
  }
}
</script>

<style scoped>
.post-card {
  padding: 1rem 1.25rem;
  border-radius: 0.75rem;
  background: rgba(15, 23, 42, 0.9);
  border: 1px solid rgba(148, 163, 184, 0.4);
}

.post-card--borderless {
  padding: 0;
  border: none;
  background: transparent;
}

.post-header {
  display: flex;
  flex-direction: column;
  gap: 0.2rem;
}

.post-header-main {
  display: flex;
  flex-wrap: wrap;
  align-items: baseline;
  gap: 0.5rem;
}

.graph-preview {
  margin-top: 0.75rem;
  border-radius: 0.75rem;
  overflow: hidden;
  background: radial-gradient(circle at top, rgba(56, 189, 248, 0.08), transparent);
  border: 1px solid rgba(56, 189, 248, 0.6);
}

.graph-preview svg {
  display: block;
  width: 100%;
  height: 140px;
}

.graph-preview path {
  fill: none;
  stroke: #38bdf8;
  stroke-width: 2;
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

.author {
  font-size: 0.8rem;
  color: #9ca3af;
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

.post-footer-left {
  display: flex;
  align-items: center;
  gap: 0.5rem;
}

.stats {
  font-size: 0.8rem;
  color: #94a3b8;
}

.like-button {
  display: inline-flex;
  align-items: center;
  gap: 0.25rem;
  padding: 0.2rem 0.6rem;
  border-radius: 999px;
  border: 1px solid rgba(148, 163, 184, 0.8);
  background: transparent;
  color: #e5e7eb;
  font-size: 0.8rem;
  cursor: pointer;
  transition: background-color 0.15s ease, color 0.15s ease, border-color 0.15s ease,
    transform 0.05s ease, box-shadow 0.15s ease;
}

.like-button:hover:not(:disabled) {
  background: rgba(248, 113, 113, 0.12);
  border-color: rgba(248, 113, 113, 0.8);
  transform: translateY(-0.5px);
  box-shadow: 0 0 0 1px rgba(248, 113, 113, 0.25);
}

.like-button:disabled {
  opacity: 0.6;
  cursor: default;
  transform: none;
  box-shadow: none;
}

.like-button--active {
  background: rgba(248, 113, 113, 0.16);
  border-color: rgba(248, 113, 113, 0.9);
  color: #fecaca;
}

.like-icon {
  font-size: 0.8rem;
}

.like-label {
  font-size: 0.8rem;
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
