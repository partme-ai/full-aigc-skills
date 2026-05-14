#!/usr/bin/env node

import fs from "node:fs/promises";
import path from "node:path";

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
  generic: ["markdown", "image", "video", "audio", "translate", "infographic", "slide"],
};

async function main() {
  const repoRoot = resolveRepoRoot();
  const skillsRoot = path.join(repoRoot, "skills");
  const inventory = {
    generatedAt: new Date().toISOString(),
    firstParty: [],
    integrated: [],
    platforms: {},
  };

  for (const [platform, keywords] of Object.entries(PLATFORM_KEYWORDS)) {
    inventory.platforms[platform] = [];
  }

  const entries = await readSkillDirs(skillsRoot);
  for (const entry of entries) {
    const skillFile = path.join(entry.dir, "SKILL.md");
    const content = await fs.readFile(skillFile, "utf8");
    const frontmatter = parseSkillFrontmatter(content);
    const record = {
      slug: entry.name,
      name: frontmatter.name ?? entry.name,
      description: frontmatter.description ?? "",
      version: frontmatter.version ?? null,
      kind: entry.name.startsWith("integ-") ? "integrated" : "first-party",
    };

    if (record.kind === "integrated") {
      inventory.integrated.push(record);
    } else {
      inventory.firstParty.push(record);
    }

    const haystack = `${record.slug} ${record.name} ${record.description}`.toLowerCase();
    for (const [platform, keywords] of Object.entries(PLATFORM_KEYWORDS)) {
      if (keywords.some((keyword) => haystack.includes(keyword.toLowerCase()))) {
        inventory.platforms[platform].push(record.slug);
      }
    }
  }

  const output = path.join(repoRoot, "integrations", "inventory.json");
  await writeJson(output, inventory);
  console.log(`Inventory written to ${path.relative(repoRoot, output)}`);
  console.log(`First-party: ${inventory.firstParty.length}`);
  console.log(`Integrated: ${inventory.integrated.length}`);
}

async function readSkillDirs(skillsRoot) {
  try {
    const entries = await fs.readdir(skillsRoot, { withFileTypes: true });
    const result = [];
    for (const entry of entries) {
      if (!entry.isDirectory()) continue;
      const dir = path.join(skillsRoot, entry.name);
      try {
        await fs.access(path.join(dir, "SKILL.md"));
        result.push({ name: entry.name, dir });
      } catch {
        continue;
      }
    }
    return result.sort((left, right) => left.name.localeCompare(right.name));
  } catch {
    return [];
  }
}

main().catch((error) => {
  console.error(error instanceof Error ? error.message : String(error));
  process.exit(1);
});
