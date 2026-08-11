export default defineNuxtRouteMiddleware(async (to) => {
  const user = useSupabaseUser()
  if (!user.value) {
    return navigateTo(`/auth/login?next=${encodeURIComponent(to.fullPath)}`)
  }
  const ok = await checkRole('/api/admin/me')
  if (!ok) {
    return navigateTo('/') // signed in, but not the admin
  }
})
