# aigc-skills

[English](./README.md) | 中文

面向多平台内容创作、发布与媒体生成的 AIGC 技能库。仓库同时承载自研技能，并支持从公开 GitHub 项目定期整合外部技能。

## 目标

- 以稳定的 `aigc-*` 命名空间对外提供自研 AIGC 技能。
- 将公开 AIGC 技能库整合为统一目录。
- 跟踪微信、小红书、抖音、B 站、微博、YouTube、X 等平台覆盖情况。

## 目录结构

| 路径 | 作用 |
|------|------|
| `skills/` | 自研 `aigc-*` 技能与整合后的 `integ-*` 技能 |
| `packages/` | 多个技能共享的运行时代码 |
| `config/external-sources.json` | 待同步的上游 GitHub 仓库 |
| `integrations/manifest.json` | 最近一次成功同步的元数据 |
| `integrations/inventory.json` | 平台覆盖清单 |
| `scripts/` | 同步、盘点与测试脚本 |

## 安装

```bash
npx skills add <owner>/aigc-skills
```

在支持的 Agent 中注册插件市场：

```bash
/plugin marketplace add <owner>/aigc-skills
```

## 新增自研技能

1. 创建 `skills/aigc-<name>/SKILL.md`。
2. 在 `.claude-plugin/marketplace.json` 中注册 `./skills/aigc-<name>`。
3. 执行 `npm run inventory` 刷新平台覆盖清单。

详见 [docs/creating-skills.md](./docs/creating-skills.md)。

## 同步外部技能

1. 在 [config/external-sources.json](./config/external-sources.json) 中添加上游仓库。
2. 预览导入计划：

```bash
npm run sync:external:dry
```

3. 执行同步：

```bash
npm run sync:external
```

4. 将新的 `integ-*` 技能注册到 `.claude-plugin/marketplace.json`。
5. 执行 `npm run inventory`。

详见 [docs/syncing-external-skills.md](./docs/syncing-external-skills.md)。

## 命令

| 命令 | 说明 |
|------|------|
| `npm test` | 运行 Node 兼容测试 |
| `npm run sync:external` | 导入或更新整合技能 |
| `npm run sync:external:dry` | 外部同步预演 |
| `npm run inventory` | 生成平台覆盖清单 |

## 当前状态

项目骨架已就绪。请将自研技能放入 `skills/aigc-*`，并在 `config/external-sources.json` 中配置上游仓库。
