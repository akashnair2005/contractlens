import type {
  CategorySummary,
  ClauseFinding,
  RiskCategory,
  RiskDistribution,
  RiskLevel,
} from "@/types";

export function scoreToLevel(score: number): RiskLevel {
  if (score >= 80) return "critical";
  if (score >= 60) return "high";
  if (score >= 30) return "medium";
  return "low";
}

/**
 * Diminishing-returns weights applied to findings sorted by score, descending.
 * The single most severe finding counts fully; each subsequent finding
 * contributes less, so a document with many minor issues doesn't
 * automatically outscore one with a single critical issue. This keeps the
 * overall score explainable: it's a transparent, capped weighted sum.
 */
const CONTRIBUTION_WEIGHTS = [1, 0.6, 0.4, 0.3, 0.2, 0.15, 0.1];
const TAIL_WEIGHT = 0.05;

export function computeOverallScore(findings: ClauseFinding[]): number {
  if (findings.length === 0) return 0;
  const sorted = [...findings].sort((a, b) => b.score - a.score);
  let total = 0;
  sorted.forEach((finding, i) => {
    const weight = CONTRIBUTION_WEIGHTS[i] ?? TAIL_WEIGHT;
    total += finding.score * weight;
  });
  return Math.max(0, Math.min(100, Math.round(total)));
}

export function computeDistribution(findings: ClauseFinding[]): RiskDistribution {
  const dist: RiskDistribution = { critical: 0, high: 0, medium: 0, low: 0 };
  for (const f of findings) dist[f.riskLevel]++;
  return dist;
}

export function computeCategorySummaries(
  findings: ClauseFinding[],
  allCategories: RiskCategory[]
): CategorySummary[] {
  const byCategory = new Map<RiskCategory, ClauseFinding[]>();
  for (const cat of allCategories) byCategory.set(cat, []);
  for (const f of findings) {
    byCategory.get(f.category)?.push(f);
  }

  const summaries: CategorySummary[] = [];
  for (const [category, catFindings] of byCategory.entries()) {
    if (catFindings.length === 0) {
      summaries.push({ category, riskLevel: "low", score: 0, findingCount: 0 });
      continue;
    }
    const score = computeOverallScore(catFindings);
    summaries.push({
      category,
      riskLevel: scoreToLevel(score),
      score,
      findingCount: catFindings.length,
    });
  }

  // Sort by severity (highest first), then by finding count.
  const levelOrder: Record<RiskLevel, number> = { critical: 3, high: 2, medium: 1, low: 0 };
  return summaries.sort((a, b) => {
    if (levelOrder[b.riskLevel] !== levelOrder[a.riskLevel]) {
      return levelOrder[b.riskLevel] - levelOrder[a.riskLevel];
    }
    return b.score - a.score;
  });
}

export function computeTopPriorities(findings: ClauseFinding[], limit = 5): ClauseFinding[] {
  return [...findings].sort((a, b) => b.score - a.score).slice(0, limit);
}
// Final repository verification marker.
