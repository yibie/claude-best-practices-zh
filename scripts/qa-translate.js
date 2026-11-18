// 第一遍审阅：逐篇对照英文原文检查中文译文，产出可自动应用的修订
const fs = require('fs');
const path = require('path');

const ROOT = path.join(__dirname, '..');
const RAW = path.join(ROOT, 'raw');
const ZH = path.join(ROOT, 'docs', 'zh');
const OUT = path.join(ROOT, 'data', 'qa', 'translate');
const KEY = JSON.parse(fs.readFileSync('/Users/chenyibin/.pi/agent/auth.json', 'utf8')).deepseek.key;
const MODEL = process.env.MODEL || 'deepseek-v4-pro';
const CONC = Number(process.env.CONC || 6);
fs.mkdirSync(OUT, { recursive: true });

const SYS = `你是资深中英技术翻译审校，负责校对 Anthropic / Claude 官方文档的中文译文。

任务：对照英文原文，找出中文译文里**确实的错误**。

只报告这几类问题：
- 误译：意思译错、因果/条件关系译反
- 漏译：原文有、译文整句或整段缺失
- 名词错：产品名、模型名、数字、单位、专有名词错误
- 术语不一致：同一概念前后译法不同
- 语句不通：语法错误或明显病句导致读不懂

不要报告：风格偏好、可接受的意译、标点差异、对原文的润色建议、你希望补充的解释。

输出严格 JSON（不要代码围栏、不要解释）：
{"issues":[{"zh":"译文中逐字存在的片段","fix":"替换后的片段","type":"误译|漏译|名词错|术语不一致|语句不通","note":"一句话说明，20字内"}]}

硬性要求：
1. zh 必须是译文中**逐字连续存在**的片段（10~300 字），不能改写、不能跨段、不要包含 \`\`\` 代码围栏；
2. fix 只替换 zh 那一段，其余上下文保持不变；
3. 一次最多报告 12 条，按严重程度排序；
4. 没有问题时返回 {"issues":[]}。`;

async function callModel(en, zh) {
  const res = await fetch('https://api.deepseek.com/chat/completions', {
    method: 'POST',
    headers: { Authorization: `Bearer ${KEY}`, 'content-type': 'application/json' },
    body: JSON.stringify({
      model: MODEL,
      messages: [
        { role: 'system', content: SYS },
        { role: 'user', content: `【英文原文】\n${en}\n\n【中文译文】\n${zh}` },
      ],
      temperature: 0.1,
      max_tokens: 4000,
      response_format: { type: 'json_object' },
    }),
  });
  if (!res.ok) throw new Error(`HTTP ${res.status} ${(await res.text()).slice(0, 160)}`);
  const d = await res.json();
  const txt = d.choices[0].message.content;
  return { data: JSON.parse(txt), usage: d.usage };
}

const files = [];
(function walk(d) {
  for (const e of fs.readdirSync(d, { withFileTypes: true })) {
    const p = path.join(d, e.name);
    if (e.isDirectory()) walk(p);
    else if (e.name.endsWith('.md')) files.push(path.relative(RAW, p));
  }
})(RAW);

const todo = files.filter((rel) => !fs.existsSync(path.join(OUT, rel.replace(/\.md$/, '.json'))));
console.log('pending', todo.length, '/', files.length);
let i = 0;
const stat = { ok: 0, fail: 0, issues: 0 };
(async () => {
  await Promise.all(
    Array.from({ length: CONC }, async () => {
      while (i < todo.length) {
        const rel = todo[i++];
        const en = fs.readFileSync(path.join(RAW, rel), 'utf8');
        const zhPath = path.join(ZH, rel);
        if (!fs.existsSync(zhPath)) continue;
        const zh = fs.readFileSync(zhPath, 'utf8');
        for (let a = 1; a <= 3; a++) {
          try {
            const t0 = Date.now();
            const { data, usage } = await callModel(en, zh);
            fs.mkdirSync(path.dirname(path.join(OUT, rel.replace(/\.md$/, '.json'))), { recursive: true });
            fs.writeFileSync(path.join(OUT, rel.replace(/\.md$/, '.json')), JSON.stringify({ rel, issues: data.issues || [], usage }, null, 2));
            stat.ok++;
            stat.issues += (data.issues || []).length;
            console.log(`ok ${rel} issues=${(data.issues || []).length} ${Math.round((Date.now() - t0) / 1000)}s`);
            break;
          } catch (e) {
            if (a === 3) { stat.fail++; console.log('FAIL', rel, String(e).slice(0, 140)); }
            else await new Promise((r) => setTimeout(r, 2000 * a));
          }
        }
      }
    }),
  );
  console.log(stat);
})();
