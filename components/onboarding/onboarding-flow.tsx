"use client";

import { useActionState } from "react";
import { completeOnboardingAction, skipOnboardingAction } from "@/app/onboarding/actions";
import { OnboardingStepIntro } from "@/components/onboarding/onboarding-step-intro";
import { OnboardingStepPreferences } from "@/components/onboarding/onboarding-step-preferences";
import { OnboardingStepProfile } from "@/components/onboarding/onboarding-step-profile";
import { PreferenceHiddenFields } from "@/components/preferences/preference-hidden-fields";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Button } from "@/components/ui/button";
import { WizardShell } from "@/components/wizard/wizard-shell";
import { useOnboardingDraft, type OnboardingDraft } from "@/lib/onboarding/use-onboarding-draft";
import type { ProfileBundle } from "@/lib/profile/types";
import { useWizardFlow } from "@/lib/wizard/use-wizard-flow";
import type { WizardStepDefinition } from "@/lib/wizard/types";

type OnboardingFlowProps = {
  profileBundle: ProfileBundle;
};

const steps: WizardStepDefinition<OnboardingDraft>[] = [
  {
    id: "intro",
    eyebrow: "Stap 1",
    title: "Zo gebruiken we Inspannings Monitor",
    description:
      "De app helpt je om je dag rustiger te plannen en terug te kijken zonder medische claims of zorgverlenerfuncties.",
  },
  {
    id: "profile",
    eyebrow: "Stap 2",
    title: "Basisprofiel",
    description:
      "Kies hoe de app je mag aanspreken en welke timezone het best bij je dagindeling past.",
    canContinue: (draft) => draft.timezone.length > 0,
  },
  {
    id: "preferences",
    eyebrow: "Stap 3",
    title: "Startvoorkeuren",
    description:
      "Kies rustig hoe zichtbaar je energiebudget is en of je lichte reminders wilt ontvangen.",
  },
] as const;

function renderCurrentStep(
  stepId: string,
  draft: OnboardingDraft,
  updateDraft: (patch: Partial<OnboardingDraft>) => void,
  disabled: boolean,
) {
  switch (stepId) {
    case "intro":
      return <OnboardingStepIntro />;
    case "profile":
      return (
        <OnboardingStepProfile
          draft={draft}
          updateDraft={updateDraft}
          disabled={disabled}
        />
      );
    case "preferences":
      return (
        <OnboardingStepPreferences
          draft={draft}
          updateDraft={updateDraft}
          disabled={disabled}
        />
      );
    default:
      return null;
  }
}

export function OnboardingFlow({ profileBundle }: OnboardingFlowProps) {
  const [, completeFormAction, isCompleting] = useActionState(completeOnboardingAction, null);
  const [, skipFormAction, isSkipping] = useActionState(skipOnboardingAction, null);
  const { draft, updateDraft } = useOnboardingDraft(profileBundle);
  const wizard = useWizardFlow({
    steps,
    draft,
  });
  const isPending = isCompleting || isSkipping;

  const aside = (
    <Alert className="rounded-[var(--radius-2xl)] border-white/10 bg-white/8 text-primary-foreground [&_svg]:text-primary-foreground/80">
      <AlertDescription className="leading-7 text-current">
        <span className="block font-semibold">Release 1 blijft bewust wellness-first.</span>
        <span className="mt-2 block">
          Alleen voor individuele gebruikers, zonder delen of zorgverlenerstoegang.
        </span>
        <span className="block">
          De app geeft geen diagnose, behandeling of medisch advies.
        </span>
        <span className="block">
          Bij acute of snel verslechterende klachten hoort directe hulp via arts, huisartsenpost of 112 buiten deze app.
        </span>
      </AlertDescription>
    </Alert>
  );

  const topAction = (
    <>
      <p className="text-xs font-semibold uppercase tracking-[0.24em] text-muted-foreground">
        Korte onboarding
      </p>
      <form action={skipFormAction}>
        <Button type="submit" variant="outline" disabled={isPending} className="rounded-full">
          {isSkipping ? "Overslaan..." : "Nu overslaan"}
        </Button>
      </form>
    </>
  );

  const backAction = (
    <Button
      type="button"
      variant="outline"
      onClick={wizard.goToPreviousStep}
      disabled={wizard.isFirstStep || isPending}
      className="rounded-full"
    >
      Vorige
    </Button>
  );

  const nextAction = wizard.isLastStep ? (
    <Button
      key="complete-onboarding"
      type="submit"
      form="onboarding-form"
      disabled={isPending}
      className="rounded-full"
    >
      {isCompleting ? "Onboarding opslaan..." : "Rond onboarding af"}
    </Button>
  ) : (
    <Button
      key={`next-step-${wizard.currentStep.id}`}
      type="button"
      onClick={wizard.goToNextStep}
      disabled={!wizard.canContinue || isPending}
      className="rounded-full"
    >
      Ga verder
    </Button>
  );

  return (
    <WizardShell
      eyebrow={wizard.currentStep.eyebrow}
      title={wizard.currentStep.title}
      description={wizard.currentStep.description}
      progressCurrent={wizard.currentStepIndex + 1}
      progressTotal={wizard.steps.length}
      topAction={topAction}
      aside={aside}
      backAction={backAction}
      nextAction={nextAction}
    >
      <form
        id="onboarding-form"
        action={completeFormAction}
        className="space-y-6"
        aria-busy={isPending}
      >
        <input type="hidden" name="displayName" value={draft.displayName} />
        <PreferenceHiddenFields draft={draft} />

        {renderCurrentStep(wizard.currentStep.id, draft, updateDraft, isPending)}
      </form>
    </WizardShell>
  );
}
