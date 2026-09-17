import Link from "next/link";

export function NavBar() {
  return (
    <header className="border-b border-[var(--cl-border)] bg-white/80 backdrop-blur sticky top-0 z-40">
      <div className="mx-auto max-w-6xl px-5 sm:px-8 h-16 flex items-center justify-between">
        <Link href="/" className="flex items-center gap-2.5 group">
          <LensMark />
          <span className="font-semibold text-[var(--cl-navy)] text-[17px] tracking-tight">
            ContractLens
          </span>
        </Link>
        <nav className="hidden sm:flex items-center gap-6 text-sm text-slate-600">
          <Link href="/upload" className="hover:text-[var(--cl-navy)]">
            Analyze a contract
          </Link>
          <Link href="/privacy" className="hover:text-[var(--cl-navy)]">
            Privacy
          </Link>
          <Link href="/disclaimer" className="hover:text-[var(--cl-navy)]">
            Disclaimer
          </Link>
        </nav>
        <Link
          href="/upload"
          className="sm:hidden text-sm font-medium text-[var(--cl-accent)]"
        >
          Analyze
        </Link>
      </div>
    </header>
  );
}

function LensMark() {
  return (
    <svg width="26" height="26" viewBox="0 0 26 26" fill="none" aria-hidden>
      <circle cx="11" cy="11" r="7.5" stroke="#0B1220" strokeWidth="2" />
      <line x1="16.2" y1="16.2" x2="22" y2="22" stroke="#2563EB" strokeWidth="2.4" strokeLinecap="round" />
      <path d="M8 11.2c0-1.8 1.4-3.2 3.2-3.2" stroke="#2563EB" strokeWidth="1.6" strokeLinecap="round" />
    </svg>
  );
}
