---
name: kling-video
description: "通过 Kling AI API / SDK 生成视频，涵盖文生视频、图生视频、AI 数字人、运动控制、多镜头叙事。当用户需要调用 Kling（可灵）生成视频时使用此 skill。触发条件：用户提到 kling、可灵、AI 视频生成、图生视频、数字人、运动控制、Kling 3.0、multi-shot，或需要调用 Kling API/SDK 执行视频生成任务时。来源: https://github.com/runapi-ai/kling"
metadata:
  source: "https://github.com/runapi-ai/kling"
  requires:
    bins: ["node"]
    env: ["RUNAPI_API_KEY"]
---

# Kling AI 视频生成 API

通过 Kling AI API 生成视频：文生视频、图生视频、AI 数字人、运动控制、多镜头叙事。

## 安装

```bash
npm install @runapi.ai/kling
```

需要 Node 18+，环境变量 `RUNAPI_API_KEY`。

## 初始化

```typescript
import { KlingClient } from "@runapi.ai/kling";
const client = new KlingClient({ apiKey: process.env.RUNAPI_API_KEY });
```

## 文生视频 (Text-to-Video)

```typescript
const result = await client.textToVideo.run({
  model: "kling-3.0",
  prompt: "一只白猫在雪地里奔跑，阳光透过树枝洒落",
  duration: "5"
});
// auto-polling: 每 2s 轮询，最长 15min
```

生产环境推荐分离式调用：

```typescript
const task = await client.textToVideo.create({ model: "kling-3.0", prompt: "..." });
const result = await client.textToVideo.get(task.id);
```

## 图生视频 (Image-to-Video)

```typescript
const result = await client.imageToVideo.create({
  model: "kling-3.0",
  image_urls: ["https://example.com/image.jpg"],
  prompt: "让画面中的人物自然微笑并挥手"
});
```

## 多镜头 (Multi-Shot)

Kling 3.0 支持一次生成最多 6 个连续镜头：

```typescript
const result = await client.textToVideo.create({
  model: "kling-3.0",
  prompt: "[Character A: 白猫] 走过雪地...",
  multi_shots: true,
  multi_prompt: [
    "镜头1: 白猫从远处走来，广角",
    "镜头2: 白猫跳跃，特写慢动作",
    "镜头3: 白猫消失在雪景中，拉远"
  ]
});
// 多镜头自动启用配音和唇形同步
```

## AI 数字人 (AI Avatar)

```typescript
const result = await client.aiAvatar.run({
  model: "ai-avatar-pro",
  image: "https://example.com/portrait.jpg",
  audio_url: "https://example.com/speech.mp3",
  prompt: "自然微笑，眼神交流"
});
```

## 运动控制 (Motion Control)

用参考视频驱动静态图像的动态：

```typescript
const result = await client.motionControl.run({
  input_urls: ["https://example.com/static.jpg"],
  video_urls: ["https://example.com/motion_ref.mp4"],
  character_orientation: "front",
  background_source: "original"
});
```

## 模型选择

| 模型 | Model ID | 特性 |
|------|----------|------|
| Kling 3.0 | `kling-3.0` | 多镜头、原生配音、唇形同步、音色控制 |
| Kling 2.6 Pro | `kling-2.6-pro` | 元素绑定 (Element Binding)、Motion Brush、角色一致性 |
| V2.5 Turbo T2V | `kling-v2.5-turbo-text-to-video-pro` | 快速文生视频 |
| V2.5 Turbo I2V | `kling-v2.5-turbo-image-to-video-pro` | 快速图生视频 |
| AI Avatar Pro | `ai-avatar-pro` | 高品质数字人 |
| AI Avatar Standard | `ai-avatar-standard` | 标准数字人 |

## 在 Kling 2.6 Pro 中使用 Motion Brush

```typescript
const result = await client.textToVideo.create({
  model: "kling-2.6-pro",
  prompt: "...",
  motion_brush: [
    { element: "白猫", motion: "前进移动" },
    { element: "背景树", motion: "轻微摇摆" }
  ]
});
```

## 回调 (Webhooks)

HMAC-SHA256 签名验证，需在 10s 内返回 2xx：

```typescript
const crypto = require("crypto");
function verifySignature(payload, signature, secret) {
  const expected = crypto.createHmac("sha256", Buffer.from(secret, "base64"))
    .update(payload).digest("base64");
  return crypto.timingSafeEqual(Buffer.from(signature), Buffer.from(expected));
}
```

## 错误处理

| 类型 | HTTP | 处理 |
|------|------|------|
| `AuthenticationError` | 401 | 检查 API Key |
| `InsufficientCreditsError` | 402 | 充值 |
| `ValidationError` | 422 | 检查请求参数 |
| `RateLimitError` | 429 | 等待重试 |
| `ServiceUnavailableError` | 503 | 稍后重试 |
| `TaskFailedError` | - | 检查输入/重试 |
| `TaskTimeoutError` | - | 增加 timeout |

## 注意

- `model` 参数始终必填
- 多镜头必须启用 `multi_shots: true`
- 多镜头中 `image_urls` 最多 1 张
- Motion control 数组有长度和格式要求
- `duration` 为字符串格式（如 `"5"`）
- 回调 URL 必须是可公网访问的地址

## 参考

- https://runapi.ai/models/kling
- https://github.com/runapi-ai/kling
