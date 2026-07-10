<script setup lang="ts">
defineProps<{
  title: string
  count?: number
}>()
</script>

<template>
  <section class="bg-card border border-line rounded-lg p-6 min-w-0">
    <h3 class="m-0 mb-4 text-xl font-bold flex items-center gap-2">
      {{ title }}
      <span v-if="count !== undefined" class="bg-accent-ai-soft text-accent-ai rounded-pill px-3 py-1 text-xs font-bold">
        {{ count }}
      </span>
    </h3>
    <slot />
  </section>
</template>
