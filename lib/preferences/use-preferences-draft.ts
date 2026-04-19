"use client";

import { useState } from "react";
import type { ProfileBundle } from "@/lib/profile/types";

export const DEFAULT_MORNING_REMINDER_TIME = "08:30";

export type PreferenceDraft = {
  timezone: string;
  showEnergyPoints: boolean;
  morningReminderEnabled: boolean;
  morningReminderTime: string;
  reflectionReminderEnabled: boolean;
};

export function buildPreferenceDraft(profileBundle: ProfileBundle): PreferenceDraft {
  return {
    timezone: profileBundle.profile.timezone,
    showEnergyPoints: profileBundle.settings.showEnergyPoints,
    morningReminderEnabled: profileBundle.settings.morningReminderEnabled,
    morningReminderTime:
      profileBundle.settings.morningReminderTime ?? DEFAULT_MORNING_REMINDER_TIME,
    reflectionReminderEnabled: profileBundle.settings.reflectionReminderEnabled,
  };
}

export function usePreferenceDraft(profileBundle: ProfileBundle) {
  const [draft, setDraft] = useState<PreferenceDraft>(() =>
    buildPreferenceDraft(profileBundle),
  );

  function updateDraft(patch: Partial<PreferenceDraft>) {
    setDraft((currentDraft) => ({ ...currentDraft, ...patch }));
  }

  return {
    draft,
    updateDraft,
  };
}
