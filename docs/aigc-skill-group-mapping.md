# AIGC 技能分组映射表

本文档定义 `skills/` 下按组子目录与技能名的对应关系，组织方式与 `full-stack-skills` 保持一致：`skills/<组目录名>/<skill-name>/SKILL.md`。`SKILL.md` frontmatter 的 `name` 必须等于 `<skill-name>`。

**范围**：国内 AIGC **生成**平台（文生图、图生图、文生视频、音乐生成等）。内容发布、海外平台与 [baoyu-skills](https://github.com/JimLiu/baoyu-skills) 不在本仓库整合范围内。

## 已确定组

| 组目录名 | 技能名列表 | 数量 | 平台/类别 | 说明 |
|----------|------------|------|-----------|------|
| **jimeng-skills** | jimeng-cli-image2image, jimeng-cli-image2video, jimeng-cli-text2image, jimeng-cli-text2video, jimeng-prompt-image2image, jimeng-prompt-image2video, jimeng-prompt-text2image, jimeng-prompt-text2video | 8 | jimeng / generic | 即梦提示词与 CLI 生成技能 |
| **pippit-skills** | xyq-nest-skill | 1 | generic | 小云雀 / Pippit 会话式生图生视频技能，组根目录保留上游 `README.md` |
| **minimax-skills** | minimax-multimodal-toolkit, minimax-music-gen, minimax-music-playlist | 3 | generic | MiniMax 多模态与音乐技能，通过 `include` 只同步指定技能 |
| **remotion-skills** | remotion | 1 | generic | [remotion-dev/skills](https://github.com/remotion-dev/skills) Remotion 视频创作最佳实践 |

## 规划中的组

| 组目录名 | 状态 | 说明 |
|----------|------|------|
| **kling-skills** | 待补充 | 可灵等快手系视频生成 |
| **wanx-skills** | 待补充 | 通义万相等阿里系图像/视频 |
| **seedream-skills** | 待补充 | 豆包 Seedream 等字节系图像 |
| **zhipu-skills** | 待补充 | 智谱图像/视频能力 |
| **hailuo-skills** | 待补充 | 海螺等 MiniMax 系视频（与 minimax-skills 分工待定） |
| **coze-skills** | 待补充 | 扣子生图、语音等（参考工作区 `coze-skills`，自研或同步策略待定） |
| **volcengine-skills** | 待补充 | 火山引擎视觉/视频类生成 API |
| **baidu-qianfan-skills** | 待补充 | 千帆等百度系生成能力 |
| **integ-<source>-skills** | 按需生成 | 国内平台上游仓库同步后的技能组（`include` 白名单） |

## 路径示例

- 自研技能：`skills/wanx-skills/aigc-wanx-text2image/SKILL.md`
- 外部同步：`skills/minimax-skills/minimax-music-gen/SKILL.md`
- marketplace 注册：`"./skills/jimeng-skills/jimeng-cli-text2image"`

## 维护规则

1. 新增组时，在 `.claude-plugin/marketplace.json` 增加一个插件条目（推荐一组一插件）。
2. 更新本表后再登记 marketplace 路径。
3. 执行 `./scripts/sync-sources.sh` 检查磁盘、marketplace 与本表是否一致。
