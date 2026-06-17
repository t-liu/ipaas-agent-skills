<script setup lang="ts">
import type { SemVer } from '@/types'

defineProps<{
  version: SemVer
}>()
</script>

<template>
  <span
    class="inline-flex items-center px-2 py-0.5 rounded text-xs font-mono font-medium bg-gray-50 text-brand-muted border border-gray-100 dark:bg-slate-700 dark:text-slate-300 dark:border-slate-600"
    aria-label="Version {{ version }}"
  >
    v{{ version }}
  </span>
</template>
