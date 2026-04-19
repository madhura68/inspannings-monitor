"use client";

import { useMemo } from "react";
import type { ActivityCategory, ActivitySuggestion } from "@/lib/planning/types";
import { cn } from "@/lib/utils";

type ActivitySuggestionListProps = {
  categories: ActivityCategory[];
  suggestions: ActivitySuggestion[];
  query: string;
  disabled?: boolean;
  showPriority?: boolean;
  onSelect: (suggestion: ActivitySuggestion) => void;
};

function normalizeQuery(value: string) {
  return value.trim().replace(/\s+/g, " ").toLocaleLowerCase("nl-NL");
}

function getCategoryLabel(categories: ActivityCategory[], categoryId: string) {
  return categories.find((category) => category.id === categoryId)?.labelNl ?? "Onbekende categorie";
}

function formatImpactLabel(value: ActivitySuggestion["impactLevel"]) {
  if (value === "laag") {
    return "Lage impact";
  }

  if (value === "hoog") {
    return "Hoge impact";
  }

  return "Middenimpact";
}

function formatPriorityLabel(value: ActivitySuggestion["priorityLevel"]) {
  if (value === "laag") {
    return "Lage prioriteit";
  }

  if (value === "hoog") {
    return "Hoge prioriteit";
  }

  return "Normale prioriteit";
}

export function ActivitySuggestionList({
  categories,
  suggestions,
  query,
  disabled = false,
  showPriority = true,
  onSelect,
}: ActivitySuggestionListProps) {
  const normalizedQuery = normalizeQuery(query);
  const visibleSuggestions = useMemo(() => {
    const filtered = normalizedQuery
      ? suggestions.filter((suggestion) =>
          normalizeQuery(suggestion.name).includes(normalizedQuery),
        )
      : suggestions;

    return filtered.slice(0, normalizedQuery ? 5 : 4);
  }, [normalizedQuery, suggestions]);

  if (visibleSuggestions.length === 0) {
    if (!normalizedQuery) {
      return null;
    }

    return (
      <p className="text-sm leading-7 text-muted-foreground">
        Geen eerdere match gevonden. Je kunt deze activiteit gewoon nieuw opslaan.
      </p>
    );
  }

  return (
    <div className="space-y-2">
      <p className="text-sm font-medium text-foreground">
        {normalizedQuery ? "Vergelijkbare eerdere activiteiten" : "Snel hergebruiken"}
      </p>
      <div className="grid gap-2">
        {visibleSuggestions.map((suggestion) => (
          <button
            key={suggestion.id}
            type="button"
            disabled={disabled}
            onClick={() => onSelect(suggestion)}
            className={cn(
              "rounded-[1.1rem] border border-border/65 bg-background/78 px-4 py-3 text-left transition hover:border-primary/35 hover:bg-card disabled:pointer-events-none disabled:opacity-60",
            )}
          >
            <span className="block text-sm font-semibold text-foreground">{suggestion.name}</span>
            <span className="mt-1 block text-sm leading-6 text-muted-foreground">
              {getCategoryLabel(categories, suggestion.categoryId)} · {suggestion.durationMinutes} min ·{" "}
              {formatImpactLabel(suggestion.impactLevel)}
              {showPriority ? ` · ${formatPriorityLabel(suggestion.priorityLevel)}` : ""}
              {suggestion.useCount > 1 ? ` · ${suggestion.useCount}× gebruikt` : ""}
            </span>
          </button>
        ))}
      </div>
    </div>
  );
}
