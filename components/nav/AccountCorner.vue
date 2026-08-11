<script setup lang="ts">
// A small, unobtrusive corner affordance: "Sign in" when anonymous, or the
// user's initial when signed in. Pages keep rendering their own headers, so
// this floats independently rather than living in a shared page header.
const user = useSupabaseUser()
const initial = computed(() => (user.value?.email || '?').charAt(0).toUpperCase())
</script>

<template>
  <NuxtLink
    :to="user ? '/account' : '/auth/login'"
    class="account-corner hoverable:bg-accent-ai-soft"
    :title="user ? (user.email as string) : 'Sign in'"
  >
    <span v-if="user" class="avatar">{{ initial }}</span>
    <span v-else class="signin-label">Sign in</span>
  </NuxtLink>
</template>

<style scoped>
.account-corner {
  position: fixed;
  top: 14px;
  right: 14px;
  z-index: 30;
  display: flex;
  align-items: center;
  justify-content: center;
  transition: background var(--dur-fast, 150ms) var(--ease-standard, ease);
}
.avatar {
  width: 32px;
  height: 32px;
  border-radius: 999px;
  background: var(--cta-bg, var(--accent-ai, #0d6efd));
  color: var(--cta-ink, #fff);
  display: flex;
  align-items: center;
  justify-content: center;
  font-weight: 700;
  font-size: 13px;
}
.signin-label {
  font-size: 12.5px;
  font-weight: 700;
  color: var(--accent-ai, #0d6efd);
  background: var(--card);
  border: 1px solid var(--line);
  border-radius: var(--r-pill, 999px);
  padding: 6px 12px;
}
@media (max-width: 767px) {
  .account-corner { top: 10px; right: 10px; }
}
</style>
