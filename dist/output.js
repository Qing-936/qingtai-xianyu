"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.render = render;
const CAP = 40;
function cellStr(v) {
    if (v === null || v === undefined) {
        return '';
    }
    if (typeof v === 'object') {
        return JSON.stringify(v);
    }
    return String(v);
}
function pad(s, w) {
    return s.length > w ? s.slice(0, w - 1) + '…' : s.padEnd(w);
}
function renderTable(rows) {
    if (rows.length === 0) {
        return '(空)';
    }
    const first = rows[0];
    if (first === null || typeof first !== 'object') {
        return rows.map((r) => cellStr(r)).join('\n');
    }
    const keys = Object.keys(first);
    const records = rows;
    const widths = keys.map((k) => {
        let w = k.length;
        for (const r of records) {
            w = Math.max(w, cellStr(r[k]).length);
        }
        return Math.min(w, CAP);
    });
    const header = keys.map((k, i) => pad(k, widths[i])).join('  ');
    const sep = widths.map((w) => '-'.repeat(w)).join('  ');
    const body = records
        .map((r) => keys.map((k, i) => pad(cellStr(r[k]), widths[i])).join('  '))
        .join('\n');
    return [header, sep, body].join('\n');
}
function renderKeyValues(obj, indent = '') {
    const lines = [];
    for (const [k, v] of Object.entries(obj)) {
        if (v && typeof v === 'object') {
            if (Array.isArray(v)) {
                lines.push(`${indent}${k}:`);
                for (const item of v) {
                    lines.push(`${indent}  - ${cellStr(item)}`);
                }
            }
            else {
                lines.push(`${indent}${k}:`);
                lines.push(renderKeyValues(v, indent + '  '));
            }
        }
        else {
            lines.push(`${indent}${k}: ${cellStr(v)}`);
        }
    }
    return lines.join('\n');
}
function render(data, json) {
    if (json) {
        return JSON.stringify(data);
    }
    if (Array.isArray(data)) {
        return renderTable(data);
    }
    if (data && typeof data === 'object') {
        const obj = data;
        if (Array.isArray(obj.list) && typeof obj.total === 'number') {
            const table = renderTable(obj.list);
            return `${table}\n\n共 ${obj.total} 条`;
        }
        return renderKeyValues(obj);
    }
    return cellStr(data);
}
