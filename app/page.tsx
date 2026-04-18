import Link from "next/link";
import { signOutAction } from "@/app/auth-actions";
import { StatusToastBridge } from "@/components/feedback/status-toast-bridge";
import { Button, buttonVariants } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { getAuthState } from "@/lib/auth/session";
import { getAuthStatusToast } from "@/lib/feedback/status-messages";
import { getParamValue, type PageSearchParams } from "@/lib/search-params";
import { cn } from "@/lib/utils";

export const dynamic = "force-dynamic";

const loopSteps = [
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

const releaseFocus = [
  "Alleen individuele gebruikers in release 1",
  "Wellness/self-management positionering",
  "Geen sharing, AI of medische workflows in de MVP",
  "Vercel + Supabase als technische basis",
];

type HomePageProps = {
  searchParams: Promise<PageSearchParams>;
};

export default async function Home({ searchParams }: HomePageProps) {
  const authState = await getAuthState();
  const resolvedSearchParams = await searchParams;
  const statusToast = getAuthStatusToast(
    getParamValue(resolvedSearchParams, "error"),
    getParamValue(resolvedSearchParams, "status"),
  );

  return (
    <main className="min-h-screen bg-[radial-gradient(circle_at_top,_rgba(167,201,87,0.22),_transparent_32%),linear-gradient(180deg,_#f5f4ee_0%,_#eef2e6_100%)] text-slate-900">
      <div className="mx-auto flex min-h-screen w-full max-w-6xl flex-col px-6 py-10 sm:px-8 lg:px-10">
        <header className="mb-10 flex items-center justify-between border-b border-black/10 pb-5">
          <div>
            <p className="text-xs font-semibold uppercase tracking-[0.24em] text-slate-600">
              Inspannings Monitor
            </p>
            <h1 className="font-[family-name:var(--font-display)] text-3xl leading-tight sm:text-5xl">
              Rustige basis voor een wellness-first MVP
            </h1>
          </div>
          <div className="flex flex-wrap items-center justify-end gap-3">
            {authState.isConfigured ? (
              authState.isAuthenticated ? (
                <>
                  <Link
                    href="/dashboard"
                    className={cn(
                      buttonVariants({ variant: "outline", size: "lg" }),
                      "h-11 shrink-0 whitespace-nowrap rounded-full px-5",
                    )}
                  >
                    Naar dashboard
                  </Link>
                  <form action={signOutAction}>
                    <Button type="submit" variant="outline" size="lg" className="h-11 shrink-0 whitespace-nowrap rounded-full px-5">
                      Uitloggen
                    </Button>
                  </form>
                </>
              ) : (
                <>
                  <Link
                    href="/login"
                    className={cn(
                      buttonVariants({ variant: "outline", size: "lg" }),
                      "h-11 shrink-0 whitespace-nowrap rounded-full px-5",
                    )}
                  >
                    Inloggen
                  </Link>
                  <Link
                    href="/sign-up"
                    className={cn(
                      buttonVariants({ variant: "outline", size: "lg" }),
                      "h-11 shrink-0 whitespace-nowrap rounded-full px-5",
                    )}
                  >
                    Account aanmaken
                  </Link>
                </>
              )
            ) : (
              <span className="rounded-full border border-amber-900/15 bg-amber-50 px-4 py-2 text-sm font-medium text-amber-900 shadow-sm">
                Supabase nog niet geconfigureerd
              </span>
            )}
          </div>
        </header>

        <StatusToastBridge toast={statusToast} paramKeys={["error", "status"]} />

        <section className="grid gap-6 lg:grid-cols-[1.35fr_0.95fr]">
          <Card className="rounded-[2rem] border border-border/60 bg-card/90 py-0 shadow-[0_18px_60px_rgba(71,85,105,0.12)] backdrop-blur">
            <CardContent className="p-6 sm:p-8">
              <p className="mb-4 max-w-2xl text-lg leading-8 text-slate-700">
              De projectbasis staat nu, inclusief de eerste auth-laag via Supabase.
              Release 1 blijft bewust smal: publieke landing, aparte login/signup
              routes en een eerste protected dashboard als basis voor de volgende stories.
              </p>
              <div className="grid gap-4 md:grid-cols-3">
                {loopSteps.map((step, index) => (
                  <Card
                    key={step.title}
                    className="rounded-[1.5rem] border border-border/50 bg-background/80 py-0 shadow-none"
                  >
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
              </div>
            </CardContent>
          </Card>

          <Card className="rounded-[2rem] border border-primary/10 bg-primary py-0 text-primary-foreground shadow-[0_18px_60px_rgba(22,58,43,0.18)]">
            <CardHeader className="px-6 pt-7 sm:px-8">
              <p className="text-xs font-semibold uppercase tracking-[0.24em] text-primary-foreground/75">
                Release 1 focus
              </p>
            </CardHeader>
            <CardContent className="space-y-3 px-6 pb-7 sm:px-8">
              {releaseFocus.map((item) => (
                <Card
                  key={item}
                  className="rounded-[1.5rem] border border-white/10 bg-white/8 py-0 text-primary-foreground shadow-none"
                >
                  <CardContent className="px-4 py-3 text-sm leading-7">{item}</CardContent>
                </Card>
              ))}
              {authState.isConfigured ? (
                <p className="pt-2 text-sm leading-7 text-primary-foreground/80">
                  Auth is ingericht met e-mail, wachtwoord en verplichte e-mailverificatie.
                </p>
              ) : (
                <p className="pt-2 text-sm leading-7 text-primary-foreground/80">
                  Voeg `.env.local` toe om login, signup en protected routes lokaal te activeren.
                </p>
              )}
            </CardContent>
          </Card>
        </section>

        <Card className="mt-8 rounded-[2rem] border border-border/60 bg-card/80 py-0 shadow-[0_10px_45px_rgba(71,85,105,0.08)] backdrop-blur">
          <CardContent className="grid gap-5 p-6 sm:grid-cols-2 lg:grid-cols-4">
            <div>
              <p className="text-xs font-semibold uppercase tracking-[0.24em] text-muted-foreground">
                Volgende story
              </p>
              <p className="mt-2 font-semibold text-slate-900">ST-201 Ochtendcheck-in</p>
            </div>
            <div>
              <p className="text-xs font-semibold uppercase tracking-[0.24em] text-muted-foreground">
                Doelgroep
              </p>
              <p className="mt-2 font-semibold text-slate-900">Volwassen individuele gebruikers</p>
            </div>
            <div>
              <p className="text-xs font-semibold uppercase tracking-[0.24em] text-muted-foreground">
                Positionering
              </p>
              <p className="mt-2 font-semibold text-slate-900">Wellness / self-management</p>
            </div>
            <div>
              <p className="text-xs font-semibold uppercase tracking-[0.24em] text-muted-foreground">
                Status
              </p>
              <p className="mt-2 font-semibold text-slate-900">Auth, onboarding en settings actief</p>
            </div>
          </CardContent>
        </Card>
      </div>
    </main>
  );
}
