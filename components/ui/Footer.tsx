import Link from "next/link";

export function Footer() {
  return (
    <footer className="border-t border-[var(--cl-border)] bg-white">
      <div className="mx-auto max-w-6xl px-5 sm:px-8 py-8 flex flex-col sm:flex-row gap-4 sm:items-center sm:justify-between text-sm text-slate-500">
        <p>
          ContractLens is informational only and is not a substitute for advice from a
          qualified legal professional.
        </p>
        <div className="flex gap-5">
          <Link href="/disclaimer" className="hover:text-[var(--cl-navy)]">
            Legal disclaimer
          </Link>
          <Link href="/privacy" className="hover:text-[var(--cl-navy)]">
            Privacy &amp; security
          </Link>
        </div>
      </div>
    </footer>
  );
}
// Final repository verification marker.
