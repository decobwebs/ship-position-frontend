<script setup lang="ts">
import { marked } from 'marked'
marked.setOptions({ breaks: true, gfm: true })
const render = (t: string) => marked.parse(t || '') as string

defineProps<{
  role: 'user' | 'bot'
  text: string
}>()
</script>

<template>
  <div class="msg" :class="role === 'user' ? 'user' : 'bot'">
    <div class="bubble">
      <div v-if="role === 'bot'" class="bubble-text md" v-html="render(text)" />
      <div v-else class="bubble-text">{{ text }}</div>
    </div>
  </div>
</template>

<style scoped>
.msg { display: flex; }
.msg.user { justify-content: flex-end; }
.msg.bot { justify-content: flex-start; }
.bubble {
  max-width: 100%;
  padding: 14px 18px;
  border-radius: var(--r-md);
  border: 1px solid var(--line);
  background: var(--card);
}
.msg.user .bubble {
  max-width: 82%;
  background: var(--cta-bg);
  color: var(--cta-ink);
  border-color: var(--cta-bg);
}
.msg.bot .bubble { max-width: 100%; }
.bubble-text { line-height: 1.5; }
.msg.user .bubble-text { white-space: pre-wrap; }

/* markdown inside bot bubbles */
.md :first-child { margin-top: 0; } .md :last-child { margin-bottom: 0; }
.md p { margin: 8px 0; } .md ul { margin: 8px 0; padding-left: 18px; } .md li { margin: 3px 0; }
.md table { border-collapse: collapse; margin: 8px 0; font-size: 13px; display: block; overflow-x: auto; }
.md th, .md td { border: 1px solid var(--line); padding: 5px 9px; text-align: left; white-space: nowrap; }
.md th { background: var(--bg); font-weight: 600; }
.md strong { font-weight: 700; }
</style>
