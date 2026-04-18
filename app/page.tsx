import Link from "next/link";
import { signOutAction } from "@/app/auth-actions";
import { getAuthNotice } from "@/lib/auth/messages";
import { getAuthState } from "@/lib/auth/session";

export const dynamic = "force-dynamic";

const headerActionClassName =
  "shrink-0 whitespace-nowrap rounded-full border border-black/10 bg-white/70 px-4 py-2 text-sm font-medium text-slate-900 shadow-sm transition hover:-translate-y-0.5";

const loopSteps = [
  {
    title: "Check-in",
    copy: "Start de dag met een korte energiescore en slaapkwaliteit, zonder overbodige frictie.",
  },
  {
    title: "Plannen",
    copy: "Verdeel activiteiten over de dag met een licht energiebudget en duidelijke prioriteiten.",
  },
  {
    title: "Evalueren",
    copy: "Kijk rustig terug op wat wel, niet of aangepast is gelukt, zonder medische claims of oordeel.",
  },
];

const releaseFocus = [
  "Alleen individuele gebruikers in release 1",
  "Wellness/self-management positionering",
  "Geen sharing, AI of medische workflows in de MVP",
  "Vercel + Supabase als technische basis",
];

type HomePageProps = {
  searchParams: Promise<Record<string, string | string[] | undefined>>;
};

function getParamValue(
  params: Record<string, string | string[] | undefined>,
  key: string,
) {
  const value = params[key];
  return typeof value === "string" ? value : null;
}

export default async function Home({ searchParams }: HomePageProps) {
  const authState = await getAuthState();
  const resolvedSearchParams = await searchParams;
  const notice = getAuthNotice(
    getParamValue(resolvedSearchParams, "error"),
    getParamValue(resolvedSearchParams, "status"),
  );

  return (
    <main className="min-h-screen bg-[radial-gradient(circle_at_top,_rgba(167,201,87,0.22),_transparent_32%),linear-gradient(180deg,_#f5f4ee_0%,_#eef2e6_100%)] text-slate-900">
      <div className="mx-auto flex min-h-screen w-full max-w-6xl flex-col px-6 py-10 sm:px-8 lg:px-10">
        <header className="mb-10 flex items-center justify-between border-b border-black/10 pb-5">
          <div>
            <p className="text-xs font-semibold uppercase tracking-[0.24em] text-slate-600">
              Inspannings Monitor
            </p>
            <h1 className="font-[family-name:var(--font-display)] text-3xl leading-tight sm:text-5xl">
              Rustige basis voor een wellness-first MVP
            </h1>
          </div>
          <div className="flex flex-wrap items-center justify-end gap-3">
            {authState.isConfigured ? (
              authState.isAuthenticated ? (
                <>
                  <Link
                    href="/dashboard"
                    className={headerActionClassName}
                  >
                    Naar dashboard
                  </Link>
                  <form action={signOutAction}>
                    <button
                      type="submit"
                      className={headerActionClassName}
                    >
                      Uitloggen
                    </button>
                  </form>
                </>
              ) : (
                <>
                  <Link
                    href="/login"
                    className={headerActionClassName}
                  >
                    Inloggen
                  </Link>
                  <Link
                    href="/sign-up"
                    className={headerActionClassName}
                  >
                    Account aanmaken
                  </Link>
                </>
              )
            ) : (
              <span className="rounded-full border border-amber-900/15 bg-amber-50 px-4 py-2 text-sm font-medium text-amber-900 shadow-sm">
                Supabase nog niet geconfigureerd
              </span>
            )}
          </div>
        </header>

        {notice ? (
          <div className="mb-6 rounded-[1.5rem] border border-emerald-200 bg-emerald-50 px-5 py-4 text-sm leading-7 text-emerald-900">
            {notice.text}
          </div>
        ) : null}

        <section className="grid gap-6 lg:grid-cols-[1.35fr_0.95fr]">
          <article className="rounded-[2rem] border border-black/10 bg-white/70 p-6 shadow-[0_18px_60px_rgba(71,85,105,0.12)] backdrop-blur sm:p-8">
            <p className="mb-4 max-w-2xl text-lg leading-8 text-slate-700">
              De projectbasis staat nu, inclusief de eerste auth-laag via Supabase.
              Release 1 blijft bewust smal: publieke landing, aparte login/signup
              routes en een eerste protected dashboard als basis voor de volgende stories.
            </p>
            <div className="grid gap-4 md:grid-cols-3">
              {loopSteps.map((step, index) => (
                <section
                  key={step.title}
                  className="rounded-[1.5rem] border border-black/8 bg-stone-50 p-5"
                >
                  <p className="mb-3 text-xs font-semibold uppercase tracking-[0.22em] text-slate-500">
                    Stap {index + 1}
                  </p>
                  <h2 className="mb-2 font-[family-name:var(--font-display)] text-2xl">
                    {step.title}
                  </h2>
                  <p className="text-sm leading-7 text-slate-700">{step.copy}</p>
                </section>
              ))}
            </div>
          </article>

          <aside className="rounded-[2rem] border border-emerald-950/10 bg-emerald-950 px-6 py-7 text-emerald-50 shadow-[0_18px_60px_rgba(6,78,59,0.18)] sm:px-8">
            <p className="mb-4 text-xs font-semibold uppercase tracking-[0.24em] text-emerald-200/80">
              Release 1 focus
            </p>
            <ul className="space-y-3">
              {releaseFocus.map((item) => (
                <li
                  key={item}
                  className="rounded-2xl border border-white/10 bg-white/8 px-4 py-3 text-sm leading-7"
                >
                  {item}
                </li>
              ))}
            </ul>
            {authState.isConfigured ? (
              <p className="mt-5 text-sm leading-7 text-emerald-100/80">
                Auth is ingericht met e-mail, wachtwoord en verplichte e-mailverificatie.
              </p>
            ) : (
              <p className="mt-5 text-sm leading-7 text-emerald-100/80">
                Voeg `.env.local` toe om login, signup en protected routes lokaal te activeren.
              </p>
            )}
          </aside>
        </section>

        <section className="mt-8 grid gap-5 rounded-[2rem] border border-black/10 bg-white/60 p-6 shadow-[0_10px_45px_rgba(71,85,105,0.08)] backdrop-blur sm:grid-cols-2 lg:grid-cols-4">
          <div>
            <p className="text-xs font-semibold uppercase tracking-[0.24em] text-slate-500">
              Volgende story
            </p>
            <p className="mt-2 font-semibold text-slate-900">
              ST-201 Ochtendcheck-in
            </p>
          </div>
          <div>
            <p className="text-xs font-semibold uppercase tracking-[0.24em] text-slate-500">
              Doelgroep
            </p>
            <p className="mt-2 font-semibold text-slate-900">Volwassen individuele gebruikers</p>
          </div>
          <div>
            <p className="text-xs font-semibold uppercase tracking-[0.24em] text-slate-500">
              Positionering
            </p>
            <p className="mt-2 font-semibold text-slate-900">Wellness / self-management</p>
          </div>
          <div>
            <p className="text-xs font-semibold uppercase tracking-[0.24em] text-slate-500">
              Status
            </p>
            <p className="mt-2 font-semibold text-slate-900">Auth, onboarding en settings actief</p>
          </div>
        </section>
      </div>
    </main>
  );
}
