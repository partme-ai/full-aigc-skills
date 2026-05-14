# aigc-skills

[English](./README.md) | 中文

面向国内 AIGC 生成平台的技能库：自研各平台调用与提示词技能，并从公开仓库按需同步外部技能。目录按 `skills/<group>-skills/<skill-name>/` 组织。

## 定位与边界

- **本仓库**：聚焦国内图片、音乐、视频等生成平台（如即梦、MiniMax、小云雀 / Pippit 等）的技能制作与搜集。
- **[baoyu-skills](https://github.com/JimLiu/baoyu-skills)**：独立技能体系，后续直接安装使用，**不**并入本仓库，也不作为 `sources.conf` 同步来源。
- **海外或通用创作工具**（如 Remotion 程序化视频）：仅在有明确需求时单独评估，不作为默认扩充方向。

## 目标

- 以分组目录 `skills/<group>-skills/<skill-name>/` 组织自研与同步技能。
- 用一个配置文件维护多个平台技能源地址。
- 用一个 Bash 脚本反复执行同步。

## 目录结构

| 路径 | 作用 |
|------|------|
| `skills/<group>-skills/<skill>/` | 分组技能目录 |
| `config/sources.conf` | 外部技能源配置 |
| `scripts/sync-sources.sh` | 外部技能同步脚本 |
| `docs/aigc-skill-group-mapping.md` | 分组映射表 |

## 安装

```bash
npx skills add <owner>/aigc-skills
```

在支持的 Agent 中注册插件市场：

```bash
/plugin marketplace add <owner>/aigc-skills
```

## 新增自研技能

1. 创建 `skills/<group>-skills/<skill-name>/SKILL.md`。
2. 在 `.claude-plugin/marketplace.json` 中注册对应路径。
3. 更新 `docs/aigc-skill-group-mapping.md`。

详见 [docs/creating-skills.md](./docs/creating-skills.md)。

## 同步外部技能

1. 在 [config/sources.conf](./config/sources.conf) 中增加一行来源配置。
2. 执行：

```bash
./scripts/sync-sources.sh
```

3. 将新技能注册到 `.claude-plugin/marketplace.json`。

详见 [docs/syncing-sources.md](./docs/syncing-sources.md)。

## 命令

| 命令 | 说明 |
|------|------|
| `./scripts/sync-sources.sh` | 同步全部已配置来源 |
| `./scripts/sync-sources.sh --source pippit` | 只同步指定来源 |
| `./scripts/sync-sources.sh --dry-run` | 预演同步 |
| `./scripts/sync-sources.sh --force` | 强制重新拉取缓存仓库 |

## 当前分组

- `jimeng-skills`：即梦提示词与 CLI 生成技能
- `pippit-skills`：小云雀 / Pippit 会话技能，组根目录保留上游 README
- `minimax-skills`：MiniMax 多模态与音乐技能（仅同步配置中列出的 3 个技能）
- `remotion-skills`：Remotion 视频创作最佳实践（来自 [remotion-dev/skills](https://github.com/remotion-dev/skills)）
