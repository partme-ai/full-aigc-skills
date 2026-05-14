# CLAUDE.md

AIGC skill marketplace for first-party and synced third-party skills. Version: **0.4.0**.

## Architecture

| Area | Description |
|------|-------------|
| Grouped skills | `skills/<group>-skills/<skill-name>/SKILL.md` |
| First-party skills | Authored directly in grouped directories |
| Synced skills | Pulled by `scripts/sync-sources.sh` from `config/sources.conf` |

Marketplace registration follows one plugin entry per skill group.

## Sync

- Configure sources in `config/sources.conf`.
- Run `./scripts/sync-sources.sh`.
- Register approved skills in `.claude-plugin/marketplace.json`.

## Author Docs

| Topic | File |
|-------|------|
| Group mapping | [docs/aigc-skill-group-mapping.md](docs/aigc-skill-group-mapping.md) |
| Creating first-party skills | [docs/creating-skills.md](docs/creating-skills.md) |
| Syncing external repositories | [docs/syncing-sources.md](docs/syncing-sources.md) |
