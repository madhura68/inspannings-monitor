import Link from "next/link";
import { redirect } from "next/navigation";
import { CheckInCard } from "@/components/check-in/check-in-card";
import { StatusToastBridge } from "@/components/feedback/status-toast-bridge";
import { AppShell } from "@/components/navigation/app-shell";
import { PageIntro } from "@/components/navigation/page-intro";
import { EnergyMeterCard } from "@/components/planning/energy-meter-card";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { sanitizeNextPath } from "@/lib/auth/navigation";
import { getAuthState } from "@/lib/auth/session";
import { getTodayCheckInForCurrentUser } from "@/lib/check-in/service";
import { isTestWizardEnabled } from "@/lib/config/feature-flags";
import { getDashboardStatusToast } from "@/lib/feedback/status-messages";
import { getTodayActivitiesForCurrentUser } from "@/lib/planning/service";
import { calculatePlanningMeterSnapshot } from "@/lib/planning/meter";
import { getProfileBundleForCurrentUser } from "@/lib/profile/service";
import { getParamValue, type PageSearchParams } from "@/lib/search-params";

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
  const [checkInStatus, planningStatus] = await Promise.all([
    getTodayCheckInForCurrentUser(),
    getTodayActivitiesForCurrentUser(),
  ]);
  const statusToast = getDashboardStatusToast(getParamValue(resolvedSearchParams, "status"));

  if (!profile.onboardingSeen) {
    redirect("/onboarding");
  }

  const profileTitle = profile.displayName ?? profile.email ?? authState.email ?? "Ingelogde gebruiker";
  const onboardingState = profile.onboardingCompleted ? "Afgerond" : "Nog niet afgerond";
  const morningReminderState = settings.morningReminderEnabled
    ? `Aan om ${formatReminderTime(settings.morningReminderTime)}`
    : "Uit";
  const planningMeter = calculatePlanningMeterSnapshot(
    planningStatus?.activities ?? [],
    checkInStatus?.todayCheckIn?.dailyBudget ?? null,
  );

  return (
    <AppShell contentClassName="space-y-8">
      <div className="space-y-8">
        <StatusToastBridge toast={statusToast} />

        <PageIntro
          eyebrow="Dashboard"
          title="Je huidige dagstatus"
          description="Hier zie je in één overzicht je profielbasis, ochtendcheck-in, planningstatus en huidige energiemeter voor vandaag."
          aside={
            isTestWizardEnabled() ? (
              <Link
                href="/wizard-test"
                className="inline-flex items-center rounded-full border border-border/80 bg-card/84 px-4 py-2 text-sm font-medium text-foreground shadow-[var(--shadow-1)] transition-colors hover:bg-secondary"
              >
                Test wizard
              </Link>
            ) : null
          }
        />

        <section className="grid gap-5 md:grid-cols-3">
          <Card className="py-0">
            <CardHeader className="pb-0">
              <p className="text-xs font-semibold uppercase tracking-[0.24em] text-muted-foreground">
                Auth
              </p>
              <CardTitle className="text-lg text-foreground">Cookie-based sessie actief</CardTitle>
            </CardHeader>
            <CardContent className="pb-6">
              <CardDescription className="text-sm leading-7 text-muted-foreground">
                Gebruiker-ID `{authState.userId}` is server-side gevalideerd via Supabase SSR-auth.
              </CardDescription>
            </CardContent>
          </Card>

          <Card className="py-0">
            <CardHeader className="pb-0">
              <p className="text-xs font-semibold uppercase tracking-[0.24em] text-muted-foreground">
                Profiel
              </p>
              <CardTitle className="text-lg text-foreground">{profileTitle}</CardTitle>
            </CardHeader>
            <CardContent className="pb-6">
              <CardDescription className="text-sm leading-7 text-muted-foreground">
                Taal `{profile.locale}` en timezone `{profile.timezone}` staan nu per
                gebruiker opgeslagen.
              </CardDescription>
            </CardContent>
          </Card>

          <Card className="py-0">
            <CardHeader className="pb-0">
              <p className="text-xs font-semibold uppercase tracking-[0.24em] text-muted-foreground">
                Onboarding
              </p>
              <CardTitle className="text-lg text-foreground">{onboardingState}</CardTitle>
            </CardHeader>
            <CardContent className="pb-6">
              <CardDescription className="text-sm leading-7 text-muted-foreground">
                Nieuwe accounts starten bewust zonder afgeronde onboarding, zodat
                `ST-103` straks een duidelijke eerste flow kan aansturen.
              </CardDescription>
            </CardContent>
          </Card>

          <Card className="py-0">
            <CardHeader className="pb-0">
              <p className="text-xs font-semibold uppercase tracking-[0.24em] text-muted-foreground">
                Instellingen
              </p>
              <CardTitle className="text-lg text-foreground">
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

          <CheckInCard todayCheckIn={checkInStatus?.todayCheckIn ?? null} />

          <Card className="py-0">
            <CardHeader className="pb-0">
              <p className="text-xs font-semibold uppercase tracking-[0.24em] text-muted-foreground">
                Dagplanning
              </p>
              <CardTitle className="text-lg text-foreground">
                {planningStatus?.activities.length
                  ? `${planningStatus.activities.length} activiteiten voor vandaag`
                  : "Nog niets gepland voor vandaag"}
              </CardTitle>
            </CardHeader>
            <CardContent className="pb-6">
              <CardDescription className="text-sm leading-7 text-muted-foreground">
                Plan kleine, concrete activiteiten voor vandaag en bouw daarna verder op budgetfeedback en evaluatie.
              </CardDescription>
              <div className="mt-4">
                <Link href="/planning" className="inline-flex items-center rounded-full border border-border/80 bg-card/84 px-4 py-2 text-sm font-medium text-foreground shadow-[var(--shadow-1)] transition-colors hover:bg-secondary">
                  Open dagplanning
                </Link>
              </div>
            </CardContent>
          </Card>

          <EnergyMeterCard meter={planningMeter} tone="subtle" />

          {isTestWizardEnabled() ? (
            <Card className="py-0">
              <CardHeader className="pb-0">
                <p className="text-xs font-semibold uppercase tracking-[0.24em] text-muted-foreground">
                  Wizard core
                </p>
                <CardTitle className="text-lg text-foreground">Interne testwizard actief</CardTitle>
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
          <Card className="border-warning/32 bg-warning/16 py-0 text-foreground shadow-[var(--shadow-1)]">
            <CardContent className="flex flex-col gap-4 px-6 py-5 sm:flex-row sm:items-center sm:justify-between">
              <div>
                <p className="font-semibold">Je onboarding is nog niet afgerond.</p>
                <p className="mt-1 max-w-2xl text-sm leading-7 text-foreground/82">
                  Je kunt de korte flow later alsnog afronden om je basisinstellingen
                  en eerste voorkeuren vast te leggen.
                </p>
              </div>
                <Link href="/onboarding" className="inline-flex items-center rounded-full bg-warning px-4 py-2 text-sm font-medium text-foreground shadow-[var(--shadow-1)] transition-colors hover:brightness-[0.98]">
                  Rond onboarding af
                </Link>
            </CardContent>
          </Card>
        ) : (
          <Card tone="primary" elevation="raised" className="py-0">
            <CardContent className="flex flex-col gap-4 px-6 py-5 sm:flex-row sm:items-center sm:justify-between">
              <div>
                <p className="font-semibold">Je instellingen kun je nu ook los beheren.</p>
                <p className="mt-1 max-w-2xl text-sm leading-7 text-primary-foreground/85">
                  `ST-104` staat nu klaar als aparte route, zodat je reminders,
                  timezone en zichtbaarheid van punten later zelfstandig kunt aanpassen.
                </p>
              </div>
                <Link href="/settings" className="inline-flex items-center rounded-full bg-secondary px-4 py-2 text-sm font-medium text-secondary-foreground shadow-[var(--shadow-1)] transition-colors hover:brightness-[0.98]">
                  Open instellingen
                </Link>
              </CardContent>
            </Card>
          )}
      </div>
    </AppShell>
  );
}
