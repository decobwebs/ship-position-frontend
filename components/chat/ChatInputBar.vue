<script setup lang="ts">
const props = defineProps<{
  modelValue: string
  busy: boolean
}>()
const emit = defineEmits<{ 'update:modelValue': [v: string]; submit: [] }>()

const value = computed({
  get: () => props.modelValue,
  set: (v: string) => emit('update:modelValue', v),
})
</script>

<template>
  <form class="ask-bar" @submit.prevent="emit('submit')">
    <input
      v-model="value"
      :disabled="busy"
      placeholder="Ask about a vessel, berth or waiting time…"
    />
    <Button type="submit" :disabled="busy || !value.trim()">Ask</Button>
  </form>
</template>

<style scoped>
.ask-bar {
  position: sticky;
  bottom: 0;
  display: flex;
  gap: 8px;
  padding: 12px 0;
  background: linear-gradient(transparent, var(--bg) 30%);
}
.ask-bar input {
  flex: 1;
  padding: 14px 18px;
  border: 1px solid var(--line);
  border-radius: var(--r-pill);
  background: var(--card);
  color: var(--ink);
  font: inherit;
}
.ask-bar input:focus { outline: none; border-color: var(--ink); }
</style>
