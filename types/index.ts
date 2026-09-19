// Core data model for ContractLens.
// These types flow through the entire pipeline: extraction -> segmentation ->
// rule engine -> scoring -> UI.

export type RiskLevel = "low" | "medium" | "high" | "critical";

export type RiskCategory =
  | "Payment"
  | "Intellectual Property"
  | "Termination"
  | "Liability"
  | "Confidentiality"
  | "Non-compete / Restrictions"
  | "Auto-Renewal"
  | "Penalties / Fees"
  | "Dispute Resolution";

/** A single segment of the contract identified during clause segmentation. */
export interface Clause {
  id: string;
  index: number; // order of appearance in the document
  heading?: string; // detected section heading, if any
  text: string; // raw extracted text of the clause
  startOffset: number; // character offset in the full document text
  endOffset: number;
}

/** A rule definition. Rules are pure, declarative, and independently testable. */
export interface Rule {
  id: string;
  category: RiskCategory;
  severity: RiskLevel; // baseline severity before contextual adjustment
  baseScore: number; // 0-40ish contribution before adjustment
  description: string; // short human label for the rule, e.g. "Unlimited liability language"
  /** Signals (regex-friendly phrases) whose presence raises concern. */
  positiveSignals: string[];
  /** Signals whose presence in the SAME clause reduces concern (mitigating language). */
  mitigatingSignals?: string[];
  /** Signals that, if present, should suppress the rule entirely (clear false-positive guards). */
  suppressingSignals?: string[];
  explanationTemplate: string; // "What it means"
  whyItMattersTemplate: string; // "Why it matters"
  suggestedAction: string; // practical question / negotiation suggestion
}

/** The result of matching one rule against one clause. */
export interface ClauseFinding {
  id: string;
  clauseId: string;
  ruleId: string;
  category: RiskCategory;
  riskLevel: RiskLevel;
  score: number; // 0-100, this finding's contribution/severity after context adjustment
  originalClause: string;
  clauseHeading?: string;
  whatItSays: string;
  whatItMeans: string;
  whyItMatters: string;
  detectedSignals: string[];
  mitigatingSignalsFound: string[];
  suggestedAction: string;
  reviewed?: boolean;
}

export interface CategorySummary {
  category: RiskCategory;
  riskLevel: RiskLevel;
  score: number;
  findingCount: number;
}

export interface RiskDistribution {
  critical: number;
  high: number;
  medium: number;
  low: number;
}

export interface AnalysisResult {
  id: string;
  contractName: string;
  createdAt: string;
  documentText: string;
  clauses: Clause[];
  findings: ClauseFinding[];
  overallScore: number; // 0-100
  overallLevel: RiskLevel;
  distribution: RiskDistribution;
  categorySummaries: CategorySummary[];
  topPriorities: ClauseFinding[]; // top 3-5
  wordCount: number;
  warnings: string[]; // non-fatal issues surfaced to the user (e.g. "short document")
}

export interface AnalyzeErrorResponse {
  error: string;
  code:
    | "UNSUPPORTED_FILE"
    | "FILE_TOO_LARGE"
    | "EMPTY_DOCUMENT"
    | "EXTRACTION_FAILED"
    | "CORRUPTED_FILE"
    | "ANALYSIS_FAILED"
    | "SERVER_ERROR";
  detail?: string;
}
// Final repository verification marker.
