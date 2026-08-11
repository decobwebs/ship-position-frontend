<script setup lang="ts">
definePageMeta({ middleware: 'admin' })

const route = useRoute()
const { request } = useApi()
const convo = ref<any>(null)
const pending = ref(true)
const expanded = ref<Record<number, boolean>>({})

onMounted(async () => {
  try {
    convo.value = await request(`/api/admin/conversations/${route.params.id}`)
  } finally {
    pending.value = false
  }
})

const bandColor: Record<string, string> = {
  high: 'bg-emerald-100 text-emerald-700', medium: 'bg-amber-100 text-amber-700', low: 'bg-red-100 text-red-700',
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

      <div class="flex flex-col gap-4 mt-4">
        <div v-for="(m, i) in convo.messages" :key="i">
          <MessageBubble :role="m.role === 'assistant' ? 'bot' : 'user'" :text="m.content" />
          <button v-if="m.role === 'assistant'" class="text-xs link ml-1 mt-1"
            @click="expanded[i] = !expanded[i]">
            {{ expanded[i] ? 'Hide details' : 'Inspect this answer' }}
            <span v-if="m.confidence_band" class="ml-1 px-1.5 py-0.5 rounded-full font-bold" :class="bandColor[m.confidence_band]">
              {{ Math.round(m.confidence * 100) }}%
            </span>
          </button>
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
        </div>
      </div>
    </template>
  </div>
</template>

<style scoped>
.chat-page { max-width: 760px; }
</style>
