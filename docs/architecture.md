# aigc-skills 架构设计

## 1. 项目定位

**aigc-skills** 是一个面向国内 AIGC 生成平台的技能聚合仓库（Skill Aggregator）。它汇集自研（first-party）和外部同步（integrated）两类技能，通过 OpenClaw 插件市场分发给 AI Agent（Claude Code、Codex、Cursor 等）使用。

### 1.1 不是什么

- **不是单一技能项目** — 是多个独立技能的集合
- **不是 fork 仓库** — 同步技能是单向镜像，不修改上游
- **不是 baoyu-skills 的替代或子集** — 独立生态，明确分离
- **不是内容发布平台技能** — 专注 AIGC 生成（文生图、图生视频、音乐生成等），不含微信公众号、小红书等内容发布能力

### 1.2 核心理念

```
"不是自己写所有技能，而是定义标准、建立管道、把控质量，
让自研和第三方的技能能在同一体系内协同工作"
```

## 2. 技能来源模型

```
┌─────────────────────────────────────────────────────┐
│                  aigc-skills                         │
│                                                     │
│  First-Party (自研)          Integrated (同步)        │
│  ┌─────────────────┐       ┌─────────────────┐      │
│  │ 直接在仓库内创作  │       │ sync-sources.sh  │      │
│  │ 完全可控         │       │ 从上游 git 拉取   │      │
│  │ 命名: 平台-功能   │       │ 保留原始命名      │      │
│  └────────┬────────┘       └────────┬────────┘      │
│           │                         │                │
│           ▼                         ▼                │
│  .claude-plugin/marketplace.json                     │
│           │                                         │
│           ▼                                         │
│    OpenClaw Plugin Market → AI Agents                │
└─────────────────────────────────────────────────────┘
```

### 2.1 自研技能（First-Party）

- 位置：`skills/jimeng-skills/`、`skills/coze-skills/`
- 命名：`jimeng-prompt-text2image`（三段式：`平台-功能-模式`）
- 完全自主控制，规范优先

### 2.2 同步技能（Integrated）

- 位置：`skills/pippit-skills/`、`skills/minimax-skills/`、`skills/remotion-skills/`
- 来源由 `config/sources.conf` 定义
- 每次同步通过 `scripts/sync-sources.sh` 执行
- 每个技能目录包含 `.source-sync.json` 记录来源信息
- **不要直接修改同步技能的 SKILL.md** — 改动了下次同步会被覆盖

## 3. 目录结构

```
aigc-skills/
├── CLAUDE.md                     # AI agent 项目理解
├── README.md / README.zh.md      # 人类阅读
├── LICENSE                       # MIT
│
├── skills/                       # 技能根目录
│   ├── README.md                 # 技能目录结构说明
│   ├── jimeng-skills/            # 即梦 — 自研
│   │   ├── jimeng-prompt-text2image/
│   │   │   ├── SKILL.md
│   │   │   ├── references/       # 词库、规则等参考
│   │   │   └── examples/         # 提示词示例
│   │   ├── jimeng-cli-text2image/
│   │   │   ├── SKILL.md
│   │   │   ├── references/
│   │   │   └── examples/
│   │   └── ...（共 12 个）
│   ├── coze-skills/              # 扣子 — 自研（WIP）
│   │   ├── coze-asr/
│   │   ├── coze-tts/
│   │   └── ...（共 6 个）
│   ├── pippit-skills/            # 小云雀 — 同步
│   │   ├── README.md             # 上游 README（sync 保留）
│   │   └── xyq-nest-skill/
│   ├── minimax-skills/           # MiniMax — 同步
│   │   ├── README.md             # 上游 README（sync 保留）
│   │   └── ...（共 3 个，由 include 白名单控制）
│   └── remotion-skills/          # Remotion — 同步
│       ├── README.md             # 上游 README（sync 保留）
│       └── remotion/
│
├── config/
│   └── sources.conf              # 同步源配置
│
├── scripts/
│   └── sync-sources.sh           # 外部技能同步脚本
│
├── .claude-plugin/
│   └── marketplace.json          # 插件市场注册
│
├── integrations/                 # 同步追踪数据
│   ├── inventory.json            # 技能清单
│   ├── manifest.json             # 同步清单
│   └── reports/                  # 同步报告存档
│
├── docs/
│   ├── aigc-skill-group-mapping.md  # 分组映射表（权威）
│   ├── architecture.md              # 本文档
│   ├── creating-skills.md           # 自研技能创建指南
│   ├── syncing-sources.md           # 同步流程说明
│   └── platforms.md                 # 平台覆盖信息
│
└── .cache/sources/               # git clone 缓存（.gitignore）
```

## 4. 同步管道

### 4.1 sources.conf 格式

```
id|remote|ref|target_group|layout|slug_mode|group_readme|include
```

| 字段 | 说明 | 示例 |
|------|------|------|
| `id` | 来源标识，用于 `--source` 过滤 | `minimax` |
| `remote` | Git 仓库地址 | `https://github.com/MiniMax-AI/skills.git` |
| `ref` | 分支或标签 | `main` |
| `target_group` | 目标组目录名 | `minimax-skills` |
| `layout` | `flat` / `grouped` / `auto` | `flat` |
| `slug_mode` | `preserve` 保留原名 / `prefix` 加前缀 | `preserve` |
| `group_readme` | 上游 README 路径，复制到组根 | `README.md` |
| `include` | 白名单，逗号分隔（空=全部） | `minimax-music-gen,...` |

### 4.2 同步流程

```
sources.conf ──▶ sync-sources.sh
                    │
                    ├─ git clone/fetch (--depth 1) → .cache/sources/<id>/
                    ├─ 根据 layout 发现技能
                    ├─ include 白名单过滤
                    ├─ rsync 到 skills/<target_group>/<skill>/
                    ├─ 写入 .source-sync.json（溯源信息）
                    ├─ 复制上游 README 到组根
                    └─ 清理过期技能（不再在 include 中的）
```

### 4.3 .source-sync.json

每个同步技能根目录下的溯源文件：

```json
{
  "sourceId": "minimax",
  "remote": "https://github.com/MiniMax-AI/skills.git",
  "ref": "main",
  "commit": "abc123...",
  "targetGroup": "minimax-skills",
  "skill": "minimax-music-gen",
  "upstreamSkill": "minimax-music-gen",
  "slugMode": "preserve",
  "syncedAt": "2026-05-14T15:09:55Z"
}
```

## 5. Marketplace 机制

`.claude-plugin/marketplace.json` 是技能的**分发入口**。每个技能组是一个 plugin entry：

```json
{
  "name": "aigc-skills",
  "owner": { "name": "PartMe" },
  "metadata": { "version": "0.4.3" },
  "plugins": [
    {
      "name": "jimeng-skills",
      "skills": ["./skills/jimeng-skills/jimeng-prompt-text2image", ...]
    }
  ]
}
```

用户通过 `npx skills add <owner>/aigc-skills` 安装，或 `/plugin marketplace add` 注册。

## 6. 技能间关系

### 6.1 提示词与执行分离（jimeng 示例）

```
用户: "帮我画一只猫"
        │
        ▼
jimeng-prompt-text2image   ← 写提示词
        │
        │ 输出: "一只橘猫坐在窗台上，暖黄色阳光..."
        ▼
jimeng-cli-text2image      ← 调 CLI 执行
        │
        ▼
    生成图片
```

`prompt-*` 和 `cli-*` 是独立的技能，agent 可组合调用。

### 6.2 跨平台依赖

```
xyq-nest-skill (小云雀/Pippit)
    └── 直接调用 API，不依赖其他技能

minimax-* (MiniMax)
    └── 各自独立，无相互依赖

jimeng-opencli-* (浏览器编排)
    └── 通过浏览器控制 dreamina 网页，不依赖 CLI
```

## 7. 规范合规

所有技能必须通过 `skill-creator/scripts/quick_validate.py` 验证。

### 强制要求

| 检查项 | 规则 |
|--------|------|
| SKILL.md 存在 | 必须有 |
| YAML frontmatter | `---` 包裹 |
| `name` | 连字符命名，与目录名一致，最长 64 字符 |
| `description` | 最长 1024 字符，无尖括号 `<>`，YAML 冒号需转义 |
| 允许的键 | `name`, `description`, `license`, `allowed-tools`, `metadata` |
| 禁止文件 | README.md, CHANGELOG.md, .gitignore, .DS_Store (skill 目录内) |
| 标准子目录 | 只允许 `scripts/`, `references/`, `assets/` |

### 已知的同步技能规范冲突

同步技能可能不遵循本仓库的规范（如前缀命名、额外 frontmatter 键）。当前处理方式：
- 同步后验证，记录不合规项
- 不修改源文件（下次同步会覆盖）
- 对于关键问题（如 name/目录名不匹配），考虑向上游提 PR

## 8. 当前状态

### 8.1 技能清单

| 组 | 来源 | 技能数 | 状态 |
|----|------|--------|------|
| jimeng-skills | 自研 | 12 | ✅ 已注册 |
| coze-skills | 自研 | 6 | ⚠️ 未注册（WIP） |
| pippit-skills | 同步 | 1 | ✅ 已注册 |
| minimax-skills | 同步 | 3 | ✅ 已注册 |
| remotion-skills | 同步 | 1 | ✅ 已注册 |
| **合计** | | **23** | |

### 8.2 待办

- [ ] coze-skills 完成并注册到 marketplace
- [ ] inventory.json 更新为全量数据
- [ ] CLAUDE.md 版本号与 marketplace.json 保持同步
- [ ] kling、wanx、seedream 等规划组启动

## 9. 扩展指南

### 9.1 新增自研组

1. 创建 `skills/<new>-skills/`
2. 在 `.claude-plugin/marketplace.json` 新增 plugin entry
3. 更新 `docs/aigc-skill-group-mapping.md`
4. （可选）创建组 README.md

### 9.2 新增同步源

1. 在 `config/sources.conf` 添加一行
2. 运行 `./scripts/sync-sources.sh --source <id> --dry-run` 预览
3. 运行 `./scripts/sync-sources.sh --source <id>` 执行
4. 在 `marketplace.json` 注册
5. 更新 `docs/aigc-skill-group-mapping.md`

## 10. 设计原则

1. **单向同步** — 外部技能只读，修改向上游提 PR
2. **选择性聚合** — 用 `include` 白名单只取需要的，不是全盘导入
3. **自包含** — 每个技能可独立分发，不依赖仓库上下文
4. **分组即单元** — 一组一插件，用户按需安装
5. **溯源可追踪** — `.source-sync.json` 记录每次同步的 commit
6. **规范统一** — 所有技能（包括同步来的）需通过同一验证标准
