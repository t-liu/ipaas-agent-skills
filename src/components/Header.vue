<script setup lang="ts">
import { ref, onMounted } from 'vue'

const isDark = ref(false)

function applyTheme(dark: boolean) {
  isDark.value = dark
  document.documentElement.classList.toggle('dark', dark)
  localStorage.setItem('theme', dark ? 'dark' : 'light')
}

function toggle() {
  applyTheme(!isDark.value)
}

onMounted(() => {
  const stored = localStorage.getItem('theme')
  if (stored) {
    applyTheme(stored === 'dark')
  } else {
    applyTheme(window.matchMedia('(prefers-color-scheme: dark)').matches)
  }
})
</script>

<template>
  <header class="sticky top-0 z-50 bg-brand-card/80 backdrop-blur-md border-b border-gray-100 dark:bg-slate-800/80 dark:border-slate-700">
    <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-3 flex items-center justify-between">
      <router-link
        to="/"
        class="text-sm font-semibold text-brand-slate tracking-tight hover:text-brand-accent transition-colors dark:text-slate-100"
      >
        A T-Liu Production
      </router-link>
      <div class="flex items-center gap-3">
        <button
          type="button"
          aria-label="Toggle dark mode"
          class="text-brand-muted hover:text-brand-slate transition-colors dark:text-slate-400 dark:hover:text-slate-100"
          @click="toggle"
        >
          <font-awesome-icon :icon="isDark ? 'sun' : 'moon'" class="text-sm" />
        </button>
        <span class="text-xs text-brand-muted font-mono dark:text-slate-400">Beta</span>
      </div>
    </div>
  </header>
</template>
