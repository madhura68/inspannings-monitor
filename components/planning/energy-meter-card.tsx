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
          {meter.dailyBudget === null
            ? "Er is nog geen dagbudget beschikbaar. De meter wordt actief zodra je ochtendcheck-in van vandaag er staat."
            : "De meter blijft bewust eenvoudig: punten volgen uit duur en impact van je activiteiten."}
        </CardDescription>

        <div className="space-y-2">
          <div className="h-3 overflow-hidden rounded-full bg-secondary">
            <div
              className="h-full rounded-full bg-primary transition-[width]"
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
      </CardContent>
    </Card>
  );
}
