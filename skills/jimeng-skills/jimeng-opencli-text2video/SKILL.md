---
name: jimeng-opencli-text2video
description: Guide Jimeng text-to-video for standard members without dreamina CLI. opencli jimeng exposes only generate, history, new, and workspaces; no text2video command. Use with jimeng-prompt-text2video for motion prompts, manual text-to-video on the Jimeng web UI, and opencli history to verify results. Never invoke dreamina or jimeng-cli execution skills.
license: Complete terms in LICENSE.txt
---

# jimeng-opencli-text2video — 即梦文生视频（opencli / 普通会员）

面向**无 dreamina CLI** 的普通会员。仅允许 `opencli jimeng` 子命令，**禁止** `dreamina text2video`、`query_result` 及 `jimeng-cli-text2video`。

视频 prompt 由 `jimeng-prompt-text2video` 提供；**文生视频提交**在即梦网页「视频 / Seedance」流程中由用户完成（与 opencli 同一浏览器会话）。

## opencli 能力边界

| 子命令 | 本技能中的用途 |
|--------|----------------|
| `history` | 生成后核对作品、prompt、状态 |
| `new` / `workspaces` | 按项目拆分会话 |
| `generate` | **不用于**文生视频（固定 `type=image` 文生图页） |

无 `opencli jimeng text2video`、`--duration`、`--model_version=seedance*` 等参数。

## 核心流程

```
1. PROMPT  → jimeng-prompt-text2video（动作 + 镜头 + 时长建议）
2. SESSION → 可选 opencli jimeng new
3. MANUAL  → 用户在即梦网页选择文生视频，粘贴 prompt，设置时长/画幅/模型，点击生成
4. VERIFY  → opencli jimeng history --limit N（视频可能较久，可间隔多次查询）
5. REPORT  → 根据 history 或用户反馈汇报结果；pending 时说明继续等待
```

## 允许的 opencli 示例

```bash
opencli jimeng new
opencli jimeng workspaces
opencli jimeng history --limit 5
opencli jimeng history --limit 10 --format json
```

## 禁止事项

- 不得使用 dreamina CLI 提交或轮询视频任务。
- 不得建议 `seedance2.0fast_vip` 等仅 CLI 文档中的 VIP 通道参数（除非用户在网页自行选择）。
- 不得用 `generate` 冒充视频生成。

## 与 jimeng-cli-text2video

已开通 dreamina CLI 的用户使用 `jimeng-cli-text2video`；本技能读者**不得**改用 dreamina。

## 智能体规范

- 视频耗时长：多次 `history` 属正常，禁止 shell 死循环；由智能体分轮调用 `history`。
- 时长与动作复杂度匹配（见 prompt 技能）；网页侧由用户选择秒数。
- 积分不足、合规拦截在网页提示，opencli 无法 `user_credit` 查询。

## Gotchas

1. `history` 列主要为图生历史接口字段，视频条目以网页实际展示为准；无记录时以用户浏览器状态为准。
2. 普通会员以网页套餐与排队为准，与 dreamina VIP 队列无关。
3. 全自动文生视频需等 opencli 上游新增视频子命令；当前不得 dreamina 回退。
