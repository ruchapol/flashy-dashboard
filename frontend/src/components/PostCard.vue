<template>
  <article :class="['post-card', { 'post-card--borderless': borderless }]">
    <div class="post-header">
      <span class="equation">{{ post.equation_text }}</span>
      <span class="meta">x ∈ [{{ post.x_min }}, {{ post.x_max }}]</span>
    </div>

    <div v-if="svgPath" class="graph-preview">
      <svg :viewBox="`0 0 ${SVG_WIDTH} ${SVG_HEIGHT}`" role="img" aria-hidden="true">
        <path :d="svgPath" />
      </svg>
    </div>

    <p v-if="post.caption" class="caption">{{ post.caption }}</p>
    <div class="post-footer">
      <span class="stats">{{ post.like_count }} likes · {{ post.comment_count }} comments</span>
    <RouterLink v-if="showView !== false" :to="postLink" class="link">View</RouterLink>
    </div>
  </article>
</template>

<script setup lang="ts">
import { computed } from "vue";
import type { PostPublic } from "@/features/posts/api/posts";

const props = defineProps<{
  post: PostPublic;
  borderless?: boolean;
  showView?: boolean;
}>();

const SVG_WIDTH = 260;
const SVG_HEIGHT = 120;
const SAMPLE_POINTS = 1000;

function makeEvaluator(expr: string): ((x: number) => number) | null {
  try {
    // Normalize common math syntax: treat ^ as exponent for preview purposes.
    const normalized = expr.replace(/\^/g, "**");

    // Allow basic Math.* functions and x; this is for a playground-style preview.
    // eslint-disable-next-line no-new-func
    const fn = new Function("x", "with (Math) { return " + normalized + "; }") as (
      x: number
    ) => number;
    // Smoke test
    void fn(0);
    return fn;
  } catch {
    return null;
  }
}

const svgPath = computed(() => {
  const { equation_text, x_min, x_max, y_min, y_max, y_auto } = props.post;
  const evalFn = makeEvaluator(equation_text);
  if (!evalFn || x_min === x_max) return "";

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
    } catch {
      // Skip bad points
    }
  }
  if (samples.length === 0) return "";

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
