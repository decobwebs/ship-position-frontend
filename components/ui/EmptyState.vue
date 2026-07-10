<script setup lang="ts">
withDefaults(defineProps<{
  message?: string
}>(), {
  message: 'Nothing to show.',
})
</script>

<template>
  <p class="text-muted italic text-sm py-2">{{ message }}</p>
</template>
