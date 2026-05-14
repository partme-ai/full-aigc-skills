import fs from "node:fs/promises";
import path from "node:path";
import { spawn } from "node:child_process";

/**
 * Resolve the repository root from the current working directory.
 */
export function resolveRepoRoot(cwd = process.cwd()) {
  return path.resolve(cwd);
}

/**
 * Load and validate the external sources configuration file.
 */
export async function loadExternalSources(repoRoot) {
  const configPath = path.join(repoRoot, "config", "external-sources.json");
  const raw = await fs.readFile(configPath, "utf8");
  const config = JSON.parse(raw);
  if (!config || typeof config !== "object" || !Array.isArray(config.sources)) {
    throw new Error("Invalid external-sources.json: expected { sources: [] }");
  }
  return { configPath, config };
}

/**
 * Run a subprocess and capture stdout/stderr.
 */
export function runCommand(command, args, options = {}) {
  return new Promise((resolve, reject) => {
    const child = spawn(command, args, {
      stdio: ["ignore", "pipe", "pipe"],
      ...options,
    });
    let stdout = "";
    let stderr = "";
    child.stdout.on("data", (chunk) => {
      stdout += chunk.toString();
    });
    child.stderr.on("data", (chunk) => {
      stderr += chunk.toString();
    });
    child.on("error", reject);
    child.on("close", (code) => {
      if (code === 0) {
        resolve({ stdout, stderr });
        return;
      }
      reject(new Error(`${command} ${args.join(" ")} failed (${code}): ${stderr || stdout}`));
    });
  });
}

/**
 * Convert a glob-like pattern with * into a RegExp.
 */
export function globToRegExp(pattern) {
  const escaped = pattern
    .replace(/[.+^${}()|[\]\\]/g, "\\$&")
    .replace(/\*\*/g, "§§")
    .replace(/\*/g, "[^/]*")
    .replace(/§§/g, ".*");
  return new RegExp(`^${escaped}$`);
}

/**
 * Match a relative path against include/exclude glob patterns.
 */
export function matchesAnyPattern(relPath, patterns) {
  if (!patterns || patterns.length === 0) return false;
  return patterns.some((pattern) => globToRegExp(pattern).test(relPath));
}

/**
 * Normalize a skill slug for vendored skills.
 */
export function buildVendoredSlug(sourceId, originalSlug, renameMap = {}, options = {}) {
  if (renameMap[originalSlug]) {
    return renameMap[originalSlug];
  }
  if (options.slugMode === "preserve" || originalSlug.startsWith("integ-")) {
    return originalSlug;
  }
  return `integ-${sourceId}-${originalSlug}`;
}

/**
 * Resolve the destination group directory for a vendored skill.
 */
export function resolveTargetGroup(source, defaults = {}) {
  if (source.targetGroup) {
    return source.targetGroup;
  }
  if (defaults.targetGroup) {
    return defaults.targetGroup;
  }
  return `integ-${source.id}-skills`;
}

/**
 * Resolve the git remote URL for an external source.
 */
export function resolveSourceRemote(source, defaults = {}) {
  const remoteUrl = source.remoteUrl ?? defaults.remoteUrl;
  if (remoteUrl) {
    return remoteUrl;
  }
  if (!source.repo) {
    throw new Error(`External source "${source.id}" is missing both repo and remoteUrl`);
  }
  return `https://github.com/${source.repo}.git`;
}

/**
 * Resolve how vendored skill directories should be named.
 */
export function resolveSlugMode(source, defaults = {}) {
  return source.slugMode ?? defaults.slugMode ?? "integ";
}

/**
 * Resolve whether vendored SKILL.md files should be rewritten.
 */
export function resolveAttribution(source, defaults = {}) {
  return source.attribution ?? defaults.attribution ?? "section";
}

/**
 * Parse simple YAML frontmatter from SKILL.md.
 */
export function parseSkillFrontmatter(content) {
  const match = content.match(/^---\r?\n([\s\S]*?)\r?\n---/);
  if (!match) return {};
  const lines = match[1].split(/\r?\n/);
  const result = {};
  for (const line of lines) {
    const idx = line.indexOf(":");
    if (idx === -1) continue;
    const key = line.slice(0, idx).trim();
    const value = line.slice(idx + 1).trim().replace(/^['"]|['"]$/g, "");
    if (key) result[key] = value;
  }
  return result;
}

/**
 * Recursively copy a directory while skipping cache/build folders.
 */
export async function copyDirectory(src, dest, options = {}) {
  const skippedDirs = options.skippedDirs ?? new Set([".git", "node_modules", "dist", "build", "out"]);
  await fs.mkdir(dest, { recursive: true });
  const entries = await fs.readdir(src, { withFileTypes: true });
  for (const entry of entries) {
    if (entry.isDirectory() && skippedDirs.has(entry.name)) continue;
    const from = path.join(src, entry.name);
    const to = path.join(dest, entry.name);
    if (entry.isDirectory()) {
      await copyDirectory(from, to, options);
      continue;
    }
    if (!entry.isFile()) continue;
    await fs.mkdir(path.dirname(to), { recursive: true });
    await fs.copyFile(from, to);
  }
}

/**
 * Remove a directory if it exists.
 */
export async function removeDirectory(target) {
  await fs.rm(target, { recursive: true, force: true });
}

/**
 * Write JSON with stable formatting.
 */
export async function writeJson(filePath, value) {
  await fs.mkdir(path.dirname(filePath), { recursive: true });
  await fs.writeFile(filePath, `${JSON.stringify(value, null, 2)}\n`, "utf8");
}
