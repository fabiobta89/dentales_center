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

## Color Theme

CSS custom properties defined in `src/styles/globals.css`:
- `--color-gold` (primary), `--color-gold-dark`, `--color-gold-light`, `--color-gold-extralight`
- Background: warm off-white (`rgba(250, 247, 245, 1)`)

## Key Patterns

- Functional components with React hooks (no external state management)
- No authentication or database — chat data is local mock state
- No backend integration beyond the example API route at `src/pages/api/hello.js`
- Images stored in `src/images/` and served via `next/image`
