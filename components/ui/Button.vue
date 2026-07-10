<script setup lang="ts">
withDefaults(defineProps<{
  variant?: 'primary' | 'ghost'
  type?: 'button' | 'submit'
  disabled?: boolean
}>(), {
  variant: 'primary',
  type: 'button',
  disabled: false,
})
</script>

<template>
  <button
    :type="type"
    :disabled="disabled"
    class="inline-flex items-center justify-center gap-2 rounded-pill px-6 h-12 text-sm font-semibold
           transition-transform duration-instant ease-standard active:scale-[.97]
           disabled:opacity-50 disabled:cursor-not-allowed disabled:active:scale-100"
    :class="variant === 'primary'
      ? 'bg-cta text-cta-ink hoverable:brightness-110'
      : 'bg-transparent text-ink border border-line hoverable:bg-bg'"
  >
    <slot />
  </button>
</template>
