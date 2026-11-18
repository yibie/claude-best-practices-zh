// Merge registry, build concept graph (nodes + edges), write data/graph.json
const fs = require('fs');
const path = require('path');

const ROOT = path.join(__dirname, '..');
const cardsDir = path.join(ROOT, 'data', 'cards');
const merge = JSON.parse(fs.readFileSync(path.join(ROOT, 'data', 'merge.json'), 'utf8'));
const reg = JSON.parse(fs.readFileSync(path.join(ROOT, 'data', 'registry.json'), 'utf8'));
const cards = fs.readdirSync(cardsDir).map((f) => JSON.parse(fs.readFileSync(path.join(cardsDir, f), 'utf8')));

// build name -> canonical
const nameToCanon = new Map();
const nodes = new Map();
for (const c of reg) {
  const canon = merge[c.zh] || c.zh;
  if (!nodes.has(canon)) {
    const base = merge[c.zh] ? reg.find((x) => x.zh === merge[c.zh]) : c;
    nodes.set(canon, { ...(base || c), zh: canon, aliases: new Set(), docs: new Map() });
  }
  const n = nodes.get(canon);
  c.aliases.forEach((a) => { n.aliases.add(a); nameToCanon.set(a, canon); });
  for (const d of c.docs) n.docs.set(d.rel, d.def || d.summary);
}

// recompute counts from cards
for (const n of nodes.values()) n.docs = new Map();
for (const card of cards) {
  for (const x of card.concepts || []) {
    const canon = nameToCanon.get(x.zh);
    if (!canon) continue;
    const n = nodes.get(canon);
    if (!n.docs.has(card.rel)) n.docs.set(card.rel, x.def_zh || card.summary_zh || '');
  }
}

// edges from relations（保留方向：自动抽取时 from -> rel -> to 是有语义方向的）
const edges = new Map();
for (const card of cards) {
  for (const r of card.relations || []) {
    const a = nameToCanon.get(r.from), b = nameToCanon.get(r.to);
    if (!a || !b || a === b) continue;
    const rel = String(r.rel || '用于').trim();
    const k = `${a}\u0001${rel}\u0001${b}`;
    if (!edges.has(k)) edges.set(k, { from: a, to: b, rel, w: 0, docs: new Set() });
    const e = edges.get(k);
    e.w++;
    e.docs.add(card.rel);
  }
}
// 同一对概念的正反同名关系只保留更强的那个方向
for (const [k, e] of [...edges]) {
  const rev = `${e.to}\u0001${e.rel}\u0001${e.from}`;
  const r = edges.get(rev);
  if (r && r.w > e.w) edges.delete(k);
  else if (r && r.w === e.w) edges.delete(rev);
}

const idOf = (zh) => zh.replace(/[\/\\:*?"<>|.\s]+/g, '-').replace(/^-|-$/g, '');
const out = {
  generatedAt: new Date().toISOString(),
  source: 'https://claude.com/resources/best-practices',
  categories: [...new Set([...nodes.values()].map((n) => n.cat))],
  nodes: [...nodes.values()]
    .map((n) => ({
      id: idOf(n.zh), zh: n.zh, en: n.en, cat: n.cat, kind: n.kind,
      def: n.def_zh || n.docs.values().next().value || '',
      count: n.docs.size, docs: [...n.docs.keys()].sort(),
      aliases: [...n.aliases],
    }))
    .filter((n) => n.count > 0)
    .sort((a, b) => b.count - a.count),
  edges: [...edges.values()]
    .filter((e) => e.w >= 1)
    .map((e) => ({ from: idOf(e.from), to: idOf(e.to), rel: e.rel, w: e.w, docs: e.docs.size }))
    .sort((a, b) => b.w - a.w),
};
fs.writeFileSync(path.join(ROOT, 'data', 'graph.json'), JSON.stringify(out, null, 2));
console.log('nodes', out.nodes.length, 'edges', out.edges.length);
console.log(out.nodes.filter((n) => n.count >= 3).map((n) => `${n.count}\t${n.cat}\t${n.zh}`).join('\n'));
