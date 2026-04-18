"use client";

import type { MouseEvent } from "react";
import { useState } from "react";
import { completeOnboardingAction, skipOnboardingAction } from "@/app/onboarding/actions";
import { ONBOARDING_TIMEZONE_OPTIONS } from "@/lib/onboarding/options";
import type { ProfileBundle } from "@/lib/profile/types";

type OnboardingFlowProps = {
  profileBundle: ProfileBundle;
};

const steps = [
  {
    eyebrow: "Stap 1",
    title: "Zo gebruiken we Inspannings Monitor",
    description:
      "De app helpt je om je dag rustiger te plannen en terug te kijken zonder medische claims of zorgverlenerfuncties.",
  },
  {
    eyebrow: "Stap 2",
    title: "Basisprofiel",
    description:
      "Kies hoe de app je mag aanspreken en welke timezone het best bij je dagindeling past.",
  },
  {
    eyebrow: "Stap 3",
    title: "Startvoorkeuren",
    description:
      "Kies rustig hoe zichtbaar je energiebudget is en of je lichte reminders wilt ontvangen.",
  },
] as const;

export function OnboardingFlow({ profileBundle }: OnboardingFlowProps) {
  const [currentStep, setCurrentStep] = useState(0);
  const [displayName, setDisplayName] = useState(profileBundle.profile.displayName ?? "");
  const [timezone, setTimezone] = useState(profileBundle.profile.timezone);
  const [showEnergyPoints, setShowEnergyPoints] = useState(
    profileBundle.settings.showEnergyPoints,
  );
  const [morningReminderEnabled, setMorningReminderEnabled] = useState(
    profileBundle.settings.morningReminderEnabled,
  );
  const [morningReminderTime, setMorningReminderTime] = useState(
    profileBundle.settings.morningReminderTime ?? "08:30",
  );
  const [reflectionReminderEnabled, setReflectionReminderEnabled] = useState(
    profileBundle.settings.reflectionReminderEnabled,
  );

  const step = steps[currentStep];
  const isFirstStep = currentStep === 0;
  const isLastStep = currentStep === steps.length - 1;

  function goToPreviousStep() {
    setCurrentStep((stepIndex) => Math.max(0, stepIndex - 1));
  }

  function goToNextStep(event: MouseEvent<HTMLButtonElement>) {
    // This button lives inside the onboarding form. By preventing the default
    // click action and rendering a keyed replacement, we avoid an accidental
    // form submit when the final step button appears after the state update.
    event.preventDefault();
    setCurrentStep((stepIndex) => Math.min(steps.length - 1, stepIndex + 1));
  }

  return (
    <div className="grid gap-6 lg:grid-cols-[0.9fr_1.1fr]">
      <section className="rounded-[2rem] border border-black/10 bg-emerald-950 p-7 text-emerald-50 shadow-[0_18px_60px_rgba(6,78,59,0.18)] sm:p-9">
        <p className="text-xs font-semibold uppercase tracking-[0.24em] text-emerald-200/80">
          {step.eyebrow}
        </p>
        <h1 className="mt-4 font-[family-name:var(--font-display)] text-4xl leading-tight sm:text-5xl">
          {step.title}
        </h1>
        <p className="mt-5 max-w-xl text-base leading-8 text-emerald-50/85">
          {step.description}
        </p>

        <div className="mt-10 rounded-[1.5rem] border border-white/10 bg-white/8 p-5 text-sm leading-7 text-emerald-50/90">
          <p className="font-semibold">Release 1 blijft bewust wellness-first.</p>
          <ul className="mt-3 space-y-2">
            <li>Alleen voor individuele gebruikers, zonder delen of zorgverlenerstoegang.</li>
            <li>De app geeft geen diagnose, behandeling of medisch advies.</li>
            <li>Bij acute of snel verslechterende klachten hoort directe hulp via arts, huisartsenpost of 112 buiten deze app.</li>
          </ul>
        </div>

        <ol className="mt-8 flex gap-3">
          {steps.map((item, index) => (
            <li
              key={item.title}
              className={`h-2 flex-1 rounded-full ${
                index <= currentStep ? "bg-emerald-200" : "bg-white/15"
              }`}
            />
          ))}
        </ol>
      </section>

      <section className="rounded-[2rem] border border-black/10 bg-white/75 p-6 shadow-[0_18px_60px_rgba(71,85,105,0.12)] backdrop-blur sm:p-8">
        <div className="mb-6 flex items-center justify-between gap-3">
          <p className="text-xs font-semibold uppercase tracking-[0.24em] text-slate-500">
            Korte onboarding
          </p>
          <form action={skipOnboardingAction}>
            <button
              type="submit"
              className="rounded-full border border-black/10 bg-white px-4 py-2 text-sm font-medium text-slate-700 transition hover:-translate-y-0.5 hover:text-slate-950"
            >
              Nu overslaan
            </button>
          </form>
        </div>

        <form action={completeOnboardingAction} className="space-y-6">
          <input type="hidden" name="displayName" value={displayName} />
          <input type="hidden" name="timezone" value={timezone} />
          <input
            type="hidden"
            name="showEnergyPoints"
            value={showEnergyPoints ? "true" : "false"}
          />
          <input
            type="hidden"
            name="morningReminderEnabled"
            value={morningReminderEnabled ? "true" : "false"}
          />
          <input type="hidden" name="morningReminderTime" value={morningReminderTime} />
          <input
            type="hidden"
            name="reflectionReminderEnabled"
            value={reflectionReminderEnabled ? "true" : "false"}
          />

          {currentStep === 0 ? (
            <div className="space-y-4">
              <article className="rounded-[1.5rem] border border-black/10 bg-stone-50 p-5">
                <h2 className="font-[family-name:var(--font-display)] text-2xl text-slate-900">
                  Wat je hier wél krijgt
                </h2>
                <p className="mt-3 text-sm leading-7 text-slate-700">
                  Een rustige plan-doe-evalueer flow met energiebudgetten, zonder
                  druk, score-oordeel of medische terminologie.
                </p>
              </article>

              <article className="rounded-[1.5rem] border border-black/10 bg-stone-50 p-5">
                <h2 className="font-[family-name:var(--font-display)] text-2xl text-slate-900">
                  Wat deze app niet doet
                </h2>
                <p className="mt-3 text-sm leading-7 text-slate-700">
                  Geen diagnose, geen behandeling, geen medische triage en geen
                  automatisch delen met derden.
                </p>
              </article>
            </div>
          ) : null}

          {currentStep === 1 ? (
            <div className="space-y-5">
              <label className="block text-sm font-medium text-slate-800">
                Schermnaam
                <input
                  className="mt-2 w-full rounded-2xl border border-black/10 bg-stone-50 px-4 py-3 text-base outline-none transition focus:border-emerald-600 focus:bg-white"
                  type="text"
                  value={displayName}
                  onChange={(event) => setDisplayName(event.target.value)}
                  placeholder="Optioneel, bijvoorbeeld Jan"
                  maxLength={40}
                />
              </label>

              <div className="rounded-[1.5rem] border border-sky-200 bg-sky-50 px-4 py-4 text-sm leading-7 text-sky-900">
                Voertaal voor release 1 staat vast op <strong>Nederlands</strong>.
              </div>

              <label className="block text-sm font-medium text-slate-800">
                Timezone
                <select
                  className="mt-2 w-full rounded-2xl border border-black/10 bg-stone-50 px-4 py-3 text-base outline-none transition focus:border-emerald-600 focus:bg-white"
                  value={timezone}
                  onChange={(event) => setTimezone(event.target.value)}
                >
                  {ONBOARDING_TIMEZONE_OPTIONS.map((option) => (
                    <option key={option.value} value={option.value}>
                      {option.label}
                    </option>
                  ))}
                </select>
              </label>
            </div>
          ) : null}

          {currentStep === 2 ? (
            <div className="space-y-4">
              <label className="flex items-start gap-3 rounded-[1.5rem] border border-black/10 bg-stone-50 px-4 py-4">
                <input
                  className="mt-1 h-4 w-4 accent-emerald-900"
                  type="checkbox"
                  checked={showEnergyPoints}
                  onChange={(event) => setShowEnergyPoints(event.target.checked)}
                />
                <span>
                  <span className="block text-sm font-semibold text-slate-900">
                    Toon energiebudgetpunten
                  </span>
                  <span className="mt-1 block text-sm leading-7 text-slate-700">
                    Laat geplande en resterende punten zichtbaar zien in de interface.
                  </span>
                </span>
              </label>

              <label className="flex items-start gap-3 rounded-[1.5rem] border border-black/10 bg-stone-50 px-4 py-4">
                <input
                  className="mt-1 h-4 w-4 accent-emerald-900"
                  type="checkbox"
                  checked={morningReminderEnabled}
                  onChange={(event) => setMorningReminderEnabled(event.target.checked)}
                />
                <span className="flex-1">
                  <span className="block text-sm font-semibold text-slate-900">
                    Zet een lichte ochtendreminder aan
                  </span>
                  <span className="mt-1 block text-sm leading-7 text-slate-700">
                    Handig als je later een korte check-in wilt doen zonder extra druk.
                  </span>

                  {morningReminderEnabled ? (
                    <input
                      className="mt-3 w-full rounded-2xl border border-black/10 bg-white px-4 py-3 text-base outline-none transition focus:border-emerald-600"
                      type="time"
                      value={morningReminderTime}
                      onChange={(event) => setMorningReminderTime(event.target.value)}
                    />
                  ) : null}
                </span>
              </label>

              <label className="flex items-start gap-3 rounded-[1.5rem] border border-black/10 bg-stone-50 px-4 py-4">
                <input
                  className="mt-1 h-4 w-4 accent-emerald-900"
                  type="checkbox"
                  checked={reflectionReminderEnabled}
                  onChange={(event) => setReflectionReminderEnabled(event.target.checked)}
                />
                <span>
                  <span className="block text-sm font-semibold text-slate-900">
                    Sta lichte reflectieprompts toe
                  </span>
                  <span className="mt-1 block text-sm leading-7 text-slate-700">
                    Optionele terugblikprompts kunnen later helpen om rustiger patronen te zien.
                  </span>
                </span>
              </label>
            </div>
          ) : null}

          <div className="flex flex-wrap items-center justify-between gap-3 border-t border-black/10 pt-6">
            <button
              type="button"
              onClick={goToPreviousStep}
              disabled={isFirstStep}
              className="rounded-full border border-black/10 bg-white px-5 py-3 text-sm font-medium text-slate-700 transition hover:-translate-y-0.5 hover:text-slate-950 disabled:cursor-not-allowed disabled:opacity-45"
            >
              Vorige
            </button>

            {isLastStep ? (
              <button
                key="complete-onboarding"
                type="submit"
                className="rounded-full bg-emerald-950 px-5 py-3 text-sm font-semibold text-emerald-50 transition hover:-translate-y-0.5 hover:bg-emerald-900"
              >
                Rond onboarding af
              </button>
            ) : (
              <button
                key={`next-step-${currentStep}`}
                type="button"
                onClick={goToNextStep}
                className="rounded-full bg-emerald-950 px-5 py-3 text-sm font-semibold text-emerald-50 transition hover:-translate-y-0.5 hover:bg-emerald-900"
              >
                Ga verder
              </button>
            )}
          </div>
        </form>
      </section>
    </div>
  );
}
