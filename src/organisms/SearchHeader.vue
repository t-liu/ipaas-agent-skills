<script setup lang="ts">
defineProps<{
  modelValue: string
}>()

defineEmits<{
  'update:modelValue': [value: string]
}>()
</script>

<template>
  <div class="text-center max-w-3xl mx-auto mb-16">
      <h1 class="text-4xl font-extrabold text-brand-slate tracking-tight sm:text-5xl mb-4 dark:text-slate-100">
      MuleSoft Agent Skills Marketplace
    </h1>
      <p class="text-lg text-brand-muted leading-relaxed dark:text-slate-400">
      Discover, run, and extend certified engineering capabilities built for next-generation autonomous AI integration workflows.
    </p>

    <div class="mt-8 max-w-xl mx-auto relative">
      <input
        :value="modelValue"
        @input="$emit('update:modelValue', ($event.target as HTMLInputElement).value)"
        type="text"
        placeholder="Search engineering skills (e.g., MUnit, DataWeave)..."
        class="w-full pl-5 pr-12 py-3.5 bg-brand-card text-brand-slate text-sm rounded-xl border border-gray-200 shadow-tactile focus:outline-none focus:ring-2 focus:ring-brand-accent focus:border-transparent transition-all dark:bg-slate-800 dark:text-slate-100 dark:border-slate-700 dark:placeholder-slate-500"
        aria-label="Search skills"
      />
      <div class="absolute right-4 top-1/2 -translate-y-1/2 text-brand-muted pointer-events-none dark:text-slate-500" aria-hidden="true">
        <svg
          xmlns="http://www.w3.org/2000/svg"
          class="h-5 w-5"
          fill="none"
          viewBox="0 0 24 24"
          stroke="currentColor"
        >
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
        </svg>
      </div>
    </div>
  </div>
</template>
