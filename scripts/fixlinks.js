// Rewrite [[wikilinks]] to real markdown links + append backlinks section
const fs = require('fs');
const path = require('path');

const ROOT = path.join(__dirname, '..');
const WIKI = path.join(ROOT, 'wiki');
const graph = JSON.parse(fs.readFileSync(path.join(ROOT, 'data', 'graph.json'), 'utf8'));
const nameToId = new Map();
for (const n of graph.nodes) {
  nameToId.set(n.zh, n.id);
  for (const a of n.aliases || []) if (!nameToId.has(a)) nameToId.set(a, n.id);
}

const idToZh = new Map(graph.nodes.map((n) => [n.id, n.zh]));
const files = fs.readdirSync(WIKI).filter((f) => f.endsWith('.md') && f !== 'INDEX.md');
let converted = 0, unresolved = new Set();

for (const f of files) {
  const p = path.join(WIKI, f);
  let t = fs.readFileSync(p, 'utf8');
  // drop previous backlinks block (last section)
  t = t.replace(/\n## 反向链接（Backlinks）[\s\S]*$/, '');
  t = t.replace(/\[\[([^\]|]+)(?:\|([^\]]+))?\]\]/g, (m, target, label) => {
    const id = nameToId.get(target.trim());
    if (!id) { unresolved.add(target.trim()); return label || target; }
    converted++;
    return `[${label || target}](${id}.md)`;
  });
  fs.writeFileSync(p, t);
}

// backlinks
const idToFile = new Map(files.map((f) => [f.replace(/\.md$/, ''), f]));
const inbound = new Map();
for (const f of files) {
  const t = fs.readFileSync(path.join(WIKI, f), 'utf8');
  const me = f.replace(/\.md$/, '');
  for (const m of t.matchAll(/\]\(([^)]+)\.md\)/g)) {
    const target = decodeURI(m[1].replace(/^\.\//, ''));
    if (target === me || !idToFile.has(target)) continue;
    if (!inbound.has(target)) inbound.set(target, new Set());
    inbound.get(target).add(me);
  }
}
let withBack = 0;
for (const f of files) {
  const me = f.replace(/\.md$/, '');
  const p = path.join(WIKI, f);
  let t = fs.readFileSync(p, 'utf8').trimEnd();
  const already = new Set([...t.matchAll(/\]\(([^)]+)\.md\)/g)].map((m) => decodeURI(m[1])));
  const inb = [...(inbound.get(me) || [])].filter((x) => !already.has(x));
  if (!inb.length) continue;
  t += `\n\n## 反向链接（Backlinks）\n\n${inb.map((x) => `- [${idToZh.get(x) || x}](${x}.md)`).join('\n')}\n`;
  fs.writeFileSync(p, t);
  withBack++;
}
console.log('converted wikilinks', converted, 'backlink pages', withBack, 'unresolved', [...unresolved].slice(0, 10));
