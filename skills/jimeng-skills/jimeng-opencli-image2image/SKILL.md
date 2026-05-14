---
name: jimeng-opencli-image2image
description: Guide Jimeng image-to-image for standard members without dreamina CLI. opencli jimeng has no image2image subcommand; only generate, history, new, and workspaces are allowed. Use with jimeng-prompt-image2image for edit prompts, manual reference upload on the Jimeng web UI in the same browser session, and opencli history for verification. Never invoke dreamina or jimeng-cli execution skills.
license: Complete terms in LICENSE.txt
---

# jimeng-opencli-image2image — 即梦图生图（opencli / 普通会员）

面向**无 dreamina CLI** 的普通会员。本技能**仅允许** `opencli jimeng` 已注册的子命令，**禁止** `dreamina`、`jimeng-cli-image2image` 及任何 dreamina 安装说明。

编辑 prompt 由 `jimeng-prompt-image2image` 提供；图生图**上传与点击生成**在即梦网页完成（与 opencli 共用同一 Chrome 登录态）。

## opencli 能力边界

`opencli jimeng` 当前**没有** `image2image` 子命令。`generate` 仅文生图（`type=image`），**不能**代替参考图上传。

| 子命令 | 本技能中的用途 |
|--------|----------------|
| `history` | 提交后核对是否出现新作品、prompt、缩略图 |
| `new` | 为单次编辑任务新建 workspace |
| `workspaces` | 查找/确认工作区 |
| `generate` | **不用于**典型图生图（无 `--images`）；勿把文生图当图生图 |

## 核心流程

```
1. PROMPT  → jimeng-prompt-image2image 定稿（Keep/Change）
2. SESSION → 可选 opencli jimeng new；或 workspaces 确认工作区
3. MANUAL  → 用户在即梦网页：上传 1–10 张参考图，粘贴 prompt，选择模型/分辨率，点击生成
4. VERIFY  → opencli jimeng history --limit N 对照 prompt、status、image_url
5. RETRY   → 未出现新记录则提示检查积分、合规或延长等待后再次 history
```

## 允许的 opencli 示例

```bash
opencli jimeng new
opencli jimeng workspaces
opencli jimeng history --limit 10 --format table
```

## 禁止事项

- 不得执行 `dreamina image2image`、`dreamina user_credit`、`dreamina query_result` 等。
- 不得引导用户安装 dreamina CLI 作为回退。
- 不得虚构 `opencli jimeng image2image` 或带 `--images` 的 generate。

## 与 jimeng-cli-image2image

已开通 dreamina CLI / 高级会员且可本地提交图生图任务时，改用 `jimeng-cli-image2image`；本技能用户**不要**混用。

## 智能体规范

- 明确区分：prompt 由 prompt 技能负责；参考图上传与生成按钮由用户在网页完成；opencli 只做会话与历史验收。
- `history` 中 `status` 为 `completed` 表示网页侧完成；`pending` 时稍后重查。
- 若用户坚持「全自动图生图」且拒绝网页操作：说明 opencli 上游尚无对应子命令，可记录需求，**仍不得**改用 dreamina。

## Gotchas

1. 普通会员路径依赖网页图生图能力；opencli 不能上传本地文件。
2. 多参考图、2k/4k、4.0+ 模型均在网页选择，与 prompt 技能建议一致即可。
3. 编辑 prompt 应用 Keep/Change，避免未描述区域被改写。
4. 仅 `history` 不能代替生成；无新记录时先确认用户是否已在网页点击生成。
