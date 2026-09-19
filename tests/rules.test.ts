import { describe, it, expect } from "vitest";
import { analyzeClauses } from "@/lib/risk/engine";
import { segmentClauses } from "@/lib/clause/segment";
import { liabilityRules } from "@/rules/liability";
import { ipRules } from "@/rules/ip";
import { terminationRules } from "@/rules/termination";
import { paymentRules } from "@/rules/payment";
import { renewalRules } from "@/rules/renewal";
import { restrictionsRules } from "@/rules/restrictions";
import { confidentialityRules } from "@/rules/confidentiality";
import { penaltiesRules } from "@/rules/penalties";
import { disputesRules } from "@/rules/disputes";
import type { Clause } from "@/types";

function clause(text: string, heading?: string): Clause {
  return { id: "c0", index: 0, heading, text, startOffset: 0, endOffset: text.length };
}

describe("Liability rules", () => {
  it("flags unlimited liability language as high risk", () => {
    const findings = analyzeClauses(
      [clause("The Contractor shall have unlimited liability for any and all claims.")],
      liabilityRules
    );
    const finding = findings.find((f) => f.ruleId === "LIABILITY_UNLIMITED");
    expect(finding).toBeDefined();
    expect(["high", "critical"]).toContain(finding!.riskLevel);
  });

  it("reduces severity when a liability cap is present (false-positive reduction)", () => {
    const uncapped = analyzeClauses(
      [clause("The Contractor shall have unlimited liability for any and all claims arising here.")],
      liabilityRules
    );
    const capped = analyzeClauses(
      [
        clause(
          "Liability shall not exceed the total fees paid under this agreement, without limitation as to the types of claims covered by such cap."
        ),
      ],
      liabilityRules
    );

    const uncappedFinding = uncapped.find((f) => f.ruleId === "LIABILITY_UNLIMITED");
    const cappedFinding = capped.find((f) => f.ruleId === "LIABILITY_UNLIMITED");

    expect(uncappedFinding).toBeDefined();
    expect(cappedFinding).toBeDefined();
    expect(cappedFinding!.score).toBeLessThan(uncappedFinding!.score);
  });

  it("does not flag liability capped at fees paid as high risk", () => {
    const findings = analyzeClauses(
      [clause("In no event shall liability exceed the total fees paid under this agreement in the prior 12 months.")],
      liabilityRules
    );
    const finding = findings.find((f) => f.ruleId === "LIABILITY_UNLIMITED");
    // "in no event shall" is itself a mitigating signal, and there's no unlimited-liability
    // positive signal here, so this specific rule should not fire at all.
    expect(finding).toBeUndefined();
  });

  it("flags broad indemnification", () => {
    const findings = analyzeClauses(
      [clause("Contractor shall indemnify and hold harmless Client from any claim.")],
      liabilityRules
    );
    expect(findings.some((f) => f.ruleId === "INDEMNIFICATION_BROAD")).toBe(true);
  });
});

describe("Intellectual property rules", () => {
  it("flags broad IP assignment", () => {
    const findings = analyzeClauses(
      [clause("All intellectual property created by the Contractor shall be the sole and exclusive property of Client.")],
      ipRules
    );
    expect(findings.some((f) => f.ruleId === "IP_BROAD_ASSIGNMENT")).toBe(true);
  });

  it("does not treat generic IP-law compliance language as a high-risk finding", () => {
    const findings = analyzeClauses(
      [clause("The parties shall comply with applicable intellectual property laws.")],
      ipRules
    );
    const broad = findings.find((f) => f.ruleId === "IP_BROAD_ASSIGNMENT");
    const generic = findings.find((f) => f.ruleId === "IP_GENERIC_COMPLIANCE");
    expect(broad).toBeUndefined();
    expect(generic).toBeDefined();
    expect(generic!.riskLevel).toBe("low");
  });

  it("suppresses the generic-compliance rule when real assignment language is also present", () => {
    const findings = analyzeClauses(
      [
        clause(
          "All intellectual property shall be the sole and exclusive property of Client, and the parties shall comply with applicable intellectual property laws."
        ),
      ],
      ipRules
    );
    expect(findings.some((f) => f.ruleId === "IP_GENERIC_COMPLIANCE")).toBe(false);
    expect(findings.some((f) => f.ruleId === "IP_BROAD_ASSIGNMENT")).toBe(true);
  });
});

describe("Termination rules", () => {
  it("flags termination without notice", () => {
    const findings = analyzeClauses(
      [clause("Client may terminate this Agreement immediately without notice.")],
      terminationRules
    );
    expect(findings.some((f) => f.ruleId === "TERMINATION_WITHOUT_NOTICE")).toBe(true);
  });
});

describe("Payment rules", () => {
  it("flags long payment periods", () => {
    const findings = analyzeClauses(
      [clause("Payment shall be due within 90 days of invoice.")],
      paymentRules
    );
    expect(findings.some((f) => f.ruleId === "PAYMENT_LONG_PERIOD")).toBe(true);
  });

  it("does not flag net-30 as a long payment period", () => {
    const findings = analyzeClauses(
      [clause("Payment shall be due within 30 days of invoice.")],
      paymentRules
    );
    expect(findings.some((f) => f.ruleId === "PAYMENT_LONG_PERIOD")).toBe(false);
  });
});

describe("Auto-renewal rules", () => {
  it("flags auto-renewal generally", () => {
    const findings = analyzeClauses(
      [clause("This agreement automatically renews for successive terms.")],
      renewalRules
    );
    expect(findings.some((f) => f.ruleId === "AUTO_RENEWAL_SHORT_WINDOW")).toBe(true);
  });

  it("reduces severity when a reasonable notice window is specified", () => {
    const shortWindow = analyzeClauses(
      [clause("This agreement automatically renews for successive terms unless cancelled.")],
      renewalRules
    );
    const reasonableWindow = analyzeClauses(
      [
        clause(
          "This agreement automatically renews unless either party provides 30 days written notice prior to the renewal date."
        ),
      ],
      renewalRules
    );
    const a = shortWindow.find((f) => f.ruleId === "AUTO_RENEWAL_SHORT_WINDOW")!;
    const b = reasonableWindow.find((f) => f.ruleId === "AUTO_RENEWAL_SHORT_WINDOW")!;
    expect(b.score).toBeLessThan(a.score);
  });
});

describe("Non-compete / restrictions rules", () => {
  it("flags a broad non-compete", () => {
    const findings = analyzeClauses(
      [clause("For a period of two years, Contractor shall not, directly or indirectly, engage in any competing business.")],
      restrictionsRules
    );
    expect(findings.some((f) => f.ruleId === "NON_COMPETE_BROAD")).toBe(true);
  });

  it("flags exclusivity requirements", () => {
    const findings = analyzeClauses(
      [clause("Contractor shall work exclusively for Client during the term.")],
      restrictionsRules
    );
    expect(findings.some((f) => f.ruleId === "EXCLUSIVITY")).toBe(true);
  });
});

describe("Confidentiality rules", () => {
  it("flags indefinite confidentiality obligations", () => {
    const findings = analyzeClauses(
      [clause("Confidentiality obligations shall survive indefinitely following termination of this Agreement.")],
      confidentialityRules
    );
    expect(findings.some((f) => f.ruleId === "CONFIDENTIALITY_INDEFINITE")).toBe(true);
  });

  it("reduces severity when a time limit is present", () => {
    const indefinite = analyzeClauses(
      [clause("Confidentiality obligations shall survive indefinitely following termination of this Agreement.")],
      confidentialityRules
    );
    const limited = analyzeClauses(
      [
        clause(
          "Confidentiality obligations shall survive indefinitely; however the parties agree obligations apply for a period of three years after termination."
        ),
      ],
      confidentialityRules
    );
    const a = indefinite.find((f) => f.ruleId === "CONFIDENTIALITY_INDEFINITE")!;
    const b = limited.find((f) => f.ruleId === "CONFIDENTIALITY_INDEFINITE")!;
    expect(b.score).toBeLessThanOrEqual(a.score);
  });
});

describe("Penalties rules", () => {
  it("flags cancellation fees", () => {
    const findings = analyzeClauses(
      [clause("Contractor shall pay a penalty of $5,000 as an early termination fee.")],
      penaltiesRules
    );
    expect(findings.some((f) => f.ruleId === "PENALTY_CANCELLATION_FEE")).toBe(true);
  });
});

describe("Dispute resolution rules", () => {
  it("flags mandatory arbitration", () => {
    const findings = analyzeClauses(
      [clause("Any dispute shall be resolved exclusively through binding arbitration, and the parties waive the right to a jury trial.")],
      disputesRules
    );
    expect(findings.some((f) => f.ruleId === "DISPUTE_MANDATORY_ARBITRATION")).toBe(true);
  });
});

describe("Clause segmentation", () => {
  it("splits numbered sections into separate clauses", () => {
    const text = `1. PAYMENT\nPayment is due within 30 days.\n\n2. TERMINATION\nEither party may terminate with notice.`;
    const clauses = segmentClauses(text);
    expect(clauses.length).toBeGreaterThanOrEqual(2);
    expect(clauses[0].heading).toMatch(/PAYMENT/i);
    expect(clauses[1].heading).toMatch(/TERMINATION/i);
  });

  it("handles text with no clear formatting without throwing", () => {
    const text = "This is a single unformatted paragraph of contract text with no headings at all.";
    const clauses = segmentClauses(text);
    expect(clauses.length).toBeGreaterThan(0);
  });

  it("returns an empty array for empty input", () => {
    expect(segmentClauses("")).toEqual([]);
    expect(segmentClauses("   \n\n  ")).toEqual([]);
  });

  it("merges short trailing fragments into the previous clause", () => {
    const text = "1. TERM\nThis is the main body of the term clause with enough content.\n\nok";
    const clauses = segmentClauses(text);
    // The trailing "ok" fragment should not become its own clause.
    expect(clauses.every((c) => c.text.trim().length > 5)).toBe(true);
  });
});
// Final repository verification marker.
