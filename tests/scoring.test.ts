import { describe, it, expect } from "vitest";
import {
  computeOverallScore,
  computeDistribution,
  computeCategorySummaries,
  computeTopPriorities,
  scoreToLevel,
} from "@/lib/risk/scoring";
import type { ClauseFinding } from "@/types";

function finding(overrides: Partial<ClauseFinding>): ClauseFinding {
  return {
    id: overrides.id ?? "f1",
    clauseId: "c1",
    ruleId: "RULE",
    category: "Liability",
    riskLevel: "high",
    score: 70,
    originalClause: "text",
    whatItSays: "desc",
    whatItMeans: "means",
    whyItMatters: "matters",
    detectedSignals: [],
    mitigatingSignalsFound: [],
    suggestedAction: "ask",
    ...overrides,
  };
}

describe("scoreToLevel", () => {
  it("maps scores to the documented bands", () => {
    expect(scoreToLevel(0)).toBe("low");
    expect(scoreToLevel(29)).toBe("low");
    expect(scoreToLevel(30)).toBe("medium");
    expect(scoreToLevel(59)).toBe("medium");
    expect(scoreToLevel(60)).toBe("high");
    expect(scoreToLevel(79)).toBe("high");
    expect(scoreToLevel(80)).toBe("critical");
    expect(scoreToLevel(100)).toBe("critical");
  });
});

describe("computeOverallScore", () => {
  it("returns 0 for no findings", () => {
    expect(computeOverallScore([])).toBe(0);
  });

  it("weighs a single critical finding heavily", () => {
    const score = computeOverallScore([finding({ score: 90, riskLevel: "critical" })]);
    expect(score).toBeGreaterThanOrEqual(80);
  });

  it("never exceeds 100 regardless of finding count", () => {
    const many = Array.from({ length: 30 }, (_, i) => finding({ id: `f${i}`, score: 95 }));
    expect(computeOverallScore(many)).toBeLessThanOrEqual(100);
  });

  it("scores a contract with many severe findings higher than one with a single mild finding", () => {
    const severe = computeOverallScore([
      finding({ id: "a", score: 90 }),
      finding({ id: "b", score: 85 }),
      finding({ id: "c", score: 80 }),
    ]);
    const mild = computeOverallScore([finding({ id: "a", score: 20, riskLevel: "low" })]);
    expect(severe).toBeGreaterThan(mild);
  });
});

describe("computeDistribution", () => {
  it("counts findings per risk level", () => {
    const dist = computeDistribution([
      finding({ id: "a", riskLevel: "critical" }),
      finding({ id: "b", riskLevel: "high" }),
      finding({ id: "c", riskLevel: "high" }),
      finding({ id: "d", riskLevel: "low" }),
    ]);
    expect(dist).toEqual({ critical: 1, high: 2, medium: 0, low: 1 });
  });
});

describe("computeCategorySummaries", () => {
  it("includes all categories even with zero findings", () => {
    const summaries = computeCategorySummaries([], ["Liability", "Payment"]);
    expect(summaries).toHaveLength(2);
    expect(summaries.every((s) => s.riskLevel === "low" && s.findingCount === 0)).toBe(true);
  });

  it("sorts categories by severity, most severe first", () => {
    const summaries = computeCategorySummaries(
      [
        finding({ id: "a", category: "Payment", score: 20, riskLevel: "low" }),
        finding({ id: "b", category: "Liability", score: 95, riskLevel: "critical" }),
      ],
      ["Payment", "Liability"]
    );
    expect(summaries[0].category).toBe("Liability");
  });
});

describe("computeTopPriorities", () => {
  it("returns findings sorted by score, descending, limited to N", () => {
    const findings = [
      finding({ id: "a", score: 40 }),
      finding({ id: "b", score: 90 }),
      finding({ id: "c", score: 60 }),
    ];
    const top = computeTopPriorities(findings, 2);
    expect(top.map((f) => f.id)).toEqual(["b", "c"]);
  });
});
// Final repository verification marker.
