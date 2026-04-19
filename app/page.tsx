import Link from "next/link";
import { AppShell } from "@/components/navigation/app-shell";
import { PageIntro } from "@/components/navigation/page-intro";
import { StatusToastBridge } from "@/components/feedback/status-toast-bridge";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { getAuthStatusToast } from "@/lib/feedback/status-messages";
import { getParamValue, type PageSearchParams } from "@/lib/search-params";

export const dynamic = "force-dynamic";

const productLoop = [
  {
    title: "Check-in",
    copy: "Start de dag met een korte energiescore en slaapkwaliteit, zonder overbodige frictie.",
  },
  {
    title: "Plannen",
    copy: "Verdeel activiteiten over de dag met een licht energiebudget en duidelijke prioriteiten.",
  },
  {
    title: "Evalueren",
    copy: "Kijk rustig terug op wat wel, niet of aangepast is gelukt, zonder medische claims of oordeel.",
  },
];

const makerNotes = [
  "Jan Peter Visser ontwikkelt deze app als rustige, praktische dagtool.",
  "De app is bewust gericht op helderheid, lage cognitieve belasting en een wellness-first toon.",
  "Elke stap wordt klein gehouden zodat de flow bruikbaar blijft zonder medische framing.",
];

const appSpecs = [
  "Alleen individuele gebruikers in release 1",
  "Volwassen doelgroep en Nederlands als voertaal",
  "Wellness/self-management positionering",
  "Geen sharing, AI of medische workflows in de MVP",
  "Vercel + Supabase als technische basis",
];

type HomePageProps = {
  searchParams: Promise<PageSearchParams>;
};

export default async function Home({ searchParams }: HomePageProps) {
  const resolvedSearchParams = await searchParams;
  const statusToast = getAuthStatusToast(
    getParamValue(resolvedSearchParams, "error"),
    getParamValue(resolvedSearchParams, "status"),
  );

  return (
    <AppShell contentClassName="space-y-8">
      <div className="space-y-8">
        <StatusToastBridge toast={statusToast} paramKeys={["error", "status"]} />

        <PageIntro
          eyebrow="About"
          title="Over de maker en de app"
          description="Inspannings Monitor is een rustige wellness-first webapp voor volwassenen die hun energie willen plannen, uitvoeren en evalueren zonder medische claims of overmatige frictie."
          aside={
            <Link
              href="/planning"
              className="inline-flex items-center rounded-full border border-border/80 bg-card/84 px-4 py-2 text-sm font-medium text-foreground shadow-[var(--shadow-1)] transition-colors hover:bg-secondary"
            >
              Bekijk planning
            </Link>
          }
        />

        <section className="grid gap-6 lg:grid-cols-[1.05fr_0.95fr]">
          <Card elevation="raised" className="pb-0">
            <CardContent className="p-6 sm:p-8">
              <p className="mb-5 max-w-2xl text-lg leading-8 text-muted-foreground">
                Deze app wordt ontwikkeld door Jan Peter Visser als compacte dagtool
                voor energieplanning en zelfregie. Het doel is niet om te diagnosticeren
                of te behandelen, maar om een rustige plan-doe-evalueer-structuur te bieden
                die licht genoeg blijft voor dagelijks gebruik.
              </p>
              <div className="grid gap-4">
                {makerNotes.map((note) => (
                  <Card key={note} tone="subtle" className="pb-0 shadow-none">
                    <CardContent className="px-5 py-4 text-sm leading-7 text-muted-foreground">
                      {note}
                    </CardContent>
                  </Card>
                ))}
              </div>
            </CardContent>
          </Card>

          <Card tone="primary" elevation="raised" className="pb-0">
            <CardHeader className="px-6 pt-7 sm:px-8">
              <p className="text-xs font-semibold uppercase tracking-[0.24em] text-primary-foreground/75">
                Specificaties van de app
              </p>
            </CardHeader>
            <CardContent className="space-y-3 px-6 pb-7 sm:px-8">
              {appSpecs.map((item) => (
                <Card
                  key={item}
                  className="rounded-[var(--radius-2xl)] border-white/10 bg-white/8 pb-0 text-primary-foreground shadow-none"
                >
                  <CardContent className="px-4 py-3 text-sm leading-7">{item}</CardContent>
                </Card>
              ))}
              <p className="pt-2 text-sm leading-7 text-primary-foreground/80">
                De huidige codebasis bevat al auth, onboarding, ochtendcheck-in,
                planning, energiemeter en Dusk-theming.
              </p>
            </CardContent>
          </Card>
        </section>

        <Card elevation="raised" className="pb-0">
          <CardHeader className="pb-0">
            <p className="text-xs font-semibold uppercase tracking-[0.24em] text-muted-foreground">
              Dagflow
            </p>
            <CardTitle className="text-2xl">De hoofdstructuur van release 1</CardTitle>
          </CardHeader>
          <CardContent className="grid gap-5 p-6 md:grid-cols-3">
            {productLoop.map((step, index) => (
              <Card key={step.title} tone="subtle" className="pb-0 shadow-none">
                <CardHeader className="pb-0">
                  <p className="text-xs font-semibold uppercase tracking-[0.22em] text-muted-foreground">
                    Stap {index + 1}
                  </p>
                  <CardTitle className="font-[family-name:var(--font-display)] text-2xl">
                    {step.title}
                  </CardTitle>
                </CardHeader>
                <CardContent className="pb-5">
                  <CardDescription className="text-sm leading-7 text-muted-foreground">
                    {step.copy}
                  </CardDescription>
                </CardContent>
              </Card>
            ))}
          </CardContent>
        </Card>

        <Card tone="subtle" className="pb-0 backdrop-blur">
          <CardContent className="grid gap-5 p-6 sm:grid-cols-2 lg:grid-cols-4">
            <div>
              <p className="text-xs font-semibold uppercase tracking-[0.24em] text-muted-foreground">
                Positionering
              </p>
              <p className="mt-2 font-semibold text-foreground">Wellness / self-management</p>
            </div>
            <div>
              <p className="text-xs font-semibold uppercase tracking-[0.24em] text-muted-foreground">
                Doelgroep
              </p>
              <p className="mt-2 font-semibold text-foreground">Volwassen individuele gebruikers</p>
            </div>
            <div>
              <p className="text-xs font-semibold uppercase tracking-[0.24em] text-muted-foreground">
                Auth en data
              </p>
              <p className="mt-2 font-semibold text-foreground">Supabase Auth + PostgreSQL</p>
            </div>
            <div>
              <p className="text-xs font-semibold uppercase tracking-[0.24em] text-muted-foreground">
                Hosting
              </p>
              <p className="mt-2 font-semibold text-foreground">Next.js op Vercel</p>
            </div>
          </CardContent>
        </Card>
      </div>
    </AppShell>
  );
}
