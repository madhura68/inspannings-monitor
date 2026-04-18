"use client";

import { useState } from "react";
import {
  type PreferenceDraft,
  usePreferenceDraft,
} from "@/lib/preferences/use-preferences-draft";
import type { ProfileBundle } from "@/lib/profile/types";

export type OnboardingDraft = PreferenceDraft & {
  displayName: string;
};

export function useOnboardingDraft(profileBundle: ProfileBundle) {
  const { draft: preferenceDraft, updateDraft: updatePreferenceDraft } =
    usePreferenceDraft(profileBundle);
  const [displayName, setDisplayName] = useState(
    profileBundle.profile.displayName ?? "",
  );

  function updateDraft(patch: Partial<OnboardingDraft>) {
    const { displayName: nextDisplayName, ...preferencePatch } = patch;

    if (nextDisplayName !== undefined) {
      setDisplayName(nextDisplayName);
    }

    if (Object.keys(preferencePatch).length > 0) {
      updatePreferenceDraft(preferencePatch as Partial<PreferenceDraft>);
    }
  }

  return {
    draft: {
      displayName,
      ...preferenceDraft,
    },
    updateDraft,
  };
}
