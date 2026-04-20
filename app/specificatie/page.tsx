import { redirect } from "next/navigation";
import { getAuthState } from "@/lib/auth/session";
import { AppShell } from "@/components/navigation/app-shell";
import { PageIntro } from "@/components/navigation/page-intro";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";

export const dynamic = "force-dynamic";

const chapters = [
  {
    number: "01",
    title: "Productkader en positionering",
    version: "v06",
    summary:
      "Legt vast wat Inspannings Monitor wel en niet is. De app positioneert zich expliciet als wellness/self-management tool, zonder medische claims of zorgverlenerrollen. De intended use is energieplanning en dagstructuur voor volwassenen. Non-intended use — zoals diagnostiek, behandeling of klinische besluitvorming — is bewust uitgesloten en wordt bewaakt via claim-guardrails in tekst, UI en onboarding.",
    points: [
      "Productnaam: Inspannings Monitor",
      "Positionering: wellness / self-management",
      "Doelgroep: volwassen individuele gebruikers",
      "Voertaal release 1: Nederlands (nl-NL)",
      "Geen medische claims, geen zorgverlenerrollen",
      "Expliciete non-intended use vastgelegd als guardrail",
    ],
  },
  {
    number: "02",
    title: "Functionele specificatie MVP",
    version: "v06",
    summary:
      "Beschrijft de MVP in toetsbare functionele requirements. De kern is een plan-doe-evalueer-dagflow: ochtendcheck-in met energiescore en slaapkwaliteit, activiteitenplanning met een licht energiebudget, en een dagafsluiting. Elke stap is bewust klein gehouden om de cognitieve belasting laag te houden. Release 1 bevat geen AI, geen deelfunctionaliteit en geen medische workflows.",
    points: [
      "Ochtendcheck-in: energiescore (1–10) en slaapkwaliteit",
      "Dagbudget afgeleid van energiescore",
      "Activiteitenplanning met duur, impact en prioriteit",
      "Statussen: gepland → uitgevoerd / aangepast / overgeslagen",
      "Dashboard met dag-overzicht en energiemeter",
      "Geen sharing, AI of medische workflows in de MVP",
    ],
  },
  {
    number: "03",
    title: "Privacy, security en safety baseline",
    version: "v02",
    summary:
      "Bundelt de minimale randvoorwaarden voor privacy, informatiebeveiliging en productveiligheid. Gebruikersdata blijft strikt gescheiden via Row Level Security in Supabase. Authenticatie vereist e-mailverificatie. Gevoelige sleutels worden nooit in de frontend geplaatst. De baseline is ontworpen als minimumset die uitbreidbaar is als het product richting een medisch spoor beweegt.",
    points: [
      "Row Level Security: gebruikers zien alleen eigen data",
      "Supabase Auth met verplichte e-mailverificatie",
      "Service-role key alleen server-side, nooit in de frontend",
      "HTTPS-only via Vercel, geen gevoelige data in URL-params",
      "Geen opslag van medische of klinische gegevens",
      "Baseline uitbreidbaar richting NEN 7510 / MDR bij medisch spoor",
    ],
  },
  {
    number: "04",
    title: "Roadmap wellness naar medisch",
    version: "v02",
    summary:
      "Laat zien hoe Inspannings Monitor gecontroleerd kan doorgroeien naar een medisch product, zonder dat dit ongemerkt in de wellness-release binnensluipt. De roadmap onderscheidt drie fasen: verankerde wellness-MVP, optionele zorgverlenerlaag en een apart medisch productspoor. Elke fase kent eigen vereisten voor regelgeving, documentatie en technische architectuur.",
    points: [
      "Fase 1: wellness MVP — volledig buiten MDR-scope",
      "Fase 2: optionele zorgverlenerlaag met expliciete scope-bewaking",
      "Fase 3: apart medisch productspoor met eigen regulatoir traject",
      "Faseovergangen vereisen bewuste go/no-go beslissing",
      "Geen sluipende scope-uitbreiding zonder documentatieverandering",
      "Pad opengehouden zonder verplichting om het te bewandelen",
    ],
  },
  {
    number: "05",
    title: "Technische architectuur en implementatie",
    version: "v01",
    summary:
      "Beschrijft de technische implementatielaag van de wellness-first MVP als zelfstandig architectuurdocument. De stack is bewust compact gehouden: Next.js App Router met Server Actions, Supabase voor auth en data, en Vercel voor hosting en CI/CD. De architectuur is opgezet met duidelijke laagscheiding zodat uitbreiding naar een medisch spoor later geïsoleerd kan plaatsvinden.",
    points: [
      "Stack: Next.js 16 (App Router) + React 19 + TypeScript",
      "Database en auth: Supabase (PostgreSQL + Row Level Security)",
      "UI: shadcn/ui + Tailwind CSS, Dusk dark-mode thema",
      "Hosting en deploys: Vercel met GitHub Actions CI",
      "Server Actions voor alle formmutaties, geen aparte API-laag",
      "Migraties via supabase/migrations, seeding via npm-script",
    ],
  },
];

export default async function SpecificatiePage() {
  const authState = await getAuthState();

  if (!authState.isAuthenticated) {
    redirect("/login");
  }

  return (
    <AppShell contentClassName="space-y-8">
      <PageIntro
        eyebrow="Documentatie"
        title="Productspecificatie"
        description="Samenvatting van de vijf kerndocumenten die de scope, vereisten en architectuur van Inspannings Monitor vastleggen."
      />

      <div className="space-y-6">
        {chapters.map((chapter) => (
          <Card key={chapter.number} elevation="raised" className="pb-0">
            <CardHeader className="pb-0">
              <p className="text-xs font-semibold uppercase tracking-[0.24em] text-muted-foreground">
                Hoofdstuk {chapter.number} · {chapter.version}
              </p>
              <CardTitle className="text-2xl text-foreground">
                {chapter.title}
              </CardTitle>
              <CardDescription className="max-w-3xl text-sm leading-7 text-muted-foreground">
                {chapter.summary}
              </CardDescription>
            </CardHeader>
            <CardContent className="pb-6">
              <div className="mt-4 grid gap-2 sm:grid-cols-2">
                {chapter.points.map((point) => (
                  <Card key={point} tone="subtle" className="pb-0 shadow-none">
                    <CardContent className="px-4 py-3 text-sm leading-6 text-muted-foreground">
                      {point}
                    </CardContent>
                  </Card>
                ))}
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    </AppShell>
  );
}
