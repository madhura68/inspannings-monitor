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
    return "Je dagtotaal zit boven je dagbudget. Dat is een signaal om eventueel iets te verschuiven of lichter te maken, niet om te blokkeren.";
  }

  return "De meter blijft bewust eenvoudig: punten volgen uit duur en impact van alle activiteiten die vandaag in beeld zijn.";
}

export function EnergyMeterCard({
  meter,
  tone = "default",
}: EnergyMeterCardProps) {
  const progressValue =
    meter.dailyBudget === null ? null : Math.min(100, Math.max(0, meter.progressPercent ?? 0));

  return (
    <Card tone={tone === "default" ? "default" : "subtle"} className="pb-0">
      <CardHeader className="pb-0">
        <p className="text-xs font-semibold uppercase tracking-[0.24em] text-muted-foreground">
          EnergyMeter
        </p>
        <CardTitle className="text-lg text-foreground">
          {meter.dailyBudget === null
            ? `${meter.totalPoints} punten in beeld`
            : `${meter.totalPoints} van ${meter.dailyBudget} punten in beeld`}
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4 pb-6">
        <CardDescription className="text-sm leading-7 text-muted-foreground">
          {getMeterDescription(meter)}
        </CardDescription>

        <div className="space-y-2">
          <div
            className="h-3 overflow-hidden rounded-full bg-secondary"
            role={progressValue === null ? undefined : "progressbar"}
            aria-label="Voortgang van je dagbudget"
            aria-valuemin={progressValue === null ? undefined : 0}
            aria-valuemax={progressValue === null ? undefined : 100}
            aria-valuenow={progressValue === null ? undefined : progressValue}
            aria-valuetext={
              meter.dailyBudget === null
                ? "Nog geen dagbudget beschikbaar"
                : `${meter.totalPoints} van ${meter.dailyBudget} punten in beeld`
            }
          >
            <div
              className={cn(
                "h-full rounded-full transition-[width]",
                meter.isOverBudget ? "bg-warning" : "bg-primary",
              )}
              style={{ width: `${meter.progressPercent ?? 0}%` }}
            />
          </div>

          <div
            className="flex flex-wrap items-center justify-between gap-3 text-sm leading-7 text-muted-foreground"
            aria-live="polite"
          >
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
            <Alert variant="warning">
              <AlertTitle className="text-sm">Je zit boven je dagbudget</AlertTitle>
              <AlertDescription className="leading-7 text-current">
              Je dagtotaal komt nu <strong>{Math.abs(meter.remainingBudget ?? 0)} punten</strong> boven het dagbudget uit.
              Je kunt nog steeds doorgaan, maar dit is een goed moment om iets te schrappen, te verkorten of later te doen.
            </AlertDescription>
          </Alert>
        ) : null}
      </CardContent>
    </Card>
  );
}
