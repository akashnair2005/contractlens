import type { Rule } from "@/types";

export const renewalRules: Rule[] = [
  {
    id: "AUTO_RENEWAL_SHORT_WINDOW",
    category: "Auto-Renewal",
    severity: "high",
    baseScore: 18,
    description: "Automatic renewal with a short cancellation window",
    positiveSignals: [
      "automatically renew",
      "shall automatically renew",
      "auto-renew",
      "renews automatically",
    ],
    mitigatingSignals: [
      "unless either party provides 30 days",
      "unless either party provides 60 days",
      "30 days written notice",
      "60 days written notice",
      "90 days written notice",
    ],
    explanationTemplate:
      "This agreement automatically renews. If the cancellation notice window is short or the notice deadline is easy to miss, you could be locked in for another term unintentionally.",
    whyItMattersTemplate:
      "Auto-renewal clauses with tight notice windows are a common way people end up committed to terms they meant to cancel.",
    suggestedAction: "Confirm the exact notice period and deadline required to cancel, and consider setting a calendar reminder well before it.",
  },
  {
    id: "RENEWAL_RECURRING_COMMITMENT",
    category: "Auto-Renewal",
    severity: "low",
    baseScore: 6,
    description: "Recurring commitment language",
    positiveSignals: ["recurring commitment", "renews for successive terms", "successive one-year terms"],
    mitigatingSignals: ["either party may decline to renew", "opt-out"],
    explanationTemplate:
      "The agreement appears to renew for successive terms rather than ending automatically.",
    whyItMattersTemplate:
      "It's worth understanding how long each renewal term lasts, since that affects how long you'd be committed if you forget to cancel.",
    suggestedAction: "Confirm the length of each renewal term and how far in advance you'd need to act to opt out.",
  },
];
// Final repository verification marker.
