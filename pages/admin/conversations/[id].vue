<script setup lang="ts">
definePageMeta({ middleware: 'admin' })

const route = useRoute()
const { request } = useApi()
const convo = ref<any>(null)
const pending = ref(true)
const expanded = ref<Record<number, boolean>>({})
const correcting = ref<Record<number, boolean>>({})
const intents = ref<string[]>([])
const toast = ref('')

const REASON_LABEL: Record<string, string> = {
  missing_knowledge: 'Missing knowledge',
  wrong_fact: 'A stated fact was wrong',
  tone_format: 'Tone or format wrong (facts were right)',
  bad_routing: 'Misrouted (wrong kind of answer)',
  no_draft: "Nothing to draft yet — send to an expert",
}

function blankForm() {
  return {
    reason: 'missing_knowledge',
    should_have_said: '',
    publish_now: true,
    pattern: '',
    target_intent: '',
    priority: 100,
    preview: null as { matched_count: number; examples: string[] } | null,
    previewing: false,
    subject: '',
    note: '',
    saving: false,
  }
}
const forms = ref<Record<number, ReturnType<typeof blankForm>>>({})

onMounted(async () => {
  try {
    const [c, i] = await Promise.all([
      request(`/api/admin/conversations/${route.params.id}`),
      request('/api/admin/routing-rules/intents'),
    ])
    convo.value = c
    intents.value = i.intents
  } finally {
    pending.value = false
  }
})

const bandColor: Record<string, string> = {
  high: 'bg-emerald-100 text-emerald-700', medium: 'bg-amber-100 text-amber-700', low: 'bg-red-100 text-red-700',
}

function flash(msg: string) {
  toast.value = msg
  setTimeout(() => { toast.value = '' }, 4000)
}

function openCorrect(i: number, question: string) {
  correcting.value[i] = !correcting.value[i]
  if (correcting.value[i] && !forms.value[i]) {
    const f = blankForm()
    f.pattern = question
    f.target_intent = intents.value[0] || ''
    forms.value[i] = f
  }
}

async function previewRouting(i: number) {
  const f = forms.value[i]
  if (!f.pattern.trim()) { flash('Enter a pattern first.'); return }
  f.previewing = true
  try {
    f.preview = await request('/api/admin/routing-rules/preview', { method: 'POST', body: { pattern: f.pattern } })
  } catch (e: any) {
    flash(e?.data?.detail || 'That pattern is not valid.')
  } finally {
    f.previewing = false
  }
}

async function submit(i: number, m: any) {
  const f = forms.value[i]
  f.saving = true
  try {
    let body: any = { reason: f.reason }
    if (f.reason === 'missing_knowledge' || f.reason === 'wrong_fact') {
      body.should_have_said = f.should_have_said
      body.publish_now = f.publish_now
    } else if (f.reason === 'tone_format') {
      body.should_have_said = f.should_have_said
    } else if (f.reason === 'bad_routing') {
      if (!f.preview) { flash("Run the dry-run preview first — a rule can't be saved unseen."); f.saving = false; return }
      const rule = await request('/api/admin/routing-rules', {
        method: 'POST',
        body: { pattern: f.pattern, target_intent: f.target_intent, priority: f.priority },
      })
      body.routing_rule_id = rule.id
    } else if (f.reason === 'no_draft') {
      body.subject = f.subject
      body.note = f.note
    }
    await request(`/api/admin/messages/${m.id}/correct`, { method: 'POST', body })
    flash('Correction saved. It takes effect immediately, no restart needed.')
    correcting.value[i] = false
  } catch (e: any) {
    flash(e?.data?.detail || 'Could not save that correction.')
  } finally {
    f.saving = false
  }
}
</script>

<template>
  <div class="page chat-page">
    <NuxtLink to="/admin/conversations" class="back">← Back to conversations</NuxtLink>
    <Skeleton v-if="pending" :rows="5" />
    <template v-else-if="convo">
      <header class="hero" style="margin-top: 8px">
        <div>
          <h1 class="text-2xl">{{ convo.title || '(untitled)' }}</h1>
          <p class="sub">{{ convo.user_email || 'Anonymous visitor' }}</p>
        </div>
      </header>

      <div v-if="toast" class="mb-4 p-3 rounded-lg bg-accent-ai-soft text-accent-ai text-sm font-semibold">{{ toast }}</div>

      <div class="flex flex-col gap-4 mt-4">
        <div v-for="(m, i) in convo.messages" :key="i">
          <MessageBubble :role="m.role === 'assistant' ? 'bot' : 'user'" :text="m.content" />
          <div v-if="m.role === 'assistant'" class="flex items-center gap-3 ml-1 mt-1">
            <button class="text-xs link" @click="expanded[i] = !expanded[i]">
              {{ expanded[i] ? 'Hide details' : 'Inspect this answer' }}
              <span v-if="m.confidence_band" class="ml-1 px-1.5 py-0.5 rounded-full font-bold" :class="bandColor[m.confidence_band]">
                {{ Math.round(m.confidence * 100) }}%
              </span>
            </button>
            <button class="text-xs link" @click="openCorrect(i, convo.messages[i - 1]?.content || '')">
              {{ correcting[i] ? 'Cancel' : 'Correct this' }}
            </button>
          </div>

          <div v-if="expanded[i]" class="card mt-2 text-xs">
            <dl class="kv">
              <dt>Intent</dt><dd class="mono">{{ m.intent }}</dd>
              <dt>Provider</dt><dd class="mono">{{ m.provider }}</dd>
              <dt>Confidence</dt><dd class="mono">{{ m.confidence }} ({{ m.confidence_band }})</dd>
              <dt v-if="m.knowledge_entry_titles?.length">Knowledge used</dt>
              <dd v-if="m.knowledge_entry_titles?.length">{{ m.knowledge_entry_titles.join(', ') }}</dd>
            </dl>
            <p class="font-bold mt-2 mb-1">Why this score:</p>
            <ul class="flex flex-col gap-0.5">
              <li v-for="(v, k) in m.confidence_factors" :key="k" class="mono">{{ k }}: {{ v }}</li>
            </ul>
          </div>

          <div v-if="correcting[i] && forms[i]" class="card mt-2">
            <label class="text-xs font-bold text-muted">What went wrong?</label>
            <select v-model="forms[i].reason" class="auth-input mb-3">
              <option v-for="(label, key) in REASON_LABEL" :key="key" :value="key">{{ label }}</option>
            </select>

            <template v-if="forms[i].reason === 'missing_knowledge' || forms[i].reason === 'wrong_fact'">
              <label class="text-xs font-bold text-muted">What it should have said</label>
              <textarea v-model="forms[i].should_have_said" rows="3" class="auth-input mb-2" />
              <label class="text-xs flex items-center gap-2 mb-3">
                <input type="checkbox" v-model="forms[i].publish_now" /> Publish immediately (you're the approver anyway)
              </label>
            </template>

            <template v-else-if="forms[i].reason === 'tone_format'">
              <label class="text-xs font-bold text-muted">The ideal answer (shape and tone, not new facts)</label>
              <textarea v-model="forms[i].should_have_said" rows="3" class="auth-input mb-3" />
            </template>

            <template v-else-if="forms[i].reason === 'bad_routing'">
              <label class="text-xs font-bold text-muted">Pattern (regex, case-insensitive)</label>
              <input v-model="forms[i].pattern" class="auth-input mb-2" @input="forms[i].preview = null" />
              <div class="flex gap-2 mb-2">
                <div class="flex-1">
                  <label class="text-xs font-bold text-muted">Should route to</label>
                  <select v-model="forms[i].target_intent" class="auth-input">
                    <option v-for="opt in intents" :key="opt" :value="opt">{{ opt }}</option>
                  </select>
                </div>
                <div style="width: 100px">
                  <label class="text-xs font-bold text-muted">Priority</label>
                  <input v-model.number="forms[i].priority" type="number" class="auth-input" />
                </div>
              </div>
              <Button variant="ghost" :disabled="forms[i].previewing" @click="previewRouting(i)">
                {{ forms[i].previewing ? 'Checking…' : 'Dry-run against past questions' }}
              </Button>
              <div v-if="forms[i].preview" class="mt-2 p-2 rounded-lg bg-accent-ai-soft text-xs">
                Would have matched {{ forms[i].preview.matched_count }} past question{{ forms[i].preview.matched_count === 1 ? '' : 's' }}.
              </div>
              <div class="h-3" />
            </template>

            <template v-else-if="forms[i].reason === 'no_draft'">
              <label class="text-xs font-bold text-muted">What's missing</label>
              <input v-model="forms[i].subject" class="auth-input mb-2" placeholder="e.g. General berth allocation policy" />
              <label class="text-xs font-bold text-muted">Note for the expert (optional)</label>
              <textarea v-model="forms[i].note" rows="2" class="auth-input mb-3" />
            </template>

            <Button :disabled="forms[i].saving" @click="submit(i, m)">
              {{ forms[i].saving ? 'Saving…' : 'Save correction' }}
            </Button>
          </div>
        </div>
      </div>
    </template>
  </div>
</template>

<style scoped>
.chat-page { max-width: 760px; }
</style>
