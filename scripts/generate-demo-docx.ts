import { Document, Packer, Paragraph, HeadingLevel, TextRun } from "docx";
import { writeFileSync, mkdirSync } from "fs";
import path from "path";
import { demoContractText } from "./demo-contract-text";

function buildParagraphs(): Paragraph[] {
  const lines = demoContractText.split("\n");
  const paragraphs: Paragraph[] = [];

  for (const line of lines) {
    const trimmed = line.trim();
    if (trimmed.length === 0) {
      paragraphs.push(new Paragraph({ text: "" }));
      continue;
    }
    const isTitle = paragraphs.length === 0 && trimmed === trimmed.toUpperCase();
    const looksLikeHeading = /^\d{1,2}\.\s+[A-Z\s]+$/.test(trimmed);

    if (isTitle) {
      paragraphs.push(
        new Paragraph({
          heading: HeadingLevel.TITLE,
          children: [new TextRun({ text: trimmed, bold: true })],
        })
      );
    } else if (looksLikeHeading) {
      paragraphs.push(
        new Paragraph({
          heading: HeadingLevel.HEADING_2,
          spacing: { before: 240, after: 120 },
          children: [new TextRun({ text: trimmed, bold: true })],
        })
      );
    } else {
      paragraphs.push(
        new Paragraph({
          spacing: { after: 120 },
          children: [new TextRun({ text: trimmed })],
        })
      );
    }
  }
  return paragraphs;
}

async function main() {
  const doc = new Document({
    sections: [{ properties: {}, children: buildParagraphs() }],
  });

  const buffer = await Packer.toBuffer(doc);
  const outDir = path.join(process.cwd(), "public", "demo-contract");
  mkdirSync(outDir, { recursive: true });
  const outPath = path.join(outDir, "demo-contractor-agreement.docx");
  writeFileSync(outPath, buffer);
  console.log(`Wrote ${outPath} (${buffer.length} bytes)`);
}

main().catch((err) => {
  console.error(err);
  process.exit(1);
});
