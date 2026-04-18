export const ONBOARDING_TIMEZONE_OPTIONS = [
  {
    value: "Europe/Amsterdam",
    label: "Europa/Amsterdam",
  },
  {
    value: "Europe/Brussels",
    label: "Europa/Brussel",
  },
  {
    value: "Europe/Berlin",
    label: "Europa/Berlijn",
  },
  {
    value: "UTC",
    label: "UTC",
  },
] as const;

const ONBOARDING_TIMEZONE_SET = new Set(
  ONBOARDING_TIMEZONE_OPTIONS.map((option) => option.value),
);

export function isSupportedOnboardingTimezone(value: string) {
  return ONBOARDING_TIMEZONE_SET.has(
    value as (typeof ONBOARDING_TIMEZONE_OPTIONS)[number]["value"],
  );
}
