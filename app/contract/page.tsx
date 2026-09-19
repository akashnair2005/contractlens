"use client";

import Link from "next/link";
import { NavBar } from "@/components/ui/NavBar";
import { Footer } from "@/components/ui/Footer";
import { ContractViewer } from "@/components/contract/ContractViewer";
import { EmptyDashboardState } from "@/components/dashboard/EmptyDashboardState";
import { LinkButton } from "@/components/ui/Button";
import { useAnalysisResult } from "@/lib/use-analysis-result";

const LEGEND: { label: string; color: string }[] = [
  { label: "Critical", color: "#fca5a5" },
  { label: "High", color: "var(--cl-high-soft)" },
  { label: "Medium", color: "var(--cl-medium-soft)" },
  { label: "Low", color: "var(--cl-low-soft)" },
];

export default function ContractViewerPage() {
  const result = useAnalysisResult();

  return (
    <div className="flex flex-col flex-1">
      <NavBar />
      <main className="flex-1 bg-[var(--cl-bg)]">
        <div className="mx-auto max-w-3xl px-5 sm:px-8 py-10 sm:py-14">
          {result === null ? (
            <EmptyDashboardState />
          ) : (
            <>
              <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-6">
                <div>
                  <p className="text-sm text-slate-500">{result.contractName}</p>
                  <h1 className="text-2xl font-semibold tracking-tight text-[var(--cl-navy)] mt-0.5">
                    Contract viewer
                  </h1>
                </div>
                <LinkButton href="/dashboard" variant="outline">
                  Back to dashboard
                </LinkButton>
              </div>

              <div className="flex flex-wrap items-center gap-4 mb-5 text-xs text-slate-500">
                <span>Highlight legend:</span>
                {LEGEND.map((l) => (
                  <span key={l.label} className="flex items-center gap-1.5">
                    <span
                      className="inline-block h-2.5 w-2.5 rounded-sm border border-black/5"
                      style={{ background: l.color }}
                    />
                    {l.label}
                  </span>
                ))}
              </div>

              <ContractViewer result={result} />

              <p className="mt-6 text-sm text-slate-400">
                Click any highlighted clause to open its full analysis. See the{" "}
                <Link href="/dashboard" className="text-[var(--cl-accent)] hover:underline">
                  dashboard
                </Link>{" "}
                for a summary view.
              </p>
            </>
          )}
        </div>
      </main>
      <Footer />
    </div>
  );
}
// Final repository verification marker.
