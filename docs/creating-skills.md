# Creating First-Party Skills

## Layout

Follow the grouped layout used by `full-stack-skills`:

```text
skills/<group>-skills/<skill-name>/SKILL.md
```

Examples:

- `skills/wechat-skills/aigc-wechat-article-draft/SKILL.md`
- `skills/jimeng-skills/jimeng-prompt-text2image/SKILL.md`

## Requirements

| Requirement | Details |
|-------------|---------|
| Group directory | Use `<platform|vendor>-skills` |
| Skill directory | Use `aigc-<capability>` for first-party skills |
| Entry file | `SKILL.md` in the skill directory |
| Frontmatter `name` | Must equal the skill directory name |
| Registration | Add `./skills/<group>/<skill>` to `.claude-plugin/marketplace.json` |
| Mapping | Update `docs/aigc-skill-group-mapping.md` |
| Self-containment | Do not link from `SKILL.md` to repo-level docs |

## Frontmatter Template

```yaml
---
name: aigc-wechat-article-draft
description: <Third-person description with what and when to use.>
version: 0.1.0
metadata:
  openclaw:
    homepage: https://github.com/<owner>/aigc-skills#aigc-wechat-article-draft
---
```

## Recommended Folders

```text
skills/wechat-skills/aigc-wechat-article-draft/
├── SKILL.md
├── references/
├── prompts/
├── scripts/
└── EXTEND.md.example
```

## After Adding a Skill

1. Register the skill path in `.claude-plugin/marketplace.json`.
2. Update `docs/aigc-skill-group-mapping.md`.
3. Run `npm run audit`.
4. Run `npm run inventory`.
5. Update `README.md` and `README.zh.md` if the skill is user-facing.
