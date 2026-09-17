export function ErrorPanel({
  title,
  message,
  onRetry,
}: {
  title: string;
  message: string;
  onRetry?: () => void;
}) {
  return (
    <div className="rounded-xl border border-red-100 bg-[var(--cl-high-soft)] p-6 sm:p-7">
      <div className="flex items-start gap-3">
        <span className="mt-0.5 flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-white">
          <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
            <circle cx="8" cy="8" r="7" stroke="var(--cl-high)" strokeWidth="1.5" />
            <path d="M8 4.5v4" stroke="var(--cl-high)" strokeWidth="1.5" strokeLinecap="round" />
            <circle cx="8" cy="11" r="0.9" fill="var(--cl-high)" />
          </svg>
        </span>
        <div>
          <p className="font-medium text-[#7f1d1d]">{title}</p>
          <p className="mt-1 text-sm text-[#7f1d1d]/90 leading-relaxed">{message}</p>
          {onRetry && (
            <button
              onClick={onRetry}
              className="mt-4 text-sm font-medium text-[var(--cl-navy)] underline underline-offset-2"
            >
              Try again
            </button>
          )}
        </div>
      </div>
    </div>
  );
}
