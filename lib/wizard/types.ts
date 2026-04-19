export type WizardStepDefinition<TDraft> = {
  id: string;
  eyebrow?: string;
  title: string;
  description?: string;
  canContinue?: (draft: TDraft) => boolean;
};

export type WizardFlowState<TDraft> = {
  steps: WizardStepDefinition<TDraft>[];
  currentStepIndex: number;
  currentStep: WizardStepDefinition<TDraft>;
  isFirstStep: boolean;
  isLastStep: boolean;
  canContinue: boolean;
  goToNextStep: () => void;
  goToPreviousStep: () => void;
  goToStep: (stepId: string) => void;
};
