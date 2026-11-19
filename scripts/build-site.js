// 站点构建：多页站点 + 主题切换 + 站内搜索
// RENDER_DOCS=1 时渲染全文到站内；默认只在站内生成索引，正文一律跳 GitHub
const fs = require('fs');
const path = require('path');
const MarkdownIt = require('markdown-it');

const ROOT = path.join(__dirname, '..');
const SITE = path.join(ROOT, 'site');
const SRC = path.join(ROOT, 'site-src');
const WIKI = path.join(ROOT, 'wiki');
const DOCS = path.join(ROOT, 'docs', 'zh');
const GRAPH = JSON.parse(fs.readFileSync(path.join(ROOT, 'data', 'graph.json'), 'utf8'));
const manifest = JSON.parse(fs.readFileSync(path.join(ROOT, 'manifest.json'), 'utf8'));

const RENDER_DOCS = process.env.RENDER_DOCS === '1';
const REPO = 'https://github.com/yibie/claude-best-practices-zh';
const BLOB = `${REPO}/blob/main`;
const TREE = `${REPO}/tree/main`;

const CARDS = {};
(function loadCards() {
  const dir = path.join(ROOT, 'data', 'cards');
  if (!fs.existsSync(dir)) return;
  for (const f of fs.readdirSync(dir)) {
    if (!f.endsWith('.json')) continue;
    try { CARDS[f.replace(/\.json$/, '')] = JSON.parse(fs.readFileSync(path.join(dir, f), 'utf8')); } catch (e) {}
  }
})();

const CATS = ['智能体架构', 'Claude Code 与编程', '上下文工程', '工具与扩展', '模型与能力', '评估与验证', '成本与性能', '安全与治理', '企业落地与组织', '产品线与功能', '行业与场景'];
const byId = new Map(GRAPH.nodes.map((n) => [n.id, n]));
const nameToId = new Map();
for (const n of GRAPH.nodes) {
  nameToId.set(n.zh, n.id);
  for (const a of n.aliases || []) if (!nameToId.has(a)) nameToId.set(a, n.id);
}

/* ---------------- markdown ---------------- */
const md = new MarkdownIt({ html: true, linkify: true });
let headingSeq = 0;
md.renderer.rules.fence = (tokens, idx) => {
  const t = tokens[idx];
  if (t.info.trim().startsWith('mermaid')) return `<pre class="mermaid">${md.utils.escapeHtml(t.content)}</pre>`;
  return `<pre class="code"><code>${md.utils.escapeHtml(t.content)}</code></pre>`;
};
md.renderer.rules.heading_open = (tokens, idx) => {
  tokens[idx].attrSet('id', `h-${++headingSeq}`);
  return `<${tokens[idx].tag} id="h-${headingSeq}">`;
};
const strip = (s) => s.replace(/^---[\s\S]*?---/, '').replace(/^\s*#\s+.*\n/, '');
const fm = (s, k) => {
  const m = s.match(new RegExp(`^${k}:\\s*(.*)$`, 'm'));
  return m ? m[1].replace(/^["']|["']$/g, '') : '';
};

/* ---------------- 数据 ---------------- */
const nodesByCat = new Map(CATS.map((c) => [c, []]));
for (const n of GRAPH.nodes) (nodesByCat.get(n.cat) || nodesByCat.set(n.cat, []).get(n.cat)).push(n);
for (const arr of nodesByCat.values()) arr.sort((a, b) => b.count - a.count);

const bucketOf = (it) => (it.type === 'blogPost' ? 'articles' : it.type === 'guide' ? 'guides' : 'webinars');
const TYPE_LABEL = { blogPost: '文章', guide: '指南', webinar: '网络研讨会' };
const readItems = manifest.items.map((it) => {
  const rel = `${bucketOf(it)}/${it.slug}.md`;
  const p = path.join(DOCS, rel);
  const src = fs.existsSync(p) ? fs.readFileSync(p, 'utf8') : '';
  return {
    ...it, rel, src,
    titleZh: src ? fm(src, 'title') || it.title : it.title,
    hasText: Boolean(src),
    // 站内地址（RENDER_DOCS）或 GitHub 地址
    url: RENDER_DOCS && src ? `/read/${rel.replace(/\.md$/, '.html')}` : `${BLOB}/docs/zh/${rel}`,
  };
});

/* ---------------- 设计系统 ---------------- */
const css = `
:root{
  --bg:#0a0b0d; --bg2:#0c0e12; --panel:#101318; --panel2:#151a21;
  --ink:#eceef1; --dim:#9aa1ab; --faint:#5d646e;
  --line:rgba(255,255,255,.09); --line-strong:rgba(255,255,255,.16);
  --accent:#e0795c; --accent-soft:rgba(224,121,92,.14);
  --link:#8fb0ff; --code-bg:#151c27; --mark:rgba(224,121,92,.28);
  --mono:ui-monospace,"SF Mono","Cascadia Mono",Menlo,Consolas,monospace;
  --sans:-apple-system,BlinkMacSystemFont,"Segoe UI","PingFang SC","Hiragino Sans GB","Microsoft YaHei",sans-serif;
}
html[data-theme="light"]{
  --bg:#f6f5f2; --bg2:#efece7; --panel:#fffefa; --panel2:#f2efe9;
  --ink:#15171b; --dim:#5a6068; --faint:#8b9099;
  --line:rgba(20,22,26,.12); --line-strong:rgba(20,22,26,.24);
  --accent:#c05a3a; --accent-soft:rgba(192,90,58,.12);
  --link:#2f5bd0; --code-bg:#ece9e2; --mark:rgba(192,90,58,.2);
}
*{box-sizing:border-box}
html{scroll-behavior:smooth;-webkit-text-size-adjust:100%}
body{margin:0;background:var(--bg);color:var(--ink);font:16px/1.75 var(--sans);-webkit-font-smoothing:antialiased}
a{color:var(--link);text-decoration:none}
a:hover{text-decoration:underline}
.layout{display:flex;min-height:100vh}

/* sidebar */
.side{width:272px;flex:0 0 272px;border-right:1px solid var(--line);background:var(--bg2);position:sticky;top:0;height:100vh;overflow:auto;padding-bottom:36px}
.brand{display:block;padding:18px 20px 14px;border-bottom:1px solid var(--line)}
.brand b{display:block;font-family:var(--mono);font-size:13px;color:var(--ink);letter-spacing:.02em}
.brand span{font-size:11.5px;color:var(--faint);font-family:var(--mono)}
.quick{display:flex;gap:6px;padding:11px 16px;border-bottom:1px solid var(--line)}
.quick a{font-size:11.5px;color:var(--dim);background:var(--panel);border:1px solid var(--line);border-radius:7px;padding:4px 8px;font-family:var(--mono)}
.quick a:hover{border-color:var(--accent);color:var(--accent);text-decoration:none}
.nav{padding:10px 10px}
.group{margin-bottom:12px}
.glabel{font-family:var(--mono);font-size:10.5px;letter-spacing:.16em;color:var(--faint);text-transform:uppercase;padding:6px 8px}
details{margin:1px 0}
summary{cursor:pointer;padding:5px 8px;border-radius:6px;font-size:13px;color:var(--dim);display:flex;justify-content:space-between;gap:8px;list-style:none}
summary::-webkit-details-marker{display:none}
summary:hover{background:var(--panel);color:var(--ink)}
summary span{color:var(--faint);font-size:11px;font-family:var(--mono)}
details ul{list-style:none;margin:2px 0 6px;padding:0 0 0 6px;border-left:1px solid var(--line)}
details li a{display:block;padding:3px 8px;font-size:12.5px;color:var(--dim);border-radius:5px;line-height:1.5}
details li a:hover{background:var(--panel);color:var(--ink);text-decoration:none}
details li.on a{color:var(--ink);background:var(--panel2);box-shadow:inset 2px 0 0 var(--accent)}

/* main */
main{flex:1;min-width:0;display:flex;flex-direction:column}
.topbar{position:sticky;top:0;z-index:20;display:flex;align-items:center;gap:12px;padding:10px 26px;
  background:color-mix(in srgb,var(--bg) 88%,transparent);backdrop-filter:blur(10px);border-bottom:1px solid var(--line)}
.topbar input{flex:1;max-width:420px;background:var(--panel);border:1px solid var(--line);border-radius:8px;color:var(--ink);
  padding:7px 11px;font-size:13px;outline:none;font-family:var(--sans)}
.topbar input::placeholder{color:var(--faint)}
.topbar input:focus{border-color:var(--accent)}
.topbar .meta{margin-left:auto;font-family:var(--mono);font-size:11.5px;color:var(--faint);white-space:nowrap}
#hits{position:absolute;top:52px;left:26px;width:min(520px,70vw);max-height:62vh;overflow:auto;background:var(--panel);
  border:1px solid var(--line-strong);border-radius:12px;display:none;z-index:30;box-shadow:0 18px 48px rgba(0,0,0,.35)}
#hits a{display:block;padding:9px 14px;border-bottom:1px solid var(--line);color:var(--ink);font-size:13px}
#hits a:last-child{border-bottom:none}
#hits a:hover{background:var(--panel2);text-decoration:none}
#hits .k{color:var(--faint);font-size:11px;display:block;font-family:var(--mono);margin-top:2px}

article{max-width:840px;padding:40px 28px 96px;margin:0 auto;width:100%}
article h1{font-size:clamp(26px,3.4vw,34px);line-height:1.3;margin:0 0 12px;letter-spacing:-.015em}
article h2{font-size:20px;margin:40px 0 12px;padding-top:12px;border-top:1px solid var(--line)}
article h3{font-size:16.5px;margin:26px 0 8px}
article p{margin:12px 0}
article ul,article ol{padding-left:22px}
article li{margin:5px 0}
article blockquote{margin:16px 0;padding:10px 16px;border-left:2px solid var(--accent);background:var(--panel);color:var(--dim);border-radius:0 8px 8px 0}
article code{background:var(--code-bg);padding:1px 5px;border-radius:4px;font-size:13.5px;font-family:var(--mono)}
article pre{margin:16px 0;background:var(--panel);border:1px solid var(--line);border-radius:10px;padding:14px 16px;overflow:auto}
article pre code{background:none;padding:0;font-size:13px;line-height:1.65}
article table{width:100%;border-collapse:collapse;margin:16px 0;font-size:14px;display:block;overflow:auto}
article th,article td{border:1px solid var(--line);padding:7px 11px;text-align:left;vertical-align:top}
article th{background:var(--panel);font-weight:600;font-family:var(--mono);font-size:12.5px;letter-spacing:.02em}
article img{max-width:100%;border-radius:8px;margin:14px 0;border:1px solid var(--line)}
article hr{border:none;border-top:1px solid var(--line);margin:30px 0}

.meta-line{color:var(--faint);font-size:12.5px;margin-bottom:24px;display:flex;gap:12px;flex-wrap:wrap;align-items:center;font-family:var(--mono)}
.tag{font-size:11px;color:var(--dim);border:1px solid var(--line);border-radius:999px;padding:1px 9px;background:var(--panel);font-family:var(--mono)}
.mermaid{background:var(--panel);border:1px solid var(--line);border-radius:10px;padding:16px;margin:18px 0;text-align:center;overflow:auto}
.note{font-size:13px;color:var(--dim);background:var(--panel);border:1px solid var(--line);border-radius:10px;padding:10px 14px;margin:16px 0}
footer{padding:16px 28px 40px;border-top:1px solid var(--line);color:var(--faint);font-size:12px;text-align:center;font-family:var(--mono)}
footer a{color:var(--faint)}

/* 索引表 */
.idx-head{display:flex;align-items:baseline;justify-content:space-between;gap:16px;margin:34px 0 10px;
  border-bottom:1px solid var(--line);padding-bottom:8px}
.idx-head h2{font-family:var(--mono);font-size:13px;letter-spacing:.14em;text-transform:uppercase;color:var(--dim);margin:0;border:none;padding:0}
.idx-head .n{font-family:var(--mono);font-size:11.5px;color:var(--faint)}
.idx-row{display:grid;grid-template-columns:1fr auto;gap:14px;padding:11px 0;border-bottom:1px solid var(--line);align-items:baseline}
.idx-row:hover{background:color-mix(in srgb,var(--panel) 60%,transparent)}
.idx-row .t{font-size:15px;color:var(--ink);line-height:1.5}
.idx-row .t small{display:block;color:var(--faint);font-size:12px;font-family:var(--mono);margin-top:2px}
.idx-row .m{font-family:var(--mono);font-size:11px;color:var(--faint);white-space:nowrap;text-align:right}
.idx-row .m b{color:var(--accent);font-weight:500}
.cat-block{margin:34px 0 44px;scroll-margin-top:70px}
.cat-block h3{font-size:15px;margin:0 0 4px;display:flex;justify-content:space-between;align-items:baseline}
.cat-block h3 span{font-family:var(--mono);font-size:11px;color:var(--faint)}
.hero-mini{padding:44px 0 18px}
.hero-mini h1{font-size:clamp(30px,4.4vw,44px);line-height:1.15;letter-spacing:-.02em;margin:0 0 12px}
.hero-mini h1 em{font-style:normal;color:var(--accent)}
.hero-mini p{color:var(--dim);font-size:16px;margin:0;max-width:640px}


/* 阅读进度与字号 */
#readbar{position:fixed;top:0;left:0;right:0;height:2px;z-index:40;background:transparent;pointer-events:none}
#readbar i{display:block;height:100%;width:0;background:var(--accent);transition:width .1s linear}
.fontctl{display:inline-flex;align-items:center;gap:1px;border:1px solid var(--line);border-radius:8px;background:var(--panel);padding:1px}
.fontctl button{background:none;border:0;color:var(--dim);font-family:var(--mono);font-size:11px;padding:3px 7px;border-radius:6px;cursor:pointer}
.fontctl button:hover{color:var(--ink);background:var(--panel2)}
.fontctl button.on{color:var(--accent)}

/* 文章页排版 */
article.doc{max-width:760px}
.doc-sub{color:var(--faint);font-size:13px;margin:-6px 0 26px;font-family:var(--mono)}
.doc h1{font-size:clamp(25px,3vw,32px);line-height:1.28}
.doc h2{font-size:20px;margin:38px 0 12px}
.doc h3{font-size:16.5px}
.doc p{font-size:var(--doc-font,16px);line-height:1.85;color:var(--dim)}
.doc li{font-size:calc(var(--doc-font,16px) - 0.5px);line-height:1.8}
.doc blockquote{font-size:calc(var(--doc-font,16px) - 0.5px)}
.doc h2{font-size:calc(var(--doc-font,16px) + 4px)}
.doc blockquote{font-size:15.5px}
.doc-foot{color:var(--faint);font-size:12px;margin-top:36px}
.rel-block{margin:44px 0 8px;border-top:1px solid var(--line);padding-top:18px}
.rel-block h3{font-family:var(--mono);font-size:10.5px;letter-spacing:.14em;text-transform:uppercase;color:var(--faint);margin:0 0 10px}
.rel-chips{display:flex;gap:7px;flex-wrap:wrap}
.rel-chips a{font-size:12.5px;border:1px solid var(--line);border-radius:999px;padding:3px 11px;color:var(--dim);background:var(--panel)}
.rel-chips a:hover{border-color:var(--accent);color:var(--accent);text-decoration:none}
.pager{display:grid;grid-template-columns:1fr 1fr;gap:12px;margin:34px 0 10px}
.pager-cell{display:flex;flex-direction:column;gap:3px;border:1px solid var(--line);border-radius:12px;padding:11px 14px;background:var(--panel);color:var(--dim)}
.pager-cell:hover{border-color:var(--line2);text-decoration:none;color:var(--ink)}
.pager-cell span{font-family:var(--mono);font-size:10.5px;color:var(--faint)}
.pager-cell b{font-weight:500;font-size:13.5px;line-height:1.5}
.pager-cell.empty{border:none;background:none}
.doc-layout{max-width:1120px;margin:0 auto;padding:36px 28px 80px;display:grid;grid-template-columns:minmax(0,1fr);gap:36px;align-items:start}
.doc-layout article.doc{max-width:760px;padding:0;margin:0}
.toc-rail{display:none}
@media(min-width:1240px){
  .doc-layout{grid-template-columns:minmax(0,760px) 220px}
  .toc-rail{display:block;position:sticky;top:24px;padding-top:4px}
  .toc-list{border-left:1px solid var(--line);padding-left:14px;max-height:calc(100vh - 90px);overflow:auto}
  .toc-list .toc-h{font-family:var(--mono);font-size:10px;letter-spacing:.14em;text-transform:uppercase;color:var(--faint);margin-bottom:8px}
  .toc-list a{display:block;font-size:12.5px;color:var(--dim);padding:3px 0;line-height:1.5}
  .toc-list a.lv3{padding-left:10px;font-size:12px;color:var(--faint)}
  .toc-list a:hover{color:var(--accent);text-decoration:none}
}

@media(max-width:900px){
  .side{display:none}
  .topbar .meta{display:none}
  article{padding:26px 18px 80px}
  .idx-row{grid-template-columns:1fr}
  .idx-row .m{text-align:left}
}
`;

/* ---------------- 导航 ---------------- */
function nav(current) {
  const conceptGroups = CATS.filter((c) => nodesByCat.get(c)?.length)
    .map((c) => {
      const arr = nodesByCat.get(c);
      const items = RENDER_DOCS ? arr : arr.slice(0, 0);
      const open = arr.some((n) => current === `wiki/${n.id}.html`);
      const list = items.length
        ? `<ul>${items.slice(0, 14).map((n) => `<li${current === `wiki/${n.id}.html` ? ' class="on"' : ''}><a href="/wiki/${n.id}.html">${n.zh}</a></li>`).join('')}${items.length > 14 ? `<li><a href="/wiki/INDEX.html#c-${CATS.indexOf(c)}" style="color:var(--faint)">查看全部 ${items.length} 个 →</a></li>` : ''}</ul>`
        : '';
      return `<details${open ? ' open' : ''}><summary><a href="/wiki/INDEX.html#c-${CATS.indexOf(c)}" style="color:inherit;text-decoration:none;flex:1">${c}</a><span>${arr.length}</span></summary>${list}</details>`;
    })
    .join('');

  const readGroups = ['articles', 'guides', 'webinars']
    .map((b) => {
      const items = readItems.filter((i) => bucketOf(i) === b && i.hasText);
      const key = b === 'articles' ? 'blogPost' : b === 'guides' ? 'guide' : 'webinar';
      const open = items.some((i) => current === `read/${i.rel.replace(/\.md$/, '.html')}`);
      const list = RENDER_DOCS
        ? `<ul>${items.slice(0, 12).map((i) => `<li${current === `read/${i.rel.replace(/\.md$/, '.html')}` ? ' class="on"' : ''}><a href="/read/${i.rel.replace(/\.md$/, '.html')}">${i.titleZh}</a></li>`).join('')}${items.length > 12 ? `<li><a href="/read/index.html#${b}" style="color:var(--faint)">查看全部 ${items.length} 篇 →</a></li>` : ''}</ul>`
        : '';
      return `<details${open ? ' open' : ''}><summary><a href="/read/index.html#${b}" style="color:inherit;text-decoration:none;flex:1">${TYPE_LABEL[key]}</a><span>${items.length}</span></summary>${list}</details>`;
    })
    .join('');

  return `<aside class="side">
  <a class="brand" href="/"><b>Claude 最佳实践</b><span>中文知识库</span></a>
  <div class="quick">
    <a href="/graph.html">知识图谱 ↗</a>
    <a href="/mindmap.html">思维导图 ↗</a>
  </div>
  <nav class="nav">
    <div class="group"><div class="glabel">概念维基</div>${conceptGroups}</div>
    <div class="group"><div class="glabel">中文译文</div>${readGroups}</div>
    <div class="group"><div class="glabel">仓库</div>
      <details><summary><a href="${TREE}/raw" target="_blank" rel="noopener" style="color:inherit;text-decoration:none;flex:1">英文原文快照 ↗</a></summary></details>
      <details><summary><a href="${REPO}" target="_blank" rel="noopener" style="color:inherit;text-decoration:none;flex:1">GitHub 仓库 ↗</a></summary></details>
    </div>
  </nav>
</aside>`;
}

/* ---------------- 页面模板 ---------------- */
function page({ title, body, current, desc, toc, doc }) {
  return `<!doctype html><html lang="zh-CN"><head>
<meta charset="utf-8"/>
<meta name="viewport" content="width=device-width,initial-scale=1"/>
<title>${title}</title>
<meta name="description" content="${desc || 'Claude 官方最佳实践的中文译文与知识维基'}"/>
<meta name="theme-color" content="#0a0b0d"/>
<link rel="icon" href="data:image/svg+xml,<svg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 32 32'><rect width='32' height='32' rx='7' fill='%23e0795c'/></svg>"/>
<script>(function(){try{var c=localStorage.getItem('bp-theme')||'auto';var m=window.matchMedia('(prefers-color-scheme: dark)').matches;var t=c==='auto'?(m?'dark':'light'):c;document.documentElement.dataset.theme=t;document.documentElement.dataset.choice=c;}catch(e){}})();</script>
<style>${css}</style></head><body>
<div class="layout">
${nav(current)}
<main>
  ${doc ? '<div id="readbar"><i></i></div>' : ''}
  <div class="topbar">
    <input id="q" type="search" placeholder="搜索概念与文章…" autocomplete="off"/>
    <span class="meta">100 概念 · 173 译文</span>
    ${doc ? `<div class="fontctl" role="group" aria-label="字号">
      <button type="button" data-fs="-1" title="减小字号">A−</button>
      <button type="button" data-fs="0" title="默认字号">A</button>
      <button type="button" data-fs="1" title="放大字号">A+</button>
    </div>` : ''}
    <div class="theme-slot"></div>
    <div id="hits"></div>
  </div>
  ${toc ? `<div class="doc-layout">${body.replace(/^\s*/, '')}<aside class="toc-rail">${toc}</aside></div>` : body}
  <footer>原文版权归 Anthropic PBC 所有 · 非官方中文整理 · <a href="${REPO}">GitHub</a></footer>
</main></div>
<script src="/theme.js" defer></script>
<script>
(function(){
  var root=document.documentElement;
  // 字号
  var FONTS=[15,16,17.5,19];
  var fs=Number(localStorage.getItem('bp-font')||1)||1;
  var applyFs=function(v){fs=Math.max(0,Math.min(FONTS.length-1,v));root.style.setProperty('--doc-font',FONTS[fs]+'px');localStorage.setItem('bp-font',String(fs));
    document.querySelectorAll('.fontctl button').forEach(function(b){b.classList.toggle('on',Number(b.dataset.fs)===0?fs===1:false);});};
  if(document.querySelector('.doc')) applyFs(fs);
  document.querySelectorAll('.fontctl button').forEach(function(b){
    b.addEventListener('click',function(){ var d=Number(b.dataset.fs); applyFs(d===0?1:fs+d); });
  });
  // 阅读进度
  var bar=document.querySelector('#readbar i');
  if(!bar) return;
  var main=document.querySelector('main');
  var scroller=null;
  var nodes=[document.scrollingElement||document.documentElement];
  var update=function(){
    var el=document.scrollingElement||document.documentElement;
    var max=el.scrollHeight-el.clientHeight;
    var pct=max>0?Math.min(100,(el.scrollTop/max)*100):0;
    var doc=document.querySelector('.doc');
    if(doc){var r=doc.getBoundingClientRect();var top=r.top+el.scrollTop;var h=r.height;var seen=(el.scrollTop+el.clientHeight*0.5-top)/h;pct=Math.max(2,Math.min(100,seen*100));}
    bar.style.width=pct.toFixed(1)+'%';
  };
  document.addEventListener('scroll',update,{passive:true});
  window.addEventListener('resize',update);
  update();
})();
</script>
<script>
const q=document.getElementById('q'),hits=document.getElementById('hits');
let idx=null,loading=null,timer=null;
const ensure=async()=>{if(idx)return idx;if(!loading)loading=fetch('/search.json').then(r=>r.json()).then(d=>{idx=d;return d;});return loading;};
q.addEventListener('input',()=>{clearTimeout(timer);const k=q.value.trim().toLowerCase();
  if(!k){hits.style.display='none';return;}
  hits.style.display='block';hits.innerHTML='<a>搜索中…</a>';
  timer=setTimeout(async()=>{const data=await ensure();
    const out=data.map(d=>({d,s:d.t.toLowerCase().includes(k)?0:1})).filter(x=>x.s===0||x.d.x.toLowerCase().includes(k)).sort((a,b)=>a.s-b.s).slice(0,18).map(x=>x.d);
    hits.innerHTML=out.length?out.map(d=>'<a href="'+d.u+'">'+d.t+'<span class="k">'+d.k+'</span></a>').join(''):'<a>没有匹配结果</a>';},120);});
q.addEventListener('keydown',e=>{if(e.key==='Enter'){const a=hits.querySelector('a[href]');if(a)location.href=a.getAttribute('href');}});
document.addEventListener('click',e=>{if(!e.target.closest('#hits')&&e.target!==q)hits.style.display='none';});
</script>
${RENDER_DOCS ? `<script type="module">
import mermaid from 'https://cdn.jsdelivr.net/npm/mermaid@11/dist/mermaid.esm.min.mjs';
const dark = document.documentElement.dataset.theme !== 'light';
mermaid.initialize({ startOnLoad: true, theme: dark ? 'dark' : 'neutral' });
document.addEventListener('themechange', () => location.reload());
</script>` : ''}
</body></html>`;
}

/* ---------------- 链接改写 ---------------- */
function rewrite(mdText, kind) {
  return mdText.replace(/\]\(([^)]+)\)/g, (m, href) => {
    if (/^(https?:|mailto:|#)/.test(href)) return m;
    if (!href.endsWith('.md')) return m;
    const [p, hash] = href.split('#');
    const name = path.basename(p, '.md');
    if (kind === 'wiki') {
      if (p.includes('docs/zh/')) return `](${BLOB}/docs/zh/${p.replace(/^.*docs\/zh\//, '')})`;
      if (!path.dirname(p) || path.dirname(p) === '.') return RENDER_DOCS ? `](/wiki/${name}.html)` : `](${BLOB}/wiki/${name}.md)`;
      return `](${p.replace(/\.md$/, '.html')})`;
    }
    if (p.includes('zh/')) return RENDER_DOCS ? `](/read/${p.replace(/^.*zh\//, '').replace(/\.md$/, '.html')})` : `](${BLOB}/docs/zh/${p.replace(/^.*zh\//, '')})`;
    if (name === 'INDEX') return RENDER_DOCS ? `](/wiki/INDEX.html)` : `](${BLOB}/wiki/INDEX.md)`;
    return `](${p.replace(/\.md$/, '.html')}${hash ? '#' + hash : ''})`;
  });
}

/* ---------------- 生成 ---------------- */
fs.rmSync(SITE, { recursive: true, force: true });
fs.mkdirSync(SITE, { recursive: true });
const search = [];
const write = (file, html) => {
  fs.mkdirSync(path.dirname(path.join(SITE, file)), { recursive: true });
  fs.writeFileSync(path.join(SITE, file), html);
};

/* 首页：用设计稿，链接改到站内索引 */
{
  let h = fs.readFileSync(path.join(SRC, 'landing.html'), 'utf8');
  h = h.replace('target="_blank" rel="noopener">\n          <div class="card"><svg', '>\n          <div class="card"><svg');
  write('index.html', h);
  write('404.html', h.replace('<title>', '<title>404 · '));
}

/* 概念索引 */
{
  headingSeq = 0;
  const blocks = CATS.filter((c) => nodesByCat.get(c)?.length)
    .map((c) => {
      const i = CATS.indexOf(c);
      const rows = nodesByCat.get(c).map((n) => `
        <div class="idx-row">
          <div class="t"><a href="${RENDER_DOCS ? `/wiki/${n.id}.html` : `${BLOB}/wiki/${n.id}.md`}">${n.zh}</a>
            <small>${n.en || ''} · ${n.def || ''}</small></div>
          <div class="m"><b>${n.count}</b> 篇提及</div>
        </div>`).join('');
      return `<section class="cat-block" id="c-${i}">
        <h3>${c}<span>${nodesByCat.get(c).length} 个概念</span></h3>
        ${rows}
      </section>`;
    })
    .join('');
  write('wiki/INDEX.html', page({
    title: '概念索引 · Claude 最佳实践',
    current: 'wiki/INDEX.html',
    desc: '100 个 Claude 最佳实践概念条目，按 11 个分类索引',
    body: `<article>
      <div class="hero-mini"><h1>概念索引</h1>
      <p>${GRAPH.nodes.length} 个概念、${GRAPH.edges.length} 条关系、11 个分类。点任意条目查看完整维基页（摘要 / 关键做法 / 常见误区 / 来源账本）。</p></div>
      ${blocks}</article>`,
  }));
  for (const n of GRAPH.nodes) {
    search.push({ t: n.zh, u: RENDER_DOCS ? `/wiki/${n.id}.html` : `${BLOB}/wiki/${n.id}.md`, k: `概念 · ${n.cat}`, x: `${n.en || ''} ${n.def || ''}` });
  }
}

/* 译文索引 */
{
  const table = (items, id, label) => `
    <section class="cat-block" id="${id}">
      <h3>${label}<span>${items.length} 篇</span></h3>
      ${items.map((i) => `
        <div class="idx-row">
          <div class="t"><a href="${i.url}">${i.titleZh}</a><small>${i.title}</small></div>
          <div class="m">${String(i.date).slice(0, 10)}${i.readTime ? ` · ${i.readTime} min` : ''}</div>
        </div>`).join('')}
    </section>`;
  const arts = readItems.filter((i) => bucketOf(i) === 'articles').sort((a, b) => String(b.date).localeCompare(String(a.date)));
  const guides = readItems.filter((i) => bucketOf(i) === 'guides').sort((a, b) => String(b.date).localeCompare(String(a.date)));
  const webs = readItems.filter((i) => bucketOf(i) === 'webinars').sort((a, b) => String(b.date).localeCompare(String(a.date)));
  write('read/index.html', page({
    title: '中文译文目录 · Claude 最佳实践',
    current: 'read/index.html',
    desc: '173 篇 Claude 官方文章的中文译文目录',
    body: `<article>
      <div class="hero-mini"><h1>中文译文</h1>
      <p>${readItems.filter((i) => i.hasText).length} 篇全文译文，${RENDER_DOCS ? '可站内直接阅读' : '全部指向 GitHub 阅读'}，每篇都保留英文原文链接便于对照。</p></div>
      ${table(arts, 'articles', '文章')}
      ${table(guides, 'guides', '指南')}
      ${table(webs, 'webinars', '网络研讨会')}
    </article>`,
  }));
  for (const i of readItems) {
    if (!i.hasText) continue;
    search.push({ t: i.titleZh, u: i.url, k: `${TYPE_LABEL[i.type]} · ${String(i.date).slice(0, 10)}`, x: `${i.title} ${i.excerpt || ''}` });
  }
}

/* 全文页（站内阅读） */
if (RENDER_DOCS) {
  const slugOf = (rel) => path.basename(rel).replace(/\.md$/, '');

  // 按类型分组的文章顺序（日期倒序），用于上一篇/下一篇
  const ordered = ['articles', 'guides', 'webinars'].map((b) =>
    readItems.filter((i) => i.hasText && bucketOf(i) === b).sort((a, z) => String(z.date).localeCompare(String(a.date))));

  function articleToc(html) {
    const items = [];
    for (const m of html.matchAll(/<h([23]) id="(h-\d+)">([\s\S]*?)<\/h\1>/g)) {
      const text = m[3].replace(/<[^>]+>/g, '').replace(/&amp;/g, '&').trim();
      items.push({ level: Number(m[1]), id: m[2], text });
    }
    if (items.length < 3) return { html: '', items };
    return {
      items,
      html: `<nav class="toc-list"><div class="toc-h">本文目录</div>${items.map((i) => `<a href="#${i.id}" class="${i.level === 3 ? 'lv3' : ''}">${i.text}</a>`).join('')}</nav>`,
    };
  }

  function relatedConcepts(rel) {
    const slug = slugOf(rel);
    const card = CARDS[slug];
    const list = (card?.concepts || []).map((c) => c.zh).filter((z) => nameToId.has(z));
    const uniq = [...new Set(list)].slice(0, 8);
    if (!uniq.length) return '';
    return `<section class="rel-block"><h3>本文涉及的概念</h3><div class="rel-chips">${uniq
      .map((z) => `<a href="/wiki/${nameToId.get(z)}.html">${z}</a>`).join('')}</div></section>`;
  }

  function pager(list, idx) {
    const prev = idx > 0 ? list[idx - 1] : null;
    const next = idx < list.length - 1 ? list[idx + 1] : null;
    if (!prev && !next) return '';
    const cell = (it, dir) => it
      ? `<a class="pager-cell" href="${it.url}"><span>${dir}</span><b>${it.titleZh}</b></a>`
      : '<span class="pager-cell empty"></span>';
    return `<nav class="pager">${cell(prev, '← 上一篇')}${cell(next, '下一篇 →')}</nav>`;
  }

  // 概念页
  for (const f of fs.readdirSync(WIKI).filter((x) => x.endsWith('.md') && x !== 'INDEX.md')) {
    const id = f.replace(/\.md$/, '');
    const src = fs.readFileSync(path.join(WIKI, f), 'utf8');
    const node = byId.get(id);
    headingSeq = 0;
    const rel = GRAPH.edges.filter((e) => e.from === id || e.to === id).length;
    const html = md.render(rewrite(strip(src), 'wiki'));
    const toc = articleToc(html);
    // 来源文章：概念页里的 ../docs/zh/xxx.md 链接
    const sources = [...src.matchAll(/\]\(\.\.\/docs\/zh\/([^)]+)\.md\)/g)].map((m) => m[1]);
    write(`wiki/${id}.html`, page({
      title: `${node?.zh || id} · Claude 最佳实践`,
      current: `wiki/${id}.html`,
      desc: node?.def || '',
      doc: true,
      body: `<article class="doc">
        <div class="meta-line"><span class="tag">概念</span><span class="tag">${node?.cat || ''}</span><span>${node?.en || ''}</span><span>提及 ${node?.count || 0} 篇</span><span>${rel} 条关联</span></div>
        <h1>${node?.zh || id}</h1>
        ${html}
        <p class="doc-foot">来源与引用见上方「来源（Sources）」；原文版权归 Anthropic 所有。</p>
      </article>`,
      toc: toc.html,
    }));
  }

  // 文章页
  for (const list of ordered) {
    list.forEach((i, idx) => {
      headingSeq = 0;
      const html = md.render(rewrite(strip(i.src), 'read'));
      const toc = articleToc(html);
      const srcUrl = manifest.items.find((m) => m.slug === i.slug)?.url || '';
      write(`read/${i.rel.replace(/\.md$/, '.html')}`, page({
        title: `${i.titleZh} · Claude 最佳实践`,
        current: `read/${i.rel.replace(/\.md$/, '.html')}`,
        desc: i.excerpt || '',
        toc: toc.html,
        doc: true,
        body: `<article class="doc">
          <div class="meta-line">
            <span class="tag">${TYPE_LABEL[i.type]}</span>
            <span>${String(i.date).slice(0, 10)}</span>
            ${i.readTime ? `<span>${i.readTime} 分钟</span>` : ''}
            ${(i.products || []).slice(0, 2).map((x) => `<span class="tag">${x}</span>`).join('')}
            ${srcUrl ? `<a href="${srcUrl}" target="_blank" rel="noopener">原文 ↗</a>` : ''}
            <a href="${BLOB}/docs/zh/${i.rel}" target="_blank" rel="noopener">GitHub ↗</a>
          </div>
          <h1>${i.titleZh}</h1>
          <p class="doc-sub">${i.title}</p>
          ${html}
          ${relatedConcepts(i.rel)}
          ${pager(list, idx)}
          <div class="note">本文由模型翻译并经二次校对，产品行为、价格与限制以<a href="${srcUrl}" target="_blank" rel="noopener">英文原文</a>为准。</div>
        </article>`,
      }));
    });
  }
}

/* 可视化页 */
for (const f of ['graph.html', 'mindmap.html', 'mindmap.md', 'knowledge-graph.mmd', 'graph.json']) {
  const p = path.join(ROOT, 'mindmap', f);
  if (fs.existsSync(p)) fs.copyFileSync(p, path.join(SITE, f));
}
fs.copyFileSync(path.join(SRC, 'theme.js'), path.join(SITE, 'theme.js'));
fs.writeFileSync(path.join(SITE, 'search.json'), JSON.stringify(search));

const count = (function walk(d) {
  return fs.readdirSync(d, { withFileTypes: true }).reduce((a, e) => a + (e.isDirectory() ? walk(path.join(d, e.name)) : 1), 0);
})(SITE);
console.log(`site: ${count} files · RENDER_DOCS=${RENDER_DOCS} · search ${search.length} entries`);
