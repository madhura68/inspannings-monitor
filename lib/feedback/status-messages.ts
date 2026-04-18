import { getAuthNotice } from "@/lib/auth/messages";

export type StatusToastVariant = "success" | "info" | "warning" | "error";

export type StatusToast = {
  variant: StatusToastVariant;
  title?: string;
  message: string;
};

const dashboardStatusToasts: Record<string, StatusToast> = {
  "onboarding-completed": {
    variant: "success",
    title: "Onboarding opgeslagen",
    message: "Je basisinstellingen staan nu klaar.",
  },
  "onboarding-skipped": {
    variant: "info",
    title: "Onboarding overgeslagen",
    message: "Je kunt de onboarding later alsnog afronden vanuit het dashboard.",
  },
  "test-wizard-completed": {
    variant: "success",
    title: "Test wizard afgerond",
    message: "De generieke wizard-flow werkt nu vanaf het dashboard.",
  },
  "check-in-saved": {
    variant: "success",
    title: "Ochtendcheck-in opgeslagen",
    message: "Je energiestart van vandaag staat nu klaar op je dashboard.",
  },
};

const settingsStatusToasts: Record<string, StatusToast> = {
  saved: {
    variant: "success",
    title: "Instellingen opgeslagen",
    message: "Je voorkeuren zijn bijgewerkt.",
  },
};

const settingsErrorToasts: Record<string, StatusToast> = {
  "invalid-settings-input": {
    variant: "error",
    title: "Instellingen niet opgeslagen",
    message: "Controleer je tijd, timezone en voorkeurvelden en probeer het opnieuw.",
  },
};

const onboardingErrorToasts: Record<string, StatusToast> = {
  "invalid-onboarding-input": {
    variant: "error",
    title: "Onboarding niet opgeslagen",
    message: "Controleer je ingevoerde voorkeuren en probeer het opnieuw.",
  },
};

const checkInErrorToasts: Record<string, StatusToast> = {
  "invalid-check-in-input": {
    variant: "error",
    title: "Check-in niet opgeslagen",
    message: "Kies een energiescore tussen 1 en 10 en een geldige slaapkwaliteit.",
  },
};

export function getDashboardStatusToast(status: string | null): StatusToast | null {
  if (!status) {
    return null;
  }

  return dashboardStatusToasts[status] ?? null;
}

export function getSettingsStatusToast(
  error: string | null,
  status: string | null,
): StatusToast | null {
  if (error && settingsErrorToasts[error]) {
    return settingsErrorToasts[error];
  }

  if (!status) {
    return null;
  }

  return settingsStatusToasts[status] ?? null;
}

export function getOnboardingStatusToast(
  error: string | null,
  status: string | null,
): StatusToast | null {
  if (error && onboardingErrorToasts[error]) {
    return onboardingErrorToasts[error];
  }

  if (!status) {
    return null;
  }

  return null;
}

export function getCheckInStatusToast(
  error: string | null,
  status: string | null,
): StatusToast | null {
  if (error && checkInErrorToasts[error]) {
    return checkInErrorToasts[error];
  }

  if (!status) {
    return null;
  }

  return null;
}

export function getAuthStatusToast(
  error: string | null,
  status: string | null,
): StatusToast | null {
  const notice = getAuthNotice(error, status);

  if (!notice) {
    return null;
  }

  return {
    variant: notice.tone,
    message: notice.text,
  };
}
