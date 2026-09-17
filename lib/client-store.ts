"use client";

import type { AnalysisResult } from "@/types";

const STORAGE_KEY = "contractlens:analysis-result";

// Cache the last-seen raw string and its parsed value so repeated reads
// (e.g. from useSyncExternalStore's getSnapshot) return a stable object
// reference when nothing has actually changed. This avoids re-render loops.
let cachedRaw: string | null = null;
let cachedParsed: AnalysisResult | null = null;

// Same-tab listeners for useAnalysisResult. sessionStorage only fires a
// native "storage" event for OTHER tabs/windows, so same-tab updates (e.g.
// marking a clause reviewed) need this small pub-sub to trigger a re-render.
type Listener = () => void;
const listeners = new Set<Listener>();

export function subscribeToAnalysisResult(listener: Listener): () => void {
  listeners.add(listener);
  return () => listeners.delete(listener);
}

function notifyListeners() {
  for (const listener of listeners) listener();
}

/**
 * ContractLens doesn't require a database for the core MVP. The result of an
 * analysis is passed between pages (upload -> dashboard -> clause detail ->
 * viewer -> report) via sessionStorage, scoped to the browser tab. Nothing
 * here is sent to a server beyond the original /api/analyze request.
 */
export function saveAnalysisResult(result: AnalysisResult) {
  try {
    const raw = JSON.stringify(result);
    sessionStorage.setItem(STORAGE_KEY, raw);
    cachedRaw = raw;
    cachedParsed = result;
    notifyListeners();
  } catch {
    // sessionStorage can fail in private browsing / storage-restricted contexts.
    // The pages that read this handle a missing result gracefully.
  }
}

export function loadAnalysisResult(): AnalysisResult | null {
  try {
    const raw = sessionStorage.getItem(STORAGE_KEY);
    if (raw === cachedRaw) return cachedParsed;
    cachedRaw = raw;
    cachedParsed = raw ? (JSON.parse(raw) as AnalysisResult) : null;
    return cachedParsed;
  } catch {
    return null;
  }
}

export function clearAnalysisResult() {
  try {
    sessionStorage.removeItem(STORAGE_KEY);
    cachedRaw = null;
    cachedParsed = null;
    notifyListeners();
  } catch {
    // no-op
  }
}

export function markFindingReviewed(findingId: string, reviewed: boolean) {
  const result = loadAnalysisResult();
  if (!result) return;
  const updated: AnalysisResult = {
    ...result,
    findings: result.findings.map((f) =>
      f.id === findingId ? { ...f, reviewed } : f
    ),
  };
  saveAnalysisResult(updated);
  return updated;
}
