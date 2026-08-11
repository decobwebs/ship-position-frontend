<script setup lang="ts">
definePageMeta({ middleware: 'admin' })

const { request } = useApi()
const topics = ref<any[]>([])
const entries = ref<any[]>([])
const activeTopic = ref<string | null>(null)
const pending = ref(true)

async function loadEntries() {
  entries.value = await request(`/api/admin/knowledge/entries${activeTopic.value ? `?topic_id=${activeTopic.value}` : ''}`)
}

onMounted(async () => {
  pending.value = true
  try {
    topics.value = await request('/api/admin/knowledge/topics')
    await loadEntries()
  } finally {
    pending.value = false
  }
})

watch(activeTopic, loadEntries)

const columns = [
  { key: 'title', label: 'Entry' },
  { key: 'kind', label: 'Kind' },
  { key: 'confidence', label: 'Confidence' },
  { key: 'topic_title', label: 'Topic' },
]
</script>

<template>
  <div class="page">
    <NuxtLink to="/admin" class="back">← Back to admin</NuxtLink>
    <header class="hero" style="margin-top: 8px">
      <div>
        <h1>Knowledge base</h1>
        <p class="sub">Everything live in the chatbot's brain, organised by topic.</p>
      </div>
      <NuxtLink to="/admin/knowledge/ingest" class="chip hoverable:bg-bg">+ Add knowledge</NuxtLink>
    </header>

    <Skeleton v-if="pending" :rows="5" />
    <template v-else>
      <div class="flex flex-wrap gap-2 mb-4">
        <button class="chip hoverable:bg-bg" :class="{ 'border-accent-ai': !activeTopic }" @click="activeTopic = null">
          All ({{ entries.length }})
        </button>
        <button v-for="t in topics" :key="t.id" class="chip hoverable:bg-bg"
          :class="{ 'border-accent-ai': activeTopic === t.id }" @click="activeTopic = t.id">
          {{ t.title }} ({{ t.entry_count }})
        </button>
      </div>

      <VesselTable :columns="columns" :rows="entries" primary-key="title" :row-key="(r) => r.id"
        empty-message="No entries yet.">
        <template #cell-title="{ row }">
          <NuxtLink class="link font-semibold" :to="`/admin/knowledge/${row.id}`">{{ row.title }}</NuxtLink>
        </template>
      </VesselTable>
    </template>
  </div>
</template>
