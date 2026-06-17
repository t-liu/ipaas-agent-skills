<script setup lang="ts">
import { useSkills } from '@/composables/useSkills'
import SearchHeader from '@/organisms/SearchHeader.vue'
import SkillGrid from '@/organisms/SkillGrid.vue'

const { searchQuery, filteredSkills, isLoading, error } = useSkills()
</script>

<template>
  <main class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 min-h-screen dark:bg-slate-900">
    <SearchHeader v-model="searchQuery" />
    <SkillGrid
      :skills="filteredSkills"
      :is-loading="isLoading"
      :error="error"
    />
  </main>
</template>
