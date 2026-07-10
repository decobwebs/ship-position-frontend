<script setup lang="ts">
withDefaults(defineProps<{
  rows?: number
}>(), {
  rows: 3,
})
</script>

<template>
  <div class="flex flex-col gap-2" aria-hidden="true">
    <div
      v-for="i in rows"
      :key="i"
      class="h-4 rounded-sm bg-[linear-gradient(90deg,var(--line)_25%,var(--line-strong)_37%,var(--line)_63%)]
             bg-[length:400%_100%] animate-shimmer"
      :style="{ width: i === rows ? '60%' : '100%' }"
    />
  </div>
</template>
