"use server";

import { redirect } from "next/navigation";
import { buildPathWithQuery } from "@/lib/auth/navigation";
import {
  ACTIVITY_IMPACT_LEVEL_VALUES,
  ACTIVITY_PRIORITY_LEVEL_VALUES,
} from "@/lib/planning/options";
import { createActivityForTodayForCurrentUser } from "@/lib/planning/service";
import type { CreateActivitySubmission } from "@/lib/planning/types";
import {
  assertMaxLength,
  FormDataValidationError,
  getEnumValue,
  getIntegerValue,
  getRequiredString,
  getUuidValue,
} from "@/lib/forms/parse";

function buildCreateActivitySubmission(formData: FormData): CreateActivitySubmission {
  const name = assertMaxLength(
    getRequiredString(formData, "name", "invalid-activity-input"),
    120,
    "invalid-activity-input",
  );

  return {
    name,
    categoryId: getUuidValue(formData, "categoryId", "invalid-activity-input"),
    durationMinutes: getIntegerValue(
      formData,
      "durationMinutes",
      { min: 1, max: 720 },
      "invalid-activity-input",
    ),
    impactLevel: getEnumValue(
      formData,
      "impactLevel",
      ACTIVITY_IMPACT_LEVEL_VALUES,
      "invalid-activity-input",
    ),
    priorityLevel: getEnumValue(
      formData,
      "priorityLevel",
      ACTIVITY_PRIORITY_LEVEL_VALUES,
      "invalid-activity-input",
    ),
  };
}

export async function createActivityAction(
  _previousState: null,
  formData: FormData,
): Promise<null> {
  try {
    await createActivityForTodayForCurrentUser(buildCreateActivitySubmission(formData));
  } catch (error) {
    if (error instanceof FormDataValidationError) {
      redirect(buildPathWithQuery("/planning", { error: error.code }));
    }

    if (error instanceof Error && error.message === "Ongeldige activiteitcategorie.") {
      redirect(buildPathWithQuery("/planning", { error: "invalid-activity-input" }));
    }

    throw error;
  }

  redirect(buildPathWithQuery("/planning", { status: "activity-saved" }));
  return null;
}
