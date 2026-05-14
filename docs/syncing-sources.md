# Syncing External Skills

外部技能同步只依赖 `git` 和 Bash。

## 配置文件

编辑 `config/sources.conf`。每行一个来源，字段用 `|` 分隔：

```text
id|remote|ref|target_group|layout|slug_mode|group_readme|include
```

示例：

```text
pippit|https://gitee.com/Pippit-dev/pippit-skills.git|master|pippit-skills|flat|preserve|README.md|
minimax|https://github.com/MiniMax-AI/skills.git|main|minimax-skills|flat|preserve|README.md|minimax-multimodal-toolkit,minimax-music-gen,minimax-music-playlist
```

`include` 为逗号分隔的技能目录名（与上游 `skills/<name>/` 或 flat 布局下的 `<name>/` 一致）。留空表示导入该来源的全部技能；填写后只同步列出的技能，适合上游仓库很大、但 marketplace 只需要其中几项的场景。

字段说明：

| 字段 | 说明 |
|------|------|
| `id` | 来源标识，用于 `--source` |
| `remote` | Git 仓库地址 |
| `ref` | 分支或标签 |
| `target_group` | 写入 `skills/<target_group>/` |
| `layout` | `flat` / `grouped` / `auto` |
| `slug_mode` | `preserve` 保留上游目录名，`prefix` 写入 `integ-<id>-<skill>` |
| `group_readme` | 上游 README 相对路径，会原样复制到组根目录 `README.md` |
| `include` | 可选，逗号分隔技能名；留空表示全部导入 |

## 执行同步

```bash
./scripts/sync-sources.sh
```

常用参数：

```bash
./scripts/sync-sources.sh --source pippit
./scripts/sync-sources.sh --dry-run
./scripts/sync-sources.sh --force
```

## 同步结果

- 技能写入 `skills/<target_group>/<skill>/`
- 组根目录保留上游 `README.md`
- 每个同步技能会写入 `.source-sync.json` 记录来源与 commit

## 注册到 marketplace

脚本不会自动修改 `.claude-plugin/marketplace.json`。同步完成后，请手动登记新技能路径，并更新 `docs/aigc-skill-group-mapping.md`。
