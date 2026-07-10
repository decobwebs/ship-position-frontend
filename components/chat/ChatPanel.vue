<script setup lang="ts">
const props = withDefaults(defineProps<{
  fullPage?: boolean
  showClose?: boolean
}>(), {
  fullPage: false,
  showClose: false,
})
const emit = defineEmits<{ close: [] }>()

const base = useRuntimeConfig().public.apiBase as string

const q = ref('')
const busy = ref(false)
const msgs = ref<any[]>([])
const sessionId = ref('')
const SESSION_KEY = 'port_chat_session'
const scrollEl = ref<HTMLElement | null>(null)

onMounted(async () => {
  let sid = localStorage.getItem(SESSION_KEY)
  if (!sid) { sid = crypto.randomUUID(); localStorage.setItem(SESSION_KEY, sid) }
  sessionId.value = sid
  try {
    const rows: any[] = await $fetch(`${base}/api/history?session_id=${sid}`)
    msgs.value = (rows || []).map((r) => ({
      role: r.role === 'assistant' ? 'bot' : 'user', text: r.content, suggestions: [],
    }))
    await nextTick()
    scrollToBottom()
  } catch { /* first visit, no history yet */ }
})

function scrollToBottom() {
  if (props.fullPage) {
    window.scrollTo(0, document.body.scrollHeight)
  } else {
    scrollEl.value?.scrollTo(0, scrollEl.value.scrollHeight)
  }
}

function newChat() {
  const sid = crypto.randomUUID()
  localStorage.setItem(SESSION_KEY, sid)
  sessionId.value = sid
  msgs.value = []
  q.value = ''
}

const examples = [
  'Where is ANIMA?',
  'Which berths are vacant at Lekki?',
  'Which vessels waited longest for a berth?',
  'Any fuel tankers at anchorage?',
  'Which vessels are expected at LPC?',
]

async function send(text?: string) {
  const question = (text ?? q.value).trim()
  if (!question || busy.value) return
  msgs.value.push({ role: 'user', text: question })
  q.value = ''
  busy.value = true
  await nextTick()
  scrollToBottom()
  try {
    const r: any = await $fetch(`${base}/api/ask`, {
      method: 'POST',
      body: { question, session_id: sessionId.value },
    })
    msgs.value.push({ role: 'bot', text: r.answer, suggestions: r.suggestions || [] })
  } catch {
    msgs.value.push({ role: 'bot', text: 'Sorry, I could not answer that right now. Please try again.', suggestions: [] })
  } finally {
    busy.value = false
    await nextTick()
    scrollToBottom()
  }
}
</script>

<template>
  <div class="chat-panel" :class="{ 'full-page': fullPage }">
    <header class="chat-header">
      <div>
        <h1 v-if="fullPage" class="text-2xl sm:text-4xl">Ask the Port</h1>
        <h2 v-else class="text-lg font-bold m-0">Ask the Port</h2>
        <p v-if="fullPage" class="sub">Ask about vessels, berths and waiting times. If something isn't known, I'll say so.</p>
      </div>
      <div class="flex items-center gap-2">
        <button v-if="msgs.length" class="chip newchat hoverable:bg-bg" @click="newChat">＋ New chat</button>
        <button v-if="showClose" class="close-btn hoverable:bg-bg" aria-label="Close" @click="emit('close')">
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" class="w-5 h-5">
            <path d="m6 6 12 12M18 6 6 18" />
          </svg>
        </button>
      </div>
    </header>

    <div v-if="!msgs.length" class="examples">
      <SuggestionCarousel :items="examples" label="Try asking:" @pick="send" />
    </div>

    <div ref="scrollEl" class="chat-scroll">
      <div class="chat">
        <template v-for="(m, i) in msgs" :key="i">
          <MessageBubble :role="m.role" :text="m.text" />
          <div
            v-if="m.role === 'bot' && i === msgs.length - 1 && m.suggestions?.length"
            class="pl-0.5"
          >
            <SuggestionCarousel :items="m.suggestions" label="You could ask:" @pick="send" />
          </div>
        </template>
        <div v-if="busy" class="msg bot"><div class="bubble"><TypingIndicator /></div></div>
      </div>
    </div>

    <ChatInputBar v-model="q" :busy="busy" @submit="send()" />
    <footer v-if="fullPage" class="foot">Answers are based only on the latest available shipping information.</footer>
  </div>
</template>

<style scoped>
.chat-panel { display: flex; flex-direction: column; height: 100%; }
.chat-panel.full-page { max-width: 760px; margin: 0 auto; }
.chat-header { display: flex; justify-content: space-between; align-items: flex-start; gap: 12px; }
.newchat { cursor: pointer; align-self: center; border-color: var(--ink); color: var(--ink); background: var(--card); }
.close-btn {
  display: flex; align-items: center; justify-content: center;
  width: 36px; height: 36px; border-radius: var(--r-pill); color: var(--muted);
  transition: background var(--dur-fast) var(--ease-standard);
}
.examples { display: flex; flex-wrap: wrap; gap: 10px; align-items: center; margin: 16px 0 6px; }
.chat-scroll { flex: 1; overflow-y: auto; }
.chat-panel.full-page .chat-scroll { overflow-y: visible; flex: none; }
.chat { display: flex; flex-direction: column; gap: 14px; margin: 16px 0; }
.foot { margin-top: 20px; color: var(--muted); font-size: 12px; text-align: center; }
</style>
