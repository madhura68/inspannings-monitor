import type {
  ActivityImpactLevel,
  ActivityRecord,
  ActivityStatus,
} from "@/lib/planning/types";

export type PlanningMeterSnapshot = {
  plannedPoints: number;
  activityCount: number;
  dailyBudget: number | null;
  remainingBudget: number | null;
  progressRatio: number | null;
  progressPercent: number | null;
  isOverBudget: boolean;
};

type ActivityMeterInput = {
  durationMinutes: number;
  impactLevel: ActivityImpactLevel;
  status?: ActivityStatus;
};

function deriveDurationBandPoints(durationMinutes: number) {
  if (durationMinutes <= 15) {
    return 1;
  }

  if (durationMinutes <= 45) {
    return 2;
  }

  if (durationMinutes <= 90) {
    return 3;
  }

  return 4;
}

function deriveImpactAdjustment(impactLevel: ActivityImpactLevel) {
  if (impactLevel === "laag") {
    return -1;
  }

  if (impactLevel === "hoog") {
    return 1;
  }

  return 0;
}

export function deriveActivityEnergyPoints(input: ActivityMeterInput): number {
  if (input.status === "skipped") {
    return 0;
  }

  return Math.max(
    1,
    deriveDurationBandPoints(input.durationMinutes) + deriveImpactAdjustment(input.impactLevel),
  );
}

export function calculatePlannedPointsTotal(
  activities: Pick<ActivityRecord, "durationMinutes" | "impactLevel" | "status">[],
): number {
  return activities.reduce(
    (total, activity) => total + deriveActivityEnergyPoints(activity),
    0,
  );
}

export function calculatePlanningMeterSnapshot(
  activities: Pick<ActivityRecord, "durationMinutes" | "impactLevel" | "status">[],
  dailyBudget: number | null,
): PlanningMeterSnapshot {
  const plannedPoints = calculatePlannedPointsTotal(activities);

  if (dailyBudget === null) {
    return {
      plannedPoints,
      activityCount: activities.length,
      dailyBudget: null,
      remainingBudget: null,
      progressRatio: null,
      progressPercent: null,
      isOverBudget: false,
    };
  }

  const remainingBudget = dailyBudget - plannedPoints;
  const progressRatio = dailyBudget > 0 ? plannedPoints / dailyBudget : 0;

  return {
    plannedPoints,
    activityCount: activities.length,
    dailyBudget,
    remainingBudget,
    progressRatio,
    progressPercent: Math.min(100, Math.round(progressRatio * 100)),
    isOverBudget: remainingBudget < 0,
  };
}
