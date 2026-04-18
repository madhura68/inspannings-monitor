"use server";

import { redirect } from "next/navigation";
import { buildPathWithQuery } from "@/lib/auth/navigation";
import {
  FormDataValidationError,
  getBooleanValue,
  getEnumValue,
  getOptionalTimeValue,
} from "@/lib/forms/parse";
import { ONBOARDING_TIMEZONE_OPTIONS } from "@/lib/onboarding/options";
import { saveSettingsForCurrentUser } from "@/lib/profile/service";
import type { SettingsSubmission } from "@/lib/profile/types";

const LOCALE_VALUES = ["nl-NL"] as const;
const ONBOARDING_TIMEZONE_VALUES = ONBOARDING_TIMEZONE_OPTIONS.map((option) => option.value);

function buildSettingsSubmission(formData: FormData): SettingsSubmission {
  const morningReminderEnabled = getBooleanValue(
    formData,
    "morningReminderEnabled",
    "invalid-settings-input",
  );
  const reminderTime = getOptionalTimeValue(
    formData,
    "morningReminderTime",
    "invalid-settings-input",
  );

  return {
    locale: getEnumValue(formData, "locale", LOCALE_VALUES, "invalid-settings-input"),
    timezone: getEnumValue(
      formData,
      "timezone",
      ONBOARDING_TIMEZONE_VALUES,
      "invalid-settings-input",
    ),
    morningReminderEnabled,
    morningReminderTime: morningReminderEnabled ? reminderTime : null,
    reflectionReminderEnabled: getBooleanValue(
      formData,
      "reflectionReminderEnabled",
      "invalid-settings-input",
    ),
    showEnergyPoints: getBooleanValue(
      formData,
      "showEnergyPoints",
      "invalid-settings-input",
    ),
  };
}

export async function saveSettingsAction(
  _previousState: null,
  formData: FormData,
): Promise<null> {
  try {
    await saveSettingsForCurrentUser(buildSettingsSubmission(formData));
  } catch (error) {
    if (error instanceof FormDataValidationError) {
      redirect(buildPathWithQuery("/settings", { error: error.code }));
    }

    throw error;
  }

  redirect(buildPathWithQuery("/settings", { status: "saved" }));
  return null;
}
