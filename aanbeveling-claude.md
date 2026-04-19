# Actuele prioriteiten voor Inspannings Monitor

Peildatum: **19 april 2026** — bijgewerkt op basis van de huidige codebase en de
recente implementaties voor check-in, planning, energiemeter, Dusk-thema en
navigatiestructuur.

---

## Samenvatting

De app heeft inmiddels een **sterk fundament**:

- auth en protected routes werken
- onboarding en instellingen zijn aanwezig
- ochtendcheck-in en budgetlogica zijn aanwezig
- planning en energiemeter zijn aanwezig
- error/loading routes bestaan voor de belangrijkste dataroutes
- pending states en toastfeedback zijn aanwezig
- CI/CD, branch protection en Vercel-deploy staan

De grootste winst zit nu niet meer in fundering, maar in:

1. **de plan-do-evalueer-lus sluiten**
2. **kritieke technische gaten dichten vóór launch**
3. **test- en securitylaag versterken**

---

## Wat al op orde is

Deze punten stonden eerder als aanbeveling open, maar zijn inmiddels al
afgerond of grotendeels opgelost:

- `error.tsx` voor de belangrijkste app-routes
- `loading.tsx` voor dashboard, check-in en planning
- pending states in onboarding, settings, check-in en planning
- centrale toastlaag voor redirect- en action-feedback
- expliciete `FormData`-validatie
- wizard-core en onboarding-refactor
- ochtendcheck-in en budget v1
- planning, energiemeter en niet-blokkerende budgetwaarschuwing
- Dusk-themafundering en toegankelijkheidspolish
- topnavigatie met publieke About-pagina

Deze punten hoeven dus **niet** opnieuw als directe actielijst te worden gezien.

---

## Nu doen

Dit zijn de hoogste actuele prioriteiten voor de eerstvolgende sprint.

### 1. ST-401 t/m ST-405 — Evaluatie en dagoverzicht

De app ondersteunt nu:

- check-in
- plannen
- energiebudget

Maar de daglus is nog niet af zolang de gebruiker activiteiten niet kan:

- afronden
- overslaan
- aanpassen
- samenvatten in een dagoverzicht

**Waarom nu:** dit is de grootste productmatige ontbrekende schakel. De app
voelt nu al nuttig, maar nog niet “rond”.

**Concreet:**

- activiteitstatus wijzigen naar `completed`, `skipped`, `adjusted`
- ongeplande activiteit kunnen toevoegen
- dagaggregaties berekenen
- dagoverzicht tonen met totalen en statusverdeling

---

### 2. `npm test` toevoegen aan CI

De app heeft nu unit tests voor:

- budgetlogica
- energiemeterlogica

Maar in CI draaien nog alleen:

- `lint`
- `build`

**Waarom nu:** dit is een kleine wijziging met directe kwaliteitswinst.

**Concreet:**

- voeg `npm run test` toe aan `.github/workflows/ci.yml`

---

### 3. Tijdzonehelper dedupliceren

`getLocalDateForTimezone()` staat nu nog dubbel in:

- `lib/check-in/service.ts`
- `lib/planning/service.ts`

**Waarom nu:** klein, veilig en voorkomt toekomstige divergentie.

**Concreet:**

- verplaats naar `lib/dates.ts`
- importeer vanuit beide services

---

### 4. Onverwachte DB-fouten consistenter afvangen in server actions

Validatiefouten worden al goed afgehandeld. Wat nog niet overal strak genoeg is:

- onverwachte Supabase/DB-fouten
- partiële storingen in servicecalls

Nu eindigen sommige fouten nog als generieke exception, terwijl de gebruiker
beter een nette foutcode/toast kan krijgen.

**Waarom nu:** dit verhoogt herstelbaarheid zonder grote refactor.

**Concreet:**

- alle action-bestanden nalopen
- onverwachte servicefouten mappen naar gebruikersvriendelijke foutcodes
- bestaande `status/error`-toastpatronen hergebruiken

---

## Daarna doen

Deze punten zijn belangrijk, maar komen logisch ná de evaluatiefase.

### 5. ST-105 — RLS hardening en echte policy-tests

RLS staat aan en ziet er inhoudelijk goed uit, maar is nog niet systematisch
getest tegen misbruikscenario’s.

**Concreet:**

- SQL-tests of handmatige scripts schrijven
- lezen/schrijven van andermans rijen expliciet proberen
- checken dat frontend/Vercel geen admin-secret gebruikt

**Waarom daarna:** belangrijk vóór launch, maar blokkeert de volgende productstap
niet direct.

---

### 6. Testdekking uitbreiden rond pure logica

Na de bestaande budget- en meter-tests zijn dit de beste vervolgstukken:

- `lib/forms/parse.ts`
- toekomstige dagaggregatie voor evaluatie
- tijdzone/datumhelpers zodra die gedeeld zijn

**Waarom daarna:** klein en waardevol, maar minder productkritisch dan ST-401.

---

### 7. Transactie of RPC voor onboarding-opslag

`completeOnboardingForCurrentUser()` doet nu twee losse updates:

- `profiles`
- `user_settings`

Dat werkt, maar kent een klein risico op partiële opslag als de tweede write
faalt.

**Concreet:**

- ofwel Supabase RPC
- ofwel server-side transactiepad waar haalbaar

**Waarom daarna:** belangrijk voor netheid en robuustheid, maar geen acute
blokkade.

---

## Vóór launch

Deze punten hoeven niet allemaal in de volgende sprint, maar moeten wel vóór een
serieuze publieke introductie op orde zijn.

### 8. Logging en monitoring

Nu ontbreekt nog een echte productieloglaag zoals:

- Sentry
- of vergelijkbare error monitoring

**Nodig voor:**

- incidenten terugvinden
- onverwachte action-/DB-fouten volgen
- regressies sneller herkennen

---

### 9. Rate limiting

Nu leunt auth vooral op Supabase-limieten. Voor de app zelf ontbreekt nog
bewuste begrenzing op mutaties zoals:

- check-in opslaan
- activiteit toevoegen
- latere evaluatie-updates

**Doel:** misbruik, spam en piekgedrag beperken.

---

### 10. Secret-history cleanup

Een oude Supabase `service_role` key heeft eerder in de git-history gestaan.

Ook al is die key niet meer actief in de app, vóór publieke launch is het nog
steeds verstandig om:

- die geschiedenis op te schonen
- en te bevestigen dat de sleutel niet meer bruikbaar is

---

### 11. Accessibility, copy en privacy-review

Voor launch nog nalopen:

- toetsenbord- en screenreaderflow op kritieke routes
- wellness/self-management copy zonder medische framing
- privacy/DPIA-check passend bij jullie positionering

---

## Later

Deze punten zijn nuttig, maar nu nog niet de beste besteding van tijd.

### 12. Paginering en schaaloptimalisaties

Bij de huidige MVP is de activiteitslijst nog klein. Zaken als:

- paginering
- geavanceerde caching
- query-optimisaties voor grote datasets

zijn voorlopig geen topprioriteit.

---

### 13. Supabase codegeneratie voor types

De huidige handmatige mapping is nog beheersbaar. Codegeneratie via Supabase CLI
kan later waardevol worden, maar nu voegt het waarschijnlijk meer toolinglast
toe dan directe winst.

---

### 14. Zwaardere compliance-laag

Formele zorgcompliance, audittrail en NEN-achtige eisen zijn pas logisch als de
productpositionering echt opschuift richting zorgmarkt. Voor de huidige
wellness-first MVP is dat nog niet de eerstvolgende stap.

---

## Aangescherpte prioriteitsvolgorde

```text
Nu:         ST-401–405 (evaluatie en dagoverzicht)
Nu:         npm test toevoegen aan CI
Nu:         getLocalDateForTimezone() dedupliceren naar lib/dates.ts
Nu:         onverwachte DB-fouten in actions consistenter mappen
Daarna:     ST-105 (RLS hardening en policy-tests)
Daarna:     extra tests voor parse- en aggregatielogica
Daarna:     onboarding-opslag transactioneler maken
Vóór launch: logging/monitoring
Vóór launch: rate limiting
Vóór launch: secret-history cleanup
Vóór launch: accessibility/copy/privacy review
Later:      paginering, codegen, zwaardere compliance-laag
```

---

## Korte conclusie

De app is niet meer in de fase van “fundering ontbreekt”. Die fase is grotendeels
voorbij. De actuele focus moet nu verschuiven naar:

- de gebruikerslus afmaken
- reliability aanscherpen
- en launch-risico’s gecontroleerd terugdringen

De beste volgende inhoudelijke stap is daarom nog steeds:

**`ST-401 t/m ST-405` — evaluatie en dagoverzicht.**
