<div align="center">

# Full AIGC Skills

**34+ Agent Skills. 6+ Skill Packages. One Ecosystem.**

*Image · Video · Audio · Music · Text · Multimodal — production-ready, independently installable AIGC skills.*

[![Stars](https://img.shields.io/github/stars/partme-ai/full-aigc-skills?style=social)](https://github.com/partme-ai/full-aigc-skills)
[![License](https://img.shields.io/badge/License-Apache%202.0-green)](LICENSE)
[![Agent Skills](https://img.shields.io/badge/Agent%20Skills-Compatible-purple)](https://agentskills.io)

[简体中文](./README.md)

[Introduction](#-introduction) ·
[Install](#-install) ·
[Skill Catalog](#-skill-catalog) ·
[Community Resources](#-community-resources) ·
[Architecture](#-architecture) ·
[Contributing](#-contributing)

</div>

---

## Introduction

**Full AIGC Skills** is the navigation hub for Agent Skills focused on AI-generated content — covering image generation, video creation, audio synthesis, music production, text generation, and multimodal workflows. All skills follow the [Agent Skills Specification](https://agentskills.io/) and are independently installable.

This repo started as a monorepo for Chinese AIGC platform skills. In June 2026 we split into **6+ independent packages** under the [full-aigc-skills](https://github.com/full-aigc-skills) GitHub organization. This repo is now the catalog, navigation hub, and community resource center.

> **Migration Complete (June 2026)**: All 34 skills have been migrated to individual repos under [full-aigc-skills](https://github.com/full-aigc-skills). This repo is now the catalog & navigation hub.

### What We Cover

| Domain | Problem | Solution |
|--------|---------|----------|
| **图像生成** | Text-to-image, image editing, style transfer | Dedicated prompt + CLI skills per platform |
| **视频创作** | Text-to-video, image-to-video, video editing | Prompt engineering + API integration skills |
| **音频/音乐** | TTS, music generation, sound effects | Multimodal toolkit + music production skills |
| **文本生成** | LLM writing, translation, summarization | Platform-specific text generation skills |
| **多模态融合** | Cross-modal tasks, multimodal dialogues | OCR, VLM, embedding, multimodal toolkit skills |

---

## Install

Install any skill package with one command:

```bash
npx skills add full-aigc-skills/jimeng-skills   # 即梦 image & video (12 skills)
npx skills add full-aigc-skills/zhipu-skills    # 智谱 text/image/video/audio (8 skills)
npx skills add full-aigc-skills/coze-skills     # 扣子 ASR/TTS/image/search (6 skills)
```

Or install a specific skill from a package:

```bash
npx skills add full-aigc-skills/jimeng-skills --skill jimeng-prompt-text2image
```

---

## Skill Catalog

| Platform | Package | ⭐ Stars | Skills | Install |
|----------|---------|:------:|:------:|---------|
| 🌟 **Baoyu's Picks** | [baoyu-skills](https://github.com/JimLiu/baoyu-skills) | 21.4k | 21 | `npx skills add JimLiu/baoyu-skills` |
| 🎨 **即梦 (Jimeng)** | [jimeng-skills](https://github.com/full-aigc-skills/jimeng-skills) | — | 12 | `npx skills add full-aigc-skills/jimeng-skills` |
| 🧠 **智谱 (Zhipu)** | [zhipu-skills](https://github.com/full-aigc-skills/zhipu-skills) | — | 8 | `npx skills add full-aigc-skills/zhipu-skills` |
| 🤖 **扣子 (Coze)** | [coze-skills](https://github.com/full-aigc-skills/coze-skills) | — | 6 | `npx skills add full-aigc-skills/coze-skills` |
| 🎵 **MiniMax** | [minimax-skills](https://github.com/full-aigc-skills/minimax-skills) | — | 3 | `npx skills add full-aigc-skills/minimax-skills` |
| 🎬 **可灵 (Kling)** | [kling-skills](https://github.com/full-aigc-skills/kling-skills) | — | 2 | `npx skills add full-aigc-skills/kling-skills` |
| 🐦 **小云雀 (Pippit)** | [pippit-skills](https://github.com/full-aigc-skills/pippit-skills) | — | 1 | `npx skills add full-aigc-skills/pippit-skills` |
| 📊 **ProcessOn** | [processon-skills](https://github.com/processonai/processon-skills) | 15 | 3 | `npx skills add https://github.com/processonai/processon-skills.git` |
| **Total** | | | **56** | |

---

## Community Resources

In addition to our own skill packages, we track the best AIGC resources across the ecosystem.

### 🌟 Awesome Lists

| Resource | Stars | Focus |
|----------|:-----:|-------|
| [awesome-generative-ai-guide](https://github.com/aishwaryanr/awesome-generative-ai-guide) | 27k+ | Comprehensive generative AI research, tutorials, notebooks |
| [awesome-generative-ai](https://github.com/steven2358/awesome-generative-ai) | 12k+ | Modern generative AI projects and services |
| [awesome-generative-ai](https://github.com/filipecalegario/awesome-generative-ai) | 3k+ | Tools, works, models, references |
| [Awesome-AIGC-Tutorials](https://github.com/luban-agi/Awesome-AIGC-Tutorials) | 4.5k+ | LLM and AI painting tutorials |
| [ai-collection](https://github.com/ai-collection/ai-collection) | 8.9k+ | Generative AI landscape — application collection |
| [awesome-generative-ai-apps](https://github.com/Anil-matcha/awesome-generative-ai-apps) | 379 | 50+ open-source generative AI apps (image, video, try-on) |
| [awesome-skills](https://github.com/vivy-yi/awesome-skills) | 1 | 230+ curated AI agent skills |
| [Awesome-AIGC](https://github.com/wshzd/Awesome-AIGC) | 867 | AIGC materials and learning resources (Chinese) |

### 🖼️ Image Generation

| Resource | Stars | Focus |
|----------|:-----:|-------|
| [ComfyUI](https://github.com/comfyanonymous/ComfyUI) | 80k+ | Node-based Stable Diffusion GUI |
| [stable-diffusion-webui](https://github.com/AUTOMATIC1111/stable-diffusion-webui) | 150k+ | SD Web UI |
| [Fooocus](https://github.com/lllyasviel/Fooocus) | 43k+ | Image generation with minimal effort |
| [Midjourney](https://www.midjourney.com) | — | AI image generation via Discord/web |
| [FLUX](https://github.com/black-forest-labs/flux) | 20k+ | FLUX image generation models |
| [Fooocus-API](https://github.com/mrhan1993/Fooocus-API) | 1k+ | API for Fooocus image generation |
| [sdxl-emoji](https://github.com/google/sdxl-emoji) | 2k+ | SDXL emoji generation |
| [IC-Light](https://github.com/lllyasviel/IC-Light) | 6k+ | Image relighting |

### 🎬 Video Generation

| Resource | Stars | Focus |
|----------|:-----:|-------|
| [CogVideo](https://github.com/THUDM/CogVideo) | 7k+ | Text-to-video generation (Zhipu) |
| [AnimateDiff](https://github.com/guoyww/AnimateDiff) | 10k+ | Animate your personalized text-to-image models |
| [SVD](https://github.com/Stability-AI/generative-models) | 25k+ | Stable Video Diffusion |
| [ModelScope](https://github.com/modelscope/modelscope) | 8k+ | AI model hub with video generation models |
| [Open-Sora](https://github.com/hpcaitech/Open-Sora) | 24k+ | Open-source video generation |
| [Kling](https://kling.kuaishou.com) | — | Kling AI video generation (可灵) |
| [Jimeng](https://jimeng.jianying.com) | — | Jimeng AI content generation (即梦) |

### 🎵 Audio & Music

| Resource | Stars | Focus |
|----------|:-----:|-------|
| [Bark](https://github.com/suno-ai/bark) | 36k+ | Text-to-audio with Suno |
| [XTTS](https://github.com/coqui-ai/TTS) | 36k+ | Text-to-speech with voice cloning |
| [MusicGen](https://github.com/facebookresearch/audiocraft) | 23k+ | Music generation from Meta |
| [RVC](https://github.com/RVC-Project/Retrieval-based-Voice-Conversion) | 25k+ | Voice conversion |
| [Whisper](https://github.com/openai/whisper) | 75k+ | Speech recognition |
| [So-VITS-SVC](https://github.com/svc-develop-team/so-vits-svc) | 25k+ | Singing voice conversion |

### 🧩 Multimodal & Tools

| Resource | Stars | Focus |
|----------|:-----:|-------|
| [MiniMax](https://www.minimaxi.com) | — | Multimodal AI platform (文本/图像/视频/语音/音乐) |
| [Coze](https://www.coze.cn) | — | Agent builder platform (扣子) |
| [Pippit](https://pippit.com) | — | AI content creation platform (小云雀) |
| [Suno](https://suno.com) | — | AI music generation |
| [Udio](https://www.udio.com) | — | AI music generation |
| [Runway](https://runwayml.com) | — | AI video and image generation |
| [Luma AI](https://lumalabs.ai) | — | AI video and 3D generation |
| [HuggingFace](https://huggingface.co) | — | AI model hub & deployment |

### 📚 Agent Skills Ecosystem

| Resource | Stars | Focus |
|----------|:-----:|-------|
| [Agent Skills Specification](https://agentskills.io) | — | Open specification for AI agent skills |
| [Skills CLI](https://github.com/vercel-labs/skills) | — | Universal CLI for installing agent skills |
| [full-stack-skills](https://github.com/partme-ai/full-stack-skills) | — | 460+ skills for full-stack development |
| [full-statck-skills](https://github.com/full-statck-skills) | — | 42+ skill package organization |
| [baoyu-skills](https://github.com/JimLiu/baoyu-skills) | — | Baoyu's curated AI agent skills |

> 💡 **Contributing**: Found a great AIGC skill or resource? See [Contributing](#-contributing) below.

---

## Architecture

### How Skills Work

Each skill follows the [Agent Skills Specification](https://agentskills.io):

```
<package>/
├── skills/
│   ├── <skill-name>/
│   │   ├── SKILL.md          # Required — loaded on-demand by AI agents
│   │   ├── examples/         # Optional — usage examples
│   │   ├── references/       # Optional — detailed reference docs
│   │   └── scripts/          # Optional — executable scripts
│   └── ...
├── .claude-plugin/           # Plugin metadata
└── README.md
```

### On-Demand Loading

Skills use **progressive disclosure**:
1. **At startup**: Only skill names and descriptions are loaded (minimal context)
2. **On demand**: Full `SKILL.md` is loaded when the agent identifies a relevant task
3. **Deep dive**: Reference files are read only when explicitly needed

---

## Ecosystem

| Resource | Link |
|----------|------|
| **Skill Packages** | [github.com/full-aigc-skills](https://github.com/full-aigc-skills) |
| **Full Stack Skills** | [github.com/partme-ai/full-stack-skills](https://github.com/partme-ai/full-stack-skills) |
| **Agent Skills Spec** | [agentskills.io](https://agentskills.io) |
| **Skills CLI** | [github.com/vercel-labs/skills](https://github.com/vercel-labs/skills) |
| **Skills Directory** | [skills.sh](https://skills.sh) |
| **PartMe.AI** | [github.com/partme-ai](https://github.com/partme-ai) |

---

## Contributing

We welcome contributions! You can contribute in two ways:

### Add a new skill package

1. Create a new repo under [full-aigc-skills](https://github.com/full-aigc-skills) org
2. Follow the [Agent Skills Specification](https://agentskills.io)
3. Submit a PR to update this README with your package link

### Add a community resource

1. Fork this repo
2. Add your resource to the [Community Resources](#-community-resources) section
3. Submit a PR

See [AGENTS.md](AGENTS.md) for detailed guidelines on creating skills.

---

## License

Apache 2.0 — see [LICENSE](LICENSE).

---

<div align="center">

**If this project helps you, please give us a ⭐️**

Made with ❤️ by PartMe.AI Team

</div>
