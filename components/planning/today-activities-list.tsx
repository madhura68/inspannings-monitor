import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { deriveActivityEnergyPoints } from "@/lib/planning/meter";
import type { ActivityCategory, ActivityRecord } from "@/lib/planning/types";

type TodayActivitiesListProps = {
  activities: ActivityRecord[];
  categories: ActivityCategory[];
};

function getCategoryLabel(categories: ActivityCategory[], categoryId: string) {
  return categories.find((category) => category.id === categoryId)?.labelNl ?? "Onbekende categorie";
}

function formatImpactLabel(value: ActivityRecord["impactLevel"]) {
  if (value === "laag") {
    return "Laag";
  }

  if (value === "midden") {
    return "Midden";
  }

  return "Hoog";
}

function formatPriorityLabel(value: ActivityRecord["priorityLevel"]) {
  if (value === "laag") {
    return "Laag";
  }

  if (value === "hoog") {
    return "Hoog";
  }

  return "Normaal";
}

export function TodayActivitiesList({
  activities,
  categories,
}: TodayActivitiesListProps) {
  return (
    <Card className="py-0">
      <CardHeader className="pb-0">
        <p className="text-xs font-semibold uppercase tracking-[0.24em] text-muted-foreground">
          Vandaag gepland
        </p>
        <CardTitle className="text-lg text-foreground">
          {activities.length === 0
            ? "Nog geen activiteiten gepland"
            : `${activities.length} ${activities.length === 1 ? "activiteit" : "activiteiten"}`}
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4 pb-6">
        {activities.length === 0 ? (
          <CardDescription className="text-sm leading-7 text-muted-foreground">
            Je dag is nog leeg. Plan eerst een kleine concrete activiteit om de flow op gang te brengen.
          </CardDescription>
        ) : (
          activities.map((activity) => (
            <div
              key={activity.id}
              className="rounded-[var(--radius-xl)] border border-border/60 bg-background/80 px-4 py-4"
            >
              <div className="flex flex-wrap items-start justify-between gap-3">
                <div>
                  <p className="text-sm font-semibold text-foreground">{activity.name}</p>
                  <p className="mt-1 text-sm leading-7 text-muted-foreground">
                    {getCategoryLabel(categories, activity.categoryId)}
                  </p>
                </div>
                <span className="rounded-full bg-secondary px-3 py-1 text-xs font-semibold uppercase tracking-[0.16em] text-secondary-foreground">
                  Gepland
                </span>
              </div>

              <div className="mt-4 grid gap-3 text-sm leading-7 text-foreground/80 sm:grid-cols-3">
                <p>
                  <strong>Duur:</strong> {activity.durationMinutes} min
                </p>
                <p>
                  <strong>Impact:</strong> {formatImpactLabel(activity.impactLevel)}
                </p>
                <p>
                  <strong>Prioriteit:</strong> {formatPriorityLabel(activity.priorityLevel)}
                </p>
                <p>
                  <strong>Punten:</strong>{" "}
                  {deriveActivityEnergyPoints(activity)}
                </p>
              </div>
            </div>
          ))
        )}
      </CardContent>
    </Card>
  );
}
