<script setup lang="ts">
definePageMeta({ middleware: 'admin' })

const { request } = useApi()
const title = ref('')
const text = ref('')
const busy = ref(false)
const error = ref('')
const result = ref<{ count: number } | null>(null)

async function submit() {
  if (!text.value.trim()) return
  error.value = ''
  busy.value = true
  result.value = null
  try {
    result.value = await request('/api/admin/knowledge/ingest', {
      method: 'POST',
      body: { title: title.value || null, text: text.value },
    })
  } catch (e: any) {
    error.value = e?.data?.detail || 'Could not process that text.'
  } finally {
    busy.value = false
  }
}
</script>

<template>
  <div class="page">
    <NuxtLink to="/admin/knowledge" class="back">← Back to knowledge base</NuxtLink>
    <header class="hero" style="margin-top: 8px">
      <div>
        <h1>Add knowledge</h1>
        <p class="sub">Paste an expert message (WhatsApp, an email, notes). The assistant drafts
          proposals for you to review — nothing goes live until you accept it.</p>
      </div>
    </header>

    <section class="card" style="max-width: 640px">
      <input v-model="title" placeholder="Where this came from (optional) — e.g. CEO WhatsApp, 8 Jul" class="auth-input mb-3" />
      <textarea v-model="text" rows="10" placeholder="Paste the text here…" class="auth-input" />
      <p v-if="error" class="auth-error mt-2">{{ error }}</p>

      <template v-if="result">
        <p class="auth-ok mt-3">Drafted {{ result.count }} proposal{{ result.count === 1 ? '' : 's' }}.</p>
        <NuxtLink to="/admin/review" class="link font-semibold text-sm">Review them now →</NuxtLink>
      </template>

      <Button class="mt-4" :disabled="busy || !text.trim()" @click="submit">
        {{ busy ? 'Reading…' : 'Extract knowledge' }}
      </Button>
    </section>
  </div>
</template>
