import test from "node:test";
import assert from "node:assert/strict";
import { mkdir, writeFile } from "node:fs/promises";
import { join } from "node:path";
import { tmpdir } from "node:os";
import { auditRepository } from "../dist/audit.js";

async function makeRepo(files) {
  const root = join(tmpdir(), `vibe-agent-audit-${Date.now()}-${Math.random()}`);
  await mkdir(root, { recursive: true });
  for (const [file, content] of Object.entries(files)) {
    const fullPath = join(root, file);
    await mkdir(fullPath.slice(0, fullPath.lastIndexOf("\\")), { recursive: true });
    await writeFile(fullPath, content);
  }
  return root;
}

test("reports a healthy agent repository as passing core checks", async () => {
  const root = await makeRepo({
    "README.md": "# Demo\n\nA real agent project.",
    "LICENSE": "MIT",
    "AGENTS.md": "# Agent instructions",
    "package.json": JSON.stringify({ scripts: { test: "node --test" } }),
    "skills/demo/SKILL.md": "# Demo skill"
  });

  const report = await auditRepository(root);

  assert.equal(report.summary.failed, 0);
  assert.equal(report.summary.agentFiles, 2);
  assert.equal(report.checks.find((check) => check.id === "readme").status, "pass");
  assert.equal(report.checks.find((check) => check.id === "test-script").status, "pass");
});

test("flags missing README and license without throwing", async () => {
  const root = await makeRepo({
    "AGENTS.md": "# Agent instructions",
    "package.json": JSON.stringify({ scripts: { test: "node --test" } })
  });

  const report = await auditRepository(root);

  assert.equal(report.checks.find((check) => check.id === "readme").status, "fail");
  assert.equal(report.checks.find((check) => check.id === "license").status, "fail");
  assert.equal(report.summary.failed, 2);
});

test("returns a graceful warning when no agent or skill files exist", async () => {
  const root = await makeRepo({
    "README.md": "# Demo",
    "LICENSE": "MIT",
    "package.json": JSON.stringify({ scripts: { test: "node --test" } })
  });

  const report = await auditRepository(root);

  assert.equal(report.summary.agentFiles, 0);
  assert.equal(report.checks.find((check) => check.id === "agent-files").status, "warn");
});
