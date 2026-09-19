import { LinkButton } from "@/components/ui/Button";

export function EmptyDashboardState() {
  return (
    <div className="rounded-xl border border-dashed border-slate-300 bg-white p-12 text-center">
      <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-full bg-[var(--cl-accent-soft)]">
        <svg width="24" height="24" viewBox="0 0 24 24" fill="none">
          <path
            d="M7 4h7l4 4v12a1 1 0 01-1 1H7a1 1 0 01-1-1V5a1 1 0 011-1z"
            stroke="var(--cl-accent)"
            strokeWidth="1.6"
          />
          <path d="M14 4v4h4" stroke="var(--cl-accent)" strokeWidth="1.6" strokeLinejoin="round" />
        </svg>
      </div>
      <h2 className="mt-5 text-lg font-semibold text-[var(--cl-navy)]">
        No analysis to show yet
      </h2>
      <p className="mt-2 text-sm text-slate-500 max-w-sm mx-auto">
        Upload a contract or try the demo to see a full risk dashboard, clause
        explanations, and suggested actions.
      </p>
      <div className="mt-6 flex justify-center gap-3">
        <LinkButton href="/upload" variant="primary">
          Analyze a contract
        </LinkButton>
        <LinkButton href="/upload?demo=1" variant="outline">
          Try the demo
        </LinkButton>
      </div>
    </div>
  );
}
// Final repository verification marker.
