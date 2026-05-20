# CLAUDE.md

AIGC 技能聚合仓库 — 面向国内 AIGC 生成平台的技能市场。Version: **0.4.3**

## 定位

本仓库是一个**技能聚合器（Skill Aggregator）**，不是单一技能项目。汇集自研（first-party）和外部同步（integrated）两类技能，通过 OpenClaw 插件市场分发给 AI Agent。

**边界**：国内 AIGC **生成**平台（图像、音乐、视频）。内容发布、海外平台、[baoyu-skills](https://github.com/JimLiu/baoyu-skills) 不在此仓库。

## 架构

```
skills/<group>-skills/<skill-name>/SKILL.md
```

| 来源 | 方式 | 组 | 技能数 |
|------|------|-----|--------|
| **自研** | 直接在仓库内维护 | jimeng-skills, coze-skills, zhipu-skills, kling-skills, id-photo-skills | 12 + 6 + 8 + 2 + 1 |
| **同步** | `scripts/sync-sources.sh` 从上游 git 拉取 | pippit-skills, minimax-skills, remotion-skills | 1 + 3 + 1 |

**关键原则**：
- **聚合 ≠ 分叉** — 同步技能是单向镜像，保留 `.source-sync.json` 溯源，可被重新同步覆盖
- **分组即插件** — 每个 `*-skills` 目录对应 `.claude-plugin/marketplace.json` 一个 plugin entry，用户可按组安装
- **技能自包含** — SKILL.md 不得链接到仓库级文档，技能可独立分发
- **提示词与执行分离** — `prompt-*` 负责写提示词，`cli-*` 负责调 CLI，agent 组合使用

## 目录

| 路径 | 作用 |
|------|------|
| `skills/<group>-skills/<skill>/` | 分组技能目录 |
| `.claude-plugin/marketplace.json` | 插件市场注册 |
| `config/sources.conf` | 外部同步源配置 |
| `scripts/sync-sources.sh` | 同步脚本 |
| `docs/aigc-skill-group-mapping.md` | 分组映射表（权威） |
| `docs/architecture.md` | 架构设计文档 |
| `integrations/` | 同步追踪（manifest, inventory, reports） |

## 添加自研技能

1. 创建 `skills/<group>-skills/<skill-name>/SKILL.md`
2. `name` 必须等于目录名，description 包含触发条件
3. 在 `.claude-plugin/marketplace.json` 对应 group 的 `skills` 数组中注册
4. 更新 `docs/aigc-skill-group-mapping.md`

## Commands

| Command | Description |
|---------|-------------|
| `./scripts/sync-sources.sh` | 全量同步外部技能 |
| `./scripts/sync-sources.sh --source <id>` | 同步指定来源 |
| `./scripts/sync-sources.sh --dry-run` | 预览同步 |
| `./scripts/sync-sources.sh --force` | 强制重新拉取 |
| `./scripts/post-sync-fix.sh` | 同步后自动修复已知规范违规 |
| `./scripts/post-sync-fix.sh --check` | 仅检查，不修改 |

## 同步外部技能

```bash
# 完整同步 + 修复 + 验证流程
./scripts/sync-sources.sh && ./scripts/post-sync-fix.sh
```

同步后需手动注册新技能到 marketplace 并更新映射表。

## Skill 规范合规

所有技能（自研 + 同步）必须通过 `skill-creator/scripts/quick_validate.py` 验证：

- `name`: 连字符命名，与目录名一致，最长 64 字符
- `description`: 最长 1024 字符，无尖括号，YAML 中冒号需转义
- 允许的 frontmatter 键: `name`, `description`, `license`, `allowed-tools`, `metadata`
- 禁止 skill 目录内出现: `README.md`, `CHANGELOG.md`, `.gitignore`, `.DS_Store`
- 只允许 `scripts/`, `references/`, `assets/` 子目录

## 当前技能全景

```
skills/
├── coze-skills/           ✅ 自研，已注册
│   ├── coze-asr
│   ├── coze-image-gen
│   ├── coze-tts
│   ├── coze-voice-gen
│   ├── coze-web-fetch
│   └── coze-web-search
├── id-photo-skills/       ✅ API 驱动，已注册
│   └── id-photo
├── jimeng-skills/         ✅ 自研，已注册
│   ├── jimeng-cli-*       (4) dreamina CLI 执行
│   ├── jimeng-opencli-*   (4) 浏览器编排
│   └── jimeng-prompt-*    (4) 提示词工程
├── kling-skills/          ✅ 自研，已注册 (适配自开源)
│   ├── kling-prompt
│   └── kling-video
├── minimax-skills/        ✅ 同步自 MiniMax-AI/skills
│   ├── minimax-multimodal-toolkit
│   ├── minimax-music-gen
│   └── minimax-music-playlist
├── pippit-skills/         ✅ 同步自 Pippit-dev/pippit-skills
│   └── xyq-nest-skill
└── remotion-skills/       ✅ 同步自 remotion-dev/skills
    └── remotion
└── zhipu-skills/         ✅ 自研，已注册 (适配自开源)
    ├── zhipu-audio
    ├── zhipu-embedding
    ├── zhipu-humanoid
    ├── zhipu-image-generation
    ├── zhipu-ocr
    ├── zhipu-text
    ├── zhipu-video-generation
    └── zhipu-vlm
```

## 规划

| 组 | 平台 | 状态 |
|----|------|------|
| kling-skills | 可灵 | ✅ 已注册 |
| wanx-skills | 通义万相 | 待补充 |
| seedream-skills | 豆包 Seedream | 待补充 |
| zhipu-skills | 智谱 | ✅ 已注册 |
| hailuo-skills | 海螺 | 待补充 |
| coze-skills | 扣子 | ✅ 已注册 |
| volcengine-skills | 火山引擎 | 待补充 |
