import { ExtractionError } from "./errors";

/**
 * Extracts raw text from a PDF buffer using pdfjs-dist (Mozilla's PDF.js),
 * a well-maintained open-source library. No external API or paid service
 * is required for the core analysis pipeline.
 */
export async function extractPdfText(buffer: Buffer): Promise<string> {
  const pdfjs = await import("pdfjs-dist/legacy/build/pdf.mjs");

  let doc;
  try {
    const loadingTask = pdfjs.getDocument({
      data: new Uint8Array(buffer),
      useWorkerFetch: false,
      isEvalSupported: false,
      // Suppress noisy console warnings for minor malformed-PDF quirks.
      verbosity: 0,
    });
    doc = await loadingTask.promise;
  } catch {
    throw new ExtractionError(
      "This PDF could not be read. It may be corrupted, encrypted, or in an unsupported format.",
      "CORRUPTED_FILE"
    );
  }

  try {
    const pageTexts: string[] = [];
    for (let pageNum = 1; pageNum <= doc.numPages; pageNum++) {
      const page = await doc.getPage(pageNum);
      const content = await page.getTextContent();
      const pageText = content.items
        .map((item) => ("str" in item ? item.str : ""))
        .join(" ");
      pageTexts.push(pageText);
    }
    const text = pageTexts.join("\n\n").trim();
    if (!text) {
      throw new ExtractionError(
        "No readable text was found in this PDF. It may be a scanned image without OCR text.",
        "EMPTY_DOCUMENT"
      );
    }
    return text;
  } catch (err) {
    if (err instanceof ExtractionError) throw err;
    throw new ExtractionError(
      "This PDF could not be read. It may be corrupted or in an unsupported format.",
      "CORRUPTED_FILE"
    );
  } finally {
    await doc.destroy();
  }
}
// Final repository verification marker.
