import { redirect } from "next/navigation";
import { AppShell } from "@/components/navigation/app-shell";
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
    <AppShell contentClassName="space-y-8">
      <div className="space-y-8">
        <TestWizardFlow />
      </div>
    </AppShell>
  );
}
