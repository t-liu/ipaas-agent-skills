<script setup lang="ts">
import { ref, computed, onMounted } from 'vue'
import { useRoute } from 'vue-router'
import { useSkillsStore } from '@/stores/skills'
import TagPill from '@/atoms/TagPill.vue'
import CopyButton from '@/atoms/CopyButton.vue'

const route = useRoute()
const store = useSkillsStore()
const loading = ref(true)

const skill = computed(() => store.skills.find(s => s.name === route.params.name))

onMounted(async () => {
  loading.value = true
  if (store.skills.length === 0) {
    await store.fetchSkillsFromApi(200, false)
  } else {
    const found = store.skills.find(s => s.name === route.params.name)
    if (!found) {
      await store.fetchSkillByName(route.params.name as string)
    }
  }
  loading.value = false
})
</script>

<template>
  <main class="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-12 min-h-screen dark:bg-slate-900">
    <router-link
      to="/"
      class="inline-flex items-center gap-1.5 text-sm text-brand-muted hover:text-brand-accent mb-8 transition-colors dark:text-slate-400 dark:hover:text-brand-accent"
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
          d="M15 19l-7-7 7-7"
        />
      </svg>
      Back to Marketplace
    </router-link>

    <div
      v-if="loading"
      class="bg-brand-card rounded-xl border border-gray-100 shadow-tactile p-8 dark:bg-slate-800 dark:border-slate-700 animate-pulse"
    >
      <div class="h-6 bg-gray-200 rounded w-2/3 mb-2 dark:bg-slate-700" />
      <div class="h-4 bg-gray-200 rounded w-1/4 mb-6 dark:bg-slate-700" />
      <div class="h-4 bg-gray-200 rounded w-full mb-2 dark:bg-slate-700" />
      <div class="h-4 bg-gray-200 rounded w-5/6 mb-6 dark:bg-slate-700" />
      <div class="flex gap-2 mb-6">
        <div class="h-6 bg-gray-200 rounded-full w-16 dark:bg-slate-700" />
        <div class="h-6 bg-gray-200 rounded-full w-20 dark:bg-slate-700" />
      </div>
      <div class="h-10 bg-gray-200 rounded-lg w-48 dark:bg-slate-700" />
    </div>

    <div
      v-else-if="skill"
      class="bg-brand-card rounded-xl border border-gray-100 shadow-tactile p-8 dark:bg-slate-800 dark:border-slate-700"
    >
      <div class="flex items-start justify-between mb-6">
        <div>
          <h1 class="text-2xl font-bold text-brand-slate tracking-tight dark:text-slate-100">
            {{ skill.displayName }}
          </h1>
          <p class="text-sm text-brand-muted mt-1 dark:text-slate-400">
            by {{ skill.author }} &middot; v{{ skill.version }}
          </p>
        </div>
      </div>

      <p class="text-base text-brand-muted leading-relaxed mb-6 dark:text-slate-400">
        {{ skill.description }}
      </p>

      <div
        v-if="skill.longDescription"
        class="prose prose-sm prose-slate max-w-none mb-6 dark:prose-invert"
      >
        {{ skill.longDescription }}
      </div>

      <div class="flex flex-wrap gap-1.5 mb-6">
        <TagPill
          v-for="tag in skill.tags"
          :key="tag"
          :tag="tag"
        />
      </div>

      <div class="pt-6 border-t border-gray-100 dark:border-slate-700">
        <CopyButton
          :text="skill.installationCmd"
          @copied="() => {}"
        />
      </div>
    </div>

    <div
      v-else
      class="text-center py-24 bg-brand-card rounded-2xl border border-dashed border-gray-200 dark:bg-slate-800 dark:border-slate-700"
    >
      <p class="text-sm text-brand-muted font-medium dark:text-slate-400">
        Skill not found.
      </p>
    </div>
  </main>
</template>
