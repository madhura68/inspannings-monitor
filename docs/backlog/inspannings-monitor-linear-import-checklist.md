# Inspannings Monitor Linear Import Checklist

Gebruik deze checklist om de backlog en projectstructuur van `Inspannings Monitor` gecontroleerd in `Linear` te krijgen.

## Doel

Na afronding van deze checklist heb je:

- één `Linear` workspace
- één team voor `release 1`
- één initiative voor de MVP
- negen projects voor de epics
- een geïmporteerde issue-backlog voor alle stories
- een eerste kwaliteitscontrole op mapping, labels en prioriteiten

## Benodigde bestanden

- [inspannings-monitor-linear-setup.md](./inspannings-monitor-linear-setup.md)
- [inspannings-monitor-linear-import-issues.csv](./inspannings-monitor-linear-import-issues.csv)
- [inspannings-monitor-linear-projects.csv](./inspannings-monitor-linear-projects.csv)
- [inspannings-monitor-linear-projects.md](./inspannings-monitor-linear-projects.md)
- [inspannings-monitor-backlog.md](./inspannings-monitor-backlog.md)

## Fase 1: Workspace voorbereiden

- [ ] Maak of kies de `Linear` workspace voor `Inspannings Monitor`
- [ ] Bevestig dat je adminrechten hebt in de workspace
- [ ] Maak één top-level team aan met naam `Inspannings Monitor`
- [ ] Laat de teamworkflow in het begin simpel:
  - `Backlog`
  - `Todo`
  - `In Progress`
  - `Done`
  - `Canceled`
- [ ] Zet `Cycles` nog niet aan
- [ ] Gebruik nog geen extra sub-teams

## Fase 2: Labels voorbereiden

Maak deze labels aan als teamlabels:

- [ ] `release:r1`
- [ ] `type:build`
- [ ] `type:ui`
- [ ] `type:logic`
- [ ] `type:qa`
- [ ] `type:security`
- [ ] `type:ops`
- [ ] `type:ux`
- [ ] `type:content`
- [ ] `type:privacy`
- [ ] `epic:fundament`
- [ ] `epic:auth-profiel`
- [ ] `epic:ochtendcheckin`
- [ ] `epic:dagplanning`
- [ ] `epic:evaluatie`
- [ ] `epic:weekoverzicht`
- [ ] `epic:reflectie`
- [ ] `epic:security-ops`
- [ ] `epic:launch`

## Fase 3: Initiative en projects aanmaken

### Initiative

- [ ] Maak één initiative aan: `Release 1 MVP`

### Projects

Maak deze negen projects aan:

- [ ] `Fundament`
- [ ] `Auth en profiel`
- [ ] `Ochtendcheck-in`
- [ ] `Dagplanning`
- [ ] `Evaluatie en dagoverzicht`
- [ ] `Weekoverzicht en inzichten`
- [ ] `Reflectie en reminders`
- [ ] `Security en operations`
- [ ] `Launch-readiness`

### Aanbevolen projectleads

- [ ] Wijs alleen projectleads toe als die nu al duidelijk zijn
- [ ] Laat anders de leads leeg bij de eerste importfase

## Fase 4: Import voorbereiden

- [ ] Open de actuele import-CSV: [inspannings-monitor-linear-import-issues.csv](./inspannings-monitor-linear-import-issues.csv)
- [ ] Controleer steekproefsgewijs:
  - `Team` = `Inspannings Monitor`
  - `Status` = `Backlog`
  - `Priority` = `high` of `medium`
  - `Project` bevat één van de negen epic-projectnamen
  - `Initiatives` = `Release 1 MVP`
- [ ] Maak desnoods eerst een testworkspace of testteam als je Linear eerst wilt proefimporteren

## Fase 5: Import uitvoeren

Volgens de actuele `Linear`-documentatie loopt import van “other” bronnen via hun importer/CLI met een CSV in `Linear`-formaat.

- [ ] Ga in Linear naar `Settings > Administration > Import/Export`
- [ ] Kies de importroute voor een generieke / `Other`-bron of `Linear CSV`-aanpak
- [ ] Upload of importeer het bestand `inspannings-monitor-linear-import-issues.csv`
- [ ] Gebruik het team `Inspannings Monitor` als doel
- [ ] Rond de import af

## Fase 6: Directe controle na import

Controleer meteen deze punten:

- [ ] Zijn alle `43` issues aanwezig?
- [ ] Staan de issues in het team `Inspannings Monitor`?
- [ ] Hebben issues status `Backlog`?
- [ ] Zijn prioriteiten zichtbaar als `high` of `medium`?
- [ ] Zijn labels meegekomen?
- [ ] Zijn issues aan de juiste projects gekoppeld?
- [ ] Is de initiative-koppeling zichtbaar?

## Fase 7: Als project- of initiative-koppeling niet goed is meegekomen

Gebruik dan deze fallback:

- [ ] Filter op label `epic:fundament` en koppel alle resultaten in bulk aan project `Fundament`
- [ ] Filter op label `epic:auth-profiel` en koppel in bulk aan `Auth en profiel`
- [ ] Filter op label `epic:ochtendcheckin` en koppel in bulk aan `Ochtendcheck-in`
- [ ] Filter op label `epic:dagplanning` en koppel in bulk aan `Dagplanning`
- [ ] Filter op label `epic:evaluatie` en koppel in bulk aan `Evaluatie en dagoverzicht`
- [ ] Filter op label `epic:weekoverzicht` en koppel in bulk aan `Weekoverzicht en inzichten`
- [ ] Filter op label `epic:reflectie` en koppel in bulk aan `Reflectie en reminders`
- [ ] Filter op label `epic:security-ops` en koppel in bulk aan `Security en operations`
- [ ] Filter op label `epic:launch` en koppel in bulk aan `Launch-readiness`
- [ ] Selecteer daarna alle release-1 issues en koppel ze in bulk aan initiative `Release 1 MVP`

## Fase 8: Eerste opschoning in Linear

- [ ] Sorteer backlog eerst op `Priority`
- [ ] Controleer of alle `P0`-stories als `high` binnengekomen zijn
- [ ] Controleer of alle `P1`-stories als `medium` binnengekomen zijn
- [ ] Archiveer nog niets in deze eerste fase
- [ ] Voeg nog geen cycles toe
- [ ] Voeg nog geen extra workflowstappen toe

## Fase 9: Eerste operationele inrichting

- [ ] Maak een opgeslagen view voor `Release 1 - All`
- [ ] Maak een view voor `P0`
- [ ] Maak een view voor `Security / Privacy`
- [ ] Maak een view voor `Launch-readiness`
- [ ] Maak eventueel één view `My work` of `This week`

## Fase 10: Go / No-Go na import

### Go als dit klopt

- [ ] Alle `43` issues staan in Linear
- [ ] De negen projects bestaan
- [ ] De initiative bestaat
- [ ] Labels en prioriteiten zijn bruikbaar
- [ ] De backlog is zonder extra handwerk te filteren per epic

### No-Go als dit misgaat

- [ ] Issues missen of zijn dubbel geïmporteerd
- [ ] Projectkoppeling is structureel kapot
- [ ] Statusmapping is onbruikbaar
- [ ] CSV blijkt niet goed te matchen met de importer

Als `No-Go`: import verwijderen, mapping aanpassen, en opnieuw importeren.

## Eerste week in Linear

Voor de eerste week zou ik dit simpel houden:

- gebruik alleen `Backlog`, `Todo`, `In Progress`, `Done`
- plan nog geen formele cycles
- werk eerst `EPIC-01` en `EPIC-02` uit
- gebruik labels en projects voor overzicht, niet extra workflowcomplexiteit

## Bronnen

- [Linear Importer docs](https://linear.app/docs/import-issues)
- [Linear Teams docs](https://linear.app/docs/teams)
- [Linear Projects docs](https://linear.app/docs/projects)
- [Linear Priority docs](https://linear.app/docs/priority)
