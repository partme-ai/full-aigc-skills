---
name: jimeng-opencli-text2image
description: Execute Jimeng (即梦) text-to-image through opencli browser commands on jimeng.jianying.com. Uses opencli jimeng generate with an existing Chrome login and Browser Bridge, plus optional history, new, and workspaces for session and result checks. Use when the user wants opencli-based generation, browser-session control, or 即梦网页生图 without the dreamina CLI. Pair with jimeng-prompt-text2image for prompt authoring. Do not use for image-to-image, video, or dreamina CLI task polling.
license: Complete terms in LICENSE.txt
---

# jimeng-opencli-text2image — 即梦文生图 opencli 执行

通过 **opencli** 在已登录的 Chrome 即梦网页会话中提交文生图任务。本技能负责命令选择、参数映射、等待与结果提取；**不负责写提示词**（先用 `jimeng-prompt-text2image` 产出并确认 prompt）。

## 与 jimeng-cli-text2image 的分工

| 维度 | jimeng-opencli-text2image | jimeng-cli-text2image |
|------|---------------------------|------------------------|
| 执行入口 | `opencli jimeng …` | `dreamina text2image …` |
| 鉴权 | 浏览器 Cookie（即梦网页登录） | `dreamina login` + 本地 CLI 凭据 |
| 任务 ID | 无 `submit_id`；靠页面出图或 `history` | `submit_id` + `query_result` 轮询 |
| 适用场景 | 已开 Chrome、走 Browser Bridge、不想装 dreamina CLI | 脚本化、批量、异步任务管理 |

## When to use

- 用户已登录 `jimeng.jianying.com`，希望用 **opencli** 生图
- 用户提到 `opencli jimeng generate`、`Browser Bridge`、网页即梦生图
- 已有经 `jimeng-prompt-text2image` 审核通过的 prompt

Do NOT use for:

- 图生图 → `jimeng-opencli-image2image`（当前 opencli 未提供独立子命令，见该技能回退说明）
- 视频 → `jimeng-opencli-text2video` / `jimeng-opencli-image2video`
- 官方 dreamina CLI 异步任务 → `jimeng-cli-text2image`

## 前置条件

1. 本机已安装 **opencli**，且 `opencli jimeng generate -h` 可用。
2. Chrome 已登录 [即梦](https://jimeng.jianying.com)，并安装 [Browser Bridge](https://github.com/jackwener/opencli)（与 opencli 文档一致）。
3. 首次失败时，在浏览器中打开 `https://jimeng.jianying.com/ai-tool/generate?type=image` 完成登录或合规确认。

## 核心流程

```
1. PREP   → 确认 prompt 已由 jimeng-prompt-text2image 定稿
2. GEN    → opencli jimeng generate --prompt="..." [--model ...] [--wait ...]
3. CHECK  → 解析输出 status / image_urls；必要时 opencli jimeng history
4. ORG    → 可选 opencli jimeng new / workspaces 管理会话
```

## 命令与参数

### 文生图（主命令）

```bash
opencli jimeng generate --prompt "一只在星空下的猫"
opencli jimeng generate --prompt "赛博朋克城市夜景" --model high_aes_general_v50 --wait 60
```

| 参数 | 说明 |
|------|------|
| `--prompt` | 图片描述（必填；中文优先） |
| `--model` | 模型：`high_aes_general_v50`（5.0 Lite）、`high_aes_general_v42`（4.6）、`high_aes_general_v40`（4.0） |
| `--wait` | 等待出图秒数，默认 `40` |

输出列：`status`、`prompt`、`image_count`、`image_urls`。`success` 时从 `image_urls` 取可访问链接；`timeout` 时延长 `--wait` 或查历史。

### 辅助命令

```bash
opencli jimeng history --limit 10
opencli jimeng new
opencli jimeng workspaces
```

- `history`：对照最近作品与 prompt、缩略图 URL。
- `new`：新建 workspace，返回 `workspace_id` / `workspace_url`。
- `workspaces`：列出工作区。

## 从 prompt 规格映射

| prompt 侧建议 | opencli 侧 |
|---------------|------------|
| 画幅比例、分辨率、模型版本（CLI 语义） | 网页 `generate` 以 `--model` 为主；比例/分辨率在网页 UI 或后续 opencli 扩展中设置 |
| 中文正文 | 原样写入 `--prompt` |
| 项目分组 | `new` / `workspaces` 管理会话；与 `dreamina session` 不同体系 |

## 智能体行为规范

- **不要**用 `while true; sleep` 在 shell 里死循环；`--wait` 由 opencli 在浏览器内轮询。
- 若 `timeout`：加大 `--wait` 或执行 `history`；仍无结果则提示用户检查积分、合规弹窗或登录态。
- 若 `failed`：提示用户在网页完成模型授权或重试；不要在本技能内改写 prompt。

## 常见错误

| 现象 | 处理 |
|------|------|
| 未登录 / Bridge 未连接 | 打开即梦网页登录，确认 Browser Bridge |
| `Editor not found` / `Generate button not found` | 即梦 DOM 变更；对照上游 `opencli` `jimeng/generate` 适配器 |
| `timeout` | 增加 `--wait` 或 `history` |
| 用户要 `submit_id`、批量异步 | 转 `jimeng-cli-text2image` |

## Gotchas

1. opencli 走**网页会话**，不是 dreamina 开放 API；与 `jimeng-cli-*` 的 `user_credit` / `query_result` 不互通。
2. 默认进入 `type=image` 文生图页；**不要**在本技能中假造 `opencli jimeng image2image` 等尚未注册的子命令。
3. 中文 prompt 效果通常更好。
4. 生成前务必先走 prompt 技能并获用户确认。
