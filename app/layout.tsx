import type { Metadata } from "next";
import "@fontsource/inter/400.css";
import "@fontsource/inter/500.css";
import "@fontsource/inter/600.css";
import "@fontsource/inter/700.css";
import "./globals.css";

export const metadata: Metadata = {
  title: "ContractLens — See what you're signing.",
  description:
    "ContractLens analyzes contracts, flags potentially concerning clauses, explains them in plain English, and suggests what to ask before you sign.",
};

export default function RootLayout({ children }: LayoutProps<"/">) {
  return (
    <html lang="en" className="h-full antialiased" style={{ ["--font-inter" as string]: "'Inter', ui-sans-serif, system-ui, sans-serif" }}>
      <body className="min-h-full flex flex-col bg-[var(--cl-bg)] text-[var(--cl-text)]">
        {children}
      </body>
    </html>
  );
}
