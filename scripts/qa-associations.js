// 第二遍审阅：审查概念关系（有向）
const fs = require('fs');
const path = require('path');

const ROOT = path.join(__dirname, '..');
const KEY = JSON.parse(fs.readFileSync('/Users/chenyibin/.pi/agent/auth.json', 'utf8')).deepseek.key;
const MODEL = process.env.MODEL || 'deepseek-v4-pro';
const graph = JSON.parse(fs.readFileSync(path.join(ROOT, 'data', 'graph.json'), 'utf8'));
const byId = new Map(graph.nodes.map((n) => [n.id, n]));

const RELS = ['启用', '依赖', '解决', '替代', '属于', '衡量', '风险', '用于'];

const SYS = `你在审阅一张"Claude 最佳实践"知识图谱的有向关系。共 100 个概念、${graph.edges.length} 条关系，格式为「A --[关系词]--> B」，读作"A 的关系词是 B"。

关系词含义（严格按这个判方向）：
- 启用：A 让 B 成为可能 / A 提供 B 的能力
- 依赖：A 要成立需要 B
- 解决：A 用来解决 B 的问题
- 替代：A 可以替代 B
- 属于：A 是 B 的一种 / 一部分
- 衡量：A 用来度量 B
- 风险：A 会带来 B 这类风险
- 用于：A 被用在 B 场景中

请输出三类操作：
1. remove：这条关系明显错误、或两个概念其实没有关系 → 删除。
2. flip：关系本身成立但方向反了 → 反转（同时给出正确的关系词）。
3. add：真正重要且缺失的关系（最多 20 条，宁缺勿滥）。

判定标准：只要"按关系词的字面含义"读起来不成立，就应当修正；不要因为两条关系相似就删除。

输出严格 JSON（无解释、无代码围栏）：
{
  "remove": [{"from":"A","to":"B","reason":"15字内"}],
  "flip":   [{"from":"A","to":"B","rel":"修正后的关系词","reason":"15字内"}],
  "add":    [{"from":"A","rel":"关系词","to":"B","reason":"15字内"}]
}
概念名必须与输入完全一致，关系词只能取自上面 8 个。`;

const conceptLines = graph.nodes.map((n) => `${n.zh}（${n.en}）｜${n.cat}｜提及${n.count}｜${n.def}`).join('\n');
const edgeLines = graph.edges.map((e) => `${byId.get(e.from).zh} --[${e.rel}]--> ${byId.get(e.to).zh}（支撑${e.w}篇）`).join('\n');

(async () => {
  const res = await fetch('https://api.deepseek.com/chat/completions', {
    method: 'POST',
    headers: { Authorization: `Bearer ${KEY}`, 'content-type': 'application/json' },
    body: JSON.stringify({
      model: MODEL,
      messages: [
        { role: 'system', content: SYS },
        { role: 'user', content: `【概念表】\n${conceptLines}\n\n【现有关系】\n${edgeLines}` },
      ],
      temperature: 0.2,
      max_tokens: 8000,
      response_format: { type: 'json_object' },
    }),
  });
  if (!res.ok) throw new Error(`HTTP ${res.status} ${(await res.text()).slice(0, 200)}`);
  const d = await res.json();
  const out = JSON.parse(d.choices[0].message.content);
  fs.writeFileSync(path.join(ROOT, 'data', 'qa', 'associations.json'), JSON.stringify(out, null, 2));
  console.log('remove', out.remove?.length, 'flip', out.flip?.length, 'add', out.add?.length, 'usage', d.usage);
  console.log(JSON.stringify(out, null, 1).slice(0, 1800));
})();
