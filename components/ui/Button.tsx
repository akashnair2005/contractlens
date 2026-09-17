import Link from "next/link";
import type { ButtonHTMLAttributes, ReactNode } from "react";

type Variant = "primary" | "secondary" | "ghost" | "outline";

const VARIANT_CLASSES: Record<Variant, string> = {
  primary:
    "bg-[var(--cl-accent)] text-white hover:bg-[var(--cl-accent-700)] shadow-sm",
  secondary:
    "bg-[var(--cl-navy)] text-white hover:bg-[var(--cl-navy-800)] shadow-sm",
  outline:
    "border border-[var(--cl-border)] bg-white text-[var(--cl-text)] hover:border-[var(--cl-accent)] hover:text-[var(--cl-accent)]",
  ghost: "text-[var(--cl-text)] hover:bg-slate-100",
};

const BASE =
  "inline-flex items-center justify-center gap-2 rounded-lg px-4 py-2.5 text-sm font-medium transition-colors disabled:opacity-50 disabled:cursor-not-allowed";

interface CommonProps {
  variant?: Variant;
  children: ReactNode;
  className?: string;
}

export function Button({
  variant = "primary",
  children,
  className = "",
  ...rest
}: CommonProps & ButtonHTMLAttributes<HTMLButtonElement>) {
  return (
    <button className={`${BASE} ${VARIANT_CLASSES[variant]} ${className}`} {...rest}>
      {children}
    </button>
  );
}

export function LinkButton({
  href,
  variant = "primary",
  children,
  className = "",
}: CommonProps & { href: string }) {
  return (
    <Link href={href} className={`${BASE} ${VARIANT_CLASSES[variant]} ${className}`}>
      {children}
    </Link>
  );
}
