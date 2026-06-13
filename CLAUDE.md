# CLAUDE.md

Full AIGC Skills 导航中心 — 面向 AI Agent 的多平台 AIGC 内容生成技能生态。

## 定位

本仓库是 **AIGC 技能生态的导航站和目录**，不是技能代码仓库。

技能代码分布在 [full-aigc-skills](https://github.com/full-aigc-skills) GitHub 组织下的独立仓库中，本仓库提供统一入口、安装指南和社区资源索引。

## 仓库结构

```
README.md          # 中文导航页（默认）
README.en.md       # 英文导航页
CLAUDE.md          # 本文件
LICENSE            # Apache 2.0
```

**不要在此仓库中添加 skills/ 目录或技能代码。** 新技能应创建为 [full-aigc-skills](https://github.com/full-aigc-skills) 组织下的独立仓库。

## 技能包

| 包 | 平台 | 技能数 | 安装 |
|----|------|:------:|------|
| jimeng-skills | 即梦 | 12 | `npx skills add full-aigc-skills/jimeng-skills` |
| kling-skills | 可灵 | 2 | `npx skills add full-aigc-skills/kling-skills` |
| zhipu-skills | 智谱 | 8 | `npx skills add full-aigc-skills/zhipu-skills` |
| minimax-skills | MiniMax | 3 | `npx skills add full-aigc-skills/minimax-skills` |
| coze-skills | 扣子 | 6 | `npx skills add full-aigc-skills/coze-skills` |
| pippit-skills | 小云雀 | 1 | `npx skills add full-aigc-skills/pippit-skills` |

## 修改规则

- README.md / README.en.md 是唯一需要维护的文档
- 更新技能目录时同步更新两个语言版本的表格
- 社区资源链接保持在「社区资源」章节
- 不引入 skills/ 目录、marketplace.json 或同步脚本
