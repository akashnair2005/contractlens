"use client";

import Link from "next/link";
import { EmptyDashboardState } from "@/components/dashboard/EmptyDashboardState";
import { RiskBadge } from "@/components/ui/RiskBadge";
import { Button, LinkButton } from "@/components/ui/Button";
import { useAnalysisResult } from "@/lib/use-analysis-result";
import type { AnalysisResult } from "@/types";

export default function ReportPage() {
  const result = useAnalysisResult();

  if (result === null) {
    return (
      <div className="mx-auto max-w-2xl px-5 sm:px-8 py-14">
        <EmptyDashboardState />
      </div>
    );
  }

  const downloadText = () => {
    const blob = new Blob([buildTextReport(result)], { type: "text/plain;charset=utf-8" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `${sanitizeFileName(result.contractName)}-contractlens-report.txt`;
    a.click();
    URL.revokeObjectURL(url);
  };

  return (
    <div className="mx-auto max-w-3xl px-5 sm:px-8 py-10">
      <div className="no-print flex items-center justify-between mb-8">
        <Link href="/dashboard" className="text-sm text-slate-500 hover:text-[var(--cl-navy)]">
          &larr; Back to dashboard
        </Link>
        <div className="flex gap-3">
          <Button variant="outline" onClick={downloadText}>
            Download as text
          </Button>
          <Button variant="secondary" onClick={() => window.print()}>
            Print / save as PDF
          </Button>
        </div>
      </div>

      <header className="border-b border-[var(--cl-border)] pb-6 mb-8">
        <p className="text-sm text-[var(--cl-teal)] font-medium">ContractLens report</p>
        <h1 className="mt-1 text-2xl font-semibold text-[var(--cl-navy)]">{result.contractName}</h1>
        <p className="mt-1 text-sm text-slate-500">
          Generated {new Date(result.createdAt).toLocaleString()}
        </p>
      </header>

      <section className="mb-8">
        <div className="flex items-center gap-4">
          <div className="text-4xl font-semibold text-[var(--cl-navy)]">
            {result.overallScore}
            <span className="text-lg text-slate-400">/100</span>
          </div>
          <RiskBadge level={result.overallLevel} />
        </div>
        <div className="mt-4 grid grid-cols-4 gap-4 text-sm">
          <Stat label="Critical" value={result.distribution.critical} />
          <Stat label="High" value={result.distribution.high} />
          <Stat label="Medium" value={result.distribution.medium} />
          <Stat label="Low" value={result.distribution.low} />
        </div>
      </section>

      <section className="mb-8">
        <h2 className="text-sm font-semibold text-[var(--cl-navy)] uppercase tracking-wide mb-3">
          Category breakdown
        </h2>
        <table className="w-full text-sm">
          <tbody>
            {result.categorySummaries.map((c) => (
              <tr key={c.category} className="border-b border-slate-100">
                <td className="py-2 text-slate-700">{c.category}</td>
                <td className="py-2 text-right">
                  <RiskBadge level={c.riskLevel} size="sm" />
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </section>

      <section className="mb-8">
        <h2 className="text-sm font-semibold text-[var(--cl-navy)] uppercase tracking-wide mb-3">
          Top concerns
        </h2>
        <div className="space-y-5">
          {result.topPriorities.map((f, i) => (
            <div key={f.id} className="break-inside-avoid">
              <div className="flex items-center gap-2 text-sm">
                <span className="font-semibold text-slate-400">{String(i + 1).padStart(2, "0")}</span>
                <span className="font-medium text-[var(--cl-navy)]">{f.whatItSays}</span>
                <RiskBadge level={f.riskLevel} size="sm" />
              </div>
              <blockquote className="mt-2 text-xs text-slate-600 border-l-2 border-slate-200 pl-3 leading-relaxed whitespace-pre-line">
                {f.originalClause}
              </blockquote>
              <p className="mt-2 text-sm text-slate-700">
                <strong className="font-medium">What it means: </strong>
                {f.whatItMeans}
              </p>
              <p className="mt-1 text-sm text-slate-700">
                <strong className="font-medium">Consider asking: </strong>
                {f.suggestedAction}
              </p>
            </div>
          ))}
        </div>
      </section>

      <footer className="mt-10 border-t border-[var(--cl-border)] pt-6 text-xs text-slate-500 leading-relaxed">
        <strong>Not legal advice.</strong> ContractLens provides informational
        contract analysis and is not a substitute for advice from a qualified
        legal professional. Detected concerns are potential areas for review
        and do not determine whether a contract is legally valid, enforceable,
        or appropriate for your situation.
      </footer>

      <div className="no-print mt-8">
        <LinkButton href="/dashboard" variant="ghost">
          Back to dashboard
        </LinkButton>
      </div>
    </div>
  );
}

function Stat({ label, value }: { label: string; value: number }) {
  return (
    <div>
      <p className="text-slate-500">{label}</p>
      <p className="text-lg font-semibold text-[var(--cl-navy)]">{value}</p>
    </div>
  );
}

function sanitizeFileName(name: string): string {
  return name.replace(/\.[^/.]+$/, "").replace(/[^a-z0-9\-_]+/gi, "-").toLowerCase();
}

function buildTextReport(result: AnalysisResult): string {
  const lines: string[] = [];
  lines.push("CONTRACTLENS REPORT");
  lines.push(`Contract: ${result.contractName}`);
  lines.push(`Generated: ${new Date(result.createdAt).toLocaleString()}`);
  lines.push("");
  lines.push(`Overall risk score: ${result.overallScore}/100 (${result.overallLevel.toUpperCase()})`);
  lines.push(
    `Distribution: Critical ${result.distribution.critical}, High ${result.distribution.high}, Medium ${result.distribution.medium}, Low ${result.distribution.low}`
  );
  lines.push("");
  lines.push("CATEGORY BREAKDOWN");
  for (const c of result.categorySummaries) {
    lines.push(`  - ${c.category}: ${c.riskLevel.toUpperCase()} (${c.findingCount} flagged)`);
  }
  lines.push("");
  lines.push("TOP CONCERNS");
  result.topPriorities.forEach((f, i) => {
    lines.push(`${i + 1}. [${f.riskLevel.toUpperCase()}] ${f.category} — ${f.whatItSays}`);
    lines.push(`   Clause: ${f.originalClause.replace(/\s+/g, " ").trim()}`);
    lines.push(`   What it means: ${f.whatItMeans}`);
    lines.push(`   Why it matters: ${f.whyItMatters}`);
    lines.push(`   Consider asking: ${f.suggestedAction}`);
    lines.push("");
  });
  lines.push(
    "Not legal advice. ContractLens provides informational contract analysis and is not a substitute for advice from a qualified legal professional."
  );
  return lines.join("\n");
}
// Final repository verification marker.
