import Link from "next/link";
import { redirect } from "next/navigation";
import { StatusToastBridge } from "@/components/feedback/status-toast-bridge";
import { AdHocActivityForm } from "@/components/planning/ad-hoc-activity-form";
import { AppShell } from "@/components/navigation/app-shell";
import { PageIntro } from "@/components/navigation/page-intro";
import { ActivityForm } from "@/components/planning/activity-form";
import { EnergyMeterCard } from "@/components/planning/energy-meter-card";
import { TodayActivitiesList } from "@/components/planning/today-activities-list";
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
import { getPlanningStatusToast } from "@/lib/feedback/status-messages";
import { getPlanningPageDataForCurrentUser } from "@/lib/planning/service";
import { calculatePlanningMeterSnapshot } from "@/lib/planning/meter";
import { getProfileBundleForCurrentUser } from "@/lib/profile/service";
import { getParamValue, type PageSearchParams } from "@/lib/search-params";

export const dynamic = "force-dynamic";

type PlanningPageProps = {
  searchParams: Promise<PageSearchParams>;
};

export default async function PlanningPage({ searchParams }: PlanningPageProps) {
  const authState = await getAuthState();
  const resolvedSearchParams = await searchParams;

  if (!authState.isConfigured) {
    redirect("/login?error=auth-not-configured");
  }

  if (!authState.isAuthenticated) {
    redirect(`/login?next=${encodeURIComponent(sanitizeNextPath("/planning"))}`);
  }

  const profileBundle = await getProfileBundleForCurrentUser();

  if (!profileBundle) {
    redirect(`/login?next=${encodeURIComponent(sanitizeNextPath("/planning"))}`);
  }

  if (!profileBundle.profile.onboardingSeen) {
    redirect("/onboarding");
  }

  const [planningPageData, checkInStatus] = await Promise.all([
    getPlanningPageDataForCurrentUser(),
    getTodayCheckInForCurrentUser(),
  ]);

  if (!planningPageData) {
    redirect(`/login?next=${encodeURIComponent(sanitizeNextPath("/planning"))}`);
  }

  const statusToast = getPlanningStatusToast(
    getParamValue(resolvedSearchParams, "error"),
    getParamValue(resolvedSearchParams, "status"),
  );
  const planningMeter = calculatePlanningMeterSnapshot(
    planningPageData.activities,
    checkInStatus?.todayCheckIn?.dailyBudget ?? null,
  );

  return (
    <AppShell contentClassName="space-y-8">
      <div className="space-y-8">
        <StatusToastBridge toast={statusToast} paramKeys={["error", "status"]} />

        <PageIntro
          eyebrow="Planning"
          title="Plan vandaag bewust klein"
          description="Voeg alleen activiteiten toe die vandaag echt relevant zijn. Houd de lijst licht, zodat je later goed kunt bijsturen zonder druk op te bouwen."
          aside={
            <Link
              href="/dashboard"
              className="inline-flex items-center rounded-full border border-border/80 bg-card/84 px-4 py-2 text-sm font-medium text-foreground shadow-[var(--shadow-1)] transition-colors hover:bg-secondary"
            >
              Terug naar dashboard
            </Link>
          }
        />

        <section className="grid gap-5 lg:grid-cols-[1.1fr_0.9fr]">
          <div className="space-y-5">
            <ActivityForm
              categories={planningPageData.categories}
              activities={planningPageData.activities}
              dailyBudget={checkInStatus?.todayCheckIn?.dailyBudget ?? null}
            />
            <AdHocActivityForm
              categories={planningPageData.categories}
              activities={planningPageData.activities}
              dailyBudget={checkInStatus?.todayCheckIn?.dailyBudget ?? null}
            />
          </div>

          <aside className="space-y-5">
            <Card className="py-0">
              <CardHeader className="pb-0">
                <p className="text-xs font-semibold uppercase tracking-[0.24em] text-muted-foreground">
                  Vandaag
                </p>
                <CardTitle className="text-lg text-foreground">
                  {planningPageData.activities.length === 0
                    ? "Start met een eerste activiteit"
                    : `${planningPageData.activities.length} activiteiten in beeld`}
                </CardTitle>
              </CardHeader>
              <CardContent className="pb-6">
                <CardDescription className="text-sm leading-7 text-muted-foreground">
                  Lokale datum: {planningPageData.activityDate} in timezone `{planningPageData.timezone}`.
                </CardDescription>
                {checkInStatus?.todayCheckIn ? (
                  <CardDescription className="mt-3 text-sm leading-7 text-muted-foreground">
                    Je check-in van vandaag staat klaar met een dagbudget van{" "}
                    {checkInStatus.todayCheckIn.dailyBudget} punten. Zowel geplande als
                    ongeplande activiteiten lopen mee in je dagtotaal.
                  </CardDescription>
                ) : (
                  <CardDescription className="mt-3 text-sm leading-7 text-muted-foreground">
                    Er is nog geen ochtendcheck-in van vandaag. Je kunt wel alvast
                    activiteiten vastleggen, maar je budgetmeter blijft pas echt
                    betekenisvol zodra je check-in er staat.
                  </CardDescription>
                )}
              </CardContent>
            </Card>

            <EnergyMeterCard meter={planningMeter} />

            <Card tone="primary" elevation="raised" className="py-0">
              <CardHeader className="pb-0">
                <p className="text-xs font-semibold uppercase tracking-[0.24em] text-primary-foreground/75">
                  Bewuste grens
                </p>
              </CardHeader>
              <CardContent className="space-y-3 pb-6 text-sm leading-7 text-primary-foreground/90">
                <p>Deze dagweergave blokkeert je niet en geeft bewust geen harde limieten.</p>
                <p>De meter gebruikt een eenvoudige, uitlegbare afleiding uit duur en impact.</p>
                <p>Ook ongeplande activiteiten tellen nu mee, zodat je dagbeeld dichter bij de werkelijkheid blijft.</p>
              </CardContent>
            </Card>
          </aside>
        </section>

        <TodayActivitiesList
          activities={planningPageData.activities}
          categories={planningPageData.categories}
          skipReasons={planningPageData.skipReasons}
        />
      </div>
    </AppShell>
  );
}
