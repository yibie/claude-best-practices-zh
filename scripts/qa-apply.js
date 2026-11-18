// 应用第一遍审阅结果：把审校给出的替换片段写回译文
const fs = require('fs');
const path = require('path');

const ROOT = path.join(__dirname, '..');
const ZH = path.join(ROOT, 'docs', 'zh');
const QA = path.join(ROOT, 'data', 'qa', 'translate');
const LOG = path.join(ROOT, 'data', 'qa', 'applied.json');
const APPLY_TYPES = new Set(['误译', '名词错', '术语不一致', '语句不通', '漏译']);
const DRY = process.argv.includes('--dry');

const files = [];
(function walk(d) {
  for (const e of fs.readdirSync(d, { withFileTypes: true })) {
    const p = path.join(d, e.name);
    if (e.isDirectory()) walk(p);
    else if (e.name.endsWith('.json')) files.push(p);
  }
})(QA);

const stats = { files: 0, applied: 0, skipped: 0, notfound: 0 };
const journal = [];
const skipped = [];

for (const f of files) {
  const { rel, issues } = JSON.parse(fs.readFileSync(f, 'utf8'));
  if (!issues?.length) continue;
  const zhPath = path.join(ZH, rel);
  if (!fs.existsSync(zhPath)) continue;
  let text = fs.readFileSync(zhPath, 'utf8');
  let changed = false;

  for (const it of issues) {
    const a = (it.zh || '').trim();
    const b = (it.fix || '').trim();
    if (!a || !b || a === b) { stats.skipped++; continue; }
    if (!APPLY_TYPES.has(it.type)) { stats.skipped++; skipped.push({ rel, reason: 'type', ...it }); continue; }
    if (a.length < 8 || a.includes('```') || b.includes('```')) { stats.skipped++; skipped.push({ rel, reason: 'guard', ...it }); continue; }
    if (b.length > a.length * 2.5 + 20) { stats.skipped++; skipped.push({ rel, reason: 'length', ...it }); continue; }
    const first = text.indexOf(a);
    if (first === -1) { stats.notfound++; skipped.push({ rel, reason: 'notfound', ...it }); continue; }
    if (text.indexOf(a, first + a.length) !== -1) { stats.skipped++; skipped.push({ rel, reason: 'ambiguous', ...it }); continue; }
    text = text.slice(0, first) + b + text.slice(first + a.length);
    stats.applied++;
    changed = true;
    journal.push({ rel, type: it.type, before: a, after: b, note: it.note });
  }

  if (changed && !DRY) fs.writeFileSync(zhPath, text);
  if (changed) stats.files++;
}

fs.writeFileSync(LOG, JSON.stringify(journal, null, 2));
const byType = journal.reduce((a, x) => ((a[x.type] = (a[x.type] || 0) + 1), a), {});
console.log(stats, byType);
console.log('skipped sample', skipped.slice(0, 5).map((s) => `${s.reason}:${s.rel}`).slice(0, 5));
