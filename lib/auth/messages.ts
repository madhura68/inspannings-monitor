export type AuthNoticeTone = "error" | "success" | "info";

export type AuthNotice = {
  tone: AuthNoticeTone;
  text: string;
};

const errorMessages: Record<string, AuthNotice> = {
  "auth-not-configured": {
    tone: "error",
    text: "Supabase is nog niet geconfigureerd. Voeg eerst je URL en publishable key toe.",
  },
  "invalid-credentials": {
    tone: "error",
    text: "De combinatie van e-mailadres en wachtwoord klopt niet.",
  },
  "email-not-confirmed": {
    tone: "error",
    text: "Bevestig eerst je e-mailadres via de link in je inbox.",
  },
  "missing-fields": {
    tone: "error",
    text: "Vul zowel je e-mailadres als je wachtwoord in.",
  },
  "invalid-email": {
    tone: "error",
    text: "Gebruik een geldig e-mailadres.",
  },
  "password-too-short": {
    tone: "error",
    text: "Gebruik een wachtwoord van minimaal 8 tekens.",
  },
  "signup-failed": {
    tone: "error",
    text: "Je account kon niet worden aangemaakt. Probeer het opnieuw.",
  },
  "signup-rate-limited": {
    tone: "error",
    text: "Er zijn nu te veel verificatie-e-mails verstuurd. Wacht even en probeer het daarna opnieuw.",
  },
  "login-failed": {
    tone: "error",
    text: "Inloggen is niet gelukt. Probeer het opnieuw.",
  },
  "verification-failed": {
    tone: "error",
    text: "De verificatielink is ongeldig of verlopen. Vraag zo nodig een nieuwe aan.",
  },
};

const statusMessages: Record<string, AuthNotice> = {
  "check-email": {
    tone: "success",
    text: "Controleer je e-mail en activeer je account via de verificatielink.",
  },
  "signed-out": {
    tone: "info",
    text: "Je bent uitgelogd.",
  },
  verified: {
    tone: "success",
    text: "Je e-mailadres is bevestigd. Welkom terug.",
  },
};

export function getAuthNotice(
  error?: string | null,
  status?: string | null,
): AuthNotice | null {
  if (error && errorMessages[error]) {
    return errorMessages[error];
  }

  if (status && statusMessages[status]) {
    return statusMessages[status];
  }

  return null;
}
