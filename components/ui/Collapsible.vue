<script setup lang="ts">
const props = withDefaults(defineProps<{
  title: string
  count?: number
  defaultOpen?: boolean
}>(), {
  defaultOpen: false,
})

const open = ref(props.defaultOpen)
</script>

<template>
  <!-- mobile: collapsible -->
  <details class="sm:hidden bg-card border border-line rounded-lg" :open="defaultOpen" @toggle="open = ($event.target as HTMLDetailsElement).open">
    <summary
      class="list-none flex items-center justify-between px-5 py-4 cursor-pointer font-bold text-lg select-none"
    >
      <span class="flex items-center gap-2">
        {{ title }}
        <span v-if="count !== undefined" class="bg-accent-ai-soft text-accent-ai rounded-pill px-3 py-1 text-xs font-bold">
          {{ count }}
        </span>
      </span>
      <svg
        viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round"
        class="w-5 h-5 transition-transform duration-fast ease-standard"
        :class="{ 'rotate-180': open }"
      >
        <path d="m6 9 6 6 6-6" />
      </svg>
    </summary>
    <div class="px-5 pb-5">
      <slot />
    </div>
  </details>

  <!-- tablet/desktop: always-expanded card, same chrome as DataCard -->
  <section class="hidden sm:block bg-card border border-line rounded-lg p-6 min-w-0">
    <h3 class="m-0 mb-4 text-xl font-bold flex items-center gap-2">
      {{ title }}
      <span v-if="count !== undefined" class="bg-accent-ai-soft text-accent-ai rounded-pill px-3 py-1 text-xs font-bold">
        {{ count }}
      </span>
    </h3>
    <slot />
  </section>
</template>
