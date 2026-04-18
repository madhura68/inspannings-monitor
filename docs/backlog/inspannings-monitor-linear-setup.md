# Inspannings Monitor in Linear

Dit document vertaalt de huidige backlog en documentatieset naar een praktische `Linear`-inrichting.

## Waarom deze inrichting

Volgens de actuele `Linear`-documentatie is een workspace het hoogste niveau en beveelt Linear in de praktijk aan om per bedrijf één workspace te gebruiken. Ook is een issue in Linear altijd gekoppeld aan precies één team, terwijl projecten grotere eenheden van werk zijn met een duidelijke uitkomst en geplande afronding.

Voor `Inspannings Monitor` betekent dat: houd het in het begin eenvoudig en maak één team voor release 1.

## Aanbevolen structuur

### Workspace

- `Inspannings Monitor`

### Team

- `Inspannings Monitor`

Gebruik één top-level team voor release 1. Dat past goed bij het feit dat release 1 alleen voor individuele gebruikers is en dat de backlog nog niet over meerdere product- of engineeringteams verdeeld hoeft te worden.

### Initiative

- `Release 1 MVP`

Gebruik één initiative als overkoepelend kader voor de eerste release.

### Projects

Maak de huidige epics als `Projects` aan in Linear:

1. `Fundament`
2. `Auth en profiel`
3. `Ochtendcheck-in`
4. `Dagplanning`
5. `Evaluatie en dagoverzicht`
6. `Weekoverzicht en inzichten`
7. `Reflectie en reminders`
8. `Security en operations`
9. `Launch-readiness`

## Aanbevolen labels

Houd labels klein en functioneel:

- `release:r1`
- `type:build`
- `type:ui`
- `type:logic`
- `type:qa`
- `type:security`
- `type:ops`
- `type:ux`
- `type:content`
- `type:privacy`
- `epic:fundament`
- `epic:auth-profiel`
- `epic:ochtendcheckin`
- `epic:dagplanning`
- `epic:evaluatie`
- `epic:weekoverzicht`
- `epic:reflectie`
- `epic:security-ops`
- `epic:launch`

## Aanbevolen statusgebruik

Voor de eerste release zou ik de workflow simpel houden:

- `Backlog`
- `Todo`
- `In Progress`
- `Done`
- `Canceled`

Begin zonder extra workflowstappen zoals `In Review`, tenzij jullie daar direct echt behoefte aan hebben. Linear is sterk juist wanneer je niet te vroeg te veel proceslagen toevoegt.

## Hoe ik de backlog heb gemapt

- `Epics` uit onze backlog zijn gemapt naar `Projects` in Linear.
- `Stories` zijn gemapt naar `Issues`.
- `P0` is gemapt naar `high`.
- `P1` is gemapt naar `medium`.
- Alle issues starten in `Backlog`.
- Het labelpakket uit de bestaande backlog blijft behouden.

## Aanbevolen importaanpak

1. Maak in Linear eerst de workspace en het team aan.
2. Maak daarna handmatig de `Initiative` en de negen `Projects` aan.
3. Gebruik het gegenereerde bestand [inspannings-monitor-linear-import-issues.csv](./inspannings-monitor-linear-import-issues.csv).
4. Gebruik de importroute die Linear documenteert voor `Other`-bronnen / `Linear CSV` via hun importer/CLI.
5. Controleer na import of `Project` en `Initiatives` goed zijn overgekomen.
6. Als die velden niet automatisch gekoppeld blijken, kun je in Linear issues per `epic:*` label filteren en daarna in bulk aan het juiste project koppelen.

## Belangrijke noot over de CSV

De gegenereerde CSV volgt de actuele exportkoppen van Linear, zodat het formaat dicht op het eigen model van Linear ligt. De importdocumentatie noemt expliciet onder meer `Title`, `Description`, `Priority`, `Status`, `Assignee`, `Created`, `Completed`, `Labels` en `Estimate` als relevante velden voor een `Other`-import. Ik heb daarnaast ook `Team`, `Project` en `Initiatives` ingevuld op basis van Linear’s eigen exportstructuur. Daardoor is de CSV zo bruikbaar mogelijk, maar het blijft verstandig om na import even te verifiëren dat projectkoppelingen exact zijn overgekomen.

## Cycles

Ik zou `Cycles` nog niet meteen aanzetten. Eerst de basisflow goed krijgen, daarna pas time-boxing toevoegen. Linear ondersteunt cycles per team, maar voor deze eerste release levert een eenvoudige project- en issue-structuur waarschijnlijk meer rust op dan direct sprintdiscipline.

## Bestanden in deze map

- [inspannings-monitor-backlog.md](./inspannings-monitor-backlog.md)
- [inspannings-monitor-backlog.csv](./inspannings-monitor-backlog.csv)
- [inspannings-monitor-linear-import-issues.csv](./inspannings-monitor-linear-import-issues.csv)
- [inspannings-monitor-linear-projects.csv](./inspannings-monitor-linear-projects.csv)
- [inspannings-monitor-linear-projects.md](./inspannings-monitor-linear-projects.md)
- [generate_linear_backlog_assets.py](./generate_linear_backlog_assets.py)
