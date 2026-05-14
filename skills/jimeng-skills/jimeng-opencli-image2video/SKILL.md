---
name: jimeng-opencli-image2video
description: Guide Jimeng image-to-video for standard members without dreamina CLI. opencli jimeng has no image2video, frames2video, or multimodal subcommands. Use with jimeng-prompt-image2video for incremental motion prompts, manual mode selection on the Jimeng web UI, and opencli history for verification. Never invoke dreamina or jimeng-cli execution skills.
license: Complete terms in LICENSE.txt
---

# jimeng-opencli-image2video — 即梦图生视频（opencli / 普通会员）

面向**无 dreamina CLI** 的普通会员。仅允许 `opencli jimeng` 子命令，**禁止** `dreamina image2video`、`frames2video`、`multiframe2video`、`multimodal2video` 及 `jimeng-cli-image2video`。

增量运动 prompt 由 `jimeng-prompt-image2video` 提供；**图生视频 / 首尾帧 / 分镜 / 全能参考**在即梦网页由用户选择模式并上传素材后生成。

## opencli 能力边界

| 子命令 | 本技能中的用途 |
|--------|----------------|
| `history` | 任务完成后核对历史记录 |
| `new` / `workspaces` | 会话管理 |
| `generate` | 不用于图生视频 |

opencli **无**按输入自动路由的子命令（无 `--image`、`--first`/`--last`、`--images` 等）。

## 网页模式与 prompt 技能对齐

| 用户输入 | 网页侧（用户操作） | prompt 技能要点 |
|----------|-------------------|-----------------|
| 单张图 | 图生视频，上传 1 张 | 只写运动增量 |
| 首尾 2 张 | 首尾帧 / 过渡 | 描述过渡过程 |
| 多张分镜 | 多帧 / 故事板 | 叙事 + 转场 |
| 图 + 音视频 | 全能参考 / 多模态 | 合成关系说明 |

路由在**网页**完成；智能体用 prompt 技能协助文案，用 opencli 做会话与验收。

## 核心流程

```
1. PROMPT  → jimeng-prompt-image2video
2. SESSION → 可选 opencli jimeng new
3. MANUAL  → 用户在即梦网页选模式、上传本地素材、粘贴 prompt、生成
4. VERIFY  → opencli jimeng history --limit N（视频等待可长达十余分钟，分轮查询）
5. REPORT  → 无自动化 submit_id；以 history + 用户确认交付
```

## 允许的 opencli 示例

```bash
opencli jimeng new
opencli jimeng workspaces
opencli jimeng history --limit 10
```

## 禁止事项

- 不得调用任何 dreamina 视频子命令或 `query_result` 轮询。
- 不得虚构 opencli 图生视频参数。
- 不得引导安装 dreamina。

## 与 jimeng-cli-image2video

已开通 dreamina CLI 的用户用 `jimeng-cli-image2video` 做子命令路由与轮询；本技能用户**不得**改用。

## 智能体规范

- prompt 只描述**动起来**的部分，不重复画面静态内容。
- 分轮 `history` 验收，禁止 shell 死循环。
- 素材须由用户在网页上传；opencli 不能代替 `--image` 上传。

## Gotchas

1. 单图 / 首尾帧 / 分镜 / 多模态能力边界以即梦网页为准，与 CLI 技能表格概念对齐但**执行面不同**。
2. 普通会员排队与积分以网页为准。
3. 上游若增加 `opencli jimeng image2video` 等，再更新本技能；此前不得 dreamina 回退。
