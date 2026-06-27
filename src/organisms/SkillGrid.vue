<script setup lang="ts">
import type { AgentSkill } from '@/types'
import AgentCard from '@/molecules/AgentCard.vue'

defineProps<{
  skills: AgentSkill[]
  isLoading: boolean
  error: string | null
  hasMore: boolean
}>()

const emit = defineEmits<{
  loadMore: []
}>()
</script>

<template>
  <div>
    <div class="flex items-center justify-between mb-6 border-b border-gray-100 pb-4 dark:border-slate-700">
      <h2 class="text-xs font-semibold text-brand-slate tracking-widest uppercase dark:text-slate-100">
        Top Rated Skills
      </h2>
      <span class="text-xs text-brand-muted font-medium dark:text-slate-400">
        Showing {{ skills.length }} skills
      </span>
    </div>

    <div
      v-if="isLoading && skills.length === 0"
      class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6"
      role="status"
      aria-label="Loading skills"
    >
      <div
        v-for="i in 3"
        :key="i"
        class="p-6 bg-brand-card rounded-xl border border-gray-100 animate-pulse dark:bg-slate-800 dark:border-slate-700"
      >
        <div class="h-4 bg-gray-200 rounded w-3/4 mb-3 dark:bg-slate-700" />
        <div class="h-3 bg-gray-200 rounded w-1/4 mb-6 dark:bg-slate-700" />
        <div class="h-3 bg-gray-200 rounded w-full mb-2 dark:bg-slate-700" />
        <div class="h-3 bg-gray-200 rounded w-5/6 mb-6 dark:bg-slate-700" />
        <div class="flex gap-2 mb-6">
          <div class="h-5 bg-gray-200 rounded-full w-16 dark:bg-slate-700" />
          <div class="h-5 bg-gray-200 rounded-full w-20 dark:bg-slate-700" />
        </div>
        <div class="h-9 bg-gray-200 rounded-lg w-full dark:bg-slate-700" />
      </div>
    </div>

    <div
      v-else-if="error && skills.length === 0"
      class="text-center py-16 bg-brand-card rounded-2xl border border-red-200 dark:bg-slate-800 dark:border-red-800"
      role="alert"
    >
      <p class="text-sm text-red-600 font-medium dark:text-red-400">
        Failed to load skills: {{ error }}
      </p>
    </div>

    <div
      v-else-if="skills.length"
      class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6"
    >
      <AgentCard
        v-for="skill in skills"
        :key="skill.id"
        :skill="skill"
      />
    </div>

    <div
      v-else
      class="text-center py-24 bg-brand-card rounded-2xl border border-dashed border-gray-200 dark:bg-slate-800 dark:border-slate-700"
    >
      <p class="text-sm text-brand-muted font-medium dark:text-slate-400">
        No marketplace skills match your current search query.
      </p>
    </div>

    <div
      v-if="hasMore || (isLoading && skills.length > 0)"
      class="flex justify-center mt-8"
    >
      <button
        v-if="!isLoading"
        class="px-6 py-2.5 text-sm font-medium text-brand-accent bg-indigo-50 hover:bg-indigo-100 rounded-lg transition-colors dark:bg-indigo-900/30 dark:hover:bg-indigo-900/50 dark:text-indigo-300"
        @click="emit('loadMore')"
      >
        Load more ({{ skills.length }} loaded)
      </button>
      <div
        v-else
        class="flex items-center gap-2 text-sm text-brand-muted dark:text-slate-400"
      >
        <svg
          class="animate-spin h-4 w-4"
          viewBox="0 0 24 24"
          fill="none"
        >
          <circle
            class="opacity-25"
            cx="12"
            cy="12"
            r="10"
            stroke="currentColor"
            stroke-width="4"
          />
          <path
            class="opacity-75"
            fill="currentColor"
            d="M4 12a8 8 0 018-8v4a4 4 0 00-4 4H4z"
          />
        </svg>
        Loading more...
      </div>
    </div>
  </div>
</template>
