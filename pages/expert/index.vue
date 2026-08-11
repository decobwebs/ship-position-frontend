<script setup lang="ts">
definePageMeta({ middleware: 'expert' })

const user = useSupabaseUser()
const { request } = useApi()
const pending = ref(true)
const busy = ref(false)
const error = ref('')
const gaps = ref<any[]>([])
const topics = ref<any[]>([])
const sessions = ref<any[]>([])

onMounted(async () => {
  try {
    const [g, t, s] = await Promise.all([
      request('/api/expert/gaps?limit=8'),
      request('/api/expert/topics'),
      request('/api/expert/interviews'),
    ])
    gaps.value = g; topics.value = t; sessions.value = s
  } finally {
    pending.value = false
  }
})

async function start(topicId: string | null = null) {
  error.value = ''
  busy.value = true
  try {
    const r: any = await request('/api/expert/interviews', { method: 'POST', body: { topic_id: topicId } })
    await navigateTo(`/expert/interview/${r.session_id}`)
  } catch (e: any) {
    error.value = e?.data?.detail || 'Could not start an interview right now.'
  } finally {
    busy.value = false
  }
}

const statusColor: Record<string, string> = {
  active: 'bg-blue-100 text-blue-700', completed: 'bg-emerald-100 text-emerald-700', abandoned: 'bg-gray-100 text-gray-600',
}
</script>

<template>
  <div class="page">
    <NuxtLink to="/" class="back">← Back to dashboard</NuxtLink>
    <header class="hero" style="margin-top: 8px">
      <div>
        <h1>Expert portal</h1>
        <p class="sub">Signed in as {{ user?.email }}. Help teach the assistant what it doesn't know.</p>
      </div>
    </header>

    <Skeleton v-if="pending" :rows="6" />
    <template v-else>
      <section class="card mb-4">
        <h3 class="mb-2">Start an interview</h3>
        <p class="muted text-sm mb-3">The assistant will ask about the highest-priority open questions.
          Nothing you say becomes official until you confirm it, and the owner approves it afterward.</p>
        <p v-if="error" class="auth-error mb-2">{{ error }}</p>
        <Button :disabled="busy" @click="start()">{{ busy ? 'Starting…' : 'Start interview' }}</Button>
      </section>

      <section v-if="sessions.length" class="card mb-4">
        <h3 class="mb-2">Your sessions</h3>
        <ul class="flex flex-col gap-2">
          <li v-for="s in sessions" :key="s.id" class="flex items-center gap-2">
            <span class="text-xs font-bold px-2 py-0.5 rounded-full" :class="statusColor[s.status]">{{ s.status }}</span>
            <NuxtLink class="link text-sm" :to="`/expert/interview/${s.id}`">
              {{ s.agenda_index }}/{{ s.agenda_length }} questions · {{ s.created_at?.slice(0, 16).replace('T', ' ') }}
            </NuxtLink>
          </li>
        </ul>
      </section>

      <div class="grid" style="grid-template-columns: 1fr 1fr; gap: 16px">
        <section class="card">
          <h3 class="mb-2">What's being asked about <span class="count">{{ gaps.length }}</span></h3>
          <ul class="flex flex-col gap-2">
            <li v-for="g in gaps" :key="g.id" class="text-sm">
              <span class="font-semibold">{{ g.subject }}</span>
              <span class="text-muted"> — {{ g.detail }}</span>
            </li>
          </ul>
          <EmptyState v-if="!gaps.length" message="Nothing queued right now." />
        </section>

        <section class="card">
          <h3 class="mb-2">Topics</h3>
          <ul class="flex flex-col gap-2">
            <li v-for="t in topics" :key="t.id" class="flex items-center justify-between text-sm">
              <span>{{ t.title }} <span class="text-muted">({{ t.entry_count }})</span></span>
              <button class="text-xs link" :disabled="busy" @click="start(t.id)">focus interview →</button>
            </li>
          </ul>
          <EmptyState v-if="!topics.length" message="No topics yet." />
        </section>
      </div>
    </template>
  </div>
</template>
