<script setup lang="ts">
definePageMeta({ layout: 'auth' })

const supabase = useSupabaseClient()
const email = ref('')
const busy = ref(false)
const error = ref('')
const sent = ref(false)

async function onSubmit() {
  error.value = ''
  busy.value = true
  const { error: err } = await supabase.auth.resetPasswordForEmail(email.value, {
    redirectTo: `${window.location.origin}/auth/reset`,
  })
  busy.value = false
  if (err) { error.value = err.message; return }
  sent.value = true
}
</script>

<template>
  <div>
    <template v-if="sent">
      <h1 class="text-xl font-bold mb-1">Check your email</h1>
      <p class="sub">If an account exists for <b>{{ email }}</b>, a reset link is on its way.</p>
    </template>
    <template v-else>
      <h1 class="text-xl font-bold mb-1">Forgot password</h1>
      <p class="sub mb-5">We'll email you a link to set a new one.</p>
      <form class="flex flex-col gap-3" @submit.prevent="onSubmit">
        <input v-model="email" type="email" required autocomplete="email" placeholder="Email" class="auth-input" />
        <p v-if="error" class="auth-error">{{ error }}</p>
        <Button type="submit" class="w-full" :disabled="busy">{{ busy ? 'Sending…' : 'Send reset link' }}</Button>
      </form>
      <div class="mt-4 text-xs text-center">
        <NuxtLink to="/auth/login" class="link">Back to sign in</NuxtLink>
      </div>
    </template>
  </div>
</template>
