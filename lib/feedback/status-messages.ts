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

const planningStatusToasts: Record<string, StatusToast> = {
  "activity-saved": {
    variant: "success",
    title: "Activiteit gepland",
    message: "Je activiteit staat nu in je dagplanning van vandaag.",
  },
  "activity-status-saved": {
    variant: "success",
    title: "Activiteit bijgewerkt",
    message: "De status van je activiteit is opgeslagen.",
  },
  "activity-evaluation-saved": {
    variant: "success",
    title: "Evaluatie opgeslagen",
    message: "De extra context bij deze activiteit is bijgewerkt.",
  },
};

const planningErrorToasts: Record<string, StatusToast> = {
  "invalid-activity-input": {
    variant: "error",
    title: "Activiteit niet opgeslagen",
    message:
      "Controleer naam, categorie, duur, impact en prioriteit en probeer het opnieuw.",
  },
  "invalid-activity-status": {
    variant: "error",
    title: "Status niet opgeslagen",
    message: "De gekozen activiteit of status is ongeldig voor vandaag.",
  },
  "activity-status-failed": {
    variant: "error",
    title: "Status niet opgeslagen",
    message: "De activiteitstatus kon niet worden bijgewerkt. Probeer het opnieuw.",
  },
  "invalid-activity-evaluation": {
    variant: "error",
    title: "Evaluatie niet opgeslagen",
    message:
      "Controleer de skip-reden of toelichting en probeer het opnieuw.",
  },
  "activity-evaluation-failed": {
    variant: "error",
    title: "Evaluatie niet opgeslagen",
    message: "De extra context bij deze activiteit kon niet worden opgeslagen.",
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

export function getPlanningStatusToast(
  error: string | null,
  status: string | null,
): StatusToast | null {
  if (error && planningErrorToasts[error]) {
    return planningErrorToasts[error];
  }

  if (!status) {
    return null;
  }

  return planningStatusToasts[status] ?? null;
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
