import type { Rule } from "@/types";

export const penaltiesRules: Rule[] = [
  {
    id: "PENALTY_LATE_FEES",
    category: "Penalties / Fees",
    severity: "low",
    baseScore: 8,
    description: "Late payment fees or interest",
    positiveSignals: [
      "late fee",
      "interest at a rate of",
      "past due amounts shall accrue interest",
    ],
    mitigatingSignals: ["reasonable late fee", "1.5% per month", "1% per month"],
    explanationTemplate:
      "The contract specifies a fee or interest charge for late payments.",
    whyItMattersTemplate:
      "Late fees are common, but it's worth confirming the rate is reasonable and clearly capped.",
    suggestedAction: "Check the late fee rate and confirm there's a reasonable cap on how much it can accumulate.",
  },
  {
    id: "PENALTY_CANCELLATION_FEE",
    category: "Penalties / Fees",
    severity: "medium",
    baseScore: 14,
    description: "Cancellation or early-exit fee",
    positiveSignals: [
      "cancellation fee",
      "early termination fee",
      "shall pay a penalty of",
    ],
    mitigatingSignals: ["reasonable cancellation fee", "prorated"],
    explanationTemplate:
      "There's a fee associated with cancelling or exiting the agreement early.",
    whyItMattersTemplate:
      "Cancellation fees affect how costly it would be to change your mind or end the relationship if things don't work out.",
    suggestedAction: "Ask exactly how the cancellation fee is calculated, and whether it can be prorated or capped.",
  },
  {
    id: "PENALTY_UNEXPECTED_CHARGES",
    category: "Penalties / Fees",
    severity: "medium",
    baseScore: 12,
    description: "Open-ended or unexpected additional charges",
    positiveSignals: [
      "additional fees may apply",
      "at then-current rates",
      "subject to change without notice",
      "other charges as determined by",
    ],
    mitigatingSignals: ["with 30 days advance written notice", "fees are fixed for the term"],
    explanationTemplate:
      "The contract allows for additional charges that aren't fully specified up front, or that could change without much notice.",
    whyItMattersTemplate:
      "Open-ended fee language can lead to costs that are hard to predict or budget for.",
    suggestedAction: "Ask for a complete list of potential fees and reasonable advance notice before any fee changes take effect.",
  },
];
