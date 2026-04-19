import Link from "next/link";
import { redirect } from "next/navigation";
import { StatusToastBridge } from "@/components/feedback/status-toast-bridge";
import { AppShell } from "@/components/navigation/app-shell";
import { PageIntro } from "@/components/navigation/page-intro";
import { CheckInForm } from "@/components/check-in/check-in-form";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { sanitizeNextPath } from "@/lib/auth/navigation";
import { getAuthState } from "@/lib/auth/session";
import { formatEnergyLevelLabel } from "@/lib/check-in/budget";
import { getTodayCheckInForCurrentUser } from "@/lib/check-in/service";
import { getCheckInStatusToast } from "@/lib/feedback/status-messages";
import { getProfileBundleForCurrentUser } from "@/lib/profile/service";
import { getParamValue, type PageSearchParams } from "@/lib/search-params";

export const dynamic = "force-dynamic";

type CheckInPageProps = {
  searchParams: Promise<PageSearchParams>;
};

export default async function CheckInPage({ searchParams }: CheckInPageProps) {
  const authState = await getAuthState();
  const resolvedSearchParams = await searchParams;

  if (!authState.isConfigured) {
    redirect("/login?error=auth-not-configured");
  }

  if (!authState.isAuthenticated) {
    redirect(`/login?next=${encodeURIComponent(sanitizeNextPath("/check-in"))}`);
  }

  const profileBundle = await getProfileBundleForCurrentUser();

  if (!profileBundle) {
    redirect(`/login?next=${encodeURIComponent(sanitizeNextPath("/check-in"))}`);
  }

  if (!profileBundle.profile.onboardingSeen) {
    redirect("/onboarding");
  }

  const checkInStatus = await getTodayCheckInForCurrentUser();
  const statusToast = getCheckInStatusToast(
    getParamValue(resolvedSearchParams, "error"),
    getParamValue(resolvedSearchParams, "status"),
  );

  return (
    <AppShell contentClassName="space-y-8">
      <div className="space-y-8">
        <StatusToastBridge toast={statusToast} paramKeys={["error", "status"]} />

        <PageIntro
          eyebrow="Check-in"
          title="Ochtendcheck-in van vandaag"
          description="Houd je start rustig en klein. Je legt alleen een energiescore en een globale slaapindruk vast voor vandaag."
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
          <CheckInForm todayCheckIn={checkInStatus?.todayCheckIn ?? null} />

          <aside className="space-y-5">
            <Card className="pb-0">
              <CardHeader className="pb-0">
                <p className="text-xs font-semibold uppercase tracking-[0.24em] text-muted-foreground">
                  Vandaag
                </p>
                <CardTitle className="text-lg text-foreground">
                  {checkInStatus?.todayCheckIn ? "Check-in staat al klaar" : "Nog geen check-in"}
                </CardTitle>
              </CardHeader>
              <CardContent className="pb-6">
              <CardDescription className="text-sm leading-7 text-muted-foreground">
                Lokale datum: {checkInStatus?.todayDate ?? "Onbekend"} in timezone{" "}
                  `{profileBundle.profile.timezone}`.
                </CardDescription>
                {checkInStatus?.todayCheckIn ? (
                  <CardDescription className="mt-3 text-sm leading-7 text-muted-foreground">
                    Laatste resultaat: niveau{" "}
                    {formatEnergyLevelLabel(checkInStatus.todayCheckIn.energyLevel).toLowerCase()} met een budget van{" "}
                    {checkInStatus.todayCheckIn.dailyBudget} punten.
                  </CardDescription>
                ) : null}
              </CardContent>
            </Card>

            <Card tone="primary" elevation="raised" className="pb-0">
              <CardHeader className="pb-0">
                <p className="text-xs font-semibold uppercase tracking-[0.24em] text-primary-foreground/75">
                  Bewuste grens
                </p>
              </CardHeader>
              <CardContent className="space-y-3 pb-6 text-sm leading-7 text-primary-foreground/90">
                <p>Deze check-in geeft geen diagnose of medische interpretatie.</p>
                <p>Je legt alleen een rustige momentopname van vandaag vast.</p>
                <p>Budget v1 blijft bewust eenvoudig: het dagbudget volgt direct uit je energiescore.</p>
              </CardContent>
            </Card>
          </aside>
        </section>
      </div>
    </AppShell>
  );
}
