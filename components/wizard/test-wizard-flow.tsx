"use client";

import { useRouter } from "next/navigation";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { WizardShell } from "@/components/wizard/wizard-shell";
import { useWizardFlow } from "@/lib/wizard/use-wizard-flow";
import type { WizardStepDefinition } from "@/lib/wizard/types";

type TestWizardDraft = Record<string, never>;

const steps: WizardStepDefinition<TestWizardDraft>[] = [
  {
    id: "step-1",
    eyebrow: "Stap 1",
    title: "Stap 1",
    description: "Eerste simpele teststap om de wizard-shell en navigatie te valideren.",
  },
  {
    id: "step-2",
    eyebrow: "Stap 2",
    title: "Stap 2",
    description: "Tweede stap voor controle van voortgang, vorige/volgende en layoutconsistentie.",
  },
  {
    id: "step-3",
    eyebrow: "Stap 3",
    title: "Stap 3",
    description: "Derde stap om te bevestigen dat multi-step flows generiek inzetbaar blijven.",
  },
  {
    id: "step-4",
    eyebrow: "Stap 4",
    title: "Stap 4",
    description: "Vierde stap als tussenpunt vlak voor afronding van de testflow.",
  },
  {
    id: "step-5",
    eyebrow: "Stap 5",
    title: "Stap 5",
    description: "Laatste stap voor afronding en redirect terug naar het dashboard.",
  },
];

const testStepDescriptions: Record<string, string> = {
  "step-1": "Deze stap bewijst dat de flow op de eerste positie correct opstart.",
  "step-2": "Deze stap bewijst dat vooruit navigeren geen state of layout breekt.",
  "step-3": "Deze stap is het midden van de flow en is handig voor regressietests.",
  "step-4": "Deze stap bevestigt dat de shell netjes blijft werken richting het einde.",
  "step-5": "Deze stap bevestigt dat afronden als aparte actie werkt op de laatste stap.",
};

export function TestWizardFlow() {
  const router = useRouter();
  const wizard = useWizardFlow({
    steps,
    draft: {},
  });

  function finishWizard() {
    router.push("/dashboard?status=test-wizard-completed");
  }

  const aside = (
    <Alert className="rounded-[var(--radius-2xl)] border-white/10 bg-white/8 text-primary-foreground [&_svg]:text-primary-foreground/80">
      <AlertDescription className="leading-7 text-current">
        <span className="block font-semibold">Interne testwizard</span>
        <span className="mt-2 block">
          Alleen bedoeld om de generieke wizard-core te controleren voor toekomstige flows.
        </span>
      </AlertDescription>
    </Alert>
  );

  const topAction = (
    <>
      <p className="text-xs font-semibold uppercase tracking-[0.24em] text-muted-foreground">
        Test wizard
      </p>
      <Button
        type="button"
        variant="outline"
        className="rounded-full"
        onClick={() => router.push("/dashboard")}
      >
        Terug naar dashboard
      </Button>
    </>
  );

  const backAction = (
    <Button
      type="button"
      variant="outline"
      onClick={wizard.goToPreviousStep}
      disabled={wizard.isFirstStep}
      className="rounded-full"
    >
      Vorige
    </Button>
  );

  const nextAction = wizard.isLastStep ? (
    <Button type="button" className="rounded-full" onClick={finishWizard}>
      Rond testwizard af
    </Button>
  ) : (
    <Button type="button" className="rounded-full" onClick={wizard.goToNextStep}>
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
      <Card tone="subtle" className="pb-0 shadow-none">
        <CardHeader className="pb-0">
          <CardTitle className="font-[family-name:var(--font-display)] text-2xl">
            {wizard.currentStep.title}
          </CardTitle>
        </CardHeader>
        <CardContent className="pb-6">
          <CardDescription className="text-sm leading-7 text-muted-foreground">
            {testStepDescriptions[wizard.currentStep.id]}
          </CardDescription>
        </CardContent>
      </Card>
    </WizardShell>
  );
}
