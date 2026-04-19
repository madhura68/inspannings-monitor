# Inspannings Monitor — 09 · Dusk Theme Specificatie

**Versie:** v0.1 · **Datum:** 2026-04-19 · **Status:** Normatief, basis nu in code doorgevoerd  
**Scope:** UI-thema voor Next.js 16 + shadcn/ui + Tailwind v4 codebase  
**Variant:** Dusk · **Dark mode:** Prioriteit · **Icon-set:** Lucide

Bij conflict met eerdere documenten wint deze specificatie voor alles wat
visueel design betreft. Functioneel gedrag blijft geregeld in
`02-functionele-specificatie-mvp`.

## 0 · Implementatiestatus

Per 2026-04-19 is de basis van dit thema in de app doorgevoerd:

- centrale `oklch()`-tokens in `app/globals.css`
- `Inter Tight` + `IBM Plex Mono` via `next/font`
- dark mode als standaard via `next-themes`
- semantische componentvarianten voor cards, alerts en buttons
- Dusk-shell op landing, dashboard, auth, onboarding, check-in, planning en settings
- accessibility-polish voor focus, keuzegroepen en de EnergyMeter-progressbar

Nog bewust iteratief:

- fijnslijpen van iconmapping per view
- laatste micro-spacing en copy-patronen in nieuwe features
- eventuele theme toggle als productkeuze voor later

---

## 1 · Rationale

Inspannings Monitor richt zich op volwassenen die rust zoeken in het
plannen van hun energie. Dusk is gekozen omdat:

- **Warme papertone** (ivory, L 97%) vermindert klinische feel — de app
  is expliciet *wellness*, geen medisch hulpmiddel.
- **Gedempte indigo primary** (hue 262, chroma 0.11) voelt kalm en
  "avondlicht" aan. Past bij de dagelijkse lus (ochtendcheck-in →
  dagplanning → avondreflectie) die doorloopt tot de avond.
- **Whisper-quiet contrast** (nooit echt zwart-op-wit) voorkomt
  schermmoeheid en matcht de rustige copywriting.
- **Dark mode als spiegel** in dezelfde hue, iets hogere chroma op ink —
  identiteit blijft behouden zonder saai navy te worden.

### Niet-doelen

- Geen medische signalen (geen rood-groen triage-semantiek).
- Geen "motivational" UI (geen grote cijfers, geen gamification-kleur).
- Geen hoge-energie accenten (chroma > 0.13 uitgesloten).

---

## 2 · Kleurpalet

Alle kleuren in **oklch()**. Namen volgen shadcn/ui-conventies zodat alle
bestaande componenten zonder aanpassing werken.

### 2.1 · Light mode

| Token | Waarde | Gebruik |
| --- | --- | --- |
| `--background` | `oklch(97% 0.008 80)` | Paper |
| `--muted` | `oklch(95% 0.012 82)` | Paper-soft (rail, rustvlak) |
| `--card` | `oklch(99% 0.004 80)` | Kaartoppervlak |
| `--popover` | `oklch(100% 0 0)` | Popovers, toasts, sheets |
| `--foreground` | `oklch(22% 0.03 262)` | Primaire tekst (contrast 14.2:1) |
| `--muted-foreground` | `oklch(58% 0.015 262)` | Secundaire tekst (AA 4.5:1) |
| `--primary` | `oklch(44% 0.11 262)` | Muted indigo |
| `--primary-foreground` | `oklch(98% 0.01 262)` | Tekst op primary |
| `--secondary` / `--accent` | `oklch(92% 0.03 262)` | Primary-soft vlak |
| `--border` | `oklch(22% 0.03 262 / 0.10)` | Hairline |
| `--input` | `oklch(22% 0.03 262 / 0.12)` | Form border |
| `--ring` | `oklch(44% 0.11 262)` | Focus |
| `--destructive` | `oklch(58% 0.16 25)` | Alleen echte destructieve acties |
| `--success` | `oklch(62% 0.09 155)` | Succes, voltooid |
| `--warning` | `oklch(72% 0.10 70)` | Budget-overschrijding |

### 2.2 · Dark mode

| Token | Waarde |
| --- | --- |
| `--background` | `oklch(17% 0.02 262)` |
| `--card` | `oklch(22% 0.025 262)` |
| `--popover` | `oklch(22% 0.025 262)` |
| `--foreground` | `oklch(96% 0.008 80)` |
| `--muted` | `oklch(26% 0.025 262)` |
| `--muted-foreground` | `oklch(70% 0.015 262)` |
| `--primary` | `oklch(78% 0.08 262)` |
| `--primary-foreground` | `oklch(20% 0.03 262)` |
| `--secondary` | `oklch(28% 0.03 262)` |
| `--accent` | `oklch(30% 0.04 262)` |
| `--border` | `oklch(100% 0 0 / 0.10)` |
| `--ring` | `oklch(78% 0.08 262)` |
| `--destructive` | `oklch(70% 0.16 25)` |
| `--success` | `oklch(74% 0.09 155)` |
| `--warning` | `oklch(80% 0.10 70)` |

### 2.3 · Charts

| Token | Waarde | Gebruik |
| --- | --- | --- |
| `--chart-1` | `oklch(44% 0.11 262)` | Vandaag / primair |
| `--chart-2` | `oklch(60% 0.09 262)` | Gemiddelde / trend |
| `--chart-3` | `oklch(70% 0.10 50)` | Accent amber — alleen voor overschrijding |
| `--chart-4` | `oklch(62% 0.09 155)` | Succestint |
| `--chart-5` | `oklch(80% 0.03 262)` | Overige dagen / achtergrond |

> **Regel:** rood (`--destructive`) nooit gebruiken voor budget — dat is
> `--warning` (amber). Rood is gereserveerd voor "verwijder account",
> "annuleer abonnement" en vergelijkbaar.

---

## 3 · Typografie

Eén UI-font: **Inter Tight**. Monospace voor cijfers en timestamps in
ondersteunende posities: **IBM Plex Mono**. De huidige display-serif
stack wordt verwijderd.

### 3.1 · Schaal

| Rol | Grootte | Gewicht | Letterspacing | Line-height |
| --- | --- | --- | --- | --- |
| H1 | 42 | 500 | -0.03em | 1.08 |
| H2 | 22 | 600 | -0.02em | 1.2 |
| H3 | 15 | 600 | 0 | 1.3 |
| Body | 15 | 400 | 0 | 1.7 |
| Micro | 12 | 400 | 0 | 1.5 |
| Eyebrow | 11 | 600 | 0.16em uppercase | 1.4 |
| Number | variabel | 500 | -0.02em | 1.2 |

### 3.2 · Regels

- Alle cijfers in UI krijgen `font-variant-numeric: tabular-nums`. Dit
  staat globaal op `body` en wordt niet ongedaan gemaakt.
- Letterspacing op headings negatief (-0.02 / -0.03) — geen condensed
  gevoel.
- Body line-height 1.65–1.7.
- Geen font-weight onder 400 — zwakke tekst is onleesbaar op low-contrast
  paper.
- Geen serif in UI meer. Serif eventueel alleen in gegenereerde PDF's.

---

## 4 · Iconografie — Lucide

Set: **lucide-react** (al in shadcn-stack). Alle iconen met
`strokeWidth={1.5}`, `strokeLinecap="round"`, `strokeLinejoin="round"`.
Default grootte **18px** in UI, **20px** in cards, **16px** inline. Kleur
erft via `currentColor` — nooit hardcoden.

### 4.1 · Voorgeschreven mapping

| Icoon | Doel |
| --- | --- |
| `Sun` | Ochtendcheck-in |
| `Moon` | Avondreflectie |
| `Zap` | Energie / budget |
| `Calendar` | Dagplanning |
| `Clock` | Tijdstip / duur |
| `Heart` | Welzijn / herstel |
| `Pencil` | Notitie bewerken |
| `Settings` | Instellingen |
| `Plus` | Activiteit toevoegen |
| `Check` | Klaar / voltooid |
| `AlertCircle` | Buiten budget (warning) |
| `LogOut` | Uitloggen |

### 4.2 · Regels

- Nooit twee verschillende icoon-sets mixen in één view.
- Rood (`text-destructive`) alleen op echte destructieve acties, nooit
  voor "over budget" — daar `text-[--warning]` (amber) gebruiken.
- Iconen zijn stil: geen hover-animatie, geen kleurwissel behalve de
  natuurlijke `hover:text-primary` van het parent-element.
- Iconen met `aria-hidden` tenzij ze de enige labeldrager zijn.

---

## 5 · Radius & elevatie

| Token | Waarde | Gebruik |
| --- | --- | --- |
| `--radius` | `14px` | Kaarten, inputs (basis) |
| `--radius-sm` | `8px` | Chips, dense items |
| `--radius-lg` | `21px` | Hero cards, dialogs |
| `--radius-xl` | `25px` | Sheet / drawer |
| `--radius-full` | `9999px` | Buttons (pill), avatars |
| `--shadow-1` | 1px + 3px drop | Flat kaarten |
| `--shadow-2` | 4/16px drop | Hover, verhoogde kaarten |
| `--shadow-3` | 24/60px drop | Popovers, toasts, modals |

Alle schaduwen zijn indigo-getint (niet neutraal grijs) zodat ze
harmoniseren met paper en ink.

---

## 6 · Motion

- Standaard transitieduur **160 ms**, easing
  `cubic-bezier(.2, .7, .2, 1)`.
- Meter- en ring-animaties: **400 ms** enter, geen loop.
- Modals / popovers: **180 ms** fade + 6 px translate-Y.
- `prefers-reduced-motion: reduce` schakelt alles naar **0.01 ms**.
- Geen parallax, geen scroll-linked animaties.

---

## 7 · Toegankelijkheid

- Body-tekst minimaal WCAG AA (4.5:1). Primary-knop AAA in beide modes.
- Focus-ring: `2px solid var(--ring)` met `outline-offset: 2px` —
  **nooit** `outline: none` zonder vervanging.
- Hit-targets minimaal 40×40 desktop, **44×44 op touch**.
- Scale-buttons (1–10 in check-in): `aria-label="Energie {n} van 10"` +
  `aria-pressed`.
- Alle getalwaarden krijgen een leesbare `aria-label`
  (bijv. "8 komma 1 punten van 14").
- Kleur is nooit de enige signaaldrager — "binnen budget" krijgt altijd
  ook tekst of een icoon.
- Nederlands is de primaire taal. Screen-reader-output moet in het
  Nederlands kloppen (decimale komma, niet punt).

---

## 8 · Implementatie

### 8.1 · `app/globals.css`

Vervang de inhoud van `:root` en voeg `.dark` toe. Namen blijven
shadcn-compatibel; alleen waarden wijzigen.

```css
@import "tailwindcss";
@import "tw-animate-css";

@custom-variant dark (&:is(.dark *));

:root {
  /* Type */
  --font-body: var(--font-inter-tight), ui-sans-serif, system-ui, sans-serif;
  --font-display: var(--font-body);
  --font-mono: var(--font-plex-mono), ui-monospace, monospace;

  /* Surfaces */
  --background:         oklch(97% 0.008 80);
  --foreground:         oklch(22% 0.03 262);
  --card:               oklch(99% 0.004 80);
  --card-foreground:    oklch(22% 0.03 262);
  --popover:            oklch(100% 0 0);
  --popover-foreground: oklch(22% 0.03 262);

  /* Primary — muted indigo */
  --primary:              oklch(44% 0.11 262);
  --primary-foreground:   oklch(98% 0.01 262);
  --secondary:            oklch(92% 0.03 262);
  --secondary-foreground: oklch(44% 0.11 262);

  /* Muted & accent */
  --muted:             oklch(95% 0.012 82);
  --muted-foreground:  oklch(58% 0.015 262);
  --accent:            oklch(92% 0.03 262);
  --accent-foreground: oklch(44% 0.11 262);

  /* Status */
  --destructive: oklch(58% 0.16 25);
  --success:     oklch(62% 0.09 155);
  --warning:     oklch(72% 0.10 70);

  /* Lijnen & focus */
  --border: oklch(22% 0.03 262 / 0.10);
  --input:  oklch(22% 0.03 262 / 0.12);
  --ring:   oklch(44% 0.11 262);

  /* Charts */
  --chart-1: oklch(44% 0.11 262);
  --chart-2: oklch(60% 0.09 262);
  --chart-3: oklch(70% 0.10 50);
  --chart-4: oklch(62% 0.09 155);
  --chart-5: oklch(80% 0.03 262);

  /* Sidebar */
  --sidebar:                    oklch(95% 0.012 82);
  --sidebar-foreground:         oklch(22% 0.03 262);
  --sidebar-primary:            oklch(44% 0.11 262);
  --sidebar-primary-foreground: oklch(98% 0.01 262);
  --sidebar-accent:             oklch(92% 0.03 262);
  --sidebar-accent-foreground:  oklch(44% 0.11 262);
  --sidebar-border:             oklch(22% 0.03 262 / 0.08);
  --sidebar-ring:               oklch(44% 0.11 262);

  /* Radius & elevatie */
  --radius: 14px;
  --shadow-1: 0 1px 2px oklch(25% 0.03 262 / 0.06), 0 1px 3px oklch(25% 0.03 262 / 0.04);
  --shadow-2: 0 4px 16px oklch(25% 0.03 262 / 0.08), 0 1px 2px oklch(25% 0.03 262 / 0.04);
  --shadow-3: 0 24px 60px oklch(25% 0.03 262 / 0.10), 0 2px 6px oklch(25% 0.03 262 / 0.04);
}

.dark {
  --background:         oklch(17% 0.02 262);
  --foreground:         oklch(96% 0.008 80);
  --card:               oklch(22% 0.025 262);
  --card-foreground:    oklch(96% 0.008 80);
  --popover:            oklch(22% 0.025 262);
  --popover-foreground: oklch(96% 0.008 80);

  --primary:              oklch(78% 0.08 262);
  --primary-foreground:   oklch(20% 0.03 262);
  --secondary:            oklch(28% 0.03 262);
  --secondary-foreground: oklch(92% 0.02 262);

  --muted:             oklch(26% 0.025 262);
  --muted-foreground:  oklch(70% 0.015 262);
  --accent:            oklch(30% 0.04 262);
  --accent-foreground: oklch(92% 0.02 262);

  --destructive: oklch(70% 0.16 25);
  --success:     oklch(74% 0.09 155);
  --warning:     oklch(80% 0.10 70);

  --border: oklch(100% 0 0 / 0.10);
  --input:  oklch(100% 0 0 / 0.12);
  --ring:   oklch(78% 0.08 262);

  --chart-1: oklch(78% 0.08 262);
  --chart-2: oklch(60% 0.09 262);
  --chart-3: oklch(74% 0.10 50);
  --chart-4: oklch(74% 0.09 155);
  --chart-5: oklch(45% 0.03 262);

  --sidebar:                    oklch(20% 0.025 262);
  --sidebar-foreground:         oklch(96% 0.008 80);
  --sidebar-primary:            oklch(78% 0.08 262);
  --sidebar-primary-foreground: oklch(20% 0.03 262);
  --sidebar-accent:             oklch(28% 0.03 262);
  --sidebar-accent-foreground:  oklch(92% 0.02 262);
  --sidebar-border:             oklch(100% 0 0 / 0.08);
  --sidebar-ring:               oklch(78% 0.08 262);
}

@theme inline {
  --font-sans: var(--font-body);
  --font-mono: var(--font-mono);
  --color-background: var(--background);
  --color-foreground: var(--foreground);
  --color-card: var(--card);
  --color-card-foreground: var(--card-foreground);
  --color-popover: var(--popover);
  --color-popover-foreground: var(--popover-foreground);
  --color-primary: var(--primary);
  --color-primary-foreground: var(--primary-foreground);
  --color-secondary: var(--secondary);
  --color-secondary-foreground: var(--secondary-foreground);
  --color-muted: var(--muted);
  --color-muted-foreground: var(--muted-foreground);
  --color-accent: var(--accent);
  --color-accent-foreground: var(--accent-foreground);
  --color-destructive: var(--destructive);
  --color-border: var(--border);
  --color-input: var(--input);
  --color-ring: var(--ring);
  --color-chart-1: var(--chart-1);
  --color-chart-2: var(--chart-2);
  --color-chart-3: var(--chart-3);
  --color-chart-4: var(--chart-4);
  --color-chart-5: var(--chart-5);
  --color-sidebar: var(--sidebar);
  --color-sidebar-foreground: var(--sidebar-foreground);
  --color-sidebar-primary: var(--sidebar-primary);
  --color-sidebar-primary-foreground: var(--sidebar-primary-foreground);
  --color-sidebar-accent: var(--sidebar-accent);
  --color-sidebar-accent-foreground: var(--sidebar-accent-foreground);
  --color-sidebar-border: var(--sidebar-border);
  --color-sidebar-ring: var(--sidebar-ring);
  --radius-sm: calc(var(--radius) * 0.6);
  --radius-md: calc(var(--radius) * 0.8);
  --radius-lg: var(--radius);
  --radius-xl: calc(var(--radius) * 1.4);
  --radius-2xl: calc(var(--radius) * 1.8);
}

@layer base {
  * { @apply border-border outline-ring/50; }
  html {
    color-scheme: light dark;
    background: var(--background);
    color: var(--foreground);
    font-family: var(--font-body);
  }
  body {
    margin: 0;
    min-height: 100vh;
    font-family: var(--font-body);
    -webkit-font-smoothing: antialiased;
    font-variant-numeric: tabular-nums;
  }
  button:not(:disabled), [role="button"]:not(:disabled) { cursor: pointer; }

  :focus-visible { outline: 2px solid var(--ring); outline-offset: 2px; }

  @media (prefers-reduced-motion: reduce) {
    *, *::before, *::after {
      animation-duration: 0.01ms !important;
      transition-duration: 0.01ms !important;
    }
  }
}
```

### 8.2 · `app/layout.tsx` — fonts via `next/font`

```tsx
import { Inter_Tight, IBM_Plex_Mono } from "next/font/google";

const interTight = Inter_Tight({
  subsets: ["latin"],
  variable: "--font-inter-tight",
  display: "swap",
  weight: ["400", "500", "600", "700"],
});

const plexMono = IBM_Plex_Mono({
  subsets: ["latin"],
  variable: "--font-plex-mono",
  display: "swap",
  weight: ["400", "500"],
});

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html
      lang="nl"
      suppressHydrationWarning
      className={`${interTight.variable} ${plexMono.variable}`}
    >
      <body>
        <Providers>{children}</Providers>
      </body>
    </html>
  );
}
```

Verwijder de bestaande `--font-display` (serif) declaratie en alle
`font-[family-name:var(--font-display)]` classes uit views.

### 8.3 · Dark mode toggle via `next-themes`

```bash
npm i next-themes
```

```tsx
// app/theme-provider.tsx
"use client";
import { ThemeProvider } from "next-themes";

export function Providers({ children }: { children: React.ReactNode }) {
  return (
    <ThemeProvider
      attribute="class"
      defaultTheme="system"
      enableSystem
      disableTransitionOnChange
    >
      {children}
    </ThemeProvider>
  );
}
```

### 8.4 · `components/ui/theme-toggle.tsx`

```tsx
"use client";
import { Moon, Sun } from "lucide-react";
import { useTheme } from "next-themes";
import { Button } from "./button";

export function ThemeToggle() {
  const { theme, setTheme } = useTheme();
  const isDark = theme === "dark";
  return (
    <Button
      variant="ghost"
      size="icon"
      aria-label={isDark ? "Schakel naar licht" : "Schakel naar donker"}
      onClick={() => setTheme(isDark ? "light" : "dark")}
    >
      {isDark
        ? <Sun className="size-[18px]" strokeWidth={1.5} />
        : <Moon className="size-[18px]" strokeWidth={1.5} />}
    </Button>
  );
}
```

### 8.5 · Class-cleanup tabel

Hardcoded Tailwind-kleuren ondermijnen het thema. Per view zoek-en-vervang:

| Oud | Nieuw |
| --- | --- |
| `bg-white/75 backdrop-blur` | `bg-card` |
| `bg-white` | `bg-card` of `bg-popover` |
| `text-slate-900` | `text-foreground` |
| `text-slate-700` / `text-slate-600` / `text-slate-500` | `text-muted-foreground` |
| `border-black/10` | `border-border` |
| `rounded-[2rem]` / `rounded-[1.75rem]` | `rounded-xl` (= 1.4× `--radius`) |
| `shadow-[0_18px_60px_...]` | `shadow-[var(--shadow-3)]` |
| `shadow-[0_12px_40px_...]` | `shadow-[var(--shadow-2)]` |
| `bg-[radial-gradient(...)]` hero | verwijderen — paper is al warm |
| `font-[family-name:var(--font-display)]` | verwijderen — één font |
| `bg-amber-50 text-amber-950` (budget warning) | `bg-muted text-foreground` + `border-[color:var(--warning)]` |

### 8.6 · Voorbeeld-diff — `app/dashboard/page.tsx`

```diff
- <main className="min-h-screen bg-[radial-gradient(circle_at_top,_rgba(167,201,87,0.22),_transparent_32%),linear-gradient(180deg,_#f5f4ee_0%,_#eef2e6_100%)] px-6 py-10 text-slate-900 sm:px-8">
+ <main className="min-h-screen bg-background px-6 py-10 text-foreground sm:px-8">

- <header className="... rounded-[2rem] border border-black/10 bg-white/75 ... shadow-[0_18px_60px_rgba(71,85,105,0.12)] backdrop-blur ...">
+ <header className="... rounded-xl border border-border bg-card shadow-[var(--shadow-2)] ...">

- <CardTitle className="text-lg text-slate-900">Cookie-based sessie actief</CardTitle>
+ <CardTitle className="text-lg text-foreground">Cookie-based sessie actief</CardTitle>
```

### 8.7 · Iconen in componenten

```tsx
import { Sun, Calendar, Zap, Plus } from "lucide-react";

// CheckInCard header:
<Sun className="size-[18px] text-primary" strokeWidth={1.5} aria-hidden />

// PlanningPage primaire actie:
<Button>
  <Plus className="size-4" strokeWidth={1.5} aria-hidden />
  Activiteit
</Button>
```

---

## 9 · Chart-specificatie

De week-grafiek op het dashboard gebruikt `--chart-1` voor "vandaag" en
`--chart-5` voor overige dagen. `--chart-3` (amber) markeert
overschrijdingen. **Nooit** `--destructive` (rood) voor budget — dat is
`--warning`.

---

## 10 · Rollout-plan

| PR | Scope | Omvang |
| --- | --- | --- |
| 1 | `globals.css` vervangen (§8.1) | klein |
| 2 | Fonts via `next/font` + cleanup `--font-display` (§8.2) | klein |
| 3 | Dark mode — `next-themes`, `ThemeToggle` in dashboard + settings (§8.3, §8.4) | middel |
| 4 | View cleanup — één commit per route: landing, dashboard, check-in, planning, settings, onboarding (§8.5, §8.6) | groot |
| 5 | Lucide-standaardisatie — alle iconen 1.5 stroke, `size-[18px]` default (§4) | klein |
| 6 | `/styleguide` route achter `NEXT_PUBLIC_ENABLE_STYLEGUIDE` vlag | klein |

Richtlijn: maximaal één PR per dag in productie — de grote view-cleanup
splitsen over meerdere dagen zodat visual regression per route
beoordeeld kan worden.

---

## 11 · Acceptatiecriteria

- [ ] Landing, dashboard, ochtendcheck-in, dagplanning, instellingen en
  onboarding renderen correct in zowel light als dark.
- [ ] Er zijn geen hardcoded `text-slate-*`, `bg-white*`, `border-black/*`
  of hex-kleurwaarden meer in `app/**/*.tsx` of `components/**/*.tsx`.
- [ ] Theme-toggle werkt zonder flash; SSR levert de juiste kleur bij
  eerste render (dankzij `suppressHydrationWarning` + `next-themes`).
- [ ] Lighthouse a11y-score ≥ 95 op dashboard in beide modes.
- [ ] `prefers-reduced-motion` getest — meter-animaties zijn uit.
- [ ] Alle pt-waarden (check-in, planning, dagbudget) gebruiken
  `tabular-nums`.
- [ ] Focus-ring zichtbaar op alle tab-reachable elementen.
- [ ] `docs/inspannings-monitor-09-dusk-theme-specificatie-v01.md`
  gelinkt vanuit `docs/README.md`.

---

## 12 · Bestanden die wijzigen

| Bestand | Wijziging |
| --- | --- |
| `app/globals.css` | Vervangen (§8.1) |
| `app/layout.tsx` | Fonts + Providers wrap (§8.2, §8.3) |
| `app/theme-provider.tsx` | Nieuw (§8.3) |
| `components/ui/theme-toggle.tsx` | Nieuw (§8.4) |
| `app/page.tsx` | Class cleanup (§8.5, §8.6) |
| `app/dashboard/page.tsx` | Cleanup + `ThemeToggle` |
| `app/check-in/**/*.tsx` | Cleanup + Lucide `Sun` icon |
| `app/planning/**/*.tsx` | Cleanup + Lucide `Calendar` / `Plus` |
| `app/settings/page.tsx` | Cleanup + `ThemeToggle` |
| `app/onboarding/**/*.tsx` | Cleanup |
| `components/check-in/*.tsx` | Tokens + `aria-label` op scale-buttons |
| `components/planning/energy-meter-card.tsx` | Tokens + `tabular-nums` + reduced-motion |
| `app/styleguide/page.tsx` | Nieuw — primitives preview (flag-gated) |
| `docs/README.md` | Link naar deze spec toevoegen |

---

## 13 · Wijzigingslog

| Versie | Datum | Wijziging |
| --- | --- | --- |
| v0.1 | 2026-04-19 | Initiële Dusk-specificatie. Variant gekozen na exploratie van 4 blue-leaning opties (Dusk, Harbor, Linen, Meridian). |

---

*Dit document is de normatieve bron voor het Dusk-thema. Wijzigingen
vereisen versiebump en een corresponderende entry in §13.*
