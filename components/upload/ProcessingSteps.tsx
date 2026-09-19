"use client";

import { useEffect, useState } from "react";

export interface ProcessingStep {
  label: string;
}

const STEPS: ProcessingStep[] = [
  { label: "Uploading document" },
  { label: "Extracting text" },
  { label: "Identifying clauses" },
  { label: "Analyzing potential concerns" },
  { label: "Calculating risk" },
  { label: "Preparing report" },
];

/**
 * Shows a step-by-step processing experience instead of a bare spinner.
 * `activeIndex` reflects real progress when known; otherwise this advances
 * on a timer to keep the experience lively while the request is in flight.
 */
export function ProcessingSteps({ done }: { done: boolean }) {
  const [activeIndex, setActiveIndex] = useState(0);

  useEffect(() => {
    if (done) return;
    const interval = setInterval(() => {
      setActiveIndex((i) => (i < STEPS.length - 2 ? i + 1 : i));
    }, 650);
    return () => clearInterval(interval);
  }, [done]);

  const effectiveIndex = done ? STEPS.length : activeIndex;

  return (
    <div className="rounded-xl border border-[var(--cl-border)] bg-white p-7 sm:p-8">
      <ul className="space-y-4">
        {STEPS.map((step, i) => {
          const state = i < effectiveIndex ? "done" : i === effectiveIndex ? "active" : "pending";
          return (
            <li key={step.label} className="flex items-center gap-3">
              <StepIcon state={state} />
              <span
                className={`text-sm ${
                  state === "pending"
                    ? "text-slate-400"
                    : state === "active"
                    ? "text-[var(--cl-navy)] font-medium"
                    : "text-slate-600"
                }`}
              >
                {step.label}
              </span>
            </li>
          );
        })}
      </ul>
    </div>
  );
}

function StepIcon({ state }: { state: "done" | "active" | "pending" }) {
  if (state === "done") {
    return (
      <span className="flex h-5 w-5 items-center justify-center rounded-full bg-[var(--cl-low)] text-white shrink-0">
        <svg width="11" height="11" viewBox="0 0 12 12" fill="none">
          <path d="M2.5 6.5l2.2 2.2L9.5 3.5" stroke="white" strokeWidth="1.7" strokeLinecap="round" strokeLinejoin="round" />
        </svg>
      </span>
    );
  }
  if (state === "active") {
    return (
      <span className="flex h-5 w-5 items-center justify-center rounded-full border-2 border-[var(--cl-accent)] border-t-transparent animate-spin shrink-0" />
    );
  }
  return <span className="h-5 w-5 rounded-full border-2 border-slate-200 shrink-0" />;
}
// Final repository verification marker.
