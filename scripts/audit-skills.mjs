#!/usr/bin/env node

import { createAuditReport } from "./lib/skill-catalog.mjs";
import { resolveRepoRoot } from "./lib/integration-utils.mjs";

async function main() {
  const repoRoot = resolveRepoRoot();
  const report = await createAuditReport(repoRoot);

  console.log("AIGC skills audit");
  console.log(`Skills root: ${report.skillsDir}`);
  console.log(`Groups: ${report.groupCount}`);
  console.log(`Skills: ${report.skillCount}`);
  console.log(`Missing SKILL.md directories: ${report.missingSkillDirectories.length}`);
  console.log(`Unregistered skills: ${report.unregisteredSkills.length}`);
  console.log(`Marketplace entries missing on disk: ${report.marketplaceMissingOnDisk.length}`);

  if (report.missingSkillDirectories.length > 0) {
    console.log("");
    console.log("Directories missing SKILL.md:");
    for (const entry of report.missingSkillDirectories) {
      console.log(`- ${entry}`);
    }
  }

  if (report.unregisteredSkills.length > 0) {
    console.log("");
    console.log("Skills present on disk but not in marketplace.json:");
    for (const entry of report.unregisteredSkills) {
      console.log(`- ${entry}`);
    }
  }

  if (report.marketplaceMissingOnDisk.length > 0) {
    console.log("");
    console.log("Marketplace paths missing on disk:");
    for (const entry of report.marketplaceMissingOnDisk) {
      console.log(`- ${entry}`);
    }
  }

  const hasErrors =
    report.missingSkillDirectories.length > 0 ||
    report.unregisteredSkills.length > 0 ||
    report.marketplaceMissingOnDisk.length > 0;

  if (hasErrors) {
    process.exitCode = 1;
  }
}

main().catch((error) => {
  console.error(error instanceof Error ? error.message : String(error));
  process.exit(1);
});
