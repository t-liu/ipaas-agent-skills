<script setup lang="ts">
import { ref } from 'vue'
import { copyToClipboard } from '@/utils/copy'

const props = defineProps<{
  text: string
}>()

const emit = defineEmits<{
  copied: []
}>()

const copied = ref(false)

async function handleCopy() {
  const success = await copyToClipboard(props.text)
  if (success) {
    copied.value = true
    emit('copied')
    setTimeout(() => { copied.value = false }, 2000)
  }
}
</script>

<template>
  <button
    @click="handleCopy"
    class="flex-1 inline-flex items-center justify-center gap-2 px-3 py-2 text-xs font-mono font-medium rounded-lg bg-brand-surface border border-gray-200 text-brand-slate hover:bg-gray-100 transition-all active:scale-[0.98] dark:bg-slate-700 dark:border-slate-600 dark:text-slate-100 dark:hover:bg-slate-600"
    :title="text"
    :aria-label="copied ? 'Copied to clipboard' : 'Copy installation command'"
  >
    <span class="truncate max-w-[160px]">{{ copied ? 'Copied to clipboard!' : text }}</span>
    <svg
      v-if="!copied"
      xmlns="http://www.w3.org/2000/svg"
      class="h-3.5 w-3.5 flex-shrink-0 text-brand-muted dark:text-slate-400"
      fill="none"
      viewBox="0 0 24 24"
      stroke="currentColor"
      aria-hidden="true"
    >
      <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M8 5H6a2 2 2 0 00-2 2v12a2 2 2 0 002 2h10a2 2 2 0 002-2v-1M8 5a2 2 2 0 002 2h2a2 2 2 0 002-2M8 5a2 2 2 0 012-2h2a2 2 2 0 012 2m0 0h2a2 2 2 0 012 2v3m2 4H10m0 0l3-3m-3 3l3 3" />
    </svg>
    <svg
      v-else
      xmlns="http://www.w3.org/2000/svg"
      class="h-3.5 w-3.5 flex-shrink-0 text-green-600"
      fill="none"
      viewBox="0 0 24 24"
      stroke="currentColor"
      aria-hidden="true"
    >
      <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M5 13l4 4L19 7" />
    </svg>
  </button>
</template>
