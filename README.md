# aigc-skills

[中文](./README.zh.md) | English

Curated AIGC skills for multi-platform content creation, publishing, and media generation. The repository combines first-party skills with periodically synced skills from public GitHub projects.

## Goals

- Publish your own AIGC skills under a stable `aigc-*` namespace.
- Integrate high-quality public AIGC skill libraries into one catalog.
- Track platform coverage across WeChat, Xiaohongshu, Douyin, Bilibili, Weibo, YouTube, X, and more.

## Layout

| Path | Purpose |
|------|---------|
| `skills/` | First-party `aigc-*` skills and vendored `integ-*` skills |
| `packages/` | Shared runtime libraries for multiple skills |
| `config/external-sources.json` | Upstream GitHub repositories to sync |
| `integrations/manifest.json` | Last successful sync metadata |
| `integrations/inventory.json` | Platform coverage inventory |
| `scripts/` | Sync, inventory, and test utilities |

## Install

```bash
npx skills add <owner>/aigc-skills
```

Register the plugin marketplace in supported agents:

```bash
/plugin marketplace add <owner>/aigc-skills
```

## Add a first-party skill

1. Create `skills/aigc-<name>/SKILL.md`.
2. Register `./skills/aigc-<name>` in `.claude-plugin/marketplace.json`.
3. Run `npm run inventory` to refresh platform coverage.

See [docs/creating-skills.md](./docs/creating-skills.md).

## Sync external skills

1. Add repositories to [config/external-sources.json](./config/external-sources.json).
2. Preview the import plan:

```bash
npm run sync:external:dry
```

3. Apply the sync:

```bash
npm run sync:external
```

4. Register newly vendored `integ-*` skills in `.claude-plugin/marketplace.json`.
5. Run `npm run inventory`.

See [docs/syncing-external-skills.md](./docs/syncing-external-skills.md).

## Commands

| Command | Description |
|---------|-------------|
| `npm test` | Run Node-compatible repository tests |
| `npm run sync:external` | Import or update vendored skills |
| `npm run sync:external:dry` | Dry-run external sync |
| `npm run inventory` | Build platform inventory |

## Status

Project scaffolding is ready. Add your first-party skills under `skills/aigc-*` and upstream repositories under `config/external-sources.json`.
