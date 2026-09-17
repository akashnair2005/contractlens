import { NavBar } from "@/components/ui/NavBar";
import { Footer } from "@/components/ui/Footer";
import { Card } from "@/components/ui/Card";

export const metadata = { title: "Privacy & Security — ContractLens" };

export default function PrivacyPage() {
  return (
    <div className="flex flex-col flex-1">
      <NavBar />
      <main className="flex-1 bg-[var(--cl-bg)]">
        <div className="mx-auto max-w-3xl px-5 sm:px-8 py-14">
          <h1 className="text-3xl font-semibold tracking-tight text-[var(--cl-navy)]">
            Privacy &amp; security
          </h1>
          <p className="mt-3 text-slate-600 leading-relaxed">
            Contracts are sensitive documents. Here&apos;s exactly how ContractLens
            handles yours.
          </p>

          <div className="mt-8 space-y-5">
            <Card className="p-6">
              <h2 className="font-semibold text-[var(--cl-navy)]">
                No external AI service by default
              </h2>
              <p className="mt-2 text-sm text-slate-600 leading-relaxed">
                The core analysis pipeline — text extraction, clause segmentation,
                rule matching, scoring, and explanations — runs entirely within
                this application. Your document is not sent to OpenAI, Claude,
                Gemini, or any other external AI API for the core analysis.
              </p>
            </Card>
            <Card className="p-6">
              <h2 className="font-semibold text-[var(--cl-navy)]">In-memory processing</h2>
              <p className="mt-2 text-sm text-slate-600 leading-relaxed">
                Uploaded files are processed in memory for the duration of the
                analysis request. The core MVP does not persist uploaded
                documents to a database or disk after the response is returned.
              </p>
            </Card>
            <Card className="p-6">
              <h2 className="font-semibold text-[var(--cl-navy)]">Session-scoped results</h2>
              <p className="mt-2 text-sm text-slate-600 leading-relaxed">
                Your analysis result is kept in your browser&apos;s session
                storage so you can move between the dashboard, clause details,
                and the contract viewer. It clears when you close the tab and
                is never shared with other users.
              </p>
            </Card>
            <Card className="p-6">
              <h2 className="font-semibold text-[var(--cl-navy)]">Validation and limits</h2>
              <p className="mt-2 text-sm text-slate-600 leading-relaxed">
                Uploads are validated for file type and size before processing,
                and reasonable limits are enforced to keep the service reliable
                for everyone.
              </p>
            </Card>
            <Card className="p-6">
              <h2 className="font-semibold text-[var(--cl-navy)]">Optional future features</h2>
              <p className="mt-2 text-sm text-slate-600 leading-relaxed">
                Optional features like accounts or contract history would be
                clearly opt-in and separately disclosed if enabled — they are
                not required to use ContractLens.
              </p>
            </Card>
          </div>
        </div>
      </main>
      <Footer />
    </div>
  );
}
