# Inspannings Monitor Documentatieset

Deze map bevat de vernieuwde documentatie voor de gekozen `wellness/self-management` route van `Inspannings Monitor`, met een expliciet opengehouden pad naar een latere medische producttrack.

## Huidige leidende documenten

- [inspannings-monitor-01-productkader-en-positionering-v06.docx](./inspannings-monitor-01-productkader-en-positionering-v06.docx)
  Legt intended use, non-intended use, scope, doelgroep en claim-guardrails vast.

- [inspannings-monitor-02-functionele-specificatie-mvp-v06.docx](./inspannings-monitor-02-functionele-specificatie-mvp-v06.docx)
  Beschrijft de wellness-first MVP in toetsbare functionele requirements.

- [inspannings-monitor-03-privacy-security-safety-baseline-v02.docx](./inspannings-monitor-03-privacy-security-safety-baseline-v02.docx)
  Bundelt de minimale randvoorwaarden voor privacy, informatiebeveiliging en productveiligheid.

- [inspannings-monitor-04-roadmap-wellness-naar-medisch-v02.docx](./inspannings-monitor-04-roadmap-wellness-naar-medisch-v02.docx)
  Laat zien hoe het product gecontroleerd kan doorgroeien zonder ongemerkt medische scope binnen te trekken.

- [inspannings-monitor-05-technische-architectuur-en-implementatie-v01.docx](./inspannings-monitor-05-technische-architectuur-en-implementatie-v01.docx)
  Brengt de technische implementatielaag uit de oude specificatie terug als apart architectuurdocument voor de wellness-first MVP.

- [inspannings-monitor-06-implementatieplan-en-backlog-v01.docx](./inspannings-monitor-06-implementatieplan-en-backlog-v01.docx)
  Zet de documentatieset om naar een uitvoerbare backlog met epics, stories, afhankelijkheden en releasevolgorde.

## Bevestigde uitgangspunten

- Productnaam: `Inspannings Monitor`
- Positionering eerste release: `wellness/self-management`
- Release 1: alleen individuele gebruikers
- Doelgroep: `volwassenen`
- Voertaal eerste release: `Nederlands`
- Hosting: `Vercel`
- Database: `Supabase PostgreSQL`
- Authenticatie: `Supabase Auth`
- UI foundation in de app: `Tailwind CSS + shadcn/ui`

## Actuele app-status

- `ST-201` t/m `ST-203` zijn in de code gerealiseerd
- Ochtendcheck-in slaat nu energiescore en slaapkwaliteit per dag op
- Dagbudget v1 is bewust eenvoudig: `daily_budget = energy_score`
- Energieniveau en budget worden al direct getoond in check-in en dashboard
- Eerste unit tests voor budgetmapping draaien via `Vitest`

## Generator

- [generate_inspannings_monitor_docs.py](./generate_inspannings_monitor_docs.py)
  Genereert de actuele `.docx`-documenten opnieuw vanuit de bevestigde uitgangspunten.
  Vereist een Python-omgeving met `python-docx`.

## Deploy en CI/CD

- [inspannings-monitor-cicd-en-deploy.md](./inspannings-monitor-cicd-en-deploy.md)
  Beschrijft de gekozen CI/CD-opzet met GitHub Actions voor verificatie en Vercel voor automatische preview- en production-deploys.
- [inspannings-monitor-dagelijkse-deploy-checklist.md](./inspannings-monitor-dagelijkse-deploy-checklist.md)
  Korte operationele checklist voor de normale flow van feature branch naar productie.
- [inspannings-monitor-ops-security-notitie.md](./inspannings-monitor-ops-security-notitie.md)
  Legt de actuele operationele en security-keuzes vast rond repositorybescherming, Vercel-deploys en secretbeheer.
- [gpt-instructies.md](./gpt-instructies.md)
  Bundelt de inhoudelijke instructies en expliciete keuzes die in deze context zijn gegeven als compacte bron voor vervolgwerk.

## Backlog en Linear

- [backlog/inspannings-monitor-backlog.md](./backlog/inspannings-monitor-backlog.md)
- [backlog/inspannings-monitor-backlog.csv](./backlog/inspannings-monitor-backlog.csv)
- [backlog/inspannings-monitor-linear-setup.md](./backlog/inspannings-monitor-linear-setup.md)
- [backlog/inspannings-monitor-linear-import-checklist.md](./backlog/inspannings-monitor-linear-import-checklist.md)
- [backlog/inspannings-monitor-linear-projects.md](./backlog/inspannings-monitor-linear-projects.md)
- [backlog/inspannings-monitor-linear-eerste-30-minuten.md](./backlog/inspannings-monitor-linear-eerste-30-minuten.md)
- [backlog/generate_linear_backlog_assets.py](./backlog/generate_linear_backlog_assets.py)

## Oudere documenten

De eerdere `EnergyPace`-documenten in deze map zijn niet leidend meer. De `Inspannings Monitor`-documenten hierboven zijn de actuele basis.
