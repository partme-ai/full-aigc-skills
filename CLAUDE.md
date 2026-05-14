# CLAUDE.md

AIGC skill marketplace for first-party and curated third-party skills. Version: **0.1.0**.

## Architecture

| Area | Description |
|------|-------------|
| First-party skills | `skills/aigc-*` authored in this repository |
| Integrated skills | `skills/integ-*` vendored from `config/external-sources.json` |
| Shared packages | `packages/*` for reusable runtime code |
| Integration metadata | `integrations/manifest.json`, `integrations/inventory.json` |

All published skills are registered in `.claude-plugin/marketplace.json` under the single `aigc-skills` plugin entry.

## Conventions

- First-party skills MUST use the `aigc-` prefix.
- Integrated skills MUST use the `integ-<sourceId>-<upstreamSlug>` prefix unless `rename` overrides it.
- Each skill folder MUST contain `SKILL.md` with YAML frontmatter.
- Skills MUST remain self-contained. Do not link from `SKILL.md` to repo-level `docs/`.

## External Sync

- Configure upstream repositories in `config/external-sources.json`.
- Run `npm run sync:external:dry` before applying changes.
- Run `npm run sync:external` to vendor skills into `skills/`.
- Review `integrations/reports/latest.json` after each sync.
- Register newly imported skills in `marketplace.json`.

## Author Docs

| Topic | File |
|-------|------|
| Creating first-party skills | [docs/creating-skills.md](docs/creating-skills.md) |
| Syncing external repositories | [docs/syncing-external-skills.md](docs/syncing-external-skills.md) |
| Platform coverage map | [docs/platforms.md](docs/platforms.md) |

## Release Checklist

1. Update `CHANGELOG.md` and `CHANGELOG.zh.md`
2. Bump `.claude-plugin/marketplace.json` version
3. Bump each changed skill `version` in `SKILL.md`
4. Refresh `integrations/inventory.json` when skill coverage changes
