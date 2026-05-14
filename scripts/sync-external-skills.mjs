#!/usr/bin/env node

import crypto from "node:crypto";
import fs from "node:fs/promises";
import path from "node:path";

import { listReleaseFiles } from "./lib/release-files.mjs";
import {
  buildVendoredSlug,
  copyDirectory,
  loadExternalSources,
  matchesAnyPattern,
  parseSkillFrontmatter,
  removeDirectory,
  resolveRepoRoot,
  runCommand,
  writeJson,
} from "./lib/integration-utils.mjs";

const DEFAULT_CACHE_DIR = ".cache/external";
const DEFAULT_VENDORED_ROOT = "skills";
const ORIGIN_FILE = ".aigc-origin.json";

async function main() {
  const options = parseArgs(process.argv.slice(2));
  const repoRoot = resolveRepoRoot();
  const { config } = await loadExternalSources(repoRoot);
  const defaults = config.defaults ?? {};
  const enabledSources = config.sources.filter((source) => source.enabled !== false);

  if (enabledSources.length === 0) {
    console.log("No enabled external sources. Edit config/external-sources.json first.");
    return;
  }

  const cacheRoot = path.join(repoRoot, options.cacheDir);
  const vendoredRoot = path.join(repoRoot, options.vendoredRoot);
  const report = {
    generatedAt: new Date().toISOString(),
    dryRun: options.dryRun,
    sources: [],
    added: [],
    updated: [],
    removed: [],
    skipped: [],
    errors: [],
  };

  const nextManifest = {
    version: 1,
    generatedAt: report.generatedAt,
    sources: [],
    skills: [],
  };

  const expectedSlugs = new Set();

  for (const source of enabledSources) {
    const sourceReport = {
      id: source.id,
      repo: source.repo,
      ref: source.ref ?? defaults.ref ?? "main",
      commit: null,
      imported: [],
      skipped: [],
    };

    try {
      const checkout = await ensureCheckout(repoRoot, cacheRoot, source, defaults, options);
      sourceReport.commit = checkout.commit;

      const discovered = await discoverSkills(checkout.dir, source, defaults);
      for (const skill of discovered) {
        const vendoredSlug = buildVendoredSlug(source.id, skill.slug, source.rename ?? {});
        const targetDir = path.join(vendoredRoot, vendoredSlug);
        expectedSlugs.add(vendoredSlug);

        const origin = {
          sourceId: source.id,
          repo: source.repo,
          ref: sourceReport.ref,
          commit: checkout.commit,
          upstreamPath: skill.relativePath,
          upstreamSlug: skill.slug,
          vendoredSlug,
          license: source.license ?? defaults.license ?? null,
          platforms: source.platforms ?? [],
          categories: source.categories ?? [],
          syncedAt: report.generatedAt,
        };

        const fingerprint = await fingerprintDirectory(skill.absolutePath);
        const previousOrigin = await readOrigin(targetDir);
        const status =
          !previousOrigin
            ? "added"
            : previousOrigin.commit !== checkout.commit || previousOrigin.fingerprint !== fingerprint
              ? "updated"
              : "unchanged";

        if (status === "unchanged") {
          sourceReport.imported.push({ slug: vendoredSlug, status });
          nextManifest.skills.push({
            slug: vendoredSlug,
            kind: "integrated",
            ...origin,
            fingerprint,
          });
          continue;
        }

        if (options.dryRun) {
          sourceReport.imported.push({ slug: vendoredSlug, status: `would-${status}` });
          report[status === "added" ? "added" : "updated"].push(vendoredSlug);
          nextManifest.skills.push({
            slug: vendoredSlug,
            kind: "integrated",
            ...origin,
            fingerprint,
          });
          continue;
        }

        await removeDirectory(targetDir);
        await copyDirectory(skill.absolutePath, targetDir);
        await patchSkillMetadata(targetDir, vendoredSlug, origin);
        await writeJson(path.join(targetDir, ORIGIN_FILE), { ...origin, fingerprint });

        sourceReport.imported.push({ slug: vendoredSlug, status });
        report[status === "added" ? "added" : "updated"].push(vendoredSlug);
        nextManifest.skills.push({
          slug: vendoredSlug,
          kind: "integrated",
          ...origin,
          fingerprint,
        });
      }

      nextManifest.sources.push({
        id: source.id,
        repo: source.repo,
        ref: sourceReport.ref,
        commit: checkout.commit,
        importedCount: sourceReport.imported.length,
        skippedCount: sourceReport.skipped.length,
      });
    } catch (error) {
      const message = error instanceof Error ? error.message : String(error);
      sourceReport.error = message;
      report.errors.push({ sourceId: source.id, message });
    }

    report.sources.push(sourceReport);
  }

  if (!options.dryRun) {
    const removed = await removeStaleIntegratedSkills(vendoredRoot, expectedSlugs);
    report.removed.push(...removed);
    await writeJson(path.join(repoRoot, "integrations", "manifest.json"), nextManifest);
  }

  const reportDir = path.join(repoRoot, "integrations", "reports");
  await writeJson(path.join(reportDir, `sync-${report.generatedAt.replace(/[:.]/g, "-")}.json`), report);
  await writeJson(path.join(reportDir, "latest.json"), report);

  printSummary(report);
  if (report.errors.length > 0) {
    process.exitCode = 1;
  }
}

/**
 * Parse CLI arguments for the external sync command.
 */
function parseArgs(argv) {
  const options = {
    dryRun: false,
    cacheDir: DEFAULT_CACHE_DIR,
    vendoredRoot: DEFAULT_VENDORED_ROOT,
    force: false,
  };

  for (let index = 0; index < argv.length; index++) {
    const arg = argv[index];
    if (arg === "--dry-run") options.dryRun = true;
    else if (arg === "--force") options.force = true;
    else if (arg === "--cache-dir") options.cacheDir = argv[++index];
    else if (arg === "--vendored-root") options.vendoredRoot = argv[++index];
    else if (arg === "--help" || arg === "-h") {
      printHelp();
      process.exit(0);
    } else {
      throw new Error(`Unknown argument: ${arg}`);
    }
  }

  return options;
}

function printHelp() {
  console.log(`Usage: node scripts/sync-external-skills.mjs [options]

Options:
  --dry-run            Show planned imports without writing vendored skills
  --force              Re-clone cached repositories
  --cache-dir <path>   Cache directory relative to repo root (default: ${DEFAULT_CACHE_DIR})
  --vendored-root <path> Output skills root (default: ${DEFAULT_VENDORED_ROOT})
`);
}

/**
 * Clone or update a cached checkout for one external source.
 */
async function ensureCheckout(repoRoot, cacheRoot, source, defaults, options) {
  const ref = source.ref ?? defaults.ref ?? "main";
  const checkoutDir = path.join(cacheRoot, source.id);
  const gitDir = path.join(checkoutDir, ".git");

  await fs.mkdir(cacheRoot, { recursive: true });

  try {
    await fs.access(gitDir);
    if (options.force) {
      await removeDirectory(checkoutDir);
      throw new Error("force reclone");
    }
    await runCommand("git", ["-C", checkoutDir, "fetch", "--depth", "1", "origin", ref]);
    await runCommand("git", ["-C", checkoutDir, "checkout", "--force", "FETCH_HEAD"]);
  } catch {
    await removeDirectory(checkoutDir);
    await runCommand("git", [
      "clone",
      "--depth",
      "1",
      "--branch",
      ref,
      `https://github.com/${source.repo}.git`,
      checkoutDir,
    ]);
  }

  const { stdout } = await runCommand("git", ["-C", checkoutDir, "rev-parse", "HEAD"]);
  return {
    dir: checkoutDir,
    commit: stdout.trim(),
    ref,
  };
}

/**
 * Discover importable skills from a cached repository checkout.
 */
async function discoverSkills(checkoutDir, source, defaults) {
  const skillRoots = source.skillRoots ?? defaults.skillRoots ?? ["skills"];
  const include = source.include ?? [];
  const exclude = source.exclude ?? [];
  const results = [];

  for (const root of skillRoots) {
    const absoluteRoot = path.join(checkoutDir, root);
    try {
      await fs.access(absoluteRoot);
    } catch {
      continue;
    }

    const entries = await fs.readdir(absoluteRoot, { withFileTypes: true });
    for (const entry of entries) {
      if (!entry.isDirectory()) continue;
      const skillDir = path.join(absoluteRoot, entry.name);
      const skillFile = path.join(skillDir, "SKILL.md");
      try {
        await fs.access(skillFile);
      } catch {
        continue;
      }

      const relativePath = path.posix.join(root, entry.name);
      if (include.length > 0 && !matchesAnyPattern(relativePath, include) && !matchesAnyPattern(entry.name, include)) {
        continue;
      }
      if (matchesAnyPattern(relativePath, exclude) || matchesAnyPattern(entry.name, exclude)) {
        continue;
      }

      results.push({
        slug: entry.name,
        relativePath,
        absolutePath: skillDir,
      });
    }
  }

  return results;
}

/**
 * Build a stable fingerprint for a skill directory.
 */
async function fingerprintDirectory(root) {
  const files = await listReleaseFiles(root);
  const hash = crypto.createHash("sha256");
  for (const file of files) {
    hash.update(file.relPath);
    hash.update("\0");
    hash.update(file.bytes);
    hash.update("\0");
  }
  return hash.digest("hex");
}

/**
 * Read the origin metadata for an existing vendored skill.
 */
async function readOrigin(skillDir) {
  try {
    const raw = await fs.readFile(path.join(skillDir, ORIGIN_FILE), "utf8");
    return JSON.parse(raw);
  } catch {
    return null;
  }
}

/**
 * Patch vendored SKILL.md metadata after import.
 */
async function patchSkillMetadata(skillDir, vendoredSlug, origin) {
  const skillFile = path.join(skillDir, "SKILL.md");
  const content = await fs.readFile(skillFile, "utf8");
  const frontmatter = parseSkillFrontmatter(content);
  const patchedName = frontmatter.name ? vendoredSlug : vendoredSlug;
  let next = content;

  if (/^---\r?\n[\s\S]*?\r?\n---/.test(content)) {
    next = content.replace(/^---\r?\n[\s\S]*?\r?\n---/, () => {
      return `---\nname: ${patchedName}\ndescription: ${frontmatter.description ?? "Integrated AIGC skill."}\nversion: ${frontmatter.version ?? "0.0.0"}\nmetadata:\n  aigc:\n    origin:\n      sourceId: ${origin.sourceId}\n      repo: ${origin.repo}\n      upstreamSlug: ${origin.upstreamSlug}\n---`;
    });
  }

  const attribution = [
    "",
    "## Integration Attribution",
    "",
    `This skill is vendored from \`${origin.repo}\` (\`${origin.upstreamSlug}\`).`,
    "Do not edit vendored content directly; update `config/external-sources.json` and run `npm run sync:external`.",
    "",
  ].join("\n");

  if (!next.includes("## Integration Attribution")) {
    next += attribution;
  }

  await fs.writeFile(skillFile, next, "utf8");
}

/**
 * Remove integrated skills that are no longer selected by the manifest config.
 */
async function removeStaleIntegratedSkills(vendoredRoot, expectedSlugs) {
  const removed = [];
  let entries = [];
  try {
    entries = await fs.readdir(vendoredRoot, { withFileTypes: true });
  } catch {
    return removed;
  }

  for (const entry of entries) {
    if (!entry.isDirectory()) continue;
    if (!entry.name.startsWith("integ-")) continue;
    if (expectedSlugs.has(entry.name)) continue;
    await removeDirectory(path.join(vendoredRoot, entry.name));
    removed.push(entry.name);
  }

  return removed;
}

function printSummary(report) {
  console.log("AIGC external skill sync");
  console.log(`Dry run: ${report.dryRun ? "yes" : "no"}`);
  console.log(`Added: ${report.added.length}`);
  console.log(`Updated: ${report.updated.length}`);
  console.log(`Removed: ${report.removed.length}`);
  if (report.errors.length > 0) {
    console.log(`Errors: ${report.errors.length}`);
    for (const error of report.errors) {
      console.log(`- ${error.sourceId}: ${error.message}`);
    }
  }
}

main().catch((error) => {
  console.error(error instanceof Error ? error.message : String(error));
  process.exit(1);
});
