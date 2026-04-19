import { describe, expect, it } from "vitest";
import {
  calculatePlannedPointsTotal,
  calculatePlanningMeterSnapshot,
  deriveActivityEnergyPoints,
} from "./meter";

describe("deriveActivityEnergyPoints", () => {
  it("geeft 1 punt voor een korte lage activiteit", () => {
    expect(
      deriveActivityEnergyPoints({ durationMinutes: 15, impactLevel: "laag", status: "planned" }),
    ).toBe(1);
  });

  it("geeft 2 punten voor een middellange middenactiviteit", () => {
    expect(
      deriveActivityEnergyPoints({
        durationMinutes: 30,
        impactLevel: "midden",
        status: "planned",
      }),
    ).toBe(2);
  });

  it("geeft 4 punten voor een langere hoge activiteit", () => {
    expect(
      deriveActivityEnergyPoints({ durationMinutes: 60, impactLevel: "hoog", status: "planned" }),
    ).toBe(4);
  });

  it("telt een geskipt item niet mee", () => {
    expect(
      deriveActivityEnergyPoints({ durationMinutes: 45, impactLevel: "hoog", status: "skipped" }),
    ).toBe(0);
  });
});

describe("calculatePlanningMeterSnapshot", () => {
  it("somt punten van activiteiten op", () => {
    expect(
      calculatePlannedPointsTotal([
        { durationMinutes: 30, impactLevel: "midden", status: "planned" },
        { durationMinutes: 90, impactLevel: "laag", status: "planned" },
      ]),
    ).toBe(4);
  });

  it("berekent resterend budget en percentage", () => {
    const snapshot = calculatePlanningMeterSnapshot(
      [
        { durationMinutes: 30, impactLevel: "midden", status: "planned" },
        { durationMinutes: 60, impactLevel: "hoog", status: "planned" },
      ],
      8,
    );

    expect(snapshot.plannedPoints).toBe(6);
    expect(snapshot.remainingBudget).toBe(2);
    expect(snapshot.progressPercent).toBe(75);
    expect(snapshot.isOverBudget).toBe(false);
  });

  it("werkt ook zonder dagbudget", () => {
    const snapshot = calculatePlanningMeterSnapshot(
      [{ durationMinutes: 45, impactLevel: "midden", status: "planned" }],
      null,
    );

    expect(snapshot.plannedPoints).toBe(2);
    expect(snapshot.dailyBudget).toBeNull();
    expect(snapshot.remainingBudget).toBeNull();
    expect(snapshot.progressPercent).toBeNull();
  });

  it("markeert overschrijding zonder alarmerende blokkade", () => {
    const snapshot = calculatePlanningMeterSnapshot(
      [
        { durationMinutes: 60, impactLevel: "hoog", status: "planned" },
        { durationMinutes: 120, impactLevel: "hoog", status: "planned" },
      ],
      6,
    );

    expect(snapshot.plannedPoints).toBe(9);
    expect(snapshot.remainingBudget).toBe(-3);
    expect(snapshot.isOverBudget).toBe(true);
    expect(snapshot.progressPercent).toBe(100);
  });
});
