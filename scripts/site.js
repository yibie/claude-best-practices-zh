// Generate index pages, mind map, knowledge graph, and landing page
const fs = require('fs');
const path = require('path');

const ROOT = path.join(__dirname, '..');
const WIKI = path.join(ROOT, 'wiki');
const DOCS = path.join(ROOT, 'docs', 'zh');
const graph = JSON.parse(fs.readFileSync(path.join(ROOT, 'data', 'graph.json'), 'utf8'));
const manifest = JSON.parse(fs.readFileSync(path.join(ROOT, 'manifest.json'), 'utf8'));

const nodes = graph.nodes;
const nodeById = new Map(nodes.map((n) => [n.id, n]));
const adj = new Map();
for (const e of graph.edges) {
  (adj.get(e.from) || adj.set(e.from, []).get(e.from)).push({ id: e.to, rel: e.rel, w: e.w });
  (adj.get(e.to) || adj.set(e.to, []).get(e.to)).push({ id: e.from, rel: e.rel, w: e.w });
}

const CATS = ['智能体架构', 'Claude Code 与编程', '上下文工程', '工具与扩展', '模型与能力', '评估与验证', '成本与性能', '安全与治理', '企业落地与组织', '产品线与功能', '行业与场景'];
const byCat = new Map(CATS.map((c) => [c, []]));
for (const n of nodes) (byCat.get(n.cat) || byCat.set(n.cat, []).get(n.cat)).push(n);
for (const [c, arr] of byCat) arr.sort((a, b) => b.count - a.count);

const bucketOf = (it) => (it.type === 'blogPost' ? 'articles' : it.type === 'guide' ? 'guides' : 'webinars');
const typeName = { blogPost: '文章', guide: '指南', webinar: '网络研讨会' };
const zhTitle = (rel) => {
  const p = path.join(DOCS, rel);
  if (!fs.existsSync(p)) return null;
  const t = fs.readFileSync(p, 'utf8').match(/^title:\s*"(.*)"/m);
  return t ? t[1] : null;
};

/* ---------------- wiki/INDEX.md ---------------- */
const totalMentions = nodes.reduce((a, n) => a + n.count, 0);
const idx = [
  '# 知识库索引',
  '',
  `> 由 ${manifest.items.length} 条 Claude 官方资源编译而成，覆盖 ${nodes.length} 个概念条目、${graph.edges.length} 条概念关系。`,
  '',
  '## 主题清单',
  '',
  '| 分类 | 条目数 | 核心概念 |',
  '| --- | --- | --- |',
  ...CATS.filter((c) => byCat.get(c)?.length).map((c) => {
    const arr = byCat.get(c);
    return `| **${c}** | ${arr.length} | ${arr.slice(0, 5).map((n) => `[${n.zh}](${n.id}.md)`).join('、')} |`;
  }),
  '',
];
for (const c of CATS) {
  const arr = byCat.get(c) || [];
  if (!arr.length) continue;
  idx.push(`## ${c}`, '', '| 概念 | 英文 | 提及 | 定义 |', '| --- | --- | --- | --- |');
  for (const n of arr) idx.push(`| [${n.zh}](${n.id}.md) | ${n.en} | ${n.count} | ${(n.def || '').replace(/\|/g, '/')} |`);
  idx.push('');
}
idx.push(
  '## 更新日志',
  '',
  `- [ADD] ${new Date().toISOString().slice(0, 10)}：首次编译，纳入 ${nodes.length} 个概念条目与 ${graph.edges.length} 条关系，来源 ${manifest.items.length} 条官方资源。`,
  '',
);
fs.mkdirSync(WIKI, { recursive: true });
fs.writeFileSync(path.join(WIKI, 'INDEX.md'), idx.join('\n'));

/* ---------------- docs/README.md ---------------- */
const docRows = (items) =>
  items
    .sort((a, b) => String(b.date).localeCompare(String(a.date)))
    .map((it) => {
      const rel = `${bucketOf(it)}/${it.slug}.md`;
      const t = zhTitle(rel);
      const zt = t || it.title;
      const r = fs.existsSync(path.join(DOCS, rel)) ? `[中文译文](zh/${rel})` : '—';
      return `| ${String(it.date).slice(0, 10)} | ${it.title} | ${zt} | ${(it.products || []).join('、')} | ${r} | [原站](${it.url}) |`;
    });

const full = manifest.items.filter((i) => !i.noBody);
const nobody = manifest.items.filter((i) => i.noBody);
const docsIdx = [
  '# 中文译文目录',
  '',
  `共 ${manifest.items.length} 条资源：${full.length} 条有正文（已全文翻译），${nobody.length} 条为录播/报名页（仅摘要）。`,
  '',
  '## 文章 Articles',
  '',
  '| 日期 | 原文标题 | 中文标题 | 产品 | 译文 | 原文 |',
  '| --- | --- | --- | --- | --- | --- |',
  ...docRows(full.filter((i) => i.type === 'blogPost')),
  '',
  '## 指南 Guides',
  '',
  '| 日期 | 原文标题 | 中文标题 | 产品 | 译文 | 原文 |',
  '| --- | --- | --- | --- | --- | --- |',
  ...docRows(full.filter((i) => i.type === 'guide')),
  '',
  '## 网络研讨会 Webinars（含录播）',
  '',
  '| 日期 | 原文标题 | 中文标题 | 产品 | 译文 | 原文 |',
  '| --- | --- | --- | --- | --- | --- |',
  ...docRows(manifest.items.filter((i) => i.type === 'webinar')),
  '',
  '> `raw/` 下保留了抓取当天的英文 Markdown 快照，便于逐句对照校验。',
  '',
];
fs.mkdirSync(path.join(ROOT, 'docs'), { recursive: true });
fs.writeFileSync(path.join(ROOT, 'docs', 'README.md'), docsIdx.join('\n'));

/* ---------------- mind map (markmap md) ---------------- */
const mm = ['# Claude 最佳实践 · 知识地图', ''];
for (const c of CATS) {
  const arr = byCat.get(c) || [];
  if (!arr.length) continue;
  mm.push(`## ${c}`);
  for (const n of arr) {
    mm.push(`### ${n.zh} <small>${n.count}</small>`);
    const rels = (adj.get(n.id) || []).filter((r) => r.w >= 2).slice(0, 2);
    for (const r of rels) mm.push(`#### ${nodeById.get(r.id)?.zh || r.id}（${r.rel}）`);
  }
}
const GH = 'https://github.com/yibie/claude-best-practices-zh/blob/main';
mm.push('', '## 入口', `### [维基索引](${GH}/wiki/INDEX.md)`, `### [译文目录](${GH}/docs/README.md)`, '### [交互式知识图谱](graph.html)');
fs.mkdirSync(path.join(ROOT, 'mindmap'), { recursive: true });
fs.writeFileSync(path.join(ROOT, 'mindmap', 'mindmap.md'), mm.join('\n'));

/* ---------------- mermaid graph ---------------- */
const pal = ['#4C9AFF', '#36B37E', '#FFAB00', '#FF5630', '#6554C0', '#00B8D9', '#FF8B00', '#00875A', '#5243AA', '#0052CC', '#172B4D'];
const groups = CATS.map((c, i) => {
  const arr = (byCat.get(c) || []).filter((n) => n.count >= 3).slice(0, 8);
  if (!arr.length) return '';
  return `  subgraph g${i}["${c}"]\n${arr.map((n) => `    n_${n.id.replace(/[^a-zA-Z0-9]/g, '_')}["${n.zh}"]`).join('\n')}\n  end`;
}).filter(Boolean);
const strongEdges = graph.edges.filter((e) => e.w >= 2 && nodeById.get(e.from)?.count >= 3 && nodeById.get(e.to)?.count >= 3).slice(0, 70);
const mer = ['```mermaid', 'graph LR']
  .concat(groups)
  .concat(strongEdges.map((e) => `  n_${e.from.replace(/[^a-zA-Z0-9]/g, '_')} -->|${e.rel}| n_${e.to.replace(/[^a-zA-Z0-9]/g, '_')}`))
  .concat(['```'])
  .join('\n');
fs.writeFileSync(path.join(ROOT, 'mindmap', 'knowledge-graph.mmd'), mer);

/* ---------------- interactive graph html ---------------- */
const payload = {
  nodes: nodes.map((n) => ({ id: n.id, label: n.zh, en: n.en, cat: n.cat, count: n.count, def: n.def })),
  edges: graph.edges,
  cats: CATS,
};
const graphHtml = `<!doctype html>
<html lang="zh-CN"><head><meta charset="utf-8"/>
<meta name="viewport" content="width=device-width,initial-scale=1"/>
<title>Claude 最佳实践 · 知识图谱</title>
<style>
  :root{--bg:#0f1115;--fg:#e6e6e6;--muted:#8b93a1;--panel:#161a22;--line:#242a35}
  *{box-sizing:border-box}
  body{margin:0;font:14px/1.6 -apple-system,BlinkMacSystemFont,"PingFang SC","Segoe UI",sans-serif;background:var(--bg);color:var(--fg);height:100vh;display:flex;flex-direction:column}
  header{padding:12px 18px;border-bottom:1px solid var(--line);display:flex;gap:16px;align-items:center;flex-wrap:wrap;background:var(--panel)}
  h1{font-size:15px;margin:0;font-weight:600}
  .hint{color:var(--muted);font-size:12px}
  #legend{display:flex;gap:10px;flex-wrap:wrap;padding:8px 18px;border-bottom:1px solid var(--line);background:var(--panel)}
  .lg{display:flex;align-items:center;gap:6px;font-size:12px;color:var(--muted);cursor:pointer;user-select:none}
  .dot{width:9px;height:9px;border-radius:50%}
  main{flex:1;position:relative}
  #net{position:absolute;inset:0}
  aside{position:absolute;top:14px;right:14px;width:330px;max-height:calc(100% - 28px);overflow:auto;background:rgba(22,26,34,.96);border:1px solid var(--line);border-radius:12px;padding:16px;display:none}
  aside h2{margin:0 0 6px;font-size:16px}
  aside .en{color:var(--muted);font-size:12px;margin-bottom:10px}
  aside a{color:#7aa7ff;text-decoration:none}
  aside .rel{font-size:12px;color:var(--muted);margin-top:12px;border-top:1px solid var(--line);padding-top:10px}
  input[type=search]{background:#0d1017;border:1px solid var(--line);color:var(--fg);border-radius:8px;padding:5px 10px;outline:none;width:180px}
</style></head>
<body>
<header>
  <h1>Claude 最佳实践 · 知识图谱</h1>
  <input id="q" type="search" placeholder="搜索概念…"/>
  <span class="hint">节点大小 = 被文章提及次数 ｜ 点击节点查看定义与关联 ｜ 双击打开维基条目</span>
</header>
<div id="legend"></div>
<main><div id="net"></div>
<aside id="panel"><h2 id="p-title"></h2><div class="en" id="p-en"></div><div id="p-def"></div><div class="rel" id="p-rel"></div><div style="margin-top:10px"><a id="p-link" href="#" target="_blank">打开维基条目 →</a></div></aside>
</main>
<script type="application/json" id="data">${JSON.stringify(payload)}</script>
<script src="https://unpkg.com/vis-network@9.1.9/standalone/umd/vis-network.min.js"></script>
<script>
const DATA = JSON.parse(document.getElementById('data').textContent);
const COLORS = ['#4C9AFF','#36B37E','#FFAB00','#FF5630','#6554C0','#00B8D9','#FF8B00','#00875A','#5243AA','#0052CC','#A5A5A5'];
const colorOf = (cat) => COLORS[Math.max(0, DATA.cats.indexOf(cat)) % COLORS.length];
const visNodes = DATA.nodes.map(n => ({
  id: n.id, label: n.label, value: n.count,
  color: { background: colorOf(n.cat) + '33', border: colorOf(n.cat), highlight: { background: colorOf(n.cat)+'66', border: '#fff' } },
  font: { color: '#e6e6e6', size: n.count >= 20 ? 26 : n.count >= 8 ? 19 : 15, face: 'PingFang SC, sans-serif' },
  title: undefined, raw: n
}));
const visEdges = DATA.edges.map(e => ({
  from: e.from, to: e.to, label: e.w >= 3 ? e.rel : '', arrows: 'to',
  color: { color: '#2c3542', highlight: '#7aa7ff' }, width: Math.min(1 + e.w * 0.6, 5),
  font: { color: '#6b7484', size: 10, strokeWidth: 0 }, smooth: { type: 'continuous' }
}));
const container = document.getElementById('net');
const network = new vis.Network(container, { nodes: new vis.DataSet(visNodes), edges: new vis.DataSet(visEdges) }, {
  nodes: { shape: 'dot', scaling: { min: 8, max: 34, label: { min: 12, max: 22 } }, borderWidth: 1.5 },
  edges: { selectionWidth: 2 },
  physics: { stabilization: { iterations: 260 }, barnesHut: { gravitationalConstant: -9000, springLength: 140, springConstant: 0.03, damping: 0.4 } },
  interaction: { hover: true, tooltipDelay: 200, navigationButtons: false }
});
network.once('stabilizationIterationsDone', () => {
  network.setOptions({ physics: false });
  const top = DATA.nodes[0];
  network.selectNodes([top.id]);
  network.focus(top.id, { scale: 1.15, animation: { duration: 600 } });
  setTimeout(() => network.unselectAll(), 1200);
});
const legend = document.getElementById('legend');
DATA.cats.forEach(c => {
  const el = document.createElement('div'); el.className = 'lg';
  el.innerHTML = '<span class="dot" style="background:' + colorOf(c) + '"></span>' + c;
  legend.appendChild(el);
});
const panel = document.getElementById('panel');
network.on('click', (p) => {
  if (!p.nodes.length) { panel.style.display = 'none'; return; }
  const n = DATA.nodes.find(x => x.id === p.nodes[0]);
  document.getElementById('p-title').textContent = n.label;
  document.getElementById('p-en').textContent = (n.en || '') + ' · ' + n.cat + ' · 提及 ' + n.count + ' 篇';
  document.getElementById('p-def').textContent = n.def || '';
  const rel = DATA.edges.filter(e => e.from === n.id || e.to === n.id).slice(0, 12)
    .map(e => { const o = DATA.nodes.find(x => x.id === (e.from === n.id ? e.to : e.from)); return '· ' + (o ? o.label : '') + ' — ' + e.rel; }).join('<br/>');
  document.getElementById('p-rel').innerHTML = '<b>关联概念</b><br/>' + (rel || '无');
  const a = document.getElementById('p-link'); a.href = 'https://github.com/yibie/claude-best-practices-zh/blob/main/wiki/' + encodeURIComponent(n.id) + '.md';
  panel.style.display = 'block';
});
network.on('doubleClick', (p) => { if (p.nodes.length) window.open('https://github.com/yibie/claude-best-practices-zh/blob/main/wiki/' + encodeURIComponent(p.nodes[0]) + '.md', '_blank'); });
document.getElementById('q').addEventListener('input', (ev) => {
  const q = ev.target.value.trim();
  if (!q) { network.unselectAll(); return; }
  const hit = DATA.nodes.filter(n => n.label.includes(q) || (n.en||'').toLowerCase().includes(q.toLowerCase())).map(n => n.id);
  network.selectNodes(hit);
  if (hit.length) network.focus(hit[0], { scale: 1.1, animation: true });
});
</script>
</body></html>`;
fs.writeFileSync(path.join(ROOT, 'mindmap', 'graph.html'), graphHtml);

/* ---------------- markmap html ---------------- */
const markmapHtml = `<!doctype html>
<html lang="zh-CN"><head><meta charset="utf-8"/>
<meta name="viewport" content="width=device-width,initial-scale=1"/>
<title>Claude 最佳实践 · 思维导图</title>
<style>
  html,body{margin:0;height:100%;background:#0d0f13;color:#e8eaed;font-family:-apple-system,BlinkMacSystemFont,"PingFang SC",sans-serif}
  #bar{position:fixed;top:0;left:0;right:0;height:46px;display:flex;align-items:center;gap:10px;padding:0 14px;
       background:rgba(21,25,34,.94);border-bottom:1px solid #232a36;z-index:10;font-size:13px;color:#8b93a1}
  #bar b{color:#e8eaed;font-weight:600;margin-right:8px}
  button{background:#1c2230;border:1px solid #2b3444;color:#cdd4e0;border-radius:8px;padding:5px 11px;cursor:pointer;font-size:12px}
  button:hover{border-color:#d97757;color:#fff}
  #mm{position:fixed;top:46px;left:0;width:100%;height:calc(100vh - 46px)}
  /* markmap 默认把节点文字硬编码成 #333，在深色底上不可读，这里统一覆盖 */
  #mm{--markmap-text-color:#e8eaed;--markmap-circle-open-bg:#0d0f13;--markmap-circle-stroke:#4C9AFF;
      --markmap-code-color:#e8eaed;--markmap-code-bg:#1c2230;--markmap-a-color:#7aa7ff;--markmap-a-hover-color:#d97757;
      --markmap-font: 300 16px/1.4 -apple-system,BlinkMacSystemFont,"PingFang SC",sans-serif}
  #mm text{fill:#e8eaed !important}
  #mm .markmap-foreign, #mm .markmap-foreign *, #mm foreignObject div{color:#e8eaed !important}
  #mm .markmap-foreign a, #mm .markmap-foreign a *{color:#7aa7ff !important}
  #mm .markmap-foreign code{color:#f0c674 !important;background:#1c2230 !important}
  #mm .markmap-node>circle{fill:#0d0f13;stroke-width:2}
</style>
</head><body>
<div id="bar"><b>Claude 最佳实践 · 思维导图</b>
  <button id="lv1">只看分类</button><button id="lv2">展开一层</button><button id="lvAll">展开全部</button><button id="fit">适应窗口</button>
  <span>滚轮缩放 · 拖拽平移 · 点击节点折叠</span>
</div>
<svg id="mm"></svg>
<script src="https://cdn.jsdelivr.net/npm/d3@7"></script>
<script src="https://cdn.jsdelivr.net/npm/markmap-view"></script>
<script src="https://cdn.jsdelivr.net/npm/markmap-lib/dist/browser/index.js"></script>
<script type="text/template" id="md">
${mm.join('\n')}
</script>
<script>
(async () => {
  const md = document.getElementById('md').textContent;
  const { Transformer, deriveOptions } = window.markmap;
  const { root } = new Transformer().transform(md);
  const map = window.markmap.Markmap.create('#mm', {
    colorFreezeLevel: 2, maxWidth: 240, spacingVertical: 8, paddingX: 12,
    initialExpandLevel: 2, duration: 300
  }, root);
  window.__mm = map;
  const fit = () => { map.fit(); setTimeout(() => map.fit(), 350); };
  const setLevel = (lv) => {
    const walk = (n, d) => { n.payload = { ...(n.payload || {}), fold: d >= lv }; (n.children||[]).forEach(c => walk(c, d+1)); };
    walk(map.state.data, 0);
    map.renderData();
    setTimeout(() => {
      if (lv <= 1) { fit(); return; }
      // 深层展开后不整体缩小到看不清：固定缩放比例，把根节点放到左侧，靠平移浏览
      const rect = document.querySelector('#mm').getBoundingClientRect();
      const t = d3.zoomIdentity.translate(140, rect.height / 2).scale(lv > 2 ? 0.5 : 0.8);
      map.svg.transition().duration(320).call(map.zoom.transform, t);
    }, 380);
  };
  setTimeout(fit, 400);
  document.getElementById('lv1').onclick = () => setLevel(1);
  document.getElementById('lv2').onclick = () => setLevel(2);
  document.getElementById('lvAll').onclick = () => setLevel(99);
  document.getElementById('fit').onclick = () => fit();
  window.addEventListener('resize', () => map.fit());
})();
</script>
</body></html>`;
fs.writeFileSync(path.join(ROOT, 'mindmap', 'mindmap.html'), markmapHtml);

/* ---------------- data export for site ---------------- */
fs.writeFileSync(path.join(ROOT, 'mindmap', 'graph.json'), JSON.stringify(payload, null, 0));

console.log('generated: wiki/INDEX.md docs/README.md mindmap/*');
console.log('nodes', nodes.length, 'edges', graph.edges.length, 'mentions', totalMentions);
