// The chat session id lives in localStorage so a conversation survives a page
// refresh with no login required. Shared here so ChatPanel and the
// login-claim plugin agree on the same key and logic.
const SESSION_KEY = 'port_chat_session'

export function useChatSession() {
  function get(): string {
    if (typeof window === 'undefined') return ''
    let sid = localStorage.getItem(SESSION_KEY)
    if (!sid) {
      sid = crypto.randomUUID()
      localStorage.setItem(SESSION_KEY, sid)
    }
    return sid
  }

  function reset(): string {
    const sid = crypto.randomUUID()
    localStorage.setItem(SESSION_KEY, sid)
    return sid
  }

  return { get, reset }
}
