<script setup lang="ts">
import type { AgentSkill } from '@/types'
import SkillBadge from '@/atoms/SkillBadge.vue'
import TagPill from '@/atoms/TagPill.vue'
import CopyButton from '@/atoms/CopyButton.vue'

defineProps<{
  skill: AgentSkill
}>()
</script>

<template>
  <div
    class="group relative flex flex-col justify-between p-6 bg-brand-card rounded-xl border border-gray-100 shadow-tactile hover:shadow-tactile-hover transition-all duration-300 ease-out hover:-translate-y-0.5 dark:bg-slate-800 dark:border-slate-700"
  >
    <div>
      <div class="flex items-start justify-between mb-4">
        <div>
          <h3 class="text-lg font-semibold text-brand-slate tracking-tight group-hover:text-brand-accent transition-colors duration-200 dark:text-slate-100">
            {{ skill.displayName }}
          </h3>
          <p class="text-xs font-medium text-brand-muted mt-0.5 dark:text-slate-400">
            by {{ skill.author }}
          </p>
        </div>
        <SkillBadge :version="skill.version" />
      </div>

      <p class="text-sm text-brand-muted line-clamp-3 mb-4 leading-relaxed dark:text-slate-400">
        {{ skill.description }}
      </p>

      <div class="flex flex-wrap gap-1.5 mb-6">
        <TagPill
          v-for="tag in skill.tags"
          :key="tag"
          :tag="tag"
        />
      </div>
    </div>

    <div class="pt-4 border-t border-gray-50 flex items-center justify-between gap-4 dark:border-slate-700">
      <CopyButton
        :text="skill.installationCmd"
        @copied="() => {}"
      />

      <router-link
        :to="`/skills/${skill.name}`"
        class="inline-flex items-center justify-center p-2 rounded-lg text-brand-muted hover:text-brand-accent hover:bg-indigo-50/50 transition-colors dark:text-slate-400 dark:hover:text-brand-accent dark:hover:bg-indigo-900/20"
        :aria-label="`View details for ${skill.displayName}`"
      >
        <svg
          xmlns="http://www.w3.org/2000/svg"
          class="h-4 w-4"
          fill="none"
          viewBox="0 0 24 24"
          stroke="currentColor"
          aria-hidden="true"
        >
          <path
            stroke-linecap="round"
            stroke-linejoin="round"
            stroke-width="2"
            d="M9 5l7 7-7 7"
          />
        </svg>
      </router-link>
    </div>
  </div>
</template>
