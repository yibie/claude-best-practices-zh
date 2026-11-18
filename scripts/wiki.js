// Generate wiki concept pages (LLM-written, grounded in translated excerpts)
const fs = require('fs');
const path = require('path');

const ROOT = path.join(__dirname, '..');
const KEY = JSON.parse(fs.readFileSync('/Users/chenyibin/.pi/agent/auth.json', 'utf8')).deepseek.key;
const MODEL = process.env.MODEL || 'deepseek-flash';
const CONC = Number(process.env.CONC || 6);
const WIKI = path.join(ROOT, 'wiki');
const DOCS = path.join(ROOT, 'docs', 'zh');
fs.mkdirSync(WIKI, { recursive: true });

const graph = JSON.parse(fs.readFileSync(path.join(ROOT, 'data', 'graph.json'), 'utf8'));
const manifest = JSON.parse(fs.readFileSync(path.join(ROOT, 'manifest.json'), 'utf8'));
const byRel = new Map();
for (const it of manifest.items) {
  const bucket = it.type === 'blogPost' ? 'articles' : it.type === 'guide' ? 'guides' : 'webinars';
  byRel.set(`${bucket}/${it.slug}.md`, it);
}
const nodes = new Map(graph.nodes.map((n) => [n.id, n]));
const adj = new Map();
for (const e of graph.edges) {
  (adj.get(e.from) || adj.set(e.from, []).get(e.from)).push({ id: e.to, rel: e.rel, w: e.w });
  (adj.get(e.to) || adj.set(e.to, []).get(e.to)).push({ id: e.from, rel: e.rel, w: e.w });
}

function snippets(docRel, zh, limit = 3) {
  const p = path.join(DOCS, docRel);
  if (!fs.existsSync(p)) return [];
  const text = fs.readFileSync(p, 'utf8').replace(/^---[\s\S]*?---/, '');
  const paras = text.split(/\n{2,}/).map((s) => s.trim()).filter((s) => s.length > 80 && !s.startsWith('#') && !s.startsWith('!') && !s.startsWith('|'));
  const hit = paras.filter((s) => s.includes(zh));
  const out = (hit.length ? hit : paras).slice(0, limit).map((s) => s.replace(/\s+/g, ' ').slice(0, 420));
  return out;
}

const SYS = `你在为一份"Claude 官方最佳实践"中文知识库编写维基条目（LLM Wiki 协议：原子化、可溯源、双向链接）。

规则：
1. 只使用给定的"资料摘录"和"概念关系"，不要编造数字、客户名或未出现的事实；资料不足时宁可写得简短。
2. 全中文写作，产品名（Claude Code、Cowork、MCP、Skills 等）保留英文。
3. 输出 Markdown 片段，从 "## 摘要" 开始，依次为：
   - "## 摘要"：2~3 句话，定义这个概念 + 它为什么重要。
   - "## 关键做法"：3~6 条可执行的要点，用 "- " 列表，每条 1~2 句。
   - "## 在 Claude 里的用法"：2~4 句，说明在 Claude 产品/平台中具体怎么用，提到相关产品与功能。
   - "## 常见误区"：2~3 条，用 "- " 列表；若资料不足可省略此节。
   - "## 相关概念"：用 [[概念名]] 的形式列出 2~5 个，每个后面用 " —— " 加一句关系说明。
4. 不要输出标题（# 一级标题）以外的 front matter，不要输出"来源"一节（由程序生成）。
5. 不要使用表格。`;

async function callModel(prompt, maxTokens = 2200) {
  const res = await fetch('https://api.deepseek.com/chat/completions', {
    method: 'POST',
    headers: { Authorization: `Bearer ${KEY}`, 'content-type': 'application/json' },
    body: JSON.stringify({
      model: MODEL,
      messages: [
        { role: 'system', content: SYS },
        { role: 'user', content: prompt },
      ],
      temperature: 0.4,
      max_tokens: maxTokens,
    }),
  });
  if (!res.ok) throw new Error(`HTTP ${res.status} ${(await res.text()).slice(0, 160)}`);
  const d = await res.json();
  return d.choices[0].message.content.trim();
}

async function buildNode(node) {
  const file = path.join(WIKI, `${node.id}.md`);
  if (fs.existsSync(file) && fs.statSync(file).size > 600) return 'skip';
  const rels = (adj.get(node.id) || []).sort((a, b) => b.w - a.w).slice(0, 8);
  const relIds = new Set(rels.map((r) => r.id));
  const docs = node.docs.slice(0, 10);

  const docLines = [];
  for (const d of node.docs.slice(0, 8)) {
    const it = byRel.get(d);
    const sn = snippets(d, node.zh);
    docLines.push(`- 文章：${it?.title || d}（${d}）\n  原文：${it?.url || ''}\n  摘录：\n${sn.map((s) => `    > ${s}`).join('\n') || '    > （无）'}`);
  }

  const prompt = `概念：${node.zh}（${node.en}）
分类：${node.cat}
定义（自动抽取）：${node.def}
别名：${node.aliases.join('、')}
被 ${node.count} 篇文章提及。

相关概念与关系：
${rels.map((r) => `- ${nodes.get(r.id)?.zh || r.id}：关系=${r.rel}，共现 ${r.w} 次`).join('\n') || '- 无'}

资料摘录：
${docLines.join('\n')}

请写出这个维基条目。相关概念一节只使用上面"相关概念与关系"里出现过的概念名。`;

  const body = await callModel(prompt);
  const links = rels.filter((r) => relIds.has(r.id)).map((r) => `[[${nodes.get(r.id)?.zh || r.id}]]`).join('、');
  const mermaid = ['```mermaid', 'graph LR', `  C["${node.zh}"]`]
    .concat(rels.slice(0, 6).map((r, i) => `  C -->|${r.rel}| N${i}["${nodes.get(r.id)?.zh || r.id}"]`))
    .concat(['```'])
    .join('\n');

  const sourceRows = docs.map((d, i) => {
    const it = byRel.get(d);
    const title = it?.title || d;
    const zhTitle = (() => {
      const p = path.join(DOCS, d);
      if (!fs.existsSync(p)) return title;
      const m = fs.readFileSync(p, 'utf8').match(/^title:\s*"(.*)"/m);
      return m ? m[1] : title;
    })();
    return `| ${i + 1} | [${zhTitle}](../docs/zh/${d}) | [原文](${it?.url || ''}) |`;
  });

  const fm = [
    '---',
    `title: ${JSON.stringify(node.zh)}`,
    `en: ${JSON.stringify(node.en)}`,
    `type: concept`,
    `category: ${JSON.stringify(node.cat)}`,
    `mentions: ${node.count}`,
    `aliases: ${JSON.stringify(node.aliases)}`,
    `tags: [concept, ${node.cat}]`,
    '---',
    '',
    `# ${node.zh}`,
    '',
    `> **分类**：${node.cat} ｜ **英文**：${node.en} ｜ **出现于 ${node.count} 篇文章**`,
    '',
    body,
    '',
    '## 知识图谱（Knowledge Graph）',
    '',
    mermaid,
    '',
    '## 来源（Sources）',
    '',
    '| # | 文章 | 原文 |',
    '| --- | --- | --- |',
    sourceRows.join('\n'),
    '',
  ].join('\n');

  fs.writeFileSync(file, fm);
  return 'ok';
}

(async () => {
  const only = process.argv.slice(2);
  const todo = graph.nodes.filter((n) => (only.length ? only.includes(n.id) || only.includes(n.zh) : true));
  let i = 0, ok = 0, fail = 0;
  await Promise.all(
    Array.from({ length: CONC }, async () => {
      while (i < todo.length) {
        const n = todo[i++];
        for (let a = 1; a <= 3; a++) {
          try {
            const r = await buildNode(n);
            if (r === 'ok') { ok++; console.log('ok', n.zh); } else console.log('skip', n.zh);
            break;
          } catch (e) {
            if (a === 3) { fail++; console.log('FAIL', n.zh, String(e).slice(0, 120)); }
            else await new Promise((r) => setTimeout(r, 1000 * a));
          }
        }
      }
    }),
  );
  console.log({ ok, fail, total: todo.length });
})();
