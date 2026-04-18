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
              <span>Instellingen</span>
            </div>
            <h1 className="mt-3 font-[family-name:var(--font-display)] text-4xl leading-tight">
              Instellingen
            </h1>
            <p className="mt-4 max-w-2xl text-base leading-8 text-slate-700">
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
            <Card className="rounded-[1.75rem] border border-border/60 bg-card/90 py-0 shadow-[0_12px_40px_rgba(71,85,105,0.08)]">
              <CardHeader className="pb-0">
                <p className="text-xs font-semibold uppercase tracking-[0.24em] text-muted-foreground">
                  Account
                </p>
                <CardTitle className="text-lg text-slate-900">{profileTitle}</CardTitle>
              </CardHeader>
              <CardContent className="pb-6">
                <CardDescription className="text-sm leading-7 text-muted-foreground">
                  E-mailadres: {profileBundle.profile.email ?? authState.email ?? "Onbekend"}
                </CardDescription>
              </CardContent>
            </Card>

            <Card className="rounded-[1.75rem] border border-border/60 bg-card/90 py-0 shadow-[0_12px_40px_rgba(71,85,105,0.08)]">
              <CardHeader className="pb-0">
                <p className="text-xs font-semibold uppercase tracking-[0.24em] text-muted-foreground">
                  Huidige status
                </p>
                <CardTitle className="text-lg text-slate-900">
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
