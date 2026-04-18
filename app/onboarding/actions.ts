"use server";

import { redirect } from "next/navigation";
import { buildPathWithQuery } from "@/lib/auth/navigation";
import {
  completeOnboardingForCurrentUser,
  markOnboardingSeenForCurrentUser,
} from "@/lib/profile/service";
import type { OnboardingSubmission } from "@/lib/profile/types";

function getString(formData: FormData, key: string) {
  const value = formData.get(key);
  return typeof value === "string" ? value.trim() : "";
}

function getBoolean(formData: FormData, key: string) {
  return formData.get(key) === "true";
}

function buildOnboardingSubmission(formData: FormData): OnboardingSubmission {
  return {
    displayName: getString(formData, "displayName") || null,
    timezone: getString(formData, "timezone"),
    morningReminderEnabled: getBoolean(formData, "morningReminderEnabled"),
    morningReminderTime: getString(formData, "morningReminderTime") || null,
    reflectionReminderEnabled: getBoolean(formData, "reflectionReminderEnabled"),
    showEnergyPoints: getBoolean(formData, "showEnergyPoints"),
  };
}

export async function completeOnboardingAction(formData: FormData) {
  await completeOnboardingForCurrentUser(buildOnboardingSubmission(formData));
  redirect(buildPathWithQuery("/dashboard", { status: "onboarding-completed" }));
}

export async function skipOnboardingAction() {
  await markOnboardingSeenForCurrentUser();
  redirect(buildPathWithQuery("/dashboard", { status: "onboarding-skipped" }));
}
