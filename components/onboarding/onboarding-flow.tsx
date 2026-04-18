"use client";

import type { MouseEvent } from "react";
import { useState } from "react";
import { completeOnboardingAction, skipOnboardingAction } from "@/app/onboarding/actions";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Separator } from "@/components/ui/separator";
import { Switch } from "@/components/ui/switch";
import { ONBOARDING_TIMEZONE_OPTIONS } from "@/lib/onboarding/options";
import type { ProfileBundle } from "@/lib/profile/types";

type OnboardingFlowProps = {
  profileBundle: ProfileBundle;
};

const steps = [
  {
    eyebrow: "Stap 1",
    title: "Zo gebruiken we Inspannings Monitor",
    description:
      "De app helpt je om je dag rustiger te plannen en terug te kijken zonder medische claims of zorgverlenerfuncties.",
  },
  {
    eyebrow: "Stap 2",
    title: "Basisprofiel",
    description:
      "Kies hoe de app je mag aanspreken en welke timezone het best bij je dagindeling past.",
  },
  {
    eyebrow: "Stap 3",
    title: "Startvoorkeuren",
    description:
      "Kies rustig hoe zichtbaar je energiebudget is en of je lichte reminders wilt ontvangen.",
  },
] as const;

export function OnboardingFlow({ profileBundle }: OnboardingFlowProps) {
  const [currentStep, setCurrentStep] = useState(0);
  const [displayName, setDisplayName] = useState(profileBundle.profile.displayName ?? "");
  const [timezone, setTimezone] = useState(profileBundle.profile.timezone);
  const [showEnergyPoints, setShowEnergyPoints] = useState(
    profileBundle.settings.showEnergyPoints,
  );
  const [morningReminderEnabled, setMorningReminderEnabled] = useState(
    profileBundle.settings.morningReminderEnabled,
  );
  const [morningReminderTime, setMorningReminderTime] = useState(
    profileBundle.settings.morningReminderTime ?? "08:30",
  );
  const [reflectionReminderEnabled, setReflectionReminderEnabled] = useState(
    profileBundle.settings.reflectionReminderEnabled,
  );

  const step = steps[currentStep];
  const isFirstStep = currentStep === 0;
  const isLastStep = currentStep === steps.length - 1;

  function goToPreviousStep() {
    setCurrentStep((stepIndex) => Math.max(0, stepIndex - 1));
  }

  function goToNextStep(event: MouseEvent<HTMLButtonElement>) {
    event.preventDefault();
    setCurrentStep((stepIndex) => Math.min(steps.length - 1, stepIndex + 1));
  }

  return (
    <div className="grid gap-6 lg:grid-cols-[0.9fr_1.1fr]">
      <section className="rounded-[2rem] border border-primary/15 bg-primary p-7 text-primary-foreground shadow-[0_18px_60px_rgba(22,58,43,0.18)] sm:p-9">
        <p className="text-xs font-semibold uppercase tracking-[0.24em] text-primary-foreground/70">
          {step.eyebrow}
        </p>
        <h1 className="mt-4 font-[family-name:var(--font-display)] text-4xl leading-tight sm:text-5xl">
          {step.title}
        </h1>
        <p className="mt-5 max-w-xl text-base leading-8 text-primary-foreground/85">
          {step.description}
        </p>

        <Alert className="mt-10 rounded-[1.5rem] border-white/10 bg-white/8 text-primary-foreground [&_svg]:text-primary-foreground/80">
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

        <ol className="mt-8 flex gap-3">
          {steps.map((item, index) => (
            <li
              key={item.title}
              className={`h-2 flex-1 rounded-full ${
                index <= currentStep ? "bg-primary-foreground/85" : "bg-white/15"
              }`}
            />
          ))}
        </ol>
      </section>

      <section className="rounded-[2rem] border border-border/60 bg-card/90 p-6 shadow-[0_18px_60px_rgba(71,85,105,0.12)] backdrop-blur sm:p-8">
        <div className="mb-6 flex items-center justify-between gap-3">
          <p className="text-xs font-semibold uppercase tracking-[0.24em] text-muted-foreground">
            Korte onboarding
          </p>
          <form action={skipOnboardingAction}>
            <Button type="submit" variant="outline" className="rounded-full">
              Nu overslaan
            </Button>
          </form>
        </div>

        <form action={completeOnboardingAction} className="space-y-6">
          <input type="hidden" name="displayName" value={displayName} />
          <input type="hidden" name="timezone" value={timezone} />
          <input
            type="hidden"
            name="showEnergyPoints"
            value={showEnergyPoints ? "true" : "false"}
          />
          <input
            type="hidden"
            name="morningReminderEnabled"
            value={morningReminderEnabled ? "true" : "false"}
          />
          <input type="hidden" name="morningReminderTime" value={morningReminderTime} />
          <input
            type="hidden"
            name="reflectionReminderEnabled"
            value={reflectionReminderEnabled ? "true" : "false"}
          />

          {currentStep === 0 ? (
            <div className="space-y-4">
              <Card className="rounded-[1.5rem] border border-border/60 bg-background/80 py-0">
                <CardHeader className="pb-0">
                  <CardTitle className="font-[family-name:var(--font-display)] text-2xl">
                    Wat je hier wél krijgt
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <CardDescription className="text-sm leading-7 text-muted-foreground">
                    Een rustige plan-doe-evalueer flow met energiebudgetten, zonder
                    druk, score-oordeel of medische terminologie.
                  </CardDescription>
                </CardContent>
              </Card>

              <Card className="rounded-[1.5rem] border border-border/60 bg-background/80 py-0">
                <CardHeader className="pb-0">
                  <CardTitle className="font-[family-name:var(--font-display)] text-2xl">
                    Wat deze app niet doet
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <CardDescription className="text-sm leading-7 text-muted-foreground">
                    Geen diagnose, geen behandeling, geen medische triage en geen
                    automatisch delen met derden.
                  </CardDescription>
                </CardContent>
              </Card>
            </div>
          ) : null}

          {currentStep === 1 ? (
            <div className="space-y-5">
              <div className="space-y-2">
                <Label htmlFor="display-name" className="text-slate-800">
                  Schermnaam
                </Label>
                <Input
                  id="display-name"
                  className="h-12 rounded-[1.25rem] bg-background/80 px-4 text-base md:text-base"
                  type="text"
                  value={displayName}
                  onChange={(event) => setDisplayName(event.target.value)}
                  placeholder="Optioneel, bijvoorbeeld Jan"
                  maxLength={40}
                />
              </div>

              <Alert className="rounded-[1.5rem] border-sky-200 bg-sky-50 text-sky-950 [&_svg]:text-sky-700">
                <AlertDescription className="leading-7 text-current">
                  Voertaal voor release 1 staat vast op <strong>Nederlands</strong>.
                </AlertDescription>
              </Alert>

              <div className="space-y-2">
                <Label className="text-slate-800">Timezone</Label>
                <Select
                  value={timezone}
                  onValueChange={(value) =>
                    setTimezone(value ?? profileBundle.profile.timezone)
                  }
                >
                  <SelectTrigger className="h-12 w-full rounded-[1.25rem] bg-background/80 px-4 text-base">
                    <SelectValue placeholder="Kies een timezone" />
                  </SelectTrigger>
                  <SelectContent>
                    {ONBOARDING_TIMEZONE_OPTIONS.map((option) => (
                      <SelectItem key={option.value} value={option.value}>
                        {option.label}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            </div>
          ) : null}

          {currentStep === 2 ? (
            <div className="space-y-4">
              <Card className="rounded-[1.5rem] border border-border/60 bg-background/80 py-0">
                <CardContent className="flex items-start justify-between gap-4 py-5">
                  <div className="space-y-1">
                    <Label className="text-sm font-semibold text-slate-900">
                      Toon energiebudgetpunten
                    </Label>
                    <p className="text-sm leading-7 text-muted-foreground">
                      Laat geplande en resterende punten zichtbaar zien in de interface.
                    </p>
                  </div>
                  <Switch checked={showEnergyPoints} onCheckedChange={setShowEnergyPoints} />
                </CardContent>
              </Card>

              <Card className="rounded-[1.5rem] border border-border/60 bg-background/80 py-0">
                <CardContent className="space-y-4 py-5">
                  <div className="flex items-start justify-between gap-4">
                    <div className="space-y-1">
                      <Label className="text-sm font-semibold text-slate-900">
                        Zet een lichte ochtendreminder aan
                      </Label>
                      <p className="text-sm leading-7 text-muted-foreground">
                        Handig als je later een korte check-in wilt doen zonder extra druk.
                      </p>
                    </div>
                    <Switch
                      checked={morningReminderEnabled}
                      onCheckedChange={setMorningReminderEnabled}
                    />
                  </div>

                  {morningReminderEnabled ? (
                    <>
                      <Separator />
                      <div className="space-y-2">
                        <Label htmlFor="morning-reminder-time" className="text-slate-800">
                          Tijdstip voor de ochtendreminder
                        </Label>
                        <Input
                          id="morning-reminder-time"
                          className="h-12 rounded-[1.25rem] bg-white px-4 text-base md:text-base"
                          type="time"
                          value={morningReminderTime}
                          onChange={(event) => setMorningReminderTime(event.target.value)}
                        />
                      </div>
                    </>
                  ) : null}
                </CardContent>
              </Card>

              <Card className="rounded-[1.5rem] border border-border/60 bg-background/80 py-0">
                <CardContent className="flex items-start justify-between gap-4 py-5">
                  <div className="space-y-1">
                    <Label className="text-sm font-semibold text-slate-900">
                      Sta lichte reflectieprompts toe
                    </Label>
                    <p className="text-sm leading-7 text-muted-foreground">
                      Optionele terugblikprompts kunnen later helpen om rustiger patronen te zien.
                    </p>
                  </div>
                  <Switch
                    checked={reflectionReminderEnabled}
                    onCheckedChange={setReflectionReminderEnabled}
                  />
                </CardContent>
              </Card>
            </div>
          ) : null}

          <Separator />

          <div className="flex flex-wrap items-center justify-between gap-3">
            <Button
              type="button"
              variant="outline"
              onClick={goToPreviousStep}
              disabled={isFirstStep}
              className="rounded-full"
            >
              Vorige
            </Button>

            {isLastStep ? (
              <Button
                key="complete-onboarding"
                type="submit"
                className="rounded-full"
              >
                Rond onboarding af
              </Button>
            ) : (
              <Button
                key={`next-step-${currentStep}`}
                type="button"
                onClick={goToNextStep}
                className="rounded-full"
              >
                Ga verder
              </Button>
            )}
          </div>
        </form>
      </section>
    </div>
  );
}
