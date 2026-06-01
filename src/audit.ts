import { readdir, readFile, stat } from "node:fs/promises";
import { join, relative } from "node:path";

export type CheckStatus = "pass" | "warn" | "fail";

export interface AuditCheck {
  id: string;
  label: string;
  status: CheckStatus;
  message: string;
}

export interface AuditReport {
  root: string;
  checks: AuditCheck[];
  summary: {
    passed: number;
    warned: number;
    failed: number;
    agentFiles: number;
  };
}

const ignoredDirectories = new Set([".git", "node_modules", "dist", "coverage"]);

export async function auditRepository(root: string): Promise<AuditReport> {
  const files = await listFiles(root);
  const normalized = files.map((file) => file.replace(/\\/g, "/"));
  const packageJson = await readPackageJson(root);
  const agentFiles = normalized.filter(isAgentFile);

  const checks: AuditCheck[] = [
    fileCheck("readme", "README present", hasFile(normalized, ["README.md", "readme.md"]), "Repository has a README.", "Repository is missing a README.md."),
    fileCheck("license", "License present", hasFile(normalized, ["LICENSE", "LICENSE.md", "license", "license.md"]), "Repository has a license file.", "Repository is missing a license file."),
    {
      id: "agent-files",
      label: "Agent or skill files present",
      status: agentFiles.length > 0 ? "pass" : "warn",
      message: agentFiles.length > 0 ? `Found ${agentFiles.length} agent or skill file(s).` : "No AGENTS.md or SKILL.md files found."
    },
    {
      id: "test-script",
      label: "Test script present",
      status: packageJson?.scripts?.test ? "pass" : "warn",
      message: packageJson?.scripts?.test ? "package.json defines a test script." : "No package.json test script found."
    }
  ];

  return {
    root,
    checks,
    summary: {
      passed: checks.filter((check) => check.status === "pass").length,
      warned: checks.filter((check) => check.status === "warn").length,
      failed: checks.filter((check) => check.status === "fail").length,
      agentFiles: agentFiles.length
    }
  };
}

async function listFiles(root: string, current = root): Promise<string[]> {
  const entries = await readdir(current, { withFileTypes: true });
  const files: string[] = [];

  for (const entry of entries) {
    const fullPath = join(current, entry.name);
    if (entry.isDirectory()) {
      if (!ignoredDirectories.has(entry.name)) {
        files.push(...await listFiles(root, fullPath));
      }
    } else {
      files.push(relative(root, fullPath));
    }
  }

  return files;
}

async function readPackageJson(root: string): Promise<{ scripts?: Record<string, string> } | undefined> {
  try {
    const packagePath = join(root, "package.json");
    if (!(await stat(packagePath)).isFile()) {
      return undefined;
    }
    return JSON.parse(await readFile(packagePath, "utf8")) as { scripts?: Record<string, string> };
  } catch {
    return undefined;
  }
}

function hasFile(files: string[], candidates: string[]): boolean {
  const lower = new Set(files.map((file) => file.toLowerCase()));
  return candidates.some((candidate) => lower.has(candidate.toLowerCase()));
}

function fileCheck(id: string, label: string, found: boolean, passMessage: string, failMessage: string): AuditCheck {
  return {
    id,
    label,
    status: found ? "pass" : "fail",
    message: found ? passMessage : failMessage
  };
}

function isAgentFile(file: string): boolean {
  return file === "AGENTS.md" || file.endsWith("/AGENTS.md") || file === "SKILL.md" || file.endsWith("/SKILL.md");
}
