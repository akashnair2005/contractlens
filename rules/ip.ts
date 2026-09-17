import type { Rule } from "@/types";

export const ipRules: Rule[] = [
  {
    id: "IP_BROAD_ASSIGNMENT",
    category: "Intellectual Property",
    severity: "high",
    baseScore: 24,
    description: "Broad IP assignment / ownership transfer",
    positiveSignals: [
      "all intellectual property",
      "shall be the sole and exclusive property",
      "assigns all right, title, and interest",
      "work product shall belong to",
      "hereby assigns",
      "all right, title and interest",
    ],
    mitigatingSignals: [
      "pre-existing materials",
      "excluding pre-existing",
      "general-purpose tools",
      "background ip",
      "retains ownership of",
    ],
    explanationTemplate:
      "This language may give the other party broad ownership over work product created during the engagement, potentially including materials created before or outside the project.",
    whyItMattersTemplate:
      "Without carve-outs, you could unintentionally sign away rights to pre-existing tools, templates, or general-purpose code and materials you plan to reuse elsewhere.",
    suggestedAction: "Ask to clarify that pre-existing materials and general-purpose tools remain your property, with only the specific deliverables assigned.",
  },
  {
    id: "IP_PERPETUAL_RIGHTS",
    category: "Intellectual Property",
    severity: "medium",
    baseScore: 14,
    description: "Perpetual or irrevocable rights grant",
    positiveSignals: [
      "perpetual, irrevocable",
      "perpetual license",
      "irrevocable, worldwide",
      "in perpetuity",
    ],
    mitigatingSignals: ["limited to the term", "for the duration of this agreement"],
    explanationTemplate:
      "This clause grants rights that continue indefinitely, beyond the life of the project or relationship.",
    whyItMattersTemplate:
      "Perpetual, irrevocable grants mean the other party's rights don't end when the contract does, which can limit your future flexibility.",
    suggestedAction: "Consider asking whether the rights granted can be scoped to the project term rather than granted in perpetuity.",
  },
  {
    id: "IP_GENERIC_COMPLIANCE",
    category: "Intellectual Property",
    severity: "low",
    baseScore: 4,
    description: "Generic IP-law compliance language",
    positiveSignals: ["comply with applicable intellectual property laws", "in accordance with intellectual property law"],
    suppressingSignals: [
      "all intellectual property",
      "hereby assigns",
      "sole and exclusive property",
    ],
    explanationTemplate:
      "This is a general statement that the parties will follow applicable IP law, without transferring any specific rights.",
    whyItMattersTemplate:
      "Generic compliance language like this is standard and typically does not create meaningful additional exposure on its own.",
    suggestedAction: "Usually no action needed — this is boilerplate rather than a rights transfer.",
  },
];
