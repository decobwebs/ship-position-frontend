<script setup lang="ts">
defineProps<{
  items: string[] | null | undefined
  emptyMessage?: string
}>()
</script>

<template>
  <div class="flex flex-wrap gap-2">
    <span
      v-for="(item, i) in items"
      :key="i"
      class="bg-bg border border-line rounded-pill px-3.5 py-1.5 text-[12.5px] font-mono"
    >
      {{ item }}
    </span>
    <EmptyState v-if="!items?.length" :message="emptyMessage" />
  </div>
</template>
