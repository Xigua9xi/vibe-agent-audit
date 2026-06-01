import { readdir, readFile } from "node:fs/promises";
import { join } from "node:path";

const roots = ["src", "test", "scripts"];
const banned = [
  ["TODO", "fake"].join(" "),
  ["star", "count"].join(" "),
  ["download", "count"].join(" ")
];
let failures = 0;

async function walk(dir) {
  let entries = [];
  try {
    entries = await readdir(dir, { withFileTypes: true });
  } catch {
    return;
  }
  for (const entry of entries) {
    const fullPath = join(dir, entry.name);
    if (entry.isDirectory()) {
      await walk(fullPath);
    } else if (/\.(ts|mjs|md)$/.test(entry.name)) {
      const text = await readFile(fullPath, "utf8");
      for (const phrase of banned) {
        if (text.includes(phrase)) {
          console.error(`${fullPath}: banned phrase "${phrase}"`);
          failures += 1;
        }
      }
    }
  }
}

for (const root of roots) {
  await walk(root);
}

process.exitCode = failures === 0 ? 0 : 1;
