<template>
  <section class="timeline">
    <header class="timeline-header">
      <h1>Timeline</h1>
      <p>Newest graph posts first. Load more when you reach the bottom.</p>
    </header>

    <div class="timeline-placeholder">
      <p>This is where graph posts will appear.</p>
      <RouterLink class="ghost-button" to="/create">Create your first equation</RouterLink>
    </div>
  </section>
</template>

<script setup lang="ts"></script>

<style scoped>
.timeline-header h1 {
  font-size: 1.6rem;
  margin-bottom: 0.25rem;
}

.timeline-header p {
  color: #9ca3af;
  font-size: 0.9rem;
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
}
</style>

