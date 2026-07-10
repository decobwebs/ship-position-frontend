<script setup lang="ts">
defineProps<{
  voyage: {
    status: string
    port: string
    is_long_stay?: boolean
    waiting_days?: number | null
    agent?: string
    cargo?: string
    arrived_anchorage_date?: string
    berthed_date?: string
    berth?: string
    sailed_date?: string
    e_sen?: string
  }
}>()

const statusLabel: Record<string, string> = {
  expected: 'Expected', at_anchorage: 'At anchorage', at_berth: 'At berth',
  sailed: 'Sailed', cancelled: 'Cancelled', vacant: 'Vacant',
}
</script>

<template>
  <div class="voyage animate-fade-in">
    <div class="tl-head">
      <StatusBadge :status="voyage.status as any" />
      <span class="muted">{{ voyage.port }}</span>
      <SeverityDot v-if="voyage.is_long_stay" severity="info" />
      <span v-if="voyage.is_long_stay" class="text-muted text-xs">laid-up</span>
    </div>
    <div v-if="voyage.waiting_days != null" class="wait-big" style="margin-top: 10px">
      {{ voyage.waiting_days }} <span>days waiting</span>
    </div>
    <dl class="kv">
      <dt>Agent</dt><dd>{{ voyage.agent || '—' }}</dd>
      <dt>Cargo</dt><dd>{{ voyage.cargo || '—' }}</dd>
      <dt>Arrived</dt><dd class="mono">{{ voyage.arrived_anchorage_date || '—' }}</dd>
      <dt>Berthed</dt><dd class="mono">{{ voyage.berthed_date || '—' }}{{ voyage.berth ? ' · ' + voyage.berth : '' }}</dd>
      <template v-if="voyage.sailed_date">
        <dt>Sailed</dt><dd class="mono">{{ voyage.sailed_date }}</dd>
      </template>
      <dt>E-SEN</dt><dd class="mono">{{ voyage.e_sen || '—' }}</dd>
    </dl>
  </div>
</template>
