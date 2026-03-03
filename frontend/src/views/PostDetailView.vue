<template>
  <section class="post-detail">
    <header class="view-header">
      <h1>Post detail</h1>
      <p>Expanded graph, likes, and comments will be shown here.</p>
    </header>
    <div class="card">
      <p>Post content + comments placeholder.</p>
    </div>
  </section>
</template>

<script setup lang="ts"></script>

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
</style>

