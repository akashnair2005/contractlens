import Link from "next/link";
import type { ClauseFinding } from "@/types";
import { RiskBadge } from "@/components/ui/RiskBadge";

export function ClauseCard({ finding, rank }: { finding: ClauseFinding; rank?: number }) {
  return (
    <Link
      href={`/clause/${finding.id}`}
      className="block rounded-xl border border-[var(--cl-border)] bg-white p-5 hover:border-[var(--cl-accent)] transition-colors group"
    >
      <div className="flex items-start justify-between gap-4">
        <div className="flex items-start gap-3 min-w-0">
          {rank !== undefined && (
            <span className="text-sm font-semibold text-slate-300 mt-0.5 tabular-nums shrink-0">
              {String(rank).padStart(2, "0")}
            </span>
          )}
          <div className="min-w-0">
            <p className="text-xs font-medium text-[var(--cl-teal)] uppercase tracking-wide">
              {finding.category}
            </p>
            <p className="mt-1 font-medium text-[var(--cl-navy)] group-hover:text-[var(--cl-accent)]">
              {finding.whatItSays}
            </p>
            <p className="mt-1.5 text-sm text-slate-500 line-clamp-2">{finding.whatItMeans}</p>
          </div>
        </div>
        <RiskBadge level={finding.riskLevel} size="sm" />
      </div>
    </Link>
  );
}
// Final repository verification marker.
