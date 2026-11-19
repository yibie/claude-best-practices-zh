// 把失去围栏的代码/提示词段落重新包起来（按首行前缀精确匹配）
const fs = require('fs');
const path = require('path');

const ROOT = path.join(__dirname, '..');
const DIRS = ['docs/zh', 'raw'];

// [首行前缀, 语言]
const RULES = [
  ["Read the logs you're given.", 'text'],
  ['{ "permissions": { "deny"', 'json'],
  ['Migrate the payment endpoints from', 'text'],
  ['Build a personal website with placeholder', 'text'],
  ["When a step doesn't need my input", 'text'],
  ['Audit every service in services/', 'text'],
  ['Review the diff on this branch against', 'text'],
  ['Once you have answered something', 'text'],
  ['/claude-api managed-agents-onboard', 'shell'],
  ['Follow your run steps in order.', 'text'],
  ['\\# After: Claude Sonnet 5.5', 'python'],
  ['# After: Claude Sonnet 5.5', 'python'],
  ['/claude-api build-eval', 'shell'],
  ['client.messages.create(', 'python'],
  ['\\# ...agree on the plan', 'shell'],
];

const unescapeMd = (s) => s.replace(/\\([\\`*_{}\[\]()#+\-.!<>|])/g, '$1');
let changed = 0;

for (const dir of DIRS) {
  const base = path.join(ROOT, dir);
  if (!fs.existsSync(base)) continue;
  for (const sub of fs.readdirSync(base)) {
    const d = path.join(base, sub);
    if (!fs.statSync(d).isDirectory()) continue;
    for (const f of fs.readdirSync(d).filter((x) => x.endsWith('.md'))) {
      const file = path.join(d, f);
      let text = fs.readFileSync(file, 'utf8');
      let touched = false;
      for (const [prefix, lang] of RULES) {
        let from = 0;
        for (;;) {
          const idx = text.indexOf('\n' + prefix, from);
          if (idx < 0) break;
          from = idx + 1;
          // 已在代码块里就跳过
          const before = text.slice(0, idx);
          if ((before.match(/```/g) || []).length % 2 === 1) continue;
          const start = idx + 1;
          let end = text.indexOf('\n\n', start);
          if (end < 0) end = text.length;
          const block = text.slice(start, end).replace(/\s+$/, '');
          const fenced = '```' + lang + '\n' + block.split('\n').map(unescapeMd).join('\n') + '\n```';
          text = text.slice(0, start) + fenced + text.slice(end);
          from = start + fenced.length;
          touched = true;
          changed++;
        }
      }
      if (touched) fs.writeFileSync(file, text);
    }
  }
}
console.log('fenced orphan blocks:', changed);
