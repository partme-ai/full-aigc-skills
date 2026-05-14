# Syncing External Skills

External repositories are vendored into grouped directories:

```text
skills/<targetGroup>/<integ-skill>/SKILL.md
```

Default `targetGroup` is `integ-<sourceId>-skills`.

## Configure a Source

Edit `config/external-sources.json`:

```json
{
  "version": 1,
  "defaults": {
    "ref": "main",
    "skillRoots": ["skills"],
    "layout": "auto",
    "enabled": true
  },
  "sources": [
    {
      "id": "baoyu",
      "repo": "JimLiu/baoyu-skills",
      "ref": "main",
      "enabled": false,
      "layout": "flat",
      "targetGroup": "integ-baoyu-skills",
      "platforms": ["wechat", "weibo", "x", "youtube"],
      "categories": ["content", "utility"],
      "include": [
        "baoyu-post-to-wechat",
        "baoyu-post-to-weibo",
        "baoyu-post-to-x"
      ],
      "license": "MIT-0"
    }
  ]
}
```

`layout` values:

| Value | Upstream shape |
|-------|----------------|
| `flat` | `skills/<skill>/SKILL.md` |
| `grouped` | `skills/<group>/<skill>/SKILL.md` |
| `auto` | Detect per directory |

## Run Sync

Dry run:

```bash
npm run sync:external:dry
```

Apply:

```bash
npm run sync:external
```

## Review Output

- `integrations/manifest.json` stores the latest successful sync metadata.
- `integrations/reports/latest.json` stores the latest run summary.
- Each vendored skill contains `.aigc-origin.json` and an `## Integration Attribution` section in `SKILL.md`.

## Register Imported Skills

The sync script does not edit `.claude-plugin/marketplace.json` automatically. After review:

1. Register approved skills under the matching `integ-*` plugin entry.
2. Update `docs/aigc-skill-group-mapping.md`.
3. Run `npm run audit`.
4. Run `npm run inventory`.
