import { runAnalysisPipeline } from "../lib/analyze";
import { demoContractText } from "./demo-contract-text";

const result = runAnalysisPipeline(demoContractText, "demo-contractor-agreement.docx");

console.log("Overall score:", result.overallScore, result.overallLevel);
console.log("Distribution:", result.distribution);
console.log("Clauses:", result.clauses.length);
console.log("Findings:", result.findings.length);
console.log("\nCategory summaries:");
for (const c of result.categorySummaries) {
  console.log(`  ${c.category}: ${c.riskLevel} (${c.score}) - ${c.findingCount} findings`);
}
console.log("\nTop priorities:");
for (const f of result.topPriorities) {
  console.log(`  [${f.riskLevel}] ${f.category} - ${f.whatItSays} (score ${f.score})`);
  console.log(`    signals: ${f.detectedSignals.join(", ")}`);
}
// Final repository verification marker.
