<script setup lang="ts">
definePageMeta({ middleware: 'admin' })

const { request } = useApi()
const rules = ref<any[]>([])
const intents = ref<string[]>([])
const pending = ref(true)
const busy = ref<string | null>(null)
const toast = ref('')

const pattern = ref('')
const targetIntent = ref('')
const priority = ref(100)
const preview = ref<{ matched_count: number; examples: string[] } | null>(null)
const previewing = ref(false)
const saving = ref(false)

async function load() {
  pending.value = true
  try {
    const [r, i] = await Promise.all([
      request('/api/admin/routing-rules'),
      request('/api/admin/routing-rules/intents'),
    ])
    rules.value = r
    intents.value = i.intents
    targetIntent.value = i.intents[0] || ''
  } finally {
    pending.value = false
  }
}
onMounted(load)

function flash(msg: string) {
  toast.value = msg
  setTimeout(() => { toast.value = '' }, 3500)
}

watch(pattern, () => { preview.value = null })

async function runPreview() {
  if (!pattern.value.trim()) { flash('Enter a pattern first.'); return }
  previewing.value = true
  try {
    preview.value = await request('/api/admin/routing-rules/preview', { method: 'POST', body: { pattern: pattern.value } })
  } catch (e: any) {
    flash(e?.data?.detail || 'That pattern is not valid.')
  } finally {
    previewing.value = false
  }
}

async function save() {
  if (!preview.value) { flash('Run the dry-run preview first — a rule can\'t be saved unseen.'); return }
  saving.value = true
  try {
    await request('/api/admin/routing-rules', {
      method: 'POST',
      body: { pattern: pattern.value, target_intent: targetIntent.value, priority: priority.value },
    })
    flash(`Saved. It will now catch questions matching this pattern immediately — no deploy needed.`)
    pattern.value = ''
    preview.value = null
    priority.value = 100
    await load()
  } catch (e: any) {
    flash(e?.data?.detail || 'Could not save that rule.')
  } finally {
    saving.value = false
  }
}

async function toggle(r: any) {
  busy.value = r.id
  try {
    await request(`/api/admin/routing-rules/${r.id}/active`, { method: 'POST', body: { active: !r.active } })
    r.active = !r.active
    flash(r.active ? 'Rule re-enabled.' : 'Rule disabled.')
  } catch (e: any) {
    flash(e?.data?.detail || 'Could not update that rule.')
  } finally {
    busy.value = null
  }
}
</script>

<template>
  <div class="page">
    <NuxtLink to="/admin" class="back">← Back to admin</NuxtLink>
    <header class="hero" style="margin-top: 8px">
      <div>
        <h1>Routing rules</h1>
        <p class="sub">Consulted first, before any built-in pattern. A correction here takes effect immediately, no deploy.</p>
      </div>
    </header>

    <div v-if="toast" class="mb-4 p-3 rounded-lg bg-accent-ai-soft text-accent-ai text-sm font-semibold">{{ toast }}</div>

    <section class="card mb-6">
      <h3 class="mb-2">New rule</h3>
      <label class="text-xs font-bold text-muted">Pattern (regex, case-insensitive)</label>
      <input v-model="pattern" placeholder="e.g. explain how .*(berth|jetty)" class="auth-input mb-2" />

      <div class="flex gap-2 mb-2">
        <div class="flex-1">
          <label class="text-xs font-bold text-muted">Route to</label>
          <select v-model="targetIntent" class="auth-input">
            <option v-for="i in intents" :key="i" :value="i">{{ i }}</option>
          </select>
        </div>
        <div style="width: 120px">
          <label class="text-xs font-bold text-muted">Priority</label>
          <input v-model.number="priority" type="number" class="auth-input" />
          <p class="text-xs text-muted mt-1">lower runs first</p>
        </div>
      </div>

      <Button variant="ghost" :disabled="previewing" @click="runPreview">
        {{ previewing ? 'Checking…' : 'Dry-run against past questions' }}
      </Button>

      <div v-if="preview" class="mt-3 p-3 rounded-lg bg-accent-ai-soft">
        <p class="text-sm font-semibold mb-1">
          Would have matched {{ preview.matched_count }} past question{{ preview.matched_count === 1 ? '' : 's' }}.
        </p>
        <ul v-if="preview.examples.length" class="text-xs text-muted flex flex-col gap-0.5">
          <li v-for="(ex, i) in preview.examples" :key="i">"{{ ex }}"</li>
        </ul>
        <p v-if="preview.matched_count > 20" class="text-xs text-red-600 mt-2 font-semibold">
          That's a lot of matches — double check this pattern isn't too broad before saving.
        </p>
      </div>

      <div class="mt-3">
        <Button :disabled="saving || !preview" @click="save">{{ saving ? 'Saving…' : 'Save rule' }}</Button>
      </div>
    </section>

    <h3 class="mb-2">Active rules</h3>
    <Skeleton v-if="pending" :rows="3" />
    <EmptyState v-else-if="!rules.length" message="No routing rules yet — questions route by the built-in patterns only." />
    <div v-else class="flex flex-col gap-2">
      <div v-for="r in rules" :key="r.id" class="card flex items-center gap-3" :class="{ 'opacity-50': !r.active }">
        <code class="text-xs flex-1">{{ r.pattern }}</code>
        <span class="text-xs font-bold px-2 py-1 rounded-full bg-blue-100 text-blue-700">{{ r.target_intent }}</span>
        <span class="text-xs text-muted">priority {{ r.priority }}</span>
        <span class="text-xs text-muted">{{ r.dry_run_matched }} matched at save</span>
        <Button variant="ghost" :disabled="busy === r.id" @click="toggle(r)">
          {{ r.active ? 'Disable' : 'Re-enable' }}
        </Button>
      </div>
    </div>
  </div>
</template>
