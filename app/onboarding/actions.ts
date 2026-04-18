"use server";

import { redirect } from "next/navigation";
import { buildPathWithQuery } from "@/lib/auth/navigation";
import {
  FormDataValidationError,
  getBooleanValue,
  getEnumValue,
  getOptionalString,
  getOptionalTimeValue,
} from "@/lib/forms/parse";
import { ONBOARDING_TIMEZONE_OPTIONS } from "@/lib/onboarding/options";
import {
  completeOnboardingForCurrentUser,
  markOnboardingSeenForCurrentUser,
} from "@/lib/profile/service";
import type { OnboardingSubmission } from "@/lib/profile/types";

const ONBOARDING_TIMEZONE_VALUES = ONBOARDING_TIMEZONE_OPTIONS.map((option) => option.value);

function buildOnboardingSubmission(formData: FormData): OnboardingSubmission {
  const morningReminderEnabled = getBooleanValue(
    formData,
    "morningReminderEnabled",
    "invalid-onboarding-input",
  );
  const reminderTime = getOptionalTimeValue(
    formData,
    "morningReminderTime",
    "invalid-onboarding-input",
  );

  return {
    displayName: getOptionalString(formData, "displayName") || null,
    timezone: getEnumValue(
      formData,
      "timezone",
      ONBOARDING_TIMEZONE_VALUES,
      "invalid-onboarding-input",
    ),
    morningReminderEnabled,
    morningReminderTime: morningReminderEnabled ? reminderTime : null,
    reflectionReminderEnabled: getBooleanValue(
      formData,
      "reflectionReminderEnabled",
      "invalid-onboarding-input",
    ),
    showEnergyPoints: getBooleanValue(
      formData,
      "showEnergyPoints",
      "invalid-onboarding-input",
    ),
  };
}

export async function completeOnboardingAction(
  _previousState: null,
  formData: FormData,
): Promise<null> {
  try {
    await completeOnboardingForCurrentUser(buildOnboardingSubmission(formData));
  } catch (error) {
    if (error instanceof FormDataValidationError) {
      redirect(buildPathWithQuery("/onboarding", { error: error.code }));
    }

    throw error;
  }

  redirect(buildPathWithQuery("/dashboard", { status: "onboarding-completed" }));
  return null;
}

export async function skipOnboardingAction(
  _previousState: null,
  _formData: FormData,
): Promise<null> {
  await markOnboardingSeenForCurrentUser();
  redirect(buildPathWithQuery("/dashboard", { status: "onboarding-skipped" }));
  return null;
}
