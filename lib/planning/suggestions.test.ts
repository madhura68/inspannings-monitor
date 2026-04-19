import { describe, expect, it } from "vitest";
import { buildActivitySuggestions } from "./suggestions";

describe("buildActivitySuggestions", () => {
  it("dedupliceert dezelfde activiteit en telt gebruik", () => {
    const suggestions = buildActivitySuggestions([
      {
        name: "  Was opvouwen ",
        categoryId: "cat-a",
        durationMinutes: 30,
        impactLevel: "laag",
        priorityLevel: "normaal",
        createdAt: "2026-04-18T08:00:00.000Z",
        updatedAt: "2026-04-18T08:00:00.000Z",
      },
      {
        name: "Was   opvouwen",
        categoryId: "cat-a",
        durationMinutes: 30,
        impactLevel: "laag",
        priorityLevel: "normaal",
        createdAt: "2026-04-19T08:00:00.000Z",
        updatedAt: "2026-04-19T09:00:00.000Z",
      },
    ]);

    expect(suggestions).toHaveLength(1);
    expect(suggestions[0]).toMatchObject({
      name: "Was opvouwen",
      categoryId: "cat-a",
      durationMinutes: 30,
      impactLevel: "laag",
      priorityLevel: "normaal",
      useCount: 2,
      lastUsedAt: "2026-04-19T09:00:00.000Z",
    });
  });

  it("sorteert op meest recent gebruik en houdt verschillende varianten apart", () => {
    const suggestions = buildActivitySuggestions([
      {
        name: "Boodschappen",
        categoryId: "cat-a",
        durationMinutes: 45,
        impactLevel: "midden",
        priorityLevel: "hoog",
        createdAt: "2026-04-17T08:00:00.000Z",
        updatedAt: "2026-04-17T08:00:00.000Z",
      },
      {
        name: "Telefoontje",
        categoryId: "cat-b",
        durationMinutes: 15,
        impactLevel: "laag",
        priorityLevel: "normaal",
        createdAt: "2026-04-19T10:00:00.000Z",
        updatedAt: "2026-04-19T10:00:00.000Z",
      },
      {
        name: "Boodschappen",
        categoryId: "cat-a",
        durationMinutes: 45,
        impactLevel: "midden",
        priorityLevel: "laag",
        createdAt: "2026-04-18T08:00:00.000Z",
        updatedAt: "2026-04-18T08:00:00.000Z",
      },
    ]);

    expect(suggestions).toHaveLength(3);
    expect(suggestions[0].name).toBe("Telefoontje");
    expect(suggestions[1].priorityLevel).toBe("laag");
    expect(suggestions[2].priorityLevel).toBe("hoog");
  });
});
