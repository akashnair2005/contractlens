"use client";

import type { RiskCategory, RiskLevel } from "@/types";

const RISK_LEVELS: RiskLevel[] = ["critical", "high", "medium", "low"];

export function SearchAndFilterBar({
  query,
  onQueryChange,
  categories,
  activeCategory,
  onCategoryChange,
  activeLevel,
  onLevelChange,
}: {
  query: string;
  onQueryChange: (v: string) => void;
  categories: RiskCategory[];
  activeCategory: RiskCategory | "all";
  onCategoryChange: (v: RiskCategory | "all") => void;
  activeLevel: RiskLevel | "all";
  onLevelChange: (v: RiskLevel | "all") => void;
}) {
  return (
    <div className="flex flex-col sm:flex-row gap-3">
      <div className="relative flex-1">
        <SearchIcon />
        <input
          type="search"
          value={query}
          onChange={(e) => onQueryChange(e.target.value)}
          placeholder="Search clauses, e.g. &quot;liability&quot;"
          aria-label="Search clauses"
          className="w-full h-11 pl-10 pr-4 rounded-lg border border-[var(--cl-border)] bg-white text-sm placeholder:text-slate-400 focus:border-[var(--cl-accent)]"
        />
      </div>
      <select
        aria-label="Filter by category"
        value={activeCategory}
        onChange={(e) => onCategoryChange(e.target.value as RiskCategory | "all")}
        className="h-11 rounded-lg border border-[var(--cl-border)] bg-white px-3 text-sm text-slate-700"
      >
        <option value="all">All categories</option>
        {categories.map((c) => (
          <option key={c} value={c}>
            {c}
          </option>
        ))}
      </select>
      <select
        aria-label="Filter by risk level"
        value={activeLevel}
        onChange={(e) => onLevelChange(e.target.value as RiskLevel | "all")}
        className="h-11 rounded-lg border border-[var(--cl-border)] bg-white px-3 text-sm text-slate-700"
      >
        <option value="all">All risk levels</option>
        {RISK_LEVELS.map((l) => (
          <option key={l} value={l}>
            {l[0].toUpperCase() + l.slice(1)}
          </option>
        ))}
      </select>
    </div>
  );
}

function SearchIcon() {
  return (
    <svg
      width="16"
      height="16"
      viewBox="0 0 16 16"
      fill="none"
      className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400"
      aria-hidden
    >
      <circle cx="7" cy="7" r="5" stroke="currentColor" strokeWidth="1.5" />
      <line x1="10.8" y1="10.8" x2="14" y2="14" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
    </svg>
  );
}
