<script setup lang="ts">
definePageMeta({ middleware: 'admin' })

const route = useRoute()
const { request } = useApi()
const entry = ref<any>(null)
const pending = ref(true)

onMounted(async () => {
  try {
    entry.value = await request(`/api/admin/knowledge/entries/${route.params.id}`)
  } finally {
    pending.value = false
  }
})
</script>

<template>
  <div class="page">
    <NuxtLink to="/admin/knowledge" class="back">← Back to knowledge base</NuxtLink>
    <Skeleton v-if="pending" :rows="6" />
    <template v-else-if="entry">
      <header class="hero" style="margin-top: 8px">
        <div>
          <h1>{{ entry.title }}</h1>
          <p class="sub">{{ entry.topic_title || 'Uncategorised' }} · {{ entry.kind }} · {{ entry.confidence }}
            <span v-if="!entry.published || entry.status !== 'active'" class="font-bold text-high"> · {{ entry.status }}</span>
          </p>
        </div>
      </header>

      <section class="card mb-4">
        <p class="text-sm">{{ entry.body }}</p>
        <p v-if="entry.term" class="text-xs text-muted mt-2">Term: <b>{{ entry.term }}</b>
          <span v-if="entry.aliases?.length"> (also: {{ entry.aliases.join(', ') }})</span></p>
      </section>

      <section v-if="entry.relations?.length" class="card mb-4">
        <h3>Related entries</h3>
        <ul class="flex flex-col gap-2 mt-2">
          <li v-for="r in entry.relations" :key="r.id" class="text-sm">
            <span class="font-semibold">{{ r.relation }}</span>
            <span class="text-muted"> ({{ r.resolution }}) — </span>
            <NuxtLink class="link" :to="`/admin/knowledge/${r.other_entry_id}`">view entry →</NuxtLink>
            <p v-if="r.note" class="text-xs text-muted">{{ r.note }}</p>
          </li>
        </ul>
      </section>

      <DataCard title="Revision history" :count="entry.revisions?.length || 0">
        <ul class="flex flex-col gap-3">
          <li v-for="rev in entry.revisions" :key="rev.version" class="border-l-2 border-line pl-3">
            <div class="text-xs font-bold">v{{ rev.version }} · {{ rev.change_kind }}
              <span class="text-muted font-normal"> · {{ rev.created_at?.slice(0, 16).replace('T', ' ') }}</span>
            </div>
            <p class="text-sm font-semibold mt-1">{{ rev.title }}</p>
            <p class="text-sm text-muted">{{ rev.body }}</p>
            <p v-if="rev.note" class="text-xs text-muted italic mt-1">{{ rev.note }}</p>
          </li>
        </ul>
      </DataCard>
    </template>
  </div>
</template>
