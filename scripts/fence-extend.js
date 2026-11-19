// 修复：代码围栏过早结束，后续缩进/树形行留在围栏外
const fs = require('fs');
const path = require('path');

const ROOT = path.join(__dirname, '..');
const DIRS = ['docs/zh', 'raw'];

const hasCJK = (s) => /[\u4e00-\u9fa5]/.test(s);
const isContinuation = (line) => {
  const t = line.trim();
  if (!t) return false;
  if (hasCJK(t)) return false;
  if (/^[│├└┌─┬┴┼]/.test(t)) return true;          // 树形
  if (/^\s{2,}\S/.test(line)) return true;          // 缩进
  if (/^[A-Za-z0-9_./\-]+(\s|$)/.test(t) && t.length < 120 && !/[;,.!?]$/.test(t)) return true;
  return false;
};

let fixed = 0;
for (const dir of DIRS) {
  const base = path.join(ROOT, dir);
  if (!fs.existsSync(base)) continue;
  for (const sub of fs.readdirSync(base)) {
    const d = path.join(base, sub);
    if (!fs.statSync(d).isDirectory()) continue;
    for (const f of fs.readdirSync(d).filter((x) => x.endsWith('.md'))) {
      const file = path.join(d, f);
      const lines = fs.readFileSync(file, 'utf8').split('\n');
      const out = [];
      let inFence = false;
      let touched = false;
      for (let i = 0; i < lines.length; i++) {
        const line = lines[i];
        if (/^```/.test(line.trim())) {
          if (!inFence) { inFence = true; out.push(line); continue; }
          // 遇到闭合围栏：看后面是否还有代码续行
          let j = i + 1;
          const extra = [];
          while (j < lines.length && isContinuation(lines[j])) { extra.push(lines[j]); j++; }
          if (extra.length) {
            out.push(...extra);
            out.push(line);
            i = j - 1;
            touched = true;
            fixed++;
            inFence = false;
            continue;
          }
          inFence = false;
          out.push(line);
          continue;
        }
        out.push(line);
      }
      if (touched) fs.writeFileSync(file, out.join('\n'));
    }
  }
}
console.log('extended fences:', fixed);
