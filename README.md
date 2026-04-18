# Inspannings Monitor

Wellness-first webapp voor volwassen individuele gebruikers die hun energie
willen plannen, uitvoeren en evalueren.

## Productrichting

`Inspannings Monitor` wordt bewust gebouwd als `wellness/self-management`
product, niet als medisch hulpmiddel. Release 1 blijft smal:

- alleen individuele gebruikers
- alleen Nederlands
- geen delen met zorgverleners of naasten
- geen AI of medische workflows in de MVP

## Huidige scope

- e-mail/wachtwoord-auth via Supabase
- protected dashboard met server-side sessiecontrole
- ochtendcheck-in voor energiescore en slaapkwaliteit van vandaag
- eenvoudig dagbudget en energieniveau op basis van de ochtendscore
- korte onboardingflow voor eerste voorkeuren
- instellingen voor taal, timezone, reminders en zichtbaarheid van energiepunten
- `shadcn/ui` foundation voor knoppen, formulieren, kaarten en meldingen

## Stack

- Next.js 16 App Router
- React 19
- TypeScript
- Tailwind CSS
- shadcn/ui component foundation
- Vercel als hostingdoel
- Supabase voor database en authenticatie

## Snel lokaal starten

1. Kopieer `.env.example` naar `.env.local`
2. Vul in:
   - `NEXT_PUBLIC_SUPABASE_URL`
   - `NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY`
   - optioneel: `NEXT_PUBLIC_ENABLE_TEST_WIZARD=true` voor de interne wizard-testpagina
3. Installeer dependencies met `npm install`
4. Start lokaal met `npm run dev`

## Scripts

- `npm run dev`
- `npm run build`
- `npm run start`
- `npm run lint`

## Supabase Auth configuratie

1. Zet in Supabase Dashboard aan:
   - Email/password auth
   - Self-signup
   - Email confirmation verplicht
2. Voeg redirect URLs toe voor:
   - `http://localhost:3000/auth/confirm`
   - je Vercel productie-URL
   - eventuele preview-URL's die je wilt testen

## Omgevingsbestanden

Gebruik alleen `.env.example` als template. Lokale bestanden zoals `.env` en
`.env.local` horen niet in git thuis.

## Supabase database migraties

Voor `ST-102` staat de eerste databasefundering in:

- `supabase/migrations/20260418_create_profiles_and_user_settings.sql`

Voer deze SQL uit in de Supabase SQL Editor of via de Supabase CLI voordat je
de profile/settings-laag lokaal test.

## UI foundation

De app gebruikt `shadcn/ui` bovenop `Tailwind CSS` als herbruikbare basis voor
knoppen, formulieren, kaarten en meldingen. De theme tokens staan centraal in
`app/globals.css`, zodat kleur, focus-states en componentgedrag consistenter blijven.
Voor feedback na redirects of server actions krijgt de app nu standaard de voorkeur
voor `sonner`-toasts boven losse inline statusmeldingen.

## Interne wizard-test

Er is een interne testwizard beschikbaar op `/wizard-test` om een toekomstige
generieke wizard-core te valideren. Deze route en de dashboardknop worden alleen
zichtbaar als `NEXT_PUBLIC_ENABLE_TEST_WIZARD=true` staat.

## CI/CD

- `CI`: GitHub Actions draait automatisch `lint` en `build` op pull requests en op `main`
- `CD`: Vercel deployt automatisch previews voor branches/PR's en productie vanaf `main`
- Uitwerking: [docs/inspannings-monitor-cicd-en-deploy.md](/Users/janpetervisser/Development/third/docs/inspannings-monitor-cicd-en-deploy.md)

## Documentatie

- Hoofdset specificaties en plannen: [docs/README.md](/Users/janpetervisser/Development/third/docs/README.md)
- Technische architectuur: [inspannings-monitor-05-technische-architectuur-en-implementatie-v01.docx](/Users/janpetervisser/Development/third/docs/inspannings-monitor-05-technische-architectuur-en-implementatie-v01.docx)
- Implementatieplan en backlog: [inspannings-monitor-06-implementatieplan-en-backlog-v01.docx](/Users/janpetervisser/Development/third/docs/inspannings-monitor-06-implementatieplan-en-backlog-v01.docx)

## Eerstvolgende bouwstappen

1. `ST-203` Budgetlogica implementeren
2. `ST-301` Activiteitenmodel en planning opzetten
3. `ST-401` Evaluatie- en dagoverzichtslus bouwen
4. `ST-105` RLS-policy tests en hardening afronden
