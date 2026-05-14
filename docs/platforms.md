# Platform Coverage

`npm run inventory` writes `integrations/inventory.json` and groups skills by platform keywords.

| Platform | Keyword examples |
|----------|------------------|
| WeChat | wechat, weixin, 公众号, 微信 |
| Xiaohongshu | xhs, xiaohongshu, 小红书 |
| Douyin | douyin, tiktok, 抖音 |
| Bilibili | bilibili, b站 |
| Weibo | weibo, 微博 |
| YouTube | youtube, yt |
| X | post-to-x, twitter |
| Instagram | instagram |
| LinkedIn | linkedin |
| Kuaishou | kuaishou, 快手 |
| Zhihu | zhihu, 知乎 |
| Generic AIGC | markdown, image, video, audio, translate, infographic, slide |

Use `platforms` in `config/external-sources.json` to annotate upstream repositories even before skills are imported.
