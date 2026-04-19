# Inspannings Monitor Ops en Security Notitie

Datum: `2026-04-18`

Deze notitie legt de actuele operationele en security-besluiten vast rond
repositorybeheer, deployment en secrets.

## 1. Huidige operationele status

- GitHub-repository: `public`
- Standaardbranch: `main`
- CI: GitHub Actions workflow `CI`
- Verplichte status check op `main`: `Lint and build`
- Productiehosting: `Vercel`
- Productiedomein: [inspannings-monitor.jp-visser.nl](https://inspannings-monitor.jp-visser.nl)

## 2. Branch protection

De branch `main` is beschermd met:

- pull requests verplicht
- required status check `Lint and build`
- force pushes geblokkeerd
- branch deletion geblokkeerd

Bewuste huidige keuze:

- `Require branches to be up to date before merging` staat niet verplicht aan

Dat is voor de huidige projectfase acceptabel en houdt de flow eenvoudig.

## 3. Vercel en deploymentbeleid

De gekozen deployroute is:

- feature branches en pull requests krijgen preview deployments via Vercel
- merges naar `main` geven een automatische production deployment

Voor deze frontend-app worden in Vercel alleen publieke Supabase-variabelen gebruikt:

- `NEXT_PUBLIC_SUPABASE_URL`
- `NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY`

Er hoort geen `service_role` of andere admin-key in Vercel te staan.

## 4. Secret-incident en respons

Tijdens de setupfase heeft lokaal een Supabase `service_role` key in een
omgevingsbestand gestaan en daarmee tijdelijk in git-tracking gezeten.

Reeds genomen maatregelen:

- `.env` en `.env.local` zijn uit git-tracking gehaald
- `.gitignore` is aangescherpt zodat lokale env-bestanden niet opnieuw meegaan
- de applicatiecode gebruikt geen `service_role` key
- de frontend gebruikt alleen de publishable key
- in het Supabase-dashboard stond de legacy JWT-keysectie op het moment van controle uitgeschakeld

## 5. Resterende security-aandachtspunten

Deze punten zijn nog belangrijk, ook als de app nu functioneel goed draait:

1. Behandel de eerder gebruikte `service_role` key als gecompromitteerd.
2. Gebruik die key nergens meer opnieuw.
3. Gebruik voor toekomstige server/admin-taken alleen een nieuwe secret-key als dat echt nodig is.
4. Overweeg de oude secret ook uit de Git-history te verwijderen als je de repositoryhistorie volledig wilt opschonen.

## 6. Praktische beheerafspraken

- secrets nooit in de repository opslaan
- `.env.example` alleen als template gebruiken
- deploys alleen via GitHub + Vercel laten lopen
- wijzigingen naar productie via pull request en `main`
- production altijd kort valideren na merge

## 7. Relevante documenten

- [inspannings-monitor-cicd-en-deploy.md](/Users/janpetervisser/Development/third/docs/inspannings-monitor-cicd-en-deploy.md)
- [inspannings-monitor-dagelijkse-deploy-checklist.md](/Users/janpetervisser/Development/third/docs/inspannings-monitor-dagelijkse-deploy-checklist.md)
- [README.md](/Users/janpetervisser/Development/third/README.md)
