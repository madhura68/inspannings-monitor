import { redirect } from "next/navigation";
import { StatusToastBridge } from "@/components/feedback/status-toast-bridge";
import { OnboardingFlow } from "@/components/onboarding/onboarding-flow";
import { sanitizeNextPath } from "@/lib/auth/navigation";
import { getAuthState } from "@/lib/auth/session";
import { getOnboardingStatusToast } from "@/lib/feedback/status-messages";
import { getProfileBundleForCurrentUser } from "@/lib/profile/service";
import { getParamValue, type PageSearchParams } from "@/lib/search-params";

export const dynamic = "force-dynamic";

type OnboardingPageProps = {
  searchParams: Promise<PageSearchParams>;
};

export default async function OnboardingPage({ searchParams }: OnboardingPageProps) {
  const authState = await getAuthState();
  const resolvedSearchParams = await searchParams;

  if (!authState.isConfigured) {
    redirect("/login?error=auth-not-configured");
  }

  if (!authState.isAuthenticated) {
    redirect(`/login?next=${encodeURIComponent(sanitizeNextPath("/onboarding"))}`);
  }

  const profileBundle = await getProfileBundleForCurrentUser();

  if (!profileBundle) {
    redirect(`/login?next=${encodeURIComponent(sanitizeNextPath("/onboarding"))}`);
  }

  if (profileBundle.profile.onboardingCompleted) {
    redirect("/dashboard");
  }

  const statusToast = getOnboardingStatusToast(
    getParamValue(resolvedSearchParams, "error"),
    getParamValue(resolvedSearchParams, "status"),
  );

  return (
    <main className="app-page">
      <div className="mx-auto flex max-w-6xl flex-col gap-8">
        <StatusToastBridge toast={statusToast} paramKeys={["error", "status"]} />
        <OnboardingFlow profileBundle={profileBundle} />
      </div>
    </main>
  );
}
