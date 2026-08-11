<template>
  <div class="auth-shell">
    <div class="auth-card">
      <NuxtLink to="/" class="brand">Lagos Port Vessel Intelligence</NuxtLink>
      <slot />
    </div>
  </div>
</template>

<style scoped>
.auth-shell {
  min-height: 100vh;
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 24px;
  background: var(--bg, #f6f7f9);
}
.auth-card {
  width: 100%;
  max-width: 380px;
  background: var(--card, #fff);
  border: 1px solid var(--line, #e5e7eb);
  border-radius: 16px;
  padding: 28px 26px;
}
.brand {
  display: block;
  text-align: center;
  font-weight: 800;
  font-size: 14px;
  letter-spacing: -0.01em;
  color: var(--ink, #1a1d23);
  text-decoration: none;
  margin-bottom: 22px;
}
</style>
