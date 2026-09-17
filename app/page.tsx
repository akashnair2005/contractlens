import { NavBar } from "@/components/ui/NavBar";
import { Footer } from "@/components/ui/Footer";
import { Card } from "@/components/ui/Card";
import { LinkButton } from "@/components/ui/Button";

const FLOW_STEPS = [
  {
    label: "Upload",
    detail: "Drop in a PDF or Word contract — an NDA, freelance agreement, lease, or offer letter.",
  },
  {
    label: "Detect",
    detail: "A rule-based engine scans every clause for signals across nine risk categories.",
  },
  {
    label: "Explain",
    detail: "Each concern is translated into plain English: what it says, and why it matters.",
  },
  {
    label: "Act",
    detail: "Get a specific question or negotiation point you can actually bring to the table.",
  },
];

const CATEGORIES = [
  "Payment",
  "Intellectual property",
  "Termination",
  "Liability",
  "Confidentiality",
  "Non-compete",
  "Auto-renewal",
  "Penalties",
  "Dispute resolution",
];

export default function LandingPage() {
  return (
    <div className="flex flex-col flex-1">
      <NavBar />
      <main className="flex-1">
        {/* Hero */}
        <section className="mx-auto max-w-6xl px-5 sm:px-8 pt-16 pb-20 sm:pt-24 sm:pb-28 grid lg:grid-cols-[1.05fr_0.95fr] gap-16 items-center">
          <div>
            <p className="text-sm font-medium text-[var(--cl-teal)] mb-5">
              A first-pass contract review, before you sign
            </p>
            <h1 className="text-4xl sm:text-5xl font-semibold tracking-tight text-[var(--cl-navy)] leading-[1.1]">
              See what you&apos;re signing.
            </h1>
            <p className="mt-6 text-lg text-slate-600 max-w-lg leading-relaxed">
              Upload a contract. ContractLens finds clauses that may deserve a
              closer look, explains what they mean in plain English, and tells
              you what you could ask or negotiate — before you sign.
            </p>
            <div className="mt-9 flex flex-col sm:flex-row gap-3">
              <LinkButton href="/upload" variant="primary" className="h-12 px-6 text-base">
                Analyze a contract
              </LinkButton>
              <LinkButton href="/upload?demo=1" variant="outline" className="h-12 px-6 text-base">
                Try the demo contract
              </LinkButton>
            </div>
            <p className="mt-5 text-sm text-slate-500">
              Runs on a deterministic rule engine — no external AI service required to analyze your document.
            </p>
          </div>

          <HeroDocumentPreview />
        </section>

        {/* Flow */}
        <section className="border-t border-[var(--cl-border)] bg-white">
          <div className="mx-auto max-w-6xl px-5 sm:px-8 py-16">
            <h2 className="text-2xl font-semibold text-[var(--cl-navy)] tracking-tight">
              Four steps, one workflow
            </h2>
            <div className="mt-10 grid sm:grid-cols-2 lg:grid-cols-4 gap-6">
              {FLOW_STEPS.map((step, i) => (
                <div key={step.label} className="relative pl-0">
                  <div className="flex items-center gap-3 mb-3">
                    <span className="flex h-8 w-8 items-center justify-center rounded-full bg-[var(--cl-navy)] text-white text-sm font-medium">
                      {i + 1}
                    </span>
                    <h3 className="font-semibold text-[var(--cl-navy)]">{step.label}</h3>
                  </div>
                  <p className="text-sm text-slate-600 leading-relaxed">{step.detail}</p>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* Categories */}
        <section className="mx-auto max-w-6xl px-5 sm:px-8 py-16">
          <div className="grid lg:grid-cols-[0.9fr_1.1fr] gap-12 items-start">
            <div>
              <h2 className="text-2xl font-semibold text-[var(--cl-navy)] tracking-tight">
                Nine categories, checked automatically
              </h2>
              <p className="mt-4 text-slate-600 leading-relaxed max-w-md">
                Every clause is checked against category-specific rules that
                look for both concerning language and mitigating context — so
                a liability clause with a clear cap isn&apos;t flagged the same
                way as one with no limit at all.
              </p>
            </div>
            <div className="flex flex-wrap gap-2.5">
              {CATEGORIES.map((c) => (
                <span
                  key={c}
                  className="rounded-full border border-[var(--cl-border)] bg-white px-3.5 py-1.5 text-sm text-slate-700"
                >
                  {c}
                </span>
              ))}
            </div>
          </div>
        </section>

        {/* Trust */}
        <section className="border-t border-[var(--cl-border)] bg-white">
          <div className="mx-auto max-w-6xl px-5 sm:px-8 py-16 grid sm:grid-cols-3 gap-8">
            <TrustCard
              title="Explainable, not a black box"
              body="Every flagged clause shows exactly which words triggered it and why, so you can judge the analysis yourself."
            />
            <TrustCard
              title="Not a lawyer, and doesn't pretend to be"
              body="ContractLens never tells you a contract is illegal or safe to sign. It surfaces what may deserve a closer look."
            />
            <TrustCard
              title="Built with privacy in mind"
              body="Your document is processed to generate your analysis and isn't sent to an external AI service by the core pipeline."
            />
          </div>
        </section>

        {/* CTA */}
        <section className="mx-auto max-w-6xl px-5 sm:px-8 py-20 text-center">
          <h2 className="text-2xl sm:text-3xl font-semibold text-[var(--cl-navy)] tracking-tight">
            Know before you sign.
          </h2>
          <div className="mt-8 flex justify-center gap-3 flex-col sm:flex-row">
            <LinkButton href="/upload" variant="primary" className="h-12 px-7 text-base">
              Analyze a contract
            </LinkButton>
            <LinkButton href="/upload?demo=1" variant="outline" className="h-12 px-7 text-base">
              Try the demo contract
            </LinkButton>
          </div>
        </section>
      </main>
      <Footer />
    </div>
  );
}

function TrustCard({ title, body }: { title: string; body: string }) {
  return (
    <Card className="p-6">
      <h3 className="font-semibold text-[var(--cl-navy)] mb-2">{title}</h3>
      <p className="text-sm text-slate-600 leading-relaxed">{body}</p>
    </Card>
  );
}

function HeroDocumentPreview() {
  return (
    <div className="relative">
      <div className="absolute -top-6 -right-6 h-40 w-40 rounded-full bg-[var(--cl-accent-soft)] blur-2xl opacity-70" aria-hidden />
      <Card className="relative p-6 sm:p-7 shadow-[0_20px_60px_-25px_rgba(11,18,32,0.35)]">
        <div className="flex items-center justify-between mb-5">
          <div className="flex items-center gap-2">
            <span className="h-2.5 w-2.5 rounded-full bg-slate-300" />
            <span className="h-2.5 w-2.5 rounded-full bg-slate-300" />
            <span className="h-2.5 w-2.5 rounded-full bg-slate-300" />
          </div>
          <span className="text-xs text-slate-400 font-medium">contractor-agreement.docx</span>
        </div>
        <div className="space-y-3 text-[13px] leading-relaxed text-slate-500">
          <p className="font-medium text-slate-700">7. LIABILITY AND INDEMNIFICATION</p>
          <p className="rounded-md bg-[var(--cl-critical-soft)] px-3 py-2 text-[#7f1d1d] border border-red-100">
            Contractor shall have unlimited liability for any and all claims,
            damages, or losses arising from or related to the Services,
            without limitation.
          </p>
          <p>Contractor shall indemnify and hold harmless Client from any and all claims&hellip;</p>
        </div>
        <div className="mt-5 pt-5 border-t border-[var(--cl-border)] flex items-start gap-3">
          <span className="mt-0.5 h-2 w-2 rounded-full bg-[var(--cl-critical)] shrink-0" />
          <div>
            <p className="text-sm font-medium text-[var(--cl-navy)]">Potential concern — Liability</p>
            <p className="text-sm text-slate-600 mt-1">
              No cap on liability. Consider asking whether it can be limited to
              fees paid under the agreement.
            </p>
          </div>
        </div>
      </Card>
    </div>
  );
}
