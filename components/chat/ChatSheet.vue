<script setup lang="ts">
import { onClickOutside, onKeyStroke, useSwipe } from '@vueuse/core'

const open = useChatSheet()
const panelRef = ref<HTMLElement | null>(null)
const dragHandle = ref<HTMLElement | null>(null)

function close() {
  open.value = false
}

onClickOutside(panelRef, () => {
  if (open.value) close()
})

onKeyStroke('Escape', () => {
  if (open.value) close()
})

const { lengthY } = useSwipe(dragHandle, {
  onSwipeEnd: () => {
    if (lengthY.value < -60) close()
  },
})
</script>

<template>
  <Teleport to="body">
    <!-- backdrop: mobile only -->
    <Transition name="fade">
      <div v-if="open" class="sm:hidden fixed inset-0 bg-[rgba(10,10,11,.4)] z-40" @click="close" />
    </Transition>

    <Transition name="sheet">
      <div
        v-if="open"
        ref="panelRef"
        class="fixed z-50 bg-card border border-line flex flex-col
               inset-x-0 bottom-0 h-[85vh] rounded-t-lg
               sm:inset-x-auto sm:bottom-6 sm:right-6 sm:left-auto sm:top-auto
               sm:w-[400px] sm:h-[600px] sm:max-h-[80vh] sm:rounded-lg sm:shadow-lg"
      >
        <div ref="dragHandle" class="sm:hidden flex justify-center py-2 shrink-0 touch-none">
          <span class="w-9 h-1 rounded-pill bg-line-strong" />
        </div>
        <div class="flex-1 min-h-0 px-6 pb-6 overflow-hidden">
          <ChatPanel show-close @close="close" />
        </div>
      </div>
    </Transition>

    <!-- desktop/tablet trigger; mobile uses the bottom-nav Ask tab instead -->
    <button
      v-if="!open"
      class="hidden sm:flex fixed bottom-6 right-6 z-30 w-14 h-14 rounded-full bg-cta text-cta-ink
             items-center justify-center shadow-lg transition-transform duration-instant ease-standard
             active:scale-95 hoverable:brightness-110"
      aria-label="Ask the Port"
      @click="open = true"
    >
      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round" class="w-6 h-6">
        <path d="M4 5.5A2.5 2.5 0 0 1 6.5 3h11A2.5 2.5 0 0 1 20 5.5v8a2.5 2.5 0 0 1-2.5 2.5H10l-4.5 4v-4H6.5A2.5 2.5 0 0 1 4 13.5v-8Z" />
      </svg>
    </button>
  </Teleport>
</template>

<style scoped>
.fade-enter-active, .fade-leave-active { transition: opacity var(--dur-fast) var(--ease-standard); }
.fade-enter-from, .fade-leave-to { opacity: 0; }

.sheet-enter-active, .sheet-leave-active { transition: transform var(--dur-slow) var(--ease-out), opacity var(--dur-slow) var(--ease-out); }
.sheet-enter-from, .sheet-leave-to { transform: translateY(100%); opacity: .6; }
@media (min-width: 640px) {
  .sheet-enter-from, .sheet-leave-to { transform: translateY(24px); opacity: 0; }
}
</style>
