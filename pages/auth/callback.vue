<script setup lang="ts">
definePageMeta({ layout: 'auth' })

// Landing point for email confirmation links (only relevant if "Confirm email"
// is enabled in Supabase Auth settings). The client picks up the session from
// the URL automatically; we just wait for it, then move on.
const user = useSupabaseUser()
const route = useRoute()

watch(user, (u) => {
  if (u) navigateTo((route.query.next as string) || '/')
}, { immediate: true })

onMounted(() => {
  setTimeout(() => { if (!user.value) navigateTo('/auth/login') }, 3000)
})
</script>

<template>
  <div class="text-center">
    <h1 class="text-xl font-bold mb-1">Confirming…</h1>
    <p class="sub">One moment.</p>
  </div>
</template>
