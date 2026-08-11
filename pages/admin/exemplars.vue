<script setup lang="ts">
definePageMeta({ middleware: 'admin' })

const { request } = useApi()
const exemplars = ref<any[]>([])
const pending = ref(true)
const busy = ref<string | null>(null)
const toast = ref('')

async function load() {
  pending.value = true
  try {
    exemplars.value = await request('/api/admin/exemplars')
  } finally {
    pending.value = false
  }
}
onMounted(load)

function flash(msg: string) {
  toast.value = msg
  setTimeout(() => { toast.value = '' }, 3500)
}

async function toggle(e: any) {
  busy.value = e.id
  try {
    await request(`/api/admin/exemplars/${e.id}/active`, { method: 'POST', body: { active: !e.active } })
    e.active = !e.active
    flash(e.active ? 'Exemplar re-enabled.' : 'Exemplar disabled — it will no longer be shown to the AI.')
  } catch (err: any) {
    flash(err?.data?.detail || 'Could not update that exemplar.')
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
        <h1>Style exemplars</h1>
        <p class="sub">
          Copy the form, never the content. Each one nudges the AI's tone for questions like it — never a fact by itself.
        </p>
      </div>
    </header>

    <div v-if="toast" class="mb-4 p-3 rounded-lg bg-accent-ai-soft text-accent-ai text-sm font-semibold">{{ toast }}</div>

    <Skeleton v-if="pending" :rows="4" />
    <EmptyState v-else-if="!exemplars.length"
      message="No style corrections yet. Open a conversation and click Correct this → tone or format wrong." />

    <div v-else class="flex flex-col gap-4">
      <section v-for="e in exemplars" :key="e.id" class="card" :class="{ 'opacity-50': !e.active }">
        <div class="flex items-center gap-2 flex-wrap mb-2">
          <span class="text-xs font-bold px-2.5 py-1 rounded-full bg-blue-100 text-blue-700">{{ e.intent }}</span>
          <span class="text-xs text-muted">used {{ e.usage_count }} time{{ e.usage_count === 1 ? '' : 's' }}</span>
          <span v-if="!e.active" class="text-xs text-muted">· disabled</span>
        </div>
        <p class="text-sm text-muted mb-1">For questions like: "{{ e.question_text }}"</p>
        <p class="text-sm font-semibold">{{ e.ideal_answer }}</p>
        <div class="mt-3">
          <Button variant="ghost" :disabled="busy === e.id" @click="toggle(e)">
            {{ e.active ? 'Disable' : 'Re-enable' }}
          </Button>
        </div>
      </section>
    </div>
  </div>
</template>
