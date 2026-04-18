export function isTestWizardEnabled() {
  return process.env.NEXT_PUBLIC_ENABLE_TEST_WIZARD === "true";
}
