"use client";

import { useActionState, useMemo, useState } from "react";
import { createActivityAction } from "@/app/planning/actions";
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
import { Separator } from "@/components/ui/separator";
import {
  ACTIVITY_DURATION_SUGGESTIONS,
  ACTIVITY_IMPACT_OPTIONS,
  ACTIVITY_PRIORITY_OPTIONS,
} from "@/lib/planning/form-options";
import { calculatePlanningMeterSnapshot, deriveActivityEnergyPoints } from "@/lib/planning/meter";
import type { ActivityCategory, ActivityRecord } from "@/lib/planning/types";
import { cn } from "@/lib/utils";

type ActivityFormProps = {
  categories: ActivityCategory[];
  activities: ActivityRecord[];
  dailyBudget: number | null;
};

export function ActivityForm({ categories, activities, dailyBudget }: ActivityFormProps) {
  const [, formAction, isPending] = useActionState(createActivityAction, null);
  const [name, setName] = useState("");
  const [categoryId, setCategoryId] = useState<string>(categories[0]?.id ?? "");
  const [durationMinutes, setDurationMinutes] = useState("30");
  const [impactLevel, setImpactLevel] = useState<"laag" | "midden" | "hoog">("midden");
  const [priorityLevel, setPriorityLevel] = useState<"laag" | "normaal" | "hoog">("normaal");

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
      status: "planned",
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
          status: "planned",
        } as ActivityRecord,
      ],
      dailyBudget,
    );
  }, [activities, dailyBudget, durationMinutes, impactLevel, previewPoints]);

  return (
    <form action={formAction} className="space-y-6" aria-busy={isPending}>
      <input type="hidden" name="categoryId" value={categoryId} />
      <input type="hidden" name="impactLevel" value={impactLevel} />
      <input type="hidden" name="priorityLevel" value={priorityLevel} />

      <Card className="rounded-[1.75rem] border border-border/60 bg-card/90 py-0 shadow-[0_18px_60px_rgba(71,85,105,0.1)]">
        <CardHeader className="pb-0">
          <p className="text-xs font-semibold uppercase tracking-[0.24em] text-muted-foreground">
            Dagplanning
          </p>
          <CardTitle className="font-[family-name:var(--font-display)] text-3xl text-slate-900">
            Plan een activiteit voor vandaag
          </CardTitle>
          <CardDescription className="max-w-2xl text-sm leading-7 text-muted-foreground">
            Houd het klein en concreet. Je legt alleen de basis vast: wat je wilt doen,
            hoe lang het ongeveer duurt en hoe zwaar het aanvoelt.
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-6 pb-6">
          <div className="space-y-2">
            <Label htmlFor="activity-name" className="text-slate-800">
              Naam van de activiteit
            </Label>
            <Input
              id="activity-name"
              name="name"
              className="h-12 rounded-[1.25rem] bg-background/80 px-4 text-base"
              disabled={isPending}
              maxLength={120}
              placeholder="Bijvoorbeeld: was opvouwen"
              value={name}
              onChange={(event) => setName(event.target.value)}
            />
          </div>

          <div className="grid gap-5 md:grid-cols-2">
            <div className="space-y-2">
              <Label className="text-slate-800">Categorie</Label>
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
              <Label htmlFor="duration-minutes" className="text-slate-800">
                Geschatte duur in minuten
              </Label>
              <Input
                id="duration-minutes"
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
              <div className="flex flex-wrap gap-2">
                {ACTIVITY_DURATION_SUGGESTIONS.map((value) => (
                  <button
                    key={value}
                    type="button"
                    disabled={isPending}
                    onClick={() => setDurationMinutes(String(value))}
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

          <Separator />

          <Card className="rounded-[1.5rem] border border-border/60 bg-background/80 py-0 shadow-none">
            <CardContent className="space-y-2 py-5">
              <p className="text-sm font-semibold text-slate-900">Vooruitblik op de meter</p>
              <p className="text-sm leading-7 text-muted-foreground">
                {previewPoints === null
                  ? "Kies een geldige duur en impact om te zien hoeveel punten deze activiteit ongeveer toevoegt."
                  : `Deze activiteit telt voorlopig voor ${previewPoints} punten. Je totaal zou dan uitkomen op ${previewMeter?.plannedPoints ?? currentMeter.plannedPoints} geplande punten.`}
              </p>
              {dailyBudget !== null && previewMeter ? (
                <p className="text-sm leading-7 text-slate-700">
                  Dat is {previewMeter.dailyBudget} punten budget, met daarna nog{" "}
                  <strong>{previewMeter.remainingBudget} punten ruimte</strong>.
                </p>
              ) : null}
            </CardContent>
          </Card>

          <div className="grid gap-5 md:grid-cols-2">
            <div className="space-y-3">
              <div className="space-y-1">
                <Label className="text-sm font-semibold text-slate-900">
                  Verwachte impact
                </Label>
                <p className="text-sm leading-7 text-muted-foreground">
                  Kies hoe belastend deze activiteit voor jou aanvoelt.
                </p>
              </div>
              <div className="grid gap-3">
                {ACTIVITY_IMPACT_OPTIONS.map((option) => {
                  const isSelected = impactLevel === option.value;

                  return (
                    <button
                      key={option.value}
                      type="button"
                      disabled={isPending}
                      onClick={() => setImpactLevel(option.value)}
                      className={cn(
                        "rounded-[1.25rem] border px-4 py-4 text-left transition",
                        isSelected
                          ? "border-primary bg-primary text-primary-foreground shadow-[0_12px_30px_rgba(22,58,43,0.18)]"
                          : "border-border/60 bg-background/80 text-slate-900 hover:border-primary/35",
                        isPending && "pointer-events-none opacity-70",
                      )}
                    >
                      <span className="block text-sm font-semibold">{option.label}</span>
                      <span
                        className={cn(
                          "mt-2 block text-sm leading-6",
                          isSelected
                            ? "text-primary-foreground/85"
                            : "text-muted-foreground",
                        )}
                      >
                        {option.description}
                      </span>
                    </button>
                  );
                })}
              </div>
            </div>

            <div className="space-y-3">
              <div className="space-y-1">
                <Label className="text-sm font-semibold text-slate-900">
                  Prioriteit voor vandaag
                </Label>
                <p className="text-sm leading-7 text-muted-foreground">
                  Dit helpt straks om bewust te herschikken zonder alles te verliezen.
                </p>
              </div>
              <div className="grid gap-3">
                {ACTIVITY_PRIORITY_OPTIONS.map((option) => {
                  const isSelected = priorityLevel === option.value;

                  return (
                    <button
                      key={option.value}
                      type="button"
                      disabled={isPending}
                      onClick={() => setPriorityLevel(option.value)}
                      className={cn(
                        "rounded-[1.25rem] border px-4 py-4 text-left transition",
                        isSelected
                          ? "border-primary bg-primary text-primary-foreground shadow-[0_12px_30px_rgba(22,58,43,0.18)]"
                          : "border-border/60 bg-background/80 text-slate-900 hover:border-primary/35",
                        isPending && "pointer-events-none opacity-70",
                      )}
                    >
                      <span className="block text-sm font-semibold">{option.label}</span>
                      <span
                        className={cn(
                          "mt-2 block text-sm leading-6",
                          isSelected
                            ? "text-primary-foreground/85"
                            : "text-muted-foreground",
                        )}
                      >
                        {option.description}
                      </span>
                    </button>
                  );
                })}
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      <div className="flex flex-wrap items-center justify-between gap-3">
        <p className="text-sm leading-7 text-muted-foreground">
          {isPending
            ? "Je activiteit wordt opgeslagen..."
            : "Je activiteit wordt vandaag toegevoegd met status `gepland`, waarna de meter direct opnieuw wordt berekend."}
        </p>

        <Button
          type="submit"
          size="lg"
          disabled={
            isPending ||
            !name.trim() ||
            !categoryId ||
            !durationMinutes.trim()
          }
          className="h-11 rounded-full px-5"
        >
          {isPending ? "Activiteit opslaan..." : "Plan activiteit"}
        </Button>
      </div>
    </form>
  );
}
