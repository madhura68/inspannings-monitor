# Inspannings Monitor Linear Projects

Dit document geeft per `Linear Project` een aanbevolen naam, samenvatting, status en praktisch gebruik.

## Initiative

### Release 1 MVP

- Aanbevolen status: `Planned`
- Samenvatting: `Wellness-first MVP voor individuele gebruikers, met een lichte plan-doe-evalueer flow voor energiemanagement.`
- Doel: alle release-1 projecten samenbrengen onder één duidelijk productdoel

Volgens de actuele `Linear`-documentatie zijn initiatives workspace-breed, bedoeld om projecten te groeperen rond een organisatorisch doel, en hebben ze een lifecycle met `Planned`, `Active` en `Completed`. Voor jullie huidige fase is `Planned` de juiste startstatus.

## Projects

### 1. Fundament

- Aanbevolen status: `Planned`
- Samenvatting: `Leg de technische basis voor release 1 met projectsetup, omgevingen, UI-basis en foutafhandeling.`
- Waarom dit een project is:
  - duidelijke uitkomst
  - vroeg in de planning
  - direct blokkerend voor alle andere projecten

### 2. Auth en profiel

- Aanbevolen status: `Planned`
- Samenvatting: `Implementeer accounttoegang, profieldata, onboarding en basisinstellingen per gebruiker.`
- Waarom dit een project is:
  - eigen domein met duidelijke oplevering
  - nodig voor alle persoonlijke flows

### 3. Ochtendcheck-in

- Aanbevolen status: `Planned`
- Samenvatting: `Bouw de ochtendcheck-in met energiescore, slaapkwaliteit en automatische budgetafleiding.`
- Waarom dit een project is:
  - centrale start van de kerngebruikersreis
  - duidelijke functionele grens

### 4. Dagplanning

- Aanbevolen status: `Planned`
- Samenvatting: `Maak plannen van activiteiten mogelijk met budgetfeedback, energie-impact en prioriteit.`
- Waarom dit een project is:
  - aparte UX- en datamodelscope
  - kern van de planfase

### 5. Evaluatie en dagoverzicht

- Aanbevolen status: `Planned`
- Samenvatting: `Maak evaluatie van activiteiten en een dagelijks overzicht van gepland versus uitgevoerd mogelijk.`
- Waarom dit een project is:
  - sluit de kernloop functioneel af
  - levert directe gebruikerswaarde op

### 6. Weekoverzicht en inzichten

- Aanbevolen status: `Backlog`
- Samenvatting: `Voeg weekterugblik, eenvoudige aggregaties en veilige patroonweergave toe zonder medische claims.`
- Waarom dit een project is:
  - logisch vervolg op de basisflow
  - minder blokkerend dan de eerste vijf projecten

### 7. Reflectie en reminders

- Aanbevolen status: `Backlog`
- Samenvatting: `Voeg optionele T+1/T+2 reflectieprompts en lichte reminderlogica toe voor zwaardere dagen.`
- Waarom dit een project is:
  - waardevol, maar niet nodig om de eerste basisflow werkend te krijgen
  - goed af te bakenen als apart project

### 8. Security en operations

- Aanbevolen status: `Planned`
- Samenvatting: `Borg logging, rate limiting, secrets, back-up en owner-only toegangscontrole voor echte gebruikersintroductie.`
- Waarom dit een project is:
  - releasekritisch
  - loopt parallel aan featurebouw

### 9. Launch-readiness

- Aanbevolen status: `Backlog`
- Samenvatting: `Rond QA, copy review, accessibility checks, DPIA-input en go-live checks voor release 1 af.`
- Waarom dit een project is:
  - hoort als apart releaseproject zichtbaar te zijn
  - wordt pas later actief, maar moet wel vroeg bestaan

## Aanbevolen praktische werkwijze in Linear

- Gebruik `Projects` voor deze 9 grotere werkstromen.
- Gebruik `Issues` voor de individuele stories.
- Gebruik voorlopig geen milestones.
- Gebruik voorlopig geen cycles.
- Zet een project pas op `In Progress` zodra er daadwerkelijk actief werk in loopt.
- Laat `Weekoverzicht en inzichten`, `Reflectie en reminders` en `Launch-readiness` aanvankelijk op `Backlog` staan.

## Aanbevolen eerste statusverdeling

### Start op `Planned`

- `Fundament`
- `Auth en profiel`
- `Ochtendcheck-in`
- `Dagplanning`
- `Evaluatie en dagoverzicht`
- `Security en operations`

### Start op `Backlog`

- `Weekoverzicht en inzichten`
- `Reflectie en reminders`
- `Launch-readiness`

## Bronnen

- [Linear Project status](https://linear.app/docs/project-status)
- [Linear Projects](https://linear.app/docs/projects)
- [Linear Project overview](https://linear.app/docs/project-overview)
- [Linear Initiatives](https://linear.app/docs/initiatives)
