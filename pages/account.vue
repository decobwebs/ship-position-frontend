<script setup lang="ts">
definePageMeta({ middleware: 'auth' })

const user = useSupabaseUser()
const supabase = useSupabaseClient()

async function signOut() {
  await supabase.auth.signOut()
  await navigateTo('/')
}
</script>

<template>
  <div class="page">
    <NuxtLink to="/" class="back">← Back to dashboard</NuxtLink>
    <header class="hero" style="margin-top: 8px">
      <div>
        <h1>Account</h1>
        <p class="sub">{{ user?.email }}</p>
      </div>
    </header>

    <section class="card" style="max-width: 420px">
      <h3>Your account</h3>
      <dl class="kv">
        <dt>Email</dt><dd>{{ user?.email }}</dd>
      </dl>
      <div class="mt-5 flex flex-col gap-3 items-start">
        <NuxtLink to="/chats" class="link font-semibold">View your chat history →</NuxtLink>
        <button class="chip hoverable:bg-bg" @click="signOut">Sign out</button>
      </div>
    </section>
  </div>
</template>
