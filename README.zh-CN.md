<div align="center">

# Full AIGC Skills

**34+ 个 Agent Skills。6+ 个技能包。一个统一生态。**

*图像 · 视频 · 音频 · 音乐 · 文本 · 多模态 — 生产级品质，独立安装的 AIGC 技能。*

[![Stars](https://img.shields.io/github/stars/partme-ai/full-aigc-skills?style=social)](https://github.com/partme-ai/full-aigc-skills)
[![License](https://img.shields.io/badge/License-Apache%202.0-green)](LICENSE)
[![Agent Skills](https://img.shields.io/badge/Agent%20Skills-Compatible-purple)](https://agentskills.io)

[English](./README.md) | 简体中文

[简介](#-简介) ·
[安装](#-安装) ·
[技能目录](#-技能目录) ·
[社区资源](#-社区资源) ·
[架构](#-架构) ·
[贡献](#-贡献指南)

</div>

---

## 简介

**Full AIGC Skills** 是面向 AI 生成内容 (AIGC) 的 Agent Skills 导航站 — 涵盖图像生成、视频创作、音频合成、音乐制作、文本生成和多模态工作流。所有技能遵循 [Agent Skills 规范](https://agentskills.io/)，可独立安装。

本仓库原为国内 AIGC 平台技能的 monorepo。2026 年 6 月，我们将所有技能拆分为 [full-aigc-skills](https://github.com/full-aigc-skills) GitHub 组织下的 **6+ 个独立包**。本仓库现为目录、导航站和社区资源中心。

> **迁移完成（2026 年 6 月）**：全部 34 个技能已迁移到 [full-aigc-skills](https://github.com/full-aigc-skills) 组织下的独立仓库。本仓库现在是目录和导航站。

### 覆盖领域

| 领域 | 问题 | 解决方案 |
|------|------|----------|
| **图像生成** | 文生图、图像编辑、风格迁移 | 每个平台配备专属提示词 + CLI 技能 |
| **视频创作** | 文生视频、图生视频、视频编辑 | 提示词工程 + API 集成技能 |
| **音频/音乐** | TTS、音乐生成、音效合成 | 多模态工具集 + 音乐制作技能 |
| **文本生成** | LLM 写作、翻译、摘要 | 平台特定文本生成技能 |
| **多模态融合** | 跨模态任务、多模态对话 | OCR、VLM、Embedding、多模态工具集技能 |

---

## 安装

一条命令安装任意技能包：

```bash
npx skills add full-aigc-skills/jimeng-skills   # 即梦 图像&视频 (12 个技能)
npx skills add full-aigc-skills/zhipu-skills    # 智谱 文本/图像/视频/音频 (8 个技能)
npx skills add full-aigc-skills/coze-skills     # 扣子 ASR/TTS/图像/搜索 (6 个技能)
```

或安装包中的特定技能：

```bash
npx skills add full-aigc-skills/jimeng-skills --skill jimeng-prompt-text2image
```

---

## 技能目录

### 即梦 (Jimeng) — 12 个技能

| 技能 | 描述 | 安装 |
|------|------|------|
| [jimeng-prompt-text2image](https://github.com/full-aigc-skills/jimeng-skills) | 文生图提示词工程 | `npx skills add full-aigc-skills/jimeng-skills --skill jimeng-prompt-text2image` |
| [jimeng-prompt-text2video](https://github.com/full-aigc-skills/jimeng-skills) | 文生视频提示词工程 | `npx skills add full-aigc-skills/jimeng-skills --skill jimeng-prompt-text2video` |
| [jimeng-prompt-image2image](https://github.com/full-aigc-skills/jimeng-skills) | 图生图提示词工程 | `npx skills add full-aigc-skills/jimeng-skills --skill jimeng-prompt-image2image` |
| [jimeng-prompt-image2video](https://github.com/full-aigc-skills/jimeng-skills) | 图生视频提示词工程 | `npx skills add full-aigc-skills/jimeng-skills --skill jimeng-prompt-image2video` |
| [jimeng-cli-text2image](https://github.com/full-aigc-skills/jimeng-skills) | 文生图 CLI 执行 | `npx skills add full-aigc-skills/jimeng-skills --skill jimeng-cli-text2image` |
| [jimeng-cli-text2video](https://github.com/full-aigc-skills/jimeng-skills) | 文生视频 CLI 执行 | `npx skills add full-aigc-skills/jimeng-skills --skill jimeng-cli-text2video` |
| [jimeng-cli-image2image](https://github.com/full-aigc-skills/jimeng-skills) | 图生图 CLI 执行 | `npx skills add full-aigc-skills/jimeng-skills --skill jimeng-cli-image2image` |
| [jimeng-cli-image2video](https://github.com/full-aigc-skills/jimeng-skills) | 图生视频 CLI 执行 | `npx skills add full-aigc-skills/jimeng-skills --skill jimeng-cli-image2video` |
| [jimeng-opencli-*](https://github.com/full-aigc-skills/jimeng-skills) | 浏览器编排（4 个技能） | `npx skills add full-aigc-skills/jimeng-skills` |

### 可灵 (Kling) — 2 个技能

| 技能 | 描述 | 安装 |
|------|------|------|
| [kling-prompt](https://github.com/full-aigc-skills/kling-skills) | 可灵视频提示词工程 | `npx skills add full-aigc-skills/kling-skills --skill kling-prompt` |
| [kling-video](https://github.com/full-aigc-skills/kling-skills) | 可灵视频生成 | `npx skills add full-aigc-skills/kling-skills --skill kling-video` |

### 智谱 (Zhipu) — 8 个技能

| 技能 | 描述 | 安装 |
|------|------|------|
| [zhipu-text](https://github.com/full-aigc-skills/zhipu-skills) | 文本生成 | `npx skills add full-aigc-skills/zhipu-skills --skill zhipu-text` |
| [zhipu-image-generation](https://github.com/full-aigc-skills/zhipu-skills) | 图像生成 | `npx skills add full-aigc-skills/zhipu-skills --skill zhipu-image-generation` |
| [zhipu-video-generation](https://github.com/full-aigc-skills/zhipu-skills) | 视频生成 | `npx skills add full-aigc-skills/zhipu-skills --skill zhipu-video-generation` |
| [zhipu-audio](https://github.com/full-aigc-skills/zhipu-skills) | 语音合成/识别 | `npx skills add full-aigc-skills/zhipu-skills --skill zhipu-audio` |
| [zhipu-ocr](https://github.com/full-aigc-skills/zhipu-skills) | 文字识别 | `npx skills add full-aigc-skills/zhipu-skills --skill zhipu-ocr` |
| [zhipu-vlm](https://github.com/full-aigc-skills/zhipu-skills) | 视觉语言模型 | `npx skills add full-aigc-skills/zhipu-skills --skill zhipu-vlm` |
| [zhipu-embedding](https://github.com/full-aigc-skills/zhipu-skills) | 向量嵌入 | `npx skills add full-aigc-skills/zhipu-skills --skill zhipu-embedding` |
| [zhipu-humanoid](https://github.com/full-aigc-skills/zhipu-skills) | 数字人 | `npx skills add full-aigc-skills/zhipu-skills --skill zhipu-humanoid` |

### MiniMax — 3 个技能

| 技能 | 描述 | 安装 |
|------|------|------|
| [minimax-multimodal-toolkit](https://github.com/full-aigc-skills/minimax-skills) | 多模态工具集 | `npx skills add full-aigc-skills/minimax-skills --skill minimax-multimodal-toolkit` |
| [minimax-music-gen](https://github.com/full-aigc-skills/minimax-skills) | 音乐生成 | `npx skills add full-aigc-skills/minimax-skills --skill minimax-music-gen` |
| [minimax-music-playlist](https://github.com/full-aigc-skills/minimax-skills) | 音乐播放列表生成 | `npx skills add full-aigc-skills/minimax-skills --skill minimax-music-playlist` |

### 扣子 (Coze) — 6 个技能

| 技能 | 描述 | 安装 |
|------|------|------|
| [coze-asr](https://github.com/full-aigc-skills/coze-skills) | 语音识别 | `npx skills add full-aigc-skills/coze-skills --skill coze-asr` |
| [coze-tts](https://github.com/full-aigc-skills/coze-skills) | 语音合成 | `npx skills add full-aigc-skills/coze-skills --skill coze-tts` |
| [coze-voice-gen](https://github.com/full-aigc-skills/coze-skills) | 声音克隆/生成 | `npx skills add full-aigc-skills/coze-skills --skill coze-voice-gen` |
| [coze-image-gen](https://github.com/full-aigc-skills/coze-skills) | 图像生成 | `npx skills add full-aigc-skills/coze-skills --skill coze-image-gen` |
| [coze-web-fetch](https://github.com/full-aigc-skills/coze-skills) | 网页抓取 | `npx skills add full-aigc-skills/coze-skills --skill coze-web-fetch` |
| [coze-web-search](https://github.com/full-aigc-skills/coze-skills) | 网页搜索 | `npx skills add full-aigc-skills/coze-skills --skill coze-web-search` |

### 小云雀 (Pippit) — 1 个技能

| 技能 | 描述 | 安装 |
|------|------|------|
| [xyq-nest-skill](https://github.com/full-aigc-skills/pippit-skills) | 文生图/视频、风格转换、短剧MV | `npx skills add full-aigc-skills/pippit-skills` |

---

## 社区资源

除了我们自己的技能包，我们还追踪 AIGC 生态中最优质的社区资源。

### 🌟 Awesome 资源列表

| 资源 | Stars | 焦点 |
|------|:-----:|------|
| [awesome-generative-ai-guide](https://github.com/aishwaryanr/awesome-generative-ai-guide) | 27k+ | 生成式 AI 研究、教程、Notebook |
| [awesome-generative-ai](https://github.com/steven2358/awesome-generative-ai) | 12k+ | 现代生成式 AI 项目和服务 |
| [awesome-generative-ai](https://github.com/filipecalegario/awesome-generative-ai) | 3k+ | 工具、模型、参考资源 |
| [Awesome-AIGC-Tutorials](https://github.com/luban-agi/Awesome-AIGC-Tutorials) | 4.5k+ | LLM 和 AI 绘画教程 |
| [ai-collection](https://github.com/ai-collection/ai-collection) | 8.9k+ | 生成式 AI 应用集合 |
| [awesome-generative-ai-apps](https://github.com/Anil-matcha/awesome-generative-ai-apps) | 379 | 50+ 开源生成式 AI 应用（图像、视频、试穿） |
| [awesome-skills](https://github.com/vivy-yi/awesome-skills) | 1 | 230+ AI Agent Skills 精选列表 |
| [Awesome-AIGC](https://github.com/wshzd/Awesome-AIGC) | 867 | AIGC 资料汇总（中文） |

### 🖼️ 图像生成

| 资源 | Stars | 焦点 |
|------|:-----:|------|
| [ComfyUI](https://github.com/comfyanonymous/ComfyUI) | 80k+ | 节点式 Stable Diffusion GUI |
| [stable-diffusion-webui](https://github.com/AUTOMATIC1111/stable-diffusion-webui) | 150k+ | SD Web UI |
| [Fooocus](https://github.com/lllyasviel/Fooocus) | 43k+ | 最简操作的图像生成 |
| [Midjourney](https://www.midjourney.com) | — | Discord/Web AI 图像生成 |
| [FLUX](https://github.com/black-forest-labs/flux) | 20k+ | FLUX 图像生成模型 |
| [IC-Light](https://github.com/lllyasviel/IC-Light) | 6k+ | 图像重光照 |

### 🎬 视频生成

| 资源 | Stars | 焦点 |
|------|:-----:|------|
| [CogVideo](https://github.com/THUDM/CogVideo) | 7k+ | 文生视频（智谱） |
| [AnimateDiff](https://github.com/guoyww/AnimateDiff) | 10k+ | 动画化你的个性化文生图模型 |
| [SVD](https://github.com/Stability-AI/generative-models) | 25k+ | Stable Video Diffusion |
| [Open-Sora](https://github.com/hpcaitech/Open-Sora) | 24k+ | 开源视频生成 |
| [Kling](https://kling.kuaishou.com) | — | 可灵 AI 视频生成 |
| [Jimeng](https://jimeng.jianying.com) | — | 即梦 AI 内容生成 |

### 🎵 音频与音乐

| 资源 | Stars | 焦点 |
|------|:-----:|------|
| [Bark](https://github.com/suno-ai/bark) | 36k+ | Suno 文生音频 |
| [XTTS](https://github.com/coqui-ai/TTS) | 36k+ | 语音合成 + 声音克隆 |
| [MusicGen](https://github.com/facebookresearch/audiocraft) | 23k+ | Meta 音乐生成 |
| [RVC](https://github.com/RVC-Project/Retrieval-based-Voice-Conversion) | 25k+ | 声音转换 |
| [Whisper](https://github.com/openai/whisper) | 75k+ | 语音识别 |
| [So-VITS-SVC](https://github.com/svc-develop-team/so-vits-svc) | 25k+ | 歌声转换 |

### 🧩 多模态与平台

| 资源 | Stars | 焦点 |
|------|:-----:|------|
| [MiniMax](https://www.minimaxi.com) | — | 多模态 AI 平台 |
| [Coze](https://www.coze.cn) | — | 智能体构建平台（扣子） |
| [Pippit](https://pippit.com) | — | AI 内容创作平台（小云雀） |
| [Suno](https://suno.com) | — | AI 音乐生成 |
| [Udio](https://www.udio.com) | — | AI 音乐生成 |
| [Runway](https://runwayml.com) | — | AI 视频和图像生成 |
| [Luma AI](https://lumalabs.ai) | — | AI 视频和 3D 生成 |
| [HuggingFace](https://huggingface.co) | — | AI 模型中心 |

### 📚 Agent Skills 生态

| 资源 | 焦点 |
|------|------|
| [Agent Skills Specification](https://agentskills.io) | AI Agent Skills 开放规范 |
| [Skills CLI](https://github.com/vercel-labs/skills) | 通用 Agent Skills 安装 CLI |
| [full-stack-skills](https://github.com/partme-ai/full-stack-skills) | 460+ 全栈开发技能 |
| [full-statck-skills](https://github.com/full-statck-skills) | 42+ 技能包组织 |
| [baoyu-skills](https://github.com/JimLiu/baoyu-skills) | Baoyu 精选 AI Agent Skills |

> 💡 **贡献**：发现了优秀的 AIGC 技能或资源？请看[贡献指南](#-贡献指南)。

---

## 架构

### 技能工作原理

每个技能遵循 [Agent Skills 规范](https://agentskills.io)：

```
<package>/
├── skills/
│   ├── <skill-name>/
│   │   ├── SKILL.md          # 必需 — AI 智能体按需加载
│   │   ├── examples/         # 可选 — 使用示例
│   │   ├── references/       # 可选 — 详细参考文档
│   │   └── scripts/          # 可选 — 可执行脚本
│   └── ...
├── .claude-plugin/           # 插件元数据
└── README.md
```

### 按需加载

技能使用**渐进式披露**：
1. **启动时**：仅加载技能名称和描述（最小上下文）
2. **按需**：当智能体识别到相关任务时加载完整的 `SKILL.md`
3. **深入**：仅在明确需要时读取参考文件

### 技能包组织

| 包 | 平台 | 技能数 | 描述 |
|----|------|:------:|------|
| [jimeng-skills](https://github.com/full-aigc-skills/jimeng-skills) | 即梦 | 12 | 文生图/视频，CLI + Prompt 双通道 |
| [kling-skills](https://github.com/full-aigc-skills/kling-skills) | 可灵 | 2 | 视频提示词工程 |
| [zhipu-skills](https://github.com/full-aigc-skills/zhipu-skills) | 智谱 | 8 | 文本/图像/视频/音频/OCR/VLM |
| [minimax-skills](https://github.com/full-aigc-skills/minimax-skills) | MiniMax | 3 | 多模态 + 音乐生成 |
| [coze-skills](https://github.com/full-aigc-skills/coze-skills) | 扣子 | 6 | ASR/TTS/图像/搜索 |
| [pippit-skills](https://github.com/full-aigc-skills/pippit-skills) | 小云雀 | 1 | 文生图/视频、风格转换 |
| **总计** | | **32** | |

---

## Claude Code 用户

安装单个技能包：

```bash
npx skills add full-aigc-skills/jimeng-skills   # 12 个即梦技能
npx skills add full-aigc-skills/zhipu-skills    # 8 个智谱技能
npx skills add full-aigc-skills/coze-skills     # 6 个扣子技能
npx skills add full-aigc-skills/minimax-skills  # 3 个 MiniMax 技能
npx skills add full-aigc-skills/kling-skills    # 2 个可灵技能
npx skills add full-aigc-skills/pippit-skills   # 1 个小云雀技能
```

或手动复制技能到项目：

```bash
git clone https://github.com/full-aigc-skills/<package>.git
cp -r <package>/skills/* .claude/skills/
```

---

## 生态

| 资源 | 链接 |
|------|------|
| **技能包** | [github.com/full-aigc-skills](https://github.com/full-aigc-skills) |
| **全栈技能** | [github.com/partme-ai/full-stack-skills](https://github.com/partme-ai/full-stack-skills) |
| **Agent Skills 规范** | [agentskills.io](https://agentskills.io) |
| **Skills CLI** | [github.com/vercel-labs/skills](https://github.com/vercel-labs/skills) |
| **PartMe.AI** | [github.com/partme-ai](https://github.com/partme-ai) |

---

## 贡献指南

欢迎贡献！有两种方式：

### 添加新技能包

1. 在 [full-aigc-skills](https://github.com/full-aigc-skills) 组织下创建新仓库
2. 按照 [Agent Skills 规范](https://agentskills.io) 构建
3. 提交 PR 更新本 README 中的包链接

### 添加社区资源

1. Fork 本仓库
2. 在[社区资源](#-社区资源)部分添加你的资源
3. 提交 PR

详见 [AGENTS.md](AGENTS.md) 创建技能的详细指南。

---

## 许可证

Apache 2.0 — 详见 [LICENSE](LICENSE)。

---

<div align="center">

**如果这个项目对你有帮助，请给我们一个 ⭐️**

Made with ❤️ by PartMe.AI Team

</div>
