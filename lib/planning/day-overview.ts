import { deriveActivityEnergyPoints } from "./meter";
import type { ActivityRecord } from "./types";

type ActivityOverviewInput = Pick<
  ActivityRecord,
  "source" | "status" | "durationMinutes" | "impactLevel"
>;

export type DayOverviewSnapshot = {
  totalActivities: number;
  plannedActivityCount: number;
  adHocActivityCount: number;
  openActivityCount: number;
  completedActivityCount: number;
  adjustedActivityCount: number;
  skippedActivityCount: number;
  executedActivityCount: number;
  plannedPoints: number;
  actualPoints: number;
  pointDifference: number;
};

export function calculateDayOverviewSnapshot(
  activities: ActivityOverviewInput[],
): DayOverviewSnapshot {
  return activities.reduce<DayOverviewSnapshot>(
    (snapshot, activity) => {
      snapshot.totalActivities += 1;

      if (activity.source === "planned") {
        snapshot.plannedActivityCount += 1;
        // Planned points should reflect the intended activity load, regardless of later status.
        snapshot.plannedPoints += deriveActivityEnergyPoints({
          durationMinutes: activity.durationMinutes,
          impactLevel: activity.impactLevel,
        });
      } else {
        snapshot.adHocActivityCount += 1;
      }

      if (activity.status === "planned") {
        snapshot.openActivityCount += 1;
      } else if (activity.status === "completed") {
        snapshot.completedActivityCount += 1;
        snapshot.executedActivityCount += 1;
        snapshot.actualPoints += deriveActivityEnergyPoints(activity);
      } else if (activity.status === "adjusted") {
        snapshot.adjustedActivityCount += 1;
        snapshot.executedActivityCount += 1;
        snapshot.actualPoints += deriveActivityEnergyPoints(activity);
      } else if (activity.status === "skipped") {
        snapshot.skippedActivityCount += 1;
      }

      snapshot.pointDifference = snapshot.actualPoints - snapshot.plannedPoints;
      return snapshot;
    },
    {
      totalActivities: 0,
      plannedActivityCount: 0,
      adHocActivityCount: 0,
      openActivityCount: 0,
      completedActivityCount: 0,
      adjustedActivityCount: 0,
      skippedActivityCount: 0,
      executedActivityCount: 0,
      plannedPoints: 0,
      actualPoints: 0,
      pointDifference: 0,
    },
  );
}
