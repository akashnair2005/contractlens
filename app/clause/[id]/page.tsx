"use client";

import { use, useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { NavBar } from "@/components/ui/NavBar";
import { Footer } from "@/components/ui/Footer";
import { Card } from "@/components/ui/Card";
import { RiskBadge } from "@/components/ui/RiskBadge";
import { Button, LinkButton } from "@/components/ui/Button";
import { markFindingReviewed } from "@/lib/client-store";
import { useAnalysisResult } from "@/lib/use-analysis-result";

export default function ClauseDetailPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = use(params);
  const router = useRouter();
  const result = useAnalysisResult();
  const [copyState, setCopyState] = useState<"clause" | "question" | null>(null);

  if (result === null) {
    return (
      <Shell>
        <p className="text-slate-600">
          No analysis found in this session.{" "}
          <Link href="/upload" className="text-[var(--cl-accent)] hover:underline">
            Upload a contract
          </Link>{" "}
          to get started.
        </p>
      </Shell>
    );
  }

  const finding = result.findings.find((f) => f.id === id);
  if (!finding) {
    return (
      <Shell>
        <p className="text-slate-600">
          This clause couldn&apos;t be found.{" "}
          <Link href="/dashboard" className="text-[var(--cl-accent)] hover:underline">
            Back to dashboard
          </Link>
        </p>
      </Shell>
    );
  }

  const toggleReviewed = () => {
    markFindingReviewed(finding.id, !finding.reviewed);
  };

  const copy = async (text: string, which: "clause" | "question") => {
    try {
      await navigator.clipboard.writeText(text);
      setCopyState(which);
      setTimeout(() => setCopyState(null), 1600);
    } catch {
      // Clipboard may be unavailable; fail silently, the text remains visible/selectable.
    }
  };

  return (
    <Shell>
      <button
        onClick={() => router.back()}
        className="text-sm text-slate-500 hover:text-[var(--cl-navy)] flex items-center gap-1.5 mb-6"
      >
        <BackIcon /> Back
      </button>

      <div className="flex items-start justify-between gap-4 flex-wrap">
        <div>
          <p className="text-xs font-medium text-[var(--cl-teal)] uppercase tracking-wide">
            {finding.category}
          </p>
          <h1 className="mt-1 text-2xl font-semibold text-[var(--cl-navy)] tracking-tight">
            {finding.whatItSays}
          </h1>
        </div>
        <div className="flex items-center gap-3">
          <RiskBadge level={finding.riskLevel} />
          <span className="text-sm text-slate-500">Score: {finding.score}/100</span>
        </div>
      </div>

      <Card className="mt-6 p-6">
        <h2 className="text-sm font-semibold text-[var(--cl-navy)]">Original clause</h2>
        {finding.clauseHeading && (
          <p className="mt-1 text-xs text-slate-400">{finding.clauseHeading}</p>
        )}
        <blockquote className="mt-3 rounded-lg bg-slate-50 border-l-4 border-slate-300 px-4 py-3 text-sm text-slate-700 leading-relaxed whitespace-pre-line">
          {finding.originalClause}
        </blockquote>
        <button
          onClick={() => copy(finding.originalClause, "clause")}
          className="mt-3 text-sm text-[var(--cl-accent)] hover:underline"
        >
          {copyState === "clause" ? "Copied" : "Copy clause"}
        </button>
      </Card>

      <div className="mt-6 grid sm:grid-cols-2 gap-6">
        <Card className="p-6">
          <h2 className="text-sm font-semibold text-[var(--cl-navy)]">What it means</h2>
          <p className="mt-2 text-sm text-slate-600 leading-relaxed">{finding.whatItMeans}</p>
        </Card>
        <Card className="p-6">
          <h2 className="text-sm font-semibold text-[var(--cl-navy)]">Why it matters</h2>
          <p className="mt-2 text-sm text-slate-600 leading-relaxed">{finding.whyItMatters}</p>
        </Card>
      </div>

      <Card className="mt-6 p-6">
        <h2 className="text-sm font-semibold text-[var(--cl-navy)]">Detected signals</h2>
        <div className="mt-3 flex flex-wrap gap-2">
          {finding.detectedSignals.map((s) => (
            <span
              key={s}
              className="rounded-full bg-[var(--cl-high-soft)] text-[#7f1d1d] px-3 py-1 text-xs"
            >
              &ldquo;{s}&rdquo;
            </span>
          ))}
        </div>
        {finding.mitigatingSignalsFound.length > 0 && (
          <>
            <h3 className="mt-4 text-xs font-medium text-slate-500">
              Mitigating language also found
            </h3>
            <div className="mt-2 flex flex-wrap gap-2">
              {finding.mitigatingSignalsFound.map((s) => (
                <span
                  key={s}
                  className="rounded-full bg-[var(--cl-low-soft)] text-[#166534] px-3 py-1 text-xs"
                >
                  &ldquo;{s}&rdquo;
                </span>
              ))}
            </div>
          </>
        )}
      </Card>

      <Card className="mt-6 p-6 bg-[var(--cl-accent-soft)] border-blue-100">
        <h2 className="text-sm font-semibold text-[var(--cl-navy)]">Consider asking</h2>
        <p className="mt-2 text-sm text-slate-700 leading-relaxed">{finding.suggestedAction}</p>
        <button
          onClick={() => copy(finding.suggestedAction, "question")}
          className="mt-3 text-sm text-[var(--cl-accent)] hover:underline"
        >
          {copyState === "question" ? "Copied" : "Copy suggested question"}
        </button>
      </Card>

      <div className="mt-6 flex flex-wrap gap-3">
        <Button variant={finding.reviewed ? "outline" : "secondary"} onClick={toggleReviewed}>
          {finding.reviewed ? "Marked as reviewed" : "Mark as reviewed"}
        </Button>
        <LinkButton href={`/contract#${finding.clauseId}`} variant="outline">
          Jump to clause in document
        </LinkButton>
        <LinkButton href="/dashboard" variant="ghost">
          Back to dashboard
        </LinkButton>
      </div>
    </Shell>
  );
}

function Shell({ children }: { children: React.ReactNode }) {
  return (
    <div className="flex flex-col flex-1">
      <NavBar />
      <main className="flex-1 bg-[var(--cl-bg)]">
        <div className="mx-auto max-w-3xl px-5 sm:px-8 py-10 sm:py-14">{children}</div>
      </main>
      <Footer />
    </div>
  );
}

function BackIcon() {
  return (
    <svg width="14" height="14" viewBox="0 0 14 14" fill="none">
      <path d="M8.5 3L4 7l4.5 4" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  );
}
