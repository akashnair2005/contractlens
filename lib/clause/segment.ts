import type { Clause } from "@/types";

// Matches common contract heading/numbering styles:
//   "1. Payment Terms"      "1.1 Confidentiality"     "Section 3: Termination"
//   "ARTICLE IV - TERM"     "(a) Indemnification"     "IV. Governing Law"
const NUMBERED_HEADING = /^\s*(?:(\d{1,2}(?:\.\d{1,2})*)[.)]|\(([a-zA-Z]|[ivxlcdm]+)\)|([IVXLCDM]{1,6})[.)]|(?:section|article|clause)\s+([a-zA-Z0-9]+)\s*[:.\-]?)\s+(.*)$/i;

// A line that is short, title-cased/uppercase, and not itself a full sentence
// is likely a bare heading (e.g. "CONFIDENTIALITY").
const BARE_HEADING = /^[A-Z][A-Z\s/&\-]{3,60}$/;

interface RawParagraph {
  text: string;
  start: number;
  end: number;
}

/** Splits raw text into paragraphs, preserving character offsets. */
function splitParagraphs(text: string): RawParagraph[] {
  const paragraphs: RawParagraph[] = [];
  const normalized = text.replace(/\r\n/g, "\n");
  // Split on blank lines first; fall back to single newlines if the document
  // has no blank-line separation (common in PDF extraction output).
  const blocks = normalized.split(/\n\s*\n/);
  const usesBlankLines = blocks.length > 3;

  let cursor = 0;
  const lines = usesBlankLines ? blocks : normalized.split("\n");

  for (const raw of lines) {
    const start = normalized.indexOf(raw, cursor);
    const safeStart = start === -1 ? cursor : start;
    const end = safeStart + raw.length;
    cursor = end;
    const trimmed = raw.trim();
    if (trimmed.length > 0) {
      paragraphs.push({ text: trimmed, start: safeStart, end });
    }
  }
  return paragraphs;
}

function detectHeading(line: string): string | null {
  const numbered = line.match(NUMBERED_HEADING);
  if (numbered) return line.trim();
  if (BARE_HEADING.test(line.trim()) && line.trim().split(/\s+/).length <= 8) {
    return line.trim();
  }
  return null;
}

const MIN_CLAUSE_LENGTH = 20; // characters; shorter fragments get merged forward

/**
 * Segments raw contract text into clauses.
 *
 * Strategy (does not assume perfect formatting):
 * 1. Split into paragraphs using blank lines, or single newlines as a fallback.
 * 2. A paragraph that looks like a heading (numbered, lettered, or short/bare
 *    caps line) starts a new clause and is stored as that clause's heading.
 * 3. Paragraphs that don't look like headings are appended to the current
 *    clause, so a "clause" can span multiple paragraphs.
 * 4. Very short trailing fragments are merged into the previous clause to
 *    avoid producing noise clauses from stray page-break artifacts.
 */
export function segmentClauses(documentText: string): Clause[] {
  const paragraphs = splitParagraphs(documentText);
  if (paragraphs.length === 0) return [];

  const clauses: Clause[] = [];
  let current: { heading?: string; text: string[]; start: number; end: number } | null = null;

  for (const para of paragraphs) {
    const heading = detectHeading(para.text);
    const looksLikeNewSection = heading !== null;

    if (looksLikeNewSection) {
      if (current) {
        clauses.push(finalize(current, clauses.length));
      }
      current = { heading, text: [para.text], start: para.start, end: para.end };
    } else if (current) {
      current.text.push(para.text);
      current.end = para.end;
    } else {
      current = { text: [para.text], start: para.start, end: para.end };
    }
  }
  if (current) clauses.push(finalize(current, clauses.length));

  return mergeShortFragments(clauses);
}

function finalize(
  c: { heading?: string; text: string[]; start: number; end: number },
  index: number
): Clause {
  return {
    id: `clause-${index}`,
    index,
    heading: c.heading,
    text: c.text.join("\n"),
    startOffset: c.start,
    endOffset: c.end,
  };
}

function mergeShortFragments(clauses: Clause[]): Clause[] {
  const merged: Clause[] = [];
  for (const clause of clauses) {
    const prev = merged[merged.length - 1];
    if (prev && clause.text.length < MIN_CLAUSE_LENGTH && !clause.heading) {
      prev.text = `${prev.text}\n${clause.text}`;
      prev.endOffset = clause.endOffset;
    } else {
      merged.push({ ...clause });
    }
  }
  // Re-index after merging
  return merged.map((c, i) => ({ ...c, id: `clause-${i}`, index: i }));
}
// Final repository verification marker.
