import {
  ACTIVITY_IMPACT_LEVEL_VALUES,
  ACTIVITY_PRIORITY_LEVEL_VALUES,
  ACTIVITY_SOURCE_VALUES,
  ACTIVITY_STATUS_VALUES,
} from "@/lib/planning/options";
import type { DayOverviewSnapshot } from "@/lib/planning/day-overview";

export type ActivitySource = (typeof ACTIVITY_SOURCE_VALUES)[number];
export type ActivityStatus = (typeof ACTIVITY_STATUS_VALUES)[number];
export type ActivityImpactLevel = (typeof ACTIVITY_IMPACT_LEVEL_VALUES)[number];
export type ActivityPriorityLevel = (typeof ACTIVITY_PRIORITY_LEVEL_VALUES)[number];

export type ActivityCategory = {
  id: string;
  key: string;
  labelNl: string;
  sortOrder: number;
  isActive: boolean;
  createdAt: string;
};

export type SkipReason = {
  id: string;
  key: string;
  labelNl: string;
  sortOrder: number;
  isActive: boolean;
  createdAt: string;
};

export type ActivityRecord = {
  id: string;
  userId: string;
  activityDate: string;
  source: ActivitySource;
  status: ActivityStatus;
  name: string;
  categoryId: string;
  durationMinutes: number;
  impactLevel: ActivityImpactLevel;
  priorityLevel: ActivityPriorityLevel;
  skipReasonId: string | null;
  notes: string | null;
  createdAt: string;
  updatedAt: string;
};

export type CreateActivitySubmission = {
  name: string;
  categoryId: string;
  durationMinutes: number;
  impactLevel: ActivityImpactLevel;
  priorityLevel: ActivityPriorityLevel;
};

export type CreateAdHocActivitySubmission = {
  name: string;
  categoryId: string;
  durationMinutes: number;
  impactLevel: ActivityImpactLevel;
};

export type UpdateActivityStatusSubmission = {
  activityId: string;
  status: ActivityStatus;
};

export type UpdateActivityEvaluationSubmission = {
  activityId: string;
  skipReasonId: string | null;
  notes: string | null;
};

export type ActivitiesForDateStatus = {
  timezone: string;
  activityDate: string;
  activities: ActivityRecord[];
};

export type PlanningPageData = {
  timezone: string;
  activityDate: string;
  categories: ActivityCategory[];
  skipReasons: SkipReason[];
  activities: ActivityRecord[];
  dayOverview: DayOverviewSnapshot;
};
