import type { Rule } from "@/types";

export const disputesRules: Rule[] = [
  {
    id: "DISPUTE_MANDATORY_ARBITRATION",
    category: "Dispute Resolution",
    severity: "medium",
    baseScore: 14,
    description: "Mandatory binding arbitration",
    positiveSignals: [
      "binding arbitration",
      "shall be resolved exclusively through arbitration",
      "waive the right to a jury trial",
      "waive any right to bring a class action",
    ],
    mitigatingSignals: ["either party may elect", "small claims court is excluded from this provision"],
    explanationTemplate:
      "Disputes may need to go through private arbitration instead of court, and you may be giving up the right to a jury trial or class action.",
    whyItMattersTemplate:
      "Arbitration can be faster and more private, but it also limits some legal options and appeal rights compared to court.",
    suggestedAction: "Consider asking whether small claims court is preserved as an option, and understand who selects and pays the arbitrator.",
  },
  {
    id: "DISPUTE_INCONVENIENT_VENUE",
    category: "Dispute Resolution",
    severity: "medium",
    baseScore: 12,
    description: "Distant or inconvenient jurisdiction/venue",
    positiveSignals: [
      "exclusive jurisdiction and venue",
      "governed by the laws of the state of",
      "venue shall lie exclusively in",
    ],
    explanationTemplate:
      "The contract specifies a particular location and legal jurisdiction for handling disputes, which may be far from you.",
    whyItMattersTemplate:
      "If a dispute arises, needing to travel to or engage counsel in a distant jurisdiction can add significant cost and inconvenience.",
    suggestedAction: "Check where the specified venue/jurisdiction is located relative to you, and ask if a more neutral or local venue is possible.",
  },
];
// Final repository verification marker.
