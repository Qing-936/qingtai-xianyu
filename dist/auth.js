"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.login = login;
exports.logout = logout;
exports.showStatus = showStatus;
const prompt_1 = require("./prompt");
const config_1 = require("./config");
const client_1 = require("./client");
async function login(opts) {
    const username = opts.username ?? (await (0, prompt_1.ask)('用户名: '));
    const password = opts.password ?? (await (0, prompt_1.ask)('密码: ', true));
    const baseUrl = opts.baseUrl ?? process.env.QTX_BASE_URL ?? config_1.DEFAULT_BASE_URL;
    const resp = await fetch(`${baseUrl}/system/auth/login`, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
            'tenant-id': process.env.QTX_TENANT_ID ?? '1',
        },
        body: JSON.stringify({ username, password }),
    });
    const env = (await resp.json());
    if (env.code !== 0) {
        throw new Error(env.msg || `登录失败 (code=${env.code})`);
    }
    (0, config_1.saveConfig)({
        baseUrl,
        username,
        userId: env.data.userId,
        accessToken: env.data.accessToken,
        refreshToken: env.data.refreshToken,
        expiresTime: env.data.expiresTime,
    });
}
async function logout() {
    const cfg = (0, config_1.loadConfig)();
    if (cfg?.accessToken) {
        try {
            await (0, client_1.request)('POST', '/system/auth/logout');
        }
        catch {
            // 登出接口失败也继续清除本地凭证
        }
    }
    (0, config_1.saveConfig)({
        baseUrl: cfg?.baseUrl,
        username: cfg?.username,
        userId: null,
        accessToken: '',
        refreshToken: '',
        expiresTime: null,
    });
}
function formatMillis(ms) {
    if (ms === null || ms === undefined || Number.isNaN(ms)) {
        return '-';
    }
    const d = new Date(ms);
    const p = (n) => String(n).padStart(2, '0');
    return `${d.getFullYear()}-${p(d.getMonth() + 1)}-${p(d.getDate())} ${p(d.getHours())}:${p(d.getMinutes())}:${p(d.getSeconds())}`;
}
function showStatus() {
    const cfg = (0, config_1.loadConfig)();
    if (!cfg?.accessToken) {
        return '未登录，请运行 `qtx login`';
    }
    return [
        `已登录: ${cfg.username ?? '(未知)'}`,
        `用户ID: ${cfg.userId ?? '-'}`,
        `服务地址: ${cfg.baseUrl}`,
        `token 过期时间: ${formatMillis(cfg.expiresTime)}`,
    ].join('\n');
}
