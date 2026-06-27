<script setup lang="ts">
import { onMounted } from 'vue'
import { storeToRefs } from 'pinia'
import { useSkillsStore } from '@/stores/skills'
import SearchHeader from '@/organisms/SearchHeader.vue'
import SkillGrid from '@/organisms/SkillGrid.vue'

const store = useSkillsStore()
const { searchQuery, filteredSkills, isLoading, error, hasMore } = storeToRefs(store)

onMounted(() => {
  store.fetchSkillsFromApi(50, false)
})

function loadMore() {
  store.fetchSkillsFromApi(50, true)
}
</script>

<template>
  <main class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 min-h-screen dark:bg-slate-900">
    <SearchHeader v-model="searchQuery" />
    <SkillGrid
      :skills="filteredSkills"
      :is-loading="isLoading"
      :error="error"
      :has-more="hasMore"
      @load-more="loadMore"
    />
  </main>
</template>
