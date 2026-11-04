import { readFile } from 'fs/promises';
import { basename, extname } from 'path';
import { loadConfig, saveConfig, DEFAULT_BASE_URL } from './config';

export class ApiError extends Error {
  code: number;

  constructor(code: number, message: string) {
    super(message);
    this.code = code;
  }
}

interface Envelope<T> {
  code: number;
  data: T;
  msg: string;
}

interface RefreshData {
  accessToken: string;
  refreshToken: string;
  expiresTime: number | null;
}

let pendingRefresh: Promise<string> | null = null;

function tenantId(opts?: { tenantId?: string }): string {
  return opts?.tenantId ?? process.env.QTX_TENANT_ID ?? '1';
}

async function refreshAccessToken(baseUrl: string, refreshToken: string): Promise<string> {
  const url = `${baseUrl}/system/auth/refresh-token?refreshToken=${encodeURIComponent(refreshToken)}`;
  const resp = await fetch(url, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json', 'tenant-id': tenantId() },
  });
  const env = (await resp.json()) as Envelope<RefreshData>;
  if (env.code !== 0) {
    throw new ApiError(env.code, env.msg || '刷新 token 失败');
  }
  const cfg = loadConfig() ?? {};
  cfg.accessToken = env.data.accessToken;
  cfg.refreshToken = env.data.refreshToken;
  cfg.expiresTime = env.data.expiresTime;
  saveConfig(cfg);
  return env.data.accessToken;
}

/** 单飞刷新：并发 401 共享同一次 refresh-token 调用 */
function getOrRefresh(baseUrl: string, refreshToken: string): Promise<string> {
  if (!pendingRefresh) {
    pendingRefresh = refreshAccessToken(baseUrl, refreshToken).finally(() => {
      pendingRefresh = null;
    });
  }
  return pendingRefresh;
}

function buildUrl(baseUrl: string, path: string, query?: Array<[string, string]>): string {
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

export async function request<T>(
  method: string,
  path: string,
  query?: Array<[string, string]>,
  opts?: { tenantId?: string; body?: unknown },
): Promise<T> {
  const cfg = loadConfig();
  if (!cfg?.accessToken) {
    throw new Error('未登录，请先运行 `qtx login`');
  }
  const baseUrl = cfg.baseUrl ?? process.env.QTX_BASE_URL ?? DEFAULT_BASE_URL;
  const url = buildUrl(baseUrl, path, query);
  const body = opts?.body === undefined ? undefined : JSON.stringify(opts.body);

  const doFetch = (token: string) =>
    fetch(url, {
      method,
      headers: {
        Authorization: `Bearer ${token}`,
        'tenant-id': tenantId(opts),
        'Content-Type': 'application/json',
      },
      body,
    });

  let resp = await doFetch(cfg.accessToken);
  let env = (await resp.json()) as Envelope<T>;

  if (resp.status === 401 || env.code === 401) {
    if (!cfg.refreshToken) {
      throw new ApiError(401, env.msg || '登录已过期，请重新 `qtx login`');
    }
    const newToken = await getOrRefresh(baseUrl, cfg.refreshToken);
    resp = await doFetch(newToken);
    env = (await resp.json()) as Envelope<T>;
  }

  if (env.code !== 0) {
    throw new ApiError(env.code, env.msg || '请求失败');
  }
  return env.data;
}

const IMAGE_MIME: Record<string, string> = {
  '.png': 'image/png',
  '.jpg': 'image/jpeg',
  '.jpeg': 'image/jpeg',
  '.webp': 'image/webp',
  '.gif': 'image/gif',
  '.bmp': 'image/bmp',
  '.svg': 'image/svg+xml',
};

function guessContentType(filename: string): string {
  return IMAGE_MIME[extname(filename).toLowerCase()] ?? 'application/octet-stream';
}

/** multipart 上传：不手动设 Content-Type，交给 fetch 自动带 boundary；复用 401 单飞刷新 */
async function requestMultipart<T>(
  method: string,
  path: string,
  form: FormData,
  opts?: { tenantId?: string },
): Promise<T> {
  const cfg = loadConfig();
  if (!cfg?.accessToken) {
    throw new Error('未登录，请先运行 `qtx login`');
  }
  const baseUrl = cfg.baseUrl ?? process.env.QTX_BASE_URL ?? DEFAULT_BASE_URL;
  const url = buildUrl(baseUrl, path);

  const doFetch = (token: string) =>
    fetch(url, {
      method,
      headers: {
        Authorization: `Bearer ${token}`,
        'tenant-id': tenantId(opts),
      },
      body: form,
    });

  let resp = await doFetch(cfg.accessToken);
  let env = (await resp.json()) as Envelope<T>;

  if (resp.status === 401 || env.code === 401) {
    if (!cfg.refreshToken) {
      throw new ApiError(401, env.msg || '登录已过期，请重新 `qtx login`');
    }
    const newToken = await getOrRefresh(baseUrl, cfg.refreshToken);
    resp = await doFetch(newToken);
    env = (await resp.json()) as Envelope<T>;
  }

  if (env.code !== 0) {
    throw new ApiError(env.code, env.msg || '上传失败');
  }
  return env.data;
}

/** 上传本地文件到 infra 文件存储，返回可访问 URL（商品主图 images / 规格图 skuItems[].imageUrl 需先经此拿到 URL） */
export async function uploadFile(
  localPath: string,
  opts?: { tenantId?: string; directory?: string },
): Promise<string> {
  const bytes = await readFile(localPath);
  const name = basename(localPath);
  const form = new FormData();
  form.append('file', new Blob([new Uint8Array(bytes)], { type: guessContentType(name) }), name);
  if (opts?.directory) {
    form.append('directory', opts.directory);
  }
  return requestMultipart<string>('POST', '/infra/file/upload', form, opts);
}
