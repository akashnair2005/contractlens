import type { Rule } from "@/types";

export const terminationRules: Rule[] = [
  {
    id: "TERMINATION_WITHOUT_NOTICE",
    category: "Termination",
    severity: "high",
    baseScore: 20,
    description: "Termination without notice",
    positiveSignals: [
      "terminate immediately without notice",
      "terminate this agreement without notice",
      "immediately without notice",
      "without prior notice",
      "with immediate effect",
    ],
    mitigatingSignals: ["only for cause", "material breach that remains uncured", "written notice of"],
    explanationTemplate:
      "This clause may allow the agreement to be ended immediately, without advance warning.",
    whyItMattersTemplate:
      "No-notice termination can leave you little time to plan for lost income, transition work, or find alternatives.",
    suggestedAction: "Ask whether a minimum notice period (e.g. 15-30 days) can be added, at least for termination without cause.",
  },
  {
    id: "TERMINATION_SOLE_DISCRETION",
    category: "Termination",
    severity: "medium",
    baseScore: 16,
    description: "Unilateral termination at sole discretion",
    positiveSignals: [
      "at its sole discretion",
      "for any reason or no reason",
      "may terminate at any time for any reason",
      "sole and absolute discretion",
    ],
    mitigatingSignals: ["with reasonable notice", "upon 30 days", "upon written notice of"],
    explanationTemplate:
      "One party may be able to end the agreement at any time, for any reason, without needing to show cause.",
    whyItMattersTemplate:
      "One-sided termination rights can create uncertainty, especially if you're relying on this agreement for ongoing income or deliverables.",
    suggestedAction: "Consider asking whether termination rights can be made mutual and tied to a reasonable notice period.",
  },
  {
    id: "TERMINATION_DIFFICULT_EXIT",
    category: "Termination",
    severity: "medium",
    baseScore: 12,
    description: "Difficult conditions to exit the agreement",
    positiveSignals: [
      "may not terminate this agreement except",
      "early termination fee",
      "non-cancellable",
      "irrevocable commitment",
    ],
    explanationTemplate:
      "The contract appears to make it difficult or costly for you to exit before the term ends.",
    whyItMattersTemplate:
      "Restrictive exit conditions can lock you into an agreement even if circumstances change.",
    suggestedAction: "Ask what it would take to exit early, and whether an early-termination fee could be capped or removed.",
  },
];
// Final repository verification marker.
