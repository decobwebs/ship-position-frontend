<script setup lang="ts">
defineProps<{
  summary: { port: string; snapshot_date: string; at_berth: number; vacant: number; expected: number; at_anchorage: number }
  active: boolean
}>()
defineEmits<{ select: [] }>()
</script>

<template>
  <button
    class="text-left bg-card border-2 rounded-lg px-6 py-5 shrink-0 w-[240px] snap-start
           transition-colors duration-fast ease-standard"
    :class="active ? 'border-ink' : 'border-line hoverable:border-line-strong'"
    @click="$emit('select')"
  >
    <div class="flex justify-between items-baseline">
      <span class="font-bold text-lg">{{ summary.port }}</span>
      <span class="text-muted text-xs">{{ summary.snapshot_date }}</span>
    </div>
    <div class="flex flex-wrap gap-x-4 gap-y-2 mt-3 text-muted text-xs">
      <span><b class="text-ink text-xl font-bold block leading-none mb-1">{{ summary.at_berth }}</b>at berth</span>
      <span><b class="text-ink text-xl font-bold block leading-none mb-1">{{ summary.vacant }}</b>vacant</span>
      <span><b class="text-ink text-xl font-bold block leading-none mb-1">{{ summary.expected }}</b>expected</span>
      <span><b class="text-ink text-xl font-bold block leading-none mb-1">{{ summary.at_anchorage }}</b>anchorage</span>
    </div>
  </button>
</template>
