"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.ApiError = void 0;
exports.request = request;
const config_1 = require("./config");
class ApiError extends Error {
    code;
    constructor(code, message) {
        super(message);
        this.code = code;
    }
}
exports.ApiError = ApiError;
let pendingRefresh = null;
function tenantId(opts) {
    return opts?.tenantId ?? process.env.QTX_TENANT_ID ?? '1';
}
async function refreshAccessToken(baseUrl, refreshToken) {
    const url = `${baseUrl}/system/auth/refresh-token?refreshToken=${encodeURIComponent(refreshToken)}`;
    const resp = await fetch(url, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json', 'tenant-id': tenantId() },
    });
    const env = (await resp.json());
    if (env.code !== 0) {
        throw new ApiError(env.code, env.msg || '刷新 token 失败');
    }
    const cfg = (0, config_1.loadConfig)() ?? {};
    cfg.accessToken = env.data.accessToken;
    cfg.refreshToken = env.data.refreshToken;
    cfg.expiresTime = env.data.expiresTime;
    (0, config_1.saveConfig)(cfg);
    return env.data.accessToken;
}
/** 单飞刷新：并发 401 共享同一次 refresh-token 调用 */
function getOrRefresh(baseUrl, refreshToken) {
    if (!pendingRefresh) {
        pendingRefresh = refreshAccessToken(baseUrl, refreshToken).finally(() => {
            pendingRefresh = null;
        });
    }
    return pendingRefresh;
}
function buildUrl(baseUrl, path, query) {
    const sep = baseUrl.endsWith('/') ? '' : '/';
    let url = `${baseUrl}${sep}${path.replace(/^\//, '')}`;
    if (query && query.length > 0) {
        const usp = new URLSearchParams();
        for (const [k, v] of query) {
            usp.append(k, v);
        }
        url += `?${usp.toString()}`;
    }
    return url;
}
async function request(method, path, query, opts) {
    const cfg = (0, config_1.loadConfig)();
    if (!cfg?.accessToken) {
        throw new Error('未登录，请先运行 `qtx login`');
    }
    const baseUrl = cfg.baseUrl ?? process.env.QTX_BASE_URL ?? config_1.DEFAULT_BASE_URL;
    const url = buildUrl(baseUrl, path, query);
    const body = opts?.body === undefined ? undefined : JSON.stringify(opts.body);
    const doFetch = (token) => fetch(url, {
        method,
        headers: {
            Authorization: `Bearer ${token}`,
            'tenant-id': tenantId(opts),
            'Content-Type': 'application/json',
        },
        body,
    });
    let resp = await doFetch(cfg.accessToken);
    let env = (await resp.json());
    if (resp.status === 401 || env.code === 401) {
        if (!cfg.refreshToken) {
            throw new ApiError(401, env.msg || '登录已过期，请重新 `qtx login`');
        }
        const newToken = await getOrRefresh(baseUrl, cfg.refreshToken);
        resp = await doFetch(newToken);
        env = (await resp.json());
    }
    if (env.code !== 0) {
        throw new ApiError(env.code, env.msg || '请求失败');
    }
    return env.data;
}
