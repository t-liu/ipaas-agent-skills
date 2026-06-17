<script setup lang="ts">
defineProps<{
  tag: string
}>()
</script>

<template>
  <span
    class="text-xs px-2 py-0.5 rounded-full bg-brand-surface text-brand-muted font-medium border border-gray-100 dark:bg-slate-700 dark:text-slate-300 dark:border-slate-600"
  >
    {{ tag }}
  </span>
</template>
