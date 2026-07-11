export default defineNuxtConfig({
  devtools: { enabled: false },
  ssr: true,
  // Explicit for reliability; Nitro also auto-detects the `VERCEL` env var on its own.
  nitro: {
    preset: process.env.VERCEL ? 'vercel' : undefined,
  },
  modules: ['@nuxtjs/tailwindcss', '@nuxt/fonts'],
  components: [{ path: '~/components', pathPrefix: false }],
  css: ['~/assets/tokens.css', '~/assets/main.css'],
  fonts: {
    families: [
      { name: 'Geist', provider: 'fontsource', global: true },
      { name: 'Geist Mono', provider: 'fontsource', global: true },
    ],
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
