"use client";

import { useActionState, useMemo, useState } from "react";
import { createAdHocActivityAction } from "@/app/planning/actions";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { ActivitySuggestionList } from "@/components/planning/activity-suggestion-list";
import { Button, buttonVariants } from "@/components/ui/button";
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
import {
  ACTIVITY_DURATION_SUGGESTIONS,
  ACTIVITY_IMPACT_OPTIONS,
} from "@/lib/planning/form-options";
import {
  calculatePlanningMeterSnapshot,
  deriveActivityEnergyPoints,
} from "@/lib/planning/meter";
import type { ActivityCategory, ActivityRecord, ActivitySuggestion } from "@/lib/planning/types";
import { cn } from "@/lib/utils";

type AdHocActivityFormProps = {
  categories: ActivityCategory[];
  activities: ActivityRecord[];
  suggestions: ActivitySuggestion[];
  dailyBudget: number | null;
};

export function AdHocActivityForm({
  categories,
  activities,
  suggestions,
  dailyBudget,
}: AdHocActivityFormProps) {
  const [, formAction, isPending] = useActionState(createAdHocActivityAction, null);
  const [name, setName] = useState("");
  const [categoryId, setCategoryId] = useState<string>(categories[0]?.id ?? "");
  const [durationMinutes, setDurationMinutes] = useState("30");
  const [impactLevel, setImpactLevel] = useState<"laag" | "midden" | "hoog">("midden");

  const selectedCategory = useMemo(
    () => categories.find((category) => category.id === categoryId) ?? null,
    [categories, categoryId],
  );
  const currentMeter = useMemo(
    () => calculatePlanningMeterSnapshot(activities, dailyBudget),
    [activities, dailyBudget],
  );
  const previewPoints = useMemo(() => {
    const parsedDuration = Number.parseInt(durationMinutes, 10);

    if (!Number.isFinite(parsedDuration) || parsedDuration <= 0) {
      return null;
    }

    return deriveActivityEnergyPoints({
      durationMinutes: parsedDuration,
      impactLevel,
      status: "completed",
    });
  }, [durationMinutes, impactLevel]);
  const previewMeter = useMemo(() => {
    if (previewPoints === null) {
      return null;
    }

    return calculatePlanningMeterSnapshot(
      [
        ...activities,
        {
          durationMinutes: Number.parseInt(durationMinutes, 10),
          impactLevel,
          status: "completed",
        } as ActivityRecord,
      ],
      dailyBudget,
    );
  }, [activities, dailyBudget, durationMinutes, impactLevel, previewPoints]);

  function applySuggestion(suggestion: ActivitySuggestion) {
    setName(suggestion.name);
    setCategoryId(suggestion.categoryId);
    setDurationMinutes(String(suggestion.durationMinutes));
    setImpactLevel(suggestion.impactLevel);
  }

  return (
    <form action={formAction} className="space-y-6" aria-busy={isPending}>
      <input type="hidden" name="categoryId" value={categoryId} />
      <input type="hidden" name="impactLevel" value={impactLevel} />

      <Card tone="subtle" className="py-0">
        <CardHeader className="pb-0">
          <p className="text-xs font-semibold uppercase tracking-[0.24em] text-muted-foreground">
            Ongepland
          </p>
          <CardTitle className="text-2xl text-foreground">
            Voeg iets toe dat vandaag spontaan gebeurde
          </CardTitle>
          <CardDescription className="max-w-2xl text-sm leading-7 text-muted-foreground">
            Gebruik dit voor activiteiten die niet vooraf gepland waren, maar wel
            onderdeel zijn geworden van je echte dag. Ze worden opgeslagen als
            <strong> ongepland en uitgevoerd</strong>.
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-6 pb-6">
          <div className="space-y-2">
            <Label htmlFor="ad-hoc-activity-name" className="text-foreground">
              Naam van de ongeplande activiteit
            </Label>
            <Input
              id="ad-hoc-activity-name"
              name="name"
              className="h-12 rounded-[1.25rem] bg-background/80 px-4 text-base"
              disabled={isPending}
              maxLength={120}
              placeholder="Bijvoorbeeld: onverwacht telefoontje of extra boodschap"
              value={name}
              onChange={(event) => setName(event.target.value)}
            />
            <ActivitySuggestionList
              categories={categories}
              suggestions={suggestions}
              query={name}
              disabled={isPending}
              showPriority={false}
              onSelect={applySuggestion}
            />
          </div>

          <div className="grid gap-5 md:grid-cols-2">
            <div className="space-y-2">
              <Label className="text-foreground">Categorie</Label>
              <Select
                disabled={isPending}
                value={categoryId}
                onValueChange={(value) => setCategoryId(value ?? categories[0]?.id ?? "")}
              >
                <SelectTrigger className="h-12 w-full rounded-[1.25rem] bg-background/80 px-4 text-base">
                  <SelectValue placeholder="Kies een categorie" />
                </SelectTrigger>
                <SelectContent>
                  {categories.map((category) => (
                    <SelectItem key={category.id} value={category.id}>
                      {category.labelNl}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
              {selectedCategory ? (
                <p className="text-sm leading-7 text-muted-foreground">
                  Gekozen categorie: <strong>{selectedCategory.labelNl}</strong>.
                </p>
              ) : null}
            </div>

            <div className="space-y-2">
              <Label htmlFor="ad-hoc-duration-minutes" className="text-foreground">
                Geschatte duur in minuten
              </Label>
              <Input
                id="ad-hoc-duration-minutes"
                name="durationMinutes"
                className="h-12 rounded-[1.25rem] bg-background/80 px-4 text-base"
                disabled={isPending}
                inputMode="numeric"
                min={1}
                max={720}
                step={1}
                type="number"
                value={durationMinutes}
                onChange={(event) => setDurationMinutes(event.target.value)}
              />
              <div className="flex flex-wrap gap-2" role="group" aria-label="Snelle duurkeuzes">
                {ACTIVITY_DURATION_SUGGESTIONS.map((value) => (
                  <button
                    key={value}
                    type="button"
                    disabled={isPending}
                    onClick={() => setDurationMinutes(String(value))}
                    aria-pressed={durationMinutes === String(value)}
                    className={cn(
                      buttonVariants({
                        variant: durationMinutes === String(value) ? "default" : "outline",
                        size: "sm",
                      }),
                      "rounded-full px-3",
                    )}
                  >
                    {value} min
                  </button>
                ))}
              </div>
            </div>
          </div>

          <div className="space-y-3">
            <div className="space-y-1">
              <Label id="ad-hoc-impact-group-label" className="text-sm font-semibold text-foreground">
                Ervaren impact
              </Label>
              <p className="text-sm leading-7 text-muted-foreground">
                Kies hoe belastend deze onverwachte activiteit achteraf aanvoelde.
              </p>
            </div>
            <div className="grid gap-3" role="group" aria-labelledby="ad-hoc-impact-group-label">
              {ACTIVITY_IMPACT_OPTIONS.map((option) => {
                const isSelected = impactLevel === option.value;

                return (
                  <button
                    key={option.value}
                    type="button"
                    disabled={isPending}
                    onClick={() => setImpactLevel(option.value)}
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

          <Card tone="subtle" className="py-0 shadow-none">
            <CardContent className="space-y-2 py-5">
              <p className="text-sm font-semibold text-foreground">Effect op je dagtotaal</p>
              <p className="text-sm leading-7 text-muted-foreground" aria-live="polite">
                {previewPoints === null
                  ? "Kies een geldige duur en impact om te zien hoeveel punten deze ongeplande activiteit ongeveer toevoegt."
                  : `Deze activiteit telt voorlopig voor ${previewPoints} punten. Je dagtotaal zou dan uitkomen op ${previewMeter?.totalPoints ?? currentMeter.totalPoints} punten.`}
              </p>
              {dailyBudget !== null && previewMeter ? (
                <p className="text-sm leading-7 text-foreground/80" aria-live="polite">
                  Dat is {previewMeter.dailyBudget} punten budget, met daarna nog{" "}
                  <strong>{previewMeter.remainingBudget} punten ruimte</strong>.
                </p>
              ) : null}
              {previewMeter?.isOverBudget ? (
                <Alert variant="warning">
                  <AlertTitle className="text-sm">Niet-blokkerende waarschuwing</AlertTitle>
                  <AlertDescription className="leading-7 text-current">
                    Met deze ongeplande activiteit kom je ongeveer{" "}
                    <strong>{Math.abs(previewMeter.remainingBudget ?? 0)} punten</strong> boven je dagbudget uit.
                    Je kunt nog steeds opslaan, maar dit helpt je later beter begrijpen waarom je dag zwaarder uitviel.
                  </AlertDescription>
                </Alert>
              ) : null}
            </CardContent>
          </Card>
        </CardContent>
      </Card>

      <div className="flex flex-wrap items-center justify-between gap-3">
        <p className="text-sm leading-7 text-muted-foreground" aria-live="polite">
          {isPending
            ? "Je ongeplande activiteit wordt opgeslagen..."
            : "Deze activiteit wordt vandaag toegevoegd met bron `ongepland` en status `uitgevoerd`."}
        </p>

        <Button
          type="submit"
          size="lg"
          disabled={isPending || !name.trim() || !categoryId || !durationMinutes.trim()}
          className="h-11 rounded-full px-5"
        >
          {isPending ? "Ongeplande activiteit opslaan..." : "Voeg ongeplande activiteit toe"}
        </Button>
      </div>
    </form>
  );
}
