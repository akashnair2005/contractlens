import type { RiskLevel } from "@/types";

const LEVEL_COLOR: Record<RiskLevel, string> = {
  low: "var(--cl-low)",
  medium: "var(--cl-medium)",
  high: "var(--cl-high)",
  critical: "var(--cl-critical)",
};

const LEVEL_ATTENTION_LABEL: Record<RiskLevel, string> = {
  low: "Low attention",
  medium: "Moderate attention",
  high: "High attention",
  critical: "Critical attention",
};

export function RiskScoreGauge({ score, level }: { score: number; level: RiskLevel }) {
  const radius = 54;
  const circumference = 2 * Math.PI * radius;
  const progress = Math.max(0, Math.min(100, score)) / 100;
  const dash = circumference * progress;
  const color = LEVEL_COLOR[level];

  return (
    <div className="flex items-center gap-6">
      <svg width="132" height="132" viewBox="0 0 132 132" className="shrink-0" aria-hidden>
        <circle cx="66" cy="66" r={radius} fill="none" stroke="#e2e8f0" strokeWidth="12" />
        <circle
          cx="66"
          cy="66"
          r={radius}
          fill="none"
          stroke={color}
          strokeWidth="12"
          strokeLinecap="round"
          strokeDasharray={`${dash} ${circumference}`}
          transform="rotate(-90 66 66)"
        />
        <text x="66" y="62" textAnchor="middle" fontSize="28" fontWeight="600" fill="var(--cl-navy)">
          {score}
        </text>
        <text x="66" y="80" textAnchor="middle" fontSize="11" fill="#64748b">
          / 100
        </text>
      </svg>
      <div>
        <p className="text-sm text-slate-500">Contract risk score</p>
        <p className="text-lg font-semibold mt-0.5" style={{ color }}>
          {LEVEL_ATTENTION_LABEL[level]}
        </p>
      </div>
    </div>
  );
}
// Final repository verification marker.
