# AIGC 技能分组映射表

本文档定义 `skills/` 下按组子目录与技能名的对应关系，组织方式与 `full-stack-skills` 保持一致：`skills/<组目录名>/<skill-name>/SKILL.md`。`SKILL.md` frontmatter 的 `name` 必须等于 `<skill-name>`。

## 已确定组

| 组目录名 | 技能名列表 | 数量 | 平台/类别 | 说明 |
|----------|------------|------|-----------|------|
| **jimeng-skills** | jimeng-cli-image2image, jimeng-cli-image2video, jimeng-cli-text2image, jimeng-cli-text2video, jimeng-prompt-image2image, jimeng-prompt-image2video, jimeng-prompt-text2image, jimeng-prompt-text2video | 8 | jimeng / generic | 即梦提示词与 CLI 生成技能 |
| **pippit-skills** | xyq-nest-skill | 1 | generic | 小云雀 / Pippit 会话式生图生视频技能，组根目录保留上游 `README.md` |

## 规划中的组

| 组目录名 | 状态 | 说明 |
|----------|------|------|
| **wechat-skills** | 待补充 | 微信公众号内容生成与发布 |
| **xiaohongshu-skills** | 待补充 | 小红书图文/笔记生成 |
| **douyin-skills** | 待补充 | 抖音短视频脚本与发布 |
| **bilibili-skills** | 待补充 | B 站视频与稿件辅助 |
| **weibo-skills** | 待补充 | 微博内容生成与发布 |
| **youtube-skills** | 待补充 | YouTube 脚本、字幕与发布 |
| **x-skills** | 待补充 | X / Twitter 内容生成与发布 |
| **publish-skills** | 待补充 | 跨平台发布编排与通用发布工具 |
| **integ-<source>-skills** | 按需生成 | 外部仓库同步后的整合技能组 |

## 路径示例

- 自研技能：`skills/wechat-skills/aigc-wechat-article-draft/SKILL.md`
- 外部整合：`skills/integ-baoyu-skills/integ-baoyu-post-to-wechat/SKILL.md`
- marketplace 注册：`"./skills/wechat-skills/aigc-wechat-article-draft"`

## 维护规则

1. 新增组时，在 `.claude-plugin/marketplace.json` 增加一个插件条目（推荐一组一插件）。
2. 更新本表后再登记 marketplace 路径。
3. 执行 `./scripts/sync-sources.sh` 检查磁盘、marketplace 与本表是否一致。
