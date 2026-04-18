import Link from "next/link";
import { redirect } from "next/navigation";
import { AuthNotice } from "@/components/auth/auth-notice";
import { AuthPanel } from "@/components/auth/auth-panel";
import { signUpAction } from "@/app/auth-actions";
import { getAuthNotice } from "@/lib/auth/messages";
import { buildPathWithQuery, sanitizeNextPath } from "@/lib/auth/navigation";
import { getAuthState } from "@/lib/auth/session";

export const dynamic = "force-dynamic";

type SignUpPageProps = {
  searchParams: Promise<Record<string, string | string[] | undefined>>;
};

function getParamValue(
  params: Record<string, string | string[] | undefined>,
  key: string,
) {
  const value = params[key];
  return typeof value === "string" ? value : null;
}

export default async function SignUpPage({ searchParams }: SignUpPageProps) {
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
  const loginHref = buildPathWithQuery("/login", { next });

  return (
    <AuthPanel
      eyebrow="Account aanmaken"
      title="Maak je eerste account aan"
      description="Release 1 gebruikt e-mail en wachtwoord als eenvoudige basis. Na registratie bevestig je eerst je e-mailadres."
      footer={
        <p>
          Heb je al een account?{" "}
          <Link href={loginHref} className="font-semibold text-emerald-900">
            Log dan in
          </Link>
        </p>
      }
    >
      <AuthNotice notice={notice} />

      {!authState.isConfigured ? (
        <div className="rounded-2xl border border-sky-200 bg-sky-50 px-4 py-4 text-sm leading-7 text-sky-900">
          Voeg eerst je Supabase-gegevens toe in `.env.local` op basis van `.env.example`.
        </div>
      ) : (
        <form action={signUpAction} className="space-y-4">
          <input type="hidden" name="next" value={next} />

          <label className="block text-sm font-medium text-slate-800">
            E-mailadres
            <input
              className="mt-2 w-full rounded-2xl border border-black/10 bg-stone-50 px-4 py-3 text-base outline-none transition focus:border-emerald-600 focus:bg-white"
              type="email"
              name="email"
              autoComplete="email"
              required
            />
          </label>

          <label className="block text-sm font-medium text-slate-800">
            Wachtwoord
            <input
              className="mt-2 w-full rounded-2xl border border-black/10 bg-stone-50 px-4 py-3 text-base outline-none transition focus:border-emerald-600 focus:bg-white"
              type="password"
              name="password"
              autoComplete="new-password"
              minLength={8}
              required
            />
          </label>

          <button
            type="submit"
            className="inline-flex w-full items-center justify-center rounded-2xl bg-emerald-950 px-5 py-3 text-sm font-semibold text-emerald-50 transition hover:-translate-y-0.5 hover:bg-emerald-900"
          >
            Account aanmaken
          </button>
        </form>
      )}
    </AuthPanel>
  );
}
