// 生成交互式知识图谱（D3 力导向 + 分类聚类）
const fs = require('fs');
const path = require('path');

const ROOT = path.join(__dirname, '..');
const graph = JSON.parse(fs.readFileSync(path.join(ROOT, 'data', 'graph.json'), 'utf8'));

const payload = {
  nodes: graph.nodes.map((n) => ({ id: n.id, label: n.zh, en: n.en, cat: n.cat, count: n.count, def: n.def })),
  edges: graph.edges.map((e) => ({ source: e.from, target: e.to, rel: e.rel, w: e.w })),
  cats: graph.categories,
  reviewed: graph.reviewed || null,
  generatedAt: graph.generatedAt,
};

const html = `<!doctype html>
<html lang="zh-CN"><head><meta charset="utf-8"/>
<meta name="viewport" content="width=device-width,initial-scale=1"/>
<title>Claude 最佳实践 · 知识图谱</title>
<style>
  :root{
    --bg:#0a0d12; --panel:rgba(20,24,33,.86); --line:#222a37; --fg:#e8ecf3; --muted:#8d97a8;
    --accent:#e0795c; --glow:rgba(124,156,245,.18);
  }
  *{box-sizing:border-box}
  html,body{margin:0;height:100%;background:var(--bg);color:var(--fg);
    font:14px/1.6 -apple-system,BlinkMacSystemFont,"PingFang SC","Segoe UI",sans-serif;overflow:hidden}
  #app{display:flex;height:100vh}
  /* ---------- sidebar ---------- */
  #side{width:264px;flex:0 0 264px;border-right:1px solid var(--line);display:flex;flex-direction:column;
        background:linear-gradient(180deg,#0d1118,#0a0d12)}
  .brand{padding:16px 18px 10px}
  .brand h1{margin:0;font-size:15px;font-weight:600;letter-spacing:.01em}
  .brand p{margin:2px 0 0;font-size:11.5px;color:var(--muted)}
  .search{padding:8px 14px}
  .search input{width:100%;background:#11161f;border:1px solid var(--line);border-radius:9px;color:var(--fg);
    padding:7px 10px;font-size:13px;outline:none;transition:.15s border-color}
  .search input:focus{border-color:#3b4a63}
  .filters{padding:6px 14px 10px;display:flex;flex-wrap:wrap;gap:6px;border-bottom:1px solid var(--line)}
  .chip{display:inline-flex;align-items:center;gap:6px;font-size:11.5px;color:#c3ccdb;background:#131926;
    border:1px solid var(--line);border-radius:999px;padding:3px 9px;cursor:pointer;user-select:none;transition:.15s}
  .chip .d{width:7px;height:7px;border-radius:50%}
  .chip.off{opacity:.34;text-decoration:line-through}
  .chip:hover{border-color:#3b4a63}
  .controls{padding:10px 14px;border-bottom:1px solid var(--line);display:flex;flex-wrap:wrap;gap:6px}
  .controls button{background:#131926;border:1px solid var(--line);color:#c3ccdb;border-radius:8px;
    padding:4px 9px;font-size:11.5px;cursor:pointer}
  .controls button:hover{border-color:#3b4a63;color:#fff}
  .controls button.on{background:#1d2637;border-color:#40537a;color:#fff}
  #detail{padding:14px 16px;overflow:auto;flex:1;border-top:1px solid var(--line)}
  #detail h2{margin:0 0 2px;font-size:16px}
  #detail .en{color:var(--muted);font-size:11.5px;margin-bottom:8px}
  #detail .def{font-size:13px;color:#cfd7e3;line-height:1.65}
  #detail .rels{margin-top:12px;font-size:12.5px}
  #detail .rels div{padding:3px 0;border-top:1px solid rgba(255,255,255,.05)}
  #detail .rels span.k{color:var(--muted)}
  #detail a{display:inline-block;margin-top:12px;color:#7fa6ff;text-decoration:none;font-size:12.5px}
  #detail a:hover{text-decoration:underline}
  #detail .hint{color:var(--muted);font-size:12px;line-height:1.7}
  #detail .stat{display:flex;gap:14px;margin-top:12px}
  #detail .stat div b{display:block;font-size:18px}
  #detail .stat div span{color:var(--muted);font-size:11px}
  /* ---------- canvas ---------- */
  #stage{flex:1;position:relative;background:
      radial-gradient(900px 520px at 62% 18%, rgba(124,156,245,.09), transparent 70%),
      radial-gradient(700px 500px at 24% 84%, rgba(224,121,92,.07), transparent 70%), var(--bg)}
  svg{width:100%;height:100%;display:block;cursor:grab}
  svg:active{cursor:grabbing}
  .cat-label{font-size:12.5px;font-weight:600;letter-spacing:.08em;fill:#5f6b7f;text-transform:uppercase}
  .n-label{font-size:11px;fill:#cfd7e3;paint-order:stroke;stroke:#0a0d12;stroke-width:2.6px;
    stroke-linejoin:round;pointer-events:none;transition:opacity .2s}
  .n-label.big{font-size:13px;fill:#fff;font-weight:600}
  .node{cursor:pointer;transition:opacity .2s}
  .node circle{stroke-width:1.2}
  .halo{fill:none;stroke-width:1;opacity:.5}
  .link{stroke:#2b3546;stroke-linecap:round;transition:opacity .2s}
  .link.hot{stroke:#8fb0ff;opacity:.95 !important}
  .link-label{font-size:9.5px;fill:#7f8ea8;pointer-events:none;opacity:0;transition:opacity .15s}
  .link-label.show{opacity:.95}
  .dim{opacity:.13 !important}
  #legend{position:absolute;right:14px;bottom:12px;font-size:11px;color:var(--muted);text-align:right;line-height:1.7}
  #legend b{color:#cfd7e3;font-weight:500}
  #tooltip{position:absolute;pointer-events:none;background:rgba(14,18,26,.95);border:1px solid #2b3546;
    border-radius:8px;padding:6px 9px;font-size:12px;max-width:240px;opacity:0;transition:opacity .15s;z-index:5}
</style></head>
<body>
<div id="app">
  <aside id="side">
    <div class="brand"><h1>Claude 最佳实践 · 知识图谱</h1>
      <p>100 个概念 · 关系经 DeepSeek 审阅</p></div>
    <div class="search"><input id="q" type="search" placeholder="搜索概念，回车定位"/></div>
    <div class="filters" id="chips"></div>
    <div class="controls">
      <button id="btn-labels" class="on">关系标签</button>
      <button id="btn-core">只看核心</button>
      <button id="btn-reset">重置视图</button>
    </div>
    <div id="detail">
      <p class="hint">点节点看定义与关联；双击打开维基条目；滚轮缩放、拖拽平移。</p>
      <div class="stat" id="stat"></div>
    </div>
  </aside>
  <div id="stage">
    <svg id="graph"></svg>
    <div id="tooltip"></div>
    <div id="legend"></div>
  </div>
</div>
<script type="application/json" id="data">${JSON.stringify(payload).replace(/</g, '\\u003c')}</script>
<script src="https://cdn.jsdelivr.net/npm/d3@7"></script>
<script>
const DATA = JSON.parse(document.getElementById('data').textContent);
const CATS = DATA.cats;
const PALETTE = ['#7C9CF5','#E8B33C','#5FC9A3','#E0795C','#B48EAD','#63C5DA','#F2A65A','#9DBF6E','#C0A6F0','#5E8B7E','#D98E73'];
const colorOf = (c) => PALETTE[Math.max(0, CATS.indexOf(c)) % PALETTE.length];

const nodes = DATA.nodes.map(d => ({...d}));
const byId = new Map(nodes.map(n => [n.id, n]));
const links = DATA.edges.map(e => ({...e, source: e.source, target: e.target}));
const deg = new Map(nodes.map(n => [n.id, 0]));
links.forEach(l => { deg.set(l.source, (deg.get(l.source)||0)+1); deg.set(l.target, (deg.get(l.target)||0)+1); });
nodes.forEach(n => n.deg = deg.get(n.id) || 0);
const maxCount = d3.max(nodes, d => d.count);
const r = d => 4 + Math.sqrt(d.count / maxCount) * 13;

// 分类锚点：环形排布，让同类节点聚在一起
const W = () => stage.clientWidth, H = () => stage.clientHeight;
const RING = () => Math.min(W(), H()) * 0.335;
const anchors = new Map();
CATS.forEach((c, i) => {
  const a = (i / CATS.length) * Math.PI * 2 - Math.PI / 2;
  anchors.set(c, { x: Math.cos(a), y: Math.sin(a), angle: a });
});

const svg = d3.select('#graph');
const gZoom = svg.append('g');
const gCat = gZoom.append('g');
const gLink = gZoom.append('g');
const gLabel = gZoom.append('g');
const gNode = gZoom.append('g');

const stage = document.getElementById('stage');
let hidden = new Set();
let coreOnly = false;
let showLinkLabels = true;

const visible = (d) => !hidden.has(d.cat) && (!coreOnly || d.count >= 8);

// ------- 力导向 -------
const intra = (l) => byId.get(l.source.id || l.source)?.cat === byId.get(l.target.id || l.target)?.cat;

const sim = d3.forceSimulation(nodes)
  .force('link', d3.forceLink(links).id(d => d.id)
    .distance(l => (intra(l) ? 44 : 170))
    .strength(l => (intra(l) ? 0.40 : 0.015)))
  .force('charge', d3.forceManyBody().strength(-90).distanceMax(230))
  .force('collide', d3.forceCollide(d => r(d) + 17).iterations(2))
  .force('x', d3.forceX(d => anchors.get(d.cat).x * RING()).strength(d => (d.count >= 12 ? 0.30 : 0.22)))
  .force('y', d3.forceY(d => anchors.get(d.cat).y * RING()).strength(d => (d.count >= 12 ? 0.30 : 0.22)))
  .alphaDecay(0.026);

const blobSel = gCat.insert('g', ':first-child').selectAll('path').data(CATS).join('path')
  .attr('class', 'blob')
  .attr('stroke', c => colorOf(c))
  .attr('fill', c => colorOf(c))
  .attr('fill-opacity', 0.05)
  .attr('stroke-opacity', 0.22);

const linkSel = gLink.selectAll('line').data(links).join('line')
  .attr('class', 'link')
  .attr('stroke', l => (intra(l) ? colorOf(byId.get(l.source.id || l.source).cat) : '#39465c'))
  .attr('stroke-width', l => (intra(l) ? Math.min(0.8 + l.w * 0.45, 2.6) : Math.min(0.6 + l.w * 0.3, 1.6)))
  .attr('stroke-opacity', l => (intra(l) ? Math.min(0.16 + l.w * 0.1, 0.5) : Math.min(0.08 + l.w * 0.06, 0.28)))
  .attr('stroke-dasharray', l => (intra(l) ? null : '3 4'));

const linkLabel = gLink.selectAll('text').data(links).join('text')
  .attr('class', 'link-label')
  .text(d => d.rel);

const nodeSel = gNode.selectAll('g').data(nodes).join('g')
  .attr('class', 'node')
  .call(d3.drag()
    .on('start', (e, d) => { if (!e.active) sim.alphaTarget(0.25).restart(); d.fx = d.x; d.fy = d.y; })
    .on('drag', (e, d) => { d.fx = e.x; d.fy = e.y; })
    .on('end', (e, d) => { if (!e.active) sim.alphaTarget(0); d.fx = null; d.fy = null; }));

nodeSel.append('circle')
  .attr('r', d => r(d) + 4)
  .attr('fill', 'none')
  .attr('stroke', d => colorOf(d.cat))
  .attr('stroke-opacity', 0.28)
  .attr('class', 'halo');

nodeSel.append('circle')
  .attr('r', r)
  .attr('fill', d => colorOf(d.cat) + '2e')
  .attr('stroke', d => colorOf(d.cat));

const labelSel = gLabel.selectAll('text').data(nodes).join('text')
  .attr('class', d => 'n-label' + (d.count >= 12 ? ' big' : ''))
  .text(d => d.label);

const catLabels = gCat.selectAll('text').data(CATS).join('text')
  .attr('class', 'cat-label')
  .text(c => c);

function blobPath(cat) {
  const pts = [];
  for (const d of nodes) {
    if (d.cat !== cat || d.x == null) continue;
    const pad = r(d) + 16;
    pts.push([d.x - pad, d.y], [d.x + pad, d.y], [d.x, d.y - pad], [d.x, d.y + pad]);
  }
  if (pts.length < 3) return '';
  const hull = d3.polygonHull(pts);
  if (!hull) return '';
  return d3.line().curve(d3.curveCatmullRomClosed.alpha(0.6))(hull) + 'Z';
}

function tick() {
  linkSel.attr('x1', d => d.source.x).attr('y1', d => d.source.y)
    .attr('x2', d => d.target.x).attr('y2', d => d.target.y);
  linkLabel.attr('x', d => (d.source.x + d.target.x) / 2).attr('y', d => (d.source.y + d.target.y) / 2 - 3);
  nodeSel.attr('transform', d => \`translate(\${d.x},\${d.y})\`);
  labelSel.attr('x', d => d.x).attr('y', d => d.y - r(d) - 6).attr('text-anchor', 'middle');
  blobSel.attr('d', c => blobPath(c));
  for (const c of CATS) {
    const members = nodes.filter(n => n.cat === c && n.x != null);
    if (!members.length) continue;
    const cx = d3.mean(members, m => m.x), cy = d3.mean(members, m => m.y);
    const rmax = d3.max(members, m => Math.hypot(m.x - cx, m.y - cy) + r(m));
    const a = anchors.get(c);
    const lab = catLabels.filter(x => x === c);
    lab.attr('x', cx + a.x * (rmax + 24))
      .attr('y', cy + a.y * (rmax + 24))
      .attr('text-anchor', a.x > 0.35 ? 'start' : a.x < -0.35 ? 'end' : 'middle');
  }
}
sim.on('tick', tick);

// ------- 缩放 -------
const zoom = d3.zoom().scaleExtent([0.35, 3.5]).on('zoom', (e) => {
  gZoom.attr('transform', e.transform);
  const k = e.transform.k;
  labelSel.attr('opacity', d => (k < 1.15 && d.count < 4) ? 0 : (visible(d) ? 1 : 0));
  catLabels.attr('opacity', k < 0.55 ? 0.4 : 0.9);
});
svg.call(zoom).on('dblclick.zoom', null);
const homeTransform = () => d3.zoomIdentity.translate(W() / 2, H() / 2).scale(1);
svg.call(zoom.transform, homeTransform());

// ------- 交互 -------
const detail = document.getElementById('detail');
const tip = document.getElementById('tooltip');

function relatedOf(id) {
  return links.filter(l => (l.source.id || l.source) === id || (l.target.id || l.target) === id)
    .map(l => {
      const out = (l.source.id || l.source) === id;
      const other = byId.get(out ? (l.target.id || l.target) : (l.source.id || l.source));
      return { other, rel: l.rel, out, w: l.w };
    })
    .filter(x => x.other)
    .sort((a, b) => b.w - a.w);
}

function showDetail(d) {
  const rels = relatedOf(d.id).slice(0, 12);
  detail.innerHTML = \`
    <h2>\${d.label}</h2>
    <div class="en">\${d.en || ''} · \${d.cat} · 提及 \${d.count} 篇</div>
    <div class="def">\${d.def || ''}</div>
    <div class="rels">\${rels.map(x => \`<div><span class="k">\${x.out ? x.rel + ' →' : '← ' + x.rel}</span> \${x.other.label}</div>\`).join('')}</div>
    <a href="https://github.com/yibie/claude-best-practices-zh/blob/main/wiki/\${encodeURIComponent(d.id)}.md" target="_blank">打开维基条目 →</a>\`;
}

function focusNode(id) {
  const n = byId.get(id);
  if (!n) return;
  const neighbors = new Set([id, ...relatedOf(id).map(x => x.other.id)]);
  nodeSel.classed('dim', d => !neighbors.has(d.id));
  linkSel.classed('dim', l => {
    const s = l.source.id || l.source, t = l.target.id || l.target;
    return !(neighbors.has(s) && neighbors.has(t)) || !(s === id || t === id);
  }).classed('hot', l => {
    const s = l.source.id || l.source, t = l.target.id || l.target;
    return s === id || t === id;
  });
  labelSel.classed('dim', d => !neighbors.has(d.id));
}

function clearFocus() {
  nodeSel.classed('dim', false);
  linkSel.classed('dim', false).classed('hot', false);
  labelSel.classed('dim', false);
}

nodeSel
  .on('mouseenter', (e, d) => { focusNode(d.id); showDetail(d);
    tip.innerHTML = \`<b>\${d.label}</b><br/><span style="color:#8d97a8">\${d.cat} · 提及 \${d.count} 篇</span>\`;
    tip.style.opacity = 1; })
  .on('mousemove', (e) => {
    const rect = stage.getBoundingClientRect();
    tip.style.left = Math.min(e.clientX - rect.left + 14, rect.width - 250) + 'px';
    tip.style.top = (e.clientY - rect.top + 14) + 'px';
  })
  .on('mouseleave', () => { clearFocus(); tip.style.opacity = 0; })
  .on('click', (e, d) => { showDetail(d); focusNode(d.id); })
  .on('dblclick', (e, d) => { window.open('https://github.com/yibie/claude-best-practices-zh/blob/main/wiki/' + encodeURIComponent(d.id) + '.md', '_blank'); });

// ------- 过滤 -------
const chips = document.getElementById('chips');
CATS.forEach(c => {
  const el = document.createElement('span');
  el.className = 'chip';
  el.innerHTML = \`<span class="d" style="background:\${colorOf(c)}"></span>\${c}\`;
  el.onclick = () => {
    if (hidden.has(c)) hidden.delete(c); else hidden.add(c);
    el.classList.toggle('off', hidden.has(c));
    applyVisibility();
  };
  chips.appendChild(el);
});

function applyVisibility() {
  nodeSel.style('display', d => visible(d) ? null : 'none');
  labelSel.style('display', d => visible(d) ? null : 'none');
  linkSel.style('display', l => {
    const s = byId.get(l.source.id || l.source), t = byId.get(l.target.id || l.target);
    return s && t && visible(s) && visible(t) ? null : 'none';
  });
  blobSel.style('display', c => (hidden.has(c) ? 'none' : null));
  linkLabel.style('display', d => showLinkLabels ? null : 'none');
  catLabels.style('display', c => hidden.has(c) ? 'none' : null);
}

document.getElementById('btn-labels').onclick = (e) => {
  showLinkLabels = !showLinkLabels;
  e.currentTarget.classList.toggle('on', showLinkLabels);
  applyVisibility();
};
document.getElementById('btn-core').onclick = (e) => {
  coreOnly = !coreOnly;
  e.currentTarget.classList.toggle('on', coreOnly);
  applyVisibility();
  sim.alpha(0.25).restart();
};
document.getElementById('btn-reset').onclick = () => {
  nodeSel.each(d => { d.fx = null; d.fy = null; });
  svg.transition().duration(500).call(zoom.transform, homeTransform());
  sim.alpha(0.5).restart();
};

// 关系标签只在缩放足够大时出现
svg.on('zoom.labels', () => {});

const q = document.getElementById('q');
q.addEventListener('keydown', (ev) => {
  if (ev.key !== 'Enter') return;
  const k = q.value.trim().toLowerCase();
  if (!k) return;
  const hit = nodes.find(n => n.label.toLowerCase().includes(k) || (n.en || '').toLowerCase().includes(k));
  if (!hit) return;
  nodeSel.selectAll('circle').attr('stroke-width', 1.2);
  const sel = nodeSel.filter(n => n.id === hit.id);
  sel.selectAll('circle').attr('stroke-width', 3);
  const t = d3.zoomTransform(svg.node());
  svg.transition().duration(600).call(
    zoom.transform,
    d3.zoomIdentity.translate(W() / 2 - hit.x * 1.5, H() / 2 - hit.y * 1.5).scale(1.5)
  );
  showDetail(hit); focusNode(hit.id);
});

document.getElementById('stat').innerHTML = \`
  <div><b>\${nodes.length}</b><span>概念</span></div>
  <div><b>\${links.length}</b><span>关系</span></div>
  <div><b>\${CATS.length}</b><span>分类</span></div>\`;
document.getElementById('legend').innerHTML =
  \`<b>节点大小</b> = 被提及文章数 ｜ <b>连线</b> = 语义关系<br/>悬停高亮关联 · 双击打开维基条目\`;

applyVisibility();
sim.alpha(0.9).restart();
window.addEventListener('resize', () => { svg.call(zoom.transform, homeTransform()); sim.alpha(0.2).restart(); });
</script>
</body></html>`;

fs.writeFileSync(path.join(ROOT, 'mindmap', 'graph.html'), html);
console.log('graph.html written', Math.round(html.length / 1024) + 'KB', 'nodes', payload.nodes.length, 'edges', payload.edges.length);
