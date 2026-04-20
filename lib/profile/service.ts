import { getAuthenticatedUser } from "@/lib/auth/session";
import { isSupportedOnboardingTimezone } from "@/lib/onboarding/options";
import { processProfileAvatar } from "@/lib/profile/avatar-processing";
import {
  getProfileAvatarPath,
  PROFILE_AVATAR_BUCKET,
} from "@/lib/profile/avatar";
import { createAdminClient } from "@/lib/supabase/admin";
import { createClient } from "@/lib/supabase/server";
import type {
  OnboardingSubmission,
  ProfileBundle,
  ProfileRecord,
  SettingsSubmission,
  UserSettingsRecord,
} from "@/lib/profile/types";

type SupabaseServerClient = Awaited<ReturnType<typeof createClient>>;

type ProfileRow = {
  id: string;
  email: string | null;
  display_name: string | null;
  tagline: string | null;
  bio: string | null;
  avatar_path: string | null;
  locale: string;
  timezone: string;
  onboarding_seen: boolean;
  onboarding_completed: boolean;
  created_at: string;
  updated_at: string;
};

type UserSettingsRow = {
  profile_id: string;
  morning_reminder_enabled: boolean;
  morning_reminder_time: string | null;
  reflection_reminder_enabled: boolean;
  show_energy_points: boolean;
  created_at: string;
  updated_at: string;
};

type ProfileInsert = {
  id: string;
  email: string | null;
  display_name: string | null;
  tagline: string | null;
  bio: string | null;
  avatar_path: string | null;
  locale: string;
  timezone: string;
  onboarding_seen: boolean;
  onboarding_completed: boolean;
};

type UserSettingsInsert = {
  profile_id: string;
  morning_reminder_enabled: boolean;
  morning_reminder_time: string | null;
  reflection_reminder_enabled: boolean;
  show_energy_points: boolean;
};

const PROFILE_COLUMNS =
  "id, email, display_name, tagline, bio, avatar_path, locale, timezone, onboarding_seen, onboarding_completed, created_at, updated_at";
const USER_SETTINGS_COLUMNS =
  "profile_id, morning_reminder_enabled, morning_reminder_time, reflection_reminder_enabled, show_energy_points, created_at, updated_at";

const DEFAULT_LOCALE = "nl-NL";
const DEFAULT_TIMEZONE = "Europe/Amsterdam";
const SUPPORTED_LOCALES = new Set([DEFAULT_LOCALE]);

async function buildProfileRecord(
  row: ProfileRow,
): Promise<ProfileRecord> {
  return {
    id: row.id,
    email: row.email,
    displayName: row.display_name,
    tagline: row.tagline,
    bio: row.bio,
    avatarPath: row.avatar_path,
    avatarUrl: await getProfileAvatarUrl(row.avatar_path),
    locale: row.locale,
    timezone: row.timezone,
    onboardingSeen: row.onboarding_seen,
    onboardingCompleted: row.onboarding_completed,
    createdAt: row.created_at,
    updatedAt: row.updated_at,
  };
}

function mapUserSettingsRow(row: UserSettingsRow): UserSettingsRecord {
  return {
    profileId: row.profile_id,
    morningReminderEnabled: row.morning_reminder_enabled,
    morningReminderTime: row.morning_reminder_time,
    reflectionReminderEnabled: row.reflection_reminder_enabled,
    showEnergyPoints: row.show_energy_points,
    createdAt: row.created_at,
    updatedAt: row.updated_at,
  };
}

export function buildDefaultProfileFromClaims(user: {
  id: string;
  email: string | null;
}): ProfileInsert {
  return {
    id: user.id,
    email: user.email,
    display_name: null,
    tagline: null,
    bio: null,
    avatar_path: null,
    locale: DEFAULT_LOCALE,
    timezone: DEFAULT_TIMEZONE,
    onboarding_seen: false,
    onboarding_completed: false,
  };
}

export function buildDefaultSettings(profileId: string): UserSettingsInsert {
  return {
    profile_id: profileId,
    morning_reminder_enabled: false,
    morning_reminder_time: null,
    reflection_reminder_enabled: false,
    show_energy_points: true,
  };
}

function normalizeDisplayName(value: string | null) {
  const trimmedValue = value?.trim() ?? "";
  return trimmedValue ? trimmedValue.replace(/\s+/g, " ") : null;
}

function normalizeTagline(value: string | null) {
  const trimmedValue = value?.trim() ?? "";
  return trimmedValue ? trimmedValue.replace(/\s+/g, " ") : null;
}

function normalizeBio(value: string | null) {
  const trimmedValue = value?.trim() ?? "";
  return trimmedValue ? trimmedValue : null;
}

function normalizeReminderTime(value: string | null, enabled: boolean) {
  if (!enabled) {
    return null;
  }

  const trimmedValue = value?.trim() ?? "";
  return trimmedValue || "08:30";
}

function normalizeLocale(value: string) {
  return SUPPORTED_LOCALES.has(value) ? value : DEFAULT_LOCALE;
}

function resolveTimezone(value: string) {
  return isSupportedOnboardingTimezone(value) ? value : DEFAULT_TIMEZONE;
}

async function getProfileAvatarUrl(
  avatarPath: string | null,
) {
  if (!avatarPath) {
    return null;
  }

  const adminSupabase = createAdminClient();
  const { data, error } = await adminSupabase.storage
    .from(PROFILE_AVATAR_BUCKET)
    .createSignedUrl(avatarPath, 60 * 60);

  if (error) {
    return null;
  }

  return data.signedUrl;
}

async function getRequiredAuthenticatedUser(supabase: SupabaseServerClient) {
  const {
    data: { user },
    error,
  } = await supabase.auth.getUser();

  if (error) {
    throw new Error(`Gebruiker kon niet worden geladen: ${error.message}`);
  }

  if (!user) {
    throw new Error("Er is geen ingelogde gebruiker beschikbaar.");
  }

  return {
    id: user.id,
    email: user.email ?? null,
  };
}

async function uploadProfileAvatar(
  userId: string,
  file: File,
) {
  const avatarPath = getProfileAvatarPath(userId);
  const processedAvatar = await processProfileAvatar(file);
  const adminSupabase = createAdminClient();

  const { error } = await adminSupabase.storage
    .from(PROFILE_AVATAR_BUCKET)
    .upload(avatarPath, processedAvatar.buffer, {
      cacheControl: "3600",
      contentType: processedAvatar.contentType,
      upsert: true,
    });

  if (error) {
    throw new Error(`Profielfoto kon niet worden geupload: ${error.message}`);
  }

  return avatarPath;
}

async function readProfileRow(
  supabase: SupabaseServerClient,
  userId: string,
): Promise<ProfileRow | null> {
  const { data, error } = await supabase
    .from("profiles")
    .select(PROFILE_COLUMNS)
    .eq("id", userId)
    .maybeSingle();

  if (error) {
    throw new Error(`Profiel kon niet worden geladen: ${error.message}`);
  }

  return data;
}

async function readUserSettingsRow(
  supabase: SupabaseServerClient,
  userId: string,
): Promise<UserSettingsRow | null> {
  const { data, error } = await supabase
    .from("user_settings")
    .select(USER_SETTINGS_COLUMNS)
    .eq("profile_id", userId)
    .maybeSingle();

  if (error) {
    throw new Error(`Instellingen konden niet worden geladen: ${error.message}`);
  }

  return data;
}

async function insertMissingProfile(
  supabase: SupabaseServerClient,
  user: { id: string; email: string | null },
) {
  const { error } = await supabase.from("profiles").upsert(
    buildDefaultProfileFromClaims(user),
    {
      onConflict: "id",
      ignoreDuplicates: true,
    },
  );

  if (error) {
    throw new Error(`Profiel kon niet worden aangemaakt: ${error.message}`);
  }
}

async function syncProfileEmailIfNeeded(
  supabase: SupabaseServerClient,
  profile: ProfileRow,
  email: string | null,
): Promise<ProfileRow> {
  if (!email || profile.email === email) {
    return profile;
  }

  const { data, error } = await supabase
    .from("profiles")
    .update({ email })
    .eq("id", profile.id)
    .select(PROFILE_COLUMNS)
    .single();

  if (error) {
    throw new Error(`Profiel-e-mailadres kon niet worden bijgewerkt: ${error.message}`);
  }

  return data;
}

async function insertMissingUserSettings(
  supabase: SupabaseServerClient,
  userId: string,
) {
  const { error } = await supabase.from("user_settings").upsert(
    buildDefaultSettings(userId),
    {
      onConflict: "profile_id",
      ignoreDuplicates: true,
    },
  );

  if (error) {
    throw new Error(`Instellingen konden niet worden aangemaakt: ${error.message}`);
  }
}

export async function markOnboardingSeenForCurrentUser() {
  const user = await getAuthenticatedUser();

  if (!user) {
    throw new Error("Er is geen ingelogde gebruiker beschikbaar.");
  }

  const supabase = await createClient();
  const { error } = await supabase
    .from("profiles")
    .update({ onboarding_seen: true, onboarding_completed: false })
    .eq("id", user.id);

  if (error) {
    throw new Error(`Onboardingstatus kon niet worden bijgewerkt: ${error.message}`);
  }
}

export async function completeOnboardingForCurrentUser(
  submission: OnboardingSubmission,
) {
  const user = await getAuthenticatedUser();

  if (!user) {
    throw new Error("Er is geen ingelogde gebruiker beschikbaar.");
  }

  const timezone = resolveTimezone(submission.timezone);

  const supabase = await createClient();
  const displayName = normalizeDisplayName(submission.displayName);
  const morningReminderTime = normalizeReminderTime(
    submission.morningReminderTime,
    submission.morningReminderEnabled,
  );

  const { error: profileError } = await supabase
    .from("profiles")
    .update({
      display_name: displayName,
      timezone,
      onboarding_seen: true,
      onboarding_completed: true,
    })
    .eq("id", user.id);

  if (profileError) {
    throw new Error(`Profiel kon niet worden bijgewerkt: ${profileError.message}`);
  }

  const { error: settingsError } = await supabase
    .from("user_settings")
    .update({
      morning_reminder_enabled: submission.morningReminderEnabled,
      morning_reminder_time: morningReminderTime,
      reflection_reminder_enabled: submission.reflectionReminderEnabled,
      show_energy_points: submission.showEnergyPoints,
    })
    .eq("profile_id", user.id);

  if (settingsError) {
    throw new Error(`Instellingen konden niet worden bijgewerkt: ${settingsError.message}`);
  }

  return ensureProfileBundleForCurrentUser();
}

export async function saveSettingsForCurrentUser(
  submission: SettingsSubmission,
) {
  const supabase = await createClient();
  const user = await getRequiredAuthenticatedUser(supabase);
  await ensureProfileBundleForCurrentUser();
  const locale = normalizeLocale(submission.locale);
  const timezone = resolveTimezone(submission.timezone);
  const displayName = normalizeDisplayName(submission.displayName);
  const tagline = normalizeTagline(submission.tagline);
  const bio = normalizeBio(submission.bio);
  const morningReminderTime = normalizeReminderTime(
    submission.morningReminderTime,
    submission.morningReminderEnabled,
  );
  const avatarPath = submission.avatarFile
    ? await uploadProfileAvatar(user.id, submission.avatarFile)
    : null;

  const { error: profileError } = await supabase
    .from("profiles")
    .update({
      display_name: displayName,
      tagline,
      bio,
      ...(avatarPath ? { avatar_path: avatarPath } : {}),
      locale,
      timezone,
    })
    .eq("id", user.id);

  if (profileError) {
    throw new Error(`Profielinstellingen konden niet worden bijgewerkt: ${profileError.message}`);
  }

  const { error: settingsError } = await supabase
    .from("user_settings")
    .update({
      morning_reminder_enabled: submission.morningReminderEnabled,
      morning_reminder_time: morningReminderTime,
      reflection_reminder_enabled: submission.reflectionReminderEnabled,
      show_energy_points: submission.showEnergyPoints,
    })
    .eq("profile_id", user.id);

  if (settingsError) {
    throw new Error(`Gebruikersinstellingen konden niet worden bijgewerkt: ${settingsError.message}`);
  }

  return ensureProfileBundleForCurrentUser();
}

export async function saveProfileAvatarForCurrentUser(file: File) {
  const supabase = await createClient();
  const user = await getRequiredAuthenticatedUser(supabase);
  await ensureProfileBundleForCurrentUser();
  const avatarPath = await uploadProfileAvatar(user.id, file);

  const { error } = await supabase
    .from("profiles")
    .update({
      avatar_path: avatarPath,
    })
    .eq("id", user.id);

  if (error) {
    throw new Error(`Profielfoto kon niet worden opgeslagen: ${error.message}`);
  }

  return ensureProfileBundleForCurrentUser();
}

export async function ensureProfileBundleForCurrentUser(): Promise<ProfileBundle | null> {
  const user = await getAuthenticatedUser();

  if (!user) {
    return null;
  }

  const supabase = await createClient();

  // We bootstrap records app-side so the first protected page load is enough
  // to give every authenticated user a minimal profile and settings basis.
  let profileRow = await readProfileRow(supabase, user.id);

  if (!profileRow) {
    await insertMissingProfile(supabase, user);
    profileRow = await readProfileRow(supabase, user.id);
  }

  if (!profileRow) {
    throw new Error("Profielrecord ontbreekt na bootstrap.");
  }

  profileRow = await syncProfileEmailIfNeeded(supabase, profileRow, user.email);

  let userSettingsRow = await readUserSettingsRow(supabase, user.id);

  if (!userSettingsRow) {
    await insertMissingUserSettings(supabase, user.id);
    userSettingsRow = await readUserSettingsRow(supabase, user.id);
  }

  if (!userSettingsRow) {
    throw new Error("Settingsrecord ontbreekt na bootstrap.");
  }

  return {
    profile: await buildProfileRecord(profileRow),
    settings: mapUserSettingsRow(userSettingsRow),
  };
}

export async function getProfileBundleForCurrentUser(): Promise<ProfileBundle | null> {
  return ensureProfileBundleForCurrentUser();
}

export type NavProfile = {
  avatarUrl: string | null;
  displayName: string | null;
};

export async function getNavProfileForCurrentUser(userId: string): Promise<NavProfile> {
  const supabase = await createClient();
  const { data } = await supabase
    .from("profiles")
    .select("avatar_path, display_name")
    .eq("id", userId)
    .maybeSingle();

  return {
    avatarUrl: await getProfileAvatarUrl(data?.avatar_path ?? null),
    displayName: data?.display_name ?? null,
  };
}

