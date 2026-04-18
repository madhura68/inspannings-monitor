# Inspannings Monitor CI/CD en Deploy

Deze repository gebruikt een eenvoudige en robuuste combinatie:

- `CI` via GitHub Actions
- `CD` via de Git-integratie van Vercel

Dat betekent:

- iedere pull request draait automatisch `lint` en `build`
- iedere push naar `main` draait opnieuw `lint` en `build`
- Vercel maakt automatisch preview deployments voor branches en PR's
- Vercel maakt automatisch een production deployment zodra `main` wordt bijgewerkt

## CI

Workflowbestand:

- [.github/workflows/ci.yml](/Users/janpetervisser/Development/third/.github/workflows/ci.yml)

Wat de workflow doet:

1. checkout van de repository
2. Node.js instellen op basis van [.nvmrc](/Users/janpetervisser/Development/third/.nvmrc)
3. `npm ci`
4. `npm run lint`
5. `npm run build`

Omdat de build alleen publieke Supabase-variabelen nodig heeft, gebruikt de workflow
veilige placeholderwaarden voor:

- `NEXT_PUBLIC_SUPABASE_URL`
- `NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY`

## CD via Vercel

De aanbevolen deployroute voor dit project is de standaard Git-integratie van Vercel.
Volgens de actuele Vercel-documentatie levert dat automatisch:

- preview deployments voor branch pushes en pull requests
- production deployments voor de production branch, meestal `main`

Bronnen:

- [Vercel: Deploying Git Repositories](https://vercel.com/docs/deployments/git)
- [Vercel: Deploying & Redirecting Domains](https://vercel.com/docs/domains/working-with-domains/deploying-and-redirecting)

## Benodigde instellingen in Vercel

Zet in het Vercel-project minimaal deze environment variables:

- `NEXT_PUBLIC_SUPABASE_URL`
- `NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY`

Voor deze frontend-app hoort geen `service_role` of andere admin-key in Vercel te staan.

Aanbevolen omgevingstoewijzing:

- `Preview`
- `Production`

## Benodigde instellingen in Supabase

In `Authentication -> URL Configuration`:

- `Site URL`: `https://inspannings-monitor.jp-visser.nl`
- `Redirect URLs`:
  - `http://localhost:3000/**`
  - `https://inspannings-monitor.jp-visser.nl/auth/confirm`
  - optioneel preview: `https://*-<jouw-vercel-slug>.vercel.app/**`

Bron:

- [Supabase: Redirect URLs](https://supabase.com/docs/guides/auth/redirect-urls)

## Aanbevolen branchbeleid

Voor een nette releaseflow:

1. werk op feature branches
2. open een pull request naar `main`
3. wacht tot GitHub Actions groen is
4. controleer de Vercel preview deployment
5. merge naar `main`
6. laat Vercel automatisch production deployen

## Aanbevolen GitHub branch protection

Zet voor `main` bij voorkeur aan:

- require pull request before merging
- require status checks to pass before merging
- kies als verplichte check: `Lint and build`

## Domein

Voor productie gebruiken we:

- `inspannings-monitor.jp-visser.nl`

De root `jp-visser.nl` blijft daarmee vrij voor je bestaande hoofdsite.
