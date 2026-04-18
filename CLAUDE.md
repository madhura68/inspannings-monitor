# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project Overview

**Inspannings Monitor** — a Dutch-language wellness web app for energy planning, daily check-ins, reflection, and self-evaluation. UI and all user-facing text are in Dutch (nl-NL). Release 1 targets individuals only; no sharing, AI features, or medical claims.

## Commands

```bash
npm run dev       # Start dev server (localhost:3000)
npm run build     # Production build
npm run lint      # ESLint
```

No test framework is configured yet.

Node version: `20.9.0` (see `.nvmrc`).

## Environment Setup

Copy `.env.example` to `.env.local` and fill in your Supabase project values:

```
NEXT_PUBLIC_SUPABASE_URL=
NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY=
```

Supabase project must have email/password auth enabled with email confirmation. Apply migrations from `supabase/migrations/` to your local/remote DB.

## Architecture

**Stack:** Next.js (App Router) + React 19 + TypeScript + Supabase (Auth + PostgreSQL) + shadcn/ui + Tailwind CSS. Deployed on Vercel.

### Route structure

| Route | Purpose |
|---|---|
| `/` | Public landing page |
| `/login`, `/sign-up` | Auth pages |
| `/auth/confirm` | Email confirmation callback |
| `/onboarding` | Mandatory first-time setup |
| `/dashboard` | Main protected page |
| `/settings` | User preferences |

### Auth & data flow

- `lib/auth/` — `getAuthState()` validates the session server-side from SSR cookies. All protected routes call this and redirect unauthenticated users to `/login`.
- New users are redirected to `/onboarding`; dashboard redirects there if onboarding is incomplete.
- On first protected page load, `profiles` and `user_settings` rows are auto-created with defaults if missing.
- Server Actions (`app/**/actions.ts`) handle form mutations; client components call these directly.

### Database

Two tables with Row Level Security (users see only their own rows):

- **`profiles`** — display name, locale, timezone, onboarding completion flags
- **`user_settings`** — reminder preferences, energy point visibility

Migrations live in `supabase/migrations/`.

### Key lib modules

- `lib/supabase/` — Supabase client setup (server-side SSR client + proxy config)
- `lib/auth/` — session helpers, navigation utilities, Dutch error messages
- `lib/profile/service.ts` — CRUD for profiles and user_settings
- `lib/profile/types.ts` — shared TypeScript types for profile/settings data
- `lib/onboarding/` — onboarding options and timezone lists

### UI components

`components/ui/` contains shadcn/ui primitives (button, card, input, select, alert, etc.). Feature-level components live in `components/auth/`, `components/onboarding/`, and `components/settings/`. Path alias `@/*` resolves from the repo root.

## CI/CD

GitHub Actions (`.github/workflows/ci.yml`) runs lint + build on every PR and push to `main`. Vercel auto-deploys previews on branches and production on `main`. Production domain: `inspannings-monitor.jp-visser.nl`.

## Planned next work

From the backlog (tracked in Linear):
- **ST-201** — Morning check-in feature
- **ST-203** — Energy budget logic
- **ST-301** — Activities data model
