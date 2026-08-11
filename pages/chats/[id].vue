<script setup lang="ts">
definePageMeta({ middleware: 'auth' })

const route = useRoute()
const { request } = useApi()
const msgs = ref<any[]>([])
const pending = ref(true)

onMounted(async () => {
  try {
    const rows: any[] = await request(`/api/history?session_id=${route.params.id}`)
    msgs.value = (rows || []).map((r) => ({ role: r.role === 'assistant' ? 'bot' : 'user', text: r.content }))
  } finally {
    pending.value = false
  }
})
</script>

<template>
  <div class="page chat-page">
    <NuxtLink to="/chats" class="back">← Back to your chats</NuxtLink>
    <header class="hero" style="margin-top: 8px">
      <h1 class="text-2xl">Conversation</h1>
    </header>

    <Skeleton v-if="pending" :rows="5" />
    <div v-else class="flex flex-col gap-4 mt-4">
      <MessageBubble v-for="(m, i) in msgs" :key="i" :role="m.role" :text="m.text" />
      <EmptyState v-if="!msgs.length" message="This conversation has no messages." />
    </div>
  </div>
</template>

<style scoped>
.chat-page { max-width: 760px; }
</style>
