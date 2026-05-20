---
name: id-photo
description: "生成合规证件照。两步流程：抠图裁切→换底，基于 HivisionIDPhotos API。支持一寸/二寸/小一寸/小二寸/护照/港澳通行证等预设尺寸，白底/蓝底/红底及自定义 HEX 背景色，300DPI 输出。当用户要求拍证件照、换底、改证件照尺寸、问证件照规格、或提到一寸二寸照片时触发。"
metadata:
  source: "https://github.com/Zeyi-Lin/HivisionIDPhotos"
  license: "MIT"
  requires:
    bins: ["curl", "python3"]
    env: ["IDPHOTO_API_URL"]
---

# 证件照生成

基于 [HivisionIDPhotos](https://github.com/Zeyi-Lin/HivisionIDPhotos) API 生成合规证件照。

## 前置条件

```bash
# 部署 API 服务（任选一种）
docker run -d -p 8080:8080 linzeyi/hivision_idphotos python3 deploy_api.py

# 设置环境变量
export IDPHOTO_API_URL="http://127.0.0.1:8080"
```

## 快速使用

```bash
bash {skillDir}/scripts/idphoto.sh --image photo.jpg --color blue --size 一寸
```

## 预设尺寸

| --size | 像素 @300DPI | 宽×高(mm) | 常见用途 |
|--------|-------------|-----------|---------|
| 一寸 | 295×413 | 25×35 | 身份证、简历 |
| 二寸 | 413×579 | 35×49 | 毕业证 |
| 小一寸 | 260×378 | 22×32 | 驾照 |
| 小二寸 | 413×531 | 35×45 | 护照（部分国家） |
| 大一寸 | 390×567 | 33×48 | 护照、港澳通行证 |
| 护照 | 390×567 | 33×48 | 中国护照 |
| 港澳通行证 | 390×567 | 33×48 | 港澳通行证 |

## 预设颜色

| --color | HEX | 用途 |
|---------|-----|------|
| white / 白 | #FFFFFF | 身份证、护照、驾照 |
| blue / 蓝 | #438EDB | 毕业证、港澳通行证 |
| red / 红 | #C8102E | 结婚证 |

也支持自定义 HEX：`--color 4CAF50`

## 自定义尺寸

```bash
bash {skillDir}/scripts/idphoto.sh --image photo.jpg --color white --width 390 --height 567
```

## 参数参考

| 参数 | 必需 | 说明 |
|------|------|------|
| `--image` | 是 | 输入照片路径 |
| `--color` | 否 | 背景色 (默认 white) |
| `--size` | 否 | 预设尺寸名 |
| `--width` | 否 | 自定义宽度，覆盖 `--size` |
| `--height` | 否 | 自定义高度，覆盖 `--size` |
| `--output` | 否 | 输出目录 (默认 .) |
| `--dpi` | 否 | DPI (默认 300) |

## 处理流程

```
输入照片
  │
  ▼
Step 1: POST /idphoto
  人脸检测 → 抠图 → 人脸对齐 → 裁切
  → 输出透明底 RGBA PNG
  │
  ▼
Step 2: POST /add_background
  透明底 + 指定背景色 → JPG 成品
  → 输出合规证件照
```

## 高级用法

### 调整人脸比例

编辑脚本中的默认值：

```bash
# 头部占画面高度比 (默认 0.45, 范围 0.4-0.5)
HEAD_HEIGHT_RATIO=0.45
# 头部宽度占画面比 (默认 0.2, 范围 0.15-0.25)
HEAD_MEASURE_RATIO=0.2
# 顶部边距范围 (默认 0.1-0.12)
TOP_DISTANCE_MIN=0.1
TOP_DISTANCE_MAX=0.12
```

### 生成排版照（6寸相纸）

```bash
curl -X POST "$IDPHOTO_API_URL/generate_layout_photos" \
  -F "input_image=@photo.jpg" \
  -F "height=413" -F "width=295" -F "dpi=300" \
  -o layout.jpg
```

## 抠图模型选择

| 模型 | 速度 | 精度 | 适用 |
|------|------|------|------|
| `hivision_modnet` (默认) | 快 | 中 | 纯色换底最佳 |
| `modnet_photographic_portrait_matting` | 最快 | 中 | 通用 |
| `birefnet-v1-lite` | 慢 | 最高 | 精细发丝、半透明衣物 |

## API 参考

完整 API 文档见 `references/openapi.yaml`

## 故障排查

| 问题 | 解决 |
|------|------|
| 连接失败 | 检查 `$IDPHOTO_API_URL` 和 Docker 是否运行 |
| 人脸未检测 | 用正面、光线均匀的照片 |
| 裁切偏上/偏下 | 调整 `head_height_ratio` 和 `top_distance_*` |
| 文件过大 | 用 `/set_kb` 端点压缩 |

## 来源

HivisionIDPhotos - https://github.com/Zeyi-Lin/HivisionIDPhotos (MIT)
