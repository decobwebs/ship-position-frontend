<script setup lang="ts">
const base = useRuntimeConfig().public.apiBase as string
const ports = ['Lekki', 'LPC', 'TinCan', 'KLT'] as const
const port = ref<(typeof ports)[number]>('Lekki')

const { data: summary } = await useFetch<any[]>(`${base}/api/summary`)
const { data: longest } = await useFetch<any[]>(`${base}/api/longest-waiting?limit=8`)
const { data: atBerth, pending: atBerthPending } = await useFetch<any[]>(() => `${base}/api/at-berth?port=${port.value}`, { watch: [port] })
const { data: vacant, pending: vacantPending }  = await useFetch<any[]>(() => `${base}/api/vacant-berths?port=${port.value}`, { watch: [port] })
const { data: expected, pending: expectedPending }= await useFetch<any[]>(() => `${base}/api/expected?port=${port.value}`, { watch: [port] })
const { data: anchor, pending: anchorPending }  = await useFetch<any[]>(() => `${base}/api/anchorage?port=${port.value}`, { watch: [port] })

const current = computed(() => (summary.value || []).find((s) => s.port === port.value))

const vlink = (name: string) => `/vessel/${encodeURIComponent(name)}`

const atBerthCols = [
  { key: 'berth', label: 'Berth', mono: true },
  { key: 'vessel_name', label: 'Vessel' },
  { key: 'length_m', label: 'Len' },
  { key: 'etd', label: 'ETD', mono: true },
  { key: 'agent', label: 'Agent' },
  { key: 'cargo', label: 'Cargo' },
]
const expectedCols = [
  { key: 'vessel_name', label: 'Vessel' },
  { key: 'terminal', label: 'Terminal', mono: true },
  { key: 'eta', label: 'ETA', mono: true },
  { key: 'cargo', label: 'Cargo' },
]
const anchorCols = [
  { key: 'vessel_name', label: 'Vessel' },
  { key: 'date_arrived', label: 'Arrived', mono: true },
  { key: 'cargo', label: 'Cargo' },
  { key: 'remark', label: 'Rem' },
]
const longestCols = [
  { key: 'vessel_name', label: 'Vessel' },
  { key: 'port', label: 'Port' },
  { key: 'arrived_anchorage_date', label: 'Arrived', mono: true },
  { key: 'berthed_date', label: 'Berthed', mono: true },
  { key: 'waiting_days', label: 'Days', align: 'right' as const },
]
</script>

<template>
  <div class="page">
    <header class="hero">
      <div>
        <h1 class="text-2xl sm:text-4xl">Lagos Port Vessel Intelligence</h1>
        <p class="sub hidden sm:block">Daily NPA shipping position — a clean picture + history. Not real-time.</p>
      </div>
      <div class="flex items-center gap-2 sm:ml-auto">
        <NuxtLink to="/ask" class="ask-link hidden sm:inline-block">Ask the Port</NuxtLink>
        <VesselSearch />
      </div>
    </header>

    <PortTileGrid class="mt-5 sm:mt-4" :summary="summary || []" :active-port="port" @select="(p: any) => port = p" />

    <h2 class="port-heading">{{ port }} <span v-if="current" class="muted">· {{ current.snapshot_date }}</span></h2>

    <div class="grid grid-cols-1 sm:grid-cols-2 gap-3 mt-3">
      <Collapsible title="At berth" :count="atBerth?.length || 0" default-open>
        <Skeleton v-if="atBerthPending" :rows="4" />
        <VesselTable v-else :columns="atBerthCols" :rows="atBerth" primary-key="vessel_name" empty-message="No vessels at berth.">
          <template #cell-berth="{ row }"><span class="font-mono text-[12.5px]">{{ row.terminal }} {{ row.berth }}</span></template>
          <template #cell-vessel_name="{ row }"><NuxtLink class="link font-semibold" :to="vlink(row.vessel_name)">{{ row.vessel_name }}</NuxtLink></template>
          <template #cell-etd="{ row }">{{ row.etd || '—' }}</template>
        </VesselTable>
      </Collapsible>

      <Collapsible title="Vacant berths" :count="vacant?.length || 0">
        <Skeleton v-if="vacantPending" :rows="3" />
        <ChipList v-else :items="(vacant || []).map((r: any) => `${r.terminal} ${r.berth}`)" empty-message="None free." />
      </Collapsible>

      <Collapsible title="Expected" :count="expected?.length || 0">
        <Skeleton v-if="expectedPending" :rows="4" />
        <VesselTable v-else :columns="expectedCols" :rows="expected" primary-key="vessel_name" empty-message="None expected.">
          <template #cell-vessel_name="{ row }"><NuxtLink class="link font-semibold" :to="vlink(row.vessel_name)">{{ row.vessel_name }}</NuxtLink></template>
          <template #cell-eta="{ row }">{{ row.eta || '?' }}</template>
        </VesselTable>
      </Collapsible>

      <Collapsible title="At anchorage" :count="anchor?.length || 0">
        <Skeleton v-if="anchorPending" :rows="2" />
        <VesselTable v-else :columns="anchorCols" :rows="anchor" primary-key="vessel_name" empty-message="None at anchorage.">
          <template #cell-vessel_name="{ row }"><NuxtLink class="link font-semibold" :to="vlink(row.vessel_name)">{{ row.vessel_name }}</NuxtLink></template>
          <template #cell-remark="{ row }"><span class="text-muted">{{ row.remark || '' }}</span></template>
        </VesselTable>
      </Collapsible>
    </div>

    <DataCard class="mt-4" title="Longest waiting">
      <VesselTable :columns="longestCols" :rows="longest" primary-key="vessel_name" empty-message="No completed waits yet.">
        <template #cell-vessel_name="{ row }"><NuxtLink class="link font-semibold" :to="vlink(row.vessel_name)">{{ row.vessel_name }}</NuxtLink></template>
        <template #cell-waiting_days="{ row }"><b>{{ row.waiting_days }}</b></template>
      </VesselTable>
    </DataCard>

    <footer class="foot">Read-only view · data is daily, hand-typed by NPA · figures may contain source errors.</footer>
  </div>
</template>
