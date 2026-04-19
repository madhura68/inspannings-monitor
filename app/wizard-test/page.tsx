import { redirect } from "next/navigation";
import { TestWizardFlow } from "@/components/wizard/test-wizard-flow";
import { sanitizeNextPath } from "@/lib/auth/navigation";
import { getAuthState } from "@/lib/auth/session";
import { isTestWizardEnabled } from "@/lib/config/feature-flags";

export const dynamic = "force-dynamic";

export default async function WizardTestPage() {
  const authState = await getAuthState();

  if (!isTestWizardEnabled()) {
    redirect("/dashboard");
  }

  if (!authState.isConfigured) {
    redirect("/login?error=auth-not-configured");
  }

  if (!authState.isAuthenticated) {
    redirect(`/login?next=${encodeURIComponent(sanitizeNextPath("/wizard-test"))}`);
  }

  return (
    <main className="app-page">
      <div className="mx-auto flex max-w-6xl flex-col gap-8">
        <TestWizardFlow />
      </div>
    </main>
  );
}
