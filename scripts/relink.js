// 用审阅后的关系重建每个概念页的「相关概念」与「知识图谱」区块（保留正文）
const fs = require('fs');
const path = require('path');

const ROOT = path.join(__dirname, '..');
const WIKI = path.join(ROOT, 'wiki');
const graph = JSON.parse(fs.readFileSync(path.join(ROOT, 'data', 'graph.json'), 'utf8'));
const byId = new Map(graph.nodes.map((n) => [n.id, n]));

const adj = new Map();
for (const e of graph.edges) {
  (adj.get(e.from) || adj.set(e.from, []).get(e.from)).push({ other: e.to, rel: e.rel, w: e.w, dir: 'out' });
  (adj.get(e.to) || adj.set(e.to, []).get(e.to)).push({ other: e.from, rel: e.rel, w: e.w, dir: 'in' });
}

const IN_PHRASE = { 启用: '由「%s」启用', 依赖: '被「%s」依赖', 解决: '由「%s」解决', 替代: '可被「%s」替代', 属于: '包含「%s」', 衡量: '由「%s」衡量', 风险: '受「%s」风险影响', 用于: '被「%s」使用' };
const phrases = (rel, dir, x) => (dir === 'out' ? `${rel}「${x}」` : (IN_PHRASE[rel] || '与「%s」相关').replace('%s', x));

const files = fs.readdirSync(WIKI).filter((f) => f.endsWith('.md') && f !== 'INDEX.md');
let updated = 0;

for (const f of files) {
  const id = f.replace(/\.md$/, '');
  const p = path.join(WIKI, f);
  let text = fs.readFileSync(p, 'utf8');

  // 保留旧的解释句（相同邻居复用）
  const oldBullets = new Map();
  const relatedBlock = text.match(/## 相关概念\n([\s\S]*?)(?=\n## |$)/);
  if (relatedBlock) {
    for (const m of relatedBlock[1].matchAll(/^- \[([^\]]+)\]\(([^)]+)\.md\)\s*——\s*(.+)$/gm)) {
      oldBullets.set(decodeURI(m[2]), `—— ${m[3].trim()}`);
    }
  }

  const rels = (adj.get(id) || []).sort((a, b) => b.w - a.w || a.other.localeCompare(b.other)).slice(0, 7);
  const seen = new Set();
  const lines = [];
  for (const r of rels) {
    if (seen.has(r.other)) continue;
    seen.add(r.other);
    const other = byId.get(r.other);
    if (!other) continue;
    const phrase = oldBullets.get(r.other) || `—— ${phrases(r.rel || '用于', r.dir, other.zh)}`;
    lines.push(`- [${other.zh}](${other.id}.md) ${phrase}`);
  }
  const relatedMd = `## 相关概念\n\n${lines.join('\n')}\n`;
  if (relatedBlock) text = text.replace(relatedBlock[0], relatedMd + '\n');
  else text = text.replace(/\n## 知识图谱/, `\n${relatedMd}\n## 知识图谱`);

  // 重建 Mermaid（保留方向）
  const mermaid = ['```mermaid', 'graph LR', `  C["${byId.get(id)?.zh || id}"]`]
    .concat(rels.slice(0, 6).map((r, i) => r.dir === 'out'
      ? `  C -->|${r.rel}| N${i}["${byId.get(r.other)?.zh || r.other}"]`
      : `  N${i}["${byId.get(r.other)?.zh || r.other}"] -->|${r.rel}| C`))
    .concat(['```'])
    .join('\n');
  text = text.replace(/```mermaid\n[\s\S]*?```/, mermaid);

  fs.writeFileSync(p, text);
  updated++;
}
console.log('updated', updated);
