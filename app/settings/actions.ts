"use server";

import { redirect } from "next/navigation";
import { buildPathWithQuery } from "@/lib/auth/navigation";
import { saveSettingsForCurrentUser } from "@/lib/profile/service";
import type { SettingsSubmission } from "@/lib/profile/types";

function getString(formData: FormData, key: string) {
  const value = formData.get(key);
  return typeof value === "string" ? value.trim() : "";
}

function getBoolean(formData: FormData, key: string) {
  return formData.get(key) === "true";
}

function buildSettingsSubmission(formData: FormData): SettingsSubmission {
  return {
    locale: getString(formData, "locale"),
    timezone: getString(formData, "timezone"),
    morningReminderEnabled: getBoolean(formData, "morningReminderEnabled"),
    morningReminderTime: getString(formData, "morningReminderTime") || null,
    reflectionReminderEnabled: getBoolean(formData, "reflectionReminderEnabled"),
    showEnergyPoints: getBoolean(formData, "showEnergyPoints"),
  };
}

export async function saveSettingsAction(formData: FormData) {
  await saveSettingsForCurrentUser(buildSettingsSubmission(formData));
  redirect(buildPathWithQuery("/settings", { status: "saved" }));
}
