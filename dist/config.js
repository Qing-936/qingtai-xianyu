"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.DEFAULT_BASE_URL = void 0;
exports.loadConfig = loadConfig;
exports.saveConfig = saveConfig;
const fs_1 = __importDefault(require("fs"));
const os_1 = __importDefault(require("os"));
const path_1 = __importDefault(require("path"));
const CONFIG_DIR = path_1.default.join(os_1.default.homedir(), '.qingtai-xianyu');
const CONFIG_FILE = path_1.default.join(CONFIG_DIR, 'config.json');
/** dev 公网网关，nginx 代理 /admin-api */
exports.DEFAULT_BASE_URL = process.env.QTX_BASE_URL ?? 'https://api.qkypaas.cn/admin-api';
function loadConfig() {
    try {
        return JSON.parse(fs_1.default.readFileSync(CONFIG_FILE, 'utf8'));
    }
    catch {
        return null;
    }
}
/** 只持久化 token，绝不写入明文密码 */
function saveConfig(cfg) {
    fs_1.default.mkdirSync(CONFIG_DIR, { recursive: true });
    fs_1.default.writeFileSync(CONFIG_FILE, JSON.stringify(cfg, null, 2), { mode: 0o600 });
}
