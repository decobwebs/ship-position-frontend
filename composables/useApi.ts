// A thin $fetch wrapper that attaches the Supabase access token when signed
// in. Only needed for endpoints that accept or require a login (documents,
// sessions, admin, expert) — the public dashboard/chat endpoints work fine
// with plain $fetch/useFetch and are left as they are.
export function useApi() {
  const base = useRuntimeConfig().public.apiBase as string
  const session = useSupabaseSession()

  async function request<T = any>(path: string, opts: Record<string, any> = {}): Promise<T> {
    const token = session.value?.access_token
    try {
      return await $fetch<T>(`${base}${path}`, {
        ...opts,
        headers: {
          ...(opts.headers || {}),
          ...(token ? { Authorization: `Bearer ${token}` } : {}),
        },
      })
    } catch (err: any) {
      if (err?.response?.status === 401) {
        await navigateTo(`/auth/login?next=${encodeURIComponent(useRoute().fullPath)}`)
      }
      throw err
    }
  }

  return { request }
}
