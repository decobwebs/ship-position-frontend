<script setup lang="ts">
definePageMeta({ middleware: 'admin' })

const { request } = useApi()
const proposals = ref<any[]>([])
const pending = ref(true)
const busy = ref<string | null>(null)
const resolutionFor = ref<Record<string, string>>({})
const editing = ref<Record<string, { title: string; body: string }>>({})
const rejectNote = ref<Record<string, string>>({})
const toast = ref('')

async function load() {
  pending.value = true
  try {
    proposals.value = await request('/api/admin/knowledge/proposals?status=pending')
  } finally {
    pending.value = false
  }
}
onMounted(load)

function flash(msg: string) {
  toast.value = msg
  setTimeout(() => { toast.value = '' }, 3500)
}

function startEdit(p: any) {
  editing.value[p.id] = { title: p.title, body: p.body }
}

async function accept(p: any) {
  if (p.relation === 'contradicts' && !resolutionFor.value[p.id]) {
    flash('Pick how to resolve this contradiction first.')
    return
  }
  busy.value = p.id
  try {
    const edit = editing.value[p.id]
    await request(`/api/admin/knowledge/proposals/${p.id}/accept`, {
      method: 'POST',
      body: {
        resolution: resolutionFor.value[p.id] || null,
        edited_title: edit && edit.title !== p.title ? edit.title : null,
        edited_body: edit && edit.body !== p.body ? edit.body : null,
      },
    })
    proposals.value = proposals.value.filter((x) => x.id !== p.id)
    flash(`Accepted "${p.title}".`)
  } catch (e: any) {
    flash(e?.data?.detail || 'Could not accept that proposal.')
  } finally {
    busy.value = null
  }
}

async function reject(p: any) {
  const note = (rejectNote.value[p.id] || '').trim()
  if (!note) { flash('A reason is required to reject.'); return }
  busy.value = p.id
  try {
    await request(`/api/admin/knowledge/proposals/${p.id}/reject`, { method: 'POST', body: { note } })
    proposals.value = proposals.value.filter((x) => x.id !== p.id)
    flash(`Rejected "${p.title}".`)
  } catch (e: any) {
    flash(e?.data?.detail || 'Could not reject that proposal.')
  } finally {
    busy.value = null
  }
}

const relationLabel: Record<string, string> = {
  new: 'New fact', refines: 'Refines existing', contradicts: 'Contradicts existing', new_topic: 'New topic',
}
const relationColor: Record<string, string> = {
  new: 'bg-blue-100 text-blue-700', refines: 'bg-amber-100 text-amber-700',
  contradicts: 'bg-red-100 text-red-700', new_topic: 'bg-emerald-100 text-emerald-700',
}
</script>

<template>
  <div class="page">
    <NuxtLink to="/admin" class="back">← Back to admin</NuxtLink>
    <header class="hero" style="margin-top: 8px">
      <div>
        <h1>Knowledge review</h1>
        <p class="sub">Nothing here is live until you accept it. {{ proposals.length }} waiting.</p>
      </div>
    </header>

    <div v-if="toast" class="mb-4 p-3 rounded-lg bg-accent-ai-soft text-accent-ai text-sm font-semibold">{{ toast }}</div>

    <Skeleton v-if="pending" :rows="4" />
    <EmptyState v-else-if="!proposals.length" message="No pending proposals. Ingest some knowledge or wait for expert sessions." />

    <div v-else class="flex flex-col gap-4">
      <section v-for="p in proposals" :key="p.id" class="card">
        <div class="flex items-center gap-2 flex-wrap mb-2">
          <span class="text-xs font-bold px-2.5 py-1 rounded-full" :class="relationColor[p.relation]">
            {{ relationLabel[p.relation] }}
          </span>
          <span class="text-xs text-muted">{{ p.origin }}</span>
          <span class="text-xs text-muted">·</span>
          <span class="text-xs text-muted">{{ p.topic_title || p.proposed_topic_title || 'uncategorised' }}</span>
          <span class="text-xs text-muted">· fit {{ p.fit_score != null ? Math.round(p.fit_score * 100) + '%' : '—' }}</span>
        </div>

        <template v-if="editing[p.id]">
          <input v-model="editing[p.id].title" class="auth-input mb-2" />
          <textarea v-model="editing[p.id].body" rows="3" class="auth-input" />
        </template>
        <template v-else>
          <h3 class="text-base font-bold mb-1">{{ p.title }}</h3>
          <p class="text-sm mb-1">{{ p.body }}</p>
        </template>
        <button class="text-xs link mt-1" @click="editing[p.id] ? delete editing[p.id] : startEdit(p)">
          {{ editing[p.id] ? 'Cancel edit' : 'Edit before accepting' }}
        </button>

        <div v-if="p.quote" class="mt-3 text-xs text-muted border-l-2 border-line pl-3 italic">"{{ p.quote }}"</div>

        <div v-if="p.relation === 'contradicts'" class="mt-3 p-3 rounded-lg bg-red-50">
          <p class="text-xs font-bold text-red-700 mb-1">Conflicts with the existing entry:</p>
          <p class="text-sm font-semibold">{{ p.target_title }}</p>
          <p class="text-sm text-muted mb-2">{{ p.target_body }}</p>
          <p v-if="p.rationale" class="text-xs text-muted mb-2">{{ p.rationale }}</p>
          <div class="flex flex-wrap gap-2">
            <label v-for="opt in ['from_wins','to_wins','kept_both','merged']" :key="opt"
              class="text-xs px-2.5 py-1.5 rounded-lg border cursor-pointer"
              :class="resolutionFor[p.id] === opt ? 'border-accent-ai bg-accent-ai-soft' : 'border-line'">
              <input type="radio" :name="`res-${p.id}`" :value="opt" v-model="resolutionFor[p.id]" class="hidden" />
              {{ { from_wins: 'This new claim is right', to_wins: 'The existing one is right',
                   kept_both: 'Both are valid', merged: "I've merged them above" }[opt] }}
            </label>
          </div>
        </div>

        <div class="flex items-center gap-2 mt-4">
          <Button :disabled="busy === p.id" @click="accept(p)">Accept</Button>
          <input v-model="rejectNote[p.id]" placeholder="Reason to reject…" class="auth-input flex-1" style="width:auto" />
          <Button variant="ghost" :disabled="busy === p.id" @click="reject(p)">Reject</Button>
        </div>
      </section>
    </div>
  </div>
</template>
