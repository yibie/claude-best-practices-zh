---
title: "面向初创企业的 Claude Code 指南"
source_url: "https://claude.com/resources/articles/claude-code-guide-for-startups"
publisher: "claude.com"
type: "blogPost"
date: "2026-08-20"
products: ["Claude Code"]
read_time: 16
excerpt: "高速成长的初创企业如何借助 Claude Code 交付产品——来自十余家公司访谈的五条运营原则。"
fetched_at: "2026-11-18"
---

# 面向初创企业的 Claude Code 指南
## 在前沿工作的 AI 原生团队

如果你想一窥工作的未来，就去问问初创企业今天是如何运营的。我们正是这么做的。

我们与十余家高速成长的初创企业交流了它们如何使用智能体式编程工具来构建产品、扩展公司规模。这些初创企业正在改变规则：谁能构建、什么该被舍弃，以及如何在「如何构建」与「构建什么」之间形成飞轮。

而且它们的交付能力堪比规模十倍于己的组织。

![ClickHouse](https://assets.claude.com/002d4e2a6b94d0409b6dd64c8e91ac1e1fac0bd8.svg)

30%

更多功能交付

![Omni](https://assets.claude.com/ade4bc4e76a4151d0e0ba0e7c78fa7eaf24f39c3.svg)

2–3 倍

工程生产力

![Clay](https://assets.claude.com/267a4deeacbde106146d26ffa4ef2b08fbb3cb4f.svg)

100%

缺陷分诊自动化

![Artemis](https://assets.claude.com/4c49849997fa71df9c3086ce4dc48ed96d44abfd.svg)

每周 6,000+

个 PR

在本指南中，我们将深入探讨这些组织的独特部署方式，了解它们为快速交付并保持竞争优势所遵循的规则。

在此过程中，我们也将开始为一个问题寻找答案：如果一个组织从零开始、以 Claude Code 为基础构建其产品开发生命周期，那会是什么样子？

## 01 人人都能交付

智能体式编程降低了入门门槛，因此理解问题的人就能交付修复方案的第一版。

智能体式编程降低了非技术员工构建产品的入门门槛。借助 Claude Code，你无需精通编程语言或熟练使用 IDE，就能创建可用的功能。



> “不仅工程师的交付量大幅提升，非技术人员（比如我）也突然能够交付 UI 改动和其他产品改进。”

[Mads Lunau Liechti](https://www.linkedin.com/in/mads-lunau-liechti/)，联合创始人，[Parahelp](https://www.parahelp.com/)

对初创企业创始人来说，这有明显的好处。一方面，他们没有大型竞争对手那样的人员规模，所以必须「全员上阵」。但创始人追求的不仅是纯粹的人力——这些非技术团队成员还带来了领域专业知识。



> “Claude Code 改变了在 Crosby 做一名律师意味着什么。律师拥有最好的产品洞察，因为他们就是用户。看着他们大展身手，真是令人惊叹。”

[Ryan Daniels](https://www.linkedin.com/in/crosbyryan/)，联合创始人兼 CEO，[Crosby](https://crosby.ai/)

我们从 Heidi 的联合创始人兼 CEO Thomas Kelly 博士那里听到了同样的说法。



> “对我们来说，Claude Code 解决了传话失真的问题。过去一个新想法在团队中传递的方式是：有想法的人告诉 PM，PM 告诉设计师，设计师再告诉工程师……而想法的精髓不可避免地在这条链条中丢失。等到东西交付时，往往已经和那个人最初设想的相去甚远。而且这要花上几周时间。Claude Code 压缩了这条链条。真正理解问题的人可以提交一个 PR，并在需要专业知识的环节引入设计师和工程师。”

[Dr. Thomas Kelly](https://www.linkedin.com/in/tomkeykong/)，联合创始人兼 CEO，[Heidi](https://www.heidihealth.com/)

说「人人都能交付」很适合发一条 LinkedIn 帖子，但现实中如何运作？市场团队在批准拉取请求吗？法务团队在研究如何二分排查不稳定测试的细节吗？

我们得到的答案是，分工依然存在。市场人员仍然专注于市场，开发者仍然专注于开发。但至关重要的第一步——把一个想法变成可运行的原型，从 0 到 1——对所有人开放。

我们还看到，最有效的初创企业建立了机制，让这些贡献系统化，而不是听凭偶然或个人热情。

### 建立连接

让员工有使用 AI 的预期是一回事，让他们能访问 Claude Code 及其所需的工具是另一回事。



> “我们实际上并没有回避（让非技术员工做贡献），而是在朝这个方向走。我们的看法是，每个角色都在变成工程角色，因为你可以为此构建软件……所以我们招聘喜欢动手折腾、对构建感兴趣的人。”

[Kareem Amin](https://www.linkedin.com/in/kareemamin/)，联合创始人兼 CEO，[Clay](https://www.clay.com/)

在 Crosby，团队没有把律师带到 Claude Code 面前，而是把 Claude Code 带给律师——将它连接到他们熟悉、每天都在使用的工具和操作系统上。

Claude Code 桌面端的 MCP Connector Directory。

### 站会展示

在某个时刻，想法需要有机会被排入优先级，以便组织资源帮助其推向市场。对产品经理来说这条路很清晰——毕竟这是他们的工作——但对非技术员工来说就没那么清晰了。

Clay 设立了季度评审，在评审中考虑原型，并可以进入正式路线图。Clay 的一位市场推广团队成员就是这样构建了一个自主智能体：它访问你的网站、填写你的线索收集表单、计时响应所需时间、为体验打分，并生成一份性能报告。

Omni 有一个专门的 Slack 频道用于展示 Claude 生成的原型，包括高级技术人员在内的所有人都可以贡献。他们还践行「人人都能交付」的推论，即「人人都与客户交流」。



> 尽管工程师不会天然倾向于参加客户电话，Omni 仍有意让他们面对客户，因为这能更快地闭合反馈回路。

[Chris Merrick](https://www.linkedin.com/in/merrickchristopher/)，联合创始人兼 CTO，[Omni](https://omni.co/)

### 
Skills（技能）

「人人都能交付」与「零敲碎打」之间的界线可能很细。功能原型无论来自谁，仍然需要整合进一个感觉浑然一体的产品中。这正是 Skills（技能）——编码了团队标准与上下文的可复用指令文件——能发挥作用的地方，它有助于在开发过程日益民主化的同时，确保开发保持对齐。

“团队中的任何人都可以用我们的设计系统作为参考，通过 Claude Code 起草产品组件、营销材料或演示文稿素材。涉及产品的 AI 必须达到高得多的标准，而 Claude Code 帮助我们更精确地达到这一标准，”Heidi 的 Dr. Thomas Kelly 说。

它们还能让新开发者和非技术员工快速上手并投入工作。



> “……我们还有一个 Claude Code skills 的 GitHub 仓库，它充当共享知识库，可以快速引导一个 Claude Code 会话，带上已知的 Emergent 细节，比如数据库（和数据仓库）位置、一些 schema（信息）、整体公司上下文……与其在这里追求完美，不如接受略微过时的上下文文件，只要智能体能快速验证并纠正方向。”

[Mukund Jha](https://www.linkedin.com/in/mukund-jha-a1596413/)，联合创始人兼 CEO，[Emergent](https://emergent.sh/)



> “我们的工程师用 Claude Code 搭建了一个内部市场，汇集按角色组织的专用内部智能体，这样工程、交付和销售各自都能获得按照他们实际工作方式构建的工具。”

[Jack O'Hara](https://www.linkedin.com/in/jack-o-hara-/)，创始人兼 CEO，[Translucent](https://www.translucent.co/)

## 02 自动化枯燥工作

智能体承担生命周期中机械性的 80%，让工程师把时间花在真正需要判断的案例上。

自工业革命以来，所有公司都试图通过技术提升效率，但这些初创企业凭借采用的速度和深度脱颖而出。

这些创始人相信 AI 是他们使命中不可或缺的组成部分。许多人明确表示，智能体承担机械性的 80%，让工程师把时间花在真正需要判断的案例上。



> “所有人都在竞相构建 AI 产品。重建公司实际运营方式的人要少得多。后者才是更大的突破。Artemis Security 作为一家 AI 原生公司运营，而不是一家碰巧使用 AI 的公司。这极大提升了我们的速度，让我们能帮助客户以机器速度阻止攻击。”

[Shachar Hirshberg](https://www.linkedin.com/in/shachar-hirshberg/)，联合创始人兼 CEO，[Artemis Security](https://artemissecurity.com/)

具体来说，我们看到 AI 在这些企业的 SDLC 各阶段整合得比其他人更紧密，也有更多专门构建的智能体，旨在端到端地承接重复性任务。让我们分别看几个例子。

### AI 原生 SDLC

这些受访初创企业中，许多都实施了加速团队上手其智能体式编程流程的方法。例如，在 Emergent，Mukund 告诉我们：“入职第一天，新员工只需让 Claude 指向正确的 markdown 文件，就能引导完成整个开发环境搭建。如果 Claude 在上手过程中遇到任何损坏或过时的内容，它会更新该文件。”



Code Review 会为每个发现标注严重级别。

这些工程师需要快速上手，因为这些团队交付很快。



> “这里的工程师在编排智能体集群，在发现生产数据问题的当天就交付修复，并同时推进多个 PR。一位工程师用 Claude 子智能体并行推进了一个约 13 个工单的倡议，每个子智能体负责一个工单及其 PR。”

[Tanay Tandon](https://www.linkedin.com/in/tanaytandon/)，CEO 兼创始人，[Commure](https://www.commure.com/)

在这些组织中，Claude Code 不仅帮助生成代码，也帮助审查代码。“我们针对经过审核的技术与合规框架运行自动化代码审查，标记关键问题，并在任何内容交付前将建议的改动路由给合适的审查者，”Heidi 的 Dr. Kelly 说。

其中一些组织还为代码审查、测试和 CI 构建了自定义智能体。这些初创企业相当重视[构建循环](https://claude.com/resources/articles/getting-started-with-loops)，而不只是部署代码。

“我最喜欢的（智能体）是‘Translucent 代码审查员’，它会分散到一个改动的各个部分，从多个角度审查，并像我们的一位资深工程师那样综合结果，但比任何一个人都快，”Translucent 创始人 Jack 说。

Clay “……构建了一个智能体来处理……缺陷分诊，从第一遍排查到建议修复的代码改动，”Kareem 说。



Claude Tag 在 Slack 中接手一个值班线程，并在频道内报告进展。



> 这一点在 [ClickHouse](https://clickhouse.com/) 最为明显，**联合创始人兼 CTO Alexey Milovidov 报告**称，这家数据库公司已将几乎每个 SDLC 阶段变成自主循环。两个专门构建的智能体分别用于修复不稳定测试和发现缺失的测试覆盖率，如今已是 ClickHouse 仓库的第 2 和第 3 大贡献者。另有一组智能体负责运维，团队则用 Claude Code 来构建并迭代这些智能体本身。

### 用智能体加速流程

另一个一致的模式是，这些初创企业不仅在 Claude Code 中使用智能体循环来加速开发工作，还创建智能体来加速重复且往往枯燥的流程。

这通常是例行工作，以便将更多注意力集中在竞争优势、客户关系和营收增长上。我们看到 Claude 加速的最常见流程之一是自助式数据分析。

这些公司几乎每一家都有某种流程，以便用新鲜数据（包括非结构化数据）快速决策，这为初创企业生命中至关重要的转向提供了动力。

例如，Clay 构建了一个内部数据分析智能体，Heidi 则用 Claude Code 将客户和临床医生反馈与用量数据一起分类，以浮现对产品洞察重要的信号。

ClickHouse 和 Omni 都在其产品中打包了这类 AI 数据分析能力，全部由 Claude 驱动。

其他例子包括：用子智能体总结数千份法律文件（Crosby）、扫描理赔数据以标记各站点的异常（Commure），以及持续挖掘医院财务数据以发现任何分析师团队都无法及时捕捉的警示信号（Translucent）。



## 03 信任，但要验证

除非你有可靠的手段来监控和验证结果，否则你无法自动化一个流程。

这条规则是规则 2「自动化枯燥工作」的必要推论：除非你有可靠的手段来监控和验证结果，否则你无法自动化一个流程。



> Artemis Security 联合创始人 Dan Shiebler 表示，他们提升的部署速度之所以可行……“是因为我们在测试基础设施、代码库组织和团队知识系统上投入很深，让智能体能够端到端交付。这就是我们与 Claude 一起构建的飞轮：以正确的方式组织你的代码库、知识库和团队，每一份贡献都会产生复利。”

[Dan Shiebler](https://www.linkedin.com/in/dan-shiebler-10219b42/)，联合创始人，[Artemis Security](https://artemissecurity.com/)



> “早期我们给了 Claude 完全自主权，它就做了 AI 会做的事。它很快交付了看似合理的代码。问题是它会以看起来正确但实际不正确的方式偏离我们的架构。所以我们……写下了每一条不变量。我们如何界定问题。无论什么情况都必须成立的是什么。如何证明某件事可行，而不是相信一个自信的答案。567 行，写的是这个团队如何思考。”

[Victor Hunt](https://www.linkedin.com/in/victor-c-hunt)，联合创始人兼 CEO，[Zingage](https://zingage.com/)

需要说明的是，这些初创企业没有一家是让智能体合并到 main 然后听天由命。其中许多在高度监管的行业运营，需要强有力的治理框架。Cainex 是一个特别有说明力的例子，它将智能体与确定性检查相结合，读取病历并生成指导医院计费的编码。



> “在医疗编码中，错误的编码不是笔误。它是一个计费和合规事件。这一个事实决定了我们如何构建。”

[Uriah Israel](https://www.linkedin.com/in/uriah-israel/)，联合创始人兼 CTO，[Cainex](https://www.cainex.com/)

“以下是 Claude Code 为我们运行的循环。我们用智能体处理一批数据，审计员在内部应用中审查输出。他们不仅看到编码，还看到模型的推理过程，并对两者都发表评论……一切都经过版本管理且可审计，”他说。

“然后 Claude Code 接手。它直接从数据库中读取原始预测，以及每一条更正和评论。每条更正都按涉及的编码类型打上标签，因此 Claude Code 知道它面对的是诊断问题、操作问题还是其他类别，并能直接找到管辖该类编码的指南。

从那里，它找到智能体指令中产生错误的部分并加以修订，或者在案例确实是全新时编写新指南。每项改动都针对一组有版本的指令进行，并针对失败的记录进行测试。我们执行的规则是：修正原则，而不是修正示例，”他继续说道。

“然后是回测。一条记录可能有不止一种可接受的编码，所以这不是字符串匹配。检查结合了针对我们可接受集合的语义匹配，以及一个判断器来问‘这是真正的错误，还是只是另一条有效路径’，Claude Code 再在其上加入自己的比较。

它会在一个黄金集加上随机样本上运行候选改动，并在任何内容交付前暴露任何回归。返回的是一份简短清单：建议的修改、无法解决的记录，以及它希望得到回答的问题。工程师把时间花在真正困难的案例上，而不是机械性的 80%，”他说。

创始人可以从这个医疗计费特定工作流中得出许多通用的经验。

例如，Cainex 让领域专家定期审查和引导 Claude 的推理，并确保这些引导成为自我改进循环的一部分。然而，这些专家并不是逐例修复，他们的引导被用作自我改进循环的一部分。正如 Uriah 所说：“修正原则，而不是修正示例。”



循环会重复工作周期，直到满足停止条件。

另一个经验是，要勤勉地维护一个强大的评估「黄金集」，即团队用来验证智能体准确性的一组经过验证的问答对。每家初创企业都应为关键用例维护多套评估（eval），并定期更新，以便防止漂移并评估未来的模型。



> “（Claude Code）也改变了我们管理模型迭代速度的方式。新的视频和图像模型不断出现。每个模型在部署前都需要新的技能、评估、路由逻辑和生产测试。Claude Code 将这个周期从数天压缩到数小时，让我们能在同一会话中发现生产问题并部署修复……当你与人员规模十倍于你的公司竞争时，这种杠杆改变了一切。”

[Alex Mashrabov](https://www.linkedin.com/in/amashrabov)，联合创始人兼 CEO，[Higgsfield](https://higgsfield.ai/)

Uriah 提出的最后一点是，这个过程需要一些功夫。“它一开始并不是这么干净。我们的第一版过拟合了。它会通过编码特定案例来‘修复’问题，结果我们在积累补丁，而不是变得更聪明。我们改变了方法，强制使用通用原则，并限制一次改动中最多能引入多少具体细节。”

## 04 为重建而构建

模型能力在这些团队脚下不断变化，因此很少有东西被视为永久不变。

这些 AI 原生初创企业中，许多都处于持续重塑的状态。

AI 往往既是它们所构建之物的核心，也是它们构建方式的核心。由于模型能力持续演进，突破性的功能和关键的脚手架在成为沉没成本的那一刻就被舍弃。许多这类组织将这种持续重建视为竞争优势的一部分。

“我们在 Clay 的做法是，你先构建它，然后再构建一次，然后再构建一次。等到第四次构建时，你已经知道所有需要的东西，并且做对了。所以我们不一定丢弃东西。我们只是重建它：而这一次带着更多的清晰度，”Kareem 说。

“重建不是在新路径交付时就完成了。它是在旧路径消失时才完成。拆除工作在优先级竞争中总是输：它枯燥，而且不交付任何功能，”Commure 联合创始人 Tanay 说。“现在 Commure 的一位工程师只需调用一个 Claude skill，大意是‘对于每个已经向所有人发布的 feature flag，开一个 PR 移除它及相关代码’，然后工程师审查返回的结果。过去要消耗大量开发周期的迁移，现在只需一个计划和一次分发，几个小时就能完成。”



一个仓库，一个对象存储——三个可以同时工作的检出，各自在自己的分支上。

每个链接的 worktree 都是一个普通目录，带有自己检出的分支；三者共享 acme-web 内单一的 .git 对象存储。

Kareem 还将 Clay 护城河的一部分描述为持续重建、演进和创建自我改进循环的能力。

“我认为现在任何公司的护城河都在于它必须能自我改进。所以 Clay 是一个自我学习的营收引擎。你用得越多，我们就越了解谁是你最好的客户、你应该说什么、什么有效、什么无效，而这些都在随时间变化，”他说。“真正的竞赛是，谁能最快触达分发……这样你就能帮助每一位（客户），从而实现自我改进。”

在 [2026 年 5 月的 Code with Claude 活动](https://www.youtube.com/live/OFDm3T7pVlc?si=Z_RENcJSqm8H79aj)上，Harvey 应用 AI 负责人 Niko Grupen 谈到了每一波新的模型能力——涌现推理、智能体式自动化、规划与编排——如何要求对平台进行彻底重构。



> “如果你六个月前问我我们的架构是什么样，我会给出一个与今天根本不同的答案。如果我们不愿意说‘嘿，我们需要舍弃这个，转向智能体原生’，我们现在根本不可能在平台中拥有这些能力。”

[Niko Grupen](https://www.linkedin.com/in/nikogrupen)，应用 AI 负责人，[Harvey](https://www.harvey.ai/)

## 05 做原型、内部试用、产品化

用 AI 构建帮助这些初创企业创造出具有颠覆性的 AI 产品——这是其流程核心的飞轮。

这些初创企业中，许多都在开发流程的核心拥有一个关键飞轮。用 AI 构建帮助他们创造出具有颠覆性的 AI 产品。

当开发者推进其智能体式编程实践时，他们能更好地把握模型能力，并洞察执行框架（harness）设计在前沿如何演进。他们随后可以将这些灵感用于自己的智能体和产品。

“我们从（Anthropic 的）文件 vs 嵌入方法中获得灵感，这鼓励我们在自己的产品中保持简单。我们避免了很多本会来自 RAG 流水线的复杂性，”Omni 的 Chris 说。“我们还看到 Claude Code 的执行框架如何让用户并行做事，并将其中一些概念改编进了我们自己的 UI。”

这也有助于他们保持对自身产品性能的敏锐。

“因为我们的应用构建器在幕后也使用 Anthropic 模型，如果我们发现产品上出现某种行为……我们可以通过 Claude Code 在本地快速调试，判断这是模型行为还是执行框架问题。这极大地改善了我们的分诊周期，”Emergent 的 Mukund 说。

我们反复听到的模式是：用 Claude Code 构建一个内部智能体，在内部使用（内部试用），并根据反馈，通常使用 Claude API、SDK 或 Claude Managed Agents 将其提升为面向客户的产品。

“我们（在产品中）构建了自己的 AI 智能体，团队可以直接与之交互，包括 SQL 控制台中的一个智能体和一位 AI SRE。我们用 Claude Code 来构建并迭代这些智能体本身。为我们的客户提供 AI 体验的工具，部分就是用 AI 构建的，”ClickHouse 的 Alexey 说。

## 清单

本指南涵盖了很多内容。以下是将关键提示汇总在一页上：

第 1 章：人人都能交付

Claude 无法理解它看不到的东西。通过 [MCP](https://code.claude.com/docs/en/mcp) 或 CLI 将它连接到事实来源和团队每天使用的工具。

创建一个[公司插件市场](https://code.claude.com/docs/en/plugin-marketplaces)，让一位员工的最佳实践可以通过 skill 即时传递给另一位员工。在仓库的每个子目录中使用 CLAUDE.md 文件，记录该子目录特定的编码约定，每次都适用。使用 skills 处理按需的程序性工作流。

第 2 章：自动化枯燥工作

在一个仓库上设置 [Code Review](https://code.claude.com/docs/en/code-review)（研究预览版），对 PR 进行自动化审查。

将 [Claude Tag](https://claude.com/product/tag)（公开测试版）纳入你的 CI/CD 值班响应和缺陷分诊。

[动态工作流](https://code.claude.com/docs/en/workflows#orchestrate-subagents-at-scale-with-dynamic-workflows)可用于分发多个子智能体并行分析大量数据，或对另一个智能体的工作进行对抗性审查。

第 3 章：信任，但要验证

把不可改变的内容放进仓库根目录的 CLAUDE.md。

对更自主或长时程的工作，使用[循环](https://code.claude.com/docs/en/workflows)——即重复工作周期直到满足停止条件的智能体。

建立[创建和维护智能体评估](https://www.anthropic.com/engineering/demystifying-evals-for-ai-agents)的流程。

[钩子（hooks）](https://code.claude.com/docs/en/hooks)是用户定义的命令，在 Claude Code 生命周期的固定时点触发，可作为硬性关卡。当工作的某些组成部分需要确定性时使用它们。

第 4 章：为重建而构建

使用 [git worktrees](https://code.claude.com/docs/en/worktrees) 在仓库的隔离副本中运行重建，同时当前版本保持不变。这正是让「构建四次」变得廉价的原因。

对于非平凡的改写，在[计划模式](https://code.claude.com/docs/en/permission-modes#analyze-before-you-edit-with-plan-mode)下启动 Claude Code（/plan 或按 Shift+Tab）。Claude 会探索代码库并在写任何代码之前提出重建方案——你批准或调整方向。这是捕捉即将偏离你架构的重建的最廉价的地方。

## 前沿的初创企业在前沿构建

这些洞见来自在前沿构建的同行，我们希望你觉得它们实用且可操作。Claude 初创企业社区是灵感、最佳实践和建议的持续来源。你可以通过以下方式加入这个社区：

-   [订阅初创企业通讯并加入初创企业计划](https://claude.com/programs/startups)。
-   [收藏即将举行的 Claude Code 网络研讨会](https://academy.claude.com/code/webinars)。
-   [参加你附近的活动](https://luma.com/claudecommunity)
-   在 [Reddit](https://www.reddit.com/r/ClaudeAI/) 和 [Discord](https://discord.com/invite/6PPFFzqPDZ) 上贡献。
-   早期公司还可以申请 [Claude for Startups 计划](https://claude.com/programs/startups)以获得额度和支持。[了解该计划现在包含的内容](https://claude.com/resources/articles/were-expanding-the-claude-startups-program-to-help-founders-build)
