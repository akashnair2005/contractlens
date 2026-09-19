# ContractLens

**See what you're signing.**

ContractLens analyzes contracts, identifies potentially concerning clauses,
explains them in plain English, and tells you what you might want to ask or
negotiate before you sign. It's built for freelancers, founders, employees,
and anyone else who signs contracts without a legal team on call.

ContractLens is **not a lawyer**. It never claims a contract is illegal,
safe to sign, or that you'll win or lose a dispute. It surfaces language
patterns that may deserve a closer look, in plain English, with a specific
question you could ask.

---

## Problem

Most people sign contracts — NDAs, freelance agreements, offer letters,
leases — without fully understanding what they're agreeing to: how IP is
handled, whether liability is capped, whether the contract auto-renews,
what it takes to get out of it. Professional contract review costs money
and time most people don't have for a first pass.

## Solution

ContractLens gives you a fast, explainable, first-pass read of a contract:

1. **Detect** — a rule-based engine scans every clause across nine risk
   categories.
2. **Explain** — each concern is translated into plain English: what it
   says, what it means, and why it matters.
3. **Act** — every flagged clause comes with a specific question or
   negotiation point you can actually use.

## Key features

- Upload a PDF or DOCX contract (drag-and-drop or file picker)
- Deterministic, rule-based risk engine — **no external AI API required**
- Contextual analysis that reduces false positives (a liability clause with
  a clear cap is treated differently from one with no limit)
- A risk dashboard: overall score, risk distribution, category breakdown,
  top priorities, search and filters
- A clause-by-clause detail view with the original text, plain-English
  explanation, detected signals, and a suggested question
- A contract viewer with clauses highlighted by risk level
- A downloadable/printable report
- A bundled demo contract that runs through the exact same pipeline as a
  real upload — nothing is hard-coded
- Accessible, responsive UI (desktop through mobile)

## How it works

```
Upload (PDF/DOCX)
      ↓
Text extraction        (pdfjs-dist / mammoth)
      ↓
Clause segmentation     (lib/clause/segment.ts)
      ↓
Rule-based risk engine  (rules/*, lib/risk/engine.ts)
      ↓
Risk scoring            (lib/risk/scoring.ts)
      ↓
Plain-English explanations + suggested actions
      ↓
Dashboard · Clause detail · Contract viewer · Report
```

Everything above runs inside this application. Nothing is sent to an
external AI service by the core analysis pipeline.

## Architecture

```
app/
  page.tsx                 Landing page
  upload/                  Upload flow (dropzone, processing steps, demo)
  dashboard/               Risk dashboard
  clause/[id]/             Clause detail view
  contract/                Contract viewer (highlighted clauses)
  report/                  Downloadable / printable report
  privacy/, disclaimer/    Static informational pages
  api/analyze/route.ts     Upload → extract → analyze → JSON result

components/
  ui/                      Buttons, cards, nav, badges, disclaimer banner
  upload/                  Dropzone, processing steps
  dashboard/               Score gauge, distribution, category breakdown,
                            clause cards, search/filter bar
  contract/                Contract viewer with risk highlighting

lib/
  parser/                  PDF (pdfjs-dist) / DOCX (mammoth) text extraction
  clause/segment.ts        Turns raw text into structured clauses
  risk/engine.ts           Matches rules against clauses, applies context
  risk/scoring.ts          Overall score, distribution, category summaries
  analyze.ts               Orchestrates the full pipeline
  client-store.ts          Session-scoped result storage (no database)
  use-analysis-result.ts   React hook over the session store

rules/
  liability.ts, ip.ts, termination.ts, payment.ts, renewal.ts,
  restrictions.ts, confidentiality.ts, penalties.ts, disputes.ts

types/                     Shared TypeScript types (Rule, ClauseFinding, ...)
tests/                     Vitest unit tests
public/demo-contract/      Bundled demo contract (.docx)
scripts/                   Demo contract generator + manual sanity check
```

## Tech stack

- **Frontend:** Next.js (App Router), React, TypeScript, Tailwind CSS
- **Backend:** Next.js API routes (`app/api/analyze/route.ts`)
- **Document processing:** `pdfjs-dist` (PDF), `mammoth` (DOCX) — both
  open-source, no paid API
- **Testing:** Vitest
- **Database:** none required for the core MVP (see "Privacy" below)

No paid AI API is required to run or demo this project.

## The risk engine

The engine is intentionally **not** a keyword scanner (`if text contains
"liability": HIGH RISK` would produce far too many false positives).
Instead, each rule (see `types/index.ts` → `Rule`) declares:

- a **category** (Liability, IP, Termination, Payment, Confidentiality,
  Non-compete/Restrictions, Auto-Renewal, Penalties/Fees, Dispute Resolution)
- a baseline **severity** and **score**
- **positive signals** — phrases that raise concern
- **mitigating signals** — phrases in the *same clause* that soften the
  concern (e.g. `"shall not exceed"` next to `"liability"`)
- **suppressing signals** — phrases that rule out a clear false positive
  entirely (e.g. generic "comply with IP law" boilerplate vs. an actual
  assignment of rights)
- an explanation, a "why it matters," and a suggested question

For each clause, the engine:

1. Skips the rule if a suppressing signal is present.
2. Counts distinct positive signals; three or more nudges severity up a
   level (more corroborating evidence).
3. If any mitigating signal is also present, severity is nudged down a
   level.
4. Maps the adjusted severity to a 0–100 score band, positioned within that
   band based on how many signals matched and how much mitigating language
   offset them.

Example — the same base concern, two different outcomes:

| Clause | Result |
|---|---|
| "Contractor shall have **unlimited liability** for any and all claims, **without limitation**." | High/Critical — multiple uncapped-liability signals, no mitigation |
| "Liability **shall not exceed** the total fees paid under this agreement." | Not flagged as unlimited liability — mitigating language present, no positive signal for this specific rule |

### Risk categories

Payment · Intellectual Property · Termination · Liability/Indemnification ·
Confidentiality · Non-compete/Restrictions · Auto-Renewal · Penalties/Fees ·
Dispute Resolution

### Scoring

Each finding gets a 0–100 score from its risk band (Low 10–29, Medium
30–59, High 60–79, Critical 80–97). The overall contract score is a
**transparent, capped weighted sum**: findings are sorted by score, and each
contributes with diminishing weight (1.0, 0.6, 0.4, 0.3, 0.2, 0.15, 0.1, then
0.05 for the rest). This means a single critical issue can push the score
into "Critical" attention on its own, while many minor issues don't
mechanically outrank one severe one. The final 0–100 score maps to Low
(0–29) / Medium (30–59) / High (60–79) / Critical (80–100) overall attention.

## Running locally

```bash
npm install
npm run dev
```

Then open [http://localhost:3000](http://localhost:3000).

To try it immediately without a file of your own, click **"Try the demo
contract"** on the landing or upload page — it uploads the bundled demo
contract through the exact same `/api/analyze` pipeline as any other file.

### Regenerating the demo contract

The demo contract is a real `.docx` file at
`public/demo-contract/demo-contractor-agreementfinal.docx`, generated from
`scripts/demo-contract-text.ts`:

```bash
npm run generate-demo
```

### Manually inspecting the pipeline output

```bash
npm run check-demo
```

Prints the overall score, distribution, category summaries, and top
priorities for the demo contract directly from the pipeline (useful when
tuning rules).

## Environment variables

**None are required.** See [`.env.example`](./.env.example) — it documents
placeholders for optional future extensions (an AI-enhanced analyzer,
Supabase-backed contract history) that are not used by the current app.

## Testing

```bash
npm test
```

43 tests covering:

- Each risk category's rules, including false-positive reduction
  (mitigating language, suppressing signals)
- Clause segmentation (numbered sections, unformatted text, empty input,
  short-fragment merging)
- Scoring aggregation (score bands, diminishing-returns weighting,
  category summaries, top-priorities ordering)
- PDF and DOCX extraction, including corrupted/empty-file handling
- File-type validation and the end-to-end analysis pipeline's error paths

## Deployment

Deploy to [Vercel](https://vercel.com) (or any Node-compatible host):

```bash
npm run build
npm start
```

No environment variables or database are required for the core MVP.

## Privacy

- The core analysis pipeline does not send your document to an external AI
  service.
- Uploaded files are processed in memory for the duration of the request
  and are not written to disk or a database by the core MVP.
- Analysis results are kept in your browser's session storage so you can
  move between the dashboard, clause details, contract viewer, and report;
  they clear when you close the tab.

See the in-app Privacy & Security page (`app/privacy/page.tsx`) for the
full detail shown to users.

## Limitations

- ContractLens is a first-pass, rule-based tool. It does not understand
  your jurisdiction, your specific situation, or case law, and it cannot
  determine whether a clause is enforceable.
- Text extraction from scanned/image-only PDFs (no text layer) is not
  supported — there's no OCR step in the core MVP.
- Clause segmentation relies on common formatting conventions (numbered
  sections, headings). Contracts with unusual or no formatting are
  segmented more coarsely.
- The rule set, while covering nine common categories, is not exhaustive
  and won't catch every possible issue in every contract type.

## Future improvements

- Optional AI-enhanced analysis layered on top of the rule engine's output
  (`RuleBasedAnalyzer` + `AIEnhancedAnalyzer`, combined confidence) —
  intentionally **not** required for the core MVP
- Optional accounts + Supabase-backed contract history
- OCR for scanned PDFs
- Contract comparison and multilingual analysis
- More granular per-jurisdiction rule tuning

## Disclaimer

**ContractLens provides informational contract analysis and is not a
substitute for advice from a qualified legal professional.** Detected
concerns are potential areas for review and do not determine whether a
contract is legally valid, enforceable, or appropriate for your situation.
If a contract is significant to you, consider having it reviewed by a
licensed attorney in your jurisdiction before signing.

## Hackathon context

ContractLens was built to demonstrate that meaningful contract-risk
awareness doesn't require a paid LLM in the loop: document parsing, clause
segmentation, a context-aware rule engine, transparent scoring, and
explainable recommendations are enough to turn "here's a 12-page PDF" into
"here are the three things you should ask about, and why." The demo
contract runs through the identical pipeline as any uploaded file — there
is no hard-coded demo path.
<!-- Final repository verification marker. -->
