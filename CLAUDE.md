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
| baoyu-skills | Baoyu 精选 | 21 | `npx skills add JimLiu/baoyu-skills` |
| dreamina-skills | 即梦 图像/视频/3D | 36 | `npx skills add full-aigc-skills/dreamina-skills` |
| blender-skills | Blender 制作 | 23 | `npx skills add full-aigc-skills/blender-skills` |
| zhipu-skills | 智谱 文本/图像/视频/音频 | 8 | `npx skills add full-aigc-skills/zhipu-skills` |
| coze-skills | 扣子 ASR/TTS/图像/搜索 | 6 | `npx skills add full-aigc-skills/coze-skills` |
| video-factory-skills | 视频工厂 | 5 | `npx skills add full-aigc-skills/video-factory-skills` |
| image-factory-skills | 图片工厂 | 4 | `npx skills add full-aigc-skills/image-factory-skills` |
| maya-skills | Maya 制作 | 4 | `npx skills add full-aigc-skills/maya-skills` |
| minimax-skills | MiniMax | 3 | `npx skills add full-aigc-skills/minimax-skills` |
| kling-skills | 可灵 视频 | 2 | `npx skills add full-aigc-skills/kling-skills` |
| reelbench-skills | ReelBench | 2 | `npx skills add full-aigc-skills/reelbench-skills` |
| pippit-skills | 小云雀 | 1 | `npx skills add full-aigc-skills/pippit-skills` |
| id-photo-skills | 证件照 | 1 | `npx skills add full-aigc-skills/id-photo-skills` |

**总计：13 个包 / 116 个技能**（实测自上游 `main` 分支）。

## 修改规则

- README.md / README.en.md 是唯一需要维护的文档
- 更新技能目录时同步更新两个语言版本的表格
- 社区资源链接保持在「社区资源」章节
- 不引入 skills/ 目录、marketplace.json 或同步脚本
