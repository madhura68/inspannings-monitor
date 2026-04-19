import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import type { DayOverviewSnapshot } from "@/lib/planning/day-overview";
import { cn } from "@/lib/utils";

type DayOverviewCardProps = {
  overview: DayOverviewSnapshot;
};

function getDifferenceCopy(overview: DayOverviewSnapshot) {
  if (overview.totalActivities === 0) {
    return "Je dagoverzicht vult zich zodra je activiteiten toevoegt en evalueert.";
  }

  if (overview.executedActivityCount === 0) {
    return "Er is nog niets als uitgevoerd of aangepast gemarkeerd. Je oorspronkelijke plan staat wel al klaar.";
  }

  if (overview.pointDifference > 0) {
    return `Je werkelijke dag kwam ${overview.pointDifference} punten boven je oorspronkelijke plan uit.`;
  }

  if (overview.pointDifference < 0) {
    return `Je werkelijke dag bleef ${Math.abs(overview.pointDifference)} punten onder je oorspronkelijke plan.`;
  }

  return "Je werkelijke dag lag qua punten precies in lijn met je oorspronkelijke plan.";
}

function getStatusAccentClassName(key: "planned" | "completed" | "adjusted" | "skipped") {
  if (key === "completed") {
    return "bg-success text-white";
  }

  if (key === "adjusted") {
    return "bg-primary text-white";
  }

  if (key === "skipped") {
    return "bg-warning text-foreground";
  }

  return "bg-secondary text-secondary-foreground";
}

export function DayOverviewCard({ overview }: DayOverviewCardProps) {
  return (
    <Card className="py-0">
      <CardHeader className="pb-0">
        <p className="text-xs font-semibold uppercase tracking-[0.24em] text-muted-foreground">
          Dagoverzicht
        </p>
        <CardTitle className="text-lg text-foreground">Gepland versus werkelijk</CardTitle>
        <CardDescription className="max-w-3xl text-sm leading-7 text-muted-foreground">
          Dit overzicht laat zien wat je vooraf van plan was, wat er echt gebeurde en hoe de statussen van vandaag verdeeld zijn.
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-5 pb-6">
        <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-4">
          <Card tone="subtle" size="sm" className="py-0">
            <CardContent className="space-y-1 py-4">
              <p className="text-xs font-semibold uppercase tracking-[0.18em] text-muted-foreground">
                Vooraf gepland
              </p>
              <p className="text-2xl font-semibold tracking-[-0.03em] text-foreground">
                {overview.plannedActivityCount}
              </p>
              <p className="text-sm leading-7 text-muted-foreground">
                {overview.plannedPoints} punten oorspronkelijk in plan
              </p>
            </CardContent>
          </Card>

          <Card tone="subtle" size="sm" className="py-0">
            <CardContent className="space-y-1 py-4">
              <p className="text-xs font-semibold uppercase tracking-[0.18em] text-muted-foreground">
                Werkelijk gedaan
              </p>
              <p className="text-2xl font-semibold tracking-[-0.03em] text-foreground">
                {overview.executedActivityCount}
              </p>
              <p className="text-sm leading-7 text-muted-foreground">
                {overview.actualPoints} punten uitgevoerd of aangepast
              </p>
            </CardContent>
          </Card>

          <Card tone="subtle" size="sm" className="py-0">
            <CardContent className="space-y-1 py-4">
              <p className="text-xs font-semibold uppercase tracking-[0.18em] text-muted-foreground">
                Ongepland erbij
              </p>
              <p className="text-2xl font-semibold tracking-[-0.03em] text-foreground">
                {overview.adHocActivityCount}
              </p>
              <p className="text-sm leading-7 text-muted-foreground">
                Activiteiten die onderweg aan je dag zijn toegevoegd
              </p>
            </CardContent>
          </Card>

          <Card tone="subtle" size="sm" className="py-0">
            <CardContent className="space-y-1 py-4">
              <p className="text-xs font-semibold uppercase tracking-[0.18em] text-muted-foreground">
                Nog open
              </p>
              <p className="text-2xl font-semibold tracking-[-0.03em] text-foreground">
                {overview.openActivityCount}
              </p>
              <p className="text-sm leading-7 text-muted-foreground">
                Activiteiten die nog op `gepland` staan
              </p>
            </CardContent>
          </Card>
        </div>

        <div className="rounded-[var(--radius-xl)] border border-border/65 bg-background/72 p-4">
          <div className="flex flex-wrap items-center gap-2">
            {[
              {
                key: "planned" as const,
                label: "Gepland",
                value: overview.openActivityCount,
              },
              {
                key: "completed" as const,
                label: "Uitgevoerd",
                value: overview.completedActivityCount,
              },
              {
                key: "adjusted" as const,
                label: "Aangepast",
                value: overview.adjustedActivityCount,
              },
              {
                key: "skipped" as const,
                label: "Overgeslagen",
                value: overview.skippedActivityCount,
              },
            ].map((item) => (
              <span
                key={item.key}
                className={cn(
                  "inline-flex items-center gap-2 rounded-full px-3 py-1 text-xs font-semibold uppercase tracking-[0.16em]",
                  getStatusAccentClassName(item.key),
                )}
              >
                {item.label}
                <span className="rounded-full bg-black/12 px-1.5 py-0.5 text-[0.7rem] font-semibold text-current">
                  {item.value}
                </span>
              </span>
            ))}
          </div>
          <p className="mt-3 text-sm leading-7 text-muted-foreground">
            {getDifferenceCopy(overview)}
          </p>
        </div>
      </CardContent>
    </Card>
  );
}
