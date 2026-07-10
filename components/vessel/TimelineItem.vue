<script setup lang="ts">
defineProps<{
  entry: {
    snapshot_date: string
    status: string
    port: string
    date_berthed?: string
    terminal?: string
    berth?: string
    etd?: string
    date_arrived?: string
    eta?: string
    agent?: string
    cargo?: string
    source_document?: string
  }
}>()
</script>

<template>
  <div class="tl">
    <div class="tl-head">
      <span class="tl-date mono">{{ entry.snapshot_date }}</span>
      <StatusBadge :status="entry.status as any" />
      <span class="muted">{{ entry.port }}</span>
    </div>
    <div class="tl-meta">
      <template v-if="entry.status === 'at_berth'">
        Berthed {{ entry.date_berthed || '?' }} at <b>{{ entry.terminal }} {{ entry.berth }}</b> · ETD {{ entry.etd || '?' }}
      </template>
      <template v-else-if="entry.status === 'at_anchorage'">
        Arrived anchorage {{ entry.date_arrived || '?' }} · terminal {{ entry.terminal || '?' }}
      </template>
      <template v-else-if="entry.status === 'expected'">
        Expected {{ entry.eta || '?' }} at {{ entry.terminal || '?' }}
      </template>
      <template v-else>{{ entry.terminal }} {{ entry.berth }}</template>
      · {{ entry.agent || '—' }} · {{ entry.cargo || '—' }}
      <span class="muted small"> · {{ entry.source_document }}</span>
    </div>
  </div>
</template>
