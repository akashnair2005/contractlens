import { NextRequest, NextResponse } from "next/server";
import {
  extractText,
  isSupportedFile,
  MAX_FILE_SIZE_BYTES,
  ExtractionError,
} from "@/lib/parser";
import { runAnalysisPipeline } from "@/lib/analyze";
import type { AnalyzeErrorResponse } from "@/types";

export const runtime = "nodejs";
export const maxDuration = 30;

function errorResponse(
  message: string,
  code: AnalyzeErrorResponse["code"],
  status: number
) {
  const body: AnalyzeErrorResponse = { error: message, code };
  return NextResponse.json(body, { status });
}

export async function POST(req: NextRequest) {
  let formData: FormData;
  try {
    formData = await req.formData();
  } catch {
    return errorResponse(
      "The upload could not be read. Please try again.",
      "SERVER_ERROR",
      400
    );
  }

  const file = formData.get("file");
  if (!file || !(file instanceof File)) {
    return errorResponse("No file was provided.", "UNSUPPORTED_FILE", 400);
  }

  if (file.size === 0) {
    return errorResponse("The uploaded file is empty.", "EMPTY_DOCUMENT", 400);
  }

  if (file.size > MAX_FILE_SIZE_BYTES) {
    return errorResponse(
      `This file is too large. Please upload a file under ${Math.round(
        MAX_FILE_SIZE_BYTES / (1024 * 1024)
      )}MB.`,
      "FILE_TOO_LARGE",
      400
    );
  }

  if (!isSupportedFile(file.name, file.type)) {
    return errorResponse(
      "Unsupported file type. Please upload a PDF or DOCX file.",
      "UNSUPPORTED_FILE",
      400
    );
  }

  try {
    const arrayBuffer = await file.arrayBuffer();
    const buffer = Buffer.from(arrayBuffer);

    // Note on privacy: this buffer is processed in memory for this request
    // only. Nothing is written to disk or sent to an external AI service by
    // the core pipeline. See the Privacy page for details.
    const text = await extractText(buffer, file.name);
    const result = runAnalysisPipeline(text, file.name);

    return NextResponse.json(result, { status: 200 });
  } catch (err) {
    if (err instanceof ExtractionError) {
      return errorResponse(err.message, err.code, 422);
    }
    console.error("Unexpected analysis error:", err instanceof Error ? err.message : err);
    return errorResponse(
      "Something went wrong while analyzing this document. Please try again.",
      "ANALYSIS_FAILED",
      500
    );
  }
}
