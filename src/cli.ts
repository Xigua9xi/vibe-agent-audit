#!/usr/bin/env node
import { auditRepository } from "./audit.js";

const args = process.argv.slice(2);
const pathIndex = args.indexOf("--path");
const target = pathIndex >= 0 ? args[pathIndex + 1] : ".";
const json = args.includes("--json");

if (!target) {
  console.error("Usage: vibe-agent-audit --path <repo> [--json]");
  process.exit(1);
}

const report = await auditRepository(target);

if (json) {
  console.log(JSON.stringify(report, null, 2));
} else {
  console.log(`Audit: ${report.root}`);
  for (const check of report.checks) {
    console.log(`${check.status.toUpperCase()} ${check.label}: ${check.message}`);
  }
  console.log(`Summary: ${report.summary.passed} pass, ${report.summary.warned} warn, ${report.summary.failed} fail`);
}

process.exitCode = report.summary.failed > 0 ? 1 : 0;
