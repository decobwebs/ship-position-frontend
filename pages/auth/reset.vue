<script setup lang="ts">
definePageMeta({ layout: 'auth' })

// Reached from the password-reset email. Supabase's client auto-detects the
// recovery token in the URL and opens a temporary session; we just collect
// the new password and call updateUser() while that session is active.
const supabase = useSupabaseClient()
const password = ref('')
const confirm = ref('')
const busy = ref(false)
const error = ref('')
const done = ref(false)
const ready = ref(false)

onMounted(() => {
  const { data: sub } = supabase.auth.onAuthStateChange((event) => {
    if (event === 'PASSWORD_RECOVERY') ready.value = true
  })
  // If the recovery session was already established before this component
  // mounted, there's no event to catch — allow the form either way after a beat.
  setTimeout(() => { ready.value = true }, 800)
  onBeforeUnmount(() => sub.subscription.unsubscribe())
})

async function onSubmit() {
  error.value = ''
  if (password.value !== confirm.value) { error.value = 'Passwords do not match.'; return }
  busy.value = true
  const { error: err } = await supabase.auth.updateUser({ password: password.value })
  busy.value = false
  if (err) { error.value = err.message; return }
  done.value = true
}
</script>

<template>
  <div>
    <template v-if="done">
      <h1 class="text-xl font-bold mb-1">Password updated</h1>
      <p class="sub mb-4">You're all set.</p>
      <Button class="w-full" @click="navigateTo('/')">Go to the dashboard</Button>
    </template>
    <template v-else>
      <h1 class="text-xl font-bold mb-1">Set a new password</h1>
      <p class="sub mb-5">Choose a new password for your account.</p>
      <form class="flex flex-col gap-3" @submit.prevent="onSubmit">
        <input v-model="password" type="password" required minlength="6" autocomplete="new-password" placeholder="New password" class="auth-input" />
        <input v-model="confirm" type="password" required minlength="6" autocomplete="new-password" placeholder="Confirm new password" class="auth-input" />
        <p v-if="error" class="auth-error">{{ error }}</p>
        <Button type="submit" class="w-full" :disabled="busy || !ready">{{ busy ? 'Saving…' : 'Save password' }}</Button>
      </form>
    </template>
  </div>
</template>
