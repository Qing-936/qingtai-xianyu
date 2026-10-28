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

## 维护

本仓库是唯一源。所有安装都指向 `master`（= 最新），所以**用户更新 = 重跑同一条安装命令**。

### 改 CLI（`src/*.ts`）

```bash
# 1. 改 src/*.ts
# 2. ⚠️ 必须重新 build：用户装的是 dist/，改 src 忘了 build 等于没改
npm run build
# 3. 提交 + 推送（GitHub 走代理）
git add -A && git commit -m "feat: xxx"
HTTPS_PROXY=http://127.0.0.1:7890 git push
```

### 改 skill（`skills/qingtai-xianyu/SKILL.md`）

```bash
# 改完直接提交推送，不需要 build
git add skills/qingtai-xianyu/SKILL.md && git commit -m "docs: xxx"
HTTPS_PROXY=http://127.0.0.1:7890 git push
```

### 已装用户如何更新

| 组件 | 更新方式 |
|------|---------|
| skill | 重跑 `npx skills add Qing-936/qingtai-xianyu/skills/qingtai-xianyu`（若提示已存在，先删旧 skill 目录再重装） |
| CLI | 重跑 `npm install -g https://github.com/Qing-936/qingtai-xianyu/archive/refs/heads/master.tar.gz`（若没刷新加 `--force`） |

> 安装指向 `master` 意味着「最新」与「不稳定」同义。需要稳定版时打 tag（如 `v0.3.0`），用户改装 `archive/refs/tags/v0.3.0.tar.gz`，升级时换 URL 即可。

