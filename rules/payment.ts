import type { Rule } from "@/types";

export const paymentRules: Rule[] = [
  {
    id: "PAYMENT_LONG_PERIOD",
    category: "Payment",
    severity: "medium",
    baseScore: 14,
    description: "Long payment period",
    positiveSignals: [
      "net 90",
      "net 60",
      "within 90 days",
      "within 60 days",
      "payment due within 90",
    ],
    mitigatingSignals: ["net 15", "net 30", "within 15 days", "within 30 days"],
    explanationTemplate:
      "Payment isn't due until a long period after invoicing or delivery.",
    whyItMattersTemplate:
      "Long payment windows can create cash-flow strain, especially for freelancers or small businesses.",
    suggestedAction: "Ask whether payment terms can be shortened, such as to net 30, or whether partial upfront payment is possible.",
  },
  {
    id: "PAYMENT_CONDITIONAL_APPROVAL",
    category: "Payment",
    severity: "medium",
    baseScore: 16,
    description: "Payment conditional on subjective approval",
    positiveSignals: [
      "subject to client's approval",
      "payment contingent upon acceptance",
      "in client's sole discretion",
      "upon satisfactory completion as determined by",
    ],
    mitigatingSignals: ["approval shall not be unreasonably withheld", "objective acceptance criteria"],
    explanationTemplate:
      "Payment may depend on a subjective approval step rather than clearly defined, objective criteria.",
    whyItMattersTemplate:
      "Subjective approval requirements can be used to delay or withhold payment even when work meets a reasonable standard.",
    suggestedAction: "Ask for objective, written acceptance criteria and a defined review period, plus language that approval won't be unreasonably withheld.",
  },
  {
    id: "PAYMENT_UNCLEAR_TERMS",
    category: "Payment",
    severity: "low",
    baseScore: 8,
    description: "Vague or unclear payment terms",
    positiveSignals: [
      "payment terms to be determined",
      "as otherwise agreed",
      "reasonable compensation",
      "fees to be discussed",
    ],
    explanationTemplate:
      "Payment amounts, timing, or method are not clearly specified.",
    whyItMattersTemplate:
      "Vague payment terms can lead to disputes later about how much is owed and when.",
    suggestedAction: "Ask for specific payment amounts, due dates, and accepted payment methods in writing.",
  },
];
