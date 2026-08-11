<script setup lang="ts">
definePageMeta({ middleware: 'auth' })

const { request } = useApi()
const sessions = ref<any[] | null>(null)
const pending = ref(true)

onMounted(async () => {
  try {
    sessions.value = await request('/api/sessions')
  } finally {
    pending.value = false
  }
})

const columns = [
  { key: 'title', label: 'Conversation' },
  { key: 'last_message_at', label: 'Last message', mono: true },
]
</script>

<template>
  <div class="page">
    <NuxtLink to="/account" class="back">← Back to account</NuxtLink>
    <header class="hero" style="margin-top: 8px">
      <div>
        <h1>Your chats</h1>
        <p class="sub">Every conversation you've had with the assistant.</p>
      </div>
    </header>

    <Skeleton v-if="pending" :rows="4" />
    <VesselTable
      v-else
      :columns="columns"
      :rows="sessions"
      primary-key="title"
      :row-key="(row) => row.id"
      empty-message="No conversations yet — ask something on the Ask the Port page."
    >
      <template #cell-title="{ row }">
        <NuxtLink class="link font-semibold" :to="`/chats/${row.id}`">{{ row.title || '(untitled)' }}</NuxtLink>
      </template>
      <template #cell-last_message_at="{ row }">{{ row.last_message_at?.slice(0, 16).replace('T', ' ') || '' }}</template>
    </VesselTable>
  </div>
</template>
