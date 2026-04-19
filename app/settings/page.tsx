import Link from "next/link";
import { redirect } from "next/navigation";
import { signOutAction } from "@/app/auth-actions";
import { StatusToastBridge } from "@/components/feedback/status-toast-bridge";
import { SettingsForm } from "@/components/settings/settings-form";
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
import { getSettingsStatusToast } from "@/lib/feedback/status-messages";
import { getProfileBundleForCurrentUser } from "@/lib/profile/service";
import { getParamValue, type PageSearchParams } from "@/lib/search-params";
import { cn } from "@/lib/utils";

export const dynamic = "force-dynamic";

type SettingsPageProps = {
  searchParams: Promise<PageSearchParams>;
};

export default async function SettingsPage({ searchParams }: SettingsPageProps) {
  const authState = await getAuthState();
  const resolvedSearchParams = await searchParams;

  if (!authState.isConfigured) {
    redirect("/login?error=auth-not-configured");
  }

  if (!authState.isAuthenticated) {
    redirect(`/login?next=${encodeURIComponent(sanitizeNextPath("/settings"))}`);
  }

  const profileBundle = await getProfileBundleForCurrentUser();

  if (!profileBundle) {
    redirect(`/login?next=${encodeURIComponent(sanitizeNextPath("/settings"))}`);
  }

  if (!profileBundle.profile.onboardingSeen) {
    redirect("/onboarding");
  }

  const statusToast = getSettingsStatusToast(
    getParamValue(resolvedSearchParams, "error"),
    getParamValue(resolvedSearchParams, "status"),
  );
  const profileTitle =
    profileBundle.profile.displayName ??
    profileBundle.profile.email ??
    authState.email ??
    "Ingelogde gebruiker";

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
              <span>Instellingen</span>
            </div>
            <h1 className="mt-3 font-[family-name:var(--font-display)] text-4xl leading-tight">
              Instellingen
            </h1>
            <p className="app-page-copy">
              Pas je basisvoorkeuren rustig aan. Alles blijft beperkt tot jouw eigen
              account en de wellness-first scope van release 1.
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
          <SettingsForm profileBundle={profileBundle} />

          <aside className="space-y-5">
            <Card className="py-0">
              <CardHeader className="pb-0">
                <p className="text-xs font-semibold uppercase tracking-[0.24em] text-muted-foreground">
                  Account
                </p>
                <CardTitle className="text-lg text-foreground">{profileTitle}</CardTitle>
              </CardHeader>
              <CardContent className="pb-6">
                <CardDescription className="text-sm leading-7 text-muted-foreground">
                  E-mailadres: {profileBundle.profile.email ?? authState.email ?? "Onbekend"}
                </CardDescription>
              </CardContent>
            </Card>

            <Card className="py-0">
              <CardHeader className="pb-0">
                <p className="text-xs font-semibold uppercase tracking-[0.24em] text-muted-foreground">
                  Huidige status
                </p>
                <CardTitle className="text-lg text-foreground">
                  Onboarding {profileBundle.profile.onboardingCompleted ? "afgerond" : "later afronden"}
                </CardTitle>
              </CardHeader>
              <CardContent className="pb-6">
                <CardDescription className="text-sm leading-7 text-muted-foreground">
                  Je kunt later altijd terug naar onboarding of direct verder bouwen op
                  deze voorkeuren in de dagflow.
                </CardDescription>
              </CardContent>
            </Card>
          </aside>
        </section>
      </div>
    </main>
  );
}
