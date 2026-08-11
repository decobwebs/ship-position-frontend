<script setup lang="ts">
definePageMeta({ layout: 'auth' })

const supabase = useSupabaseClient()
const route = useRoute()
const email = ref('')
const password = ref('')
const busy = ref(false)
const error = ref('')

async function onSubmit() {
  error.value = ''
  busy.value = true
  const { error: err } = await supabase.auth.signInWithPassword({ email: email.value, password: password.value })
  busy.value = false
  if (err) { error.value = err.message; return }
  const next = (route.query.next as string) || '/'
  await navigateTo(next)
}
</script>

<template>
  <div>
    <h1 class="text-xl font-bold mb-1">Sign in</h1>
    <p class="sub mb-5">Sign in to keep your chats across devices.</p>
    <form class="flex flex-col gap-3" @submit.prevent="onSubmit">
      <input v-model="email" type="email" required autocomplete="email" placeholder="Email" class="auth-input" />
      <input v-model="password" type="password" required autocomplete="current-password" placeholder="Password" class="auth-input" />
      <p v-if="error" class="auth-error">{{ error }}</p>
      <Button type="submit" class="w-full" :disabled="busy">{{ busy ? 'Signing in…' : 'Sign in' }}</Button>
    </form>
    <div class="mt-4 flex justify-between text-xs">
      <NuxtLink to="/auth/forgot" class="link">Forgot password?</NuxtLink>
      <NuxtLink to="/auth/signup" class="link">Create an account</NuxtLink>
    </div>
  </div>
</template>
