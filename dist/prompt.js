"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.ask = ask;
const readline_1 = __importDefault(require("readline"));
const stream_1 = require("stream");
/** 丢弃所有写入，用于不回显密码输入 */
function mutedStream() {
    return new stream_1.Writable({
        write(_chunk, _encoding, callback) {
            callback();
        },
    });
}
/**
 * 读取一行输入。
 * hidden=true 时：问题写到 stderr，输入不回显（密码场景）。
 */
function ask(question, hidden = false) {
    return new Promise((resolve) => {
        const rl = readline_1.default.createInterface({
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
