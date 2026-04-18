import { redirect } from "next/navigation";
import { OnboardingFlow } from "@/components/onboarding/onboarding-flow";
import { sanitizeNextPath } from "@/lib/auth/navigation";
import { getAuthState } from "@/lib/auth/session";
import { getProfileBundleForCurrentUser } from "@/lib/profile/service";

export const dynamic = "force-dynamic";

export default async function OnboardingPage() {
  const authState = await getAuthState();

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

  return (
    <main className="min-h-screen bg-[radial-gradient(circle_at_top,_rgba(167,201,87,0.22),_transparent_32%),linear-gradient(180deg,_#f5f4ee_0%,_#eef2e6_100%)] px-6 py-10 text-slate-900 sm:px-8">
      <div className="mx-auto flex max-w-6xl flex-col gap-8">
        <OnboardingFlow profileBundle={profileBundle} />
      </div>
    </main>
  );
}
