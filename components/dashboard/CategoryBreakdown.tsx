import type { CategorySummary } from "@/types";
import { RiskBadge } from "@/components/ui/RiskBadge";

export function CategoryBreakdown({ categories }: { categories: CategorySummary[] }) {
  return (
    <ul className="divide-y divide-[var(--cl-border)]">
      {categories.map((c) => (
        <li key={c.category} className="flex items-center justify-between py-3">
          <div>
            <p className="text-sm font-medium text-[var(--cl-navy)]">{c.category}</p>
            <p className="text-xs text-slate-500 mt-0.5">
              {c.findingCount === 0
                ? "No concerns detected"
                : `${c.findingCount} ${c.findingCount === 1 ? "clause" : "clauses"} flagged`}
            </p>
          </div>
          <RiskBadge level={c.riskLevel} size="sm" />
        </li>
      ))}
    </ul>
  );
}
// Final repository verification marker.
