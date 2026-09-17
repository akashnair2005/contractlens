import { extractPdfText } from "./pdf";
import { extractDocxText } from "./docx";
import { ExtractionError } from "./errors";

export { ExtractionError };

export const MAX_FILE_SIZE_BYTES = 15 * 1024 * 1024; // 15 MB
export const SUPPORTED_MIME_TYPES = [
  "application/pdf",
  "application/vnd.openxmlformats-officedocument.wordprocessingml.document",
];
export const SUPPORTED_EXTENSIONS = [".pdf", ".docx"];

export function isSupportedFile(name: string, mimeType: string): boolean {
  const lower = name.toLowerCase();
  const extOk = SUPPORTED_EXTENSIONS.some((ext) => lower.endsWith(ext));
  const mimeOk = SUPPORTED_MIME_TYPES.includes(mimeType) || mimeType === "" || mimeType === "application/octet-stream";
  return extOk && mimeOk;
}

/**
 * Extracts text from a supported document buffer, dispatching by extension.
 * Throws ExtractionError with a user-facing message and machine-readable code.
 */
export async function extractText(
  buffer: Buffer,
  fileName: string
): Promise<string> {
  const lower = fileName.toLowerCase();
  if (lower.endsWith(".pdf")) {
    return extractPdfText(buffer);
  }
  if (lower.endsWith(".docx")) {
    return extractDocxText(buffer);
  }
  throw new ExtractionError(
    "Unsupported file type. Please upload a PDF or DOCX file.",
    "UNSUPPORTED_FILE"
  );
}
