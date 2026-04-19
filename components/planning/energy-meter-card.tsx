import {
  Alert,
  AlertDescription,
  AlertTitle,
} from "@/components/ui/alert";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import type { PlanningMeterSnapshot } from "@/lib/planning/meter";
import { cn } from "@/lib/utils";

type EnergyMeterCardProps = {
  meter: PlanningMeterSnapshot;
  tone?: "default" | "subtle";
};

function formatRemainingLabel(remainingBudget: number) {
  if (remainingBudget > 0) {
    return `${remainingBudget} punten over`;
  }

  if (remainingBudget === 0) {
    return "Geen punten over";
  }

  return `${Math.abs(remainingBudget)} punten erboven`;
}

function getMeterDescription(meter: PlanningMeterSnapshot) {
  if (meter.dailyBudget === null) {
    return "Er is nog geen dagbudget beschikbaar. De meter wordt actief zodra je ochtendcheck-in van vandaag er staat.";
  }

  if (meter.isOverBudget) {
    return "Je planning zit boven je dagbudget. Dat is een signaal om eventueel iets te verschuiven of lichter te maken, niet om te blokkeren.";
  }

  return "De meter blijft bewust eenvoudig: punten volgen uit duur en impact van je activiteiten.";
}

export function EnergyMeterCard({
  meter,
  tone = "default",
}: EnergyMeterCardProps) {
  return (
    <Card
      className={cn(
        "rounded-[1.75rem] border border-border/60 py-0 shadow-[0_12px_40px_rgba(71,85,105,0.08)]",
        tone === "default" ? "bg-card/90" : "bg-white/70",
      )}
    >
      <CardHeader className="pb-0">
        <p className="text-xs font-semibold uppercase tracking-[0.24em] text-muted-foreground">
          EnergyMeter
        </p>
        <CardTitle className="text-lg text-slate-900">
          {meter.dailyBudget === null
            ? `${meter.plannedPoints} geplande punten`
            : `${meter.plannedPoints} van ${meter.dailyBudget} punten gepland`}
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4 pb-6">
        <CardDescription className="text-sm leading-7 text-muted-foreground">
          {getMeterDescription(meter)}
        </CardDescription>

        <div className="space-y-2">
          <div className="h-3 overflow-hidden rounded-full bg-secondary">
            <div
              className={cn(
                "h-full rounded-full transition-[width]",
                meter.isOverBudget ? "bg-amber-500" : "bg-primary",
              )}
              style={{ width: `${meter.progressPercent ?? 0}%` }}
            />
          </div>

          <div className="flex flex-wrap items-center justify-between gap-3 text-sm leading-7 text-slate-700">
            <p>
              <strong>Activiteiten:</strong> {meter.activityCount}
            </p>
            {meter.dailyBudget !== null ? (
              <p>
                <strong>Resterend:</strong> {formatRemainingLabel(meter.remainingBudget ?? 0)}
              </p>
            ) : null}
          </div>
        </div>

        {meter.dailyBudget !== null && meter.isOverBudget ? (
          <Alert className="rounded-[1.25rem] border-amber-300 bg-amber-50 text-amber-950 [&_svg]:text-amber-700">
            <AlertTitle className="text-sm">Je zit boven je dagbudget</AlertTitle>
            <AlertDescription className="leading-7 text-amber-900">
              Je planning komt nu <strong>{Math.abs(meter.remainingBudget ?? 0)} punten</strong> boven het dagbudget uit.
              Je kunt nog steeds doorgaan, maar dit is een goed moment om iets te schrappen, te verkorten of later te doen.
            </AlertDescription>
          </Alert>
        ) : null}
      </CardContent>
    </Card>
  );
}
