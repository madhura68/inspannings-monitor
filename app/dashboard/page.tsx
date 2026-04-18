import Link from "next/link";
import { redirect } from "next/navigation";
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
import { sanitizeNextPath } from "@/lib/auth/navigation";
import { getAuthState } from "@/lib/auth/session";
import { isTestWizardEnabled } from "@/lib/config/feature-flags";
import { getDashboardStatusToast } from "@/lib/feedback/status-messages";
import { getProfileBundleForCurrentUser } from "@/lib/profile/service";
import { getParamValue, type PageSearchParams } from "@/lib/search-params";
import { cn } from "@/lib/utils";

export const dynamic = "force-dynamic";

type DashboardPageProps = {
  searchParams: Promise<PageSearchParams>;
};

function formatToggleState(value: boolean, enabledLabel = "Aan", disabledLabel = "Uit") {
  return value ? enabledLabel : disabledLabel;
}

function formatReminderTime(value: string | null) {
  return value ? value.slice(0, 5) : "Nog niet ingesteld";
}

export default async function DashboardPage({ searchParams }: DashboardPageProps) {
  const authState = await getAuthState();
  const resolvedSearchParams = await searchParams;

  if (!authState.isConfigured) {
    redirect("/login?error=auth-not-configured");
  }

  if (!authState.isAuthenticated) {
    redirect(`/login?next=${encodeURIComponent(sanitizeNextPath("/dashboard"))}`);
  }

  const profileBundle = await getProfileBundleForCurrentUser();

  if (!profileBundle) {
    redirect(`/login?next=${encodeURIComponent(sanitizeNextPath("/dashboard"))}`);
  }

  const { profile, settings } = profileBundle;
  const statusToast = getDashboardStatusToast(getParamValue(resolvedSearchParams, "status"));

  if (!profile.onboardingSeen) {
    redirect("/onboarding");
  }

  const profileTitle = profile.displayName ?? profile.email ?? authState.email ?? "Ingelogde gebruiker";
  const onboardingState = profile.onboardingCompleted ? "Afgerond" : "Nog niet afgerond";
  const morningReminderState = settings.morningReminderEnabled
    ? `Aan om ${formatReminderTime(settings.morningReminderTime)}`
    : "Uit";

  return (
    <main className="min-h-screen bg-[radial-gradient(circle_at_top,_rgba(167,201,87,0.22),_transparent_32%),linear-gradient(180deg,_#f5f4ee_0%,_#eef2e6_100%)] px-6 py-10 text-slate-900 sm:px-8">
      <div className="mx-auto flex max-w-6xl flex-col gap-8">
        <StatusToastBridge toast={statusToast} />

        <header className="flex flex-col gap-5 rounded-[2rem] border border-black/10 bg-white/75 p-6 shadow-[0_18px_60px_rgba(71,85,105,0.12)] backdrop-blur sm:flex-row sm:items-start sm:justify-between sm:p-8">
          <div>
            <p className="text-xs font-semibold uppercase tracking-[0.24em] text-slate-500">
              Protected route
            </p>
            <h1 className="mt-3 font-[family-name:var(--font-display)] text-4xl leading-tight">
              Dashboard placeholder voor release 1
            </h1>
            <p className="mt-4 max-w-2xl text-base leading-8 text-slate-700">
              Je sessie is server-side gevalideerd en het minimale profielbundle is
              nu beschikbaar. Daarmee staat de fundering voor onboarding, settings
              en de eerste energieflows klaar.
            </p>
          </div>

          <form action={signOutAction}>
            <div className="flex flex-wrap items-center gap-3">
              <Link
                href="/settings"
                className={cn(
                  buttonVariants({ variant: "outline", size: "lg" }),
                  "h-11 rounded-full px-5",
                )}
              >
                Instellingen
              </Link>
              {isTestWizardEnabled() ? (
                <Link
                  href="/wizard-test"
                  className={cn(
                    buttonVariants({ variant: "outline", size: "lg" }),
                    "h-11 rounded-full px-5",
                  )}
                >
                  Test wizard
                </Link>
              ) : null}
              <Button type="submit" size="lg" className="h-11 rounded-full px-5">
                Uitloggen
              </Button>
            </div>
          </form>
        </header>

        <section className="grid gap-5 md:grid-cols-3">
          <Card className="rounded-[1.75rem] border border-border/60 bg-card/90 py-0 shadow-[0_12px_40px_rgba(71,85,105,0.08)]">
            <CardHeader className="pb-0">
              <p className="text-xs font-semibold uppercase tracking-[0.24em] text-muted-foreground">
                Auth
              </p>
              <CardTitle className="text-lg text-slate-900">Cookie-based sessie actief</CardTitle>
            </CardHeader>
            <CardContent className="pb-6">
              <CardDescription className="text-sm leading-7 text-muted-foreground">
                Gebruiker-ID `{authState.userId}` is server-side gevalideerd via Supabase SSR-auth.
              </CardDescription>
            </CardContent>
          </Card>

          <Card className="rounded-[1.75rem] border border-border/60 bg-card/90 py-0 shadow-[0_12px_40px_rgba(71,85,105,0.08)]">
            <CardHeader className="pb-0">
              <p className="text-xs font-semibold uppercase tracking-[0.24em] text-muted-foreground">
                Profiel
              </p>
              <CardTitle className="text-lg text-slate-900">{profileTitle}</CardTitle>
            </CardHeader>
            <CardContent className="pb-6">
              <CardDescription className="text-sm leading-7 text-muted-foreground">
                Taal `{profile.locale}` en timezone `{profile.timezone}` staan nu per
                gebruiker opgeslagen.
              </CardDescription>
            </CardContent>
          </Card>

          <Card className="rounded-[1.75rem] border border-border/60 bg-card/90 py-0 shadow-[0_12px_40px_rgba(71,85,105,0.08)]">
            <CardHeader className="pb-0">
              <p className="text-xs font-semibold uppercase tracking-[0.24em] text-muted-foreground">
                Onboarding
              </p>
              <CardTitle className="text-lg text-slate-900">{onboardingState}</CardTitle>
            </CardHeader>
            <CardContent className="pb-6">
              <CardDescription className="text-sm leading-7 text-muted-foreground">
                Nieuwe accounts starten bewust zonder afgeronde onboarding, zodat
                `ST-103` straks een duidelijke eerste flow kan aansturen.
              </CardDescription>
            </CardContent>
          </Card>

          <Card className="rounded-[1.75rem] border border-border/60 bg-card/90 py-0 shadow-[0_12px_40px_rgba(71,85,105,0.08)]">
            <CardHeader className="pb-0">
              <p className="text-xs font-semibold uppercase tracking-[0.24em] text-muted-foreground">
                Instellingen
              </p>
              <CardTitle className="text-lg text-slate-900">
                Punten {formatToggleState(settings.showEnergyPoints, "zichtbaar", "verborgen")}
              </CardTitle>
            </CardHeader>
            <CardContent className="pb-6">
              <CardDescription className="text-sm leading-7 text-muted-foreground">
                Ochtendreminder: {morningReminderState}. Reflectieprompts:{" "}
                {formatToggleState(settings.reflectionReminderEnabled)}.
              </CardDescription>
            </CardContent>
          </Card>

          {isTestWizardEnabled() ? (
            <Card className="rounded-[1.75rem] border border-border/60 bg-card/90 py-0 shadow-[0_12px_40px_rgba(71,85,105,0.08)]">
              <CardHeader className="pb-0">
                <p className="text-xs font-semibold uppercase tracking-[0.24em] text-muted-foreground">
                  Wizard core
                </p>
                <CardTitle className="text-lg text-slate-900">Interne testwizard actief</CardTitle>
              </CardHeader>
              <CardContent className="pb-6">
                <CardDescription className="text-sm leading-7 text-muted-foreground">
                  Gebruik deze alleen in development of preview om nieuwe multi-step flows te controleren.
                </CardDescription>
              </CardContent>
            </Card>
          ) : null}
        </section>

        {!profile.onboardingCompleted ? (
          <Card className="rounded-[1.75rem] border border-amber-900/15 bg-amber-50 py-0 text-amber-950 shadow-[0_12px_40px_rgba(146,64,14,0.08)]">
            <CardContent className="flex flex-col gap-4 px-6 py-5 sm:flex-row sm:items-center sm:justify-between">
              <div>
                <p className="font-semibold">Je onboarding is nog niet afgerond.</p>
                <p className="mt-1 max-w-2xl text-sm leading-7 text-amber-900">
                  Je kunt de korte flow later alsnog afronden om je basisinstellingen
                  en eerste voorkeuren vast te leggen.
                </p>
              </div>
              <Link
                href="/onboarding"
                className={cn(
                  buttonVariants({ size: "lg" }),
                  "h-11 shrink-0 rounded-full bg-amber-950 px-5 text-amber-50 hover:bg-amber-900",
                )}
              >
                Rond onboarding af
              </Link>
            </CardContent>
          </Card>
        ) : (
          <Card className="rounded-[1.75rem] border border-primary/10 bg-primary py-0 text-primary-foreground shadow-[0_12px_40px_rgba(22,58,43,0.18)]">
            <CardContent className="flex flex-col gap-4 px-6 py-5 sm:flex-row sm:items-center sm:justify-between">
              <div>
                <p className="font-semibold">Je instellingen kun je nu ook los beheren.</p>
                <p className="mt-1 max-w-2xl text-sm leading-7 text-primary-foreground/85">
                  `ST-104` staat nu klaar als aparte route, zodat je reminders,
                  timezone en zichtbaarheid van punten later zelfstandig kunt aanpassen.
                </p>
              </div>
              <Link
                href="/settings"
                className={cn(
                  buttonVariants({ variant: "secondary", size: "lg" }),
                  "h-11 shrink-0 rounded-full px-5",
                )}
              >
                Open instellingen
              </Link>
            </CardContent>
          </Card>
        )}
      </div>
    </main>
  );
}
