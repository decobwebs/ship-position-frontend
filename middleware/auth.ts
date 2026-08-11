// Applied per-page via definePageMeta({ middleware: 'auth' }). Not global —
// the dashboard and chat stay open to anonymous visitors by design.
export default defineNuxtRouteMiddleware((to) => {
  const user = useSupabaseUser()
  if (!user.value) {
    return navigateTo(`/auth/login?next=${encodeURIComponent(to.fullPath)}`)
  }
})
