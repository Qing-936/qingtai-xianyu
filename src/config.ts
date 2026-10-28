import fs from 'fs';
import os from 'os';
import path from 'path';

export interface Credentials {
  baseUrl: string;
  username: string;
  userId: number | null;
  accessToken: string;
  refreshToken: string;
  /** 过期时间：后端序列化为 epoch 毫秒时间戳 */
  expiresTime: number | null;
}

const CONFIG_DIR = path.join(os.homedir(), '.qingtai-xianyu');
const CONFIG_FILE = path.join(CONFIG_DIR, 'config.json');

/** dev 公网网关，nginx 代理 /admin-api */
export const DEFAULT_BASE_URL =
  process.env.QTX_BASE_URL ?? 'https://api.qkypaas.cn/admin-api';

export function loadConfig(): Partial<Credentials> | null {
  try {
    return JSON.parse(fs.readFileSync(CONFIG_FILE, 'utf8')) as Partial<Credentials>;
  } catch {
    return null;
  }
}

/** 只持久化 token，绝不写入明文密码 */
export function saveConfig(cfg: Partial<Credentials>): void {
  fs.mkdirSync(CONFIG_DIR, { recursive: true });
  fs.writeFileSync(CONFIG_FILE, JSON.stringify(cfg, null, 2), { mode: 0o600 });
}
