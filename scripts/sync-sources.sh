#!/usr/bin/env bash
#
# sync-sources.sh — 从外部仓库同步 AIGC 技能到 skills/<group>/<skill>/
#
# 用法：
#   ./scripts/sync-sources.sh [--source <id>] [--dry-run] [--force] [--help]
#
# 配置文件：
#   config/sources.conf
#
# 依赖：
#   git

set -euo pipefail

if [[ -t 1 ]]; then
  GREEN=$'\033[0;32m'
  YELLOW=$'\033[1;33m'
  RED=$'\033[0;31m'
  BOLD=$'\033[1m'
  RESET=$'\033[0m'
else
  GREEN=''
  YELLOW=''
  RED=''
  BOLD=''
  RESET=''
fi

info()  { printf "${GREEN}[OK]${RESET}  %s\n" "$*"; }
warn()  { printf "${YELLOW}[!!]${RESET}  %s\n" "$*"; }
error() { printf "${RED}[ERR]${RESET} %s\n" "$*" >&2; }
header(){ echo -e "\n${BOLD}$*${RESET}"; }

SCRIPT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
REPO_ROOT="$(cd "$SCRIPT_DIR/.." && pwd)"
CONFIG_FILE="$REPO_ROOT/config/sources.conf"
CACHE_ROOT="$REPO_ROOT/.cache/sources"
SKILLS_ROOT="$REPO_ROOT/skills"
UPSTREAM_SKILL_ROOT="skills"
ORIGIN_FILE=".source-sync.json"
SYNCED_AT="$(date -u +"%Y-%m-%dT%H:%M:%SZ")"

SOURCE_FILTER=""
DRY_RUN=false
FORCE=false

usage() {
  sed -n '3,14p' "$0" | sed 's/^# \{0,1\}//'
  exit 0
}

trim() {
  local value="$1"
  value="${value#"${value%%[![:space:]]*}"}"
  value="${value%"${value##*[![:space:]]}"}"
  printf '%s' "$value"
}

should_include_skill() {
  local include_list="$1"
  local skill_name="$2"

  if [[ -z "$include_list" ]]; then
    return 0
  fi

  local IFS=',' item
  for item in $include_list; do
    item="$(trim "$item")"
    [[ -n "$item" && "$item" == "$skill_name" ]] && return 0
  done
  return 1
}

resolve_skill_name() {
  local source_id="$1"
  local slug_mode="$2"
  local upstream_name="$3"

  case "$slug_mode" in
    preserve) printf '%s' "$upstream_name" ;;
    prefix)   printf 'integ-%s-%s' "$source_id" "$upstream_name" ;;
    *) error "未知 slug_mode: $slug_mode"; exit 1 ;;
  esac
}

clone_or_update() {
  local source_id="$1"
  local remote="$2"
  local ref="$3"
  local checkout_dir="$CACHE_ROOT/$source_id"

  mkdir -p "$CACHE_ROOT"

  if [[ -d "$checkout_dir/.git" && "$FORCE" != true ]]; then
    git -C "$checkout_dir" fetch --depth 1 origin "$ref"
    git -C "$checkout_dir" checkout --force FETCH_HEAD
  else
    rm -rf "$checkout_dir"
    git clone --depth 1 --branch "$ref" "$remote" "$checkout_dir"
  fi

  git -C "$checkout_dir" rev-parse HEAD
}

discover_flat_skills() {
  local checkout_dir="$1"
  local include_list="$2"
  local upstream_root="$checkout_dir/$UPSTREAM_SKILL_ROOT"

  [[ -d "$upstream_root" ]] || return 0

  local entry skill_dir skill_name
  for entry in "$upstream_root"/*; do
    [[ -d "$entry" ]] || continue
    [[ -f "$entry/SKILL.md" ]] || continue
    skill_name="$(basename "$entry")"
    should_include_skill "$include_list" "$skill_name" || continue
    printf '%s|%s\n' "$skill_name" "$entry"
  done
}

discover_grouped_skills() {
  local checkout_dir="$1"
  local include_list="$2"
  local upstream_root="$checkout_dir/$UPSTREAM_SKILL_ROOT"

  [[ -d "$upstream_root" ]] || return 0

  local group_dir entry skill_dir skill_name
  for group_dir in "$upstream_root"/*; do
    [[ -d "$group_dir" ]] || continue
    for entry in "$group_dir"/*; do
      [[ -d "$entry" ]] || continue
      [[ -f "$entry/SKILL.md" ]] || continue
      skill_name="$(basename "$entry")"
      should_include_skill "$include_list" "$skill_name" || continue
      printf '%s|%s\n' "$skill_name" "$entry"
    done
  done
}

discover_auto_skills() {
  local checkout_dir="$1"
  local include_list="$2"
  local upstream_root="$checkout_dir/$UPSTREAM_SKILL_ROOT"

  [[ -d "$upstream_root" ]] || return 0

  local entry skill_name
  for entry in "$upstream_root"/*; do
    [[ -d "$entry" ]] || continue
    if [[ -f "$entry/SKILL.md" ]]; then
      skill_name="$(basename "$entry")"
      should_include_skill "$include_list" "$skill_name" || continue
      printf '%s|%s\n' "$skill_name" "$entry"
      continue
    fi

    local child
    for child in "$entry"/*; do
      [[ -d "$child" ]] || continue
      [[ -f "$child/SKILL.md" ]] || continue
      skill_name="$(basename "$child")"
      should_include_skill "$include_list" "$skill_name" || continue
      printf '%s|%s\n' "$skill_name" "$child"
    done
  done
}

discover_skills() {
  local checkout_dir="$1"
  local layout="$2"
  local include_list="$3"

  case "$layout" in
    flat)    discover_flat_skills "$checkout_dir" "$include_list" ;;
    grouped) discover_grouped_skills "$checkout_dir" "$include_list" ;;
    auto)    discover_auto_skills "$checkout_dir" "$include_list" ;;
    *) error "未知 layout: $layout"; exit 1 ;;
  esac
}

copy_tree() {
  local src="$1"
  local dest="$2"
  mkdir -p "$dest"
  if command -v rsync >/dev/null 2>&1; then
    rsync -a --delete \
      --exclude '.git/' \
      --exclude 'node_modules/' \
      --exclude 'dist/' \
      --exclude 'build/' \
      --exclude 'out/' \
      "$src/" "$dest/"
  else
    rm -rf "$dest"
    mkdir -p "$dest"
    cp -R "$src/." "$dest/"
    rm -rf "$dest/.git" "$dest/node_modules" "$dest/dist" "$dest/build" "$dest/out"
  fi
}

write_origin_file() {
  local target_dir="$1"
  local source_id="$2"
  local remote="$3"
  local ref="$4"
  local commit="$5"
  local target_group="$6"
  local skill_name="$7"
  local upstream_name="$8"
  local slug_mode="$9"

  cat > "$target_dir/$ORIGIN_FILE" <<EOF
{
  "sourceId": "$source_id",
  "remote": "$remote",
  "ref": "$ref",
  "commit": "$commit",
  "targetGroup": "$target_group",
  "skill": "$skill_name",
  "upstreamSkill": "$upstream_name",
  "slugMode": "$slug_mode",
  "syncedAt": "$SYNCED_AT"
}
EOF
}

sync_group_readme() {
  local checkout_dir="$1"
  local target_group_dir="$2"
  local group_readme="$3"

  [[ -n "$group_readme" ]] || return 0
  [[ -f "$checkout_dir/$group_readme" ]] || {
    warn "未找到组 README：$group_readme"
    return 0
  }

  mkdir -p "$target_group_dir"
  cp "$checkout_dir/$group_readme" "$target_group_dir/README.md"
  info "已同步组 README -> skills/$(basename "$target_group_dir")/README.md"
}

remove_stale_skills() {
  local target_group_dir="$1"
  shift
  local -a expected=("$@")

  [[ -d "$target_group_dir" ]] || return 0

  local entry skill_dir skill_name
  for entry in "$target_group_dir"/*; do
    [[ -d "$entry" ]] || continue
    skill_name="$(basename "$entry")"
    [[ -f "$entry/$ORIGIN_FILE" ]] || continue

    local keep=false
    local name
    for name in "${expected[@]}"; do
      if [[ "$name" == "$skill_name" ]]; then
        keep=true
        break
      fi
    done

    if [[ "$keep" == false ]]; then
      if [[ "$DRY_RUN" == true ]]; then
        warn "将删除过期技能：$skill_name"
      else
        rm -rf "$entry"
        info "已删除过期技能：$skill_name"
      fi
    fi
  done
}

sync_one_source() {
  local source_id remote ref target_group layout slug_mode group_readme include_list

  IFS='|' read -r source_id remote ref target_group layout slug_mode group_readme include_list <<< "$1"

  source_id="$(trim "$source_id")"
  remote="$(trim "$remote")"
  ref="$(trim "$ref")"
  target_group="$(trim "$target_group")"
  layout="$(trim "$layout")"
  slug_mode="$(trim "$slug_mode")"
  group_readme="$(trim "$group_readme")"
  include_list="$(trim "$include_list")"

  [[ -n "$source_id" ]] || return 0
  if [[ -n "$SOURCE_FILTER" && "$source_id" != "$SOURCE_FILTER" ]]; then
    return 0
  fi

  header "同步来源：$source_id"
  echo "  remote:       $remote"
  echo "  ref:          $ref"
  echo "  target_group: $target_group"
  echo "  layout:       $layout"
  echo "  slug_mode:    $slug_mode"

  local commit checkout_dir target_group_dir
  if [[ "$DRY_RUN" == true ]]; then
    checkout_dir="$CACHE_ROOT/$source_id"
    if [[ ! -d "$checkout_dir/.git" ]]; then
      warn "dry-run 需要已有缓存：$checkout_dir"
      return 0
    fi
    commit="$(git -C "$checkout_dir" rev-parse HEAD)"
  else
    commit="$(clone_or_update "$source_id" "$remote" "$ref")"
    checkout_dir="$CACHE_ROOT/$source_id"
  fi

  target_group_dir="$SKILLS_ROOT/$target_group"
  mkdir -p "$target_group_dir"

  local expected_names=()
  local discovered
  discovered="$(discover_skills "$checkout_dir" "$layout" "$include_list")"

  if [[ -z "$discovered" ]]; then
    warn "未发现可导入技能：$source_id"
    return 0
  fi

  while IFS= read -r line; do
    [[ -n "$line" ]] || continue
    local upstream_name upstream_dir skill_name target_dir
    upstream_name="${line%%|*}"
    upstream_dir="${line#*|}"
    skill_name="$(resolve_skill_name "$source_id" "$slug_mode" "$upstream_name")"
    target_dir="$target_group_dir/$skill_name"
    expected_names+=("$skill_name")

    if [[ "$DRY_RUN" == true ]]; then
      info "将同步技能：$skill_name <- $upstream_name"
      continue
    fi

    copy_tree "$upstream_dir" "$target_dir"
    write_origin_file "$target_dir" "$source_id" "$remote" "$ref" "$commit" "$target_group" "$skill_name" "$upstream_name" "$slug_mode"
    info "已同步技能：$target_group/$skill_name"
  done <<< "$discovered"

  if [[ "$DRY_RUN" != true ]]; then
    sync_group_readme "$checkout_dir" "$target_group_dir" "$group_readme"
    remove_stale_skills "$target_group_dir" "${expected_names[@]}"
  fi
}

main() {
  while [[ $# -gt 0 ]]; do
    case "$1" in
      --source) SOURCE_FILTER="${2:?'--source 需要一个值'}"; shift 2 ;;
      --dry-run) DRY_RUN=true; shift ;;
      --force) FORCE=true; shift ;;
      --help|-h) usage ;;
      *) error "未知参数: $1"; usage ;;
    esac
  done

  if ! command -v git >/dev/null 2>&1; then
    error "未找到 git"
    exit 1
  fi

  if [[ ! -f "$CONFIG_FILE" ]]; then
    error "未找到配置文件：$CONFIG_FILE"
    exit 1
  fi

  header "AIGC 外部技能同步"
  echo "  仓库: $REPO_ROOT"
  echo "  配置: $CONFIG_FILE"
  echo "  缓存: $CACHE_ROOT"
  if [[ "$DRY_RUN" == true ]]; then
    echo "  模式: dry-run"
  fi

  local line
  while IFS= read -r line || [[ -n "$line" ]]; do
    line="$(trim "$line")"
    [[ -z "$line" || "$line" == \#* ]] && continue
    sync_one_source "$line"
  done < "$CONFIG_FILE"

  info "同步完成"
}

main "$@"
