---
title: "一位 Anthropic 销售人员如何用 Claude Code 重建团队工作流"
source_url: "https://claude.com/resources/articles/how-anthropic-uses-claude-gtm-engineering"
publisher: "claude.com"
type: "blogPost"
date: "2026-06-05"
products: ["Claude Code","Claude Cowork"]
read_time: 10
excerpt: "在加入 Anthropic 之前，GTM 产品经理 Jared Sires 从未打开过终端。如今，Anthropic 的销售团队都在用他打造的工具。"
fetched_at: "2026-11-18"
---

# 一位 Anthropic 销售人员如何用 Claude Code 重建团队工作流
在 2024 年加入 Anthropic 之前，Jared Sires 从未写过一行代码。又何必写呢？他当时是一家初创公司的客户主管。

正如快速成长的公司里常见的情况，Jared 负责的客户名单很快增长到 600 或 700 个账户。每天要打 10 到 15 通客户电话，客户名单还在不断扩大，Jared 发现自己坐在办公桌前，每晚回复客户邮件直到 9 点或 10 点。

"管理收件箱几乎是不可能的，"他说。"在此基础上还要做外呼，你根本不知道该把精力放在哪里。"

Jared 转而向 Claude Code 求助。尽管毫无编程经验，他还是做出了 CLAFTS，即 _Claude Drafts_ 的缩写：一个运行在 Gmail 内、使用 Claude API 起草客户邮件回复的应用。这经历了多次迭代，但 Jared 估计 CLAFTS 最终每天为他节省两到三个小时。第二天早上他在 Slack 上分享了它，24 小时内，销售组织的其他人就开始使用它，并取得了类似的效果。

这促成了 Jared 在 Anthropic 角色的转变：如今，他是 go-to-market 团队的产品经理，这个角色专注于发现 Anthropic 销售组织运作方式中的问题，并构建由 Claude 驱动的解决方案来修复它们。在这个新角色中，Jared 构建了多种工具，用于自动化客户沟通、在通话前调研客户背景，以及根据会议记录生成跟进邮件。随后他将这些工具打包成 [Claude Cowork](https://claude.com/product/cowork) 中的插件，让整个销售团队都能使用。

他将自己职业生涯的这一转变描述为"我经历过的最有赋能感的事情"。

以下是 Jared 如何用 Claude 大规模处理他的收件箱、他接下来在构建什么，以及 GTM 团队可以从他的方法中借鉴的最佳实践。

## **一位被行政事务淹没的销售代表**

邮件量并不是 Jared 作为客户主管面临的唯一挑战。Anthropic 每 24 到 48 小时就会发布产品变更，而客户的问题往往落在最新的细节上：批处理 API 的 SLA、提示词缓存折扣、模型定价、SDK 行为。要回答好这些问题，意味着要在 Slack、Google Docs、内部知识库和开发者文档之间来回搜索——而且日复一日地重复，每次的事实还略有不同。

"必须向客户转述技术文档是相当困难的，尤其是在 Anthropic，产品演进得如此之快，"Jared 说。

他对 Claude 的最早实验之一既聚焦又实用。利用 Apps Script（Google 的轻量级开发平台）和 Claude，Jared 从内部系统拉取产品使用数据，并让 Claude 每天早上根据账户的增长速度对他的账户进行排名。

"每天 Claude 都会根据客户的使用量给我一份简报，告诉我应该重点关注谁，"他说。他的客户名单上有 700 个账户，这份每日简报帮助他确定该把外呼时间花在哪里。

## **开发 CLAFTS**

更难的挑战是 Jared 的收件箱，以及他不得不花在回复邮件上的深夜时光。

借助 Claude Code，他开始开发一个系统，以他自己的语气起草客户邮件的回复。"Claude Code 名字末尾带着'code'这个词，让我光是开始就觉得有点发怵，"他说。"但过了一段时间后，我理解了它能连接到我的电脑、回答关于电脑上文件的问题，这种能力有多强大。"

CLAFTS 基于大约 4,300 行代码构建，几乎全部由 Claude Code 编写。它从共享的 Google Drive 文件夹和其他第三方工具中提取上下文，通过网页搜索引用 Anthropic 的公开文档，并匹配 Jared 的写作风格。当他一天结束时打开草稿文件夹，回复已经在那里等待审阅。

每当 Anthropic 发布产品变更，文档就会反映出来，Claude 会在下一份草稿中采用这一变更。"Claude 能够使用网页搜索来理解我们网站上的最新文档，并在生成邮件时引用这些材料，"Jared 说。"我不需要把所有这些都记在脑子里。"

开箱即用时，Claude 的写作往往更长，且充斥着更多模棱两可的措辞，因此 Jared 反复调整系统提示词，直到草稿与他自己的写作风格相符。"我大概已经为 CLAFTS 的系统提示词做了数百次迭代，让它为我生成不同内容的文字，"他说。

接下来，他开发了 CLAFTS Tones 功能，它使用模式匹配来模仿他在不同关系中的语气。客户、同事和家人的对话读起来各不相同，草稿会针对每一种进行调整。

Jared 通过在自己的个人账户上给自己写一系列越来越愤怒的邮件来测试这个功能。Claude 捕捉到了这种语气，然后拒绝继续下去。

"Claude 开始模仿那种语气，到某个时候我开始收到拒绝，因为 Claude 不想生成给客户的愤怒邮件，"他说。"那时我知道 CLAFTS Tones 起作用了。"

### **衡量 CLAFTS 的影响**

虽然 CLAFTS 每周为 Jared 节省 10-15 个小时，但他最关心的转变是工作的准确性。由于 Claude 在每份草稿中都从文档中提取最新的产品细节，客户收到的答案与最近发布的内容挂钩，而不是与 Jared 恰好记得的内容挂钩。

"在 CLAFTS 之前，我觉得自己做的行政工作比真正花在客户身上的时间还多，"Jared 说。"在 CLAFTS 之后，我真正能够更多地做我想做的事，也就是销售。"

## **扩展 Anthropic 的 GTM 工具包**

除了 Jared，一位经常工作到午夜之后给客户发邮件的 BDR，John Albert，帮助共同构建了 CLAFTS。业务拓展团队的其余成员在看到队友每天都能省下几个小时之后也加入了进来。从那时起，他们自己完成了大部分的推广工作。

Jared 构建的下一组工具是一组围绕他日历的 [skills](https://docs.claude.com/en/docs/agents-and-tools/agent-skills/overview)：每日简报和每日回顾。

每天早上，每日简报 skill 会读取他的日历，对将要会面的人进行网页搜索，并在第一通电话之前生成谈话要点。该 skill 通过 [MCP servers](https://www.anthropic.com/news/model-context-protocol) 连接 Google Calendar 和 CRM 数据，提取每位客户的相关信息。

而在一天结束时，每日回顾 skill 会从 Google Docs 和会议记录中提取内容来起草跟进邮件，类似于 CLAFTS。

"把这两者结合起来，你就得到了一个管理你日常任务的 Claude，它本质上就成了一个智能体，"他说。

Jared 的工作如今进一步深入智能体领域，他正在试验 [Agent SDK](https://code.claude.com/docs/en/agent-sdk/overview)，并串联工作流，让一次 Claude 运行的输出成为下一次运行的输入。

为了确保他用 Claude Code 构建的工具能扩展到他所支持的更广泛团队，他通过 Claude Cowork 发布这些工具，将 skills 和 MCP 连接器打包成一个任何人都能在几分钟内安装的插件。

在销售插件发布后的几个月内，Anthropic 销售组织中大约 80% 的人都在使用它。剩下的 20% 主要是新员工，Jared 认为这是下一个要解决的挑战，因为这些 skills 正是为了帮助人们更快上手而构建的。

在插件之前，每位新员工都要花数周时间摸索自己的工作流。现在，新员工可以在第一天就安装它，并拥有 20 多个已经接入他们所使用工具的 skills：Salesforce、Intercom、Gong、Google Calendar、Gmail、Google Drive 和 BigQuery。

两个 skills 支撑着销售团队插件：

1.  `/customer-context` 在大约 90 秒内从所有这些来源中提取 360 度的账户视图。
2.  `/pipeline-management` 呈现有风险的交易、预测指导和推进建议。

该软件包还与 Cowork 的调度功能集成，让销售代表可以排队让 skills 自动运行。

"我们的销售人员可以回到有意义的对话中，而不是去更新所有这些不同的应用，"他说。

## **规划下一步**

Jared 的角色随着工具的发展而改变。作为 GTM Architect，他现在参与与产品工程师的设计讨论，并帮助为 Anthropic 的销售团队塑造新工具。

"我觉得随着技术门槛的消融，我几乎能够设计更多产品，并让资深工程师帮助我实现到最后一步，"Jared 说。"我能够增强能力，做更多事情。"

对于想知道自己能否构建类似东西的销售人员，他的建议是打开 Claude Code，找到一个拖慢自己速度的任务，然后问 Claude 如何为它构建解决方案。

"如果一年前你告诉我，我会成为 Anthropic 的 go-to-market 产品经理，我会相当惊讶，"他说。"我从来没有技术能力参与这些对话。有了 Claude，我能够设计和构建不仅改善我自己日常工作流、也改善我更广泛团队工作流的东西。我有空间以更具创造性和战略性的方式工作，而且没有回头路。"

_立即开始使用 [Claude](https://claude.ai/redirect/claudedotcom.v1.0bcdc6c6-a409-458b-a176-322b43eb753d)。敬请期待"How Anthropic uses Claude"系列中的更多故事。_
