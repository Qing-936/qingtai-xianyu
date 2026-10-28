"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.COMMANDS = void 0;
exports.COMMANDS = [
    // 商品
    { domain: 'product', action: 'page', method: 'GET', path: '/app/xianyu/product/page', summary: '商品分页' },
    { domain: 'product', action: 'get', method: 'GET', path: '/app/xianyu/product/get', summary: '商品详情（--id）' },
    { domain: 'product', action: 'get-by-remote-id', method: 'GET', path: '/app/xianyu/product/get-by-remote-id', summary: '按账号+远端商品ID查详情（-p accountId= -p remoteProductId=）' },
    { domain: 'product', action: 'category-list', method: 'GET', path: '/app/xianyu/product/category-list', summary: '商品类目（-p accountId=）' },
    { domain: 'product', action: 'pv-list', method: 'GET', path: '/app/xianyu/product/pv-list', summary: '商品属性值（-p accountId= -p channelCatId=）' },
    // 订单
    { domain: 'order', action: 'page', method: 'GET', path: '/app/xianyu/order/page', summary: '订单分页' },
    { domain: 'order', action: 'get', method: 'GET', path: '/app/xianyu/order/get', summary: '订单详情（--id）' },
    { domain: 'order', action: 'get-by-order-no', method: 'GET', path: '/app/xianyu/order/get-by-order-no', summary: '按闲鱼订单号查详情（-p xianyuOrderNo=）' },
    { domain: 'order', action: 'express-companies', method: 'GET', path: '/app/xianyu/order/express-companies', summary: '可用快递公司（-p accountId=）' },
    { domain: 'order', action: 'virtual-supply-detail', method: 'GET', path: '/app/xianyu/order/virtual-supply-detail', summary: '虚拟货源订单详情（-p xianyuOrderNo=）' },
    { domain: 'order', action: 'attachments', method: 'GET', path: '/app/xianyu/order/attachments', summary: '订单附件（-p orderId=）' },
    { domain: 'order', action: 'self-order-link', method: 'GET', path: '/app/xianyu/order/self-order-link', summary: '买家自助下单链接（-p orderId=）' },
    // 账号
    { domain: 'account', action: 'page', method: 'GET', path: '/app/xianyu/account/page', summary: '账号分页' },
    { domain: 'account', action: 'list', method: 'GET', path: '/app/xianyu/account/list', summary: '账号全量列表' },
    { domain: 'account', action: 'get', method: 'GET', path: '/app/xianyu/account/get', summary: '账号详情（--id）' },
    // 消息
    { domain: 'message', action: 'page', method: 'GET', path: '/app/xianyu/message/page', summary: '消息分页' },
    { domain: 'message', action: 'conversation-list', method: 'GET', path: '/app/xianyu/message/conversation-list', summary: '会话列表' },
    { domain: 'message', action: 'unread-count', method: 'GET', path: '/app/xianyu/message/unread-count', summary: '未读数' },
    // 工作台
    { domain: 'dashboard', action: 'overview', method: 'GET', path: '/app/xianyu/dashboard/overview', summary: '经营概览（-p grain=month|day|year，可选 -p date=）' },
    // 端口
    { domain: 'port', action: 'page', method: 'GET', path: '/app/xianyu/port/page', summary: '端口分页' },
    { domain: 'port', action: 'list', method: 'GET', path: '/app/xianyu/port/list', summary: '端口全量列表' },
    { domain: 'port', action: 'get', method: 'GET', path: '/app/xianyu/port/get', summary: '端口详情（--id）' },
    // 卡券
    { domain: 'couponcard', action: 'list', method: 'GET', path: '/app/coupon-card/list', summary: '卡券模板列表' },
    { domain: 'couponcard', action: 'instance-page', method: 'GET', path: '/app/coupon-card/card-instance/page', summary: '卡密实例分页' },
    // Agent
    { domain: 'agent', action: 'actor', method: 'GET', path: '/app/xianyu/agent/actor', summary: '当前 Agent 角色' },
    { domain: 'agent', action: 'page', method: 'GET', path: '/app/xianyu/agent/page', summary: '试点机分页' },
    { domain: 'agent', action: 'accounts', method: 'GET', path: '/app/xianyu/agent/{id}/accounts', summary: '试点机绑定账号（--id）' },
    { domain: 'agent', action: 'events', method: 'GET', path: '/app/xianyu/agent/{id}/events', summary: '试点机事件（--id）' },
    { domain: 'agent', action: 'enroll-page', method: 'GET', path: '/app/xianyu/agent/enroll/page', summary: '注册码分页' },
    // 回复任务
    { domain: 'replytask', action: 'page', method: 'GET', path: '/app/xianyu/reply-task/page', summary: '回复任务分页' },
    { domain: 'replytask', action: 'get', method: 'GET', path: '/app/xianyu/reply-task/{id}', summary: '回复任务详情（--id）' },
    { domain: 'replytask', action: 'emoji-catalog', method: 'GET', path: '/app/xianyu/reply-task/emoji-catalog', summary: '表情目录' },
    // 货源 - 采集任务
    { domain: 'source', action: 'task-page', method: 'GET', path: '/app/source/task/page', summary: '采集任务分页' },
    { domain: 'source', action: 'task-pending', method: 'GET', path: '/app/source/task/pending-inventory-page', summary: '待入库存任务分页' },
    { domain: 'source', action: 'cookie-status', method: 'GET', path: '/app/source/task/cookie/refresh/status', summary: 'Cookie 刷新状态（-p sessionId=）' },
    { domain: 'source', action: 'executions', method: 'GET', path: '/app/source/task/execution/list', summary: '任务执行记录（-p taskId=）' },
    { domain: 'source', action: 'items', method: 'GET', path: '/app/source/task/item/list', summary: '任务结果条目（-p taskId= -p executionNo=）' },
    // 货源 - 库存
    { domain: 'source', action: 'inventory-page', method: 'GET', path: '/app/source/inventory/page', summary: '库存分页' },
    { domain: 'source', action: 'inventory-prefill', method: 'GET', path: '/app/source/inventory/product-prefill', summary: '商品预填（--id）' },
    { domain: 'source', action: 'clean-status', method: 'GET', path: '/app/source/inventory/clean/status', summary: '清洗任务状态（-p taskId=）' },
    { domain: 'source', action: 'clean-skills', method: 'GET', path: '/app/source/inventory/clean/skills', summary: '清洗技能选项' },
    // 货源 - 拉黑卖家
    { domain: 'source', action: 'blocked-page', method: 'GET', path: '/app/source/blocked-seller/page', summary: '拉黑卖家分页' },
    { domain: 'source', action: 'blocked-get', method: 'GET', path: '/app/source/blocked-seller/get', summary: '拉黑卖家详情（--id）' },
    // 虚拟货源订单
    { domain: 'virtualsupply', action: 'order-page', method: 'GET', path: '/app/xianyu/virtual-supply-order/page', summary: '虚拟货源订单分页' },
    { domain: 'virtualsupply', action: 'order-get', method: 'GET', path: '/app/xianyu/virtual-supply-order/get', summary: '虚拟货源订单详情（--id）' },
    // ============ 写操作（危险操作需 --yes） ============
    // 商品
    { domain: 'product', action: 'create', method: 'POST', path: '/app/xianyu/product/create', body: true, dangerous: true, summary: '创建商品（--body，先提交闲管家）' },
    { domain: 'product', action: 'create-batch', method: 'POST', path: '/app/xianyu/product/create-batch', body: true, dangerous: true, summary: '多店批量创建商品（--body）' },
    { domain: 'product', action: 'create-batch-multi', method: 'POST', path: '/app/xianyu/product/create-batch-multi', body: true, dangerous: true, summary: '多货源批量创建商品（--body）' },
    { domain: 'product', action: 'update', method: 'PUT', path: '/app/xianyu/product/update', body: true, dangerous: true, summary: '更新商品（--body）' },
    { domain: 'product', action: 'delete', method: 'DELETE', path: '/app/xianyu/product/delete', dangerous: true, summary: '删除商品（--id，可选 -p forceLocal=true）' },
    { domain: 'product', action: 'sync', method: 'POST', path: '/app/xianyu/product/sync', dangerous: true, summary: '同步本地商品到远端（--id）' },
    { domain: 'product', action: 'publish', method: 'POST', path: '/app/xianyu/product/publish', dangerous: true, summary: '上架商品（--id）' },
    { domain: 'product', action: 'down-shelf', method: 'POST', path: '/app/xianyu/product/down-shelf', dangerous: true, summary: '下架商品（--id）' },
    { domain: 'product', action: 'edit-stock', method: 'POST', path: '/app/xianyu/product/edit-stock', summary: '同步本地库存到远端（--id）' },
    { domain: 'product', action: 'copy', method: 'POST', path: '/app/xianyu/product/copy', dangerous: true, summary: '复制商品（--id，-p targetAccountId=）' },
    { domain: 'product', action: 'pull', method: 'POST', path: '/app/xianyu/product/pull', summary: '从远端拉取账号商品（-p accountId=）' },
    { domain: 'product', action: 'import-create', method: 'POST', path: '/app/xianyu/product/import/create', body: true, dangerous: true, summary: '批量导入确认创建（--body）' },
    // 订单
    { domain: 'order', action: 'pull', method: 'POST', path: '/app/xianyu/order/pull', summary: '拉取账号最近订单（-p accountId=）' },
    { domain: 'order', action: 'sync-detail', method: 'POST', path: '/app/xianyu/order/sync-detail', summary: '同步订单详情（--id）' },
    { domain: 'order', action: 'cancel', method: 'POST', path: '/app/xianyu/order/cancel', dangerous: true, summary: '取消订单（--id，可选 -p reason=）' },
    { domain: 'order', action: 'modify-price', method: 'POST', path: '/app/xianyu/order/modify-price', body: true, dangerous: true, summary: '改价（--body {id,orderPrice,expressFee}）' },
    { domain: 'order', action: 'attachment-pickup', method: 'POST', path: '/app/xianyu/order/attachment/pickup', body: true, dangerous: true, summary: '补传出餐码附件（--body {orderId,imageUrls[]}）' },
    { domain: 'order', action: 'attachment-check-pass', method: 'POST', path: '/app/xianyu/order/attachment/check-pass', dangerous: true, summary: '截图一致性人工放行（-p orderId=）' },
    { domain: 'order', action: 'attachment-reset-upload', method: 'POST', path: '/app/xianyu/order/attachment/reset-upload', dangerous: true, summary: '重置买家上传配额（-p orderId=）' },
    { domain: 'order', action: 'resend-mail', method: 'POST', path: '/app/xianyu/order/resend-mail', dangerous: true, summary: '重发点单邮件（-p orderId=）' },
    // 账号
    { domain: 'account', action: 'sync', method: 'POST', path: '/app/xianyu/account/sync', dangerous: true, summary: '同步端口下账号（-p portId=）' },
    { domain: 'account', action: 'sync-single', method: 'POST', path: '/app/xianyu/account/sync-single', dangerous: true, summary: '同步单个账号（-p accountId= -p portId=）' },
    { domain: 'account', action: 'update-status', method: 'PUT', path: '/app/xianyu/account/update-status', dangerous: true, summary: '账号状态切换（--id，-p status=）' },
    { domain: 'account', action: 'delete', method: 'DELETE', path: '/app/xianyu/account/delete', dangerous: true, summary: '删除账号（--id）' },
    { domain: 'account', action: 'update', method: 'PUT', path: '/app/xianyu/account/update', summary: '更新账号本地字段（--id，-p userName= -p remark= -p notifyEmail= -p serviceSupport=）' },
    { domain: 'account', action: 'create', method: 'POST', path: '/app/xianyu/account/create', summary: '创建账号（-p phoneNumber= -p userName=）' },
    // 消息
    { domain: 'message', action: 'read', method: 'PUT', path: '/app/xianyu/message/read', body: true, summary: '标记会话已读（--body {buyerNick,...}）' },
    // 端口
    { domain: 'port', action: 'create', method: 'POST', path: '/app/xianyu/port/create', body: true, summary: '创建端口（--body）' },
    { domain: 'port', action: 'update', method: 'PUT', path: '/app/xianyu/port/update', body: true, summary: '更新端口（--body）' },
    { domain: 'port', action: 'delete', method: 'DELETE', path: '/app/xianyu/port/delete', dangerous: true, summary: '删除端口（--id）' },
    // 卡券
    { domain: 'couponcard', action: 'create', method: 'POST', path: '/app/coupon-card/create', body: true, summary: '创建卡券类型（--body）' },
    { domain: 'couponcard', action: 'update', method: 'PUT', path: '/app/coupon-card/update', body: true, summary: '更新卡券类型（--body）' },
    { domain: 'couponcard', action: 'delete', method: 'DELETE', path: '/app/coupon-card/delete', dangerous: true, summary: '删除卡券类型（--id）' },
    { domain: 'couponcard', action: 'instance-import', method: 'POST', path: '/app/coupon-card/card-instance/import', body: true, dangerous: true, summary: '导入卡密（--body）' },
    { domain: 'couponcard', action: 'instance-delete', method: 'DELETE', path: '/app/coupon-card/card-instance/delete', body: true, dangerous: true, summary: '删除卡密实例（--body）' },
    // Agent
    { domain: 'agent', action: 'reset-token', method: 'PUT', path: '/app/xianyu/agent/{id}/token/reset', dangerous: true, summary: '重置试点机 token（--id）' },
    { domain: 'agent', action: 'enroll-create', method: 'POST', path: '/app/xianyu/agent/enroll/create', body: true, dangerous: true, summary: '生成注册码（--body）' },
    { domain: 'agent', action: 'enroll-revoke', method: 'DELETE', path: '/app/xianyu/agent/enroll/{id}', dangerous: true, summary: '吊销注册码（--id）' },
    // 回复任务
    { domain: 'replytask', action: 'create', method: 'POST', path: '/app/xianyu/reply-task/create', body: true, dangerous: true, summary: '创建回复任务（--body，自动回复真实买家）' },
    { domain: 'replytask', action: 'cancel', method: 'POST', path: '/app/xianyu/reply-task/{id}/cancel', dangerous: true, summary: '取消回复任务（--id）' },
    { domain: 'replytask', action: 'retry', method: 'POST', path: '/app/xianyu/reply-task/{id}/retry', dangerous: true, summary: '重试回复任务（--id）' },
    // 货源 - 采集任务
    { domain: 'source', action: 'task-create', method: 'POST', path: '/app/source/task/create', body: true, dangerous: true, summary: '创建采集任务（--body）' },
    { domain: 'source', action: 'task-delete', method: 'DELETE', path: '/app/source/task/delete', dangerous: true, summary: '删除采集任务（--id）' },
    { domain: 'source', action: 'task-pause', method: 'PUT', path: '/app/source/task/pause', summary: '暂停任务（--id）' },
    { domain: 'source', action: 'task-resume', method: 'PUT', path: '/app/source/task/resume', summary: '恢复任务（--id）' },
    { domain: 'source', action: 'task-execute', method: 'PUT', path: '/app/source/task/execute', dangerous: true, summary: '执行任务（--id，触发真实采集）' },
    { domain: 'source', action: 'task-viewed', method: 'PUT', path: '/app/source/task/viewed', summary: '标记执行已读（--id，-p executionNo=）' },
    { domain: 'source', action: 'cookie-refresh', method: 'POST', path: '/app/source/task/cookie/refresh', dangerous: true, summary: '刷新共享 Cookie（无参数）' },
    { domain: 'source', action: 'item-inventory', method: 'POST', path: '/app/source/task/item/inventory', summary: '条目入库存（-p detailId=）' },
    // 货源 - 库存
    { domain: 'source', action: 'inventory-refresh', method: 'POST', path: '/app/source/inventory/refresh', summary: '刷新单条库存（--id）' },
    { domain: 'source', action: 'inventory-delete', method: 'DELETE', path: '/app/source/inventory/delete', dangerous: true, summary: '删除单条库存（--id）' },
    { domain: 'source', action: 'inventory-batch-delete', method: 'POST', path: '/app/source/inventory/batch-delete', body: true, dangerous: true, summary: '批量删除库存（--body [ids]）' },
    { domain: 'source', action: 'inventory-manual-import', method: 'POST', path: '/app/source/inventory/manual-import', body: true, dangerous: true, summary: '手工导入库存（--body）' },
    { domain: 'source', action: 'inventory-import-create', method: 'POST', path: '/app/source/inventory/import/create', body: true, dangerous: true, summary: '批量导入确认创建（--body）' },
    { domain: 'source', action: 'clean-submit', method: 'POST', path: '/app/source/inventory/clean/submit', body: true, dangerous: true, summary: '提交清洗任务（--body）' },
    { domain: 'source', action: 'clean-recommend', method: 'POST', path: '/app/source/inventory/clean/recommend', body: true, summary: '清洗技能推荐（--body，无副作用）' },
    { domain: 'source', action: 'refine-apply', method: 'POST', path: '/app/source/inventory/refine-image/apply', dangerous: true, summary: '应用 AI 精修图（--id）' },
    // 货源 - 拉黑卖家
    { domain: 'source', action: 'blocked-create', method: 'POST', path: '/app/source/blocked-seller/create', body: true, summary: '拉黑卖家（--body）' },
    { domain: 'source', action: 'blocked-update', method: 'PUT', path: '/app/source/blocked-seller/update', body: true, summary: '更新拉黑卖家（--body）' },
    { domain: 'source', action: 'blocked-release', method: 'PUT', path: '/app/source/blocked-seller/release', summary: '解除拉黑（--id）' },
    // 虚拟货源订单
    { domain: 'virtualsupply', action: 'order-retry', method: 'POST', path: '/app/xianyu/virtual-supply-order/retry', dangerous: true, summary: '重试虚拟货源订单（--id）' },
    { domain: 'virtualsupply', action: 'order-cancel', method: 'POST', path: '/app/xianyu/virtual-supply-order/cancel', dangerous: true, summary: '取消虚拟货源订单（--id，-p reason=）' },
];
