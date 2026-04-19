import Link from "next/link";
import { redirect } from "next/navigation";
import { StatusToastBridge } from "@/components/feedback/status-toast-bridge";
import { AppShell } from "@/components/navigation/app-shell";
import { PageIntro } from "@/components/navigation/page-intro";
import { ProfileAvatar } from "@/components/profile/profile-avatar";
import { SettingsForm } from "@/components/settings/settings-form";
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
    <AppShell contentClassName="space-y-8">
      <div className="space-y-8">
        <StatusToastBridge toast={statusToast} paramKeys={["error", "status"]} />

        <PageIntro
          eyebrow="Instellingen"
          title="Basisinstellingen voor jouw account"
          description="Pas je basisvoorkeuren rustig aan. Alles blijft beperkt tot jouw eigen account en de wellness-first scope van release 1."
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
          <SettingsForm profileBundle={profileBundle} />

          <aside className="space-y-5">
            <Card className="py-0">
              <CardHeader className="pb-0">
                <p className="text-xs font-semibold uppercase tracking-[0.24em] text-muted-foreground">
                  Account
                </p>
              </CardHeader>
              <CardContent className="space-y-4 pb-6">
                <div className="flex items-center gap-4">
                  <ProfileAvatar
                    avatarUrl={profileBundle.profile.avatarUrl}
                    displayName={profileBundle.profile.displayName}
                    email={profileBundle.profile.email}
                    size="md"
                  />
                  <div className="space-y-1">
                    <CardTitle className="text-lg text-foreground">{profileTitle}</CardTitle>
                    <CardDescription className="text-sm leading-7 text-muted-foreground">
                      {profileBundle.profile.tagline ?? "Nog geen 1-regelige profielregel."}
                    </CardDescription>
                  </div>
                </div>
                <CardDescription className="text-sm leading-7 text-muted-foreground">
                  E-mailadres: {profileBundle.profile.email ?? authState.email ?? "Onbekend"}
                </CardDescription>
                {profileBundle.profile.bio ? (
                  <CardDescription className="whitespace-pre-line text-sm leading-7 text-muted-foreground">
                    {profileBundle.profile.bio}
                  </CardDescription>
                ) : null}
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
    </AppShell>
  );
}
