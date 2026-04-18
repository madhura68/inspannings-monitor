import Link from "next/link";
import { redirect } from "next/navigation";
import { AuthNotice } from "@/components/auth/auth-notice";
import { AuthPanel } from "@/components/auth/auth-panel";
import { signInAction } from "@/app/auth-actions";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { getAuthNotice } from "@/lib/auth/messages";
import { buildPathWithQuery, sanitizeNextPath } from "@/lib/auth/navigation";
import { getAuthState } from "@/lib/auth/session";

export const dynamic = "force-dynamic";

type LoginPageProps = {
  searchParams: Promise<Record<string, string | string[] | undefined>>;
};

function getParamValue(
  params: Record<string, string | string[] | undefined>,
  key: string,
) {
  const value = params[key];
  return typeof value === "string" ? value : null;
}

export default async function LoginPage({ searchParams }: LoginPageProps) {
  const authState = await getAuthState();
  const resolvedSearchParams = await searchParams;
  const next = sanitizeNextPath(getParamValue(resolvedSearchParams, "next"));

  if (authState.isAuthenticated) {
    redirect(next);
  }

  const notice = getAuthNotice(
    getParamValue(resolvedSearchParams, "error"),
    getParamValue(resolvedSearchParams, "status"),
  );
  const signUpHref = buildPathWithQuery("/sign-up", { next });

  return (
    <AuthPanel
      eyebrow="Inloggen"
      title="Welkom terug"
      description="Log in om je dashboard te openen en je wellness-first flow verder op te bouwen."
      footer={
        <p>
          Nog geen account?{" "}
          <Link href={signUpHref} className="font-semibold text-emerald-900">
            Maak er een aan
          </Link>
        </p>
      }
    >
      <AuthNotice notice={notice} />

      {!authState.isConfigured ? (
        <Alert className="rounded-[1.5rem] border-sky-200 bg-sky-50 text-sky-950 [&_svg]:text-sky-700">
          <AlertDescription className="leading-7 text-current">
            Voeg eerst je Supabase-gegevens toe in `.env.local` op basis van `.env.example`.
          </AlertDescription>
        </Alert>
      ) : (
        <form action={signInAction} className="space-y-5">
          <input type="hidden" name="next" value={next} />

          <div className="space-y-2">
            <Label htmlFor="email" className="text-slate-800">
              E-mailadres
            </Label>
            <Input
              id="email"
              className="h-12 rounded-[1.25rem] bg-background/80 px-4 text-base md:text-base"
              type="email"
              name="email"
              autoComplete="email"
              required
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="password" className="text-slate-800">
              Wachtwoord
            </Label>
            <Input
              id="password"
              className="h-12 rounded-[1.25rem] bg-background/80 px-4 text-base md:text-base"
              type="password"
              name="password"
              autoComplete="current-password"
              minLength={8}
              required
            />
          </div>

          <Button
            type="submit"
            size="lg"
            className="w-full rounded-[1.25rem]"
          >
            Inloggen
          </Button>
        </form>
      )}
    </AuthPanel>
  );
}
