"use client";

import { Suspense, useCallback, useEffect, useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { NavBar } from "@/components/ui/NavBar";
import { Footer } from "@/components/ui/Footer";
import { DisclaimerBanner } from "@/components/ui/DisclaimerBanner";
import { UploadDropzone } from "@/components/upload/UploadDropzone";
import { ProcessingSteps } from "@/components/upload/ProcessingSteps";
import { ErrorPanel } from "@/components/ui/ErrorPanel";
import { Button, LinkButton } from "@/components/ui/Button";
import { saveAnalysisResult } from "@/lib/client-store";
import type { AnalyzeErrorResponse, AnalysisResult } from "@/types";

type Status = "idle" | "processing" | "error";

function UploadPageInner() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [status, setStatus] = useState<Status>("idle");
  const [error, setError] = useState<AnalyzeErrorResponse | null>(null);
  const [pendingFile, setPendingFile] = useState<File | null>(null);

  const runAnalysis = useCallback(
    async (file: File) => {
      setStatus("processing");
      setError(null);
      try {
        const formData = new FormData();
        formData.append("file", file);
        const res = await fetch("/api/analyze", { method: "POST", body: formData });
        const data = await res.json();
        if (!res.ok) {
          setError(data as AnalyzeErrorResponse);
          setStatus("error");
          return;
        }
        saveAnalysisResult(data as AnalysisResult);
        router.push("/dashboard");
      } catch {
        setError({
          error: "We couldn't reach the analysis service. Check your connection and try again.",
          code: "SERVER_ERROR",
        });
        setStatus("error");
      }
    },
    [router]
  );

  const runDemo = useCallback(async () => {
    setStatus("processing");
    setError(null);
    try {
      const fileRes = await fetch("/demo-contract/demo-contractor-agreement.docx");
      const blob = await fileRes.blob();
      const file = new File([blob], "demo-contractor-agreement.docx", {
        type: "application/vnd.openxmlformats-officedocument.wordprocessingml.document",
      });
      await runAnalysis(file);
    } catch {
      setError({
        error: "We couldn't load the demo contract. Please try again.",
        code: "SERVER_ERROR",
      });
      setStatus("error");
    }
  }, [runAnalysis]);

  useEffect(() => {
    if (searchParams.get("demo") === "1" && status === "idle") {
      // Deferred so the state updates inside runDemo happen in a microtask
      // callback rather than synchronously within the effect body.
      queueMicrotask(() => {
        runDemo();
      });
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return (
    <div className="flex flex-col flex-1">
      <NavBar />
      <main className="flex-1">
        <div className="mx-auto max-w-2xl px-5 sm:px-8 py-14 sm:py-20">
          <h1 className="text-3xl font-semibold tracking-tight text-[var(--cl-navy)]">
            Analyze a contract
          </h1>
          <p className="mt-3 text-slate-600">
            Your document is processed by the analysis pipeline to generate your
            report. It is not sent to an external AI service by the core analysis.
          </p>

          <div className="mt-8">
            {status === "processing" && (
              <ProcessingSteps done={false} />
            )}

            {status === "idle" && (
              <>
                <UploadDropzone
                  onFileSelected={(file) => {
                    setPendingFile(file);
                  }}
                />
                {pendingFile && (
                  <Button className="mt-5 w-full h-12" onClick={() => runAnalysis(pendingFile)}>
                    Analyze contract
                  </Button>
                )}
                <div className="mt-6 flex items-center gap-3 text-xs text-slate-400">
                  <span className="h-px flex-1 bg-slate-200" />
                  or
                  <span className="h-px flex-1 bg-slate-200" />
                </div>
                <Button variant="outline" className="mt-6 w-full h-12" onClick={runDemo}>
                  Try the demo contract instead
                </Button>
              </>
            )}

            {status === "error" && error && (
              <ErrorPanel
                title={errorTitle(error.code)}
                message={error.error}
                onRetry={() => {
                  setStatus("idle");
                  setError(null);
                }}
              />
            )}
          </div>

          <div className="mt-10">
            <DisclaimerBanner compact />
          </div>

          <div className="mt-6 text-sm text-slate-500">
            Prefer to look around first?{" "}
            <LinkButton href="/" variant="ghost" className="!p-0 !h-auto inline text-sm text-[var(--cl-accent)] hover:underline">
              Back to home
            </LinkButton>
          </div>
        </div>
      </main>
      <Footer />
    </div>
  );
}

function errorTitle(code: AnalyzeErrorResponse["code"]): string {
  switch (code) {
    case "UNSUPPORTED_FILE":
      return "Unsupported file type";
    case "FILE_TOO_LARGE":
      return "File too large";
    case "EMPTY_DOCUMENT":
      return "No readable text found";
    case "CORRUPTED_FILE":
      return "File couldn't be read";
    case "EXTRACTION_FAILED":
      return "Couldn't extract text";
    case "ANALYSIS_FAILED":
      return "Analysis failed";
    default:
      return "Something went wrong";
  }
}

export default function UploadPage() {
  return (
    <Suspense fallback={null}>
      <UploadPageInner />
    </Suspense>
  );
}
// Final repository verification marker.
