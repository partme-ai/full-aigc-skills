import fs from "node:fs/promises";
import path from "node:path";

const IGNORED_DIR_NAMES = new Set(["__pycache__", "node_modules"]);
const IGNORED_FILE_NAMES = new Set([".DS_Store"]);

/**
 * Resolve the skills root directory for this repository.
 */
export async function resolveSkillsRoot(repoRoot) {
  const skillsDir = path.join(repoRoot, "skills");
  try {
    await fs.access(skillsDir);
    return skillsDir;
  } catch {
    throw new Error(`Unable to locate skills directory: ${skillsDir}`);
  }
}

/**
 * Discover grouped skill entries under skills/<group>/<skill>/SKILL.md.
 */
export async function discoverSkillEntries(skillsDir) {
  const groups = await fs.readdir(skillsDir, { withFileTypes: true });
  const entries = [];

  for (const group of groups) {
    if (!group.isDirectory() || group.name.startsWith(".") || IGNORED_DIR_NAMES.has(group.name)) {
      continue;
    }

    const groupDir = path.join(skillsDir, group.name);
    const candidates = await fs.readdir(groupDir, { withFileTypes: true });
    for (const candidate of candidates) {
      if (!candidate.isDirectory() || candidate.name.startsWith(".") || IGNORED_DIR_NAMES.has(candidate.name)) {
        continue;
      }

      const absoluteDir = path.join(groupDir, candidate.name);
      const skillFile = path.join(absoluteDir, "SKILL.md");
      try {
        await fs.access(skillFile);
      } catch {
        continue;
      }

      entries.push({
        name: candidate.name,
        group: group.name,
        dir: absoluteDir,
        relativeDir: path.posix.join("skills", group.name, candidate.name),
        marketplacePath: `./skills/${group.name}/${candidate.name}`,
        skillFile,
      });
    }
  }

  return entries.sort((left, right) => left.relativeDir.localeCompare(right.relativeDir));
}

/**
 * Find grouped directories that are missing SKILL.md.
 */
export async function findMissingSkillDirectories(skillsDir) {
  const groups = await fs.readdir(skillsDir, { withFileTypes: true });
  const missing = [];

  for (const group of groups) {
    if (!group.isDirectory() || group.name.startsWith(".") || IGNORED_DIR_NAMES.has(group.name)) {
      continue;
    }

    const groupDir = path.join(skillsDir, group.name);
    const candidates = await fs.readdir(groupDir, { withFileTypes: true });
    for (const candidate of candidates) {
      if (!candidate.isDirectory() || candidate.name.startsWith(".") || IGNORED_DIR_NAMES.has(candidate.name)) {
        continue;
      }

      const absoluteDir = path.join(groupDir, candidate.name);
      const skillFile = path.join(absoluteDir, "SKILL.md");
      try {
        await fs.access(skillFile);
      } catch {
        missing.push(path.posix.join("skills", group.name, candidate.name));
      }
    }
  }

  return missing.sort();
}

/**
 * Load marketplace skill paths from .claude-plugin/marketplace.json.
 */
export async function loadMarketplaceSkillPaths(repoRoot) {
  const marketplacePath = path.join(repoRoot, ".claude-plugin", "marketplace.json");
  const raw = await fs.readFile(marketplacePath, "utf8");
  const marketplace = JSON.parse(raw);
  const paths = new Set();

  for (const plugin of marketplace.plugins ?? []) {
    for (const skillPath of plugin.skills ?? []) {
      paths.add(normalizeMarketplacePath(skillPath));
    }
  }

  return { marketplacePath, paths };
}

/**
 * Normalize marketplace skill paths for comparison.
 */
export function normalizeMarketplacePath(skillPath) {
  return skillPath.replace(/^\.\//, "").replace(/\\/g, "/");
}

/**
 * Build an audit report for grouped skills and marketplace registration.
 */
export async function createAuditReport(repoRoot) {
  const skillsDir = await resolveSkillsRoot(repoRoot);
  const entries = await discoverSkillEntries(skillsDir);
  const missing = await findMissingSkillDirectories(skillsDir);
  const { paths: marketplacePaths } = await loadMarketplaceSkillPaths(repoRoot);

  const discoveredPaths = new Set(entries.map((entry) => entry.relativeDir.replace(/^skills\//, "skills/")));
  const marketplaceRelative = new Set(
    [...marketplacePaths].map((entry) => entry.replace(/^\.\//, "")),
  );

  const unregistered = entries
    .filter((entry) => !marketplacePaths.has(normalizeMarketplacePath(entry.marketplacePath)))
    .map((entry) => entry.relativeDir);

  const entryPaths = new Set(entries.map((entry) => normalizeMarketplacePath(entry.marketplacePath)));
  const missingOnDisk = [...marketplacePaths].filter((entry) => !entryPaths.has(entry));

  return {
    skillsDir,
    skillCount: entries.length,
    groupCount: new Set(entries.map((entry) => entry.group)).size,
    missingSkillDirectories: missing,
    unregisteredSkills: unregistered.sort(),
    marketplaceMissingOnDisk: missingOnDisk.sort(),
    discoveredPaths: [...discoveredPaths].sort(),
    marketplacePaths: [...marketplaceRelative].sort(),
  };
}
