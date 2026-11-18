// Extract per-document concept cards (used to build the wiki graph + mind map)
const fs = require('fs');
const path = require('path');

const ROOT = path.join(__dirname, '..');
const RAW = path.join(ROOT, 'raw');
const OUTDIR = path.join(ROOT, 'data', 'cards');
const KEY = JSON.parse(fs.readFileSync('/Users/chenyibin/.pi/agent/auth.json', 'utf8')).deepseek.key;
const CONC = Number(process.env.CONC || 6);
const MODEL = process.env.MODEL || 'deepseek-flash';

const SYS = `你是知识图谱构建器。给你一篇 Anthropic/Claude 官方文章的英文原文片段，你要抽出它涉及的核心概念以及概念之间的关系，并给出中文命名与中文定义。

严格输出 JSON（不要任何解释、不要代码围栏），结构如下：
{
  "summary_zh": "一句话中文摘要，60 字以内",
  "concepts": [
    {"en": "canonical english term", "zh": "规范中文名", "def_zh": "一句话中文定义，40 字以内", "kind": "technique|product|role|metric|risk|org"}
  ],
  "relations": [
    {"from": "zh 名 1", "to": "zh 名 2", "rel": "启用|依赖|解决|替代|属于|衡量|风险|用于"}
  ]
}

规则：
- concepts 5~10 个，只收"可复用、值得单独建维基条目"的概念；不要收公司名、人名、客户名、具体数字。
- 产品名（Claude Code / Claude Cowork / MCP / Skills / Agent SDK 等）可以收，kind 用 product。
- relations 3~8 条，from/to 必须是上面 concepts 里出现过的 zh 名；rel 只能从给定列表中选。
- 中文名要规范、可复用（例如 "上下文工程" 而不是 "上下文的管理方式"）。`;

async function callModel(text) {
  const res = await fetch('https://api.deepseek.com/chat/completions', {
    method: 'POST',
    headers: { Authorization: `Bearer ${KEY}`, 'content-type': 'application/json' },
    body: JSON.stringify({
      model: MODEL,
      messages: [
        { role: 'system', content: SYS },
        { role: 'user', content: text.slice(0, 24000) },
      ],
      temperature: 0.2,
      max_tokens: 2000,
      response_format: { type: 'json_object' },
    }),
  });
  if (!res.ok) throw new Error(`HTTP ${res.status} ${(await res.text()).slice(0, 150)}`);
  const d = await res.json();
  return JSON.parse(d.choices[0].message.content);
}

const files = [];
(function walk(d) {
  for (const e of fs.readdirSync(d, { withFileTypes: true })) {
    const p = path.join(d, e.name);
    if (e.isDirectory()) walk(p);
    else if (e.name.endsWith('.md')) files.push(p);
  }
})(RAW);
fs.mkdirSync(OUTDIR, { recursive: true });

const todo = files.filter((f) => !fs.existsSync(path.join(OUTDIR, path.basename(f, '.md') + '.json')));
console.log('pending cards', todo.length, '/', files.length);
let i = 0;
const res = { ok: 0, fail: 0 };
(async () => {
  await Promise.all(
    Array.from({ length: CONC }, async () => {
      while (i < todo.length) {
        const f = todo[i++];
        const rel = path.relative(RAW, f);
        const text = fs.readFileSync(f, 'utf8');
        for (let a = 1; a <= 3; a++) {
          try {
            const card = await callModel(text);
            card.rel = rel;
            fs.writeFileSync(path.join(OUTDIR, path.basename(f, '.md') + '.json'), JSON.stringify(card, null, 2));
            res.ok++;
            console.log('ok', rel, card.concepts?.length);
            break;
          } catch (e) {
            if (a === 3) { res.fail++; console.log('FAIL', rel, String(e).slice(0, 120)); }
            else await new Promise((r) => setTimeout(r, 1200 * a));
          }
        }
      }
    }),
  );
  console.log(res);
})();
