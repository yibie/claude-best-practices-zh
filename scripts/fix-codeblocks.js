// 修复被拍平的代码块（原站是 <pre>，抓取时变成 CODE<lang> + 裸文本）
const fs = require('fs');
const path = require('path');

const ROOT = path.join(__dirname, '..');
const DIRS = ['docs/zh', 'raw'];
const DRY = process.argv.includes('--dry');

const hasCJK = (s) => /[\u4e00-\u9fa5]/.test(s);
const unescapeMd = (s) => s.replace(/\\([\\`*_{}\[\]()#+\-.!<>|])/g, '$1');
const isHeading = (t) => /^#{1,6}\s/.test(t) || /^\|/.test(t) || /^!\[/.test(t) || /^\*\*[^*]+\*\*/.test(t) || /^>/.test(t) || /^-\s|^\d+\.\s/.test(t);

// 像代码：有代码符号，或明显缩进，且不是一句正常散文
function codey(line) {
  const t = line.trim();
  if (!t) return false;
  if (isHeading(t)) return false;
  if (hasCJK(t) && !/[;{}<>]=/.test(t)) return false;             // 中文散文
  if (/^\s{2,}\S/.test(line)) return true;                       // 缩进
  if (/^(?:\/\/|#|\*|--|\$|>)\s?/.test(t)) return true;         // 注释/命令
  const words = t.split(/\s+/).length;
  const proseLike = /[.。!?]$/.test(t) && words >= 8 && !/[{};=<>()[\]]/.test(t);
  if (proseLike) return false;
  if (/^ {2,}\S/.test(line)) return true;
  if (/[;{}]\s*$|=>|\/\/|\bconst\b|\blet\b|\bvar\b|\bfunction\b|\bimport\b|\bexport\b|^\$ |:\s*$|=\s|\w\(/.test(t)) return true;
  if (/^[{[]|^[}\]]/.test(t)) return true;
  if (/^\w+:/.test(t) && words <= 8) return true;
  return false;
}

let files = 0, blocks = 0, skipped = 0;
const report = [];

for (const dir of DIRS) {
  const base = path.join(ROOT, dir);
  if (!fs.existsSync(base)) continue;
  for (const sub of fs.readdirSync(base)) {
    const p = path.join(base, sub);
    if (!fs.statSync(p).isDirectory()) continue;
    for (const f of fs.readdirSync(p).filter((x) => x.endsWith('.md'))) {
      const file = path.join(p, f);
      const src = fs.readFileSync(file, 'utf8');
      if (!/^CODE[A-Za-z]*$/m.test(src)) continue;
      const lines = src.split('\n');
      const out = [];
      let changed = 0;
      for (let i = 0; i < lines.length; i++) {
        const m = lines[i].match(/^CODE([A-Za-z]*)$/);
        if (!m) { out.push(lines[i]); continue; }
        const lang = (m[1] || 'text').toLowerCase().replace('plain', 'text');
        // 跳过紧随其后的空行
        let j = i + 1;
        while (j < lines.length && !lines[j].trim()) j++;
        const body = [];
        let loose = false;
        while (j < lines.length) {
          const line = lines[j];
          if (!line.trim()) {
            // 看下一个非空行是否还是代码
            let k = j + 1;
            while (k < lines.length && !lines[k].trim()) k++;
            if (k < lines.length && codey(lines[k])) { body.push(''); j++; continue; }
            break;
          }
          if (!codey(line)) break;
          body.push(unescapeMd(line.replace(/\s+$/, '')));
          j++;
        }
        if (body.length < 1 && j < lines.length) {
          const cand = lines[j];
          const t = cand.trim();
          const isRule = /^\\?-{3,}$/.test(t) || /^\\?={3,}$/.test(t);
          const shortish = t.length > 0 && t.length < 70 && t.split(/\s+/).length <= 6 && !isHeading(t) && !isRule;
          if (shortish) { body.push(unescapeMd(t)); j++; }
        }
        // 宽松兜底：整段当 text 块，直到空行后出现标题 / 中文 / 长英文散文
        if (body.length < 1 && j < lines.length && !isHeading(lines[j].trim())) {
          let k = j;
          const buf = [];
          while (k < lines.length) {
            const line = lines[k];
            if (!line.trim()) {
              let n = k + 1;
              while (n < lines.length && !lines[n].trim()) n++;
              const nxt = (lines[n] || '').trim();
              const isProse = /[.。]$/.test(nxt) && nxt.split(/\s+/).length >= 12;
              if (n < lines.length && (isHeading(nxt) || hasCJK(nxt) || isProse)) break;
              buf.push('');
              k++;
              continue;
            }
            buf.push(unescapeMd(line.replace(/\s+$/, '')));
            k++;
          }
          if (buf.length) { body.length = 0; body.push(...buf); j = k; loose = true; }
        }

        if (body.length < 1) { out.push(lines[i]); skipped++; report.push({ file: path.relative(ROOT, file), skipped: true, next: (lines[j] || '').slice(0, 70) }); continue; }
        out.push('```' + (lang === 'text' ? 'text' : lang));
        out.push(...body);
        out.push('```');
        changed++;
        blocks++;
        i = j - 1;
        report.push({ file: path.relative(ROOT, file), lang, lines: body.length, loose, first: body[0].slice(0, 60) });
      }
      if (changed && !DRY) fs.writeFileSync(file, out.join('\n'));
      if (changed) files++;
    }
  }
}

fs.writeFileSync(path.join(ROOT, 'data', 'codeblock-repair.json'), JSON.stringify(report, null, 2));
console.log({ files, blocks, skipped, dry: DRY });
for (const r of report.slice(0, 12)) console.log(`${r.file} [${r.lang}] ${r.lines}行 | ${r.first}`);
