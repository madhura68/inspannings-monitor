# Inspannings Monitor

Wellness-first webapp voor individuele gebruikers die hun energie willen plannen, uitvoeren en evalueren.

## Stack

- Next.js 16 App Router
- React 19
- TypeScript
- Tailwind CSS
- Vercel als hostingdoel
- Supabase voor database en authenticatie

## Scripts

- `npm run dev`
- `npm run build`
- `npm run start`
- `npm run lint`

## Supabase Auth configuratie

1. Kopieer `.env.example` naar `.env.local`
2. Vul in:
   - `NEXT_PUBLIC_SUPABASE_URL`
   - `NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY`
3. Zet in Supabase Dashboard aan:
   - Email/password auth
   - Self-signup
   - Email confirmation verplicht
4. Voeg redirect URLs toe voor:
   - `http://localhost:3000/auth/confirm`
   - je Vercel productie-URL
   - eventuele preview-URL's die je wilt testen

## Supabase database migraties

Voor `ST-102` staat de eerste databasefundering in:

- `supabase/migrations/20260418_create_profiles_and_user_settings.sql`

Voer deze SQL uit in de Supabase SQL Editor of via de Supabase CLI voordat je
de profile/settings-laag lokaal test.

## Eerstvolgende bouwstappen

1. `ST-201` Ochtendcheck-in UI bouwen
2. `ST-203` Budgetlogica implementeren
3. `ST-301` Activiteitenmodel en planning opzetten
4. `ST-105` RLS-policy tests en hardening afronden
