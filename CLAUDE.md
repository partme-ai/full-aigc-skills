# CLAUDE.md

AIGC skill marketplace for first-party and curated third-party skills. Version: **0.2.0**.

## Architecture

| Area | Description |
|------|-------------|
| Grouped skills | `skills/<group>-skills/<skill-name>/SKILL.md` |
| First-party skills | Authored under platform/vendor groups, usually prefixed with `aigc-` |
| Integrated skills | Vendored under `skills/integ-<source>-skills/integ-*` |
| Shared packages | `packages/*` for reusable runtime code |
| Integration metadata | `integrations/manifest.json`, `integrations/inventory.json` |

Marketplace registration follows the `full-stack-skills` model: one plugin entry per skill group.

## Conventions

- Group directories use the `*-skills` suffix.
- `SKILL.md` frontmatter `name` must equal the leaf directory name.
- Integrated skills use `integ-<sourceId>-<upstreamSlug>` unless `rename` overrides it.
- Skills must remain self-contained. Do not link from `SKILL.md` to repo-level `docs/`.

## External Sync

- Configure upstream repositories in `config/external-sources.json`.
- Vendored output lands in `skills/<targetGroup>/<integ-skill>/`.
- Run `npm run sync:external:dry` before applying changes.
- Run `npm run audit` and `npm run inventory` after registration changes.

## Author Docs

| Topic | File |
|-------|------|
| Group mapping | [docs/aigc-skill-group-mapping.md](docs/aigc-skill-group-mapping.md) |
| Creating first-party skills | [docs/creating-skills.md](docs/creating-skills.md) |
| Syncing external repositories | [docs/syncing-external-skills.md](docs/syncing-external-skills.md) |
| Platform coverage map | [docs/platforms.md](docs/platforms.md) |

## Release Checklist

1. Update `CHANGELOG.md` and `CHANGELOG.zh.md`
2. Bump `.claude-plugin/marketplace.json` version
3. Bump each changed skill `version` in `SKILL.md`
4. Refresh `docs/aigc-skill-group-mapping.md`
5. Run `npm run audit` and `npm run inventory`
