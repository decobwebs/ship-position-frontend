# Frontend — Lagos Port Vessel Intelligence (Nuxt 3)

Mobile-first dashboard + chatbot UI over the read-only backend API.

## Run

```bash
npm install
npm run dev
```

Then open http://localhost:3000. By default it talks to the backend at
`http://127.0.0.1:8078` — override with `NUXT_PUBLIC_API_BASE` (see
`.env.example`).

## Deploy (Vercel)

1. Import this repo in Vercel — the Nuxt framework preset is auto-detected, no
   extra config needed (build command `nuxt build`, output is handled by Nitro's
   Vercel preset automatically).
2. In **Project Settings → Environment Variables**, set:
   - `NUXT_PUBLIC_API_BASE` = your deployed backend URL (e.g. the Render service
     URL, no trailing slash)
3. Deploy. On the backend, set `ALLOWED_ORIGINS` to this Vercel deployment's URL
   so CORS isn't wide open in production.

## Structure

- `pages/` — routes: dashboard (`/`), chatbot (`/ask`), voyage history
  (`/vessel/[name]`)
- `components/` — `ui/` (shared primitives), `dashboard/`, `chat/`, `nav/`,
  `search/`, `vessel/`
- `layouts/default.vue` — app shell: bottom nav (mobile) + persistent chat sheet
- `assets/tokens.css` — design tokens (color, spacing, radius, motion), consumed
  by `tailwind.config.ts`
