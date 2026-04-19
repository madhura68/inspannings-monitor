import type { EnergyLevel } from "@/lib/check-in/types";

export const BUDGET_FORMULA_VERSION = 1;

export type BudgetSnapshot = {
  energyLevel: EnergyLevel;
  dailyBudget: number;
  budgetFormulaVersion: number;
};

export function deriveEnergyLevel(energyScore: number): EnergyLevel {
  if (energyScore <= 2) {
    return "zeer_laag";
  }

  if (energyScore <= 4) {
    return "laag";
  }

  if (energyScore <= 6) {
    return "midden";
  }

  if (energyScore <= 8) {
    return "redelijk";
  }

  return "hoog";
}

export function deriveDailyBudget(energyScore: number): number {
  return energyScore;
}

export function deriveBudgetSnapshot(energyScore: number): BudgetSnapshot {
  return {
    energyLevel: deriveEnergyLevel(energyScore),
    dailyBudget: deriveDailyBudget(energyScore),
    budgetFormulaVersion: BUDGET_FORMULA_VERSION,
  };
}

export function formatEnergyLevelLabel(energyLevel: EnergyLevel): string {
  switch (energyLevel) {
    case "zeer_laag":
      return "Zeer laag";
    case "laag":
      return "Laag";
    case "midden":
      return "Midden";
    case "redelijk":
      return "Redelijk";
    case "hoog":
      return "Hoog";
  }
}
