---
title: "在前沿工作：Cognition 如何信任 Claude Fable 5 通宵工作"
source_url: "https://claude.com/resources/articles/working-at-the-frontier-how-cognition-trusts-claude-fable-5-to-work-through-the-night"
publisher: "claude.com"
type: "blogPost"
date: "2026-07-10"
products: []
read_time: 6
excerpt: "Cognition 研究高级副总裁 Silas Alberti 几乎在该公司的 AI 软件工程师 Devin 中测试过每一款 Claude 模型。Claude Fable 5 是他第一个愿意放心让它整夜运行的模型。"
fetched_at: "2026-11-18"
---

# 在前沿工作：Cognition 如何信任 Claude Fable 5 通宵工作
即便按硅谷的标准衡量，Cognition 也算年轻。它在 2024 年初打造了自主 AI 软件工程师 Devin，彼时智能体的基本机制还勉强才能运转起来。

Devin 承接的是工程师们始终无暇顾及的工作：[代码库迁移](https://claude.com/resources/articles/ai-code-migration)、积压的缺陷、一再拖延的功能。其客户既有高速成长的初创公司，也有《财富》500 强企业，标准很高。Devin 写出的代码必须可靠、可直接用于生产；一个悄悄引入的小缺陷，就可能在后续环节引发真正的问题。

Alberti 的团队负责训练和测试 Devin 背后的模型，几乎从最初就运行过每一代 Claude。他把第一次真正的跃升追溯到 2024 年底的 Claude 3.6 Sonnet。那是第一个能可靠地串联工具、并维持多步任务的模型。团队把它接入 Devin 后，内部用量增长到原来的三倍。

正是这段历史，让他很难被打动。Cognition 见过太多模型在基准测试中表现出色，可一旦工程师真正上手使用就立刻崩掉。"我们被这样坑过很多次，"Alberti 说。因此团队更信任自己的工程师，而不是任何分数。公司里品味最高的开发者会让每个新模型经历一整天真实工作，评判标准是它写出的代码是不是他们真的愿意保留。

正如 Alberti 所说："我们不信任何评估（eval）。"

## 早期模型的天花板在哪里

尽管取得了这些进展，仍有一个上限：智能体在失去线索之前能运行多久？

"在 Fable 之前，你能委派给智能体的任务大概能保持几分钟，也许一小时，"Alberti 说。再往后，会话就开始跑偏。给早期模型五个需要同时权衡的想法，它就会失去头绪、陷入混乱。在一次数据库迁移中，此前的一款 Opus 模型从技术上讲完成了任务，但过程中引入了一系列隐蔽的缺陷。

事件分诊也呈现出同样的形态。早期模型往往停留在日志表面，而不去深挖相关的那一行；而且它们被训练成无论如何都要给出答案——于是它们会"自信地宣称自己发现的第一个看似合理的东西，然后停下"。工程师们学会了忽略它们。



Cognition 用一系列基准测试来评估前沿模型，其中包括 Frontier Code。

## Claude Fable 5 通过了 Cognition 自己的标准

Cognition 用 Frontier Code 给模型打分，这个基准测试是他们自己构建的，因为现有的基准测试总是奖励那些能通过测试、却无法在真实代码库中存活的代码。Alberti 称其为"反垃圾（anti-slop）"标准。在其最难的子集上，此前那款 Opus 模型得分约为 10%。Claude Fable 5 得分约为 30%。

团队的第一反应是怀疑。"是不是有 bug？这不可能是真的。"通常基准测试出现跃升时，工程师们会争论数周，讨论模型在实践中是否真的更好。这一次，内部试用（dogfooding）的结果与数字一致。"说实话，这有点令人震惊，"Alberti 说。

"我们注意到的最重要的一点是时间跨度（horizon），它能自我维持多久，"他说。"有些任务，我正准备去睡觉，心想，'好吧，请继续做这个，在我醒来之前别停。'然后我醒来，它已经连续工作了八个小时，而且确实取得了真正的进展。我以前没见过这种情况。"

时间跨度之所以能维持，是因为 Claude Fable 5 在混乱的上下文中保持清醒。它是第一个正确使用 Cognition 内部调试工具的模型，在浏览器中翻阅日志，并在噪声中得出结论。在一次曾让早期模型栽跟头的迁移中，它先声明了自己将遵守的不变式，然后据此执行。在分诊中，它锁定了根本原因，并说明了自己不知道什么——Alberti 说，这才是真正重建信任的方式。

他把这次跃升归入少数真正的阶跃式变化之列，这类变化大约每年出现一次。



Silas 和他的团队正在打造 Devin，由 Claude 等模型驱动，以处理更复杂、运行时间更长的工作负载。

## 下一步

Cognition 创立时的赌注是：智能体应该在云端一次运行数小时。在公司成立的第一年里，模型还达不到这个水平。

Alberti 说，Claude Fable 5 让这个赌注的完整版本变得可行，其中一部分已经体现在产品中。Devin 可以监视某个 Slack 频道，无需被 @ 就主动介入某个议题，或者监控生产环境并自行分诊突增的异常。他说，当它把这类事情做对时，感觉"就像团队里有一位真正的工程师"。

他预计这将成为工程团队的默认做法。他说，一两年内，90% 的智能体会话将是主动式的：发现问题、扫描代码库，然后把修复方案发消息告诉你。

"我们一直想在公司里构建的很多东西，现在都成为可能了，"Alberti 说。

开始使用 [Claude Fable 5](https://platform.claude.com/docs/en/about-claude/models/introducing-claude-fable-5-and-claude-mythos-5)。

本系列更多内容：[Rakuten](https://claude.com/resources/articles/working-at-the-frontier-rakuten) 和 [Hebbia](https://claude.com/resources/articles/working-at-the-frontier-how-hebbia-builds-ai-for-financial-diligence-that-cant-miss-a-detail)
