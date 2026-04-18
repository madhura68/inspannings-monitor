"use client";

import { useState } from "react";
import { saveSettingsAction } from "@/app/settings/actions";
import { ONBOARDING_TIMEZONE_OPTIONS } from "@/lib/onboarding/options";
import type { ProfileBundle } from "@/lib/profile/types";

type SettingsFormProps = {
  profileBundle: ProfileBundle;
};

const LOCALE_OPTIONS = [
  {
    value: "nl-NL",
    label: "Nederlands",
  },
] as const;

export function SettingsForm({ profileBundle }: SettingsFormProps) {
  const [locale, setLocale] = useState(profileBundle.profile.locale);
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

  return (
    <form action={saveSettingsAction} className="space-y-6">
      <input type="hidden" name="locale" value={locale} />
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

      <section className="rounded-[1.75rem] border border-black/10 bg-white/75 p-6 shadow-[0_12px_40px_rgba(71,85,105,0.08)]">
        <p className="text-xs font-semibold uppercase tracking-[0.24em] text-slate-500">
          Account
        </p>
        <h2 className="mt-3 font-[family-name:var(--font-display)] text-3xl text-slate-900">
          Basisinstellingen voor jouw account
        </h2>
        <p className="mt-3 max-w-2xl text-sm leading-7 text-slate-700">
          Je past hier alleen je wellness-first voorkeuren aan. Er zijn in release 1
          geen medische velden, deelinstellingen of zorgverlenerrollen.
        </p>
      </section>

      <section className="grid gap-5 lg:grid-cols-2">
        <article className="rounded-[1.75rem] border border-black/10 bg-white/75 p-6 shadow-[0_12px_40px_rgba(71,85,105,0.08)]">
          <p className="text-xs font-semibold uppercase tracking-[0.24em] text-slate-500">
            Taal en tijd
          </p>

          <div className="mt-5 space-y-5">
            <label className="block text-sm font-medium text-slate-800">
              Taal
              <select
                className="mt-2 w-full rounded-2xl border border-black/10 bg-stone-50 px-4 py-3 text-base outline-none transition focus:border-emerald-600 focus:bg-white"
                value={locale}
                onChange={(event) => setLocale(event.target.value)}
              >
                {LOCALE_OPTIONS.map((option) => (
                  <option key={option.value} value={option.value}>
                    {option.label}
                  </option>
                ))}
              </select>
            </label>

            <div className="rounded-[1.5rem] border border-sky-200 bg-sky-50 px-4 py-4 text-sm leading-7 text-sky-900">
              Release 1 draait bewust volledig in het Nederlands. De taalinstelling
              blijft al wel aanwezig in het accountmodel.
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
        </article>

        <article className="rounded-[1.75rem] border border-black/10 bg-white/75 p-6 shadow-[0_12px_40px_rgba(71,85,105,0.08)]">
          <p className="text-xs font-semibold uppercase tracking-[0.24em] text-slate-500">
            Interface
          </p>

          <div className="mt-5 space-y-4">
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
                  Laat budgetpunten zichtbaar zien in het dashboard en latere dagflows.
                </span>
              </span>
            </label>
          </div>
        </article>
      </section>

      <section className="grid gap-5 lg:grid-cols-2">
        <article className="rounded-[1.75rem] border border-black/10 bg-white/75 p-6 shadow-[0_12px_40px_rgba(71,85,105,0.08)]">
          <p className="text-xs font-semibold uppercase tracking-[0.24em] text-slate-500">
            Reminders
          </p>

          <div className="mt-5 space-y-4">
            <label className="flex items-start gap-3 rounded-[1.5rem] border border-black/10 bg-stone-50 px-4 py-4">
              <input
                className="mt-1 h-4 w-4 accent-emerald-900"
                type="checkbox"
                checked={morningReminderEnabled}
                onChange={(event) => setMorningReminderEnabled(event.target.checked)}
              />
              <span className="flex-1">
                <span className="block text-sm font-semibold text-slate-900">
                  Ochtendreminder
                </span>
                <span className="mt-1 block text-sm leading-7 text-slate-700">
                  Zet een lichte reminder aan voor een rustige start van je check-in.
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
                  Reflectieprompts toestaan
                </span>
                <span className="mt-1 block text-sm leading-7 text-slate-700">
                  Maak alvast de opt-in klaar voor lichte terugblikprompts in een latere story.
                </span>
              </span>
            </label>
          </div>
        </article>

        <article className="rounded-[1.75rem] border border-emerald-950/10 bg-emerald-950 p-6 text-emerald-50 shadow-[0_12px_40px_rgba(6,78,59,0.18)]">
          <p className="text-xs font-semibold uppercase tracking-[0.24em] text-emerald-200/80">
            Bewuste grenzen
          </p>
          <ul className="mt-4 space-y-3 text-sm leading-7 text-emerald-50/90">
            <li>Geen medische drempels, diagnoses of behandelinstellingen.</li>
            <li>Geen delen met zorgverleners of naasten in release 1.</li>
            <li>Alle instellingen blijven gekoppeld aan alleen jouw account.</li>
          </ul>
        </article>
      </section>

      <div className="flex flex-wrap items-center justify-between gap-3 border-t border-black/10 pt-6">
        <p className="text-sm leading-7 text-slate-600">
          Wijzigingen zijn direct van toepassing op jouw account en volgende sessies.
        </p>

        <button
          type="submit"
          className="rounded-full bg-emerald-950 px-5 py-3 text-sm font-semibold text-emerald-50 transition hover:-translate-y-0.5 hover:bg-emerald-900"
        >
          Instellingen opslaan
        </button>
      </div>
    </form>
  );
}
