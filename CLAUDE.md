# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project Overview

Dental clinic marketing and management website built with Next.js 15 (Pages Router) + React 19, styled with Tailwind CSS v4.

## Commands

```bash
npm run dev      # Dev server with Turbopack
npm run build    # Production build
npm run start    # Start production server
npm run lint     # ESLint with next/core-web-vitals
```

No test framework is configured.

## Architecture

- **Routing**: Next.js Pages Router (`src/pages/`), not App Router
- **Styling**: Tailwind CSS v4 via `@tailwindcss/postcss` plugin, plus custom CSS in `src/styles/base.css`
- **Forms**: Formik + Yup for form state and validation
- **Path alias**: `@/*` maps to `src/*` (configured in `jsconfig.json`)
- **Fonts**: Inter loaded via `next/font/google` in `_app.js`
- **i18n**: Custom context in `src/context/LanguageContext.js` — reads/persists locale to localStorage, defaults to Spanish. Translation keys in `src/locales/en.json` and `src/locales/es.json`. Use `useLanguage()` hook for `t()`, `locale`, `toggleLanguage()`.
- **Auth**: Supabase auth wrapped in `src/context/AuthContext.js` — provides `user`, `loading`, `signOut()`. Browser client via `src/lib/supabase.js`, server client via `src/lib/supabase-server.js`.

## Color Theme

CSS custom properties defined in `src/styles/globals.css`:
- `--color-gold` (primary), `--color-gold-dark`, `--color-gold-light`, `--color-gold-extralight`
- Background: warm off-white (`rgba(250, 247, 245, 1)`)

## Backend Integrations

### Supabase
- `appointments` table: `id, name, email, phone, message, date, time, status, created_at`
- Status values: `pending | confirmed | completed | cancelled | no_show`
- Env vars: `NEXT_PUBLIC_SUPABASE_URL`, `NEXT_PUBLIC_SUPABASE_ANON_KEY`, `SUPABASE_SERVICE_ROLE_KEY`

### Dentalink API
- Fetches real-time slot availability from external dental clinic software
- Called server-side in `src/pages/api/availability.js`, chunked in 14-day ranges
- Results filtered to slots where all chairs (sillones) are free
- Env vars: `DENTALINK_URL`, `DENTALINK_TOKEN`, `DENTALINK_SUCURSAL_ID`, `DENTALINK_DENTISTA_ID`, `DENTALINK_DURACION`

## Key Patterns

- App is wrapped in `LanguageProvider` then `AuthProvider` in `_app.js`
- `src/pages/index.js` is a single-page marketing site; anchor links (`#servicios`, `#nosotros`, etc.) scroll to sections with offsets defined in `base.css`
- `AppointmentForm` is dynamically imported (SSR disabled) — 3-step: customer info → date/time picker → confirmation
- Date/time availability is fetched via `src/lib/availability.js` → `GET /api/availability?month=YYYY-MM`
- Admin panel at `/admin/appointments` requires Supabase auth; redirects to `/admin/login` if unauthenticated
- Images in `src/images/` served via `next/image`
