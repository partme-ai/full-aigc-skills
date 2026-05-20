#!/usr/bin/env bash
# idphoto.sh — 证件照生成脚本
# 两步流程：抠图裁切 (/idphoto) → 换底 (/add_background)
#
# 用法:
#   bash idphoto.sh --image photo.jpg --color blue --size 一寸 --output ./output
#   bash idphoto.sh --image photo.jpg --color white --width 295 --height 413
#
# 环境变量:
#   IDPHOTO_API_URL    API 地址 (默认 http://127.0.0.1:8080)

set -euo pipefail

API="${IDPHOTO_API_URL:-http://127.0.0.1:8080}"

# ── 证件照尺寸预设 ─────────────────────────────────
declare -A SIZE_MAP
SIZE_MAP["一寸"]="295 413"
SIZE_MAP["二寸"]="413 579"
SIZE_MAP["小一寸"]="260 378"
SIZE_MAP["小二寸"]="413 531"
SIZE_MAP["大一寸"]="390 567"
SIZE_MAP["大二寸"]="413 626"
SIZE_MAP["护照"]="390 567"
SIZE_MAP["港澳通行证"]="390 567"

# ── 默认值 ─────────────────────────────────────────
IMAGE=""
COLOR="white"
WIDTH=""
HEIGHT=""
OUTDIR="."
DPI="300"
VERBOSE=false

usage() {
  cat <<EOF
用法: bash idphoto.sh --image <path> [options]

必需:
  --image <path>        输入图片路径

可选:
  --color <name|hex>    背景色: white(白)/blue(蓝)/red(红) 或 HEX (默认 white)
  --size <name>         预设尺寸: 一寸/二寸/小一寸/小二寸/大一寸/大二寸/护照/港澳通行证
  --width <px>          自定义宽度 (会覆盖 --size)
  --height <px>         自定义高度 (会覆盖 --size)
  --output <dir>        输出目录 (默认 .)

颜色预设:
  white  #FFFFFF  身份证/护照
  blue   #438EDB  毕业证/港澳通行证
  red    #C8102E  结婚证

环境变量:
  IDPHOTO_API_URL       API 地址 (默认 http://127.0.0.1:8080)
EOF
  exit 0
}

# ── 参数解析 ───────────────────────────────────────
while [[ $# -gt 0 ]]; do
  case "$1" in
    --image)    IMAGE="$2"; shift 2 ;;
    --color)    COLOR="$2"; shift 2 ;;
    --size)
      SIZE="$2"
      if [[ -n "${SIZE_MAP[$SIZE]:-}" ]]; then
        read WIDTH HEIGHT <<< "${SIZE_MAP[$SIZE]}"
      else
        echo "❌ 未知尺寸: $SIZE" >&2
        echo "   可用: ${!SIZE_MAP[*]}" >&2
        exit 1
      fi
      shift 2 ;;
    --width)    WIDTH="$2"; shift 2 ;;
    --height)   HEIGHT="$2"; shift 2 ;;
    --output)   OUTDIR="$2"; shift 2 ;;
    --dpi)      DPI="$2"; shift 2 ;;
    --verbose|-v) VERBOSE=true; shift ;;
    --help|-h)  usage ;;
    *) echo "未知参数: $1"; usage ;;
  esac
done

# ── 验证 ───────────────────────────────────────────
if [[ -z "$IMAGE" ]]; then
  echo "❌ 缺少 --image 参数" >&2
  exit 1
fi
if [[ ! -f "$IMAGE" ]]; then
  echo "❌ 文件不存在: $IMAGE" >&2
  exit 1
fi
if [[ -z "$WIDTH" || -z "$HEIGHT" ]]; then
  echo "❌ 请用 --size 或 --width/--height 指定尺寸" >&2
  exit 1
fi

# ── 颜色解析 ───────────────────────────────────────
case "$COLOR" in
  white|白)  HEX="FFFFFF" ;;
  blue|蓝)   HEX="438EDB" ;;
  red|红)    HEX="C8102E" ;;
  *)         HEX="${COLOR#\#}" ;; # 直接使用 HEX 或去掉 #
esac

BASENAME=$(basename "$IMAGE" | sed 's/\.[^.]*$//')
mkdir -p "$OUTDIR"

# ═══════════════════════════════════════════════════
#  Step 1: 抠图 + 人脸对齐 + 裁切 → RGBA 透明底
# ═══════════════════════════════════════════════════
$VERBOSE && echo "▶ Step 1/2: 抠图裁切 (${WIDTH}x${HEIGHT})..." >&2

STEP1=$(curl -sS -X POST "$API/idphoto" \
  -F "input_image=@$IMAGE" \
  -F "width=$WIDTH" \
  -F "height=$HEIGHT" \
  -F "dpi=$DPI" \
  -F "hd=true" \
  -F "face_alignment=true" \
  -F "human_matting_model=hivision_modnet")

if ! echo "$STEP1" | python3 -c "import sys,json; d=json.load(sys.stdin); sys.exit(0 if d.get('status') else 1)" 2>/dev/null; then
  echo "❌ Step 1 失败: $STEP1" >&2
  exit 1
fi

# 解码标准尺寸 RGBA
MATTING_PNG="$OUTDIR/${BASENAME}_matting.png"
echo "$STEP1" | python3 -c "
import sys, json, base64
d = json.load(sys.stdin)
with open('$MATTING_PNG', 'wb') as f:
    f.write(base64.b64decode(d['image_base64_standard']))
"
$VERBOSE && echo "   ✓ RGBA: $MATTING_PNG" >&2

# ═══════════════════════════════════════════════════
#  Step 2: 换底 → JPG 成品
# ═══════════════════════════════════════════════════
$VERBOSE && echo "▶ Step 2/2: 添加背景色 #$HEX..." >&2

STEP2=$(curl -sS -X POST "$API/add_background" \
  -F "input_image=@$MATTING_PNG" \
  -F "color=$HEX" \
  -F "render=0" \
  -F "dpi=$DPI")

if ! echo "$STEP2" | python3 -c "import sys,json; d=json.load(sys.stdin); sys.exit(0 if d.get('status') else 1)" 2>/dev/null; then
  echo "❌ Step 2 失败: $STEP2" >&2
  exit 1
fi

RESULT_JPG="$OUTDIR/${BASENAME}_idphoto_${COLOR}_${WIDTH}x${HEIGHT}.jpg"
echo "$STEP2" | python3 -c "
import sys, json, base64
d = json.load(sys.stdin)
with open('$RESULT_JPG', 'wb') as f:
    f.write(base64.b64decode(d['image_base64']))
"

echo "✅ 证件照已生成: $RESULT_JPG"
echo "   (抠图中间件: $MATTING_PNG)"
