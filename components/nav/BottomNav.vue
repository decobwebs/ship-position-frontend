<script setup lang="ts">
const route = useRoute()
const isHome = computed(() => route.path === '/')
const isAsk = computed(() => route.path === '/ask')
const chatOpen = useChatSheet()

function onAskTap() {
  if (isAsk.value) return // already on the full chat page
  chatOpen.value = true
}
</script>

<template>
  <nav class="bottom-nav">
    <NuxtLink to="/" class="nav-item" :class="{ active: isHome }">
      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round">
        <path d="M3 11.5 12 4l9 7.5" />
        <path d="M5.5 10v9a1 1 0 0 0 1 1H9a1 1 0 0 0 1-1v-4a1 1 0 0 1 1-1h2a1 1 0 0 1 1 1v4a1 1 0 0 0 1 1h2.5a1 1 0 0 0 1-1v-9" />
      </svg>
      <span>Home</span>
    </NuxtLink>
    <button type="button" class="nav-item" :class="{ active: isAsk || chatOpen }" @click="onAskTap">
      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round">
        <path d="M4 5.5A2.5 2.5 0 0 1 6.5 3h11A2.5 2.5 0 0 1 20 5.5v8a2.5 2.5 0 0 1-2.5 2.5H10l-4.5 4v-4H6.5A2.5 2.5 0 0 1 4 13.5v-8Z" />
      </svg>
      <span>Ask</span>
    </button>
  </nav>
</template>

<style scoped>
.bottom-nav {
  display: none;
}
@media (max-width: 767px) {
  .bottom-nav {
    display: flex;
    position: fixed;
    left: 0;
    right: 0;
    bottom: 0;
    z-index: 40;
    background: var(--card);
    border-top: 1px solid var(--line);
    padding: 10px 12px calc(10px + env(safe-area-inset-bottom));
    justify-content: space-around;
    box-shadow: var(--shadow-md);
  }
}
.nav-item {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 3px;
  padding: 8px 22px;
  border-radius: var(--r-pill);
  color: var(--muted);
  font-size: 11px;
  font-weight: 700;
  background: none;
  border: 0;
  cursor: pointer;
  transition: transform var(--dur-instant) var(--ease-standard), color var(--dur-fast) var(--ease-standard), background var(--dur-fast) var(--ease-standard);
}
.nav-item:active {
  transform: scale(.94);
}
.nav-item svg {
  width: 23px;
  height: 23px;
}
.nav-item.active {
  color: var(--cta-ink);
  background: var(--cta-bg);
}
</style>
