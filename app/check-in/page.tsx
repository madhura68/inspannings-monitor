import Link from "next/link";
import { redirect } from "next/navigation";
import { signOutAction } from "@/app/auth-actions";
import { StatusToastBridge } from "@/components/feedback/status-toast-bridge";
import { CheckInForm } from "@/components/check-in/check-in-form";
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
import { formatEnergyLevelLabel } from "@/lib/check-in/budget";
import { getTodayCheckInForCurrentUser } from "@/lib/check-in/service";
import { getCheckInStatusToast } from "@/lib/feedback/status-messages";
import { getProfileBundleForCurrentUser } from "@/lib/profile/service";
import { getParamValue, type PageSearchParams } from "@/lib/search-params";
import { cn } from "@/lib/utils";

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
    <main className="app-page">
      <div className="mx-auto flex max-w-6xl flex-col gap-8">
        <StatusToastBridge toast={statusToast} paramKeys={["error", "status"]} />

        <header className="app-page-header">
          <div>
            <div className="app-page-breadcrumb">
              <Link href="/dashboard" className="app-page-link">
                Dashboard
              </Link>
              <span>/</span>
              <span>Ochtendcheck-in</span>
            </div>
            <h1 className="mt-3 font-[family-name:var(--font-display)] text-4xl leading-tight">
              Ochtendcheck-in van vandaag
            </h1>
            <p className="app-page-copy">
              Houd je start rustig en klein. Je legt alleen een energiescore en een
              globale slaapindruk vast voor vandaag.
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
          <CheckInForm todayCheckIn={checkInStatus?.todayCheckIn ?? null} />

          <aside className="space-y-5">
            <Card className="py-0">
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

            <Card tone="primary" elevation="raised" className="py-0">
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
    </main>
  );
}
