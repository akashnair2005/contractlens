import { describe, it, expect } from "vitest";
import { Document, Packer, Paragraph } from "docx";
import { PDFDocument, StandardFonts } from "pdf-lib";
import { extractDocxText } from "@/lib/parser/docx";
import { extractPdfText } from "@/lib/parser/pdf";
import { ExtractionError } from "@/lib/parser/errors";
import { isSupportedFile, extractText } from "@/lib/parser";
import { runAnalysisPipeline } from "@/lib/analyze";
import { segmentClauses } from "@/lib/clause/segment";

async function makeDocxBuffer(text: string): Promise<Buffer> {
  const doc = new Document({
    sections: [{ properties: {}, children: [new Paragraph({ text })] }],
  });
  return Packer.toBuffer(doc);
}

async function makePdfBuffer(text: string): Promise<Buffer> {
  const pdfDoc = await PDFDocument.create();
  const page = pdfDoc.addPage([600, 400]);
  const font = await pdfDoc.embedFont(StandardFonts.Helvetica);
  page.drawText(text, { x: 50, y: 350, size: 12, font });
  const bytes = await pdfDoc.save({ useObjectStreams: false });
  return Buffer.from(bytes);
}

describe("DOCX extraction", () => {
  it("extracts text from a valid docx buffer", async () => {
    const buffer = await makeDocxBuffer("Hello contract world.");
    const text = await extractDocxText(buffer);
    expect(text).toContain("Hello contract world.");
  });

  it("throws EMPTY_DOCUMENT for a docx with no text", async () => {
    const buffer = await makeDocxBuffer("");
    await expect(extractDocxText(buffer)).rejects.toMatchObject({ code: "EMPTY_DOCUMENT" });
  });

  it("throws CORRUPTED_FILE for garbage bytes", async () => {
    const buffer = Buffer.from("not a real docx file");
    await expect(extractDocxText(buffer)).rejects.toBeInstanceOf(ExtractionError);
  });
});

describe("PDF extraction", () => {
  it("extracts text from a valid pdf buffer", async () => {
    const buffer = await makePdfBuffer("Hello PDF contract.");
    const text = await extractPdfText(buffer);
    expect(text.length).toBeGreaterThan(0);
  });

  it("throws CORRUPTED_FILE for garbage bytes", async () => {
    const buffer = Buffer.from("%PDF-not-a-real-pdf");
    await expect(extractPdfText(buffer)).rejects.toBeInstanceOf(ExtractionError);
  });
});

describe("File type validation", () => {
  it("accepts pdf and docx by extension", () => {
    expect(isSupportedFile("contract.pdf", "application/pdf")).toBe(true);
    expect(
      isSupportedFile(
        "contract.docx",
        "application/vnd.openxmlformats-officedocument.wordprocessingml.document"
      )
    ).toBe(true);
  });

  it("rejects unsupported extensions", () => {
    expect(isSupportedFile("contract.txt", "text/plain")).toBe(false);
    expect(isSupportedFile("contract.exe", "application/octet-stream")).toBe(false);
  });

  it("dispatches to the correct extractor and throws for unsupported types", async () => {
    await expect(extractText(Buffer.from("hi"), "file.exe")).rejects.toMatchObject({
      code: "UNSUPPORTED_FILE",
    });
  });
});

describe("Analysis pipeline error handling", () => {
  it("throws EMPTY_DOCUMENT for blank text", () => {
    expect(() => runAnalysisPipeline("   ", "empty.docx")).toThrowError(ExtractionError);
  });

  it("produces a warning for very short documents", () => {
    const result = runAnalysisPipeline("This is a short contract with few words in it.", "short.docx");
    expect(result.warnings.length).toBeGreaterThan(0);
  });

  it("produces a complete, self-consistent result for a normal contract", () => {
    const text = `1. LIABILITY\nContractor shall have unlimited liability for any and all claims.\n\n2. PAYMENT\nPayment is due within 30 days.`;
    const result = runAnalysisPipeline(text, "sample.docx");
    expect(result.clauses.length).toBe(2);
    expect(result.findings.length).toBeGreaterThan(0);
    expect(result.overallScore).toBeGreaterThanOrEqual(0);
    expect(result.overallScore).toBeLessThanOrEqual(100);
    expect(result.categorySummaries.length).toBeGreaterThan(0);
    expect(result.topPriorities.length).toBeLessThanOrEqual(5);
  });

  it("never crashes on documents with unusual whitespace/formatting", () => {
    const text = "\n\n\n   weird     spacing\tand\ttabs\n\n\n";
    expect(() => segmentClauses(text)).not.toThrow();
  });
});
