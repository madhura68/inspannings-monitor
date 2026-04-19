import { describe, expect, it } from "vitest";
import {
  BUDGET_FORMULA_VERSION,
  deriveBudgetSnapshot,
  deriveDailyBudget,
  deriveEnergyLevel,
  formatEnergyLevelLabel,
} from "./budget";

describe("deriveEnergyLevel", () => {
  it("maps scores 1 and 2 to zeer_laag", () => {
    expect(deriveEnergyLevel(1)).toBe("zeer_laag");
    expect(deriveEnergyLevel(2)).toBe("zeer_laag");
  });

  it("maps scores 3 and 4 to laag", () => {
    expect(deriveEnergyLevel(3)).toBe("laag");
    expect(deriveEnergyLevel(4)).toBe("laag");
  });

  it("maps scores 5 and 6 to midden", () => {
    expect(deriveEnergyLevel(5)).toBe("midden");
    expect(deriveEnergyLevel(6)).toBe("midden");
  });

  it("maps scores 7 and 8 to redelijk", () => {
    expect(deriveEnergyLevel(7)).toBe("redelijk");
    expect(deriveEnergyLevel(8)).toBe("redelijk");
  });

  it("maps scores 9 and 10 to hoog", () => {
    expect(deriveEnergyLevel(9)).toBe("hoog");
    expect(deriveEnergyLevel(10)).toBe("hoog");
  });
});

describe("deriveDailyBudget", () => {
  it("keeps v1 daily budget equal to the energy score", () => {
    expect(deriveDailyBudget(1)).toBe(1);
    expect(deriveDailyBudget(5)).toBe(5);
    expect(deriveDailyBudget(10)).toBe(10);
  });
});

describe("deriveBudgetSnapshot", () => {
  it("returns a stable snapshot with formula version", () => {
    expect(deriveBudgetSnapshot(6)).toEqual({
      energyLevel: "midden",
      dailyBudget: 6,
      budgetFormulaVersion: BUDGET_FORMULA_VERSION,
    });
  });
});

describe("formatEnergyLevelLabel", () => {
  it("returns readable Dutch labels", () => {
    expect(formatEnergyLevelLabel("zeer_laag")).toBe("Zeer laag");
    expect(formatEnergyLevelLabel("redelijk")).toBe("Redelijk");
  });
});
