#!/usr/bin/env node

import fs from "node:fs/promises";
import path from "node:path";
import { spawn } from "node:child_process";
import { fileURLToPath, pathToFileURL } from "node:url";

const ROOT = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "..");

async function collectTestFiles(dir) {
  const files = [];
  const entries = await fs.readdir(dir, { withFileTypes: true });
  for (const entry of entries) {
    const fullPath = path.join(dir, entry.name);
    if (entry.isDirectory()) {
      if (entry.name === "node_modules" || entry.name === ".cache") continue;
      files.push(...(await collectTestFiles(fullPath)));
      continue;
    }
    if (!entry.isFile()) continue;
    if (!/\.test\.(mjs|js|ts)$/.test(entry.name)) continue;
    const source = await fs.readFile(fullPath, "utf8");
    if (source.includes("bun:test")) continue;
    files.push(fullPath);
  }
  return files;
}

async function main() {
  const testFiles = await collectTestFiles(ROOT);
  if (testFiles.length === 0) {
    console.log("No Node-compatible tests found.");
    return;
  }

  await new Promise((resolve, reject) => {
    const child = spawn(process.execPath, ["--test", ...testFiles], {
      stdio: "inherit",
      cwd: ROOT,
    });
    child.on("error", reject);
    child.on("close", (code) => {
      if (code === 0) resolve();
      else reject(new Error(`Tests failed with exit code ${code}`));
    });
  });
}

if (import.meta.url === pathToFileURL(process.argv[1]).href) {
  main().catch((error) => {
    console.error(error instanceof Error ? error.message : String(error));
    process.exit(1);
  });
}

export { collectTestFiles };
