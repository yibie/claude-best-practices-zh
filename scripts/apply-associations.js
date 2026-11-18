// 把第二遍审阅的操作应用到 data/graph.json
const fs = require('fs');
const path = require('path');

const ROOT = path.join(__dirname, '..');
const GRAPH = path.join(ROOT, 'data', 'graph.json');
const graph = JSON.parse(fs.readFileSync(GRAPH, 'utf8'));
const ops = JSON.parse(fs.readFileSync(path.join(ROOT, 'data', 'qa', 'associations.json'), 'utf8'));
if (graph.reviewed && !process.argv.includes('--force')) {
  console.log('graph.json 已经应用过审阅结果，跳过（需要重跑请加 --force）');
  process.exit(0);
}
const byZh = new Map(graph.nodes.map((n) => [n.zh, n]));

const idOf = (zh) => byZh.get(zh)?.id;
const key = (e) => `${e.from}|${e.rel}|${e.to}`;
let edges = graph.edges.slice();
const before = edges.length;
const log = { remove: 0, flip: 0, add: 0, missing: 0, dup: 0 };

// 1) remove
for (const r of ops.remove || []) {
  const f = idOf(r.from), t = idOf(r.to);
  if (!f || !t) { log.missing++; continue; }
  const n = edges.length;
  edges = edges.filter((e) => !((e.from === f && e.to === t) || (e.from === t && e.to === f)));
  if (edges.length < n) log.remove++;
}
// 2) flip
for (const r of ops.flip || []) {
  const f = idOf(r.from), t = idOf(r.to);
  if (!f || !t) { log.missing++; continue; }
  const e = edges.find((x) => x.from === f && x.to === t);
  if (!e) { log.missing++; continue; }
  e.from = t; e.to = f;
  if (r.rel) e.rel = r.rel;
  log.flip++;
}
// 3) add
for (const r of ops.add || []) {
  const f = idOf(r.from), t = idOf(r.to);
  if (!f || !t || f === t) { log.missing++; continue; }
  if (edges.some((e) => e.from === f && e.to === t)) { log.dup++; continue; }
  edges.push({ from: f, to: t, rel: r.rel || '用于', w: 2, docs: [], qa: true });
  log.add++;
}
// 4) 同一对概念只保留权重最高的一条，避免双向重复标签
const best = new Map();
for (const e of edges) {
  const pair = [e.from, e.to].sort().join('\u0001');
  const cur = best.get(pair);
  if (!cur || e.w > cur.w) best.set(pair, e);
}
const filtered = [...best.values()];
log.dup += edges.length - filtered.length;
edges = filtered;

graph.edges = edges.sort((a, b) => b.w - a.w);
graph.generatedAt = new Date().toISOString();
graph.reviewed = { model: 'deepseek-v4-pro', at: new Date().toISOString().slice(0, 10), ops: log };
fs.writeFileSync(GRAPH, JSON.stringify(graph, null, 2));
console.log({ before, after: graph.edges.length, ...log });
