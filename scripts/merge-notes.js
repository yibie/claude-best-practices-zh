// 把 edge-notes.json 里的解释与摘录合并进 graph.json
const fs = require('fs');
const path = require('path');
const ROOT = path.join(__dirname, '..');
const GRAPH = path.join(ROOT, 'data', 'graph.json');
const NOTES = path.join(ROOT, 'data', 'qa', 'edge-notes.json');
const graph = JSON.parse(fs.readFileSync(GRAPH, 'utf8'));
const notes = JSON.parse(fs.readFileSync(NOTES, 'utf8'));
let n = 0;
for (const e of graph.edges) {
  const hit = notes[`${e.from}|${e.to}`] || notes[`${e.to}|${e.from}`];
  if (hit && (hit.note || hit.quote)) {
    e.note = hit.note;
    if (hit.quote) e.quote = hit.quote;
    n++;
  }
}
fs.writeFileSync(GRAPH, JSON.stringify(graph, null, 2));
console.log('edges with notes', n, '/', graph.edges.length);
