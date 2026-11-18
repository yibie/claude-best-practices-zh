---
title: "使用 Claude Agent SDK 构建智能体"
source_url: "https://claude.com/resources/articles/building-agents-with-the-claude-agent-sdk"
publisher: "claude.com"
type: "blogPost"
date: "2025-09-29"
products: ["Claude Code","Claude Platform"]
read_time: 14
excerpt: "Claude Agent SDK 是一组工具，帮助开发者在 Claude Code 之上构建强大的智能体。本文中，我们将介绍如何上手，并分享我们的最佳实践。\n\n‍"
fetched_at: "2026-11-18"
---

# 使用 Claude Agent SDK 构建智能体

去年，我们与客户一同分享了[构建高效智能体](https://www.anthropic.com/engineering/building-effective-agents)的经验。此后，我们发布了 [Claude Code](https://claude.com/product/claude-code)，这是一个智能体式编程解决方案，最初是为了支持 Anthropic 内部的开发者生产力而构建的。

在过去的几个月里，Claude Code 早已远不止是一个编程工具。在 Anthropic，我们一直[用它](https://www.anthropic.com/news/how-anthropic-teams-use-claude-code)进行深度研究、视频创作和笔记记录，以及无数其他非编程应用。事实上，它已经开始驱动我们几乎所有主要的智能体循环。

换句话说，[驱动 Claude Code 的执行框架（harness）](https://claude.com/resources/articles/harnessing-claudes-intelligence)（即 Claude Code SDK）也能驱动许多其他类型的智能体。为了体现这一更宏大的愿景，我们将 Claude Code SDK 更名为 Claude Agent SDK。

在本文中，我们将重点介绍我们为何构建 Claude Agent SDK、如何用它构建你自己的智能体，并分享我们团队自身部署中总结出的最佳实践。

## 给 Claude 一台计算机

Claude Code 背后的[关键设计原则](https://www.youtube.com/watch?v=vLIDHi-1PVU)是：Claude 需要程序员每天都在使用的那些工具。它需要能够在代码库中找到合适的文件、编写和编辑文件、对代码进行 lint、运行代码、调试、编辑，有时还需要反复执行这些操作，直到代码成功运行。

我们发现，通过让 Claude 访问用户的计算机（经由终端），它就具备了像程序员那样编写代码所需的一切。

但这也让 Claude Code 中的 Claude 在_非_编程任务上同样高效。通过赋予它运行 bash 命令、编辑文件、创建文件和搜索文件的工具，Claude 可以读取 CSV 文件、搜索网页、构建可视化、解读指标，以及完成各种其他数字化工作——简而言之，就是创建拥有计算机的通用智能体。Claude Agent SDK 背后的关键设计原则就是给你的智能体一台计算机，让它们像人类一样工作。

## 创建新型智能体

我们相信，给 Claude 一台计算机，能够解锁构建比以往更高效智能体的能力。例如，借助我们的 SDK，开发者可以构建：

-   **金融智能体**：构建能够理解你的投资组合和目标，并通过访问外部 API、存储数据和运行代码进行计算来帮助你评估投资的智能体。
-   **个人助理智能体**：构建能够帮你预订旅行、管理日历，以及安排预约、整理简报等的智能体，方式是连接你的内部数据源并跨应用追踪上下文。
-   **客户支持智能体**：构建能够处理高度模糊的用户请求（如客服工单）的智能体，方式是收集和审查用户数据、连接外部 API、回复用户消息，并在需要时升级给人工处理。
-   **深度研究智能体**：构建能够在大规模文档集合中进行全面研究的智能体，方式是搜索文件系统、分析和综合来自多个来源的信息、跨文件交叉引用数据，并生成详细报告。

以及更多。从根本上说，SDK 为你提供了构建智能体的基础构件，适用于你想要自动化的任何工作流。

## 构建你的智能体循环

在 Claude Code 中，Claude 通常在一个特定的反馈循环中运作：收集上下文 -> 采取行动 -> [验证工作](https://claude.com/resources/articles/building-verification-loops-in-claude-code-with-skills) -> 重复。

![智能体反馈循环](https://assets.claude.com/763dc701846eff87b732b17b595de0a653bb356a.png)

智能体通常在一个特定的反馈循环中运作：收集上下文 -> 采取行动 -> 验证工作 -> 重复。

这为我们思考其他智能体以及应当赋予它们哪些能力提供了一种有用的方式。为了说明这一点，我们将通过一个示例来演示如何在 Claude Agent SDK 中构建一个邮件智能体。

## 收集上下文

在开发智能体时，你希望给它的不仅仅是一个提示词：它需要能够获取并更新自己的上下文。以下是 SDK 中的功能如何提供帮助。

### **智能体式搜索与文件系统**

文件系统代表了_可以_被拉入模型上下文的信息。

当 Claude 遇到大文件（如日志或用户上传的文件）时，它会决定通过 `grep` 和 `tail` 等 bash 脚本以何种方式将这些内容加载到上下文中。本质上，智能体的文件夹和文件结构成为了一种[上下文工程](http://anthropic.com/news/context-management)形式。

我们的邮件智能体可能会将之前的对话存储在一个名为"Conversations"的文件夹中。这样，当被问及这些对话时，它就可以在其中搜索以获取上下文。

### **语义搜索**

[语义搜索](https://www.anthropic.com/news/contextual-retrieval)通常比智能体式搜索更快，但准确性较低、维护难度更大、透明度也更低。它涉及将相关上下文"分块"，将这些块作为向量进行嵌入，然后通过查询这些向量来搜索概念。鉴于其局限性，我们建议从智能体式搜索开始，只有在需要更快的结果或更多变体时才添加语义搜索。

### **子智能体**

Claude Agent SDK 默认支持子智能体。[子智能体](https://docs.claude.com/en/api/agent-sdk/subagents)有两个主要用途。第一，它们支持并行化：你可以启动多个子智能体同时处理不同任务。第二，它们有助于管理上下文：子智能体使用自己[隔离的上下文窗口](https://claude.com/resources/articles/building-agents-when-to-fold-subagents-into-your-main-agent-loop)，只将相关信息返回给编排器，而不是它们的完整上下文。这使得它们非常适合需要筛选大量信息、而其中大部分信息并无用处的任务。

在设计我们的邮件智能体时，我们可能会给它一个"搜索子智能体"能力。邮件智能体随后可以并行启动多个搜索子智能体——每个针对你的邮件历史运行不同的查询——并让它们只返回相关摘录，而不是完整的邮件线程。

### **上下文压缩（compaction）**

当智能体长时间运行时，上下文维护变得至关重要。Claude Agent SDK 的 compact 功能会在上下文接近上限时自动总结之前的消息，这样你的智能体就不会耗尽上下文。这建立在 Claude Code 的 [compact 斜杠命令](https://docs.claude.com/en/docs/claude-code/sdk/sdk-slash-commands#%2Fcompact-compact-conversation-history)之上。

## 采取行动

一旦收集了上下文，你就会希望给智能体灵活的行动方式。

### **工具**

[工具](https://www.anthropic.com/engineering/writing-tools-for-agents)是智能体执行的主要构建块。工具在 Claude 的上下文窗口中非常突出，使其成为 Claude 在决定如何完成任务时考虑的主要行动。这意味着你应该有意识地设计工具，以最大化上下文效率。你可以在我们的博文[为智能体编写高效工具——借助智能体](https://www.anthropic.com/engineering/writing-tools-for-agents)中了解更多最佳实践。

因此，你的工具应该是你希望智能体执行的主要行动。了解如何在 Claude Agent SDK 中制作[自定义工具](https://docs.claude.com/en/api/agent-sdk/custom-tools)。

对于我们的邮件智能体，我们可能会将"`fetchInbox`"或"`searchEmails`"等工具定义为智能体的主要、最频繁的行动。

### **Bash 与脚本**

Bash 作为一个通用工具很有用，可以让智能体使用计算机完成灵活的工作。

在我们的邮件智能体中，用户可能在附件中存储了重要信息。Claude 可以编写代码来下载 PDF、将其转换为文本，并通过调用以下内容在其中搜索有用信息，如下图所示：

### **代码生成**

Claude Agent SDK 擅长代码生成——而且理由充分。代码精确、可组合且可无限复用，使其成为需要可靠执行复杂操作的智能体的理想输出。

在构建智能体时，请考虑：哪些任务通过以代码形式表达会受益？通常，答案会解锁显著的能力。

例如，我们最近在 [Claude.AI](http://claude.ai/redirect/website.v1.bdb29daa-1a07-41ec-87f6-579dc33634bd) 中推出的[文件创建](https://www.anthropic.com/news/create-files)功能完全依赖代码生成。Claude 编写 Python 脚本来创建 Excel 电子表格、PowerPoint 演示文稿和 Word 文档，确保一致的格式和复杂功能，而这些用其他方式很难实现。

在我们的邮件智能体中，我们可能希望允许用户为入站邮件创建规则。为此，我们可以编写在该事件上运行的代码：

### **MCP**

[Model Context Protocol](https://modelcontextprotocol.io/)（MCP）提供与外部服务的标准化集成，自动处理身份验证和 API 调用。这意味着你可以将智能体连接到 Slack、GitHub、Google Drive 或 Asana 等工具，而无需编写自定义集成代码或自行管理 OAuth 流程。

对于我们的邮件智能体，我们可能希望 `search Slack messages` 以了解团队上下文，或 `check Asana tasks` 以查看是否已有人被指派处理客户请求。借助 MCP 服务器，这些集成开箱即用——你的智能体只需调用 search\_slack\_messages 或 get\_asana\_tasks 等工具，MCP 会处理其余部分。

不断增长的 [MCP 生态](https://github.com/modelcontextprotocol/servers)意味着随着预构建集成的推出，你可以快速为智能体添加新能力，让你专注于智能体行为。

## 验证你的工作

Claude Agent SDK 通过评估其工作来完成智能体循环。能够检查并改进自身输出的智能体从根本上更可靠——它们能在错误累积之前发现错误，在偏离时自我纠正，并在迭代中变得更好。

关键在于给 Claude 提供评估其工作的具体方式。以下是我们发现有效的三种方法：

### **定义规则**

最好的反馈形式是为输出提供清晰定义的规则，然后解释哪些规则未通过以及原因。

[代码 lint](https://stackoverflow.com/questions/8503559/what-is-linting)是一种极佳的基于规则的反馈形式。反馈越深入越好。例如，通常生成 TypeScript 并对其进行 lint 比生成纯 JavaScript 更好，因为它为你提供了多个额外的反馈层。

在生成邮件时，你可能希望 Claude 检查邮件地址是否有效（如果无效，抛出错误），以及用户之前是否曾向对方发送过邮件（如果是，抛出警告）。

### **视觉反馈**

当使用智能体完成视觉任务（如 UI 生成或测试）时，视觉反馈（以截图或渲染的形式）会很有帮助。例如，如果发送带有 HTML 格式的邮件，你可以对生成的邮件截图，并将其反馈给模型进行视觉验证和迭代改进。模型随后会检查视觉输出是否与要求相符。

例如：

-   **布局** - 元素位置是否正确？间距是否合适？
-   **样式** - 颜色、字体和格式是否如预期呈现？
-   **内容层级** - 信息是否以正确的顺序呈现并具有适当的强调？
-   **响应式** - 看起来是否错乱或拥挤？（不过单张截图的视口信息有限）

使用像 Playwright 这样的 MCP 服务器，你可以自动化这个视觉反馈循环——对渲染的 HTML 截图、捕获不同的视口尺寸，甚至测试交互元素——所有这些都在智能体的工作流内完成。

![Claude 对智能体生成的邮件正文提供视觉反馈。](https://assets.claude.com/9b2ef8d28db1e66530e35fdad0ca91e8e3b86aeb.jpg)

来自大语言模型（LLM）的视觉反馈可以为你的智能体提供有用的指导。

### **LLM 作为评判者**

你也可以让另一个语言模型基于模糊规则来"评判"智能体的输出。这通常不是一种非常稳健的方法，并且可能有较大的延迟代价，但对于任何性能提升都值得付出成本的应用来说，它可能会有帮助。

我们的邮件智能体可能会有一个单独的子智能体来评判其草稿的语气，看它们是否与用户之前的消息风格相符。

## 测试和改进你的智能体

在你多次走完智能体循环之后，我们建议测试你的智能体，并确保它为其任务做好了充分准备。改进智能体的最佳方式是仔细查看其输出，尤其是失败的情况，并将自己置身其中：它是否拥有完成任务的[合适工具](https://www.anthropic.com/engineering/writing-tools-for-agents)？

以下是在评估你的智能体是否具备完成其工作的充分能力时，可以提出的其他一些问题：

-   如果你的智能体误解了任务，它可能缺少关键信息。你能否调整搜索 API 的结构，使其更容易找到所需了解的内容？
-   如果你的智能体反复在某个任务上失败，你能否在工具调用中添加正式规则来识别并修复该失败？
-   如果你的智能体无法修复其错误，你能否给它更有用或更有创意的工具，以不同的方式处理问题？
-   如果你的智能体在添加功能时性能发生变化，请基于客户使用情况构建一个有代表性的测试集，用于程序化评估（eval）。

## 上手（onboarding）

Claude Agent SDK 通过让 Claude 访问一台可以编写文件、运行命令并迭代其工作的计算机，使构建自主智能体变得更加容易。

牢记智能体循环（收集上下文、采取行动、验证工作），你就可以构建可靠、易于部署和迭代的智能体。

你今天就可以[上手](https://docs.claude.com/en/api/agent-sdk/overview) Claude Agent SDK。对于已经在使用该 SDK 构建的开发者，我们建议按照[本指南](https://docs.claude.com/en/docs/claude-code/sdk/migration-guide)迁移到最新版本。

## 致谢

作者 Thariq Shihipar，Molly Vorwerck、Suzanne Wang、Alex Isken、Cat Wu、Keir Bradwell、Alexander Bricken 和 Ashwin Bhat 提供笔记与编辑。
