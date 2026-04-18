import { redirect } from "next/navigation";
import { signOutAction } from "@/app/auth-actions";
import { sanitizeNextPath } from "@/lib/auth/navigation";
import { getAuthState } from "@/lib/auth/session";
import { getProfileBundleForCurrentUser } from "@/lib/profile/service";
import Link from "next/link";

export const dynamic = "force-dynamic";

type DashboardPageProps = {
  searchParams: Promise<Record<string, string | string[] | undefined>>;
};

function getParamValue(
  params: Record<string, string | string[] | undefined>,
  key: string,
) {
  const value = params[key];
  return typeof value === "string" ? value : null;
}

function formatToggleState(value: boolean, enabledLabel = "Aan", disabledLabel = "Uit") {
  return value ? enabledLabel : disabledLabel;
}

function formatReminderTime(value: string | null) {
  return value ? value.slice(0, 5) : "Nog niet ingesteld";
}

function getDashboardNotice(status: string | null) {
  if (status === "onboarding-completed") {
    return "Je onboarding is opgeslagen. Je basisinstellingen staan nu klaar.";
  }

  if (status === "onboarding-skipped") {
    return "Je hebt de onboarding nu overgeslagen. Je kunt hem later alsnog afronden.";
  }

  return null;
}

export default async function DashboardPage({ searchParams }: DashboardPageProps) {
  const authState = await getAuthState();
  const resolvedSearchParams = await searchParams;

  if (!authState.isConfigured) {
    redirect("/login?error=auth-not-configured");
  }

  if (!authState.isAuthenticated) {
    redirect(`/login?next=${encodeURIComponent(sanitizeNextPath("/dashboard"))}`);
  }

  const profileBundle = await getProfileBundleForCurrentUser();

  if (!profileBundle) {
    redirect(`/login?next=${encodeURIComponent(sanitizeNextPath("/dashboard"))}`);
  }

  const { profile, settings } = profileBundle;
  const notice = getDashboardNotice(getParamValue(resolvedSearchParams, "status"));

  if (!profile.onboardingSeen) {
    redirect("/onboarding");
  }

  const profileTitle = profile.displayName ?? profile.email ?? authState.email ?? "Ingelogde gebruiker";
  const onboardingState = profile.onboardingCompleted ? "Afgerond" : "Nog niet afgerond";
  const morningReminderState = settings.morningReminderEnabled
    ? `Aan om ${formatReminderTime(settings.morningReminderTime)}`
    : "Uit";

  return (
    <main className="min-h-screen bg-[radial-gradient(circle_at_top,_rgba(167,201,87,0.22),_transparent_32%),linear-gradient(180deg,_#f5f4ee_0%,_#eef2e6_100%)] px-6 py-10 text-slate-900 sm:px-8">
      <div className="mx-auto flex max-w-6xl flex-col gap-8">
        {notice ? (
          <div className="rounded-[1.5rem] border border-emerald-200 bg-emerald-50 px-5 py-4 text-sm leading-7 text-emerald-900">
            {notice}
          </div>
        ) : null}

        <header className="flex flex-col gap-5 rounded-[2rem] border border-black/10 bg-white/75 p-6 shadow-[0_18px_60px_rgba(71,85,105,0.12)] backdrop-blur sm:flex-row sm:items-start sm:justify-between sm:p-8">
          <div>
            <p className="text-xs font-semibold uppercase tracking-[0.24em] text-slate-500">
              Protected route
            </p>
            <h1 className="mt-3 font-[family-name:var(--font-display)] text-4xl leading-tight">
              Dashboard placeholder voor release 1
            </h1>
            <p className="mt-4 max-w-2xl text-base leading-8 text-slate-700">
              Je sessie is server-side gevalideerd en het minimale profielbundle is
              nu beschikbaar. Daarmee staat de fundering voor onboarding, settings
              en de eerste energieflows klaar.
            </p>
          </div>

          <form action={signOutAction}>
            <div className="flex flex-wrap items-center gap-3">
              <Link
                href="/settings"
                className="inline-flex rounded-full border border-black/10 bg-white px-4 py-2 text-sm font-medium text-slate-700 transition hover:-translate-y-0.5 hover:text-slate-950"
              >
                Instellingen
              </Link>
              <button
                type="submit"
                className="inline-flex rounded-full border border-emerald-900/15 bg-emerald-950 px-5 py-3 text-sm font-semibold text-emerald-50 transition hover:-translate-y-0.5 hover:bg-emerald-900"
              >
                Uitloggen
              </button>
            </div>
          </form>
        </header>

        <section className="grid gap-5 md:grid-cols-3">
          <article className="rounded-[1.75rem] border border-black/10 bg-white/75 p-6 shadow-[0_12px_40px_rgba(71,85,105,0.08)]">
            <p className="text-xs font-semibold uppercase tracking-[0.24em] text-slate-500">
              Auth
            </p>
            <p className="mt-3 text-lg font-semibold text-slate-900">
              Cookie-based sessie actief
            </p>
            <p className="mt-3 text-sm leading-7 text-slate-700">
              Gebruiker-ID `{authState.userId}` is server-side gevalideerd via Supabase SSR-auth.
            </p>
          </article>

          <article className="rounded-[1.75rem] border border-black/10 bg-white/75 p-6 shadow-[0_12px_40px_rgba(71,85,105,0.08)]">
            <p className="text-xs font-semibold uppercase tracking-[0.24em] text-slate-500">
              Profiel
            </p>
            <p className="mt-3 text-lg font-semibold text-slate-900">
              {profileTitle}
            </p>
            <p className="mt-3 text-sm leading-7 text-slate-700">
              Taal `{profile.locale}` en timezone `{profile.timezone}` staan nu per
              gebruiker opgeslagen.
            </p>
          </article>

          <article className="rounded-[1.75rem] border border-black/10 bg-white/75 p-6 shadow-[0_12px_40px_rgba(71,85,105,0.08)]">
            <p className="text-xs font-semibold uppercase tracking-[0.24em] text-slate-500">
              Onboarding
            </p>
            <p className="mt-3 text-lg font-semibold text-slate-900">
              {onboardingState}
            </p>
            <p className="mt-3 text-sm leading-7 text-slate-700">
              Nieuwe accounts starten bewust zonder afgeronde onboarding, zodat
              `ST-103` straks een duidelijke eerste flow kan aansturen.
            </p>
          </article>

          <article className="rounded-[1.75rem] border border-black/10 bg-white/75 p-6 shadow-[0_12px_40px_rgba(71,85,105,0.08)]">
            <p className="text-xs font-semibold uppercase tracking-[0.24em] text-slate-500">
              Instellingen
            </p>
            <p className="mt-3 text-lg font-semibold text-slate-900">
              Punten {formatToggleState(settings.showEnergyPoints, "zichtbaar", "verborgen")}
            </p>
            <p className="mt-3 text-sm leading-7 text-slate-700">
              Ochtendreminder: {morningReminderState}. Reflectieprompts:{" "}
              {formatToggleState(settings.reflectionReminderEnabled)}.
            </p>
          </article>
        </section>

        {!profile.onboardingCompleted ? (
          <section className="flex flex-col gap-4 rounded-[1.75rem] border border-amber-900/15 bg-amber-50 px-6 py-5 text-sm leading-7 text-amber-950 shadow-[0_12px_40px_rgba(146,64,14,0.08)] sm:flex-row sm:items-center sm:justify-between">
            <div>
              <p className="font-semibold">Je onboarding is nog niet afgerond.</p>
              <p className="mt-1 max-w-2xl text-amber-900">
                Je kunt de korte flow later alsnog afronden om je basisinstellingen
                en eerste voorkeuren vast te leggen.
              </p>
            </div>
            <Link
              href="/onboarding"
              className="inline-flex shrink-0 rounded-full bg-amber-950 px-5 py-3 text-sm font-semibold text-amber-50 transition hover:-translate-y-0.5 hover:bg-amber-900"
            >
              Rond onboarding af
            </Link>
          </section>
        ) : (
          <section className="flex flex-col gap-4 rounded-[1.75rem] border border-emerald-950/10 bg-emerald-950 px-6 py-5 text-sm leading-7 text-emerald-50 shadow-[0_12px_40px_rgba(6,78,59,0.18)] sm:flex-row sm:items-center sm:justify-between">
            <div>
              <p className="font-semibold">Je instellingen kun je nu ook los beheren.</p>
              <p className="mt-1 max-w-2xl text-emerald-100/85">
                `ST-104` staat nu klaar als aparte route, zodat je reminders,
                timezone en zichtbaarheid van punten later zelfstandig kunt aanpassen.
              </p>
            </div>
            <Link
              href="/settings"
              className="inline-flex shrink-0 rounded-full bg-white px-5 py-3 text-sm font-semibold text-emerald-950 transition hover:-translate-y-0.5 hover:bg-emerald-50"
            >
              Open instellingen
            </Link>
          </section>
        )}
      </div>
    </main>
  );
}
