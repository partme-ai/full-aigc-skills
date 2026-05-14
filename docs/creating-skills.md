# Creating First-Party Skills

## Requirements

| Requirement | Details |
|-------------|---------|
| Prefix | Use `aigc-` for first-party skills |
| Entry file | `skills/aigc-<name>/SKILL.md` |
| Registration | Add `./skills/aigc-<name>` to `.claude-plugin/marketplace.json` |
| Self-containment | Do not link from `SKILL.md` to repo-level docs |

## Frontmatter Template

```yaml
---
name: aigc-<name>
description: <Third-person description with what and when to use.>
version: 0.1.0
metadata:
  openclaw:
    homepage: https://github.com/<owner>/aigc-skills#aigc-<name>
---
```

## Recommended Folders

```text
skills/aigc-example/
├── SKILL.md
├── references/
├── prompts/
├── scripts/
└── EXTEND.md.example
```

## After Adding a Skill

1. Register the skill path in `.claude-plugin/marketplace.json`.
2. Run `npm run inventory`.
3. Update `README.md` and `README.zh.md` if the skill is user-facing.
