<script setup lang="ts">
import { useIntervalFn, useMediaQuery } from '@vueuse/core'

const props = defineProps<{
  items: string[]
  label?: string
}>()
const emit = defineEmits<{ pick: [text: string] }>()

const isDesktop = useMediaQuery('(min-width: 640px)')

/* ---- desktop: all suggestions stay visible; one at a time slowly
   scales up ("comes out"), holds, then scales back down. ---- */
const activeIndex = ref(0)

const { pause: pauseSpotlight, resume: resumeSpotlight } = useIntervalFn(() => {
  if (props.items.length <= 1) return
  activeIndex.value = (activeIndex.value + 1) % props.items.length
}, 5000)

/* ---- mobile: one suggestion at a time, typed out letter by letter,
   held, then faded before the next one types in. ---- */
const mobileIndex = ref(0)
const typedText = ref('')
const mobileVisible = ref(true)
const isTyping = ref(false)
let typeTimer: ReturnType<typeof setTimeout> | undefined
let holdTimer: ReturnType<typeof setTimeout> | undefined
let fadeTimer: ReturnType<typeof setTimeout> | undefined

function clearMobileTimers() {
  clearTimeout(typeTimer)
  clearTimeout(holdTimer)
  clearTimeout(fadeTimer)
}

function typeCurrent() {
  clearMobileTimers()
  const text = props.items[mobileIndex.value] || ''
  typedText.value = ''
  mobileVisible.value = true
  isTyping.value = true
  let i = 0
  const step = () => {
    i++
    typedText.value = text.slice(0, i)
    if (i < text.length) {
      typeTimer = setTimeout(step, 34)
    } else {
      isTyping.value = false
      if (props.items.length <= 1) return
      holdTimer = setTimeout(() => {
        mobileVisible.value = false
        fadeTimer = setTimeout(() => {
          mobileIndex.value = (mobileIndex.value + 1) % props.items.length
          typeCurrent()
        }, 320)
      }, 1900)
    }
  }
  step()
}

watch(() => props.items, () => {
  activeIndex.value = 0
  mobileIndex.value = 0
  if (!isDesktop.value) typeCurrent()
})

watch(isDesktop, (desktop) => {
  if (!desktop) typeCurrent()
  else clearMobileTimers()
})

onMounted(() => {
  if (!isDesktop.value) typeCurrent()
})

onUnmounted(() => {
  clearMobileTimers()
})
</script>

<template>
  <div v-if="items.length" class="w-full">
    <!-- desktop: all suggestions visible, one "comes out" at a time -->
    <div
      v-if="isDesktop"
      class="flex flex-wrap items-center gap-2.5"
      @pointerenter="pauseSpotlight"
      @pointerleave="resumeSpotlight"
      @focusin="pauseSpotlight"
      @focusout="resumeSpotlight"
    >
      <span v-if="label" class="text-muted text-xs shrink-0 mr-1">{{ label }}</span>
      <button
        v-for="(item, i) in items"
        :key="item + i"
        class="chip sug spotlight-chip"
        :class="{ 'is-active': i === activeIndex }"
        @click="emit('pick', item)"
      >
        {{ item }}
      </button>
    </div>

    <!-- mobile: single line, types itself out, holds, fades, next types in -->
    <div v-else class="flex items-center gap-2 min-h-[34px]">
      <span v-if="label" class="text-muted text-xs shrink-0">{{ label }}</span>
      <Transition name="fade">
        <button
          v-if="mobileVisible"
          :key="mobileIndex"
          class="chip sug"
          @click="emit('pick', items[mobileIndex])"
        >
          {{ typedText }}<span v-if="isTyping" class="caret">▍</span>
        </button>
      </Transition>
    </div>
  </div>
</template>

<style scoped>
.spotlight-chip {
  transform: scale(1);
  transition: transform 1200ms var(--ease-standard), box-shadow 1200ms var(--ease-standard), border-color 1200ms var(--ease-standard);
}
.spotlight-chip.is-active {
  transform: scale(1.16);
  box-shadow: var(--shadow-md);
  border-color: var(--ink);
  position: relative;
  z-index: 1;
}

.caret {
  display: inline-block;
  margin-left: 1px;
  animation: caret-blink 900ms step-start infinite;
}
@keyframes caret-blink {
  50% { opacity: 0; }
}

.fade-enter-active { transition: opacity 260ms var(--ease-standard); }
.fade-leave-active { transition: opacity 300ms var(--ease-standard); }
.fade-enter-from, .fade-leave-to { opacity: 0; }
</style>
