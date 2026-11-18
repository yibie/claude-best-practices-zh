// 站点构建（轻量）：只产出首页 + 两个可视化页，正文全部链接到 GitHub
const fs = require('fs');
const path = require('path');

const ROOT = path.join(__dirname, '..');
const SITE = path.join(ROOT, 'site');
const SRC = path.join(ROOT, 'site-src');

fs.rmSync(SITE, { recursive: true, force: true });
fs.mkdirSync(SITE, { recursive: true });

// 首页：设计稿原样发布
fs.copyFileSync(path.join(SRC, 'landing.html'), path.join(SITE, 'index.html'));

// 可视化页 + 数据
for (const f of ['graph.html', 'mindmap.html', 'mindmap.md', 'knowledge-graph.mmd', 'graph.json']) {
  const p = path.join(ROOT, 'mindmap', f);
  if (fs.existsSync(p)) fs.copyFileSync(p, path.join(SITE, f));
}

// 404 也回到首页
fs.copyFileSync(path.join(SRC, 'landing.html'), path.join(SITE, '404.html'));

console.log('site built:', fs.readdirSync(SITE).join(', '));
