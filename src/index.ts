#!/usr/bin/env node

import { login, logout, showStatus } from './auth';
import { COMMANDS, Command } from './commands';
import { request } from './client';
import { render } from './output';

const VALUE_FLAGS = new Set([
  'username',
  'password',
  'id',
  'page-no',
  'page-size',
  'tenant-id',
  'base-url',
  'body',
]);
const BOOL_FLAGS = new Set(['json', 'help', 'yes']);

interface Parsed {
  args: string[];
  flags: Record<string, string | true>;
  pairs: Array<[string, string]>;
}

function str(v: string | true | undefined): string | undefined {
  return typeof v === 'string' ? v : undefined;
}

function parseArgv(argv: string[]): Parsed {
  const args: string[] = [];
  const flags: Record<string, string | true> = {};
  const pairs: Array<[string, string]> = [];
  for (let i = 0; i < argv.length; i++) {
    const tok = argv[i];
    if (tok === '-p') {
      const rest = argv[++i];
      if (!rest) {
        throw new Error('-p 用法: -p key=value');
      }
      const eq = rest.indexOf('=');
      if (eq <= 0) {
        throw new Error(`-p 用法: -p key=value，收到 "${rest}"`);
      }
      pairs.push([rest.slice(0, eq), rest.slice(eq + 1)]);
      continue;
    }
    if (tok.startsWith('--')) {
      const eq = tok.indexOf('=');
      const name = eq > 0 ? tok.slice(2, eq) : tok.slice(2);
      const inlineVal = eq > 0 ? tok.slice(eq + 1) : undefined;
      if (BOOL_FLAGS.has(name)) {
        flags[name] = true;
      } else if (VALUE_FLAGS.has(name)) {
        flags[name] = inlineVal !== undefined ? inlineVal : (argv[++i] ?? '');
      } else {
        throw new Error(`未知参数 --${name}`);
      }
      continue;
    }
    args.push(tok);
  }
  return { args, flags, pairs };
}

function buildPath(def: Command, flags: Record<string, string | true>, positionalId?: string): string {
  let p = def.path;
  if (p.includes('{id}')) {
    const id = str(flags.id) ?? positionalId;
    if (!id) {
      throw new Error(`命令 ${def.domain} ${def.action} 需要 --id <id>`);
    }
    p = p.replace('{id}', encodeURIComponent(id));
  }
  return p;
}

function buildQuery(
  def: Command,
  flags: Record<string, string | true>,
  pairs: Array<[string, string]>,
): Array<[string, string]> {
  const q: Array<[string, string]> = pairs.slice();
  if (!def.body) {
    const pageNo = str(flags['page-no']);
    const pageSize = str(flags['page-size']);
    if (pageNo !== undefined) {
      q.push(['pageNo', pageNo]);
    }
    if (pageSize !== undefined) {
      q.push(['pageSize', pageSize]);
    }
    const id = str(flags.id);
    if (id !== undefined && !def.path.includes('{id}')) {
      q.push(['id', id]);
    }
  }
  return q;
}

function parseBody(def: Command, flags: Record<string, string | true>): unknown | undefined {
  if (!def.body) {
    return undefined;
  }
  const raw = str(flags.body);
  if (raw === undefined) {
    throw new Error(`命令 ${def.domain} ${def.action} 需要 --body '<json>'`);
  }
  try {
    return JSON.parse(raw);
  } catch {
    throw new Error('--body 必须是合法 JSON');
  }
}

function printHelp(): void {
  console.log('qtx — 闲鱼管理后台访问 CLI');
  console.log('');
  console.log('用法:');
  console.log('  qtx login [--username X] [--password X]   登录（密码可交互输入，不回显）');
  console.log('  qtx logout                                 退出登录');
  console.log('  qtx status                                 查看登录状态');
  console.log('  qtx <域> <动作> [--page-no N] [--page-size N] [-p key=value]... [--json]');
  console.log('');
  console.log('命令列表:');
  let lastDomain = '';
  for (const c of COMMANDS) {
    if (c.domain !== lastDomain) {
      console.log('');
      console.log(`  ${c.domain}:`);
      lastDomain = c.domain;
    }
    console.log(`    ${c.action.padEnd(22)} ${c.summary}`);
  }
  console.log('');
  console.log('常用选项:');
  console.log('  --page-no / --page-size  分页参数（对应后端 pageNo / pageSize）');
  console.log('  -p key=value             任意查询参数，可重复（同名参数重复拼接，适配数组字段）');
  console.log('  --id N                   get/写类命令的 id（路径或查询参数，自动适配）');
  console.log('  --body \'<json>\'           写操作请求体（仅 body 类命令需要）');
  console.log('  --yes                    确认执行危险操作（不带 --yes 只预演不执行）');
  console.log('  --json                   输出紧凑 JSON（供 agent 消费）');
  console.log('  --tenant-id N            租户请求头，默认 1');
  console.log('  --base-url URL           覆盖默认服务地址');
}

async function main(): Promise<void> {
  const { args, flags, pairs } = parseArgv(process.argv.slice(2));
  const cmd = args[0];

  try {
    if (cmd === undefined || cmd === 'help' || flags.help) {
      printHelp();
      return;
    }
    if (cmd === 'login') {
      await login({
        username: str(flags.username),
        password: str(flags.password),
        baseUrl: str(flags['base-url']),
      });
      console.log('登录成功');
      return;
    }
    if (cmd === 'logout') {
      await logout();
      console.log('已退出登录');
      return;
    }
    if (cmd === 'status') {
      console.log(showStatus());
      return;
    }

    const domain = cmd;
    const action = args[1];
    if (!action) {
      throw new Error(`缺少子命令，运行 \`qtx help\` 查看 ${domain} 下的动作`);
    }
    const def = COMMANDS.find((c) => c.domain === domain && c.action === action);
    if (!def) {
      throw new Error(`未知命令: ${domain} ${action}，运行 \`qtx help\` 查看可用命令`);
    }

    const path = buildPath(def, flags, args[2]);
    const query = buildQuery(def, flags, pairs);
    const body = parseBody(def, flags);

    if (def.dangerous && !flags.yes) {
      const qs = query.length ? '?' + query.map(([k, v]) => `${k}=${v}`).join('&') : '';
      const bs = body !== undefined ? ' body=' + JSON.stringify(body) : '';
      console.error(`已阻止危险操作（未执行）: ${def.method} ${path}${qs}${bs}`);
      console.error('确认执行请加 --yes 重试');
      process.exit(1);
    }

    const data = await request<unknown>(def.method, path, query, {
      tenantId: str(flags['tenant-id']),
      body,
    });
    console.log(render(data, Boolean(flags.json)));
  } catch (e) {
    const msg = e instanceof Error ? e.message : String(e);
    console.error(`错误: ${msg}`);
    process.exit(1);
  }
}

main();
