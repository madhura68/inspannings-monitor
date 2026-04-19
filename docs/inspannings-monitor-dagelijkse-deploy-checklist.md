# Inspannings Monitor Dagelijkse Deploy Checklist

Deze checklist is bedoeld voor de normale werkflow van branch naar productie.

## 1. Werk starten

1. Maak een nieuwe branch vanaf `main`.
2. Geef de branch een duidelijke naam, bijvoorbeeld `feature/st-201-ochtend-checkin`.
3. Werk lokaal en controleer tussendoor met:
   - `npm run lint`
   - `npm run build`

## 2. Wijzigingen publiceren

1. Commit je werk lokaal.
2. Push de branch naar GitHub.
3. Open een pull request naar `main`.

## 3. CI controleren

1. Open de pull request in GitHub.
2. Controleer of de verplichte status check `Lint and build` groen is.
3. Merge niet zolang deze check faalt.

## 4. Preview deployment controleren

1. Open de Vercel preview deployment die aan de pull request hangt.
2. Controleer minimaal:
   - landingpagina `/`
   - login `/login`
   - signup `/sign-up`
   - dashboard `/dashboard`
3. Controleer bij auth-wijzigingen ook de bevestigingsflow via `/auth/confirm`.

## 5. Merge naar productie

1. Merge de pull request naar `main`.
2. Wacht tot Vercel automatisch de production deployment uitvoert.
3. Controleer daarna productie op:
   - [inspannings-monitor.jp-visser.nl](https://inspannings-monitor.jp-visser.nl)
   - login/signup
   - dashboard
   - settings

## 6. Bij problemen

1. Open de laatste deployment in Vercel.
2. Controleer build logs en runtime logs.
3. Revert de merge in GitHub als productie echt stuk is.
4. Laat Vercel daarna automatisch opnieuw deployen vanaf de herstelde `main`.

## 7. Huidige projectafspraken

- `main` is beschermd
- pull requests zijn verplicht
- status check `Lint and build` is verplicht
- force pushes naar `main` zijn geblokkeerd
- branch deletion van `main` is geblokkeerd
- productie draait op [inspannings-monitor.jp-visser.nl](https://inspannings-monitor.jp-visser.nl)
