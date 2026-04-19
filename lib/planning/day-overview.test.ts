import { describe, expect, it } from "vitest";
import { calculateDayOverviewSnapshot } from "./day-overview";

describe("calculateDayOverviewSnapshot", () => {
  it("berekent gepland versus werkelijk met statusverdeling", () => {
    const snapshot = calculateDayOverviewSnapshot([
      {
        source: "planned",
        status: "completed",
        durationMinutes: 30,
        impactLevel: "midden",
      },
      {
        source: "planned",
        status: "adjusted",
        durationMinutes: 60,
        impactLevel: "laag",
      },
      {
        source: "planned",
        status: "skipped",
        durationMinutes: 90,
        impactLevel: "hoog",
      },
      {
        source: "ad_hoc",
        status: "completed",
        durationMinutes: 15,
        impactLevel: "laag",
      },
      {
        source: "planned",
        status: "planned",
        durationMinutes: 45,
        impactLevel: "midden",
      },
    ]);

    expect(snapshot.totalActivities).toBe(5);
    expect(snapshot.plannedActivityCount).toBe(4);
    expect(snapshot.adHocActivityCount).toBe(1);
    expect(snapshot.openActivityCount).toBe(1);
    expect(snapshot.completedActivityCount).toBe(2);
    expect(snapshot.adjustedActivityCount).toBe(1);
    expect(snapshot.skippedActivityCount).toBe(1);
    expect(snapshot.executedActivityCount).toBe(3);
    expect(snapshot.plannedPoints).toBe(10);
    expect(snapshot.actualPoints).toBe(5);
    expect(snapshot.pointDifference).toBe(-5);
  });

  it("laat ongeplande activiteiten meetellen in werkelijk, niet in gepland", () => {
    const snapshot = calculateDayOverviewSnapshot([
      {
        source: "ad_hoc",
        status: "completed",
        durationMinutes: 120,
        impactLevel: "hoog",
      },
    ]);

    expect(snapshot.plannedActivityCount).toBe(0);
    expect(snapshot.adHocActivityCount).toBe(1);
    expect(snapshot.plannedPoints).toBe(0);
    expect(snapshot.actualPoints).toBe(5);
    expect(snapshot.pointDifference).toBe(5);
  });
});
