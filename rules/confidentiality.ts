import type { Rule } from "@/types";

export const confidentialityRules: Rule[] = [
  {
    id: "CONFIDENTIALITY_INDEFINITE",
    category: "Confidentiality",
    severity: "medium",
    baseScore: 14,
    description: "Indefinite confidentiality obligation",
    positiveSignals: [
      "shall remain confidential in perpetuity",
      "confidentiality obligations shall survive indefinitely",
      "no time limit on confidentiality",
      "obligations under this section shall survive termination indefinitely",
    ],
    mitigatingSignals: ["for a period of", "for two years following", "for three years after termination"],
    explanationTemplate:
      "Confidentiality obligations appear to continue indefinitely, with no end date.",
    whyItMattersTemplate:
      "Open-ended confidentiality obligations can be hard to track and comply with over the long term, especially for general knowledge or skills.",
    suggestedAction: "Ask whether confidentiality obligations can be limited to a defined period, such as 2-5 years after the relationship ends.",
  },
  {
    id: "CONFIDENTIALITY_OVERBROAD_DEFINITION",
    category: "Confidentiality",
    severity: "medium",
    baseScore: 12,
    description: "Overly broad definition of confidential information",
    positiveSignals: [
      "any and all information disclosed",
      "all information, whether oral or written",
      "regardless of whether marked confidential",
      "any information relating to the business",
    ],
    mitigatingSignals: ["excludes publicly available information", "excludes information already known", "does not include information that"],
    explanationTemplate:
      "The definition of confidential information appears broad and may not exclude information that's already public or independently known.",
    whyItMattersTemplate:
      "An overly broad definition can make it difficult to know what you're actually allowed to discuss or reuse.",
    suggestedAction: "Ask for standard carve-outs: information that's public, already known, or independently developed shouldn't count as confidential.",
  },
];
