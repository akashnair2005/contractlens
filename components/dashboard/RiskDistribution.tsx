import type { RiskDistribution as RiskDistributionType } from "@/types";

const ORDER: { key: keyof RiskDistributionType; label: string; color: string }[] = [
  { key: "critical", label: "Critical", color: "var(--cl-critical)" },
  { key: "high", label: "High", color: "var(--cl-high)" },
  { key: "medium", label: "Medium", color: "var(--cl-medium)" },
  { key: "low", label: "Low", color: "var(--cl-low)" },
];

export function RiskDistribution({ distribution }: { distribution: RiskDistributionType }) {
  const max = Math.max(1, ...ORDER.map((o) => distribution[o.key]));
  return (
    <div className="space-y-3">
      {ORDER.map(({ key, label, color }) => {
        const count = distribution[key];
        const pct = (count / max) * 100;
        return (
          <div key={key} className="flex items-center gap-3">
            <span className="w-16 text-sm text-slate-600">{label}</span>
            <div className="flex-1 h-2.5 rounded-full bg-slate-100 overflow-hidden">
              <div
                className="h-full rounded-full transition-all"
                style={{ width: `${pct}%`, background: color }}
              />
            </div>
            <span className="w-6 text-right text-sm font-medium text-[var(--cl-navy)]">
              {count}
            </span>
          </div>
        );
      })}
    </div>
  );
}
