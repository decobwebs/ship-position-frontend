export default defineNuxtRouteMiddleware(async (to) => {
  const user = useSupabaseUser()
  if (!user.value) {
    return navigateTo(`/auth/login?next=${encodeURIComponent(to.fullPath)}`)
  }
  const ok = await checkRole('/api/expert/me')
  if (!ok) {
    return navigateTo('/') // signed in, but not an expert
  }
})
