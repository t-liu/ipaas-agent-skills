<script setup lang="ts">
import { config } from '../config/env'
import { ref, onMounted, onBeforeUnmount } from 'vue'

const currentYear = new Date().getFullYear()
const isVisible = ref(false)
const sentinel = ref<HTMLElement | null>(null)
let observer: IntersectionObserver | null = null
const { socialLinks } = config

onMounted(() => {
  if (!sentinel.value) return
  observer = new IntersectionObserver(([entry]) => {
    isVisible.value = entry.isIntersecting
  })
  observer.observe(sentinel.value)
})

onBeforeUnmount(() => {
  observer?.disconnect()
})
</script>

<template>
  <div ref="sentinel" class="h-px pointer-events-none" aria-hidden="true" />

  <footer
    class="fixed bottom-0 left-0 right-0 z-40 bg-brand-slate/90 backdrop-blur-md border-t border-gray-800 transition-all duration-300 ease-out dark:bg-slate-900/90 dark:border-slate-700"
    :class="isVisible ? 'translate-y-0 opacity-100' : 'translate-y-full opacity-0'"
  >
    <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4 flex flex-col sm:flex-row items-center justify-between gap-3">
      <div class="flex items-center gap-5">
        <a
          v-for="link in socialLinks"
          :key="link.label"
          :href="link.url"
          target="_blank"
          rel="noopener noreferrer"
          class="text-gray-400 hover:text-brand-accent transition-colors duration-200"
          :aria-label="link.ariaLabel"
        >
          <font-awesome-icon :icon="link.icon" class="h-5 w-5" />
        </a>
      </div>
      <p class="text-xs text-gray-500">
        &copy; {{ currentYear }} Thomas Liu. All rights reserved.
      </p>
    </div>
  </footer>
</template>
