"use client";

import Link from "next/link";
import type { AnalysisResult, RiskLevel } from "@/types";

const LEVEL_STYLE: Record<RiskLevel, { bg: string; border: string }> = {
  low: { bg: "var(--cl-low-soft)", border: "#bbf7d0" },
  medium: { bg: "var(--cl-medium-soft)", border: "#fde68a" },
  high: { bg: "var(--cl-high-soft)", border: "#fecaca" },
  critical: { bg: "#fee2e2", border: "#fca5a5" },
};

const LEVEL_RANK: Record<RiskLevel, number> = { critical: 3, high: 2, medium: 1, low: 0 };

export function ContractViewer({ result }: { result: AnalysisResult }) {
  const findingsByClause = new Map<string, AnalysisResult["findings"]>();
  for (const f of result.findings) {
    const list = findingsByClause.get(f.clauseId) ?? [];
    list.push(f);
    findingsByClause.set(f.clauseId, list);
  }

  return (
    <div className="rounded-xl border border-[var(--cl-border)] bg-white p-6 sm:p-10">
      {result.clauses.map((clause) => {
        const findings = (findingsByClause.get(clause.id) ?? []).sort(
          (a, b) => LEVEL_RANK[b.riskLevel] - LEVEL_RANK[a.riskLevel]
        );
        const topFinding = findings[0];

        if (!topFinding) {
          return (
            <div key={clause.id} id={clause.id} className="mb-5 scroll-mt-24">
              {clause.heading && (
                <p className="font-semibold text-[var(--cl-navy)] mb-1.5">{clause.heading}</p>
              )}
              <p className="text-sm text-slate-600 leading-relaxed whitespace-pre-line">
                {clause.heading ? stripHeading(clause.text, clause.heading) : clause.text}
              </p>
            </div>
          );
        }

        const style = LEVEL_STYLE[topFinding.riskLevel];
        return (
          <div key={clause.id} id={clause.id} className="mb-5 scroll-mt-24">
            {clause.heading && (
              <p className="font-semibold text-[var(--cl-navy)] mb-1.5">{clause.heading}</p>
            )}
            <Link
              href={`/clause/${topFinding.id}`}
              className="block rounded-md px-3 py-2.5 text-sm leading-relaxed whitespace-pre-line border transition-shadow hover:shadow-sm"
              style={{ background: style.bg, borderColor: style.border }}
            >
              {clause.heading ? stripHeading(clause.text, clause.heading) : clause.text}
              {findings.length > 1 && (
                <span className="block mt-1.5 text-xs text-slate-500">
                  +{findings.length - 1} more {findings.length - 1 === 1 ? "concern" : "concerns"} in this clause
                </span>
              )}
            </Link>
          </div>
        );
      })}
    </div>
  );
}

function stripHeading(text: string, heading: string): string {
  if (text.startsWith(heading)) {
    return text.slice(heading.length).trim();
  }
  return text;
}
