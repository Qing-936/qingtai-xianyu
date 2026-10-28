import readline from 'readline';
import { Writable } from 'stream';

/** 丢弃所有写入，用于不回显密码输入 */
function mutedStream(): Writable {
  return new Writable({
    write(_chunk, _encoding, callback) {
      callback();
    },
  });
}

/**
 * 读取一行输入。
 * hidden=true 时：问题写到 stderr，输入不回显（密码场景）。
 */
export function ask(question: string, hidden = false): Promise<string> {
  return new Promise((resolve) => {
    const rl = readline.createInterface({
      input: process.stdin,
      output: hidden ? mutedStream() : process.stdout,
      terminal: true,
    });
    if (hidden) {
      process.stderr.write(question);
    }
    rl.question(hidden ? '' : question, (answer) => {
      rl.close();
      if (hidden) {
        process.stderr.write('\n');
      }
      resolve(answer.trim());
    });
  });
}
