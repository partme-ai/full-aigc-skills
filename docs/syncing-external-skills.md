# Syncing External Skills

External repositories are vendored into grouped directories:

```text
skills/<targetGroup>/<skill-name>/SKILL.md
```

Default `targetGroup` is `integ-<sourceId>-skills`. Vendor groups such as `pippit-skills` can preserve upstream skill names and copy the upstream README to the group root.

## Configure a Source

Edit `config/external-sources.json`:

```json
{
  "version": 1,
  "defaults": {
    "ref": "main",
    "skillRoots": ["skills"],
    "layout": "auto",
    "slugMode": "integ",
    "attribution": "section",
    "enabled": true
  },
  "sources": [
    {
      "id": "pippit",
      "remoteUrl": "https://gitee.com/Pippit-dev/pippit-skills.git",
      "ref": "master",
      "enabled": true,
      "layout": "flat",
      "targetGroup": "pippit-skills",
      "slugMode": "preserve",
      "attribution": "none",
      "groupReadme": "README.md",
      "platforms": ["generic"],
      "license": "MIT"
    }
  ]
}
```

Field reference:

| Field | Meaning |
|-------|---------|
| `repo` | GitHub `owner/name` |
| `remoteUrl` | Full git remote URL for GitHub, Gitee, or other hosts |
| `targetGroup` | Destination group under `skills/` |
| `slugMode` | `preserve` keeps upstream folder names, `integ` prefixes vendored skills |
| `attribution` | `none` keeps upstream `SKILL.md` unchanged, `section` appends integration attribution |
| `groupReadme` | Upstream README path copied verbatim to the group root |

`layout` values:

| Value | Upstream shape |
|-------|----------------|
| `flat` | `skills/<skill>/SKILL.md` |
| `grouped` | `skills/<group>/<skill>/SKILL.md` |
| `auto` | Detect per directory |

## Run Sync

All enabled sources:

```bash
npm run sync:external
```

One source:

```bash
npm run sync:external -- --source pippit
```

Shortcut for Pippit:

```bash
npm run sync:pippit
```

Dry run:

```bash
npm run sync:external:dry
```

## Review Output

- `integrations/manifest.json` stores the latest successful sync metadata.
- `integrations/reports/latest.json` stores the latest run summary.
- Vendored skills contain `.aigc-origin.json`.
- When `attribution` is `section`, `SKILL.md` also receives an integration attribution block.

## Register Imported Skills

The sync script does not edit `.claude-plugin/marketplace.json` automatically. After review:

1. Register approved skills under the matching group plugin entry.
2. Update `docs/aigc-skill-group-mapping.md`.
3. Run `npm run audit`.
4. Run `npm run inventory`.
