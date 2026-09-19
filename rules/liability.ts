import type { Rule } from "@/types";

export const liabilityRules: Rule[] = [
  {
    id: "LIABILITY_UNLIMITED",
    category: "Liability",
    severity: "high",
    baseScore: 26,
    description: "Unlimited liability language",
    positiveSignals: [
      "unlimited liability",
      "without limitation",
      "any and all claims",
      "any and all damages",
      "no limitation on liability",
      "not be limited",
    ],
    mitigatingSignals: [
      "shall not exceed",
      "limited to",
      "liability cap",
      "maximum liability",
      "limitation of liability",
      "in no event shall",
      "aggregate liability",
    ],
    explanationTemplate:
      "This language may expose a party to liability without a clearly defined monetary cap.",
    whyItMattersTemplate:
      "Without a cap, a single dispute could create financial exposure well beyond the value of the contract itself.",
    suggestedAction: "Ask whether a reasonable liability cap can be added, such as capping liability at the fees paid under the agreement.",
  },
  {
    id: "INDEMNIFICATION_BROAD",
    category: "Liability",
    severity: "high",
    baseScore: 22,
    description: "Broad indemnification obligation",
    positiveSignals: [
      "indemnify and hold harmless",
      "shall indemnify",
      "defend, indemnify",
      "hold harmless from any and all",
    ],
    mitigatingSignals: [
      "solely caused by",
      "to the extent caused by",
      "arising from gross negligence",
      "mutual indemnification",
    ],
    explanationTemplate:
      "This clause may require one party to cover the other party's losses, legal costs, or claims — potentially even for issues outside their direct control.",
    whyItMattersTemplate:
      "Broad, one-sided indemnification can shift significant financial risk onto you, sometimes for outcomes you can't reasonably control.",
    suggestedAction: "Consider asking whether indemnification can be mutual and limited to claims directly caused by that party's own actions.",
  },
  {
    id: "LIABILITY_CONSEQUENTIAL_INCLUDED",
    category: "Liability",
    severity: "medium",
    baseScore: 14,
    description: "Consequential/indirect damages not excluded",
    positiveSignals: [
      "consequential damages",
      "indirect damages",
      "lost profits",
      "special damages",
    ],
    mitigatingSignals: [
      "excludes consequential",
      "shall not be liable for consequential",
      "no party shall be liable for indirect",
      "waives any claim for consequential",
    ],
    suppressingSignals: [
      "shall not be liable for consequential",
      "excludes consequential",
      "waives any claim for consequential",
    ],
    explanationTemplate:
      "The clause references consequential or indirect damages (like lost profits) without clearly excluding them.",
    whyItMattersTemplate:
      "Indirect damages can be difficult to predict and, if not excluded, can significantly increase potential exposure.",
    suggestedAction: "Consider asking whether both parties can mutually exclude liability for consequential or indirect damages.",
  },
];
// Final repository verification marker.
