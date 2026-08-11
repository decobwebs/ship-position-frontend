<script setup lang="ts">
definePageMeta({ middleware: 'admin' })

const user = useSupabaseUser()
const { request } = useApi()
const pendingCount = ref<number | null>(null)
onMounted(async () => {
  try {
    const rows: any[] = await request('/api/admin/knowledge/proposals?status=pending')
    pendingCount.value = rows.length
  } catch { /* ignore */ }
})
</script>

<template>
  <div class="page">
    <NuxtLink to="/" class="back">← Back to dashboard</NuxtLink>
    <header class="hero" style="margin-top: 8px">
      <div>
        <h1>Admin</h1>
        <p class="sub">Signed in as {{ user?.email }}.</p>
      </div>
    </header>

    <div class="grid" style="grid-template-columns: 1fr 1fr; gap: 16px">
      <NuxtLink to="/admin/review" class="card hoverable:border-accent-ai" style="display:block">
        <h3 class="mb-1">Review queue
          <span v-if="pendingCount" class="count">{{ pendingCount }}</span>
        </h3>
        <p class="muted text-sm">Accept, edit or reject proposed knowledge.</p>
      </NuxtLink>
      <NuxtLink to="/admin/knowledge" class="card hoverable:border-accent-ai" style="display:block">
        <h3 class="mb-1">Knowledge base</h3>
        <p class="muted text-sm">Browse topics, entries and version history.</p>
      </NuxtLink>
      <NuxtLink to="/admin/knowledge/ingest" class="card hoverable:border-accent-ai" style="display:block">
        <h3 class="mb-1">Add knowledge</h3>
        <p class="muted text-sm">Paste an expert message to draft proposals.</p>
      </NuxtLink>
      <NuxtLink to="/admin/users" class="card hoverable:border-accent-ai" style="display:block">
        <h3 class="mb-1">Users</h3>
        <p class="muted text-sm">Promote someone to expert.</p>
      </NuxtLink>
      <NuxtLink to="/admin/conversations" class="card hoverable:border-accent-ai" style="display:block">
        <h3 class="mb-1">Conversations</h3>
        <p class="muted text-sm">Every chat, with confidence and what knowledge was used.</p>
      </NuxtLink>
      <NuxtLink to="/admin/gaps" class="card hoverable:border-accent-ai" style="display:block">
        <h3 class="mb-1">Knowledge gaps</h3>
        <p class="muted text-sm">What the assistant doesn't know, ranked with evidence.</p>
      </NuxtLink>
    </div>

    <section class="card mt-4" style="max-width: 480px">
      <h3>Coming next</h3>
      <p class="muted text-sm">Expert interviews and the feedback loop land in the next build stages.</p>
    </section>
  </div>
</template>
