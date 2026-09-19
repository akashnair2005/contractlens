import type { Clause, ClauseFinding, Rule, RiskLevel } from "@/types";
import { allRules } from "@/rules";

const LEVELS: RiskLevel[] = ["low", "medium", "high", "critical"];

function levelIndex(level: RiskLevel): number {
  return LEVELS.indexOf(level);
}

/** Score bands used to translate an adjusted risk level into a 0-100 display score. */
const LEVEL_SCORE_BANDS: Record<RiskLevel, [number, number]> = {
  low: [10, 29],
  medium: [30, 59],
  high: [60, 79],
  critical: [80, 97],
};

function toRegex(signal: string): RegExp {
  // Signals are treated as case-insensitive patterns. Most are plain phrases;
  // a few (e.g. in restrictions.ts) intentionally use light regex like ".*"
  // to match variable phrasing such as "for a period of two years... not compete".
  return new RegExp(signal, "i");
}

function findMatches(text: string, signals: string[] | undefined): string[] {
  if (!signals || signals.length === 0) return [];
  const matches: string[] = [];
  for (const signal of signals) {
    try {
      if (toRegex(signal).test(text)) matches.push(signal);
    } catch {
      // If a signal isn't valid regex for some reason, fall back to substring match.
      if (text.toLowerCase().includes(signal.toLowerCase())) matches.push(signal);
    }
  }
  return matches;
}

/**
 * Applies contextual adjustment to a rule match:
 *  - Additional distinct positive signals beyond the first nudge severity up
 *    (more corroborating evidence = more confidence this is a real concern).
 *  - Any mitigating signal found in the same clause nudges severity down
 *    (e.g. "shall not exceed" softens "liability").
 *  - Suppressing signals cause the rule to be skipped entirely — these guard
 *    against clear false positives like generic compliance boilerplate.
 */
function evaluateRuleAgainstClause(
  rule: Rule,
  clause: Clause
): ClauseFinding | null {
  const suppressed = findMatches(clause.text, rule.suppressingSignals);
  if (suppressed.length > 0) return null;

  const positiveMatches = findMatches(clause.text, rule.positiveSignals);
  if (positiveMatches.length === 0) return null;

  const mitigatingMatches = findMatches(clause.text, rule.mitigatingSignals);

  let adjustedIndex = levelIndex(rule.severity);
  if (mitigatingMatches.length > 0) adjustedIndex -= 1;
  if (positiveMatches.length >= 3) adjustedIndex += 1;
  adjustedIndex = Math.max(0, Math.min(LEVELS.length - 1, adjustedIndex));
  const adjustedLevel = LEVELS[adjustedIndex];

  const [bandMin, bandMax] = LEVEL_SCORE_BANDS[adjustedLevel];
  // More corroborating signals push the score toward the top of its band;
  // mitigating language pulls it toward the bottom.
  const signalRatio = Math.min(1, (positiveMatches.length - 1) / 3);
  const mitigationPull = Math.min(1, mitigatingMatches.length * 0.4);
  const t = Math.max(0, signalRatio - mitigationPull);
  const score = Math.round(bandMin + t * (bandMax - bandMin));

  return {
    id: `${clause.id}-${rule.id}`,
    clauseId: clause.id,
    ruleId: rule.id,
    category: rule.category,
    riskLevel: adjustedLevel,
    score,
    originalClause: clause.text,
    clauseHeading: clause.heading,
    whatItSays: rule.description,
    whatItMeans: rule.explanationTemplate,
    whyItMatters: rule.whyItMattersTemplate,
    detectedSignals: positiveMatches,
    mitigatingSignalsFound: mitigatingMatches,
    suggestedAction: rule.suggestedAction,
  };
}

/** Runs the full rule set against every clause and returns all findings. */
export function analyzeClauses(
  clauses: Clause[],
  rules: Rule[] = allRules
): ClauseFinding[] {
  const findings: ClauseFinding[] = [];
  for (const clause of clauses) {
    for (const rule of rules) {
      const finding = evaluateRuleAgainstClause(rule, clause);
      if (finding) findings.push(finding);
    }
  }
  return findings;
}

export { LEVELS, levelIndex };
// Final repository verification marker.
