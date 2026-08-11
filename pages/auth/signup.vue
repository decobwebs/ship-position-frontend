<script setup lang="ts">
definePageMeta({ layout: 'auth' })

// Handles both Supabase Auth modes without needing a dashboard-setting check
// in code: if "Confirm email" is off, signUp() returns a session immediately
// and we go straight in; if it's on, we show the "check your email" message.
const supabase = useSupabaseClient()
const route = useRoute()
const email = ref('')
const password = ref('')
const busy = ref(false)
const error = ref('')
const awaitingConfirmation = ref(false)

async function onSubmit() {
  error.value = ''
  busy.value = true
  const { data, error: err } = await supabase.auth.signUp({
    email: email.value,
    password: password.value,
  })
  busy.value = false
  if (err) { error.value = err.message; return }
  if (data.session) {
    const next = (route.query.next as string) || '/'
    await navigateTo(next)
  } else {
    awaitingConfirmation.value = true
  }
}
</script>

<template>
  <div>
    <template v-if="awaitingConfirmation">
      <h1 class="text-xl font-bold mb-1">Check your email</h1>
      <p class="sub">We sent a confirmation link to <b>{{ email }}</b>. Open it to finish creating your account.</p>
    </template>
    <template v-else>
      <h1 class="text-xl font-bold mb-1">Create an account</h1>
      <p class="sub mb-5">One-time signup. You'll stay signed in on this device.</p>
      <form class="flex flex-col gap-3" @submit.prevent="onSubmit">
        <input v-model="email" type="email" required autocomplete="email" placeholder="Email" class="auth-input" />
        <input v-model="password" type="password" required minlength="6" autocomplete="new-password" placeholder="Password (min. 6 characters)" class="auth-input" />
        <p v-if="error" class="auth-error">{{ error }}</p>
        <Button type="submit" class="w-full" :disabled="busy">{{ busy ? 'Creating account…' : 'Create account' }}</Button>
      </form>
      <div class="mt-4 text-xs text-center">
        <NuxtLink to="/auth/login" class="link">Already have an account? Sign in</NuxtLink>
      </div>
    </template>
  </div>
</template>
