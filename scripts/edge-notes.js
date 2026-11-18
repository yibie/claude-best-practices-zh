// 为每条概念关系生成一句解释 + 一句原文摘录（deepseek-flash）
const fs = require('fs');
const path = require('path');

const ROOT = path.join(__dirname, '..');
const GRAPH = path.join(ROOT, 'data', 'graph.json');
const DOCS = path.join(ROOT, 'docs', 'zh');
const KEY = JSON.parse(fs.readFileSync('/Users/chenyibin/.pi/agent/auth.json', 'utf8')).deepseek.key;
const MODEL = process.env.MODEL || 'deepseek-flash';
const OUT = path.join(ROOT, 'data', 'qa', 'edge-notes.json');
const CONC = Number(process.env.CONC || 6);

const graph = JSON.parse(fs.readFileSync(GRAPH, 'utf8'));
const manifest = JSON.parse(fs.readFileSync(path.join(ROOT, 'manifest.json'), 'utf8'));
const bySlug = new Map();
for (const it of manifest.items) {
  const bucket = it.type === 'blogPost' ? 'articles' : it.type === 'guide' ? 'guides' : 'webinars';
  bySlug.set(`${bucket}/${it.slug}.md`, it);
}
const nodeById = new Map(graph.nodes.map((n) => [n.id, n]));

function snippet(rel, a, b) {
  const p = path.join(DOCS, rel);
  if (!fs.existsSync(p)) return '';
  const text = fs.readFileSync(p, 'utf8').replace(/^---[\s\S]*?---/, '');
  const paras = text.split(/\n{2,}/).map((s) => s.trim()).filter((s) => s.length > 60 && !s.startsWith('#') && !s.startsWith('|') && !s.startsWith('!'));
  const both = paras.find((s) => s.includes(a) && s.includes(b));
  const one = both || paras.find((s) => s.includes(a)) || paras.find((s) => s.includes(b));
  return (one || '').replace(/\s+/g, ' ').slice(0, 320);
}

const SYS = `你在为知识图谱的每条边写注解。给定两个概念、它们之间的关系，以及若干支撑文章片段。

输出严格 JSON（无解释、无代码围栏）：
{"note": "一句话解释这两个概念的关系，25~40 字，具体、有信息量，不要复述关系词本身", "quote": "从片段里摘一句最能支撑这条关系的原文，15~45 字，必须逐字来自片段；找不到就填空字符串"}

要求：
- 中文，不要出现"这个概念"之类的空话；
- note 要说明"为什么"或"在什么场景下"成立，而不是"X 启用 Y"的换皮；
- quote 不要加引号、不要改写、不要拼接不同句子。`;

async function gen(edge) {
  const a = nodeById.get(edge.from), b = nodeById.get(edge.to);
  const docList = Array.isArray(edge.docs) ? edge.docs : [];
  const support = docList.map((rel) => {
    const it = bySlug.get(rel);
    return { rel, title: it?.title || rel, url: it?.url || '', sn: snippet(rel, a.zh, b.zh) };
  }).filter((x) => x.sn);

  const user = `概念 A：${a.zh}（${a.en}）— ${a.def}
概念 B：${b.zh}（${b.en}）— ${b.def}
关系：${a.zh} --[${edge.rel}]--> ${b.zh}

支撑片段：
${support.slice(0, 3).map((s, i) => `[${i + 1}] 《${s.title}》\n${s.sn}`).join('\n\n') || '（无）'}`;

  const res = await fetch('https://api.deepseek.com/chat/completions', {
    method: 'POST',
    headers: { Authorization: `Bearer ${KEY}`, 'content-type': 'application/json' },
    body: JSON.stringify({
      model: MODEL,
      messages: [{ role: 'system', content: SYS }, { role: 'user', content: user }],
      temperature: 0.4,
      max_tokens: 400,
      response_format: { type: 'json_object' },
    }),
  });
  if (!res.ok) throw new Error(`HTTP ${res.status}`);
  const d = await res.json();
  const out = JSON.parse(d.choices[0].message.content);
  return { key: `${edge.from}|${edge.to}`, note: out.note || '', quote: out.quote || '' };
}

(async () => {
  const prev = fs.existsSync(OUT) ? JSON.parse(fs.readFileSync(OUT, 'utf8')) : {};
  const todo = graph.edges.filter((e) => !prev[`${e.from}|${e.to}`]);
  console.log('pending', todo.length, '/', graph.edges.length);
  let i = 0, ok = 0, fail = 0;
  await Promise.all(Array.from({ length: CONC }, async () => {
    while (i < todo.length) {
      const e = todo[i++];
      for (let a = 1; a <= 3; a++) {
        try {
          const r = await gen(e);
          prev[r.key] = { note: r.note, quote: r.quote };
          fs.writeFileSync(OUT, JSON.stringify(prev, null, 2));
          ok++;
          break;
        } catch (err) {
          if (a === 3) { fail++; console.log('FAIL', e.from, e.to, String(err).slice(0, 80)); }
          else await new Promise((r) => setTimeout(r, 800 * a));
        }
      }
    }
  }));
  console.log({ ok, fail, total: graph.edges.length });
})();
