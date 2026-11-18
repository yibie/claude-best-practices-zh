// 生成可部署的静态站点（site/）
const fs = require('fs');
const path = require('path');
const MarkdownIt = require('markdown-it');

const ROOT = path.join(__dirname, '..');
const SITE = path.join(ROOT, 'site');
const WIKI = path.join(ROOT, 'wiki');
const DOCS = path.join(ROOT, 'docs', 'zh');
const graph = JSON.parse(fs.readFileSync(path.join(ROOT, 'data', 'graph.json'), 'utf8'));
const manifest = JSON.parse(fs.readFileSync(path.join(ROOT, 'manifest.json'), 'utf8'));

const CATS = ['智能体架构', 'Claude Code 与编程', '上下文工程', '工具与扩展', '模型与能力', '评估与验证', '成本与性能', '安全与治理', '企业落地与组织', '产品线与功能', '行业与场景'];
const byId = new Map(graph.nodes.map((n) => [n.id, n]));

const md = new MarkdownIt({ html: true, linkify: true, breaks: false });
let headingSeq = 0;
md.renderer.rules.fence = (tokens, idx) => {
  const t = tokens[idx];
  if (t.info.trim().startsWith('mermaid')) return `<pre class="mermaid">${md.utils.escapeHtml(t.content)}</pre>`;
  return `<pre class="code"><code>${md.utils.escapeHtml(t.content)}</code></pre>`;
};
md.renderer.rules.heading_open = (tokens, idx) => {
  const id = `h-${++headingSeq}`;
  tokens[idx].attrSet('id', id);
  return `<${tokens[idx].tag} id="${id}">`;
};

const strip = (s) => s.replace(/^---[\s\S]*?---/, '').replace(/^\s*#\s+.*\n/, '');
const fm = (s, k) => {
  const m = s.match(new RegExp(`^${k}:\\s*(.*)$`, 'm'));
  if (!m) return '';
  return m[1].replace(/^["']|["']$/g, '');
};

/* ---------- 导航 ---------- */
const nodesByCat = new Map(CATS.map((c) => [c, []]));
for (const n of graph.nodes) (nodesByCat.get(n.cat) || nodesByCat.set(n.cat, []).get(n.cat)).push(n);
for (const arr of nodesByCat.values()) arr.sort((a, b) => b.count - a.count);

const bucketOf = (it) => (it.type === 'blogPost' ? 'articles' : it.type === 'guide' ? 'guides' : 'webinars');
const typeLabel = { blogPost: '文章', guide: '指南', webinar: '网络研讨会' };

const readItems = manifest.items.map((it) => {
  const rel = `${bucketOf(it)}/${it.slug}.md`;
  const p = path.join(DOCS, rel);
  const titleZh = fs.existsSync(p) ? fm(fs.readFileSync(p, 'utf8'), 'title') || it.title : it.title;
  return { ...it, rel, titleZh, hasText: fs.existsSync(p) };
});

function nav(current) {
  const is = (p) => (current === p ? ' class="active"' : '');
  const conceptLinks = CATS.filter((c) => nodesByCat.get(c)?.length)
    .map((c) => {
      const arr = nodesByCat.get(c);
      const open = arr.some((n) => current === `wiki/${n.id}.html`);
      return `<details${open ? ' open' : ''}><summary>${c}<span>${arr.length}</span></summary><ul>${arr.slice(0, 14).map((n) => `<li${current === `wiki/${n.id}.html` ? ' class="on"' : ''}><a href="/wiki/${n.id}.html">${n.zh}</a></li>`).join('')}${arr.length > 14 ? `<li><a href="/wiki/INDEX.html" style="color:#6f7b8f">查看全部 ${arr.length} 个 →</a></li>` : ''}</ul></details>`;
    })
    .join('');
  const readLinks = ['articles', 'guides', 'webinars']
    .map((b) => {
      const items = readItems.filter((i) => bucketOf(i) === b && i.hasText);
      const open = items.some((i) => current === `read/${b}/${i.slug}.html`);
      return `<details${open ? ' open' : ''}><summary>${typeLabel[b === 'articles' ? 'blogPost' : b === 'guides' ? 'guide' : 'webinar']}<span>${items.length}</span></summary><ul>${items.slice(0, 12).map((i) => `<li${current === `read/${b}/${i.slug}.html` ? ' class="on"' : ''}><a href="/read/${b}/${i.slug}.html">${i.titleZh}</a></li>`).join('')}${items.length > 12 ? `<li><a href="/read/index.html" style="color:#6f7b8f">查看全部 ${items.length} 篇 →</a></li>` : ''}</ul></details>`;
    })
    .join('');
  return `<aside class="side">
  <a class="brand" href="/"><b>Claude 最佳实践</b><span>中文知识库</span></a>
  <div class="quick">
    <a href="/graph.html">知识图谱 ↗</a>
    <a href="/mindmap.html">思维导图 ↗</a>
  </div>
  <nav class="nav">
    <div class="group"><div class="glabel">概念维基</div>${conceptLinks}</div>
    <div class="group"><div class="glabel">中文译文</div>${readLinks}</div>
  </nav>
</aside>`;
}

/* ---------- 页面模板 ---------- */
const css = `
:root{--bg:#0b0e13;--panel:#0f141c;--line:#1e2734;--fg:#e6ebf3;--muted:#8a94a6;--accent:#e0795c}
*{box-sizing:border-box}
html{scroll-behavior:smooth}
body{margin:0;background:var(--bg);color:var(--fg);font:16px/1.75 -apple-system,BlinkMacSystemFont,"PingFang SC","Segoe UI",sans-serif}
a{color:#7fa6ff;text-decoration:none}
a:hover{text-decoration:underline}
.layout{display:flex;min-height:100vh}
.side{width:280px;flex:0 0 280px;border-right:1px solid var(--line);background:#0a0e14;position:sticky;top:0;height:100vh;overflow:auto;padding-bottom:40px}
.brand{display:block;padding:18px 20px 10px;border-bottom:1px solid var(--line)}
.brand b{display:block;font-size:15px;color:#fff;letter-spacing:.01em}
.brand span{font-size:12px;color:var(--muted)}
.quick{display:flex;gap:8px;padding:12px 16px;border-bottom:1px solid var(--line)}
.quick a{font-size:12px;color:#c3ccdb;background:#121823;border:1px solid var(--line);border-radius:8px;padding:4px 9px}
.quick a:hover{border-color:#3b4a63;text-decoration:none;color:#fff}
.nav{padding:10px 12px}
.group{margin-bottom:14px}
.glabel{font-size:11px;letter-spacing:.14em;color:#5f6b7f;text-transform:uppercase;padding:6px 8px}
details{margin:1px 0}
summary{cursor:pointer;padding:5px 8px;border-radius:6px;font-size:13px;color:#c9d3e2;display:flex;justify-content:space-between;gap:8px;list-style:none}
summary::-webkit-details-marker{display:none}
summary:hover{background:#121823}
summary span{color:#5f6b7f;font-size:11px}
details ul{list-style:none;margin:2px 0 6px;padding:0 0 0 8px;border-left:1px solid var(--line)}
details li a{display:block;padding:3px 8px;font-size:12.5px;color:#9aa6b8;border-radius:5px;line-height:1.45}
details li a:hover{background:#121823;color:#e6ebf3;text-decoration:none}
details li.on a{color:#fff;background:#18202e}
main{flex:1;min-width:0;display:flex;flex-direction:column}
.topbar{position:sticky;top:0;z-index:20;display:flex;align-items:center;gap:14px;padding:10px 28px;background:rgba(11,14,19,.9);backdrop-filter:blur(8px);border-bottom:1px solid var(--line)}
.topbar input{flex:1;max-width:460px;background:#11161f;border:1px solid var(--line);border-radius:9px;color:var(--fg);padding:7px 12px;font-size:13px;outline:none}
.topbar input:focus{border-color:#3b4a63}
.topbar .meta{margin-left:auto;font-size:12px;color:var(--muted);white-space:nowrap}
#hits{position:absolute;top:52px;left:28px;width:520px;max-height:60vh;overflow:auto;background:#0f141c;border:1px solid var(--line);border-radius:12px;display:none;z-index:30}
#hits a{display:block;padding:9px 14px;border-bottom:1px solid rgba(255,255,255,.04);color:#dbe3ef;font-size:13px}
#hits a:hover{background:#141b26;text-decoration:none}
#hits .k{color:var(--muted);font-size:11px;display:block}
article{max-width:820px;padding:38px 28px 90px;margin:0 auto;width:100%}
article h1{font-size:31px;line-height:1.3;margin:0 0 10px;letter-spacing:-.01em}
article h2{font-size:21px;margin:38px 0 12px;padding-top:10px;border-top:1px solid rgba(255,255,255,.06)}
article h3{font-size:17px;margin:26px 0 8px}
article p{margin:12px 0}
article ul,article ol{padding-left:22px}
article li{margin:5px 0}
article blockquote{margin:16px 0;padding:10px 16px;border-left:2px solid var(--accent);background:#11161f;color:#c3ccdb;border-radius:0 8px 8px 0}
article code{background:#151c27;padding:1px 5px;border-radius:4px;font-size:13.5px;font-family:ui-monospace,SFMono-Regular,Menlo,monospace}
article pre{margin:16px 0;background:#0e141d;border:1px solid var(--line);border-radius:10px;padding:14px 16px;overflow:auto}
article pre code{background:none;padding:0;font-size:13px;line-height:1.6}
article table{width:100%;border-collapse:collapse;margin:16px 0;font-size:14px;display:block;overflow:auto}
article th,article td{border:1px solid var(--line);padding:7px 11px;text-align:left;vertical-align:top}
article th{background:#121823;font-weight:600}
article img{max-width:100%;border-radius:8px;margin:14px 0;border:1px solid var(--line)}
article hr{border:none;border-top:1px solid var(--line);margin:28px 0}
.meta-line{color:var(--muted);font-size:13px;margin-bottom:22px;display:flex;gap:14px;flex-wrap:wrap;align-items:center}
.tag{font-size:11.5px;color:#c3ccdb;border:1px solid var(--line);border-radius:999px;padding:1px 9px;background:#121823}
.mermaid{background:#0e141d;border:1px solid var(--line);border-radius:10px;padding:16px;margin:16px 0;text-align:center;overflow:auto}
.note{font-size:13px;color:var(--muted);background:#101620;border:1px solid var(--line);border-radius:10px;padding:10px 14px;margin:14px 0}
footer{padding:18px 28px;border-top:1px solid var(--line);color:var(--muted);font-size:12px;text-align:center}
@media(max-width:900px){.side{display:none}.topbar .meta{display:none}article{padding:24px 18px 80px}}
`;

function page({ title, body, current, meta, bare }) {
  if (bare) return body;
  return `<!doctype html><html lang="zh-CN"><head><meta charset="utf-8"/>
<meta name="viewport" content="width=device-width,initial-scale=1"/>
<title>${title}</title>
<meta name="description" content="Claude 官方最佳实践的中文译文与知识维基"/>
<link rel="icon" href="data:image/svg+xml,<svg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 100 100'><text y='.9em' font-size='90'>🧭</text></svg>"/>
<style>${css}</style></head><body>
<div class="layout">
${nav(current)}
<main>
  <div class="topbar">
    <input id="q" type="search" placeholder="搜索概念与文章…" autocomplete="off"/>
    <span class="meta">100 个概念 · 173 篇译文</span>
    <div id="hits"></div>
  </div>
  ${body}
  <footer>原文版权归 Anthropic PBC 所有 · 本页为非官方中文整理 · <a href="https://github.com/yibie/claude-best-practices-zh">GitHub</a></footer>
</main></div>
<script>
const q=document.getElementById('q'),hits=document.getElementById('hits');
let idx=null;
q.addEventListener('focus',async()=>{ if(!idx){ idx=await (await fetch('/search.json')).json(); } });
q.addEventListener('input',()=>{
  const k=q.value.trim().toLowerCase();
  if(!k||!idx){hits.style.display='none';return;}
  const out=idx.filter(d=>d.t.toLowerCase().includes(k)||d.x.toLowerCase().includes(k)).slice(0,18);
  hits.innerHTML=out.length?out.map(d=>'<a href="'+d.u+'"><b>'+d.t+'</b><span class="k">'+d.k+'</span></a>').join(''):'<a>没有匹配结果</a>';
  hits.style.display='block';
});
document.addEventListener('click',e=>{ if(!e.target.closest('#hits')&&e.target!==q) hits.style.display='none'; });
</script>
<script type="module">
import mermaid from 'https://cdn.jsdelivr.net/npm/mermaid@11/dist/mermaid.esm.min.mjs';
mermaid.initialize({ startOnLoad: true, theme: 'dark', themeVariables: { background: '#0e141d', primaryColor: '#1b2433', primaryTextColor: '#e6ebf3', lineColor: '#4a5a75', fontFamily: '-apple-system,PingFang SC,sans-serif' } });
</script>
</body></html>`;
}

/* ---------- 链接改写 ---------- */
function rewrite(mdText, { base, kind }) {
  return mdText.replace(/\]\(([^)]+)\)/g, (m, href) => {
    if (/^(https?:|mailto:|#)/.test(href)) return m;
    if (href.endsWith('.md')) {
      const [p, hash] = href.split('#');
      const name = path.basename(p, '.md');
      const dir = path.dirname(p);
      let target;
      if (kind === 'wiki') {
        if (dir.startsWith('..') && p.includes('docs/zh/')) {
          const rel = p.replace(/^.*docs\/zh\//, '');
          target = `/read/${rel.replace(/\.md$/, '.html')}`;
        } else if (!dir || dir === '.') {
          target = `/wiki/${name}.html`;
        } else target = p.replace(/\.md$/, '.html');
      } else {
        // 译文页 / 索引页
        if (p.includes('zh/')) target = `/read/${p.replace(/^.*zh\//, '').replace(/\.md$/, '.html')}`;
        else if (name === 'INDEX' || p.includes('wiki/')) target = `/wiki/${path.basename(p).replace(/\.md$/, '')}.html`;
        else target = p.replace(/\.md$/, '.html');
      }
      return `](${target}${hash ? '#' + hash : ''})`;
    }
    return m;
  });
}

/* ---------- 渲染 ---------- */
fs.rmSync(SITE, { recursive: true, force: true });
fs.mkdirSync(path.join(SITE, 'wiki'), { recursive: true });
fs.mkdirSync(path.join(SITE, 'read'), { recursive: true });
const search = [];

function writePage(file, html) {
  fs.mkdirSync(path.dirname(path.join(SITE, file)), { recursive: true });
  fs.writeFileSync(path.join(SITE, file), html);
}

// 概念页
for (const f of fs.readdirSync(WIKI).filter((x) => x.endsWith('.md') && x !== 'INDEX.md')) {
  const id = f.replace(/\.md$/, '');
  const src = fs.readFileSync(path.join(WIKI, f), 'utf8');
  const node = byId.get(id);
  headingSeq = 0;
  const body = md.render(rewrite(strip(src), { base: '/wiki/', kind: 'wiki' }));
  const rel = (graph.edges || []).filter((e) => e.from === id || e.to === id).length;
  writePage(`wiki/${id}.html`, page({
    title: `${node?.zh || id} · Claude 最佳实践知识库`,
    current: `wiki/${id}.html`,
    body: `<article><h1>${node?.zh || id}</h1>
      <div class="meta-line"><span class="tag">${node?.cat || ''}</span><span>${node?.en || ''}</span><span>提及 ${node?.count || 0} 篇</span><span>${rel} 条关联</span></div>
      ${body}</article>`,
  }));
  search.push({ t: node?.zh || id, u: `/wiki/${id}.html`, k: `概念 · ${node?.cat || ''}`, x: (node?.def || '') + ' ' + strip(src).slice(0, 400) });
}

// wiki 索引
{
  const src = fs.readFileSync(path.join(WIKI, 'INDEX.md'), 'utf8');
  headingSeq = 0;
  const body = md.render(rewrite(src, { base: '/wiki/', kind: 'wiki' }));
  writePage('wiki/INDEX.html', page({
    title: '概念索引 · Claude 最佳实践知识库', current: 'wiki/INDEX.html',
    body: `<article><h1>概念索引</h1><div class="meta-line"><span>${graph.nodes.length} 个概念</span><span>${graph.edges.length} 条关系</span><span>11 个分类</span></div>${body}</article>`,
  }));
  search.push({ t: '概念索引', u: '/wiki/INDEX.html', k: '索引', x: '全部概念的分类清单' });
}

// 译文页
for (const it of readItems) {
  if (!it.hasText) continue;
  const src = fs.readFileSync(path.join(DOCS, it.rel), 'utf8');
  headingSeq = 0;
  const body = md.render(rewrite(strip(src), { base: '/read/', kind: 'read' }));
  writePage(`read/${it.rel.replace(/\.md$/, '.html')}`, page({
    title: `${it.titleZh} · Claude 最佳实践`,
    current: `read/${it.rel.replace(/\.md$/, '.html')}`,
    body: `<article><h1>${it.titleZh}</h1>
      <div class="meta-line"><span class="tag">${typeLabel[it.type] || it.type}</span><span>${String(it.date).slice(0, 10)}</span>${(it.products || []).map((p) => `<span class="tag">${p}</span>`).join('')}
      <a href="${it.url}" target="_blank">阅读英文原文 ↗</a> <a href="https://github.com/yibie/claude-best-practices-zh/blob/main/raw/${it.rel}" target="_blank">原文快照 ↗</a></div>
      ${body}
      <div class="note">本文由模型翻译并经二次校对，产品行为、价格与限制以<a href="${it.url}" target="_blank">英文原文</a>为准。</div></article>`,
  }));
  search.push({ t: it.titleZh, u: `/read/${it.rel.replace(/\.md$/, '.html')}`, k: `${typeLabel[it.type]} · ${String(it.date).slice(0, 10)}`, x: `${it.title} ${it.excerpt || ''}`.slice(0, 500) });
}

// 译文索引
{
  const src = fs.readFileSync(path.join(ROOT, 'docs', 'README.md'), 'utf8');
  headingSeq = 0;
  const body = md.render(rewrite(src, { base: '/read/', kind: 'read' }));
  writePage('read/index.html', page({ title: '译文目录 · Claude 最佳实践', current: 'read/index.html', body: `<article><h1>中文译文目录</h1>${body.replace(/^<h1>.*?<\/h1>/, '')}</article>` }));
  search.push({ t: '译文目录', u: '/read/index.html', k: '索引', x: '全部中文译文的目录' });
}

// 可视化页
const graphHtml = fs.readFileSync(path.join(ROOT, 'mindmap', 'graph.html'), 'utf8');
writePage('graph.html', graphHtml.replace(/href="https:\/\/github.com/g, 'target="_blank" href="https://github.com'));
for (const f of ['mindmap.html', 'mindmap.md', 'knowledge-graph.mmd', 'graph.json']) {
  const p = path.join(ROOT, 'mindmap', f);
  if (fs.existsSync(p)) fs.copyFileSync(p, path.join(SITE, f));
}
// 思维导图页：把固定的 #mm 样式与独立页面一起复制
writePage('mindmap.html', fs.readFileSync(path.join(ROOT, 'mindmap', 'mindmap.html'), 'utf8'));

// 首页
{
  const total = readItems.filter((i) => i.hasText).length;
  const body = `<article style="max-width:960px">
  <h1>Claude 最佳实践 · 中文知识库</h1>
  <p style="color:#8a94a6;font-size:17px">把 claude.com 资源库的 ${manifest.items.length} 条官方内容抓取、翻译，再按 LLM Wiki 方式拆成原子概念与关系网。</p>
  <div style="display:grid;grid-template-columns:repeat(auto-fit,minmax(140px,1fr));gap:12px;margin:26px 0">
    ${[['231', '官方资源'], [total, '篇全文译文'], [graph.nodes.length, '个概念'], [graph.edges.length, '条关系'], ['95 万', '中文字数']].map(([a, b]) => `<div style="background:#0f141c;border:1px solid #1e2734;border-radius:12px;padding:14px 16px"><b style="display:block;font-size:24px">${a}</b><span style="color:#8a94a6;font-size:12px">${b}</span></div>`).join('')}
  </div>
  <div style="display:grid;grid-template-columns:repeat(auto-fit,minmax(260px,1fr));gap:14px">
    ${[['/graph.html', '交互式知识图谱', '按分类聚类的力导向图，悬停高亮关联，点节点看定义。'],
       ['/mindmap.html', '思维导图', '按 11 个分类折叠展开的层级导图。'],
       ['/wiki/INDEX.html', '概念维基', '100 个原子条目：摘要、做法、误区、来源账本。'],
       ['/read/index.html', '中文译文', '173 篇全文译文，每篇都链回英文原文。']]
      .map(([u, t, d]) => `<a href="${u}" style="display:block;background:#0f141c;border:1px solid #1e2734;border-radius:14px;padding:18px 20px;color:inherit"><b style="font-size:15px">${t} →</b><p style="margin:6px 0 0;color:#8a94a6;font-size:13px;line-height:1.6">${d}</p></a>`).join('')}
  </div>
  <div class="note" style="margin-top:26px">内容经 DeepSeek 审校：译文逐篇对照原文修订，概念关系重新判定方向与去噪。原文版权归 Anthropic PBC 所有。</div>
</article>`;
  writePage('index.html', page({ title: 'Claude 最佳实践 · 中文知识库', current: '', body }));
}

fs.writeFileSync(path.join(SITE, 'search.json'), JSON.stringify(search));
console.log('pages', search.length, 'site size', Math.round(fs.readdirSync(SITE).length), 'entries');
