# aigc-skills

[中文](./README.zh.md) | English

Curated AIGC skills for multi-platform content creation, publishing, and media generation. The repository combines first-party skills with periodically synced skills from public GitHub projects.

## Goals

- Publish first-party AIGC skills under grouped directories.
- Integrate high-quality public AIGC skill libraries into one catalog.
- Track platform coverage across WeChat, Xiaohongshu, Douyin, Bilibili, Weibo, YouTube, X, and more.

## Layout

| Path | Purpose |
|------|---------|
| `skills/<group>-skills/<skill>/` | Grouped skill directories |
| `packages/` | Shared runtime libraries for multiple skills |
| `config/external-sources.json` | Upstream GitHub repositories to sync |
| `docs/aigc-skill-group-mapping.md` | Group-to-skill mapping table |
| `integrations/manifest.json` | Last successful sync metadata |
| `integrations/inventory.json` | Platform coverage inventory |
| `scripts/` | Sync, audit, inventory, and test utilities |

## Install

```bash
npx skills add <owner>/aigc-skills
```

Register the plugin marketplace in supported agents:

```bash
/plugin marketplace add <owner>/aigc-skills
```

## Add a first-party skill

1. Create `skills/<group>-skills/<skill-name>/SKILL.md`.
2. Register `./skills/<group>-skills/<skill-name>` in `.claude-plugin/marketplace.json`.
3. Update `docs/aigc-skill-group-mapping.md`.
4. Run `npm run audit` and `npm run inventory`.

See [docs/creating-skills.md](./docs/creating-skills.md).

## Sync external skills

1. Add repositories to [config/external-sources.json](./config/external-sources.json).
2. Preview the import plan with `npm run sync:external:dry`.
3. Apply the sync with `npm run sync:external`.
4. Register approved `integ-*` skills in `.claude-plugin/marketplace.json`.
5. Run `npm run audit` and `npm run inventory`.

See [docs/syncing-external-skills.md](./docs/syncing-external-skills.md).

## Commands

| Command | Description |
|---------|-------------|
| `npm test` | Run Node-compatible repository tests |
| `npm run audit` | Check grouped skills against marketplace registration |
| `npm run sync:external` | Import or update vendored skills |
| `npm run sync:external:dry` | Dry-run external sync |
| `npm run inventory` | Build platform inventory |

## Current Groups

- `jimeng-skills`: Jimeng prompt and CLI generation skills
