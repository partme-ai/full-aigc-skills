#!/usr/bin/env bash
#
# post-sync-fix.sh — 同步后自动修复已知的规范违规
#
# 用法：
#   ./scripts/post-sync-fix.sh           # 执行所有修复
#   ./scripts/post-sync-fix.sh --check   # 仅检查，不修改
#   ./scripts/post-sync-fix.sh --help    # 帮助
#
# 说明：
#   本脚本在 sync-sources.sh 之后运行，自动修复上游技能中的已知问题。
#   所有修复都是幂等的 — 多次运行结果一致，不会重复修改。
#
#   修复项：
#   1. name 修正: minimax-multimodal-toolkit (mmx-cli → minimax-multimodal-toolkit)
#   2. name 修正: remotion (remotion-best-practices → remotion)
#   3. 删除非法键: xyq-nest-skill (user-invocable)
#   4. description 格式化: minimax-music-gen, minimax-music-playlist (YAML > → 单行)
#   5. description 增强: remotion (过短描述 → 完整触发条件)
#
#   修复后自动运行 quick_validate.py 全量验证。

set -euo pipefail

SCRIPT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
REPO_ROOT="$(cd "$SCRIPT_DIR/.." && pwd)"
SKILLS_DIR="$REPO_ROOT/skills"
VALIDATOR="$HOME/.claude/skills/skill-creator/scripts/quick_validate.py"

CHECK_ONLY=false

# ── 颜色 ──────────────────────────────────────────────
if [[ -t 1 ]]; then
  GREEN=$'\033[0;32m'
  YELLOW=$'\033[1;33m'
  RED=$'\033[0;31m'
  BOLD=$'\033[1m'
  RESET=$'\033[0m'
else
  GREEN='' YELLOW='' RED='' BOLD='' RESET=''
fi

info()  { printf "${GREEN}[FIX]${RESET} %s\n" "$*"; }
warn()  { printf "${YELLOW}[SKIP]${RESET} %s\n" "$*"; }
error() { printf "${RED}[ERR]${RESET} %s\n" "$*" >&2; }
header(){ printf "\n${BOLD}%s${RESET}\n" "$*"; }

usage() {
  sed -n '3,17p' "$0" | sed 's/^# \{0,1\}//'
  exit 0
}

# ── 参数解析 ──────────────────────────────────────────
while [[ $# -gt 0 ]]; do
  case "$1" in
    --check) CHECK_ONLY=true; shift ;;
    --help|-h) usage ;;
    *) error "未知参数: $1"; usage ;;
  esac
done

# ── 幂等替换函数 ──────────────────────────────────────
# 用 sed 做幂等替换：old → new（仅当 old 存在时替换）
safe_replace() {
  local file="$1" old="$2" new="$3" label="$4"
  if grep -qF "$old" "$file"; then
    if [[ "$CHECK_ONLY" == true ]]; then
      warn "$label — 需要修复: $file"
    else
      sed -i '' "s|$old|$new|" "$file"
      info "$label"
    fi
  else
    warn "$label — 已修复，跳过"
  fi
}

# ── python: YAML > 折叠块 → 单行 ─────────────────────
fix_yaml_folded_desc() {
  local file="$1" label="$2"
  if ! grep -q '^description: >' "$file"; then
    warn "$label — 已是单行，跳过"
    return 0
  fi
  if [[ "$CHECK_ONLY" == true ]]; then
    warn "$label — 需要修复: $file"
    return 0
  fi
  python3 - "$file" << 'PYEOF'
import sys, re
path = sys.argv[1]
with open(path, 'r') as f:
    content = f.read()

# Match: description: >\n  line1\n  line2\n...
pattern = r'^description: >\n((?:  .*\n?)+)'
m = re.search(pattern, content, re.MULTILINE)
if not m:
    sys.exit(0)

folded = m.group(1)
lines = [l.strip() for l in folded.strip().split('\n') if l.strip()]
single = ' '.join(lines)
replacement = 'description: ' + single
content = content[:m.start()] + replacement + content[m.end():]

with open(path, 'w') as f:
    f.write(content)
print('done')
PYEOF
  info "$label"
}

# ── python: remotion description 增强 ──────────────────
fix_remotion_desc() {
  local file="$1"
  local target="Comprehensive guidance for Remotion — programmatic video creation in React. Covers composition patterns, animation techniques, rendering pipelines, audio integration, and performance optimization. Use when the user asks about Remotion, needs to create videos with React, implement animations programmatically, render video with code, or work with .tsx/.jsx video components."
  local short="Best practices for Remotion - Video creation in React"

  if grep -qF "$target" "$file"; then
    warn "remotion description — 已增强，跳过"
    return 0
  fi
  if [[ "$CHECK_ONLY" == true ]]; then
    warn "remotion description — 需要增强: $file"
    return 0
  fi

  python3 - "$file" "$short" "$target" << 'PYEOF'
import sys, re
path, short, target = sys.argv[1], sys.argv[2], sys.argv[3]
with open(path, 'r') as f:
    content = f.read()
# Replace only within the YAML frontmatter
# Match: description: <short>
pattern = r'^(description: )' + re.escape(short) + r'$'
content = re.sub(pattern, r'\1' + target, content, count=1, flags=re.MULTILINE)
with open(path, 'w') as f:
    f.write(content)
print('done')
PYEOF
  info "remotion description — 已增强"
}

# ── 删除包含特定文本的行 ──────────────────────────────
safe_delete_line() {
  local file="$1" pattern="$2" label="$3"
  if grep -qF "$pattern" "$file"; then
    if [[ "$CHECK_ONLY" == true ]]; then
      warn "$label — 需要删除: $file"
    else
      sed -i '' "/$pattern/d" "$file"
      info "$label"
    fi
  else
    warn "$label — 已删除，跳过"
  fi
}

# ══════════════════════════════════════════════════════
#  修复列表
# ══════════════════════════════════════════════════════

main() {
  header "同步后修复"

  local fix_count=0 skip_count=0

  # ── 1. minimax-multimodal-toolkit: name 修正 ────────
  local f="$SKILLS_DIR/minimax-skills/minimax-multimodal-toolkit/SKILL.md"
  if [[ -f "$f" ]]; then
    if grep -q '^name: mmx-cli$' "$f"; then
      if [[ "$CHECK_ONLY" == true ]]; then
        warn "minimax-multimodal-toolkit name — 需要修复: mmx-cli → minimax-multimodal-toolkit"
      else
        sed -i '' 's/^name: mmx-cli$/name: minimax-multimodal-toolkit/' "$f"
        info "minimax-multimodal-toolkit name: mmx-cli → minimax-multimodal-toolkit"
      fi
      fix_count=$((fix_count + 1))
    else
      warn "minimax-multimodal-toolkit name — 已修复，跳过"
      skip_count=$((skip_count + 1))
    fi
  fi

  # ── 2. remotion: name 修正 ──────────────────────────
  f="$SKILLS_DIR/remotion-skills/remotion/SKILL.md"
  if [[ -f "$f" ]]; then
    if grep -q '^name: remotion-best-practices$' "$f"; then
      if [[ "$CHECK_ONLY" == true ]]; then
        warn "remotion name — 需要修复: remotion-best-practices → remotion"
      else
        sed -i '' 's/^name: remotion-best-practices$/name: remotion/' "$f"
        info "remotion name: remotion-best-practices → remotion"
      fi
      fix_count=$((fix_count + 1))
    else
      warn "remotion name — 已修复，跳过"
      skip_count=$((skip_count + 1))
    fi
  fi

  # ── 3. xyq-nest-skill: 删除 user-invocable ──────────
  f="$SKILLS_DIR/pippit-skills/xyq-nest-skill/SKILL.md"
  if [[ -f "$f" ]]; then
    if grep -q '^user-invocable:' "$f"; then
      if [[ "$CHECK_ONLY" == true ]]; then
        warn "xyq-nest-skill user-invocable — 需要删除"
      else
        sed -i '' '/^user-invocable:/d' "$f"
        info "xyq-nest-skill: 已删除 user-invocable"
      fi
      fix_count=$((fix_count + 1))
    else
      warn "xyq-nest-skill user-invocable — 已删除，跳过"
      skip_count=$((skip_count + 1))
    fi
  fi

  # ── 4. minimax-music-gen: description 格式 ───────────
  f="$SKILLS_DIR/minimax-skills/minimax-music-gen/SKILL.md"
  if [[ -f "$f" ]]; then
    fix_yaml_folded_desc "$f" "minimax-music-gen description: YAML > → 单行"
  fi

  # ── 5. minimax-music-playlist: description 格式 ──────
  f="$SKILLS_DIR/minimax-skills/minimax-music-playlist/SKILL.md"
  if [[ -f "$f" ]]; then
    fix_yaml_folded_desc "$f" "minimax-music-playlist description: YAML > → 单行"
  fi

  # ── 6. remotion: description 增强 ────────────────────
  f="$SKILLS_DIR/remotion-skills/remotion/SKILL.md"
  if [[ -f "$f" ]]; then
    fix_remotion_desc "$f"
  fi

  # ════════════════════════════════════════════════════
  #  验证
  # ════════════════════════════════════════════════════
  echo ""
  header "规范验证"

  if [[ ! -f "$VALIDATOR" ]]; then
    error "未找到验证器: $VALIDATOR"
    exit 1
  fi

  local pass=0 fail=0
  for dir in $(find "$SKILLS_DIR" -name "SKILL.md" -exec dirname {} \; | sort); do
    local result
    result=$(python3 "$VALIDATOR" "$dir" 2>&1) || true
    if echo "$result" | grep -q "Skill is valid"; then
      pass=$((pass + 1))
    else
      fail=$((fail + 1))
      error "$(basename $(dirname "$dir"))/$(basename "$dir"): $result"
    fi
  done

  echo ""
  if [[ $fail -eq 0 ]]; then
    info "验证通过: $pass/$((pass + fail))"
  else
    error "验证失败: $pass 通过, $fail 失败"
    exit 1
  fi
}

main "$@"
