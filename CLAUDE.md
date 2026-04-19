# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project Overview

**Inspannings Monitor** — a Dutch-language wellness web app for energy planning, daily check-ins, reflection, and self-evaluation. UI and all user-facing text are in Dutch (nl-NL). Release 1 targets individuals only; no sharing, AI features, or medical claims.

## Commands

```bash
npm run dev       # Start dev server (localhost:3000)
npm run build     # Production build --webpack (rolldown disabled)
npm run lint      # ESLint
npm run test      # Vitest (unit tests only)
```

Node version: `>=20.19.0` (see `.nvmrc` / `engines` in package.json).

## Environment Setup

Copy `.env.example` to `.env.local`:

```
NEXT_PUBLIC_SUPABASE_URL=
NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY=
NEXT_PUBLIC_ENABLE_TEST_WIZARD=true   # optional: enables /wizard-test route
```

Supabase project must have email/password auth enabled with email confirmation. Apply migrations from `supabase/migrations/` to your local/remote DB.

## Architecture

**Stack:** Next.js 16 (App Router) + React 19 + TypeScript + Supabase (Auth + PostgreSQL) + shadcn/ui + Tailwind CSS. Deployed on Vercel.

### Route structure

| Route | Purpose |
|---|---|
| `/` | Public landing page |
| `/login`, `/sign-up` | Auth pages |
| `/auth/confirm` | Email confirmation callback |
| `/onboarding` | Mandatory first-time setup |
| `/dashboard` | Main protected page |
| `/planning` | Daily activity planning |
| `/check-in` | Morning check-in flow |
| `/settings` | User preferences |
| `/wizard-test` | Internal wizard UI test (feature-flagged) |

### Auth & data flow

- `lib/auth/session.ts` — `getAuthState()` validates the session server-side from SSR cookies. All protected pages call this and redirect unauthenticated users to `/login`.
- New users are redirected to `/onboarding`; the dashboard redirects there if onboarding is incomplete.
- On first protected page load, `profiles` and `user_settings` rows are auto-created with defaults if missing (`lib/profile/service.ts`).
- Server Actions (`app/**/actions.ts`) handle all form mutations; client components call these directly.
- Status feedback after redirects flows via `?status=<key>` search params → `lib/feedback/status-messages.ts` → `StatusToastBridge` component (Sonner toasts).

### Energy model

The core domain logic lives in `lib/check-in/` and `lib/planning/`:

- **Morning check-in** (`lib/check-in/`) — user scores energy 1–10 and sleep quality. `budget.ts` derives `energyLevel` and `dailyBudget` (budget = score, formula versioned via `BUDGET_FORMULA_VERSION`).
- **Activity energy points** (`lib/planning/meter.ts`) — each activity scores points from duration band (1–4) × impact adjustment. The planning meter tracks `actualPoints` vs `dailyBudget`.
- **Day overview** (`lib/planning/day-overview.ts`) — aggregates activity counts and planned vs actual points for dashboard display.
- **Activity statuses**: `planned` → `completed` / `adjusted` / `skipped`. Ad-hoc activities can be added directly.

### Database

Tables with Row Level Security (users see only their own rows):

- **`profiles`** — display name, locale, timezone, avatar, onboarding flags
- **`user_settings`** — reminder preferences, energy point visibility
- **`morning_check_ins`** — per-day energy score, sleep quality, derived budget/level
- **`activities`** — daily activity records with status, duration, impact, priority, category
- **`activity_categories`** / **`skip_reasons`** — reference data (seeded)

Migrations live in `supabase/migrations/`.

### Key lib modules

- `lib/supabase/` — Supabase client setup (server-side SSR client + proxy config)
- `lib/auth/` — session helpers, navigation utilities, Dutch error messages
- `lib/profile/service.ts` — CRUD for profiles and user_settings
- `lib/profile/types.ts` — shared TypeScript types
- `lib/forms/parse.ts` — typed FormData helpers (`getRequiredString`, `getEnumValue`, `getIntegerValue`, etc.) used in all Server Actions; throws `FormDataValidationError` with an error code string
- `lib/feedback/status-messages.ts` — maps `?status=` param keys to `StatusToast` objects
- `lib/wizard/` — generic multi-step wizard primitives (`WizardStepDefinition`, `useWizardFlow` hook); used by onboarding and check-in flows
- `lib/search-params.ts` — `getParamValue()` helper for server page `searchParams`
- `lib/config/feature-flags.ts` — `isTestWizardEnabled()` reads `NEXT_PUBLIC_ENABLE_TEST_WIZARD`

### UI components

`components/ui/` contains shadcn/ui primitives. Feature-level components live in `components/auth/`, `components/check-in/`, `components/planning/`, `components/onboarding/`, `components/settings/`, `components/wizard/`, `components/navigation/`, `components/feedback/`, and `components/profile/`. Path alias `@/*` resolves from the repo root.

The app uses the **Dusk theme** — dark-mode-first, semantic surface tokens, enhanced focus/a11y styles (`app/globals.css`).

### Seeding

```bash
npm run seed:demo-users   # seeds demo personas via scripts/seed-demo-users.mjs
```

## CI/CD

GitHub Actions (`.github/workflows/ci.yml`) runs lint + build on every PR and push to `main`. Vercel auto-deploys previews on branches and production on `main`. Production domain: `inspannings-monitor.jp-visser.nl`.

## Planned next work

From the backlog (tracked in Linear):
- **ST-201** — Morning check-in feature
- **ST-203** — Energy budget logic
- **ST-301** — Activities data model
