"use client";

import { useSyncExternalStore } from "react";
import { loadAnalysisResult, subscribeToAnalysisResult } from "./client-store";
import type { AnalysisResult } from "@/types";

function subscribe(callback: () => void) {
  // Cross-tab changes fire a native "storage" event; same-tab changes go
  // through the small pub-sub in client-store.ts (saveAnalysisResult /
  // markFindingReviewed / clearAnalysisResult all notify it).
  window.addEventListener("storage", callback);
  const unsubscribe = subscribeToAnalysisResult(callback);
  return () => {
    window.removeEventListener("storage", callback);
    unsubscribe();
  };
}

function getServerSnapshot(): AnalysisResult | null {
  return null;
}

/**
 * Reads the current analysis result from sessionStorage. Using
 * useSyncExternalStore (rather than useState + useEffect) means this is safe
 * during server rendering (falls back to null) and updates correctly on the
 * client without an extra render-triggering effect.
 */
export function useAnalysisResult(): AnalysisResult | null {
  return useSyncExternalStore(subscribe, loadAnalysisResult, getServerSnapshot);
}
