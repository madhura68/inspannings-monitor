import type { ActivityRecord, ActivitySuggestion } from "./types";

type ActivitySuggestionInput = Pick<
  ActivityRecord,
  | "name"
  | "categoryId"
  | "durationMinutes"
  | "impactLevel"
  | "priorityLevel"
  | "createdAt"
  | "updatedAt"
>;

function normalizeSuggestionName(value: string) {
  return value.trim().replace(/\s+/g, " ").toLocaleLowerCase("nl-NL");
}

function cleanSuggestionName(value: string) {
  return value.trim().replace(/\s+/g, " ");
}

function buildSuggestionKey(activity: ActivitySuggestionInput) {
  return [
    normalizeSuggestionName(activity.name),
    activity.categoryId,
    activity.durationMinutes,
    activity.impactLevel,
    activity.priorityLevel,
  ].join("::");
}

function compareSuggestions(a: ActivitySuggestion, b: ActivitySuggestion) {
  if (a.lastUsedAt !== b.lastUsedAt) {
    return b.lastUsedAt.localeCompare(a.lastUsedAt);
  }

  if (a.useCount !== b.useCount) {
    return b.useCount - a.useCount;
  }

  return a.name.localeCompare(b.name, "nl-NL");
}

export function buildActivitySuggestions(
  activities: ActivitySuggestionInput[],
  limit = 12,
): ActivitySuggestion[] {
  const suggestions = new Map<string, ActivitySuggestion>();

  for (const activity of activities) {
    const key = buildSuggestionKey(activity);
    const lastUsedAt = activity.updatedAt ?? activity.createdAt;
    const existing = suggestions.get(key);

    if (!existing) {
      suggestions.set(key, {
        id: key,
        name: cleanSuggestionName(activity.name),
        categoryId: activity.categoryId,
        durationMinutes: activity.durationMinutes,
        impactLevel: activity.impactLevel,
        priorityLevel: activity.priorityLevel,
        lastUsedAt,
        useCount: 1,
      });
      continue;
    }

    existing.useCount += 1;

    if (lastUsedAt.localeCompare(existing.lastUsedAt) > 0) {
      existing.lastUsedAt = lastUsedAt;
      existing.name = cleanSuggestionName(activity.name);
      existing.categoryId = activity.categoryId;
      existing.durationMinutes = activity.durationMinutes;
      existing.impactLevel = activity.impactLevel;
      existing.priorityLevel = activity.priorityLevel;
    }
  }

  return Array.from(suggestions.values()).sort(compareSuggestions).slice(0, limit);
}
