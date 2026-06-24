<script setup lang="ts">
import Header from '@/components/Header.vue'
import Footer from '@/components/Footer.vue'
</script>

<template>
  <div class="min-h-screen flex flex-col">
    <Header />
    <div class="flex-1 bg-brand-surface dark:bg-slate-900 pb-24">
      <router-view />
    </div>
    <Footer />
  </div>
</template>
