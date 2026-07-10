<script setup lang="ts">
const base = useRuntimeConfig().public.apiBase as string
const searchQ = ref('')
const searchResults = ref<any[]>([])
const mobileOpen = ref(false)
const inputRef = ref<HTMLInputElement | null>(null)
let timer: any

watch(searchQ, (v) => {
  clearTimeout(timer)
  if (!v || v.length < 2) { searchResults.value = []; return }
  timer = setTimeout(async () => {
    searchResults.value = await $fetch(`${base}/api/vessels?q=${encodeURIComponent(v)}`)
  }, 200)
})

const vlink = (name: string) => `/vessel/${encodeURIComponent(name)}`

function closeMobile() {
  mobileOpen.value = false
  searchQ.value = ''
}

async function openMobile() {
  mobileOpen.value = true
  await nextTick()
  inputRef.value?.focus()
}
</script>

<template>
  <div class="relative">
    <!-- desktop inline search -->
    <div class="hidden sm:block relative min-w-[260px]">
      <input
        v-model="searchQ"
        placeholder="Search a vessel's history…"
        class="w-full px-4 py-2.5 border border-line rounded-pill bg-card text-ink font-[inherit]
               focus:outline-none focus:border-ink"
      />
      <div v-if="searchResults.length" class="absolute z-10 top-[48px] left-0 right-0 bg-card border border-line rounded-lg overflow-hidden shadow-md">
        <NuxtLink
          v-for="r in searchResults" :key="r.vessel_name" :to="vlink(r.vessel_name)"
          class="flex justify-between gap-2.5 px-3 py-2 hoverable:bg-accent-ai-soft"
          @click="searchQ = ''"
        >
          <span class="font-semibold">{{ r.vessel_name }}</span>
          <span class="text-muted text-xs">{{ r.ports }} · {{ r.last_seen }}</span>
        </NuxtLink>
      </div>
    </div>

    <!-- mobile trigger -->
    <button
      class="sm:hidden inline-flex items-center justify-center w-11 h-11 rounded-full border border-line bg-card
             transition-transform duration-instant active:scale-[.94]"
      aria-label="Search vessels"
      @click="openMobile"
    >
      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" class="w-5 h-5">
        <circle cx="11" cy="11" r="7" />
        <path d="m21 21-4.3-4.3" />
      </svg>
    </button>

    <!-- mobile full-screen overlay -->
    <Transition name="fade">
      <div v-if="mobileOpen" class="sm:hidden fixed inset-0 z-50 bg-bg flex flex-col p-4">
        <div class="flex items-center gap-2">
          <input
            ref="inputRef"
            v-model="searchQ"
            placeholder="Search a vessel's history…"
            class="flex-1 px-4 py-3 border border-line rounded-pill bg-card text-ink font-[inherit]
                   focus:outline-none focus:border-ink"
          />
          <button class="text-sm font-semibold text-muted px-2" @click="closeMobile">Cancel</button>
        </div>
        <div class="flex flex-col mt-2 overflow-y-auto">
          <NuxtLink
            v-for="r in searchResults" :key="r.vessel_name" :to="vlink(r.vessel_name)"
            class="flex justify-between gap-2.5 px-3 py-3 border-b border-line"
            @click="closeMobile"
          >
            <span class="font-semibold">{{ r.vessel_name }}</span>
            <span class="text-muted text-xs">{{ r.ports }} · {{ r.last_seen }}</span>
          </NuxtLink>
          <p v-if="searchQ.length >= 2 && !searchResults.length" class="text-muted italic text-sm py-2">No matches.</p>
        </div>
      </div>
    </Transition>
  </div>
</template>

<style scoped>
.fade-enter-active, .fade-leave-active { transition: opacity var(--dur-fast) var(--ease-standard); }
.fade-enter-from, .fade-leave-to { opacity: 0; }
</style>
