import { v4 as uuid } from "uuid";
import type { AnalysisResult, RiskCategory } from "@/types";
import { segmentClauses } from "@/lib/clause/segment";
import { analyzeClauses } from "@/lib/risk/engine";
import {
  computeCategorySummaries,
  computeDistribution,
  computeOverallScore,
  computeTopPriorities,
  scoreToLevel,
} from "@/lib/risk/scoring";
import { ExtractionError } from "@/lib/parser/errors";

export const ALL_CATEGORIES: RiskCategory[] = [
  "Payment",
  "Intellectual Property",
  "Termination",
  "Liability",
  "Confidentiality",
  "Non-compete / Restrictions",
  "Auto-Renewal",
  "Penalties / Fees",
  "Dispute Resolution",
];

const MIN_WORD_COUNT_WARNING = 50;

/**
 * Runs the full deterministic, rule-based analysis pipeline on already-extracted
 * document text. This is the single code path used for both user uploads and
 * the bundled demo contract — there is no separate "demo mode" logic.
 */
export function runAnalysisPipeline(
  documentText: string,
  contractName: string
): AnalysisResult {
  const trimmed = documentText.trim();
  if (!trimmed) {
    throw new ExtractionError("The document appears to be empty.", "EMPTY_DOCUMENT");
  }

  const wordCount = trimmed.split(/\s+/).filter(Boolean).length;
  const warnings: string[] = [];
  if (wordCount < MIN_WORD_COUNT_WARNING) {
    warnings.push(
      "This document is quite short. Results may be less comprehensive than for a full contract."
    );
  }

  const clauses = segmentClauses(trimmed);
  if (clauses.length === 0) {
    throw new ExtractionError(
      "The document could not be broken into clauses for analysis.",
      "ANALYSIS_FAILED"
    );
  }

  const findings = analyzeClauses(clauses);
  const overallScore = computeOverallScore(findings);
  const overallLevel = scoreToLevel(overallScore);
  const distribution = computeDistribution(findings);
  const categorySummaries = computeCategorySummaries(findings, ALL_CATEGORIES);
  const topPriorities = computeTopPriorities(findings, 5);

  const result: AnalysisResult = {
    id: uuid(),
    contractName,
    createdAt: new Date().toISOString(),
    documentText: trimmed,
    clauses,
    findings,
    overallScore,
    overallLevel,
    distribution,
    categorySummaries,
    topPriorities,
    wordCount,
    warnings,
  };

  return result;
}
// Final repository verification marker.
