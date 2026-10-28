# qingtai-xianyu

闲鱼管理后台的 agent skill + `qtx` CLI（只读查询 + 写操作，危险操作需 `--yes` 确认）。

## 安装

```bash
# 1. 安装 skill（给 Codex / Qoder 等 agent 用）
npx skills add Qing-936/qingtai-xianyu/skills/qingtai-xianyu

# 2. 安装 CLI（agent 首次用到 qtx 时会按 skill 提示自动装，也可手动装）
npm install -g https://github.com/Qing-936/qingtai-xianyu/archive/refs/heads/master.tar.gz
#    Windows 上不要用 `npm i -g github:...` 简写（npm 软链指向缓存临时目录，装完即坏）

# 3. 登录一次（token 存 ~/.qingtai-xianyu，不存明文密码）
qtx login
```

## 使用

```bash
qtx help                  # 查看命令
qtx <域> <动作> [--page-no N] [-p key=value]... [--json]
qtx product page -p title=xxx --json
```

只读 + 写操作全量。写操作分两档：普通写直接执行；危险操作（删除/上下架/改价/发货/导入/重置 token 等）不带 `--yes` 只预演不执行。详见 [skills/qingtai-xianyu/SKILL.md](skills/qingtai-xianyu/SKILL.md)。
