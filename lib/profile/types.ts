export type ProfileRecord = {
  id: string;
  email: string | null;
  displayName: string | null;
  tagline: string | null;
  bio: string | null;
  avatarPath: string | null;
  avatarUrl: string | null;
  locale: string;
  timezone: string;
  onboardingSeen: boolean;
  onboardingCompleted: boolean;
  createdAt: string;
  updatedAt: string;
};

export type UserSettingsRecord = {
  profileId: string;
  morningReminderEnabled: boolean;
  morningReminderTime: string | null;
  reflectionReminderEnabled: boolean;
  showEnergyPoints: boolean;
  createdAt: string;
  updatedAt: string;
};

export type ProfileBundle = {
  profile: ProfileRecord;
  settings: UserSettingsRecord;
};

export type OnboardingSubmission = {
  displayName: string | null;
  timezone: string;
  morningReminderEnabled: boolean;
  morningReminderTime: string | null;
  reflectionReminderEnabled: boolean;
  showEnergyPoints: boolean;
};

export type SettingsSubmission = {
  displayName: string | null;
  tagline: string | null;
  bio: string | null;
  avatarFile: File | null;
  locale: string;
  timezone: string;
  morningReminderEnabled: boolean;
  morningReminderTime: string | null;
  reflectionReminderEnabled: boolean;
  showEnergyPoints: boolean;
};

export type AvatarUploadActionState = {
  status: "idle" | "success" | "error";
  code?: string;
};
