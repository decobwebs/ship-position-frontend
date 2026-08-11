// Used by middleware/admin.ts and middleware/expert.ts. Always re-checks the
// role against the backend (never trusts a client-cached value) — the
// endpoints themselves are the real boundary, this just avoids flashing a
// page that will immediately 401/403 on its first data fetch.
export async function checkRole(path: '/api/admin/me' | '/api/expert/me'): Promise<boolean> {
  const base = useRuntimeConfig().public.apiBase as string
  const session = useSupabaseSession()
  try {
    await $fetch(`${base}${path}`, {
      headers: { Authorization: `Bearer ${session.value?.access_token || ''}` },
    })
    return true
  } catch {
    return false
  }
}
