# Syncing External Skills

This repository vendors public skill libraries into `skills/integ-*` using `scripts/sync-external-skills.mjs`.

## Configure a Source

Edit `config/external-sources.json`:

```json
{
  "version": 1,
  "defaults": {
    "ref": "main",
    "skillRoots": ["skills"],
    "enabled": true
  },
  "sources": [
    {
      "id": "baoyu",
      "repo": "JimLiu/baoyu-skills",
      "ref": "main",
      "platforms": ["wechat", "weibo", "x", "youtube"],
      "categories": ["content", "utility"],
      "include": ["baoyu-post-to-wechat", "baoyu-post-to-weibo", "baoyu-post-to-x"],
      "rename": {
        "baoyu-post-to-wechat": "integ-baoyu-wechat-publish"
      },
      "license": "MIT-0",
      "notes": "Example entry only. Remove or disable until you confirm licensing."
    }
  ]
}
```

Field reference:

| Field | Meaning |
|-------|---------|
| `id` | Stable cache namespace under `.cache/external/` |
| `repo` | GitHub `owner/name` |
| `ref` | Branch, tag, or commit to fetch |
| `skillRoots` | Directories that contain one skill per folder |
| `include` | Optional allowlist by folder name or relative path |
| `exclude` | Optional denylist |
| `rename` | Optional vendored slug overrides |
| `platforms` | Coverage tags used by `build-inventory.mjs` |
| `license` | Recorded in origin metadata |

## Run Sync

Dry run:

```bash
npm run sync:external:dry
```

Apply:

```bash
npm run sync:external
```

Force refresh cached repositories:

```bash
node ./scripts/sync-external-skills.mjs --force
```

## Review Output

- `integrations/manifest.json` stores the latest successful sync metadata.
- `integrations/reports/latest.json` stores the latest run summary.
- Each vendored skill contains `.aigc-origin.json` and an `## Integration Attribution` section in `SKILL.md`.

## Register Imported Skills

The sync script does not edit `.claude-plugin/marketplace.json` automatically. After review, register approved `integ-*` skills manually.

## Periodic Integration

Recommended cadence:

1. Update `config/external-sources.json`.
2. Run `npm run sync:external:dry`.
3. Review attribution, licenses, and platform coverage.
4. Run `npm run sync:external`.
5. Register approved skills and run `npm run inventory`.
