import type { RiskLevel } from "@/types";

const CONFIG: Record<RiskLevel, { label: string; fg: string; bg: string; dot: string }> = {
  low: { label: "Low", fg: "#166534", bg: "var(--cl-low-soft)", dot: "var(--cl-low)" },
  medium: { label: "Medium", fg: "#92400e", bg: "var(--cl-medium-soft)", dot: "var(--cl-medium)" },
  high: { label: "High", fg: "#991b1b", bg: "var(--cl-high-soft)", dot: "var(--cl-high)" },
  critical: { label: "Critical", fg: "#7f1d1d", bg: "var(--cl-critical-soft)", dot: "var(--cl-critical)" },
};

export function RiskBadge({
  level,
  size = "md",
}: {
  level: RiskLevel;
  size?: "sm" | "md";
}) {
  const cfg = CONFIG[level];
  const pad = size === "sm" ? "px-2 py-0.5 text-xs" : "px-2.5 py-1 text-sm";
  return (
    <span
      className={`inline-flex items-center gap-1.5 rounded-full font-medium ${pad}`}
      style={{ color: cfg.fg, background: cfg.bg }}
    >
      <span
        aria-hidden
        className="inline-block rounded-full"
        style={{ width: 6, height: 6, background: cfg.dot }}
      />
      {cfg.label}
    </span>
  );
}
// Final repository verification marker.
