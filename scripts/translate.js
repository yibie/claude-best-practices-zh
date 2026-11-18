const fs = require('fs');
const path = require('path');
const crypto = require('crypto');

const ROOT = path.join(__dirname, '..');
const RAW = path.join(ROOT, 'raw');
const OUT = path.join(ROOT, 'docs', 'zh');
const KEY = JSON.parse(fs.readFileSync('/Users/chenyibin/.pi/agent/auth.json', 'utf8')).deepseek.key;
const GLOSSARY = fs.readFileSync(path.join(ROOT, 'glossary.md'), 'utf8');
const CONC = Number(process.env.CONC || 6);
const MODEL = process.env.MODEL || 'deepseek-flash';

const SYSTEM = `你是资深技术译者，负责把 Anthropic / Claude 官方的英文技术文档翻译成简体中文。必须严格遵守以下规则：

1. 完整翻译：不漏段落、不加原文没有的内容、不加译者注、不在结尾加总结。
2. 严格保留 Markdown 结构：标题层级、列表符号、表格、代码围栏、引用、链接地址、图片地址、HTML 片段一律保留。
3. 代码块内的代码逐字保留（注释可译），命令、路径、文件名、环境变量、URL 不翻译。
4. 遵守下面的术语表。术语表未覆盖的专有名词默认保留英文原样（产品名、模型名、公司名、API 名）。
5. front matter（文件首尾 --- 之间）只翻译 title 与 excerpt 两个字段的值，其他键与值原样保留，YAML 引号与格式不变。
6. 术语首次出现时用「中文（English）」形式，后文保持一致，不要在全文里反复夹注。
7. 输出只能是翻译后的完整 Markdown 文档本体，不要用 \`\`\`markdown 包住整篇，不要任何前言或说明。

术语表：
${GLOSSARY}`;

async function callModel(text, attempt = 1) {
  const res = await fetch('https://api.deepseek.com/chat/completions', {
    method: 'POST',
    headers: { Authorization: `Bearer ${KEY}`, 'content-type': 'application/json' },
    body: JSON.stringify({
      model: MODEL,
      messages: [
        { role: 'system', content: SYSTEM },
        { role: 'user', content: text },
      ],
      temperature: 0.3,
      max_tokens: 32000,
    }),
  });
  if (!res.ok) {
    const t = await res.text();
    throw new Error(`HTTP ${res.status} ${t.slice(0, 200)}`);
  }
  const d = await res.json();
  const ch = d.choices?.[0];
  const content = ch?.message?.content || '';
  if (!content || ch?.finish_reason === 'length') throw new Error(`bad completion finish=${ch?.finish_reason} len=${content.length}`);
  return { content: content.trim(), usage: d.usage };
}

function stats(md) {
  const fence = (md.match(/^```/gm) || []).length;
  const heads = (md.match(/^#{1,6} /gm) || []).length;
  const links = (md.match(/\]\(/g) || []).length;
  return { fence, heads, links, len: md.length };
}

const files = [];
function walk(dir) {
  for (const e of fs.readdirSync(dir, { withFileTypes: true })) {
    const p = path.join(dir, e.name);
    if (e.isDirectory()) walk(p);
    else if (e.name.endsWith('.md')) files.push(p);
  }
}
walk(RAW);

const onlyArgs = process.argv.slice(2);
let todo = files.filter((f) => {
  if (onlyArgs.length) return onlyArgs.some((a) => f.includes(a));
  const rel = path.relative(RAW, f);
  const dest = path.join(OUT, rel);
  return !fs.existsSync(dest) || fs.statSync(dest).size < 200;
});
todo.sort((a, b) => fs.statSync(b).size - fs.statSync(a).size);
console.log(`pending ${todo.length} / ${files.length}`);

const usageLog = [];
let idx = 0;
const results = { ok: 0, fail: 0 };

async function handle(src) {
  const rel = path.relative(RAW, src);
  const dest = path.join(OUT, rel);
  fs.mkdirSync(path.dirname(dest), { recursive: true });
  const text = fs.readFileSync(src, 'utf8');
  let lastErr;
  for (let attempt = 1; attempt <= 3; attempt++) {
    try {
      const t0 = Date.now();
      const { content, usage } = await callModel(text, attempt);
      const s = stats(content);
      const s0 = stats(text);
      const headRatio = s0.heads ? s.heads / s0.heads : 1;
      if (headRatio < 0.6) throw new Error(`heading loss ${s.heads}/${s0.heads}`);
      fs.writeFileSync(dest, content + '\n');
      usageLog.push({ rel, in: usage?.prompt_tokens, out: usage?.completion_tokens, ms: Date.now() - t0, heads: [s.heads, s0.heads], fence: [s.fence, s0.fence] });
      results.ok++;
      console.log(`ok ${rel} ${s0.len}->${s.len} heads ${s.heads}/${s0.heads} ${Math.round((Date.now() - t0) / 1000)}s`);
      return;
    } catch (e) {
      lastErr = e;
      await new Promise((r) => setTimeout(r, 1500 * attempt));
    }
  }
  results.fail++;
  console.log(`FAIL ${rel}: ${String(lastErr).slice(0, 160)}`);
  fs.appendFileSync(path.join(ROOT, 'translate-failures.log'), `${rel}\t${String(lastErr).slice(0, 300)}\n`);
}

(async () => {
  await Promise.all(
    Array.from({ length: CONC }, async () => {
      while (idx < todo.length) {
        const f = todo[idx++];
        await handle(f);
      }
    }),
  );
  fs.writeFileSync(path.join(ROOT, 'data', `usage-${Date.now()}.json`), JSON.stringify(usageLog, null, 2));
  const tin = usageLog.reduce((a, x) => a + (x.in || 0), 0);
  const tout = usageLog.reduce((a, x) => a + (x.out || 0), 0);
  console.log(results, { tin, tout });
})();
