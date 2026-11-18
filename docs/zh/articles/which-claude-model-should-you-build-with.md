---
title: "该用哪个 Claude 模型来构建？"
source_url: "https://claude.dev/blog/which-claude-model-should-you-build-with/"
publisher: "claude.dev"
type: "blogPost"
date: "2026-11-09"
products: ["Claude Platform","Claude Code"]
read_time: null
excerpt: "如何根据任务、成本和 effort 级别，在 Claude Fable 5.2、Opus 5.5、Sonnet 5.5 和 Haiku 5.5 之间做出选择。"
fetched_at: "2026-11-18"
---

# 该用哪个 Claude 模型来构建？

当前 Claude 产品线有四款正式可用的模型：Claude Haiku 5.5、Claude Sonnet 5.5、Claude Opus 5.5 和 Claude Fable 5.2。Claude Mythos 5.2 是我们在网络安全与生命科学研究领域能力最强的模型，可通过我们的验证计划获取。

如果你在 Claude Platform 上构建，或在 [Claude Code](https://claude.com/product/claude-code) 中工作，你可能会想：日常任务该用哪个模型？本文会帮你回答这个问题，并说明如何权衡取舍。

**FIG A**一张小巷的照片，由 Claude Haiku 5.5、Sonnet 5.5、Opus 5.5 和 Fable 5.2 分别用代码渲染。每张图都是模型编写的 Python 程序，调用它同样编写的绘图引擎，从第一层到完成逐层展示。演示：Lance Martin。

## TL;DR

简短的回答是：大多数工作都应该从 Opus 5.5 的默认 effort 级别 `medium` 开始。

它成为 Claude Code 默认模型是有原因的。它的每输入和输出 token 成本只有 Fable 5.2 的一半，也是我们建议大多数编码和知识工作起步使用的模型。

在此基础上：

-   对于范围明确的日常工作，比如修一个 bug 或按规格实现一个功能，可以降到 Sonnet 5.5。不过，有清晰的规格并不意味着就该用 Sonnet。一次迁移或一次性能优化可以有清晰的规格，但难度依然足以需要 Opus 5.5，重大任务则需要 Fable 5.2。
-   对于最简单的高用量工作，比如分类、路由和抽取，可以进一步降到 Haiku 5.5。Haiku 5.5 也适合用于为更大模型处理旁支任务的子智能体。
-   对于编码、金融和科学领域最难的技术项目，可以升到 Claude Fable 5.2。当 Opus 5.5 在 `high` 下仍不够用时，或者需要[长时间无人值守的运行](https://claude.dev/blog/safely-scaling-multi-agent-teams-with-fable-5-2/)时，也升到 Fable 5.2。

在更换模型之前，先试试调整 effort 级别。对于成本和能力来说，它是一个更精细的旋钮。超过 `high` 之后，再升一级 effort 的成本可能和换一个更大的模型相当，所以要在你自己的工作上对比两者。如果你已经超过 `high`，不妨试试在更低的 effort 下使用再上一级模型。反过来，降一级也可能以更低的成本得到你需要的结果。

当模型需要思考更久、调用更多工具或更多地检查自己的工作时，更高的 effort 会有帮助。但要记住，它也会增加延迟。此外，提高 effort 级别不会让模型获得它本来不具备的知识或技能。要获得这些，你仍然需要升级模型。

## 按任务选择模型

| 任务 | 起始模型 | 起始 effort | 原因 |
| --- | --- | --- | --- |
| 日常工程与调试。多 PR 的功能开发 | Opus 5.5 | `medium`（默认），然后 `high` | 在日常任务上兼顾成本与能力。 |
| 分类、路由、打标签和高用量抽取 | Haiku 5.5 | `medium`（默认） | 模型家族中成本和延迟最低。 |
| 搜索文件、读取日志或做摘要的子智能体 | Haiku 5.5 或 Sonnet 5.5 | 该模型的默认值 | 错误答案很容易发现，而且判断性决策本来就由主模型负责。 |
| 聊天和交互式会话 | Sonnet 5.5（高用量简单聊天可用 Haiku 5.5） | `low` 或 `medium` | Sonnet 5.5 很快，尤其是在 `low` 或 `medium` effort 下。 |
| 范围明确的编码，比如修 bug、功能迭代和规格驱动的工作 | Sonnet 5.5 | `medium`，更难的任务用 `high` | 它能很好地处理范围明确的任务，token 价格只有 Opus 5.5 的一半。 |
| 日常文档、幻灯片和电子表格 | Sonnet 5.5 | `high`（默认；Claude Code 中为 `medium`） | 它迭代快，设计感强。对于复杂的财务模型，或基于大量源材料构建的文档，从 Opus 5.5 开始。 |
| 反复运行的智能体任务，比如调查、审查或起草 | Sonnet 5.5 | `medium` | 定义明确、重复性的任务很少需要更大的模型。 |
| 计算机使用和重度依赖视觉的工作流 | Opus 5.5 | `medium` | 这类运行是围绕大量截图和图像的长智能体循环，正是 Opus 5.5 擅长的长时间智能体式工作。 |
| 重大重构和迁移、架构规划，以及领导大量子智能体 | Fable 5.2 | `medium`，然后 `high`（API 默认为 `high`） | 它是 Anthropic 在技术领域能力最强的正式可用模型。 |
| 深度研究，以及科学或定量分析 | Fable 5.2 | `medium`，然后 `high`（API 默认为 `high`） | 它为编码、金融和科学领域最难的技术项目而打造。 |
| 你还不确定 | Opus 5.5 | `medium`（默认） | Claude Code 在 Pro、Max、Ultra、Team、Enterprise 和 Anthropic API 上默认使用它，平台文档也推荐它作为起点。 |

## 四款模型对比

|  | Haiku 5.5 | Sonnet 5.5 | Opus 5.5 | Fable 5.2 |
| --- | --- | --- | --- | --- |
| **为……而打造** | 高用量、成本敏感的任务 | 针对范围明确任务的快速、可靠帮助 | 我们处理复杂编码和知识工作的日常主力 | 最具野心、开放式的技术工作 |
| **相对延迟** | 最快 | 快 | 中等 | 中等 |
| **每百万 token 输入 / 输出** | 提示词不超过 100K token 时为 $0.10 / $0.50，超过 100K 时为 $0.50 / $2.50 | $2 / $10 | $4 / $20 | $8 / $40 |
| **每百万 token 缓存读取** | 100K 以内 $0.01，超过 100K 为 $0.05 | $0.10 | $0.20 | $0.20 |
| **上下文窗口** | 1M token | 1M token | 1M token | 1M token |
| **最大输出** | 128K token | 128K token | 128K token | 128K token |
| **API 上的思考** | 自适应，默认开启，可以关闭 | 自适应，默认开启；`between_tools` 跳过前置思考 | 自适应，始终开启 | 自适应，始终开启 |
| **API 上的默认 effort**（Claude Code 可能不同；`/effort status` 可查看你的设置） | `medium` | `high`（Claude Code 中为 `medium`） | `medium` | `high`（Claude Code 中为 `medium`） |
| **快速模式** | 否 | 否 | 是 | 是 |

价格为 Claude API 标价。基准测试结果见 [Fable 5.2 页面](https://www.anthropic.com/claude/fable)。

**FIG B**Claude Fable 5.2、Opus 5.5、Sonnet 5.5 和 Haiku 5.5 各自构建同一个作品集网站，并排展示。演示：Addy Osmani。

## 权衡取舍

在模型之间做选择时，你是在做权衡。例如，选择更大的模型，就是在能力与延迟之间做取舍。以下是需要思考的主要权衡。

### 能力与每个完成任务的总成本

一般来说，更大的模型每 token 成本更高、能力更强，但在任务层面，成本与能力的权衡并非普遍成立。

每 token 价格更高，并不总意味着每个任务成本更高，或结果更好。正如我们在[《花好你的 effort》](https://claude.dev/blog/spending-your-effort/)中展示的，在 Anthropic 对 Terminal-Bench 3.0 的运行中，上一代 Fable 5.1 在 `max` 下得分 58.0%，而 Opus 5.5 在 `high` 下以一半的 token 得分 58.9%。

在最难的工作上，价格差距可能缩小。在 FrontierCode 2.0 上，Fable 5.2 在 `high` 下的得分与 Opus 5.5 在 `max` 下大致持平（45.3% 对 45.5%），而每个任务成本约为一半。所以，在困难任务上把 Opus 5.5 提到 `high` 以上之前，先测试 Fable 5.2。对于日常工作，Opus 5.5 在 `medium` 下仍然是起点。基准测试结果见[发布文章](https://www.anthropic.com/claude-fable-and-mythos-5-2)。

不过，Claude Platform 的[成本与智能度量](https://platform.claude.com/docs/en/about-claude/models/optimizing-for-cost-and-intelligence)也显示了小模型的局限。它们通常在高用量、输出可校验的工作上表现良好，但不太适合长时间的智能体循环。

比较两个模型时，既要为你任务集中最难的任务定价，也要为典型任务定价，因为最难的任务占了大部分花费。在一个包含 20 道题的搜索基准测试中，两道题占了 43% 的花费。

**FIG C**Fable 5.2 展示游戏引擎如何构建一个世界。它以十六种外观绘制同一个 3D 场景，从线框图和像素艺术到光线追踪，并为每种技术加上标注。演示：Dan Fein。

### 延迟与准确率

更快的配置完成得更早，但也可能漏得更多。在选择模型和 effort 级别之前，先想清楚一个人能等多久。对于需要人等待的回复，从 Sonnet 5.5 的 `low` 或 `medium` 开始。

通常，下一代模型比前代更快。Fable 5.2 生成输出的速度比 Fable 5.1 快最多 30%。Sonnet 5.5 比 Sonnet 5 快 30%。

Effort 级别与延迟大致相关。判断你获得的准确率是否值得额外的延迟。例如，在 SWE-bench Pro 上，Opus 5.5 在 `medium` 下的得分比 `high` effort 低约 2.5 分，成本约为 70%。在 `low` 下得分低约 8 分，成本约为三分之一。在 `xhigh` 下得分高约 1.4 分，成本是 `high` 的 2.5 倍。

通常，提供一种自我校验的手段，比调整 effort 级别更具成本效益，增加的延迟也更少。当模型对某项任务不够好时，按以下顺序采取措施：

1.  确认模型能够[校验自己的工作](https://claude.com/resources/articles/building-verification-loops-in-claude-code-with-skills)，比如通过测试、构建或调用端点的脚本。
2.  将 effort 提高一级。
3.  换到上一级模型，从比你在较小模型上使用的更低的 effort 级别开始。

如果你能自动检查结果，就以低级别运行所有任务，只把失败的任务以高级别重跑。在同一个 SWE-bench Pro 子集上，Opus 5.5 在 `low` 下运行、失败任务以 `high` 重跑，通过了约 97% 的任务，每个约 $0.17；而所有任务都用 `high` 时为 95.3%，每个 $0.29。

如果你需要同一模型更快回复，可以花钱买速度，而不是放弃能力。在 Claude API 上，Opus 5.5 和 Fable 5.2 都提供[快速模式](https://platform.claude.com/docs/en/build-with-claude/fast-mode)，以溢价获得更高的输出速度。

### 上下文与成本

当前这一代的每个模型都有 1M token 的上下文窗口。大上下文有助于模型完成任务，但它在每一轮都会产生成本，因为每一轮都会重新发送它。话虽如此，[在长时间运行中，你的大部分输入都按缓存读取计费](https://claude.com/blog/claude-opus-5-5-built-for-coding-sessions-that-use-more-context)。

Opus 5.5 的缓存读取为每百万 token $0.20，Sonnet 5.5 为 $0.10。Fable 5.2 收取同样的 $0.20，所以在一次长时间、缓存密集的运行中，Fable 与 Opus 的差距归结为未缓存输入和输出，Fable 在这两项上每 token 成本是两倍。

在[《Opus 5.5 上一个任务要花多少钱》](https://claude.dev/blog/what-a-task-costs-on-opus-5-5/)中，一轮在 150K token 上下文下的缓存读取成本约为 $0.03。在 20K 时约为 $0.004。

由此得出的一个结论是：主模型越大，精简的主上下文就越重要。把昂贵模型的上下文留给决策，让更便宜的子智能体去做冗长的阅读。

Haiku 5.5 是唯一一个 token 价格随提示词长度变化的模型。不超过 100K token 的提示词按较低档计费，超过 100K 的提示词按五倍费率计费。长提示词档的价格仍然是 Sonnet 5.5 每 token 价格的四分之一。所以 Haiku 5.5 在短提示词上最划算，其输入价格只有 Sonnet 5.5 的二十分之一。

当每次调用都需要长提示词时，要比较 Haiku 5.5 与 Sonnet 5.5 的每个完成任务总成本，而不是标价。

## 混用模型

**FIG D**一个项目，四个模型，各负责一类工作。Claude Fable 5.2 把一家网店从 JavaScript 迁移到 TypeScript，Opus 5.5 构建月度订阅。Sonnet 5.5 编写产品页面，Haiku 5.5 对客户消息分类。Opus 5.5 在 Fable 5.2 的新代码就位后开始它的功能。演示：Dan Fein。

### 在自然的断点处切换

提示词缓存属于写入它的模型。你在新模型上的第一轮会为整个对话支付缓存写入价格。为了让这一轮更小，先在 Claude Code 中运行 `/compact`，或者用一份简短的书面计划开启新会话。在 API 上，用到目前为止的工作摘要而不是完整历史来开启新模型的对话。

每个思考块都记录了产生它的模型，而每个模型只读取部分其他模型的思考块。在 Claude API 和 Google Cloud 上的 Claude Models（Google 托管）上，Opus 5.5 读取 Sonnet 5.5 和 Haiku 5.5 的思考块。Sonnet 5.5 读取 Haiku 5.5 的。Fable 5.2 读取 Opus 5.5、Sonnet 5.5 和 Haiku 5.5 的。在 Claude API 上，Fable 5.1 读取 Opus 5.5 的。

降一级会丢失先前的推理，因为模型从不读取比它更高一级模型的思考块。其他切换也可能丢失。当新模型无法读取先前模型的思考块时，API 会丢弃它们，请求仍然成功。新模型随后在没有这些推理的情况下工作。

[保留思考](https://platform.claude.com/docs/en/build-with-claude/preserved-thinking)列出了所有情况。从 Fable 5.2 切换到任何其他正式可用模型，都会丢弃它的推理。

### 让子智能体使用更小的模型

[子智能体在自己的上下文窗口中运行](https://claude.com/resources/articles/subagents-in-claude-code)，并交回一份摘要。你按其运行模型的费率为其 token 付费。在 Claude Code 中，在子智能体的定义里设置 `model: haiku` 或 `model: sonnet`。`CLAUDE_CODE_SUBAGENT_MODEL` 环境变量为未指定模型的子智能体设置默认值。

将以下内容保存为 `.claude/agents/log-reader.md`：

CODEMarkdown

\---
name: log-reader
description: Reads test output and logs, and reports each failing case. Use after a test run.
tools: Read, Grep, Glob, Bash
model: haiku
---

Read the logs you're given. For each failure, report the file, the test name and the first error line. Don't edit any files.

让小模型做那些错误很容易发现的工作，比如查找文件、运行测试和读取日志。把代码编辑和判断性决策留给主模型。当小模型误读搜索结果时，主模型会打开错误的文件并在上面消耗 token。

**FIG E**一位查看者请求一个图层，比如高程、自行车路线、雾或温度。Opus 5.5 规划工作，并行的 Haiku 5.5 子智能体在共享地图上绘制各个部分。温度为示意，雾为印象而非预报。地图数据 © OpenStreetMap 贡献者；高程来自 USGS 3DEP 激光雷达。演示：Lance Martin。

在当前版本的 Claude Code 中，内置的 Explore 子智能体运行在你的会话模型上，而不是始终运行在 Haiku 上。在 Claude API 上，该模型上限为 Opus。为了让探索保持低成本，定义你自己的名为 `Explore` 的子智能体，并设置 `model: haiku`。你可以用 `ANTHROPIC_DEFAULT_HAIKU_MODEL` 固定 `haiku` 别名所使用的模型。

在 Anthropic API 上，`haiku` 别名现在解析为 Haiku 5.5，需要 Claude Code v2.1.293 或更高版本。在 Amazon Bedrock、Google Cloud、Microsoft Foundry 和 Claude Platform on AWS 上，它仍然解析为 Haiku 4.5。Claude Code 的[模型配置](https://code.claude.com/docs/en/model-config)文档有详细说明。

Claude Code 还有 `opusplan` 别名，它在计划模式下用 Opus 规划，然后用 Sonnet 执行计划。这会把你的代码编辑放在 Sonnet 上。上面的建议则相反。它把代码编辑留在主模型上，只把错误容易发现的工作交给更小的模型。在把 `opusplan` 设为默认之前，先在你自己的任务上测量它。

### 把困难决策上报给顾问

[顾问工具](https://platform.claude.com/docs/en/agents-and-tools/tool-use/advisor-tool)（beta）将一个更快、更便宜的执行器模型与一个更强的顾问模型配对。执行器运行任务，并可在中途向顾问寻求指导。大部分 token 按执行器的费率计费。只有当顾问提供了执行器所缺乏的能力、且执行器请求建议时，顾问才会提供帮助，而在低 effort 下它请求建议的频率更低。

可能划算的场景：大多数轮次都是常规工作的智能体式工作。平台的成本指南持谨慎态度：在其顾问表的四组配对中，没有一组明显胜过单独使用执行器，而且顾问只有在执行器咨询它时才能提供帮助。先测量执行器的咨询率。检查你的执行器接受哪些顾问。例如，Sonnet 5.5 执行器接受 Fable 5.2、Opus 5.5、Opus 5 和 Sonnet 5.5，而 Fable 5.2 执行器只接受 Fable 5.2 或 Mythos 5.2。

收益不大的场景：其中一组配对是在一个内部编码基准测试上，使用 `high` 下的 Opus 5.5 执行器搭配 Fable 5.1 顾问。它得分 90.1%，每次尝试 $2.92。这比单独使用 `high` 下的 Opus 5.5 高 1.7 分，成本约为 2.1 倍。这样的提升处于运行间噪声的边缘，大致相当于提高 effort 本可以带来的收益。

### 把批量工作交给更便宜的工人

上面的子智能体处理旁支任务，同时由一个主模型保持主线。这种模式适用于超出单个上下文窗口的工作。一个顶级模型牵头，拆分任务，把各部分并行交给许多更便宜的工人，并合并返回的结果。在一个覆盖约 2200 万 token 源代码的内部缺陷搜索基准测试中，由 Opus 5.5 牵头、Sonnet 5.5 工人（最多同时 25 个）组成的方案，比单独使用默认 effort 的 Opus 5.5 成本低约三分之一。得分大致相同。

在 Claude Platform 上，Claude Managed Agents 中的[多智能体编排](https://platform.claude.com/docs/en/managed-agents/multiagent-orchestration)为你提供一个协调器智能体和一组工人。对于一条依赖步骤链，或能放进一个上下文窗口的工作，跳过它。在那里，规划和合并的成本超过了它们节省的成本。[《何时把子智能体并入主智能体循环》](https://claude.com/resources/articles/building-agents-when-to-fold-subagents-into-your-main-agent-loop)讨论了何时一个智能体循环胜过一组子智能体。

## 迁移前检查兼容性

模型选择主要是能力和成本的问题，但你并不总能只改模型名而不做其他改动。当前每个模型都支持工具调用和图像输入，但在把一个请求从一个模型移到另一个模型之前，有一些差异需要测试。

-   **Fable 5.2 将保留思考扩展到每个 API 账户。** 当 Fable 5.2 思考块之前的任何内容发生变化时，包括系统提示词、工具或更早的消息，API 会以 400 错误拒绝请求，除非你选择丢弃受影响的思考。如果你通过 Claude Code、Claude Agent SDK 或 [Claude Managed Agents](https://claude.com/platform/claude-managed-agents) 构建请求，则无需做任何改动。如果你自己的代码会编辑历史，请保持只追加，并在切换前测试。
-   **思考。** Opus 5.5 和 Fable 5.2 始终思考，关闭思考的请求会返回错误。Sonnet 5.5 默认思考，`between_tools` 将思考限制在工具调用之间的间隙。Haiku 5.5 默认思考，你可以在 `high` effort 或以下关闭思考。在所有这些模型上，都要按 `type` 读取内容块，因为响应可能以思考块开头。
-   **强制工具调用。** 在 Sonnet 5.5、Opus 5.5 和 Fable 5.2 上，`tool_choice` 为 `any` 或 `tool` 会返回 400 错误。发送 `auto`，将工具标记为 `strict: true`，并在提示词中说明何时使用它。
-   **计算机使用。** Opus 5.5、Sonnet 5.5、Haiku 5.5 和 Fable 5.2 仅通过 Claude API 和 Google Cloud 上的 Claude Models（Google 托管）上的 `computer_toolset_20260801` 工具集支持计算机使用。
-   **Haiku 4.5 到 Haiku 5.5。** 用 effort 级别替换 `budget_tokens`，并去掉非默认的 `temperature`、`top_p` 和 `top_k` 值，它们会返回 400 错误。以用户轮次结束 `messages`，因为让模型继续的最终助手轮次也会返回 400 错误。
-   **安全回退。** Opus 5.5、Sonnet 5.5 和 Fable 5.2 运行安全分类器，最常标记网络安全和生物学内容。在 Claude Code 中，被标记的请求可以在较旧的模型上重跑，转录记录中的通知会告诉你用的是哪个。Fable 5.2 保留 Fable 5.1 使用的回退模型。被标记的网络安全请求回退到 Opus 4.8，被标记的生物学请求回退到 Opus 5。

如果一个系统运行多个模型，就按其中最严格的那个来构建每个请求：保持历史只追加，发送 `tool_choice: auto` 并使用严格工具，按 `type` 读取内容块，并足够精确地编写提示词和工具描述，以满足最字面理解的模型。这样，一个步骤就可以在不改代码的情况下升一级或降一级。当路由规则很简单时，比如每种步骤类型用一个模型，就让代码来选择模型，而不是让模型来选择。

## 在你自己的工作上进行测量

已发布的结果，比如上面的 SWE-bench Pro 和 Terminal-Bench 数字，能给你一个起始模型。然后在提交之前，在你自己的任务上测试候选模型。

1.  抽取一批真实任务样本。为每个任务写一个结果检查，比如测试通过、工单关闭或行数正确。
2.  让每个候选模型在两到三个 effort 级别下运行，每个都在自己的会话中运行，这样各次运行不共享缓存。从每个响应的 `usage` 字段记录每个已完成任务的成本。
3.  绘制得分与花费的关系图。只有当多模型方案胜过图中每一个单模型点时，才保留它。
4.  在正式切换之前，让胜出方案在一部分真实流量上影子运行。

要在 Claude Code 中快速检查，用 `/model` 在两个模型上运行你待办列表中的一个任务，并比较 `/usage` 报告的结果。

## 了解更多

-   [《用 Claude Sonnet 5.5 构建》](https://claude.dev/blog/building-with-claude-sonnet-5-5/)介绍了何时选择 Sonnet 而非 Opus、定价、迁移和调优。
-   [《在 Claude 和 Claude Code 中充分发挥 Opus 5.5 的潜力》](https://claude.dev/blog/getting-the-most-out-of-opus-5-5/)介绍了如何为 Opus 5.5 编写提示词以及引导长时间运行。
-   [《Opus 5.5 上一个任务要花多少钱》](https://claude.dev/blog/what-a-task-costs-on-opus-5-5/)为 effort、模型选择和子智能体定价。
-   在 Claude 博客上，[为你的用例选择最佳 Claude 模型](https://claude.com/blog/claude-models-explained-choosing-the-best-model-for-your-use-case)和[在 Claude Code 中选择模型和 effort 级别](https://claude.com/blog/claude-model-and-effort-level-in-claude-code)有更深入的介绍。
-   在文档中，参见[选择模型](https://platform.claude.com/docs/en/about-claude/models/choosing-a-model)、[为成本与智能优化](https://platform.claude.com/docs/en/about-claude/models/optimizing-for-cost-and-intelligence)、[Effort](https://platform.claude.com/docs/en/build-with-claude/effort)、Claude Code [模型配置](https://code.claude.com/docs/en/model-config)和[子智能体](https://code.claude.com/docs/en/sub-agents)。
