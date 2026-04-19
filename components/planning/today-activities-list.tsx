import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
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
    <Card className="rounded-[1.75rem] border border-border/60 bg-card/90 py-0 shadow-[0_12px_40px_rgba(71,85,105,0.08)]">
      <CardHeader className="pb-0">
        <p className="text-xs font-semibold uppercase tracking-[0.24em] text-muted-foreground">
          Vandaag gepland
        </p>
        <CardTitle className="text-lg text-slate-900">
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
              className="rounded-[1.25rem] border border-border/60 bg-background/80 px-4 py-4"
            >
              <div className="flex flex-wrap items-start justify-between gap-3">
                <div>
                  <p className="text-sm font-semibold text-slate-900">{activity.name}</p>
                  <p className="mt-1 text-sm leading-7 text-muted-foreground">
                    {getCategoryLabel(categories, activity.categoryId)}
                  </p>
                </div>
                <span className="rounded-full bg-secondary px-3 py-1 text-xs font-semibold uppercase tracking-[0.16em] text-secondary-foreground">
                  Gepland
                </span>
              </div>

              <div className="mt-4 grid gap-3 text-sm leading-7 text-slate-700 sm:grid-cols-3">
                <p>
                  <strong>Duur:</strong> {activity.durationMinutes} min
                </p>
                <p>
                  <strong>Impact:</strong> {formatImpactLabel(activity.impactLevel)}
                </p>
                <p>
                  <strong>Prioriteit:</strong> {formatPriorityLabel(activity.priorityLevel)}
                </p>
              </div>
            </div>
          ))
        )}
      </CardContent>
    </Card>
  );
}
