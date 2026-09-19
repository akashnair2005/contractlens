import type { Rule } from "@/types";

export const restrictionsRules: Rule[] = [
  {
    id: "NON_COMPETE_BROAD",
    category: "Non-compete / Restrictions",
    severity: "high",
    baseScore: 22,
    description: "Broad non-compete restriction",
    positiveSignals: [
      "shall not engage in any competing business",
      "non-compete",
      "shall not, directly or indirectly, engage in",
      "for a period of.*years.*not compete",
    ],
    mitigatingSignals: ["limited to a", "within a radius of", "in the same specific market segment"],
    explanationTemplate:
      "This clause may restrict your ability to work in a competing business, potentially broadly in scope, geography, or duration.",
    whyItMattersTemplate:
      "Broad non-compete restrictions can significantly limit future income opportunities, and enforceability varies a lot by jurisdiction.",
    suggestedAction: "Ask about narrowing the restriction's scope, geography, and duration, or removing it if it isn't essential to the relationship.",
  },
  {
    id: "NON_SOLICITATION",
    category: "Non-compete / Restrictions",
    severity: "medium",
    baseScore: 12,
    description: "Non-solicitation restriction",
    positiveSignals: [
      "shall not solicit",
      "non-solicitation",
      "shall not hire or engage",
    ],
    explanationTemplate:
      "This clause may restrict you from soliciting the other party's clients or employees for a period of time.",
    whyItMattersTemplate:
      "Non-solicitation clauses are common but worth understanding clearly, especially their duration and scope.",
    suggestedAction: "Confirm the duration and exactly who is covered by the non-solicitation restriction.",
  },
  {
    id: "EXCLUSIVITY",
    category: "Non-compete / Restrictions",
    severity: "medium",
    baseScore: 14,
    description: "Exclusivity requirement",
    positiveSignals: [
      "exclusive basis",
      "shall work exclusively",
      "exclusive arrangement",
      "shall not provide similar services to any other",
    ],
    mitigatingSignals: ["except as otherwise agreed", "excluding existing clients"],
    explanationTemplate:
      "You may be required to work exclusively with this party, limiting your ability to take on other clients or projects.",
    whyItMattersTemplate:
      "Exclusivity requirements can significantly limit income diversification, especially for freelancers and contractors.",
    suggestedAction: "Ask whether exclusivity is necessary, or whether it can be limited to a specific scope, client list, or time period.",
  },
];
// Final repository verification marker.
