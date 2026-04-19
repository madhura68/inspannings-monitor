"use server";

import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { buildPathWithQuery } from "@/lib/auth/navigation";
import {
  assertMaxLength,
  FormDataValidationError,
  getBooleanValue,
  getEnumValue,
  getOptionalString,
  getOptionalTimeValue,
} from "@/lib/forms/parse";
import { ONBOARDING_TIMEZONE_OPTIONS } from "@/lib/onboarding/options";
import { ProfileAvatarProcessingError } from "@/lib/profile/avatar-processing";
import {
  isAllowedProfileAvatarMimeType,
  PROFILE_AVATAR_UPLOAD_MAX_BYTES,
} from "@/lib/profile/avatar";
import {
  saveProfileAvatarForCurrentUser,
  saveSettingsForCurrentUser,
} from "@/lib/profile/service";
import type {
  AvatarUploadActionState,
  SettingsSubmission,
} from "@/lib/profile/types";

const LOCALE_VALUES = ["nl-NL"] as const;
const ONBOARDING_TIMEZONE_VALUES = ONBOARDING_TIMEZONE_OPTIONS.map((option) => option.value);
const MAX_DISPLAY_NAME_LENGTH = 80;
const MAX_TAGLINE_LENGTH = 160;
const MAX_BIO_LENGTH = 2000;

function getOptionalBoundedString(
  formData: FormData,
  key: string,
  maximumLength: number,
  errorCode: string,
) {
  const value = getOptionalString(formData, key);

  if (value === null) {
    return null;
  }

  return assertMaxLength(value, maximumLength, errorCode);
}

function getOptionalAvatarFile(formData: FormData) {
  const value = formData.get("avatar");

  if (!(value instanceof File) || value.size === 0) {
    return null;
  }

  if (
    value.size > PROFILE_AVATAR_UPLOAD_MAX_BYTES ||
    !isAllowedProfileAvatarMimeType(value.type)
  ) {
    throw new FormDataValidationError("invalid-avatar-file");
  }

  return value;
}

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
    displayName: getOptionalBoundedString(
      formData,
      "displayName",
      MAX_DISPLAY_NAME_LENGTH,
      "invalid-settings-input",
    ),
    tagline: getOptionalBoundedString(
      formData,
      "tagline",
      MAX_TAGLINE_LENGTH,
      "invalid-settings-input",
    ),
    bio: getOptionalBoundedString(
      formData,
      "bio",
      MAX_BIO_LENGTH,
      "invalid-settings-input",
    ),
    avatarFile: getOptionalAvatarFile(formData),
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

export async function uploadAvatarAction(
  _previousState: AvatarUploadActionState,
  formData: FormData,
): Promise<AvatarUploadActionState> {
  try {
    const avatarFile = getOptionalAvatarFile(formData);

    if (!avatarFile) {
      throw new FormDataValidationError("invalid-avatar-file");
    }

    await saveProfileAvatarForCurrentUser(avatarFile);
    revalidatePath("/settings");
    revalidatePath("/dashboard");

    return {
      status: "success",
      code: "avatar-saved",
    };
  } catch (error) {
    if (error instanceof FormDataValidationError) {
      return {
        status: "error",
        code: error.code,
      };
    }

    if (error instanceof ProfileAvatarProcessingError) {
      return {
        status: "error",
        code: "invalid-avatar-file",
      };
    }

    throw error;
  }
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

    if (error instanceof ProfileAvatarProcessingError) {
      redirect(buildPathWithQuery("/settings", { error: "invalid-avatar-file" }));
    }

    throw error;
  }

  redirect(buildPathWithQuery("/settings", { status: "saved" }));
  return null;
}
