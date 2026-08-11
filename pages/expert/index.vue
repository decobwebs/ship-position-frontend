<script setup lang="ts">
definePageMeta({ middleware: 'expert' })

const user = useSupabaseUser()
</script>

<template>
  <div class="page">
    <NuxtLink to="/" class="back">← Back to dashboard</NuxtLink>
    <header class="hero" style="margin-top: 8px">
      <div>
        <h1>Expert portal</h1>
        <p class="sub">Signed in as {{ user?.email }}.</p>
      </div>
    </header>
    <section class="card" style="max-width: 480px">
      <h3>Coming next</h3>
      <p class="muted">The topic board and interview chat land here once the gap engine is built.</p>
    </section>
  </div>
</template>
