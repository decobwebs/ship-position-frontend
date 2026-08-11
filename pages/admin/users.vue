<script setup lang="ts">
definePageMeta({ middleware: 'admin' })

const { request } = useApi()
const users = ref<any[]>([])
const pending = ref(true)
const busy = ref<string | null>(null)
const toast = ref('')

async function load() {
  pending.value = true
  try {
    users.value = await request('/api/admin/users')
  } finally {
    pending.value = false
  }
}
onMounted(load)

function flash(msg: string) {
  toast.value = msg
  setTimeout(() => { toast.value = '' }, 3000)
}

async function setRole(u: any, role: string) {
  if (role === u.role) return
  busy.value = u.id
  try {
    const updated = await request(`/api/admin/users/${u.id}/role`, { method: 'POST', body: { role } })
    u.role = updated.role
    flash(`${u.email} is now ${updated.role}.`)
  } catch (e: any) {
    flash(e?.data?.detail || 'Could not change that role.')
  } finally {
    busy.value = null
  }
}

const columns = [
  { key: 'email', label: 'User' },
  { key: 'role', label: 'Role' },
]
</script>

<template>
  <div class="page">
    <NuxtLink to="/admin" class="back">← Back to admin</NuxtLink>
    <header class="hero" style="margin-top: 8px">
      <div>
        <h1>Users</h1>
        <p class="sub">Promote someone to expert so they can teach the assistant.</p>
      </div>
    </header>

    <div v-if="toast" class="mb-4 p-3 rounded-lg bg-accent-ai-soft text-accent-ai text-sm font-semibold">{{ toast }}</div>

    <Skeleton v-if="pending" :rows="4" />
    <VesselTable v-else :columns="columns" :rows="users" primary-key="email" :row-key="(r) => r.id"
      empty-message="No users yet.">
      <template #cell-role="{ row }">
        <div class="flex gap-1.5">
          <button v-for="r in ['user', 'expert', 'admin']" :key="r"
            class="text-xs px-2.5 py-1 rounded-full border"
            :class="row.role === r ? 'border-accent-ai bg-accent-ai-soft font-bold' : 'border-line'"
            :disabled="busy === row.id"
            @click="setRole(row, r)">
            {{ r }}
          </button>
        </div>
      </template>
    </VesselTable>
  </div>
</template>
