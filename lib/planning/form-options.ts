import type {
  ActivityImpactLevel,
  ActivityPriorityLevel,
} from "@/lib/planning/types";

export const ACTIVITY_DURATION_SUGGESTIONS = [15, 30, 45, 60, 90, 120] as const;

export const ACTIVITY_IMPACT_OPTIONS: ReadonlyArray<{
  value: ActivityImpactLevel;
  label: string;
  description: string;
}> = [
  {
    value: "laag",
    label: "Laag",
    description: "Kleine activiteit met beperkte verwachte belasting.",
  },
  {
    value: "midden",
    label: "Midden",
    description: "Merkbare activiteit waarvoor je bewust ruimte wilt houden.",
  },
  {
    value: "hoog",
    label: "Hoog",
    description: "Zwaardere activiteit die waarschijnlijk meer herstel vraagt.",
  },
] as const;

export const ACTIVITY_PRIORITY_OPTIONS: ReadonlyArray<{
  value: ActivityPriorityLevel;
  label: string;
  description: string;
}> = [
  {
    value: "laag",
    label: "Laag",
    description: "Kan makkelijk verschuiven als je dag anders loopt.",
  },
  {
    value: "normaal",
    label: "Normaal",
    description: "Belangrijk genoeg om bewust in je dag mee te nemen.",
  },
  {
    value: "hoog",
    label: "Hoog",
    description: "Heeft vandaag duidelijk prioriteit, maar blijft wel een keuze.",
  },
] as const;
