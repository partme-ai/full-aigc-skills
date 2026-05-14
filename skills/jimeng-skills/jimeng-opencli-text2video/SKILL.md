---
name: jimeng-opencli-text2video
description: Plan and verify Jimeng text-to-video workflows with opencli browser session tools plus dreamina text2video CLI execution. opencli jimeng has no dedicated video generate command yet; use opencli for session and history checks and dreamina for Seedance submission and query_result polling. Pair with jimeng-prompt-text2video for motion prompts. Use when the user wants opencli session context with CLI-based video generation.
license: Complete terms in LICENSE.txt
---

# jimeng-opencli-text2video — 即梦文生视频 opencli 编排

编排**文生视频**：**opencli** 维护即梦网页登录与工作区；**视频任务提交**在 opencli 未提供 `jimeng text2video` 前，与 `jimeng-cli-text2video` 一致，使用 **`dreamina text2video`** + **`query_result`**。本技能不写视频 prompt（先用 `jimeng-prompt-text2video`）。

## 能力边界（opencli 上游）

`opencli jimeng` 现有：`generate`（文生图）、`history`、`new`、`workspaces`。**无**文生视频命令。视频生成走 dreamina CLI；opencli 用于会话与历史核对。

## 与 jimeng-cli-text2video 的对照

| 步骤 | jimeng-opencli-text2video | jimeng-cli-text2video |
|------|--------------------------|------------------------|
| 会话 / 登录 | `opencli jimeng history` 等 | `dreamina user_credit` |
| 提交 | `dreamina text2video --prompt … --poll=0` | 同左 |
| 轮询 | 智能体约 5s 调用 `query_result` | 同左 |
| 历史 | `opencli jimeng history`（网页侧） | `dreamina list_task` |

时长、画幅、Seedance 模型、`--poll` 语义与 `jimeng-cli-text2video` 一致。

## When to use

- 用户有已审核的文生视频 prompt（含动作与镜头描述）
- 需要 opencli 确认浏览器即梦会话，再用 dreamina 提交视频
- 用户提到 opencli + 即梦生视频 / Seedance

Do NOT use for:

- 图生视频 → `jimeng-opencli-image2video`
- 静态图 → `jimeng-opencli-text2image`
- 仅 dreamina、不用 opencli → `jimeng-cli-text2video`

## 核心流程

```
1. SESSION → opencli jimeng history --limit 3
2. CREDIT  → dreamina user_credit（视频耗积分高于图片）
3. SUBMIT  → dreamina text2video --prompt="..." --duration=N --ratio=16:9 --model_version=... --poll=0
4. POLL    → 智能体每 ~5s：dreamina query_result --submit_id=<id>（视频可等 2–15 分钟）
5. AUDIT   → 可选 opencli jimeng history
```

## 提交示例

```bash
opencli jimeng history --limit 5
dreamina user_credit

dreamina text2video \
  --prompt="镜头缓缓推进，女孩在森林中缓步，裙摆轻摆，阳光穿过树冠" \
  --duration=8 \
  --ratio=16:9 \
  --model_version=seedance2.0fast_vip \
  --poll=0
```

快速试跑（CLI 内短轮询）：

```bash
dreamina text2video --prompt="..." --duration=5 --poll=120
```

## 参数速查

| 参数 | 默认 | 说明 |
|------|------|------|
| `--prompt` | — | 必填；动作 + 镜头 |
| `--duration` | 5 | 4–15 秒 |
| `--ratio` | 16:9 | 1:1、3:4、16:9、4:3、9:16、21:9 |
| `--video_resolution` | 720P | Seedance 2.0 |
| `--model_version` | seedance2.0fast | 含 `seedance2.0fast_vip` 等 |
| `--poll` | 0 | 0 为异步 + 智能体轮询 |

## 模型选择（与 CLI 技能一致）

| 模型 | 特点 |
|------|------|
| seedance2.0fast / seedance2.0fast_vip | 迭代快，默认首选 |
| seedance2.0 / seedance2.0_vip | 质量更高，更慢 |

VIP 账户优先 `*_vip` 通道（与 `jimeng-cli-text2video` 一致）。

## 智能体轮询 SOP

禁止 shell 死循环；`querying` 时告知用户视频通常需数分钟；超过约 20 分钟仍无结果则询问是否继续。

## 常见错误

| 错误 | 处理 |
|------|------|
| 积分不足 | `user_credit` 后提示充值或缩短 `--duration` |
| `AigcComplianceConfirmationRequired` | 网页授权模型后重试 |
| opencli history 失败 | 检查 Chrome 登录与 Bridge |
| `--poll` 超时返回 querying | 用 `query_result` 继续轮询 |

## Gotchas

1. 视频积分远高于图片；提交前必须 `user_credit`。
2. opencli **不能**代替 `dreamina text2video` 提交 Seedance 任务。
3. 时长与动作复杂度要匹配（见 `jimeng-cli-text2video` 时长表）。
4. 上游若提供 `opencli jimeng text2video`，优先改用并更新本技能。
