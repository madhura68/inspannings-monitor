"use client";

import { useActionState, useState } from "react";
import { saveMorningCheckInAction } from "@/app/check-in/actions";
import { Button, buttonVariants } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { Separator } from "@/components/ui/separator";
import {
  deriveBudgetSnapshot,
  formatEnergyLevelLabel,
} from "@/lib/check-in/budget";
import { ENERGY_SCORE_VALUES, SLEEP_QUALITY_OPTIONS } from "@/lib/check-in/options";
import type {
  MorningCheckInRecord,
  SleepQuality,
} from "@/lib/check-in/types";
import { cn } from "@/lib/utils";

type CheckInFormProps = {
  todayCheckIn: MorningCheckInRecord | null;
};

function getEnergyScorePrompt(score: number | null) {
  if (score === null) {
    return "Kies hoe je energiestart vandaag voelt op een schaal van 1 tot 10.";
  }

  if (score <= 3) {
    return "Rustig aan is vandaag waarschijnlijk extra belangrijk.";
  }

  if (score <= 7) {
    return "Je start voelt gematigd; plan bewust en houd ruimte over.";
  }

  return "Je start voelt relatief sterk; hou nog steeds een rustige marge aan.";
}

export function CheckInForm({ todayCheckIn }: CheckInFormProps) {
  const [, formAction, isPending] = useActionState(saveMorningCheckInAction, null);
  const [energyScore, setEnergyScore] = useState<number | null>(
    todayCheckIn?.energyScore ?? null,
  );
  const [sleepQuality, setSleepQuality] = useState<SleepQuality | null>(
    todayCheckIn?.sleepQuality ?? null,
  );
  const predictedBudget = energyScore === null ? null : deriveBudgetSnapshot(energyScore);

  return (
    <form action={formAction} className="space-y-6" aria-busy={isPending}>
      <input type="hidden" name="energyScore" value={energyScore ?? ""} />
      <input type="hidden" name="sleepQuality" value={sleepQuality ?? ""} />

      <Card elevation="raised" className="pb-0">
        <CardHeader className="pb-0">
          <p className="text-xs font-semibold uppercase tracking-[0.24em] text-muted-foreground">
            Ochtendcheck-in
          </p>
          <CardTitle className="font-[family-name:var(--font-display)] text-3xl text-foreground">
            Hoe start je vandaag?
          </CardTitle>
          <CardDescription className="max-w-2xl text-sm leading-7 text-muted-foreground">
            Houd deze check-in klein. Je legt alleen vast hoe je energie en slaap
            vandaag voelen, zodat de volgende stories daarop kunnen voortbouwen.
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-6 pb-6">
          <div className="space-y-3">
            <div className="space-y-1">
              <Label id="energy-score-group-label" className="text-sm font-semibold text-foreground">
                Energiescore vandaag
              </Label>
              <p className="text-sm leading-7 text-muted-foreground" aria-live="polite">
                {getEnergyScorePrompt(energyScore)}
              </p>
              {predictedBudget ? (
                <p className="text-sm leading-7 text-foreground/80" aria-live="polite">
                  Voor vandaag geeft dit niveau <strong>{formatEnergyLevelLabel(predictedBudget.energyLevel).toLowerCase()}</strong> en een startbudget van{" "}
                  <strong>{predictedBudget.dailyBudget} punten</strong>.
                </p>
              ) : null}
            </div>

            <div
              className="grid grid-cols-5 gap-2 sm:grid-cols-10"
              role="group"
              aria-labelledby="energy-score-group-label"
            >
              {ENERGY_SCORE_VALUES.map((value) => {
                const isSelected = energyScore === value;

                return (
                  <button
                    key={value}
                    type="button"
                    disabled={isPending}
                    onClick={() => setEnergyScore(value)}
                    aria-pressed={isSelected}
                    aria-label={`Energie ${value} van 10`}
                    className={cn(
                      buttonVariants({
                        variant: isSelected ? "default" : "outline",
                        size: "lg",
                      }),
                      "h-12 rounded-[1rem] px-0",
                    )}
                  >
                    {value}
                  </button>
                );
              })}
            </div>
          </div>

          <Separator />

          <div className="space-y-3">
            <div className="space-y-1">
              <Label id="sleep-quality-group-label" className="text-sm font-semibold text-foreground">
                Hoe voelde je slaap?
              </Label>
              <p className="text-sm leading-7 text-muted-foreground">
                Eén globale indruk is genoeg voor deze eerste release.
              </p>
            </div>

            <div
              className="grid gap-3 sm:grid-cols-3"
              role="group"
              aria-labelledby="sleep-quality-group-label"
            >
              {SLEEP_QUALITY_OPTIONS.map((option) => {
                const isSelected = sleepQuality === option.value;

                return (
                  <button
                    key={option.value}
                    type="button"
                    disabled={isPending}
                    onClick={() => setSleepQuality(option.value)}
                    aria-pressed={isSelected}
                    className={cn(
                      "rounded-[1.25rem] border px-4 py-4 text-left transition",
                      isSelected
                        ? "border-primary bg-primary !text-white shadow-[var(--shadow-2)]"
                        : "border-border/60 bg-background/80 text-foreground hover:border-primary/35",
                      isPending && "pointer-events-none opacity-70",
                    )}
                  >
                    <span className="block text-sm font-semibold">{option.label}</span>
                    <span
                      className={cn(
                        "mt-2 block text-sm leading-6",
                        isSelected ? "!text-white/85" : "text-muted-foreground",
                      )}
                    >
                      {option.description}
                    </span>
                  </button>
                );
              })}
            </div>
          </div>
        </CardContent>
      </Card>

      <div className="flex flex-wrap items-center justify-between gap-3">
        <p className="text-sm leading-7 text-muted-foreground" aria-live="polite">
          {isPending
            ? "Je ochtendcheck-in wordt opgeslagen..."
            : todayCheckIn
              ? "Je kunt de check-in van vandaag nog aanpassen. Budget en niveau worden dan opnieuw afgeleid."
              : "Je vult voor vandaag één check-in in, die je later nog kunt aanpassen."}
        </p>

        <Button
          type="submit"
          size="lg"
          disabled={isPending || energyScore === null || sleepQuality === null}
          className="h-11 rounded-full px-5"
        >
          {isPending
            ? "Check-in opslaan..."
            : todayCheckIn
              ? "Werk check-in bij"
              : "Sla check-in op"}
        </Button>
      </div>
    </form>
  );
}
