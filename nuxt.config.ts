export default defineNuxtConfig({
  devtools: { enabled: false },
  ssr: true,
  // Explicit for reliability; Nitro also auto-detects the `VERCEL` env var on its own.
  nitro: {
    preset: process.env.VERCEL ? 'vercel' : undefined,
  },
  modules: ['@nuxtjs/tailwindcss', '@nuxt/fonts', '@nuxtjs/supabase'],
  components: [{ path: '~/components', pathPrefix: false }],
  css: ['~/assets/tokens.css', '~/assets/main.css'],
  fonts: {
    families: [
      { name: 'Geist', provider: 'fontsource', global: true },
      { name: 'Geist Mono', provider: 'fontsource', global: true },
    ],
  },
  // redirect: false — we gate individual pages ourselves via middleware/{auth,admin,expert}.ts.
  // The module's own global-redirect behaviour would fight that (the dashboard and chat
  // stay open to anonymous visitors by design; only /account, /chats, /expert, /admin gate).
  supabase: {
    redirect: false,
    url: process.env.NUXT_PUBLIC_SUPABASE_URL,
    key: process.env.NUXT_PUBLIC_SUPABASE_ANON_KEY,
    types: false, // we only use supabase-js for Auth, never its typed table client
  },
  runtimeConfig: {
    public: {
      // Override with NUXT_PUBLIC_API_BASE in production.
      apiBase: process.env.NUXT_PUBLIC_API_BASE || 'http://127.0.0.1:8078',
    },
  },
  app: {
    head: {
      title: 'Lagos Port Vessel Intelligence',
      meta: [
        { name: 'viewport', content: 'width=device-width, initial-scale=1' },
        { name: 'description', content: 'Daily NPA shipping position for Lagos ports.' },
      ],
    },
    pageTransition: { name: 'page', mode: 'out-in' },
    layoutTransition: { name: 'layout', mode: 'out-in' },
  },
})
