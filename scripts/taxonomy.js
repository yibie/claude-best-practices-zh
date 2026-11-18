// Canonicalize concept names and assign categories (one LLM pass over frequent concepts)
const fs = require('fs');
const path = require('path');

const ROOT = path.join(__dirname, '..');
const KEY = JSON.parse(fs.readFileSync('/Users/chenyibin/.pi/agent/auth.json', 'utf8')).deepseek.key;
const MODEL = process.env.MODEL || 'deepseek-flash';
const MIN = Number(process.env.MIN || 2);

const cards = fs.readdirSync(path.join(ROOT, 'data', 'cards')).map((f) => JSON.parse(fs.readFileSync(path.join(ROOT, 'data', 'cards', f), 'utf8')));
const stat = new Map();
for (const c of cards) {
  for (const x of c.concepts || []) {
    const s = stat.get(x.zh) || { zh: x.zh, en: new Set(), defs: [], kind: x.kind, count: 0 };
    s.count++;
    s.en.add(x.en);
    if (x.def_zh && s.defs.length < 3 && !s.defs.includes(x.def_zh)) s.defs.push(x.def_zh);
    stat.set(x.zh, s);
  }
}
const freq = [...stat.values()].filter((s) => s.count >= MIN).sort((a, b) => b.count - a.count);
const payload = freq.map((s) => ({ zh: s.zh, en: [...s.en].slice(0, 2).join(' / '), n: s.count, defs: s.defs }));

const CATS = ['模型与能力', 'Claude Code 与编程', '智能体架构', '上下文工程', '工具与扩展', '评估与验证', '成本与性能', '企业落地与组织', '安全与治理', '行业与场景', '产品线与功能'];

const SYS = `你在为一份"Claude 官方最佳实践"语料设计一套受控概念表（controlled vocabulary）。

输入是自动抽取出来的原始概念名（含英文名、出现次数、若干定义）。其中大量概念是同义或近义重复（例如"子代理/子智能体/subagents"、"技能/智能体技能/Skills"、"MCP/模型上下文协议"）。

请把它们合并成规范概念，并归入固定分类。分类只能从下面选：
${CATS.join(' / ')}

输出严格 JSON（无解释、无代码围栏）：
{"concepts":[{"zh":"规范中文名","en":"规范英文名","cat":"分类","kind":"technique|product|role|metric|risk|org","aliases":["被合并的原始名",...],"def_zh":"一句话定义，40字以内"}]}

规则：
- 输出条目数控制在 60~90 个，只保留"值得单独成维基条目"的概念；
- aliases 必须覆盖输入里所有被合并的原始中文名（未合并就填空数组）；
- 中文名简短、名词化（"上下文工程" 而不是 "如何管理上下文"）；
- 不同层次的概念不要强行合并（例如"智能体循环"与"多智能体系统"要分开）。`;

async function callModel(list) {
  const res = await fetch('https://api.deepseek.com/chat/completions', {
    method: 'POST',
    headers: { Authorization: `Bearer ${KEY}`, 'content-type': 'application/json' },
    body: JSON.stringify({
      model: MODEL,
      messages: [
        { role: 'system', content: SYS },
        { role: 'user', content: JSON.stringify(list) },
      ],
      temperature: 0.1,
      max_tokens: 16000,
      response_format: { type: 'json_object' },
    }),
  });
  if (!res.ok) throw new Error(`HTTP ${res.status} ${(await res.text()).slice(0, 200)}`);
  const d = await res.json();
  return JSON.parse(d.choices[0].message.content);
}

(async () => {
  const merged = new Map();
  const chunkSize = 90;
  for (let i = 0; i < payload.length; i += chunkSize) {
    const chunk = payload.slice(i, i + chunkSize);
    const out = await callModel(chunk);
    for (const c of out.concepts || []) {
      const key = c.zh;
      if (merged.has(key)) {
        const prev = merged.get(key);
        prev.aliases.push(...(c.aliases || []));
        prev.count += chunk.filter((p) => (c.aliases || []).includes(p.zh)).length;
      } else {
        const aliases = new Set([c.zh, ...(c.aliases || [])]);
        const count = chunk.filter((p) => aliases.has(p.zh)).reduce((a, p) => a + p.n, 0);
        merged.set(key, { ...c, aliases: [...aliases], count });
      }
    }
    console.log('chunk done', i, merged.size);
  }
  // attach source docs
  const all = [...merged.values()];
  for (const c of all) {
    c.docs = [];
    for (const card of cards) {
      const hit = (card.concepts || []).find((x) => c.aliases.includes(x.zh));
      if (hit) c.docs.push({ rel: card.rel, summary: card.summary_zh, def: hit.def_zh });
    }
    c.count = c.docs.length || c.count;
  }
  all.sort((a, b) => b.count - a.count);
  fs.writeFileSync(path.join(ROOT, 'data', 'registry.json'), JSON.stringify(all, null, 2));
  console.log('concepts', all.length);
  console.log(all.slice(0, 25).map((c) => `${c.count}\t${c.cat}\t${c.zh}`).join('\n'));
})();
