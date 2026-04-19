import Link from "next/link";
import { redirect } from "next/navigation";
import { signOutAction } from "@/app/auth-actions";
import { StatusToastBridge } from "@/components/feedback/status-toast-bridge";
import { ActivityForm } from "@/components/planning/activity-form";
import { EnergyMeterCard } from "@/components/planning/energy-meter-card";
import { TodayActivitiesList } from "@/components/planning/today-activities-list";
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
import { getTodayCheckInForCurrentUser } from "@/lib/check-in/service";
import { getPlanningStatusToast } from "@/lib/feedback/status-messages";
import { getPlanningPageDataForCurrentUser } from "@/lib/planning/service";
import { calculatePlanningMeterSnapshot } from "@/lib/planning/meter";
import { getProfileBundleForCurrentUser } from "@/lib/profile/service";
import { getParamValue, type PageSearchParams } from "@/lib/search-params";
import { cn } from "@/lib/utils";

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
    <main className="min-h-screen bg-[radial-gradient(circle_at_top,_rgba(167,201,87,0.22),_transparent_32%),linear-gradient(180deg,_#f5f4ee_0%,_#eef2e6_100%)] px-6 py-10 text-slate-900 sm:px-8">
      <div className="mx-auto flex max-w-6xl flex-col gap-8">
        <StatusToastBridge toast={statusToast} paramKeys={["error", "status"]} />

        <header className="flex flex-col gap-5 rounded-[2rem] border border-black/10 bg-white/75 p-6 shadow-[0_18px_60px_rgba(71,85,105,0.12)] backdrop-blur sm:flex-row sm:items-start sm:justify-between sm:p-8">
          <div>
            <div className="flex flex-wrap items-center gap-3 text-xs font-semibold uppercase tracking-[0.24em] text-slate-500">
              <Link href="/dashboard" className="transition hover:text-slate-900">
                Dashboard
              </Link>
              <span>/</span>
              <span>Dagplanning</span>
            </div>
            <h1 className="mt-3 font-[family-name:var(--font-display)] text-4xl leading-tight">
              Plan vandaag bewust klein
            </h1>
            <p className="mt-4 max-w-2xl text-base leading-8 text-slate-700">
              Voeg alleen activiteiten toe die vandaag echt relevant zijn. Houd de lijst licht,
              zodat je later goed kunt bijsturen zonder druk op te bouwen.
            </p>
          </div>

          <div className="flex flex-wrap items-center gap-3">
            <Link
              href="/dashboard"
              className={cn(
                buttonVariants({ variant: "outline", size: "lg" }),
                "h-11 rounded-full px-5",
              )}
            >
              Terug naar dashboard
            </Link>
            <form action={signOutAction}>
              <Button type="submit" size="lg" className="h-11 rounded-full px-5">
                Uitloggen
              </Button>
            </form>
          </div>
        </header>

        <section className="grid gap-5 lg:grid-cols-[1.1fr_0.9fr]">
          <ActivityForm
            categories={planningPageData.categories}
            activities={planningPageData.activities}
            dailyBudget={checkInStatus?.todayCheckIn?.dailyBudget ?? null}
          />

          <aside className="space-y-5">
            <Card className="rounded-[1.75rem] border border-border/60 bg-card/90 py-0 shadow-[0_12px_40px_rgba(71,85,105,0.08)]">
              <CardHeader className="pb-0">
                <p className="text-xs font-semibold uppercase tracking-[0.24em] text-muted-foreground">
                  Vandaag
                </p>
                <CardTitle className="text-lg text-slate-900">
                  {planningPageData.activities.length === 0
                    ? "Start met een eerste activiteit"
                    : `${planningPageData.activities.length} activiteiten ingepland`}
                </CardTitle>
              </CardHeader>
              <CardContent className="pb-6">
                <CardDescription className="text-sm leading-7 text-muted-foreground">
                  Lokale datum: {planningPageData.activityDate} in timezone `{planningPageData.timezone}`.
                </CardDescription>
                {checkInStatus?.todayCheckIn ? (
                  <CardDescription className="mt-3 text-sm leading-7 text-muted-foreground">
                    Je check-in van vandaag staat klaar met een dagbudget van{" "}
                    {checkInStatus.todayCheckIn.dailyBudget} punten.
                  </CardDescription>
                ) : (
                  <CardDescription className="mt-3 text-sm leading-7 text-muted-foreground">
                    Er is nog geen ochtendcheck-in van vandaag. Je kunt wel alvast plannen,
                    maar je budgetmeter volgt in de volgende stories.
                  </CardDescription>
                )}
              </CardContent>
            </Card>

            <EnergyMeterCard meter={planningMeter} />

            <Card className="rounded-[1.75rem] border border-primary/15 bg-primary py-0 text-primary-foreground shadow-[0_12px_40px_rgba(22,58,43,0.18)]">
              <CardHeader className="pb-0">
                <p className="text-xs font-semibold uppercase tracking-[0.24em] text-primary-foreground/75">
                  Bewuste grens
                </p>
              </CardHeader>
              <CardContent className="space-y-3 pb-6 text-sm leading-7 text-primary-foreground/90">
                <p>Deze planning blokkeert je niet en geeft nog geen harde waarschuwingen.</p>
                <p>Je meter gebruikt een eenvoudige, uitlegbare afleiding uit duur en impact.</p>
                <p>Niet-blokkerende overschrijdingsfeedback volgt in `ST-305`.</p>
              </CardContent>
            </Card>
          </aside>
        </section>

        <TodayActivitiesList
          activities={planningPageData.activities}
          categories={planningPageData.categories}
        />
      </div>
    </main>
  );
}
