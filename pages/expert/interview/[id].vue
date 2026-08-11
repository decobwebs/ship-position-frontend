<script setup lang="ts">
definePageMeta({ middleware: 'expert' })

const route = useRoute()
const { request } = useApi()
const sessionId = route.params.id as string

const session = ref<any>(null)
const pending = ref(true)
const busy = ref(false)
const reply = ref('')
const error = ref('')
const editing = ref<Record<string, { title: string; body: string }[]>>({})

async function load() {
  session.value = await request(`/api/expert/interviews/${sessionId}`)
}

onMounted(async () => {
  try { await load() } finally { pending.value = false }
})

const isActive = computed(() => session.value?.status === 'active')
const lastMsg = computed(() => {
  const m = session.value?.messages || []
  return m.length ? m[m.length - 1] : null
})
const awaitingDraft = computed(() => lastMsg.value?.message_kind === 'draft_confirmation')

async function send() {
  const text = reply.value.trim()
  if (!text || busy.value) return
  error.value = ''
  busy.value = true
  reply.value = ''
  try {
    await request(`/api/expert/interviews/${sessionId}/reply`, { method: 'POST', body: { text } })
    await load()
  } catch (e: any) {
    error.value = e?.data?.detail || 'Something went wrong sending that.'
  } finally {
    busy.value = false
  }
}

function startEdit(msg: any) {
  editing.value[msg.id] = msg.draft_json.candidates.map((c: any) => ({ title: c.title, body: c.body }))
}

async function confirm(msg: any, action: 'confirm' | 'discard') {
  busy.value = true
  error.value = ''
  try {
    const edits = editing.value[msg.id]
      ? msg.draft_json.candidates.map((c: any, i: number) => ({ ...c, ...editing.value[msg.id][i] }))
      : null
    await request(`/api/expert/interviews/${sessionId}/confirm`, {
      method: 'POST',
      body: { message_id: msg.id, action, edits },
    })
    delete editing.value[msg.id]
    await load()
  } catch (e: any) {
    error.value = e?.data?.detail || 'Could not save that.'
  } finally {
    busy.value = false
  }
}
</script>

<template>
  <div class="page chat-page">
    <NuxtLink to="/expert" class="back">← Back to expert portal</NuxtLink>
    <Skeleton v-if="pending" :rows="5" />
    <template v-else-if="session">
      <header class="hero" style="margin-top: 8px">
        <div>
          <h1 class="text-2xl">Interview</h1>
          <p class="sub">{{ session.agenda_index }} of {{ session.agenda?.length || 0 }} questions
            <span v-if="session.status !== 'active'" class="font-bold"> · {{ session.status }}</span>
          </p>
        </div>
      </header>

      <div class="flex flex-col gap-4 mt-4">
        <template v-for="m in session.messages" :key="m.id">
          <MessageBubble v-if="m.message_kind !== 'draft_confirmation'"
            :role="m.role === 'assistant' ? 'bot' : 'user'" :text="m.content" />

          <div v-else class="card">
            <template v-if="editing[m.id]">
              <div v-for="(c, i) in editing[m.id]" :key="i" class="mb-3">
                <input v-model="c.title" class="auth-input mb-2" />
                <textarea v-model="c.body" rows="2" class="auth-input" />
              </div>
            </template>
            <MessageBubble v-else role="bot" :text="m.content" />

            <div v-if="isActive && m === lastMsg" class="flex items-center gap-2 mt-3">
              <Button :disabled="busy" @click="confirm(m, 'confirm')">
                {{ editing[m.id] ? 'Save & confirm' : 'Looks right' }}
              </Button>
              <button v-if="!editing[m.id]" class="text-xs link" :disabled="busy" @click="startEdit(m)">Edit first</button>
              <Button variant="ghost" :disabled="busy" @click="confirm(m, 'discard')">Discard</Button>
            </div>
          </div>
        </template>
      </div>

      <p v-if="error" class="auth-error mt-3">{{ error }}</p>

      <form v-if="isActive && !awaitingDraft" class="flex items-center gap-2 mt-4" @submit.prevent="send">
        <input v-model="reply" placeholder="Type your reply…" class="auth-input flex-1" :disabled="busy" />
        <Button type="submit" :disabled="busy || !reply.trim()">{{ busy ? 'Sending…' : 'Send' }}</Button>
      </form>
      <p v-else-if="isActive && awaitingDraft" class="muted text-sm mt-4">
        Confirm, edit, or discard the draft above to continue.
      </p>
      <p v-else class="muted text-sm mt-4">This interview has finished. Thank you.</p>
    </template>
  </div>
</template>

<style scoped>
.chat-page { max-width: 760px; }
</style>
