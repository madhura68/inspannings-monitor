# Inspannings Monitor Backlog

Dit bestand zet de huidige documentatieset om naar een concrete development backlog voor `release 1`.

## Uitgangspunten

- Productnaam: `Inspannings Monitor`
- Positionering: `wellness/self-management`
- Release 1: alleen individuele gebruikers
- Doelgroep: volwassenen
- Voertaal release 1: Nederlands
- Stack: `Vercel + Supabase Auth + Supabase PostgreSQL`
- Buiten scope release 1: sharing, AI, PDF-export, medische claims, habit-tracking buiten slaapkwaliteit

## Aanbevolen bouwvolgorde

1. Fundament en projectopzet
2. Authenticatie, profiel en instellingen
3. Ochtendcheck-in en budgetlogica
4. Activiteiten plannen
5. Activiteiten evalueren en dagoverzicht
6. Weekoverzicht en inzichten
7. Reflectieprompts en geplande taken
8. Privacy, security, logging en launch-readiness

## Epic-overzicht

| Epic | Titel | Prioriteit | Afhankelijk van | Doel |
| --- | --- | --- | --- | --- |
| EPIC-01 | Fundament | P0 | - | Projectbasis, omgevingen en design foundation neerzetten |
| EPIC-02 | Auth en profiel | P0 | EPIC-01 | Inloggen, sessies, profiel en basisinstellingen |
| EPIC-03 | Ochtendcheck-in | P0 | EPIC-02 | Energiescore, slaapkwaliteit en dagbudget |
| EPIC-04 | Dagplanning | P0 | EPIC-03 | Activiteiten plannen en budgetfeedback tonen |
| EPIC-05 | Evaluatie en dagoverzicht | P0 | EPIC-04 | Activiteiten afronden en dagresultaat tonen |
| EPIC-06 | Weekoverzicht en inzichten | P1 | EPIC-05 | Weekpatronen en veilige insightregels |
| EPIC-07 | Reflectie en reminders | P1 | EPIC-05 | Optionele T+1/T+2 follow-up |
| EPIC-08 | Security en operations | P0 | EPIC-01 t/m EPIC-07 | Logging, hardening, back-up en policy-tests |
| EPIC-09 | Launch-readiness | P0 | EPIC-01 t/m EPIC-08 | QA, copy review, DPIA-input en go-live checks |

## EPIC-01 Fundament

Doel: een stabiele technische basis waarop alle kernflows kunnen landen.

| Story ID | Titel | Type | Definition of done |
| --- | --- | --- | --- |
| ST-001 | Next.js projectbasis opzetten | Build | Project start lokaal en in preview zonder handmatige workarounds |
| ST-002 | Omgevingen definiëren | Ops | Development, preview en production zijn technisch ingericht |
| ST-003 | Component foundation neerzetten | UI | Herbruikbare basiscomponenten zijn mobiel bruikbaar |
| ST-004 | Foutafhandeling en lege staten ontwerpen | UX | Gebruiker krijgt bruikbare feedback bij lege of foutieve situaties |

## EPIC-02 Auth en profiel

Doel: iedere gebruiker kan veilig een eigen account en basisinstellingen beheren.

| Story ID | Titel | Type | Definition of done |
| --- | --- | --- | --- |
| ST-101 | Supabase Auth integreren | Build | Gebruiker kan inloggen en beveiligde routes gebruiken |
| ST-102 | Profile- en UserSettings-model implementeren | Build | Profiel en instellingen zijn per gebruiker beschikbaar |
| ST-103 | Onboardingflow bouwen | UX | Nieuwe gebruiker begrijpt schaal, positionering en basisinstellingen |
| ST-104 | Settingsscherm bouwen | Build | Taal, timezone, reminders en zichtbaarheid van punten zijn persistent |
| ST-105 | RLS-basispolicies inrichten | Security | Gebruiker kan uitsluitend eigen profiel en settings lezen of wijzigen |

## EPIC-03 Ochtendcheck-in

Doel: de gebruiker kan met minimale inspanning de dag starten en een budget krijgen.

Status: `ST-201`, `ST-202`, `ST-203`, `ST-204` en `ST-205` zijn inmiddels gerealiseerd in de app. De volgende logische stap ligt nu in `EPIC-04 Dagplanning`.

| Story ID | Titel | Type | Definition of done |
| --- | --- | --- | --- |
| ST-201 | EnergySlider en SleepQualityInput bouwen | UI | Afgerond: check-in kan mobiel comfortabel worden ingevuld |
| ST-202 | Server action voor createMorningCheckIn | Build | Afgerond: check-in wordt opgeslagen met juiste validatie |
| ST-203 | Budgetlogica implementeren | Logic | Afgerond: score mapping en budgetberekening zijn consistent en testbaar |
| ST-204 | Check-instatus op dashboard tonen | UI | Afgerond: gebruiker ziet direct score, niveau en budget |
| ST-205 | Unit tests voor score- en budgetmapping | QA | Afgerond: belangrijkste grenswaarden zijn afgedekt |

## EPIC-04 Dagplanning

Doel: de gebruiker kan activiteiten voor de dag plannen binnen een eenvoudig energiemodel.

Status: `ST-301`, `ST-302`, `ST-304` en `ST-305` zijn inmiddels gerealiseerd in de app. De volgende logische stap ligt nu in `ST-303` en `EPIC-05`.

| Story ID | Titel | Type | Definition of done |
| --- | --- | --- | --- |
| ST-301 | Datamodel voor activiteiten implementeren | Build | Afgerond: migraties en seed-data voor categorieën en skip-redenen zijn aanwezig |
| ST-302 | Planningformulier bouwen | UI | Afgerond: activiteit kan met naam, categorie, duur, impact en prioriteit worden aangemaakt |
| ST-303 | Autocomplete op eerdere activiteiten toevoegen | UX | Veelgebruikte activiteiten zijn snel opnieuw te kiezen |
| ST-304 | EnergyMeter en lopend totaal implementeren | Logic/UI | Afgerond: totaal update direct na elke wijziging |
| ST-305 | Overschrijdingswaarschuwing toevoegen | UX | Afgerond: gebruiker krijgt feedback maar behoudt regie |

## EPIC-05 Evaluatie en dagoverzicht

Doel: de kernloop afronden door geplande activiteiten te evalueren en terug te zien.

Status: `ST-401` en `ST-402` zijn inmiddels gerealiseerd in de app. De volgende
logische stap ligt nu in `ST-403`.

| Story ID | Titel | Type | Definition of done |
| --- | --- | --- | --- |
| ST-401 | Statusflows voor uitgevoerd, geskipt en aangepast bouwen | Build | Afgerond: activiteiten van vandaag kunnen direct tussen de vier statussen wisselen |
| ST-402 | Evaluatievelden toevoegen | UI | Afgerond: skip-reden en toelichting verschijnen passend per status en worden opgeslagen |
| ST-403 | Ongeplande activiteiten ondersteunen | Build | Ongeplande activiteit telt mee in werkelijke totalen |
| ST-404 | Dagoverzicht bouwen | UI | Gepland versus uitgevoerd en statusverdeling zijn zichtbaar |
| ST-405 | Dagaggregaties server-side implementeren | Logic | Dagtotalen blijven consistent met individuele records |

## EPIC-06 Weekoverzicht en inzichten

Doel: terugkijken op patronen zonder de wellness-guardrails te verlaten.

| Story ID | Titel | Type | Definition of done |
| --- | --- | --- | --- |
| ST-501 | Weekoverzichtspagina bouwen | UI | Gebruiker kan per week terugkijken |
| ST-502 | Weekaggregaties bouwen | Logic | Gemiddelde energie en budget-adherence zijn herleidbaar en testbaar |
| ST-503 | Skip-patronen zichtbaar maken | Logic/UI | Patronen worden alleen bij voldoende data getoond |
| ST-504 | Insightregels met datadrempels definiëren | Safety/Logic | Geen patroonclaim zonder guardrails |
| ST-505 | Insightcopy toetsen op niet-medische formulering | Content | Alle teksten blijven binnen wellness-positionering |

## EPIC-07 Reflectie en reminders

Doel: gebruikers optioneel laten terugblikken na zwaardere dagen.

| Story ID | Titel | Type | Definition of done |
| --- | --- | --- | --- |
| ST-601 | ReflectionCheckIn-model en flow implementeren | Build | Reflecties kunnen aan eerdere dagen gekoppeld worden |
| ST-602 | Joblogica voor T+1/T+2 prompts bouwen | Logic/Ops | Prompts worden niet dubbel of willekeurig aangemaakt |
| ST-603 | Instellingsoptie voor reflectieprompts toevoegen | Build | Gebruiker beheert opt-in zelfstandig |
| ST-604 | Korte reflectie-UI bouwen | UI | Prompt voelt licht en niet medisch |

## EPIC-08 Security en operations

Doel: de wellness-first MVP technisch hard genoeg maken voor echte gebruikers.

| Story ID | Titel | Type | Definition of done |
| --- | --- | --- | --- |
| ST-701 | Rate limiting toevoegen | Security | Kritieke auth- en mutatieroutes zijn beschermd |
| ST-702 | Logging voor fouten en kernmutaties inrichten | Ops | Kerngebeurtenissen zijn herleidbaar |
| ST-703 | Back-up en herstelstrategie documenteren en testen | Ops | Restore-pad is aantoonbaar gevalideerd |
| ST-704 | Secrets- en environmentbeheer formaliseren | Security/Ops | Geen secrets in code of onveilige configuratie |
| ST-705 | RLS-policy tests toevoegen | QA/Security | Owner-only model is aantoonbaar afgedwongen |

## EPIC-09 Launch-readiness

Doel: release 1 verantwoord kunnen opleveren.

| Story ID | Titel | Type | Definition of done |
| --- | --- | --- | --- |
| ST-801 | Kernflows handmatig testen | QA | Belangrijkste user journeys zijn geverifieerd |
| ST-802 | Accessibility check uitvoeren | QA/UX | Touch targets, contrast en reduced motion zijn gecontroleerd |
| ST-803 | Copy review doen | Content/Safety | Geen medische of zorgdossier-taal in release 1 |
| ST-804 | DPIA-input en datacatalogus afronden | Privacy | Pre-launch privacyartefacten zijn gereed |
| ST-805 | Go-live checklist opstellen | Ops | Team weet hoe launch en eerste incidentrespons verloopt |

## Release-level definition of done

- Alle `P0`-epics zijn functioneel afgerond
- Geen blocking bugs in ochtendcheck-in, planning, evaluatie of dashboardflow
- Owner-only toegang is technisch afgedwongen en getest
- Launchcopy blijft binnen wellness/self-management claims
- Privacy- en securitybasis is gereed voor echte gebruikersintroductie

## Niet in release 1

- Viewerrollen, delen met zorgverleners of naasten, en granular sharing
- Habit tracking buiten slaapkwaliteit
- Database-gestuurde vertalingen of extra talen
- AI-inzichten, chatbotfuncties of vrije tekstinterpretatie
- PDF-export, zorgdossierkoppelingen of medical-track features
