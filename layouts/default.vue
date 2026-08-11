<script setup lang="ts">
const route = useRoute()
const isAsk = computed(() => route.path === '/ask')
</script>

<template>
  <div class="app-shell">
    <AccountCorner />
    <slot />
    <BottomNav />
    <ChatSheet v-if="!isAsk" />
  </div>
</template>

<style scoped>
@media (max-width: 767px) {
  .app-shell {
    padding-bottom: 64px;
  }
}
</style>
