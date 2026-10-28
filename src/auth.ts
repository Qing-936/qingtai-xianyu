import { ask } from './prompt';
import { loadConfig, saveConfig, DEFAULT_BASE_URL } from './config';
import { request } from './client';

interface LoginData {
  userId: number;
  accessToken: string;
  refreshToken: string;
  expiresTime: number | null;
}

interface LoginEnvelope {
  code: number;
  data: LoginData;
  msg: string;
}

export async function login(opts: {
  username?: string;
  password?: string;
  baseUrl?: string;
}): Promise<void> {
  const username = opts.username ?? (await ask('用户名: '));
  const password = opts.password ?? (await ask('密码: ', true));
  const baseUrl = opts.baseUrl ?? process.env.QTX_BASE_URL ?? DEFAULT_BASE_URL;

  const resp = await fetch(`${baseUrl}/system/auth/login`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'tenant-id': process.env.QTX_TENANT_ID ?? '1',
    },
    body: JSON.stringify({ username, password }),
  });
  const env = (await resp.json()) as LoginEnvelope;
  if (env.code !== 0) {
    throw new Error(env.msg || `登录失败 (code=${env.code})`);
  }
  saveConfig({
    baseUrl,
    username,
    userId: env.data.userId,
    accessToken: env.data.accessToken,
    refreshToken: env.data.refreshToken,
    expiresTime: env.data.expiresTime,
  });
}

export async function logout(): Promise<void> {
  const cfg = loadConfig();
  if (cfg?.accessToken) {
    try {
      await request<void>('POST', '/system/auth/logout');
    } catch {
      // 登出接口失败也继续清除本地凭证
    }
  }
  saveConfig({
    baseUrl: cfg?.baseUrl,
    username: cfg?.username,
    userId: null,
    accessToken: '',
    refreshToken: '',
    expiresTime: null,
  });
}

function formatMillis(ms: number | null | undefined): string {
  if (ms === null || ms === undefined || Number.isNaN(ms)) {
    return '-';
  }
  const d = new Date(ms);
  const p = (n: number) => String(n).padStart(2, '0');
  return `${d.getFullYear()}-${p(d.getMonth() + 1)}-${p(d.getDate())} ${p(d.getHours())}:${p(d.getMinutes())}:${p(d.getSeconds())}`;
}

export function showStatus(): string {
  const cfg = loadConfig();
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
