import type { AnalyzeErrorResponse } from "@/types";

export class ExtractionError extends Error {
  code: AnalyzeErrorResponse["code"];
  constructor(message: string, code: AnalyzeErrorResponse["code"]) {
    super(message);
    this.code = code;
    this.name = "ExtractionError";
  }
}
