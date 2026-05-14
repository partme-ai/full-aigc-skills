# aigc-skills

[中文](./README.zh.md) | English

Curated AIGC skills for multi-platform content creation, publishing, and media generation. The repository hosts first-party skills and periodically syncs external skill sources.

## Goals

- Organize skills under `skills/<group>-skills/<skill-name>/`.
- Maintain multiple upstream sources in one config file.
- Re-run sync with a single Bash script.

## Layout

| Path | Purpose |
|------|---------|
| `skills/<group>-skills/<skill>/` | Grouped skill directories |
| `config/sources.conf` | External source configuration |
| `scripts/sync-sources.sh` | External sync script |
| `docs/aigc-skill-group-mapping.md` | Group mapping table |

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
2. Register the path in `.claude-plugin/marketplace.json`.
3. Update `docs/aigc-skill-group-mapping.md`.

See [docs/creating-skills.md](./docs/creating-skills.md).

## Sync external skills

1. Add one line to [config/sources.conf](./config/sources.conf).
2. Run:

```bash
./scripts/sync-sources.sh
```

3. Register new skills in `.claude-plugin/marketplace.json`.

See [docs/syncing-sources.md](./docs/syncing-sources.md).

## Commands

| Command | Description |
|---------|-------------|
| `./scripts/sync-sources.sh` | Sync all configured sources |
| `./scripts/sync-sources.sh --source pippit` | Sync one source |
| `./scripts/sync-sources.sh --dry-run` | Preview sync |
| `./scripts/sync-sources.sh --force` | Force refresh cached repositories |

## Current groups

- `jimeng-skills`: Jimeng prompt and CLI generation skills
- `pippit-skills`: Pippit / 小云雀 session skills with upstream README at the group root
- `minimax-skills`: MiniMax multimodal and music skills (only the three configured skills are synced)
