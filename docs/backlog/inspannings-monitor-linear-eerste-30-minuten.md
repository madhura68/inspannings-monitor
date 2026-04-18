# Inspannings Monitor: eerste 30 minuten in Linear

Gebruik dit als snelle start nadat je workspace klaar is.

## 0-5 minuten: basis neerzetten

- Open of maak de workspace `Inspannings Monitor`
- Controleer dat je adminrechten hebt
- Maak één team aan: `Inspannings Monitor`
- Laat de issueworkflow simpel:
  - `Backlog`
  - `Todo`
  - `In Progress`
  - `Done`
  - `Canceled`
- Zet `Cycles` nog niet aan

## 5-10 minuten: release-structuur maken

- Maak de initiative `Release 1 MVP`
- Maak de 9 projects uit [inspannings-monitor-linear-projects.md](./inspannings-monitor-linear-projects.md)
- Gebruik de samenvattingen uit dat document
- Zet deze projects direct op `Planned`:
  - `Fundament`
  - `Auth en profiel`
  - `Ochtendcheck-in`
  - `Dagplanning`
  - `Evaluatie en dagoverzicht`
  - `Security en operations`
- Zet deze op `Backlog`:
  - `Weekoverzicht en inzichten`
  - `Reflectie en reminders`
  - `Launch-readiness`

## 10-15 minuten: labels klaarzetten

Maak minimaal deze labels aan:

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

Maak daarna de `epic:*` labels uit [inspannings-monitor-linear-setup.md](./inspannings-monitor-linear-setup.md).

## 15-20 minuten: backlog importeren

- Open [inspannings-monitor-linear-import-checklist.md](./inspannings-monitor-linear-import-checklist.md)
- Gebruik [inspannings-monitor-linear-import-issues.csv](./inspannings-monitor-linear-import-issues.csv)
- Importeer de `43` issues
- Controleer direct:
  - team klopt
  - status is `Backlog`
  - prioriteit is `high` of `medium`
  - labels zijn meegekomen

## 20-25 minuten: eerste opschoning

- Controleer of issues aan de juiste projects hangen
- Als projectkoppeling ontbreekt:
  - filter op `epic:*` label
  - koppel issues in bulk aan het juiste project
- Koppel daarna alles aan initiative `Release 1 MVP` als dat nog niet goed staat
- Sorteer de backlog op `Priority`

## 25-30 minuten: eerste views maken

Maak deze saved views:

- `Release 1 - All`
- `P0`
- `Security / Privacy`
- `Launch-readiness`

Als je daarna nog tijd hebt:

- wijs 2 of 3 issues uit `Fundament` toe
- zet alleen die issues op `Todo`
- laat de rest nog in `Backlog`

## Wat je nog niet moet doen

- nog geen cycles aanzetten
- nog geen extra workflowstappen maken
- nog geen sub-teams maken
- nog geen extra releasestructuur toevoegen
- nog geen medical-track werk mengen met release 1

## Beste eerste werkset

Als je meteen wilt starten met uitvoering, begin dan hier:

1. `ST-001` Next.js projectbasis opzetten
2. `ST-002` Omgevingen definiëren
3. `ST-101` Supabase Auth integreren
4. `ST-102` Profile- en UserSettings-model implementeren

## Relevante bestanden

- [inspannings-monitor-linear-setup.md](./inspannings-monitor-linear-setup.md)
- [inspannings-monitor-linear-import-checklist.md](./inspannings-monitor-linear-import-checklist.md)
- [inspannings-monitor-linear-projects.md](./inspannings-monitor-linear-projects.md)
- [inspannings-monitor-linear-import-issues.csv](./inspannings-monitor-linear-import-issues.csv)
- [inspannings-monitor-backlog.md](./inspannings-monitor-backlog.md)
