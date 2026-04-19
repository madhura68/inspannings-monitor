import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { ActivityEvaluationFields } from "@/components/planning/activity-evaluation-fields";
import { ActivityStatusActions } from "@/components/planning/activity-status-actions";
import { deriveActivityEnergyPoints } from "@/lib/planning/meter";
import type {
  ActivityCategory,
  ActivityRecord,
  SkipReason,
} from "@/lib/planning/types";
import { cn } from "@/lib/utils";

type TodayActivitiesListProps = {
  activities: ActivityRecord[];
  categories: ActivityCategory[];
  skipReasons: SkipReason[];
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

function formatStatusLabel(value: ActivityRecord["status"]) {
  if (value === "completed") {
    return "Uitgevoerd";
  }

  if (value === "skipped") {
    return "Overgeslagen";
  }

  if (value === "adjusted") {
    return "Aangepast";
  }

  return "Gepland";
}

function getStatusBadgeClassName(value: ActivityRecord["status"]) {
  if (value === "completed") {
    return "bg-success text-primary-foreground";
  }

  if (value === "skipped") {
    return "bg-warning text-foreground";
  }

  if (value === "adjusted") {
    return "bg-secondary text-secondary-foreground";
  }

  return "bg-secondary text-secondary-foreground";
}

function formatSourceLabel(value: ActivityRecord["source"]) {
  if (value === "ad_hoc") {
    return "Ongepland";
  }

  return "Gepland";
}

function getSourceBadgeClassName(value: ActivityRecord["source"]) {
  if (value === "ad_hoc") {
    return "bg-primary !text-white";
  }

  return "bg-muted text-muted-foreground";
}

export function TodayActivitiesList({
  activities,
  categories,
  skipReasons,
}: TodayActivitiesListProps) {
  return (
    <Card className="pb-0">
      <CardHeader className="pb-0">
        <p className="text-xs font-semibold uppercase tracking-[0.24em] text-muted-foreground">
          Vandaag in beeld
        </p>
        <CardTitle className="text-lg text-foreground">
          {activities.length === 0
            ? "Nog geen activiteiten toegevoegd"
            : `${activities.length} ${activities.length === 1 ? "activiteit" : "activiteiten"}`}
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4 pb-6">
        {activities.length === 0 ? (
          <CardDescription className="text-sm leading-7 text-muted-foreground">
            Je dag is nog leeg. Plan eerst iets kleins of voeg later een ongeplande activiteit toe als je dag anders liep dan verwacht.
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
                <div className="flex flex-wrap items-center gap-2">
                  <span
                    className={cn(
                      "rounded-full px-3 py-1 text-xs font-semibold uppercase tracking-[0.16em]",
                      getSourceBadgeClassName(activity.source),
                    )}
                  >
                    {formatSourceLabel(activity.source)}
                  </span>
                  <span
                    className={cn(
                      "rounded-full px-3 py-1 text-xs font-semibold uppercase tracking-[0.16em]",
                      getStatusBadgeClassName(activity.status),
                    )}
                  >
                    {formatStatusLabel(activity.status)}
                  </span>
                </div>
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

              <div className="mt-5 border-t border-border/60 pt-4">
                <ActivityStatusActions
                  activityId={activity.id}
                  status={activity.status}
                />
              </div>

              {(activity.status === "skipped" || activity.status === "adjusted") ? (
                <div className="mt-4 rounded-[var(--radius-lg)] border border-border/60 bg-card/60 p-4">
                  <ActivityEvaluationFields
                    key={`${activity.id}-${activity.status}`}
                    activityId={activity.id}
                    status={activity.status}
                    skipReasons={skipReasons}
                    initialSkipReasonId={activity.skipReasonId}
                    initialNotes={activity.notes}
                  />
                </div>
              ) : null}
            </div>
          ))
        )}
      </CardContent>
    </Card>
  );
}
