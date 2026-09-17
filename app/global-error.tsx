"use client";

import { useEffect } from "react";
import { ErrorPanel } from "@/components/ui/ErrorPanel";
import { Button } from "@/components/ui/Button";

export default function GlobalError({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  useEffect(() => {
    console.error(error);
  }, [error]);

  return (
    <html lang="en">
      <body className="min-h-screen flex items-center justify-center bg-[var(--cl-bg)] px-6">
        <div className="max-w-md w-full">
          <ErrorPanel
            title="Something went wrong"
            message="An unexpected error occurred while loading ContractLens. Your document, if any, was not affected."
          />
          <div className="mt-4 flex justify-center">
            <Button onClick={reset}>Try again</Button>
          </div>
        </div>
      </body>
    </html>
  );
}
