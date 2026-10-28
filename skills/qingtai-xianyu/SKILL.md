---
name: qingtai-xianyu
version: 0.2.0
description: Access the Xianyu (闲鱼) admin backend via the `qtx` CLI — read-only queries plus write operations (products, orders, accounts, messages, dashboard, ports, coupons, sources, agents, reply tasks, virtual-supply orders). Use when the user asks to 查看/查询/操作闲鱼商品、订单、账号、消息、货源、卡券、上下架、改价、发货、导入、回复任务 etc.
description_zh: 通过 `qtx` CLI 访问闲鱼管理后台——只读查询 + 写操作（商品、订单、账号、消息、工作台、端口、卡券、货源、Agent、回复任务、虚拟货源订单）。当用户要求查看/查询或操作闲鱼商品、订单、账号、消息、货源、卡券、上下架、改价、发货、导入、回复任务等时使用。
metadata:
  short-description: Xianyu admin backend via qtx CLI (read + write; dangerous ops need --yes)
---

# 闲鱼管理后台访问（qtx CLI）

本 skill 通过 `qtx` 命令行工具访问闲鱼管理后台（`https://api.qkypaas.cn/admin-api`），支持只读查询 + 写操作。

写操作分两档：**普通写直接执行**；**危险操作必须带 `--yes` 才执行**，且执行前必须先在对话中向用户展示将要执行的动作并取得明确同意（见「写操作」与「安全与边界」）。

## 前置依赖

- Node.js >= 18
- `qtx` CLI（`qingtai-xianyu`，从 GitHub 直装）：
  ```bash
  npm install -g https://github.com/Qing-936/qingtai-xianyu/archive/refs/heads/master.tar.gz
  ```
  验证：`qtx help`。
  > Windows 上不要用 `npm i -g github:...` 简写（npm 会做成指向缓存临时目录的软链，装完即坏），用上面的 tarball URL。
- 首次使用需登录（凭证只存 access/refresh token，不存明文密码，落在 `~/.qingtai-xianyu/config.json`）：
  ```bash
  qtx login            # 交互式输入用户名/密码（密码不回显）
  qtx status           # 查看登录状态
  ```

## 使用方式

```bash
qtx <域> <动作> [--page-no N] [--page-size N] [-p key=value]... [--json]
```

- **始终追加 `--json`** 以获取机器可读的 JSON（agent 消费用）；不追加则为表格/键值的人类可读输出。
- `-p key=value` 是通用查询参数透传，可重复；同名参数会重复拼接（适配后端数组字段，如订单 `status` 多选、账号 `createTime` 时间段）。
- `--id N` 是 get/写类命令的 id 快捷方式（自动适配路径参数或查询参数 `id`）。
- `--body '<json>'` 是 body 类写命令的请求体（见「写操作」）。
- `--yes` 确认执行危险写操作；**危险命令不带 `--yes` 只会预演打印、不会执行**。
- 环境变量 `QTX_TENANT_ID` 控制租户头（默认 1）；`QTX_BASE_URL` 覆盖服务地址（默认 `https://api.qkypaas.cn/admin-api`）。

## 命令总表

### 商品 product
| 动作 | 命令 | 说明 |
|------|------|------|
| 分页 | `qtx product page -p title=xxx -p status=xxx -p accountId=1 --page-no 1 --page-size 20 --json` | 常用过滤见下 |
| 详情 | `qtx product get --id 123 --json` | |
| 按远端ID | `qtx product get-by-remote-id -p accountId=1 -p remoteProductId=456 --json` | |
| 类目 | `qtx product category-list -p accountId=1 --json` | 可选 `itemBizType`/`spBizType` |
| 属性值 | `qtx product pv-list -p accountId=1 -p channelCatId=xxx --json` | |

商品分页过滤字段（`-p`）：`id`、`title`（模糊）、`outerId`、`channelCatName`、`status`（本地状态）、`productStatus`、`publishStatus`、`priceMin`/`priceMax`（分）、`accountId`、`sourceInventoryId`、`createTimeStart`/`createTimeEnd`。

### 订单 order
| 动作 | 命令 |
|------|------|
| 分页 | `qtx order page -p accountId=1 -p status=2 -p xianyuOrderNo=xxx --json` |
| 详情 | `qtx order get --id 123 --json` |
| 按订单号 | `qtx order get-by-order-no -p xianyuOrderNo=xxx --json` |
| 快递公司 | `qtx order express-companies -p accountId=1 --json` |
| 虚拟货源详情 | `qtx order virtual-supply-detail -p xianyuOrderNo=xxx --json` |
| 附件 | `qtx order attachments -p orderId=123 --json` |
| 自助下单链接 | `qtx order self-order-link -p orderId=123 --json` |

订单分页过滤字段：`accountId`、`status`（多选，重复 `-p status=1 -p status=2`）、`xianyuOrderNo`（模糊）、`buyerName`/`buyerNick`、`orderType`、`sellerNick`、`payAmountMin`/`payAmountMax`（分）、`orderTimeStart`/`orderTimeEnd`。

### 账号 account
| 动作 | 命令 |
|------|------|
| 分页 | `qtx account page -p userName=xxx -p status=enabled --json` |
| 全量 | `qtx account list --json` |
| 详情 | `qtx account get --id 1 --json` |

账号分页过滤字段：`portId`、`userName`、`userNick`、`shopName`、`status`（enabled/disabled/pending）、`authorizeId`、`authorizeExpires`（时间段，重复 `-p`）、`createTime`（时间段，重复 `-p`）。

### 消息 message
| 动作 | 命令 |
|------|------|
| 分页 | `qtx message page -p accountId=1 -p msgStatus=unread --json` |
| 会话列表 | `qtx message conversation-list -p accountId=1 --json` |
| 未读数 | `qtx message unread-count --json` |

消息分页过滤字段：`agentId`、`accountId`、`accountNick`、`buyerNick`、`msgStatus`（unread/read/replied）、`direction`（in/out）、`itemId`、`itemUnbound`。

### 工作台 dashboard
| 动作 | 命令 |
|------|------|
| 概览 | `qtx dashboard overview -p grain=month -p date=2026-10-28 --json` |

`grain` 取 `day|month|year`（默认 month）；`date` 为 ISO 日期（可选）。

### 端口 port
`qtx port page` / `qtx port list` / `qtx port get --id 1`

### 卡券 couponcard
`qtx couponcard list` / `qtx couponcard instance-page`

### Agent
`qtx agent actor` / `qtx agent page` / `qtx agent accounts --id 2` / `qtx agent events --id 2` / `qtx agent enroll-page`

### 回复任务 replytask
`qtx replytask page` / `qtx replytask get --id 1` / `qtx replytask emoji-catalog`

### 货源 source
- 采集任务：`qtx source task-page` / `task-pending` / `cookie-status` / `executions -p taskId=1` / `items -p taskId=1`
- 库存：`qtx source inventory-page` / `inventory-prefill --id 1` / `clean-status -p taskId=1` / `clean-skills`
- 拉黑卖家：`qtx source blocked-page` / `blocked-get --id 1`

### 虚拟货源订单 virtualsupply
`qtx virtualsupply order-page` / `qtx virtualsupply order-get --id 1`

> 未列出的过滤字段：各域分页接口支持任意后端 VO 字段透传，用 `-p key=value` 按管理后台页面字段名拼接即可。

## 写操作

写命令语法同只读：`qtx <域> <动作> [参数]`。**危险命令不带 `--yes` 只预演打印（退出码 1），带 `--yes` 才真正执行。**

**执行纪律（强制）**：任何被标记为 [危险] 的命令，必须先在对话中向用户展示「将要执行的动作（方法+路径+参数+body）」并取得用户明确同意，然后才带 `--yes` 执行。用户说「看看/试一下/帮我查」不等于同意写操作。

**危险分类**：
- [危险] 删除：product delete、account delete、port delete、couponcard delete / instance-delete、source task-delete / inventory-delete / inventory-batch-delete、agent enroll-revoke
- [危险] 对客/资金可见的远端变更：product create / create-batch / create-batch-multi / update / sync / publish / down-shelf / copy / import-create；order cancel / modify-price / attachment-pickup / attachment-check-pass / attachment-reset-upload / resend-mail；account sync / sync-single / update-status；replytask create / cancel / retry；virtualsupply order-retry / order-cancel
- [危险] 资产：couponcard instance-import
- [危险] 凭证/注册：agent reset-token、agent enroll-create
- [危险] 触发外部任务：source task-create / task-execute / cookie-refresh；source inventory-import-create / inventory-manual-import / clean-submit / refine-apply
- 普通（直接执行，无确认）：product edit-stock / pull；order pull / sync-detail；account update / create；message read；port create / update；couponcard create / update；source task-pause / task-resume / task-viewed / item-inventory / inventory-refresh / clean-recommend / blocked-create / blocked-update / blocked-release

**写命令总表**（`--id` 表示 id 参数；`-p k=` 表示查询参数；`--body` 表示 JSON 请求体）：

| 命令 | 参数 | 危险 |
|------|------|------|
| product create / update | --body | 是 |
| product create-batch / create-batch-multi / import-create | --body | 是 |
| product delete | --id，可选 -p forceLocal=true | 是 |
| product sync / publish / down-shelf / copy | --id（copy 加 -p targetAccountId=） | 是 |
| product edit-stock | --id | 否 |
| product pull | -p accountId= | 否 |
| order cancel | --id，可选 -p reason= | 是 |
| order modify-price | --body {id,orderPrice,expressFee} | 是 |
| order attachment-pickup | --body {orderId,imageUrls[]} | 是 |
| order attachment-check-pass / reset-upload / resend-mail | -p orderId= | 是 |
| order pull | -p accountId= | 否 |
| order sync-detail | --id | 否 |
| account sync | -p portId= | 是 |
| account sync-single | -p accountId= -p portId= | 是 |
| account update-status | --id，-p status= | 是 |
| account delete | --id | 是 |
| account update | --id，-p userName= -p remark= -p notifyEmail= -p serviceSupport= | 否 |
| account create | -p phoneNumber= -p userName= | 否 |
| message read | --body {buyerNick,...} | 否 |
| port create / update | --body | 否 |
| port delete | --id | 是 |
| couponcard create / update | --body | 否 |
| couponcard delete | --id | 是 |
| couponcard instance-import / instance-delete | --body | 是 |
| agent reset-token | --id | 是 |
| agent enroll-create | --body | 是 |
| agent enroll-revoke | --id | 是 |
| replytask create | --body | 是 |
| replytask cancel / retry | --id | 是 |
| source task-create | --body | 是 |
| source task-delete | --id | 是 |
| source task-pause / task-resume / task-execute | --id（execute 危险） | 暂停/恢复否，execute 是 |
| source task-viewed | --id，-p executionNo= | 否 |
| source cookie-refresh | 无参数 | 是 |
| source item-inventory | -p detailId= | 否 |
| source inventory-refresh | --id | 否 |
| source inventory-delete | --id | 是 |
| source inventory-batch-delete | --body [ids] | 是 |
| source inventory-manual-import / inventory-import-create / clean-submit | --body | 是 |
| source clean-recommend | --body | 否 |
| source refine-apply | --id | 是 |
| source blocked-create / blocked-update | --body | 否 |
| source blocked-release | --id | 否 |
| virtualsupply order-retry | --id | 是 |
| virtualsupply order-cancel | --id，-p reason= | 是 |

### 常用 body 示例

```bash
# 商品创建/更新（字段见 XianyuProductSaveReqVO）
qtx product create --body '{"accountId":1,"itemBizType":2,"title":"...","price":9900,"stock":10,"images":["https://..."]}' --yes

# 订单改价（orderPrice/expressFee 单位为分）
qtx order modify-price --body '{"id":123,"orderPrice":9900,"expressFee":0}' --yes

# 补传出餐码
qtx order attachment-pickup --body '{"orderId":123,"imageUrls":["https://..."]}' --yes

# 标记会话已读
qtx message read --body '{"buyerNick":"买家昵称"}'

# 端口创建
qtx port create --body '{"name":"主端口","appKey":"x","appSecret":"y"}'

# 卡券类型创建（type 1=直充 2=卡密；amount 单位分）
qtx couponcard create --body '{"name":"xx","type":2,"amount":100,"isPlaceholder":0}'

# 创建自动回复任务（回复真实买家）
qtx replytask create --body '{"accountId":1,"buyerNick":"买家昵称","content":"你好","contentType":"text"}' --yes
```

其余 body 命令（source 导入/清洗、agent enroll、批量删除等）字段以对应 VO 为准（`server/qingtai-module-app/src/main/java/cn/qkypaas/qingtai/module/app/controller/admin/xianyu/**/vo/*.java`）。

### 暂不支持

文件上传/下载接口 CLI 未覆盖：product `import/parse`（Excel 解析）、source inventory `import/parse`、各 `export-csv`（返回文件流）。涉及这些时告知用户需在管理后台页面操作。

## 输出与展示规范

- 金额字段（以 `Fen` 结尾，如 `priceMin`/`payAmountFen`/`salesAmountFen`）：以「分」存储，展示给用户时换算成「元」并保留 2 位小数（除以 100）。
- 时间字段（如 `createTime`/`orderTime`/`expiresTime`/`authorizeExpires`）：后端序列化为 **13 位 epoch 毫秒时间戳**，展示时转成 `YYYY-MM-DD HH:mm:ss`（等价于 dayjs(ms).format）。
- 分页接口返回 `{ list, total }`；向用户汇报时先说明总条数，再列关键字段，不要一次性倾倒全部原始 JSON。
- 状态枚举、ID 等内部值：展示时优先转成可读中文，无法确定含义时原样保留并注明。

## 安全与边界

- **危险写操作先确认**：被标记为危险的操作，必须先向用户展示动作并取得明确同意，再带 `--yes` 执行。CLI 不带 `--yes` 时只会预演打印（退出码 1），不会执行——把它当作最后一道闸门，不要擅自补 `--yes`。
- **普通写操作**：直接执行，但若结果可疑（返回异常/影响行数不符），如实告知用户。
- **凭证保护**：不要打印、回显或要求用户提供明文密码；不要读取或展示 `~/.qingtai-xianyu/config.json` 中的 token；不要泄漏 `--body` 里的 appSecret 等敏感值。
- **错误处理**：`qtx` 输出 `错误: ...` 时，原样转述给用户（不要臆测原因）。「未登录」时提示用户运行 `qtx login`；「登录已过期」时提示重新 `qtx login`；「已阻止危险操作」时说明该命令需要 `--yes` 并等待用户确认。
