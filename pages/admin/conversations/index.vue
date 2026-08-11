<script setup lang="ts">
definePageMeta({ middleware: 'admin' })

const { request } = useApi()
const conversations = ref<any[]>([])
const pending = ref(true)
const lowOnly = ref(false)

async function load() {
  pending.value = true
  try {
    conversations.value = await request(`/api/admin/conversations${lowOnly.value ? '?low_confidence_only=true' : ''}`)
  } finally {
    pending.value = false
  }
}
onMounted(load)
watch(lowOnly, load)

const columns = [
  { key: 'title', label: 'Conversation' },
  { key: 'user_email', label: 'User' },
  { key: 'min_confidence', label: 'Lowest confidence' },
  { key: 'last_message_at', label: 'Last message', mono: true },
]
</script>

<template>
  <div class="page">
    <NuxtLink to="/admin" class="back">← Back to admin</NuxtLink>
    <header class="hero" style="margin-top: 8px">
      <div>
        <h1>Conversations</h1>
        <p class="sub">Every chat, with what the assistant used and how confident it was.</p>
      </div>
    </header>

    <label class="flex items-center gap-2 mb-4 text-sm">
      <input type="checkbox" v-model="lowOnly" />
      Show only conversations with a low-confidence answer
    </label>

    <Skeleton v-if="pending" :rows="5" />
    <VesselTable v-else :columns="columns" :rows="conversations" primary-key="title"
      :row-key="(r) => r.id" empty-message="No conversations yet.">
      <template #cell-title="{ row }">
        <NuxtLink class="link font-semibold" :to="`/admin/conversations/${row.id}`">{{ row.title || '(untitled)' }}</NuxtLink>
      </template>
      <template #cell-user_email="{ row }">
        <span :class="row.user_email ? '' : 'text-muted italic'">{{ row.user_email || 'anonymous' }}</span>
      </template>
      <template #cell-min_confidence="{ row }">
        <span v-if="row.min_confidence == null" class="text-muted">—</span>
        <span v-else class="text-xs font-bold px-2 py-0.5 rounded-full"
          :class="row.has_low_confidence ? 'bg-red-100 text-red-700' : 'bg-emerald-100 text-emerald-700'">
          {{ Math.round(row.min_confidence * 100) }}%
        </span>
      </template>
      <template #cell-last_message_at="{ row }">{{ row.last_message_at?.slice(0, 16).replace('T', ' ') }}</template>
    </VesselTable>
  </div>
</template>
