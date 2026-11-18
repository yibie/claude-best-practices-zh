---
title: "面向初创企业的 Claude Tag 指南"
source_url: "https://claude.com/resources/articles/claude-tag-guide-for-startups"
publisher: "claude.com"
type: "blogPost"
date: "2026-11-13"
products: ["Claude Tag"]
read_time: 14
excerpt: "领先的初创企业如何借助 Claude Tag 更快交付并扩展运营"
fetched_at: "2026-11-18"
---

# 面向初创企业的 Claude Tag 指南

初创企业往往节奏飞快，团队精简，每个人身兼数职。在许多方面，[Claude Tag](https://claude.com/product/tag)（beta）都很契合初创企业的工作方式。你在承载上下文的 Slack 频道里 @Claude，添加连接器，让团队一起分配任务并引导任务推进。

对于刚接触 Claude Tag 的初创团队来说，最常见的问题之一是"我应该先把 Claude 加到哪些频道？"为了回答这个问题，我们与八家高增长初创企业进行了交流，了解 Claude Tag 在他们团队内部是如何运作的。

我们听到了来自各家公司的领导者分享，这些公司的愿景从重塑律师事务所到构建下一代资源规划软件不等。有些公司几乎把 Claude 加到了每一个频道，另一些则深入聚焦于一两个具体用例。

| 公司 | 值班 | 从话题到 PR | 公司大脑 | 自助数据 | 例行报告 |
| --- | --- | --- | --- | --- | --- |
| Kikoff | ● | ● |  | ● | ● |
| NavigateAI | ● | ● | ● |  | ● |
| Campfire | ● | ● | ● |  |  |
| Flagler Health | ● | ● | ● |  |  |
| Moritz |  |  | ● |  | ● |
| Orderful | ● | ● | ● | ● |  |
| Valence |  | ● | ● |  | ● |
| Descript |  | ● |  | ● | ● |

但与我们交流的每个人都分享了一个"啊哈！"时刻——他们意识到，一段几分钟的 Claude Tag 对话替代了数天的工作，或者揭示了原本可能一直隐藏的洞见。

本指南收录了最常见的用例，每个用例都附有实用的实施细节，旨在帮助创始人找到并部署能为团队带来关键推动的用例。以下是我们交流过的初创企业取得进展的一些例子：

![Campfire](https://assets.claude.com/547f3af27e33331c1409324c549d765f790ca68d.svg)

21

分钟，从 Slack 提及到开启 PR

![NavigateAI](https://assets.claude.com/5348eaceef888ace36b50da1a6c9f8126ad2f1bb.svg)

134

个从 Slack 话题合并的拉取请求

![Moritz](https://assets.claude.com/6b65c9f5d995c188f6273248826bbe5fc494b4ff.svg)

5

分钟完成每日班末更新，此前需要 1 小时

![Valence](https://assets.claude.com/5855d903e0e618842304aaf2e9b02e7d648a90e2.png)

<1

小时，从客户需求到无代码解决方案

![Orderful](https://assets.claude.com/dcd269d39d743ba04bbf4a2e803b60367c0d6b88.svg)

2

天，从 Slack 提问到上线生产

![Descript](https://assets.claude.com/05128b9e935b6625beecc1bc4c6fa08814473e3e.svg)

从数天到数小时

的周期性报告准备

在本指南中，我们分享了领先初创企业使用 Claude Tag 的最常见用例、频道以及集体洞见。

* * *

## 最适合标记 Claude 的频道

我们交流的八家初创企业都在 Slack 中使用 Claude Tag，但有几个频道反复被提及，是最佳的起点。

目录

1.  [01 Claude 值班](#chapter-1)
2.  [02 从话题到 PR](#chapter-2)
3.  [03 公司大脑](#chapter-3)
4.  [04 自助数据](#chapter-4)
5.  [05 报告与交接](#chapter-5)
6.  [06 入门清单](#chapter-6)

## 01 Claude 值班

示例配置：

频道

`#on-call` `#alerts-ci` `#deploy-watch` `#support-escalations`

连接器

GitHub, GitLab, Sentry, dbt, PagerDuty, Linear, Datadog, Jira, Grafana, incident.io

话题与例程

事件响应、晨间事件摘要、周一值班交接、每日健康摘要、每小时事件回顾

初始指令

@Claude 请为本频道记住：监控告警，并立即在各自的话题中分诊每一条告警。检查是否已有工单。先查询数据，再进行推断，并将你已验证的内容与你推断的内容分开。如果问题属实，指出可能的根本原因并附上链接，标记负责人，仅在修复范围可控时开启草稿 PR。如果无需采取行动，请说明。每次事件后，将你学到的东西添加到 \[经验教训文件\]。

分诊频道出了名的嘈杂。Sentry 错误、Datadog 告警、客户缺陷报告和支持请求不断打断，让人难以从噪声中分辨出信号。这通常是团队交给 Claude 的第一项任务。

当 Claude 作为[第一响应者](https://claude.com/resources/articles/ai-ci-cd-on-call)待在频道里时，第一轮处理往往在值班工程师打开笔记本电脑之前就已完成。Claude 会读取每一条落入频道的信息，调查代码库和它能访问的工具，并分享它的发现。如果修复范围可控，它会开启草稿 PR；如果不可控，它会将问题连同调查结果转交给合适的人。在这类配置中，由人审查每个修复后再合并，只有真正全新的问题才需要有人亲自启动调查。

在 Campfire（一家为财务团队构建 AI 原生 ERP 的公司），一位工程师在一条报告上标记了 Claude，报告称其 AI 智能体的部分已完成答案未能送达用户。Claude 在 21 分钟后开启了一个 PR，并在当天下午合并。

### Kikoff：每个分诊频道里的第一响应者

Kikoff 是一家金融科技初创企业，帮助消费者建立信用、解决流动性需求并实现财务安全。Claude Tag 是公司各分诊频道的第一响应者，包括：

-   `#deploys`：Claude 在每次发布后决定要关注什么，并标记它弄坏的任何东西。
-   `#alerts-ci`：当构建失败时，Claude 查明原因并以草稿 PR 的形式提出修复。
-   `#alerts-sentry-backend`：Claude 对 Sentry 异常和崩溃进行第一轮处理。
-   `#dog-fooding`：Claude 调查员工在内部试用（dogfooding）时标记的问题，并标记正确的负责人。
-   `#support`：Claude 对支持工单进行第一轮处理。

Kikoff 最初让 Claude 只在被提及时参与对话，而最大的收获出现在团队让它自行介入之后。当注册功能出故障时，Claude 将其追溯到一个后端变更，评估了影响范围，指出了负责修复的团队，并开启了一个草稿 PR，以便在此期间应用能优雅降级。

![Slack 消息中 Claude 标记注册功能出故障，并给出原因、范围、修复负责人和草稿 PR。](https://assets.claude.com/2b0f5523a07eac627cacb997fda4823706524505.png)

Claude 标记注册功能出故障，将其追溯到一个后端变更，评估影响范围，指出负责修复的团队，并开启一个草稿 PR，以便应用优雅降级。这是根据 Kikoff 重建的对话。名称和图片已修改。经 Kikoff 许可使用。



> "当 Claude 在监控或人类之前发现问题时，我总是很兴奋。一个人只能亲自管理有限的上下文，Claude Tag 帮助我们组织和掌握一部分上下文，而我们负责管理结果。"

Alex Dejeu，Kikoff 工程经理

### NavigateAI：用碎片化上下文修复缺陷

NavigateAI 为建筑现场团队构建 AI 副驾驶。他们在约 90 个频道中运行 Claude Tag，用于告警分诊、缺陷集中修复、快速功能构建和支持升级。自六月以来，Claude 直接从 Slack 话题中开启了约 223 个 PR，其中 134 个已合并，从开启到合并的中位时间为两小时。

分诊对 NavigateAI 来说是一个特别有价值的用例。因为 Claude 拥有如此多的上下文，它能找到乍看之下可能被忽略的、反直觉的根本原因。



> "我们使用 Claude Tag 最大的'哇！'时刻，是我们在尝试调试一个负载问题时，它看起来是由某个客户引起的（因为他们的调用失败了）。正常人的反应会继续追查那个客户。但由于 Claude 能访问许多其他数据源，它实际上发现这来自一个未接入监控的内部定时任务，该任务在同一时间运行。"

Mike Chen，NavigateAI 工程负责人

借助 Claude，平均问题解决时间得到了改善。在一个案例中，Claude 在 Sentry 告警触发八分钟后找到了根本原因，修复在告警后 93 分钟合并。

"快速发展的初创企业通常不得不在速度和结构之间做选择。Claude Tag 让我们两者兼得。它是一个能连接我们所有工具、把点连起来的大脑，所以我们无需自己构建就能获得结构，"Mike 说。

## 02 从话题到 PR

示例配置：

频道

`#quick-wins` `#bug-bash` `#product-feedback` `#feature-requests` `#ux-papercuts` `#tech-debt` `#design-polish`

连接器

GitHub, GitLab, Linear, Jira, Confluence, Notion, Figma, Sentry

话题与例程

每个话题一个请求、每周待办清理、每日 PR 汇总、每周已交付回顾

初始指令

@Claude 请为本频道记住：当有人描述一个缺陷或小功能时，在各自的话题中处理它。检查是否已有工单，并先阅读相关代码。如果缺少细节，请询问细节或要求一个真实示例，而不是猜测。如果变更很小且范围可控，开启一个草稿 PR，并附上变更内容和测试方式的简短摘要。绝不合并；由人审查并批准。如果变更太大或有风险，说明原因并建议开一个工单。

速度是初创企业最大的优势之一，但往往那些让用户愉悦的小请求会在忙乱中被淹没。这些信息通常由面向客户的团队收集，在 Slack 中提交，如果没有被忽视，最终会进入 Linear 或 Jira，在那里与数百个其他工单一起排优先级。

借助 Claude Tag，任何人都能起草 PR，无论是否懂技术。在话题中提出一个想法，在同一处获得产品、工程和 GTM 的实时反馈，Claude 会将话题转化为反映所有人意见的草稿 PR。

与我们交流的许多初创企业都用 Claude Tag 来处理"轻巧愉悦"的功能，或消除那些审查起来很快、但原本不会被排上优先级的琐碎痛点。

### Orderful：从 Slack 交流到生产功能，仅用两天

Orderful 是一个 EDI 平台，通过 API 或直接在浏览器中连接公司与他们的贸易伙伴。其客户通过该平台与伙伴交换标准文档。

有一种文档类型 753 在 Orderful 的 Web 应用中不受支持。这个请求一直搁置在待办列表中，导致一家大型零售商的货运被延误。

当一位客户经理在 Slack 中跟进时，产品经理标记了 Claude："@Claude，你应该做一个。"Claude 索要了该文档的真实示例，以便按照实际格式构建，然后开启了一个添加 753 支持的草稿 PR。

![Slack 话题中 Claude 确认打印视图修复在真实的 753 交易上有效，一位队友作出回应。](https://assets.claude.com/1921c58bc091958f185f0fc960870d6dd18f7bd3.png)

Claude 确认修复在真实的 753 交易上有效。名称和图片已修改。经 Orderful 许可使用。

第二天早上，Claude 为配套的 754（零售商的响应）提交了一个工单，并开启了第二个 PR。两者都在 Slack 交流后约两天上线生产。

"以前需要数周或数月的事情，现在只需一次 Slack 对话，"Orderful 的 CTO Piers MacDonald 说。"价值难以证明的轻量功能过去会卡在待办列表中。现在它们有了出路。"

### Valence：从功能请求到推广

Valence 与全球最大的雇主合作，通过 AI 教练 Nadia 将企业人才与绩效连接起来。当一位 Valence 工程师在 Slack 中说明如何应对一位重要客户提出的紧急产品变更时，Claude 不只是遵循指示，它还识别出需要进行的额外变更，因为同一配置存在于两个地方。如果没有 Claude，最初的变更将是不完整的。

![Slack 交流中一位 Valence 工程师请 Claude 确认一项变更，Claude 回复说这是两项变更。](https://assets.claude.com/20696126082a923a5dc573f7571aadb71caf617e.png)

Claude 指出所请求的变更实际上是两项变更。经 Valence 许可使用。



> "它不只是同意专家的意见。它发现了重复的配置，这是人类容易忽略的东西。"

Sameer Bansal，Valence 首席 AI 工程师

在另一个案例中，一位客户紧急要求一项定制。Claude 检查了代码，并与一位工程师协作，确认无需更改代码即可交付。不到一小时，一位队友就为客户准备好了解决方案。

## 03 公司大脑

示例配置：

频道

`#ask-anything` `#company-wiki` `#product-questions`

连接器

GitHub, Notion, Google Drive, Linear, Jira, Confluence, Granola, Metabase

话题与例程

每个话题一个问题、决策日志更新、每周过期文档检查、重复问题回顾

初始指令

@Claude 请为本频道记住：从我们的代码、文档和过往话题中回答问题，并附上来源链接。如果来源相互矛盾，检查代码，给出当前答案，并标记过期的文档。如果你不确定，请说明并标记负责人。当一个话题达成决策时，将其记录在 \[文档位置\]。任何发给客户的内容都需要先经人工检查。

在初创企业，机构知识往往存在于人们的头脑中，从产品计费代码的复杂细节到上手文档托管在哪里。

对于我们交流的许多初创企业来说，Claude Tag 已成为公司大脑。Claude 在回答时附上来源，在不确定时标记负责人。它也让知识保持最新：当一个话题达成决策时，Claude 可以在当天将其记录到你的文档中，并标记已过期的文档。

![Slack 频道中一位队友问 Claude 决定了什么，Claude 总结了该频道。](https://assets.claude.com/a4edb94f8444bc21a1fc8aa3d489f15358328129.png)

示例交流。

### Moritz：从接单到人员配置的实时事实来源

Moritz 是一家 AI 原生律师事务所，承诺合同当天交付，而 Moritz 称行业标准至少为三周。围绕法律工作的一切，从接单、报价到人员配置和跟进，都存在于 Slack 中，每个事项一个话题，每个客户一个频道。

现在，从 CEO 到律师助理，每个人都先问 Claude。过去在 Slack 中需要搜索长达 30 分钟的问题，现在两分钟内就能得到回答。班末更新现在根据当天的话题起草，从约一小时的整理变为五分钟的编辑。

这些时间回到了法律工作上。Claude Tag 处理案件相关的行政工作，如跟进问题、提醒和状态更新。它无法访问客户文档或与 Moritz 律师的特权对话。



> "一家在 44 个国家开展业务的律所每月会产生数百个一次性问题，没有人会为它们构建功能。Claude Tag 从我们在 Slack 中的自身历史来回答这些问题。每个答案都是一个带链接的话题，因此机构记忆会不断累积。"

Stefan Mandaric，Moritz 联合创始人兼 CTO

### Campfire：按需的客户体验

有一个 Slack 频道尤其"人气爆棚"：他们的 CX（客户体验）频道。销售使用这个频道"在潜在客户对话中验证某些功能"，而不必"挨个私信 10 个不同的人"。

这类频道特别有效，因为销售可以在当下、在客户还在关注时作答，从而在早期客户对话中更独立、更自信地运作。



> "Claude Tag 基本上充当了我们的中央知识库。"

Nancy Jin，Campfire AI 工程经理

## 04 自助数据

示例配置：

频道

`#data-requests` `#ask-revops` `#metric-definitions`

连接器

dbt, GitHub, Metabase, BigQuery, Snowflake, Databricks, Notion

话题与例程

每个话题一个问题、每周站会前数据简报、发布与实验数据简报、流水线故障分诊、新问题分诊

初始指令

@Claude 请为本频道记住：从我们的受治理模型和 \[数据 Skills 仓库\] 中的定义来回答。如果数据未在其中覆盖，说明它未经校验，而不是猜测。先给出答案，然后给出数字、驱动因素以及任何注意事项。在解释变化之前，检查近期事件、发布和 Slack 讨论。如果某个指标的定义不明确，询问我们指的是哪一个。对于任何重要事项，在运行前分享你的计划或 SQL。将你已验证的内容与你假设的内容分开，并在答案末尾列出任何未解决的数据质量警告。如果有人发现错误，起草一个修复供数据团队成员审查。如果一个问题出现两次，建议将其设为定时任务。

在一家快速增长的初创企业，每个职能都想要数字，数据团队必须决定谁的请求优先。借助连接到你的数据的 Claude Tag，任何人都可以用自然语言提问，无需在数据团队的队列中等待。

这也是我们自身采用的一个用例。[在我们某个数据频道的一个月里，Claude Tag 回答了人们发布的超过 75% 的问题，通常在一两分钟内](https://claude.com/resources/articles/self-service-data-analytics-in-slack-how-anthropic-deploys-claude-tag-for-ad-hoc-questions)。它基于受治理的数据和分析师使用的相同定义运作，这些定义存放在一个带版本的仓库中，Claude 在每次对话中都会重新读取。

![示意图展示 Claude Tag 将仓库中发生的变化与知识索引中的原因结合，形成关于注册量下降的单一答案。](https://assets.claude.com/4cf8ac80c074a4f3b28e78bd605ec9a881a611a8.png)

摘自《Slack 中的自助数据分析：Anthropic 如何部署 Claude Tag 应对临时问题》。

### Descript：回答临时数据请求

Descript 是一个 AI 驱动的视频编辑平台。Claude Tag 现在是数据请求和初步分析的第一线支持。产品、增长、RevOps 和财务在 Slack 中提问，并获得基于 Descript 的 dbt 模型的答案。



> "我以前每周或每月都要编写复杂的 SQL 并手动刷新数字。现在我用自己创建的 Claude Artifacts 替换了几个数据团队的仪表板，而且不再需要手动刷新它们。"

Daisy Zhang，Descript 增长营销负责人

Daisy 的周期性报告准备从数天缩短到数小时。

例如，增长团队会问生命周期订阅为何下降、付费搜索是否在将最后点击归因让给其他渠道，或者一个自助账户需要多长时间才能成为企业商机。数据团队追踪 Claude 生成的 Artifacts，以了解哪些数据资产在各团队中最重要，并将自己的时间花在战略问题和构建让自助服务得以运作的上下文上。



> "商业智能的承诺一直是让业务用户自助。直到我们用 Claude Tag 为我们的数据配置了海量上下文，我才真正看到它实现。"

Jen Huhn，Descript 商业化产品经理

### Orderful：从问题到仪表板

在 Orderful，自助分析涵盖对话式分析和完整数据构建：任何人都可以从 Slack 中的一个问题出发，最终得到一个合并到生产环境的仪表板。关键在于一个语义层，它编码了商定的定义和指标，因此每个答案和每次构建都使用相同的定义。



> "我们信任输出，因为语义层约束了 SQL，CI 把关构建，而且有一套商定定义的流程。没有这些，你会得到看起来自信但错误的答案。一旦这些护栏到位，连接 Claude Tag 用了不到 30 分钟。现在队友们在共享的 Slack 话题中一起构建，而不是各自单独会话。"

Piers MacDonald，Orderful CTO

## 05 报告与交接

示例配置：

频道

`#sales-pipeline` `#customer-handoffs` `#standup-summary` `#qbr-prep`

连接器

Notion, Google Drive, Gong, Salesforce, Gainsight

话题与例程

日终状态草稿、QBR 前简报、交易交接

初始指令

@Claude 请为本频道记住：根据我们的话题、文档和数据起草每份周期性报告，并附上来源链接。先说明发生了什么变化以及需要做出什么决策。将你已验证的内容与你假设的内容分开，并标记缺失的内容，而不是填补空白。将草稿发布在独立话题中供 \[负责人\] 编辑。未经人工批准，任何内容都不得发出。如果一份报告反复收到相同的修改，建议更新这些指令。

我们介绍的许多例子都是反应式的：某事发生，Claude 响应。例行报告则是 Claude 按计划负责的工作，就像队友负责一项周期性交付物一样。

![Slack 交流中一位队友请 Claude 提供周一的销售管道更新，Claude 发布了一份带图表的每周摘要。](https://assets.claude.com/8d3d8fd8252fc93f3bd80bb28ae0a728142a7ef2.png)

在 Claude Tag 中使用例程的示例。

你只需描述一次结果；Claude 每次都会运行它，并将结果发布在团队已经工作的地方。

### Valence：交易审查与交接

Valence 正在配置 Claude，在每次季度业务审查前为团队提供简报，包含客户健康状况、未结交易、阻碍因素和后续步骤。他们还在努力让交易达成后从销售到客户成功的交接更加顺畅。Claude 通过帮助汇总跨互动细节为团队节省时间，并且常常发现他们可能遗漏的关键事项。

"当一笔交易达成时，Tag 会根据交易历史、通话和合同构建交接内容：谁是谁、承诺了什么、定制了什么、还有什么未解决。然后客户成功团队在启动会前进行审查，"Sameer 说。

## 06 入门清单

下面的清单汇集了这些初创团队的最佳实践，以便你将其应用到自己的工作流中。

上线前

检查前提条件。

Claude Tag 在 Claude Team 和 Enterprise 计划上处于公开 beta 阶段，在 Free、Pro 或 Max 上不可用。你需要一位 Claude 组织 Owner 和一位 Slack 工作区管理员来连接两者。管理员还必须开启例程（Routines），Team 计划需要用量额度，Claude 才会响应。

用捆绑包（bundle）设置 Claude 的访问权限。

在频道中，Claude 以自己的[智能体身份](https://claude.com/docs/claude-tag/concepts/agent-identity)运作，使用服务账户而非任何人的个人登录。将所需的连接器、仓库和指令分组到一个[捆绑包](https://claude.com/docs/claude-tag/admins/add-connections)中，并按组织范围、按工作区或按频道附加。这设定了 Claude 在每个地方能访问什么，频道中的每个人都获得相同的访问权限。从窄范围开始：只包含第一个频道工作所需的内容。

在私有频道中试验。

与我们交流的近一半初创企业都是让一个小型跨职能团队在私有频道中试验，从而开始他们的 Claude Tag 之旅。"先以私有方式启动，混合不同角色，然后再转移到群组频道，"Sameer 说。

确定边界。

默认情况下，Slack 工作区中的任何人都可以使用 Claude，即使没有 Claude 账户。你可以[限制访问](https://claude.com/docs/claude-tag/admins/restrict-access)到你的组织，并将搜索限制在 Claude 所在的频道。在 Enterprise 上，你还可以限制对特定角色或选定频道的访问。

为 Claude 能做什么和绝不能做什么设定明确预期。与我们交流的几个团队让 Claude 开启草稿 PR，但由人审查和合并。对于 Orderful，[Claude Code](https://claude.com/resources/articles/claude-code-guide-for-startups)（而非 Tag）处理"基础设施变更、审计、敏感数据"。对于"艰难决定"，例如"一个涉及多个服务的 PR"，Claude 会征求第二意见。Moritz 不让 Claude Tag 访问客户文档或与其律师的特权对话。

尽早开始安全审查。

常见问题是数据留存和 Claude 能访问什么，[安全](https://claude.com/docs/claude-tag/concepts/security-and-data)和[数据生命周期](https://claude.com/docs/claude-tag/concepts/data-lifecycle)页面回答了这两个问题。Claude Tag 不适用于开启了零数据留存（ZDR）、客户管理加密（CMEK）策略或 HIPAA 配置的组织，也不在我们的商业伙伴协议（BAA）覆盖范围内，因此在规划推广前请先确认这一点。

设置预算和告警。

Claude Tag 按用量计费，因此尽早沟通可以避免随着采用增长而出现意外。你可以[设置支出上限](https://claude.com/docs/claude-tag/admins/set-spend-limit)，包括总体和按频道，按频道选择模型，并使用 Enterprise Analytics API [按用户归因成本](https://claude.com/docs/claude-tag/admins/attribute-costs)。Orderful 设置了组织范围的支出上限，并在 75% 和 90% 时告警。"我们对频道成本有极致的责任感。负责人要证明'是的，这笔支出对于产出/结果来说是合理的'，"Kikoff 工程经理 Alex Dejeu 说。用第一个频道的实际成本来估算下一个频道的规模。

部署

在你团队已经在用的频道中选一个明确的任务，比如值班告警或缺陷分诊。

"我们在某些团队中试验，看看什么有效，一旦确信我们已经解决了问题，就把这个想法推广到其他团队，让他们也添加到自己的类似频道中。我们希望避免与对 AI 错误容忍度较低的人产生破坏信任的体验，"Kikoff 工程经理 Alex Dejeu 说。

让你的专家和文化引领者先上手。

让你团队已经信任的人先使用 Claude，并且公开使用。

"在公开场合与 Claude 来回交流既高效又有趣。销售和客户成功部门的几个人看到专家\[与 Claude Tag 互动\]后，开始自己向 Claude 提问，并很快获得了价值，"Valence 首席 AI 工程师 Sameer Bansal 说。

调整噪声。

多家初创企业告诉我们，他们需要调整 Claude 的"话痨"程度。太话痨是一种风险。

"临时请求中的对话有时会变得嘈杂。我们一直在尝试降低这里的响应频率，并在临时请求中更明确地遵循使用 Claude 的原则，"NavigateAI 工程负责人 Mike Chen 说。

然而，话太少也是一种风险。在繁忙的频道中，"你要么每次都 @ 它，否则它不会做太多事，"Flagler Health 联合创始人 Will Hu 说。而且"如果没有人密切关注某个频道或与之互动，它就会闲置。"

让队友连接自己的账户。

设置中的管理员捆绑包是 Claude 对频道中每个人都能访问的内容。[个人连接器](https://claude.com/docs/claude-tag/concepts/personal-connectors)的运作方式不同：Claude 以提问者的权限行事，因此一旦他们批准，它就能从他们的文档、收件箱或 CRM 中提取内容（Owner 先为组织添加连接器，在 Enterprise 上由管理员管理个人连接器）。答案仍会发布在频道中，因此对任何敏感内容选择"允许并审查"。

像给新员工做入职一样编写频道指令：

先检查什么、何时开启 PR、何时询问，以及"无需采取行动"是一个有效答案。

在频道中给 Claude 反馈，而不是在私信中。

在话题中纠正它。它会[按频道记忆](https://claude.com/docs/claude-tag/users/memory)，队友通过观察学习如何与它协作。如需持久修复，请让 Claude 更新其对本频道的记忆。

![两条来自 Valence 员工的 Slack 消息，感谢一位同事在公开场合与 Claude 一起解决了一个问题。](https://assets.claude.com/7e4a82b6f73aabecf6a5a5fe148c38a53659ba7a.png)

两位 Valence 员工在观看一位同事公开与 Claude 一起解决问题后向其致谢。经 Valence 许可使用。

不确定下一步该往哪走？标记 Claude，问它对你的组织了解到了什么，以及它会扩展到哪些用例。

Moritz 的联合创始人兼 CTO Stefan Mandaric 让 Claude 为每个团队推荐用例。十五分钟后，它已阅读了该律所的 Slack 频道、Linear 问题、Notion SOP、Drive 和 Metabase 仪表板，并发布了 25 个用例。"25 个中有 18 个无需进一步设置即可使用。这成了我们的推广计划。"

* * *

## 结语：我们从"哇"时刻中学到了什么

"哇"时刻并不总是关于速度。通常，Claude 发现了没有人要求它寻找的东西。有时惊喜是克制。有时惊喜是意想不到的交流。"最终你会习惯 Claude 加入玩笑，很快你会欣赏它是一个容易取悦的观众，也是第一个笑的人，"Orderful 的 CTO Piers MacDonald 说。

![带图片回复和表情回应的 Slack 话题。](https://assets.claude.com/8884ca89d9b6e0bf91eb7b426d8546c971d8079d.png)

根据 Orderful 在 Slack 中的对话重建。经 Orderful 许可使用。

我们希望本指南对你有所帮助。特别感谢 Campfire、Descript、Flagler Health、Kikoff、Moritz、NavigateAI、Orderful 和 Valence 分享他们的经验与洞见。

* * *

## 附加资源

### 入门

-   [Claude Tag 概览](https://claude.com/product/tag)
-   [Claude Tag 文档](https://claude.com/docs/claude-tag)
-   [设置 Claude Tag](https://claude.com/docs/claude-tag/admins/setup-overview)
-   [值班引导式设置](https://claude.com/docs/claude-tag/admins/setup-oncall)
-   [设置故障排查](https://claude.com/docs/claude-tag/admins/troubleshooting)

### 连接你的工具

-   [添加连接和捆绑包](https://claude.com/docs/claude-tag/admins/add-connections)
-   [配置 GitHub 访问](https://claude.com/docs/claude-tag/admins/configure-github)
-   [个人连接器](https://claude.com/docs/claude-tag/concepts/personal-connectors)
-   [网络要求](https://claude.com/docs/claude-tag/admins/network-requirements)

### 访问、安全与支出

-   [限制访问](https://claude.com/docs/claude-tag/admins/restrict-access)
-   [智能体身份如何运作](https://claude.com/docs/claude-tag/concepts/agent-identity)
-   [安全与数据](https://claude.com/docs/claude-tag/concepts/security-and-data)
-   [数据生命周期与删除](https://claude.com/docs/claude-tag/concepts/data-lifecycle)
-   [Claude Slack 应用可以访问什么](https://claude.com/docs/claude-tag/admins/for-slack-admins)
-   [设置支出上限](https://claude.com/docs/claude-tag/admins/set-spend-limit)
-   [将成本归因到用户](https://claude.com/docs/claude-tag/admins/attribute-costs)

### 在 Slack 中与 Claude 协作

-   [控制 Claude 何时响应](https://claude.com/docs/claude-tag/users/when-claude-responds)
-   [Claude Tag 能理解的命令](https://claude.com/docs/claude-tag/users/commands)
-   [频道记忆](https://claude.com/docs/claude-tag/users/memory)
-   [设置例程](https://claude.com/docs/claude-tag/users/proactivity)

### 用例

-   [用例库](https://claude.com/docs/claude-tag/users/use-cases)
-   [修复缺陷](https://claude.com/docs/claude-tag/users/use-cases/fix-bugs)
-   [回答数据问题](https://claude.com/docs/claude-tag/users/use-cases/answer-data-questions)

### Anthropic 如何使用 Claude Tag

-   [Claude Tag 如何充当 Anthropic 应对 CI/CD 故障的第一响应者](https://claude.com/resources/articles/ai-ci-cd-on-call)
-   [Anthropic 如何借助 Claude 实现自助数据分析](https://claude.com/resources/articles/how-anthropic-enables-self-service-data-analytics-with-claude)
