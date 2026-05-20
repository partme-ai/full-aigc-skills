---
name: kling-prompt
description: "为 Kling AI（可灵）视频生成模型撰写高质量提示词。涵盖文生视频和图生视频的提示词框架，包括戏剧结构、镜头语言、灯光设计、角色一致性、多镜头叙事、Motion Brush 描述、负向提示词等。当用户需要为 Kling 写视频提示词、优化视频创意、或用可灵生成视频前的提示词准备时使用此 skill。触发条件：用户提到可灵提示词、Kling prompt、写视频提示词、怎么描述这个视频、视频分镜、Kling 3.0 多镜头、Motion Brush 描述，或需要为 Kling 视频准备提示词时。来源: https://github.com/smixs/visual-skills"
metadata:
  source: "https://github.com/smixs/visual-skills"
---

# Kling AI 视频提示词工程

为 Kling AI（可灵）视频生成模型撰写专业的电影级提示词。

## 核心原则

**提示词工程排在导演/编剧/剪辑之后** — 先确定画面要讲什么故事，再写提示词。一个好看的画面没有戏剧性就是壁纸。

## Kling 模型差异

### Kling 3.0 (pro/standard)
- 原生多镜头：一次生成最多 6 个连续镜头
- 原生配音 + 唇形同步：`[Character A: 台词内容]`
- 音色控制：可指定角色语音风格
- 最长 15 秒连续输出
- 更适合：有对话和唇形同步的多镜头叙事

### Kling 2.6 Pro
- 元素绑定 (Element Binding)：精确控制画面元素运动
- Motion Brush：逐元素指定运动方向和强度
- Motion Transfer：用参考视频驱动静态图像
- 专用负向提示词字段
- 更适合：跨多个社交媒体视频的角色一致性（无对话）、Motion Brush、成本更低

### Kling V2.5 Turbo
- 快速生成
- 适合快速原型和低成本批量生成

## 提示词结构

### 文生视频 (Text-to-Video) 模板

```
[主体描述] — 角色的外貌、服装、动作
[场景描述] — 环境、时间、氛围
[运动描述] — 主体的运动方向和方式
[镜头描述] — 景别、角度、运动
[灯光氛围] — 光源方向、色温、情绪
```

示例：
```
一位穿红色汉服的年轻女子，长发飘逸。
场景：黄昏时分的古寺庭院，银杏叶飘落。
运动：她缓缓转身，衣袂随风飘动，落叶环绕。
镜头：中景 → 缓慢推近至特写，低角度仰拍。
灯光：金色逆光透过银杏叶，暖色调，柔和的丁达尔效应。
```

### 多镜头 (Multi-Shot, Kling 3.0) 模板

```
[Character A: 角色名] — 外貌、服装、性格关键词

镜头1 [广角，平拍]: 环境建立 — 地点、时间、氛围
镜头2 [中景，跟拍]: 角色动作 — 具体行为和表情
镜头3 [特写，慢动作]: 关键细节 — 情绪高潮
```

示例：
```
[Character A: 小白] 白色长毛猫，琥珀色眼睛，优雅。

镜头1 [广角，静止]: 雪后的日式庭院，清晨薄雾。
镜头2 [中景，水平跟拍]: 小白从走廊跳下，在雪地上留下脚印，尾巴竖起。
镜头3 [特写，慢动作60fps]: 小白的爪子踩入雪中，雪花飞溅，阳光折射微光。
```

### 图生视频 (Image-to-Video) 模板

以参考图为基础，只描述**要动起来的部分**：

```
参考图提供：角色外观和场景。
提示词只描述运动：
— 主体运动：头发被风吹起，眼睛缓缓眨动
— 环境运动：背景烛光微微摇曳，窗帘轻摆
— 镜头运动：从特写缓慢拉远至中景
```

### Motion Brush (Kling 2.6 Pro) 描述

```
元素运动清单：
— [前景主体]: 向前行走，速度为步行
— [背景树木]: 轻微左右摇摆，幅度小
— [水面]: 涟漪向外扩散，频率慢
— [云层]: 从左向右缓慢移动
```

### 负向提示词 (Kling 2.6 Pro)

```
负向提示词：画面抖动、变形、闪烁、模糊、不自然的面部扭曲、手指变形、文字乱码
```

## 镜头语言参考

| 景别 | 英文 | 用途 |
|------|------|------|
| 远景 | Extreme Long Shot | 环境建立 |
| 全景 | Long Shot | 角色全貌+环境关系 |
| 中景 | Medium Shot | 角色动作展示 |
| 近景 | Close-up | 面部表情 |
| 特写 | Extreme Close-up | 关键细节强调 |

| 镜头运动 | 效果 |
|----------|------|
| 推轨 (Dolly In) | 渐进式关注 |
| 拉远 (Dolly Out) | 揭示环境 |
| 跟拍 (Tracking) | 跟随主体 |
| 摇镜 (Pan) | 水平扫视 |
| 俯仰 (Tilt) | 垂直扫视 |
| 手持 (Handheld) | 真实感 |

## 灯光设计

| 风格 | 描述词 |
|------|--------|
| 黄金时刻 | warm golden backlight, long shadows, soft diffusion |
| 蓝调时刻 | cool blue ambient, twilight sky, city lights |
| 伦勃朗光 | Rembrandt lighting, dramatic chiaroscuro, triangle patch |
| 霓虹美学 | neon glow, colored rim light, wet street reflections |
| 自然光 | diffused window light, overcast soft shadows, practical light |

## 节奏与时长

- **5 秒**: 单一动作、简单情感表达
- **10 秒**: 动作+反应、短对话
- **15 秒**: 完整叙事弧（Kling 3.0 多镜头）

## 快速检查清单

- [ ] 提示词是否包含具体的运动描述？（不只是静态画面）
- [ ] 镜头语言是否明确？（景别、角度、运动）
- [ ] 灯光方向是否指定？（光源、色温）
- [ ] 多镜头是否有角色一致性锚点？
- [ ] Motion Brush 是否逐元素指定运动？
- [ ] 负向提示词是否已填写（Kling 2.6 Pro）？

## 参考

- Kling 官方文档: https://app.klingai.com
- smixs/visual-skills: https://github.com/smixs/visual-skills
