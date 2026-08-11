<script setup lang="ts">
definePageMeta({ middleware: 'admin' })

const { request } = useApi()
const gaps = ref<any[]>([])
const pending = ref(true)
const refreshing = ref(false)
const dismissNote = ref<Record<string, string>>({})
const toast = ref('')

async function load() {
  pending.value = true
  try {
    gaps.value = await request('/api/admin/gaps')
  } finally {
    pending.value = false
  }
}
onMounted(load)

function flash(msg: string) {
  toast.value = msg
  setTimeout(() => { toast.value = '' }, 3000)
}

async function refresh() {
  refreshing.value = true
  try {
    await request('/api/admin/gaps/refresh', { method: 'POST' })
    await load()
    flash('Rechecked everything.')
  } finally {
    refreshing.value = false
  }
}

async function dismiss(g: any) {
  const reason = (dismissNote.value[g.id] || '').trim()
  if (!reason) { flash('A reason is required to dismiss.'); return }
  await request(`/api/admin/gaps/${g.id}/dismiss`, { method: 'POST', body: { reason } })
  gaps.value = gaps.value.filter((x) => x.id !== g.id)
  flash(`Dismissed "${g.subject}".`)
}

const kindLabel: Record<string, string> = {
  self_declared_ignorance: 'Admits it doesn’t know', unknown_term: 'Unknown term',
  failed_question: 'Failed question', out_of_scope_demand: 'Out of scope (informational)',
  thin_topic: 'Thin topic', open_contradiction: 'Open contradiction', structural_blank: 'Open design question',
}
const kindColor: Record<string, string> = {
  self_declared_ignorance: 'bg-red-100 text-red-700', unknown_term: 'bg-amber-100 text-amber-700',
  failed_question: 'bg-amber-100 text-amber-700', out_of_scope_demand: 'bg-gray-100 text-gray-600',
  thin_topic: 'bg-blue-100 text-blue-700', open_contradiction: 'bg-red-100 text-red-700',
  structural_blank: 'bg-purple-100 text-purple-700',
}
</script>

<template>
  <div class="page">
    <NuxtLink to="/admin" class="back">← Back to admin</NuxtLink>
    <header class="hero" style="margin-top: 8px">
      <div>
        <h1>What the assistant doesn't know</h1>
        <p class="sub">Ranked with evidence. This is what expert interviews should focus on.</p>
      </div>
      <Button variant="ghost" :disabled="refreshing" @click="refresh">
        {{ refreshing ? 'Checking…' : 'Recheck now' }}
      </Button>
    </header>

    <div v-if="toast" class="mb-4 p-3 rounded-lg bg-accent-ai-soft text-accent-ai text-sm font-semibold">{{ toast }}</div>

    <Skeleton v-if="pending" :rows="6" />
    <EmptyState v-else-if="!gaps.length" message="No open gaps." />

    <div v-else class="flex flex-col gap-3">
      <section v-for="g in gaps" :key="g.id" class="card">
        <div class="flex items-center gap-2 flex-wrap mb-1">
          <span class="text-xs font-bold px-2.5 py-1 rounded-full" :class="kindColor[g.kind]">
            {{ kindLabel[g.kind] || g.kind }}
          </span>
          <span class="text-xs text-muted">score {{ g.score }}</span>
        </div>
        <h3 class="text-base font-bold mb-1">{{ g.subject }}</h3>
        <p class="text-sm text-muted">{{ g.detail }}</p>
        <pre v-if="g.evidence && Object.keys(g.evidence).length" class="text-xs text-muted mt-2 mono">{{ JSON.stringify(g.evidence) }}</pre>
        <div class="flex items-center gap-2 mt-3">
          <input v-model="dismissNote[g.id]" placeholder="Reason to dismiss…" class="auth-input flex-1" style="width:auto" />
          <Button variant="ghost" @click="dismiss(g)">Dismiss</Button>
        </div>
      </section>
    </div>
  </div>
</template>
