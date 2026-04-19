"use server";

import { redirect } from "next/navigation";
import { buildPathWithQuery } from "@/lib/auth/navigation";
import { SLEEP_QUALITY_VALUES } from "@/lib/check-in/options";
import { upsertTodayCheckInForCurrentUser } from "@/lib/check-in/service";
import type { MorningCheckInSubmission } from "@/lib/check-in/types";
import {
  FormDataValidationError,
  getEnumValue,
  getIntegerValue,
} from "@/lib/forms/parse";

function buildMorningCheckInSubmission(formData: FormData): MorningCheckInSubmission {
  return {
    energyScore: getIntegerValue(
      formData,
      "energyScore",
      { min: 1, max: 10 },
      "invalid-check-in-input",
    ),
    sleepQuality: getEnumValue(
      formData,
      "sleepQuality",
      SLEEP_QUALITY_VALUES,
      "invalid-check-in-input",
    ),
  };
}

export async function saveMorningCheckInAction(
  _previousState: null,
  formData: FormData,
): Promise<null> {
  try {
    await upsertTodayCheckInForCurrentUser(buildMorningCheckInSubmission(formData));
  } catch (error) {
    if (error instanceof FormDataValidationError) {
      redirect(buildPathWithQuery("/check-in", { error: error.code }));
    }

    throw error;
  }

  redirect(buildPathWithQuery("/dashboard", { status: "check-in-saved" }));
  return null;
}
