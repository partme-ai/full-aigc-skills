---
name: jimeng-opencli-image2video
description: Plan and verify Jimeng image-to-video workflows across image2video, frames2video, multiframe2video, and multimodal2video modes. opencli jimeng provides browser session helpers only; actual submission uses dreamina CLI with the same routing as jimeng-cli-image2video. Pair with jimeng-prompt-image2video for incremental motion prompts. Use when reference media exists and the user wants opencli session checks plus CLI video generation.
license: Complete terms in LICENSE.txt
---

# jimeng-opencli-image2video — 即梦图生视频 opencli 编排

编排**图生视频**及多参考模式：用 **opencli** 检查即梦网页会话与历史；**视频提交**在 opencli 未提供视频子命令前，与 `jimeng-cli-image2video` 相同，按输入类型选择 **`dreamina image2video` / `frames2video` / `multiframe2video` / `multimodal2video`**。本技能不写视频 prompt（先用 `jimeng-prompt-image2video`）。

## 能力边界（opencli 上游）

`opencli jimeng` 仅有 `generate`（文生图）、`history`、`new`、`workspaces`。**无**图生视频命令。本地媒体上传与 Seedance 提交走 dreamina CLI。

## 模式路由（与 jimeng-cli-image2video 一致）

| 输入 | dreamina 子命令 |
|------|-----------------|
| 1 张图 | `image2video --image` |
| 首尾 2 帧 | `frames2video --first --last` |
| 2–20 张分镜 | `multiframe2video --images` |
| 图 + 视频 + 音频 | `multimodal2video --image/--video/--audio` |

## 与 jimeng-cli-image2video 的对照

| 步骤 | jimeng-opencli-image2video | jimeng-cli-image2video |
|------|----------------------------|-------------------------|
| 会话 | `opencli jimeng history` | `dreamina user_credit` |
| 模式选择 | 同左表 | 同左表 |
| 提交 | 对应 dreamina 子命令 + `--poll=0` | 同左 |
| 轮询 | `query_result`（约 5s） | 同左 |

## When to use

- 用户有参考图/音视频与已审核的**增量**运动 prompt
- 需要 opencli 确认网页登录后再用 dreamina 动图/视频
- 用户提到图生视频、首尾帧、分镜、全能参考 + opencli

Do NOT use for:

- 纯文生视频 → `jimeng-opencli-text2video`
- 静态图 → `jimeng-opencli-text2image` / `jimeng-opencli-image2image`
- 仅 dreamina → `jimeng-cli-image2video`

## 核心流程

```
1. SESSION → opencli jimeng history --limit 3
2. CREDIT  → dreamina user_credit
3. DETECT  → 按输入数量/类型选子命令
4. VERIFY  → 本地文件存在（opencli 不负责上传）
5. SUBMIT  → dreamina <subcommand> ... --poll=0
6. POLL    → query_result（视频等待可长达 15+ 分钟）
```

## 提交示例

**单图：**

```bash
opencli jimeng history --limit 5
dreamina user_credit

dreamina image2video \
  --image ./photo.png \
  --prompt="微风拂动头发与衣角，缓慢眨眼，镜头轻推" \
  --model_version=seedance2.0fast_vip \
  --poll=0
```

**首尾帧：**

```bash
dreamina frames2video \
  --first ./start.png --last ./end.png \
  --prompt="花瓣由含苞到盛开，外层先展" \
  --duration=10 \
  --poll=0
```

**分镜：**

```bash
dreamina multiframe2video \
  --images ./f1.png,./f2.png,./f3.png \
  --prompt="情绪由沉思到惊喜再到急切" \
  --transition-prompt="平滑过渡" \
  --duration=15 \
  --poll=0
```

**全能参考：**

```bash
dreamina multimodal2video \
  --image ./person.png,./scene.png \
  --audio ./voice.mp3 \
  --prompt="人物按音频节奏说话，口型同步" \
  --model_version=seedance2.0fast_vip \
  --poll=0
```

## 参数注意

- `image2video` 用 `--image`（单数）；`multiframe2video` 用 `--images`（复数）；`frames2video` 用 `--first` / `--last`。
- `multiframe2video` 通常不支持 `--model_version` 覆盖（与 CLI 技能一致）。
- `multimodal2video` 最多约 9 图 + 3 视频 + 3 音频。
- prompt 只描述**运动增量**，不重复画面静态内容。

## 智能体轮询 SOP

与 `jimeng-cli-image2video` 相同：禁止 shell 死循环；视频 `querying` 时设置用户预期；约 20 分钟无进展则询问是否继续。

## 常见错误

| 错误 | 处理 |
|------|------|
| 子命令与输入不匹配 | 重新按模式路由表选择 |
| 文件不存在 | 校验路径；多文件逗号分隔无空格 |
| opencli 与 dreamina 鉴权不一致 | 分别修复网页登录与 `dreamina login` |
| 超出 multimodal 上限 | 减少参考文件数量 |

## Gotchas

1. opencli **不能**上传本地图/视频/音频；dreamina 子命令需要本地路径。
2. Seedance 2.0 默认 **720P**；1080P 多见于旧版 3.x 模型路径。
3. VIP 账户默认 `seedance2.0fast_vip`（与 CLI 技能一致）。
4. 上游若增加 `opencli jimeng image2video` 等，优先迁移并缩小 dreamina 回退范围。
