import mammoth from "mammoth";
import { ExtractionError } from "./errors";

/**
 * Extracts raw text from a DOCX buffer using mammoth (open-source, no external API).
 */
export async function extractDocxText(buffer: Buffer): Promise<string> {
  let result: { value: string };
  try {
    result = await mammoth.extractRawText({ buffer });
  } catch {
    throw new ExtractionError(
      "This Word document could not be read. It may be corrupted or in an unsupported format.",
      "CORRUPTED_FILE"
    );
  }

  const text = (result.value || "").trim();
  if (!text) {
    throw new ExtractionError(
      "No readable text was found in this document.",
      "EMPTY_DOCUMENT"
    );
  }
  return text;
}
