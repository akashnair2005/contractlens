export function DisclaimerBanner({ compact = false }: { compact?: boolean }) {
  return (
    <div
      role="note"
      className={`rounded-lg border border-[var(--cl-border)] bg-slate-50 text-slate-600 ${
        compact ? "text-xs px-3 py-2" : "text-sm px-4 py-3"
      }`}
    >
      <strong className="text-slate-700">Not legal advice.</strong> ContractLens
      provides informational contract analysis and is not a substitute for advice
      from a qualified legal professional. Detected concerns are potential areas
      for review, not a determination of legal validity or enforceability.
    </div>
  );
}
