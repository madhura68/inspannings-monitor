# Aanbevelingen voor Inspannings Monitor

Dit bestand bevat aanbevelingen gebaseerd op analyse van de broncode, documentatie en backlog (peildatum: 2026-04-18). Bedoeld als leidraad voor toekomstige werksessies.

---

## Huidige status

De volgende onderdelen zijn volledig geïmplementeerd en van goede kwaliteit:

| Onderdeel | Status |
|---|---|
| Authenticatie (login, signup, e-mailbevestiging, uitloggen) | ✅ Af |
| Beveiligde routes met server-side sessiecontrole | ✅ Af |
| Onboarding flow (3 stappen, profiel- en instellingenopslag) | ✅ Af |
| Instellingenbeheer (tijdzone, herinneringen, energiepunten) | ✅ Af |
| Databaseschema met RLS-beleid | ✅ Af |
| CI/CD (GitHub Actions + Vercel) | ✅ Af |
| Branchbeveiliging op `main` | ✅ Af |

---

## Volgende prioriteiten (volgorde uit backlog)

### 1. ST-201 — Ochtendcheck-in UI (P0, EPIC-03)
Het hart van de applicatie. Zonder check-in heeft het dashboard geen inhoud. Bouwen als:
- Energieschuifregelaar (1–10)
- Slaapkwaliteitsinput (goed / matig / slecht)
- Opslaan in nieuwe tabel `morning_check_ins`
- Check-in status tonen op het dashboard (al ingevoerd of nog niet)

### 2. ST-203 — Budgetberekening (P0, EPIC-03)
Zodra de check-in werkt, berekent de app automatisch het dagbudget op basis van de energiescore. Vereist:
- Score-naar-budget mapping (formule vastleggen vóór implementatie)
- Edge cases: score = 1, score = 10, geen check-in
- Eenheidstests voor de berekeningslogica — dit is de enige plek in het project waar tests nu echt urgent zijn

### 3. ST-301 t/m ST-305 — Dagplanning en energiemeter (P0, EPIC-04)
- Activiteiteninvoer met categorie, duur en energiepuntschatting
- Lopende energiemeter (resterend budget)
- Waarschuwing bij overschrijding (niet-blokkerend)
- Vereist nieuwe tabellen: `activities`, `activity_instances`, `activity_categories`

### 4. ST-401 t/m ST-405 — Evaluatie en dagoverzicht (P0, EPIC-05)
- Activiteiten afvinken als voltooid, overgeslagen of aangepast
- Dagelijkse samenvatting: gepland vs. werkelijk
- Sluit de plan-do-evaluate-lus

### 5. ST-105 — RLS hardening (P0, EPIC-08, parallel uitvoeren)
RLS-beleid is aangemaakt maar nog niet grondig getest. Voer dit parallel uit aan de feature-bouw:
- Testscripts schrijven die proberen om andermans rijen te lezen/schrijven
- Bevestigen dat `service_role`-key nergens in de frontend of Vercel-configuratie staat

---

## Technische schuld

De huidige code is van goede kwaliteit, maar bevat een aantal verbeterpunten die bij de volgende feature-bouwfase opgepakt kunnen worden — niet nu, maar vóór launch.

### Matig urgent

| Probleem | Bestand(en) | Oplossing |
|---|---|---|
| `getParamValue()` 4× gedupliceerd | `app/*/page.tsx` | Verplaats naar `lib/auth/params.ts` |
| `onboarding-flow.tsx` is 343 regels | `components/onboarding/onboarding-flow.tsx` | Splits in drie stapcomponenten |
| `settings-form.tsx` dupliceert toestandslogica van onboarding | `components/settings/settings-form.tsx` | Extraheer gedeelde hook |

### Laag urgent (vóór launch)

| Probleem | Bestand(en) | Oplossing |
|---|---|---|
| Geen laadstatus tijdens server actions | `onboarding-flow.tsx`, `settings-form.tsx` | Gebruik `useTransition` + pending-state |
| Geen toast/melding na formulieropslaan | Alle clientcomponenten | shadcn/ui `toast` toevoegen |
| Booleaanse extractie uit FormData stil faalbaar | `app/**/actions.ts` | Expliciete validatie toevoegen |

---

## Risico's en aandachtspunten vóór launch

### Security
- **Oud `service_role`-geheim in git-history**: Sleutel is als gecompromitteerd behandeld en niet meer in gebruik. Git-history opschonen is nog niet gedaan. Voer dit uit vóór publieke launch als extra voorzorgsmaatregel (`git filter-repo` of BFG Repo Cleaner).
- **RLS nog niet gehard (ST-105)**: Blokkeer launch totdat dit getest is.
- **Rate limiting ontbreekt (ST-701)**: Sign-up en sign-in eindpunten zijn momenteel niet beperkt op applicatieniveau (Supabase heeft eigen throttling, maar expliciete applicatielaag ontbreekt).

### Privacy
- **DPIA nog niet gedaan (ST-803)**: Verplicht vóór launch omdat gezondheidsdata wordt verwerkt, ook al zijn het welzijnsgegevens.
- **Copyreview (ST-803)**: Alle teksten moeten door een copycheck — geen medische claims, geen diagnoses, geen therapeutisch advies. Dit is een harde launchpoort.
- **Gegevensretentie**: Nog geen beleid of implementatie voor het verwijderen van oude daggegevens.

### Kwaliteit
- **Geen testinfrastructuur**: Er zijn geen tests. Minimaal de budgetberekening (ST-203) en RLS-beleid vereisen geautomatiseerde tests vóór launch.
- **Geen toegankelijkheidsaudit (ST-802)**: WCAG 2.1 AA is de norm; nog niet gecontroleerd.

---

## Architectuuradvies voor de volgende bouwfase

### Databaseschema uitbreiden
Voeg tabellen toe in deze volgorde (met migraties in `/supabase/migrations/`):
1. `morning_check_ins` — energiescore, slaapkwaliteit, berekend budget, datum
2. `activity_categories` — referentiedata (naam, standaard energiepunten)
3. `activities` — geplande activiteiten per dag per gebruiker
4. `activity_instances` — werkelijk uitgevoerd, overgeslagen of aangepast
5. `skip_reasons` — optionele referentiedata

Alle tabellen krijgen RLS-beleid op `user_id = auth.uid()`.

### Servicelaag uitbreiden (`lib/`)
Volg het bestaande patroon in `lib/profile/service.ts`:
- Maak `lib/checkin/service.ts` voor ochtendcheck-in logica
- Maak `lib/planning/service.ts` voor activiteitenbeheer
- Houd serveracties (`app/**/actions.ts`) dun — valideren, delegeren naar service, redirecten

### Componentstrategie
- Gebruik het bestaande shadcn/ui-fundament (`components/ui/`)
- Voeg geen nieuwe UI-bibliotheek toe
- Bouw feature-componenten in eigen mappen (`components/checkin/`, `components/planning/`, `components/evaluation/`)
- Voeg `useTransition` toe zodra een form meer dan één server roundtrip kost

### Wanneer testen toevoegen
- Start met tests bij ST-203 (budgetberekening) — pure functie, makkelijk te testen
- Voeg RLS-integratietests toe bij ST-105
- Gebruik Vitest (past bij de huidige toolchain, geen extra configuratie nodig naast het toevoegen van het pakket)

---

## Samenvatting prioriteitsvolgorde

```
Nu:         ST-201 (ochtendcheck-in UI)
Dan:        ST-203 (budgetlogica + eerste tests)
Daarna:     ST-301–305 (dagplanning)
Daarna:     ST-401–405 (evaluatie)
Parallel:   ST-105 (RLS), ST-701 (rate limiting)
Vóór launch: ST-802 (toegankelijkheid), ST-803 (copy + DPIA)
```
