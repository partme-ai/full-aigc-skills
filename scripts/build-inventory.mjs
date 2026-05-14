#!/usr/bin/env node

import fs from "node:fs/promises";
import path from "node:path";

import { discoverSkillEntries, resolveSkillsRoot } from "./lib/skill-catalog.mjs";
import { loadExternalSources, parseSkillFrontmatter, resolveRepoRoot, writeJson } from "./lib/integration-utils.mjs";

const PLATFORM_KEYWORDS = {
  wechat: ["wechat", "weixin", "公众号", "微信"],
  xiaohongshu: ["xhs", "xiaohongshu", "小红书", "rednote"],
  douyin: ["douyin", "tiktok", "抖音"],
  bilibili: ["bilibili", "b站", "哔哩哔哩"],
  weibo: ["weibo", "微博"],
  youtube: ["youtube", "yt"],
  x: ["post-to-x", "twitter", "x.com"],
  instagram: ["instagram", "ins"],
  linkedin: ["linkedin"],
  kuaishou: ["kuaishou", "快手"],
  zhihu: ["zhihu", "知乎"],
  jimeng: ["jimeng", "即梦", "seedance", "seedream"],
  generic: ["markdown", "image", "video", "audio", "translate", "infographic", "slide", "prompt"],
};

async function main() {
  const repoRoot = resolveRepoRoot();
  const skillsDir = await resolveSkillsRoot(repoRoot);
  const { config } = await loadExternalSources(repoRoot);
  const sourcePlatforms = buildSourcePlatformMap(config.sources ?? []);

  const inventory = {
    generatedAt: new Date().toISOString(),
    layout: "skills/<group>-skills/<skill-name>/SKILL.md",
    groups: {},
    firstParty: [],
    integrated: [],
    platforms: {},
  };

  for (const [platform, keywords] of Object.entries(PLATFORM_KEYWORDS)) {
    inventory.platforms[platform] = [];
  }

  const entries = await discoverSkillEntries(skillsDir);
  for (const entry of entries) {
    const content = await fs.readFile(entry.skillFile, "utf8");
    const frontmatter = parseSkillFrontmatter(content);
    const origin = await readOrigin(entry.dir);
    const record = {
      group: entry.group,
      slug: entry.name,
      path: entry.relativeDir,
      name: frontmatter.name ?? entry.name,
      description: frontmatter.description ?? "",
      version: frontmatter.version ?? null,
      kind: origin || entry.name.startsWith("integ-") ? "integrated" : "first-party",
      platforms: origin?.platforms ?? sourcePlatforms.get(origin?.sourceId) ?? [],
    };

    if (!inventory.groups[entry.group]) {
      inventory.groups[entry.group] = [];
    }
    inventory.groups[entry.group].push(record.slug);

    if (record.kind === "integrated") {
      inventory.integrated.push(record);
    } else {
      inventory.firstParty.push(record);
    }

    const haystack = `${record.group} ${record.slug} ${record.name} ${record.description}`.toLowerCase();
    const matchedPlatforms = new Set(record.platforms);
    for (const [platform, keywords] of Object.entries(PLATFORM_KEYWORDS)) {
      if (keywords.some((keyword) => haystack.includes(keyword.toLowerCase()))) {
        matchedPlatforms.add(platform);
      }
    }

    for (const platform of matchedPlatforms) {
      if (!inventory.platforms[platform]) {
        inventory.platforms[platform] = [];
      }
      inventory.platforms[platform].push(`${entry.group}/${entry.name}`);
    }
  }

  const output = path.join(repoRoot, "integrations", "inventory.json");
  await writeJson(output, inventory);
  console.log(`Inventory written to ${path.relative(repoRoot, output)}`);
  console.log(`Groups: ${Object.keys(inventory.groups).length}`);
  console.log(`First-party: ${inventory.firstParty.length}`);
  console.log(`Integrated: ${inventory.integrated.length}`);
}

function buildSourcePlatformMap(sources) {
  const map = new Map();
  for (const source of sources) {
    if (Array.isArray(source.platforms)) {
      map.set(source.id, source.platforms);
    }
  }
  return map;
}

async function readOrigin(skillDir) {
  try {
    const raw = await fs.readFile(path.join(skillDir, ".aigc-origin.json"), "utf8");
    return JSON.parse(raw);
  } catch {
    return null;
  }
}

main().catch((error) => {
  console.error(error instanceof Error ? error.message : String(error));
  process.exit(1);
});
