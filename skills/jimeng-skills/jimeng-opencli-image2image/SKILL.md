---
name: jimeng-opencli-image2image
description: Plan and verify Jimeng image-to-image workflows alongside opencli browser session tools. opencli jimeng currently exposes text-to-image generate only; this skill maps jimeng-prompt-image2image outputs to dreamina image2image CLI execution while using opencli for login checks, workspace organization, and post-generation history. Use when the user has reference images and an approved edit prompt and prefers opencli session context with dreamina CLI for the actual edit job.
license: Complete terms in LICENSE.txt
---

# jimeng-opencli-image2image — 即梦图生图 opencli 编排

编排**图生图**流程：用 **opencli** 维护即梦网页登录态、工作区与生成历史；**实际图生图提交**在 opencli 尚未提供 `jimeng image2image` 子命令时，与 `jimeng-cli-image2image` 相同，使用 **`dreamina image2image`**。本技能不写编辑 prompt（先用 `jimeng-prompt-image2image`）。

## 能力边界（opencli 上游）

`opencli jimeng` 当前注册：`generate`（文生图）、`history`、`new`、`workspaces`。**无**图生图专用命令。本技能在 opencli 补齐前采用 **opencli 会话 + dreamina 图生图** 组合。

## 与 jimeng-cli-image2image 的对照

| 步骤 | jimeng-opencli-image2image | jimeng-cli-image2image |
|------|----------------------------|-------------------------|
| 浏览器登录检查 | `opencli jimeng history` 或打开即梦确认 | `dreamina user_credit` |
| 提交图生图 | `dreamina image2image --images … --poll=0` | 同左 |
| 任务轮询 | `dreamina query_result`（智能体约 5 秒一次） | 同左 |
| 历史核对 | `opencli jimeng history` | `dreamina list_task` |

参数语义（`--images`、`--model_version` 4.0+、`--resolution_type` 2k/4k、`--poll`）与 `jimeng-cli-image2image` 一致。

## When to use

- 用户有 1–10 张本地参考图与已审核的图生图 prompt
- 希望用 opencli 确认**网页会话**仍有效，再用 dreamina 提交图生图
- 用户提到图生图 + opencli / Browser Bridge

Do NOT use for:

- 纯文生图 → `jimeng-opencli-text2image`
- 仅 dreamina CLI、不需要 opencli → `jimeng-cli-image2image`
- 视频 → `jimeng-opencli-image2video` / `jimeng-cli-image2video`

## 核心流程

```
1. SESSION → opencli jimeng history --limit 3（或浏览器打开即梦确认登录）
2. VERIFY  → 本地参考图路径可读（1–10 张，逗号分隔）
3. SUBMIT  → dreamina image2image --images <paths> --prompt="..." --model_version=5.0 --poll=0
4. POLL    → 智能体每 ~5s：dreamina query_result --submit_id=<id>
5. AUDIT   → 可选 opencli jimeng history 对照网页记录
```

## 提交示例

```bash
opencli jimeng history --limit 5

dreamina image2image \
  --images ./photo.png \
  --prompt="保持人物面部与姿势不变，改为吉卜力手绘风格" \
  --model_version=5.0 \
  --resolution_type=4k \
  --poll=0
```

多参考图：

```bash
dreamina image2image \
  --images ./subject.png,./style.png \
  --prompt="保留第一张人物与构图，套用第二张水墨风格" \
  --poll=0
```

## 参数速查

| 参数 | 必填 | 说明 |
|------|------|------|
| `--images` | 是 | 1–10 个本地路径，逗号分隔 |
| `--prompt` | 是 | Keep/Change 式编辑描述（中文优先） |
| `--model_version` | 否 | 4.0、4.1、4.5、5.0；图生图不支持 3.x |
| `--resolution_type` | 否 | 2k / 4k（图生图无 1k） |
| `--poll` | 否 | `0` 异步 + 智能体轮询 `query_result` |

## 智能体轮询 SOP

与 `jimeng-cli-image2image` 相同：禁止 shell `while true`；根据 `gen_status` 为 `success` / `failed` / `querying` 分支；图片类任务长时间无进展（约 3 分钟）主动询问用户。

## 常见错误

| 错误 | 处理 |
|------|------|
| opencli history 失败 | 修复 Chrome 登录与 Browser Bridge |
| `dreamina: command not found` | 安装 dreamina CLI 或改走 `jimeng-cli-image2image` |
| 图片路径不存在 | 改为绝对路径并先 `ls` 验证 |
| 模型 &lt; 4.0 | 图生图仅 4.0+ |

## Gotchas

1. **opencli 不能替代 `--images` 上传**；图生图仍依赖 dreamina CLI 或网页手动上传。
2. 编辑 prompt 必须经 `jimeng-prompt-image2image`；未描述区域可能被模型改写。
3. opencli 与 dreamina 是两套鉴权；仅 history 不能代替 `user_credit`。
4. 上游若新增 `opencli jimeng image2image`，优先改用该命令并收缩 dreamina 回退。
