<script setup lang="ts">
const props = defineProps<{
  summary: any[]
  activePort: string
}>()
defineEmits<{ select: [port: string] }>()

const scrollEl = ref<HTMLElement | null>(null)
const pageIndex = ref(0)

function updatePageIndex() {
  const el = scrollEl.value
  if (!el || !el.children.length) return
  const center = el.scrollLeft + el.clientWidth / 2
  let closest = 0
  let closestDist = Infinity
  for (let i = 0; i < el.children.length; i++) {
    const child = el.children[i] as HTMLElement
    const childCenter = child.offsetLeft + child.offsetWidth / 2
    const dist = Math.abs(childCenter - center)
    if (dist < closestDist) { closestDist = dist; closest = i }
  }
  pageIndex.value = closest
}

let ticking = false
function onScroll() {
  if (ticking) return
  ticking = true
  requestAnimationFrame(() => { updatePageIndex(); ticking = false })
}

function goToPage(i: number) {
  const el = scrollEl.value
  const child = el?.children[i] as HTMLElement | undefined
  if (!el || !child) return
  el.scrollTo({ left: child.offsetLeft - (el.clientWidth - child.offsetWidth) / 2, behavior: 'smooth' })
}
</script>

<template>
  <div>
    <section
      ref="scrollEl"
      class="no-scrollbar flex gap-3 overflow-x-auto sm:overflow-visible snap-x snap-mandatory pb-1 pt-1 -mx-5 px-5 sm:mx-0 sm:px-0 sm:flex-wrap"
      @scroll.passive="onScroll"
    >
      <PortTile
        v-for="s in summary"
        :key="s.port"
        :summary="s"
        :active="s.port === activePort"
        @select="$emit('select', s.port)"
      />
    </section>
    <div v-if="summary.length > 1" class="flex sm:hidden justify-center items-center gap-2 mt-3">
      <button
        v-for="(s, i) in summary"
        :key="s.port"
        class="rounded-pill transition-all duration-fast ease-standard"
        :class="i === pageIndex ? 'w-6 h-2 bg-ink' : 'w-2 h-2 bg-line-strong'"
        :aria-label="`Go to ${s.port}`"
        @click="goToPage(i)"
      />
    </div>
  </div>
</template>
