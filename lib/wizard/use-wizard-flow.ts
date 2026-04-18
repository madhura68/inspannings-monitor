"use client";

import { useMemo, useState } from "react";
import type { WizardFlowState, WizardStepDefinition } from "@/lib/wizard/types";

type UseWizardFlowOptions<TDraft> = {
  steps: WizardStepDefinition<TDraft>[];
  draft: TDraft;
  initialStepId?: string;
};

export function useWizardFlow<TDraft>({
  steps,
  draft,
  initialStepId,
}: UseWizardFlowOptions<TDraft>): WizardFlowState<TDraft> {
  const initialStepIndex = useMemo(() => {
    if (!initialStepId) {
      return 0;
    }

    const stepIndex = steps.findIndex((step) => step.id === initialStepId);
    return stepIndex >= 0 ? stepIndex : 0;
  }, [initialStepId, steps]);

  const [currentStepIndex, setCurrentStepIndex] = useState(initialStepIndex);
  const currentStep = steps[currentStepIndex];
  const isFirstStep = currentStepIndex === 0;
  const isLastStep = currentStepIndex === steps.length - 1;
  const canContinue = currentStep?.canContinue ? currentStep.canContinue(draft) : true;

  function goToNextStep() {
    if (isLastStep || !canContinue) {
      return;
    }

    setCurrentStepIndex((stepIndex) => Math.min(steps.length - 1, stepIndex + 1));
  }

  function goToPreviousStep() {
    if (isFirstStep) {
      return;
    }

    setCurrentStepIndex((stepIndex) => Math.max(0, stepIndex - 1));
  }

  function goToStep(stepId: string) {
    const stepIndex = steps.findIndex((step) => step.id === stepId);

    if (stepIndex >= 0) {
      setCurrentStepIndex(stepIndex);
    }
  }

  return {
    steps,
    currentStepIndex,
    currentStep,
    isFirstStep,
    isLastStep,
    canContinue,
    goToNextStep,
    goToPreviousStep,
    goToStep,
  };
}
