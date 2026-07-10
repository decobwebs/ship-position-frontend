<script setup lang="ts">
const props = defineProps<{
  severity: 'high' | 'medium' | 'low' | 'info'
}>()

const dotClass: Record<string, string> = {
  high: 'bg-high',
  medium: 'bg-medium',
  low: 'bg-low',
  info: 'bg-info',
}
</script>

<template>
  <span class="inline-flex items-center gap-1.5 text-[10.5px] font-bold uppercase tracking-wide text-ink-soft whitespace-nowrap">
    <span class="w-1.5 h-1.5 rounded-full shrink-0" :class="dotClass[props.severity]" />
    {{ severity }}
  </span>
</template>
