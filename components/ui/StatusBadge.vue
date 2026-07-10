<script setup lang="ts">
const props = defineProps<{
  status: 'at_berth' | 'at_anchorage' | 'expected' | 'sailed' | 'cancelled' | 'vacant'
}>()

const labels: Record<string, string> = {
  at_berth: 'At berth',
  at_anchorage: 'At anchorage',
  expected: 'Expected',
  sailed: 'Sailed',
  cancelled: 'Cancelled',
  vacant: 'Vacant',
}

const dotClass: Record<string, string> = {
  at_berth: 'bg-berth',
  at_anchorage: 'bg-anchor',
  expected: 'bg-expect',
  sailed: 'bg-sail',
  cancelled: 'bg-cancel',
  vacant: 'bg-info',
}
</script>

<template>
  <span class="inline-flex items-center gap-1.5 text-xs font-semibold text-ink-soft whitespace-nowrap">
    <span class="w-1.5 h-1.5 rounded-full shrink-0" :class="dotClass[props.status]" />
    {{ labels[props.status] }}
  </span>
</template>
