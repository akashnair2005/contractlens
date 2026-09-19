"use client";

import { useMemo, useState } from "react";
import Link from "next/link";
import { NavBar } from "@/components/ui/NavBar";
import { Footer } from "@/components/ui/Footer";
import { Card } from "@/components/ui/Card";
import { DisclaimerBanner } from "@/components/ui/DisclaimerBanner";
import { RiskScoreGauge } from "@/components/dashboard/RiskScoreGauge";
import { RiskDistribution } from "@/components/dashboard/RiskDistribution";
import { CategoryBreakdown } from "@/components/dashboard/CategoryBreakdown";
import { ClauseCard } from "@/components/dashboard/ClauseCard";
import { DashboardStat } from "@/components/dashboard/DashboardStat";
import { SearchAndFilterBar } from "@/components/dashboard/SearchAndFilterBar";
import { EmptyDashboardState } from "@/components/dashboard/EmptyDashboardState";
import { LinkButton } from "@/components/ui/Button";
import { useAnalysisResult } from "@/lib/use-analysis-result";
import type { RiskCategory, RiskLevel } from "@/types";

export default function DashboardPage() {
  const result = useAnalysisResult();
  const [query, setQuery] = useState("");
  const [activeCategory, setActiveCategory] = useState<RiskCategory | "all">("all");
  const [activeLevel, setActiveLevel] = useState<RiskLevel | "all">("all");

  const categories = useMemo(
    () => (result ? result.categorySummaries.map((c) => c.category) : []),
    [result]
  );

  const filteredFindings = useMemo(() => {
    if (!result) return [];
    return result.findings
      .filter((f) => activeCategory === "all" || f.category === activeCategory)
      .filter((f) => activeLevel === "all" || f.riskLevel === activeLevel)
      .filter((f) => {
        if (!query.trim()) return true;
        const q = query.toLowerCase();
        return (
          f.originalClause.toLowerCase().includes(q) ||
          f.whatItSays.toLowerCase().includes(q) ||
          f.category.toLowerCase().includes(q) ||
          f.whatItMeans.toLowerCase().includes(q)
        );
      })
      .sort((a, b) => b.score - a.score);
  }, [result, query, activeCategory, activeLevel]);

  if (result === null) {
    return (
      <div className="flex flex-col flex-1">
        <NavBar />
        <main className="flex-1 bg-[var(--cl-bg)]">
          <div className="mx-auto max-w-2xl px-5 sm:px-8 py-16">
            <EmptyDashboardState />
          </div>
        </main>
        <Footer />
      </div>
    );
  }

  return (
    <div className="flex flex-col flex-1">
      <NavBar />
      <main className="flex-1 bg-[var(--cl-bg)]">
        <div className="mx-auto max-w-6xl px-5 sm:px-8 py-10 sm:py-14">
            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
              <div>
                <p className="text-sm text-slate-500">{result.contractName}</p>
                <h1 className="text-2xl sm:text-3xl font-semibold tracking-tight text-[var(--cl-navy)] mt-0.5">
                  Risk dashboard
                </h1>
              </div>
              <div className="flex gap-3">
                <LinkButton href="/contract" variant="outline">
                  Open contract viewer
                </LinkButton>
                <LinkButton href="/report" variant="secondary">
                  View report
                </LinkButton>
              </div>
            </div>

            {result.warnings.length > 0 && (
              <div className="mt-5 rounded-lg border border-amber-200 bg-[var(--cl-medium-soft)] px-4 py-3 text-sm text-amber-800">
                {result.warnings.join(" ")}
              </div>
            )}

            <div className="mt-8 grid lg:grid-cols-3 gap-6">
              <Card className="p-6 lg:col-span-1">
                <RiskScoreGauge score={result.overallScore} level={result.overallLevel} />
                <div className="mt-6 grid grid-cols-3 gap-4 pt-6 border-t border-[var(--cl-border)]">
                  <DashboardStat label="Clauses" value={result.clauses.length} />
                  <DashboardStat label="Flagged" value={result.findings.length} />
                  <DashboardStat label="Words" value={result.wordCount.toLocaleString()} />
                </div>
              </Card>

              <Card className="p-6 lg:col-span-1">
                <h2 className="text-sm font-semibold text-[var(--cl-navy)] mb-4">
                  Risk distribution
                </h2>
                <RiskDistribution distribution={result.distribution} />
              </Card>

              <Card className="p-6 lg:col-span-1">
                <h2 className="text-sm font-semibold text-[var(--cl-navy)] mb-2">
                  Category breakdown
                </h2>
                <CategoryBreakdown categories={result.categorySummaries} />
              </Card>
            </div>

            {result.topPriorities.length > 0 && (
              <div className="mt-10">
                <h2 className="text-lg font-semibold text-[var(--cl-navy)] mb-4">
                  Top priorities
                </h2>
                <div className="space-y-3">
                  {result.topPriorities.map((f, i) => (
                    <ClauseCard key={f.id} finding={f} rank={i + 1} />
                  ))}
                </div>
              </div>
            )}

            <div className="mt-10">
              <h2 className="text-lg font-semibold text-[var(--cl-navy)] mb-4">
                All flagged clauses
              </h2>
              <SearchAndFilterBar
                query={query}
                onQueryChange={setQuery}
                categories={categories}
                activeCategory={activeCategory}
                onCategoryChange={setActiveCategory}
                activeLevel={activeLevel}
                onLevelChange={setActiveLevel}
              />
              <div className="mt-5 space-y-3">
                {filteredFindings.length === 0 ? (
                  <Card className="p-8 text-center text-sm text-slate-500">
                    No clauses match your search or filters.
                  </Card>
                ) : (
                  filteredFindings.map((f) => <ClauseCard key={f.id} finding={f} />)
                )}
              </div>
            </div>

            <div className="mt-10">
              <DisclaimerBanner />
            </div>

            <p className="mt-6 text-sm text-slate-400">
              Want to analyze another document?{" "}
              <Link href="/upload" className="text-[var(--cl-accent)] hover:underline">
                Upload a new contract
              </Link>
              .
            </p>
        </div>
      </main>
      <Footer />
    </div>
  );
}
// Final repository verification marker.
