// 让 deepseek-flash 生成落地页设计候选
const fs = require('fs');
const path = require('path');
const ROOT = path.join(__dirname, '..');
const KEY = JSON.parse(fs.readFileSync('/Users/chenyibin/.pi/agent/auth.json', 'utf8')).deepseek.key;
const MODEL = process.env.MODEL || 'deepseek-flash';

const BRIEF = `你是一位擅长深色系技术站点的视觉设计师。请产出**一个完整的、可直接打开的 index.html**（内联 CSS，不引用外部字体和图片，可用内联 SVG）。

## 内容（必须全部出现，文案用中文）

标题：Claude 最佳实践
副标题：231 条官方资源 · 173 篇中文译文 · 100 个概念构成的知识网

统计数字（5 个）：231 官方资源 / 173 全文译文 / 100 概念条目 / 141 概念关系 / 95 万 中文字数

入口链接（4 个，做成卡片）：
1. 交互式知识图谱 — "11 个分类聚类，悬停高亮关联，点节点看定义" → /graph.html
2. 思维导图 — "按分类折叠展开的层级导图，一眼看完 100 个概念" → /mindmap.html
3. 概念维基 — "100 个原子条目：摘要、关键做法、常见误区、来源账本" → https://github.com/yibie/claude-best-practices-zh/blob/main/wiki/INDEX.md
4. 中文译文目录 — "173 篇全文译文，每篇都链回英文原文便于对照" → https://github.com/yibie/claude-best-practices-zh/blob/main/docs/README.md

顶部或底部再放三个小链接：GitHub 仓库、英文原文快照、Claude 官方资源页
- https://github.com/yibie/claude-best-practices-zh
- https://github.com/yibie/claude-best-practices-zh/tree/main/raw
- https://claude.com/resources/best-practices

页脚一行：原文版权归 Anthropic PBC 所有 · 本页为非官方中文整理

## 视觉要求

- 深色底（#0a0b0d ~ #101318 之间），文字对比度足够，主强调色只用一种（建议暖橙 #e0795c 或冷蓝，二选一，不要彩虹）。
- 排版是第一优先级：大字号标题（clamp 到 64px+）、紧凑的字距、克制的行高；数字用等宽或 tabular-nums。
- 用留白和细分割线建立层级，不要卡片套卡片、不要圆角过大（不超过 16px）。
- 可以有一个很淡的网格/噪点/径向光晕背景，用纯 CSS 或内联 SVG 实现。
- 卡片 hover 有细微的边框高亮 + 轻微上浮，过渡 150~200ms。
- 响应式：窄屏单列，字体缩小，统计数字换行。
- 不要用 emoji 当图标；图标用简单内联 SVG 描边线条。
- 整个页面必须自包含，不能依赖任何外部资源。

## 输出

只输出 HTML 源码本身，从 <!doctype html> 开始，不要代码围栏，不要任何解释。`;

async function gen(i) {
  const res = await fetch('https://api.deepseek.com/chat/completions', {
    method: 'POST',
    headers: { Authorization: `Bearer ${KEY}`, 'content-type': 'application/json' },
    body: JSON.stringify({
      model: MODEL,
      messages: [{ role: 'user', content: BRIEF + `\n\n（第 ${i} 版：请换一种布局思路，避免和常见模板雷同。）` }],
      temperature: 1.0,
      max_tokens: 12000,
    }),
  });
  if (!res.ok) throw new Error(`HTTP ${res.status}`);
  const d = await res.json();
  let t = d.choices[0].message.content.trim();
  t = t.replace(/^```html\n?/, '').replace(/```$/, '');
  fs.writeFileSync(path.join(ROOT, 'design', `candidate-${i}.html`), t);
  console.log('candidate', i, t.length);
}

(async () => {
  fs.mkdirSync(path.join(ROOT, 'design'), { recursive: true });
  await Promise.all([1, 2, 3].map(gen));
})();
