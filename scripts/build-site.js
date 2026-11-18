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

const CATS = ['智能体架构', 'Claude Code 与编程', '上下文工程', '工具与扩展', '模型与能力', '评估与验证', '成本与性能', '安全与治理', '企业落地与组织', '产品线与功能', '行业与场景'];
const byId = new Map(GRAPH.nodes.map((n) => [n.id, n]));

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
function page({ title, body, current, desc }) {
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
  <div class="topbar">
    <input id="q" type="search" placeholder="搜索概念与文章…" autocomplete="off"/>
    <span class="meta">100 概念 · 173 译文</span>
    <div class="theme-slot"></div>
    <div id="hits"></div>
  </div>
  ${body}
  <footer>原文版权归 Anthropic PBC 所有 · 非官方中文整理 · <a href="${REPO}">GitHub</a></footer>
</main></div>
<script src="/theme.js" defer></script>
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

/* 全文页（可选） */
if (RENDER_DOCS) {
  for (const f of fs.readdirSync(WIKI).filter((x) => x.endsWith('.md') && x !== 'INDEX.md')) {
    const id = f.replace(/\.md$/, '');
    const src = fs.readFileSync(path.join(WIKI, f), 'utf8');
    const node = byId.get(id);
    headingSeq = 0;
    const rel = GRAPH.edges.filter((e) => e.from === id || e.to === id).length;
    write(`wiki/${id}.html`, page({
      title: `${node?.zh || id} · Claude 最佳实践`,
      current: `wiki/${id}.html`,
      body: `<article><h1>${node?.zh || id}</h1>
        <div class="meta-line"><span class="tag">${node?.cat || ''}</span><span>${node?.en || ''}</span><span>提及 ${node?.count || 0} 篇</span><span>${rel} 条关联</span></div>
        ${md.render(rewrite(strip(src), 'wiki'))}</article>`,
    }));
  }
  for (const i of readItems) {
    if (!i.hasText) continue;
    headingSeq = 0;
    write(`read/${i.rel.replace(/\.md$/, '.html')}`, page({
      title: `${i.titleZh} · Claude 最佳实践`,
      current: `read/${i.rel.replace(/\.md$/, '.html')}`,
      body: `<article><h1>${i.titleZh}</h1>
        <div class="meta-line"><span class="tag">${TYPE_LABEL[i.type]}</span><span>${String(i.date).slice(0, 10)}</span>
        <a href="${i.url.startsWith('http') ? i.url : `${BLOB}/docs/zh/${i.rel}`}" target="_blank">英文原文 ↗</a></div>
        ${md.render(rewrite(strip(i.src), 'read'))}
        <div class="note">本文由模型翻译并二次校对，事实以<a href="${i.hasText ? '' : ''}${manifest.items.find((m) => m.slug === i.slug)?.url || ''}" target="_blank">英文原文</a>为准。</div></article>`,
    }));
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
