# GPT Instructies voor Inspannings Monitor

Datum: `2026-04-18`

Dit document bundelt de inhoudelijke instructies, keuzes en werkafspraken die in
deze context door de gebruiker zijn gegeven. Het is bedoeld als compacte
contextbron voor vervolgwerk naast de formele specificaties en plannen.

## 1. Productrichting en positionering

- Kies bewust de route `wellness/self-management` voor de eerste release.
- Houd expliciet de mogelijkheid open om later een apart `medisch product`-spoor te starten.
- Volg de eerder aanbevolen guardrails voor intended use en non-intended use.
- Houd de MVP weg van medische claims, zorgverlenerrollen en deelscenario's.

## 2. Naam, doelgroep en taal

- Productnaam: `Inspannings Monitor`
- Doelgroep: `volwassenen`
- Voertaal eerste release: `Nederlands`

## 3. Scope voor release 1

- Alleen individuele gebruikers
- Geen delen met zorgverleners
- Geen delen met naasten
- Geen AI in de kern-MVP
- Geen medische workflows in de MVP

## 4. Technische keuzes

- Hosting: `Vercel`
- Database: `Supabase PostgreSQL`
- Authenticatie: `Supabase Auth`
- UI foundation: `Tailwind CSS + shadcn/ui`

## 5. Documentatie-instructies

- Maak nieuwe documentatie voor de gekozen wellness-route.
- Neem de technische implementatielaag uit `v04` mee als aparte laag, niet vermengd met productscope.
- Bouw de documentatieset op als losse, duidelijke artefacten in plaats van één gemengd document.
- Houd documentatie beschikbaar in `.docx`, met ondersteunende Markdown-bestanden in de repository.

## 6. Backlog en projectsturing

- Gebruik `Linear` als backlogtool.
- Werk de documentatie door naar backlog- en importbestanden voor Linear.
- Gebruik de storystructuur (`ST-001`, `ST-101`, `ST-102`, enzovoort) als uitvoeringslijn.

## 7. Implementatiekeuzes die expliciet zijn gevraagd

- Bouw door vanaf `ST-001` met echte code, niet alleen plannen.
- Voeg `Supabase Auth` toe met e-mail/wachtwoord en verplichte verificatie.
- Bouw daarna profiel- en settingsfundering, onboarding en settingsbeheer.
- Verbeter de UI structureel door `shadcn/ui` te gebruiken in plaats van losse knop- en form-styling.

## 8. Repository- en deploykeuzes

- Publiceer het project op GitHub.
- Gebruik repositorynaam `inspannings-monitor`.
- Maak de repository `public`.
- Gebruik voor productie niet de root `jp-visser.nl`, omdat daar al de hoofdsite met cv en projectlinks staat.
- Gebruik als productiedomein: `inspannings-monitor.jp-visser.nl`

## 9. CI/CD-afspraken

- Gebruik `GitHub Actions` voor CI.
- Gebruik `Vercel` voor automatische preview- en production-deployments.
- Gebruik `main` als production branch.
- Bescherm `main` met:
  - pull requests verplicht
  - verplichte check `Lint and build`
  - force pushes geblokkeerd
  - branch deletion geblokkeerd

## 10. Security-afspraken

- Gebruik geen `service_role` key in de frontend-app.
- Gebruik geen admin-key in Vercel voor deze frontend.
- Behandel de eerder gebruikte Supabase `service_role` key als gecompromitteerd.
- Houd lokale env-bestanden buiten git.

## 11. Werkvoorkeuren uit deze context

- Ga praktisch door met de volgende stap als de richting duidelijk is.
- Maak documentatie en implementatie samen voortschrijdend concreet.
- Leg belangrijke keuzes expliciet vast wanneer ze eenmaal zijn besloten.
- Geef voor gebruikersfeedback na redirects of server actions de voorkeur aan een
  centrale toastlaag boven losse inline statusnotices, tenzij een scherm expliciet
  een andere vorm vraagt.

## 12. Korte besluitlog uit deze thread

1. Twee oorspronkelijke documenten zijn beoordeeld en omgezet naar een nieuwe documentatieset.
2. De wellness-route is expliciet gekozen met opengehouden future-medical track.
3. Productnaam is vastgezet op `Inspannings Monitor`.
4. Release 1 is vastgezet op individuele volwassen gebruikers in het Nederlands.
5. De stack is vastgezet op `Vercel + Supabase Auth + Supabase PostgreSQL`.
6. De technische implementatielaag uit `v04` is teruggebracht als apart document.
7. De backlog is uitgewerkt en voorbereid voor `Linear`.
8. De app is opgebouwd via de stories `ST-001`, `ST-101`, `ST-102`, `ST-103` en `ST-104`.
9. De UI is later structureel gemigreerd naar `shadcn/ui`.
10. De repository is publiek gemaakt, gekoppeld aan Vercel en op `inspannings-monitor.jp-visser.nl` gezet.
11. CI/CD en branch protection zijn ingericht rond `main` en `Lint and build`.

## 13. Gerelateerde documenten

- [docs/README.md](/Users/janpetervisser/Development/third/docs/README.md)
- [inspannings-monitor-cicd-en-deploy.md](/Users/janpetervisser/Development/third/docs/inspannings-monitor-cicd-en-deploy.md)
- [inspannings-monitor-dagelijkse-deploy-checklist.md](/Users/janpetervisser/Development/third/docs/inspannings-monitor-dagelijkse-deploy-checklist.md)
- [inspannings-monitor-ops-security-notitie.md](/Users/janpetervisser/Development/third/docs/inspannings-monitor-ops-security-notitie.md)
