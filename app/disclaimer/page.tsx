import { NavBar } from "@/components/ui/NavBar";
import { Footer } from "@/components/ui/Footer";
import { Card } from "@/components/ui/Card";

export const metadata = { title: "Legal Disclaimer — ContractLens" };

export default function DisclaimerPage() {
  return (
    <div className="flex flex-col flex-1">
      <NavBar />
      <main className="flex-1 bg-[var(--cl-bg)]">
        <div className="mx-auto max-w-3xl px-5 sm:px-8 py-14">
          <h1 className="text-3xl font-semibold tracking-tight text-[var(--cl-navy)]">
            Legal disclaimer
          </h1>
          <Card className="mt-8 p-7">
            <p className="text-slate-700 leading-relaxed">
              ContractLens provides informational contract analysis and is{" "}
              <strong>not a substitute for advice from a qualified legal
              professional</strong>. Detected concerns are potential areas for
              review and do not determine whether a contract is legally valid,
              enforceable, or appropriate for your situation.
            </p>
          </Card>

          <div className="mt-8 space-y-5 text-sm text-slate-600 leading-relaxed">
            <p>
              ContractLens uses a deterministic, rule-based engine to identify
              language patterns commonly associated with categories of
              contractual risk, such as liability, intellectual property, or
              termination terms. It does not interpret the law, does not know
              the specifics of your jurisdiction or situation, and cannot
              assess whether any clause is enforceable.
            </p>
            <p>ContractLens will never tell you that a contract is illegal, that you will win or lose a dispute, or that a contract is legally safe to sign. Language like &quot;potential concern&quot; or &quot;consider asking&quot; reflects that these are starting points for your own review or a conversation with a licensed attorney — not conclusions about the law.</p>
            <p>
              If a contract is significant to you financially, professionally,
              or personally, consider having it reviewed by a licensed
              attorney in your jurisdiction before signing.
            </p>
          </div>
        </div>
      </main>
      <Footer />
    </div>
  );
}
// Final repository verification marker.
