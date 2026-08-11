// The moment someone signs in, silently link whatever chat session is in
// this browser's localStorage to their account. The backend no-ops if that
// session already belongs to someone else, so this is always safe to call.
export default defineNuxtPlugin(() => {
  const user = useSupabaseUser()
  const { request } = useApi()
  const { get: getSessionId } = useChatSession()
  let claimedFor: string | null = null

  watch(
    user,
    async (u) => {
      if (!u || claimedFor === u.id) return
      const sessionId = getSessionId()
      if (!sessionId) return
      claimedFor = u.id
      try {
        await request('/api/sessions/claim', {
          method: 'POST',
          body: { session_id: sessionId },
        })
      } catch {
        claimedFor = null // allow a retry on the next reactive trigger
      }
    },
    { immediate: true },
  )
})
