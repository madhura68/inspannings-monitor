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
- dashboardweergave van check-instatus, energieniveau en dagbudget
- planningsfundering met activiteitenmodel, categorieën en skip-redenen in Supabase
- planningpagina voor vandaag met activiteit toevoegen en directe lijstweergave
- statusflows voor activiteiten van vandaag (`gepland`, `uitgevoerd`, `overgeslagen`, `aangepast`)
- contextuele evaluatievelden voor overgeslagen en aangepaste activiteiten
- dagoverzicht op planning met gepland versus werkelijk en statusverdeling
- autocomplete op basis van eerdere eigen activiteiten voor sneller hergebruik in planning
- energiemeter met lopend totaal ten opzichte van het dagbudget
- niet-blokkerende waarschuwing bij budgetoverschrijding in planning en dashboard
- eerste unit tests voor budget- en meterlogica via `Vitest`
- korte onboardingflow voor eerste voorkeuren
- instellingen voor profieltekst, avatar, taal, timezone, reminders en zichtbaarheid van energiepunten
- `shadcn/ui` foundation voor knoppen, formulieren, kaarten en meldingen
- `Dusk`-theme met dark-mode prioriteit, semantische oppervlakken en verbeterde focus-/toegankelijkheidsstijlen

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
- `npm run test`

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

De huidige app gebruikt onder meer deze migraties:

- `supabase/migrations/20260418_create_profiles_and_user_settings.sql`
- `supabase/migrations/20260418_add_onboarding_seen_to_profiles.sql`
- `supabase/migrations/20260418_create_morning_check_ins.sql`
- `supabase/migrations/20260418_add_budget_fields_to_morning_check_ins.sql`
- `supabase/migrations/20260419_create_activities_and_reference_data.sql`
- `supabase/migrations/20260419_add_profile_details_and_avatar_storage.sql`

Voer deze SQL uit in de Supabase SQL Editor of via de Supabase CLI voordat je
de profile-, check-in- en budgetlagen lokaal test.

## UI foundation

De app gebruikt `shadcn/ui` bovenop `Tailwind CSS` als herbruikbare basis voor
knoppen, formulieren, kaarten en meldingen. De theme tokens staan centraal in
`app/globals.css`, zodat kleur, focus-states en componentgedrag consistenter blijven.
Voor feedback na redirects of server actions krijgt de app nu standaard de voorkeur
voor `sonner`-toasts boven losse inline statusmeldingen.

De actuele visuele richting is `Dusk`: warme paper-achtergronden, gedempte indigo
als primaire kleur, dark mode als standaard en semantische `success`/`warning`
tokens voor rustige, niet-medische feedback.

## Navigatie

De app gebruikt nu een gedeelde topnavigatie:

- links: `About`, `Dashboard`, `Planning`, `Check-in`
- rechts: `Account` en `Theme`

`/` is de publieke `About`-pagina met informatie over de maker en de scope van
de app. In het `Account`-menu komen ingelogde gebruikers bij `Instellingen` en
`Uitloggen`; uitgelogde gebruikers zien daar `Inloggen` en `Account aanmaken`.

## Interne wizard-test

Er is een interne testwizard beschikbaar op `/wizard-test` om een toekomstige
generieke wizard-core te valideren. Deze route en de dashboardknop worden alleen
zichtbaar als `NEXT_PUBLIC_ENABLE_TEST_WIZARD=true` staat.

## CI/CD

- `CI`: GitHub Actions draait automatisch `lint`, `test` en `build` op pull requests en op `main`
- `CD`: Vercel deployt automatisch previews voor branches/PR's en productie vanaf `main`
- Uitwerking: [docs/inspannings-monitor-cicd-en-deploy.md](/Users/janpetervisser/Development/third/docs/inspannings-monitor-cicd-en-deploy.md)

## Documentatie

- Hoofdset specificaties en plannen: [docs/README.md](/Users/janpetervisser/Development/third/docs/README.md)
- Dusk theme-specificatie: [inspannings-monitor-09-dusk-theme-specificatie-v01.md](/Users/janpetervisser/Development/third/docs/inspannings-monitor-09-dusk-theme-specificatie-v01.md)
- Technische architectuur: [inspannings-monitor-05-technische-architectuur-en-implementatie-v01.docx](/Users/janpetervisser/Development/third/docs/inspannings-monitor-05-technische-architectuur-en-implementatie-v01.docx)
- Implementatieplan en backlog: [inspannings-monitor-06-implementatieplan-en-backlog-v01.docx](/Users/janpetervisser/Development/third/docs/inspannings-monitor-06-implementatieplan-en-backlog-v01.docx)

## Eerstvolgende bouwstappen

1. `ST-105` RLS-policy tests en hardening afronden
2. logging en monitoring toevoegen
3. rate limiting op kritieke mutaties
