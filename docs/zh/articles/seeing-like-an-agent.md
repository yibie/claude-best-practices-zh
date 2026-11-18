---
title: "像智能体一样观察：我们如何在 Claude Code 中设计工具"
source_url: "https://claude.dev/blog/seeing-like-an-agent/"
publisher: "claude.dev"
type: "blogPost"
date: "2026-04-10"
products: ["Claude Code","Claude Platform"]
read_time: 10
excerpt: "了解 Claude Code 团队如何从模型的视角出发，设计、测试并演进工具。"
fetched_at: "2026-11-18"
---

# 像智能体一样观察：我们如何在 Claude Code 中设计工具

构建智能体执行框架（harness）时，最难的部分之一就是构造它的工具。

Claude 完全通过[工具调用](https://platform.claude.com/docs/en/agents-and-tools/tool-use/overview)来行动，但在 Claude API 中，可以用 [bash](https://platform.claude.com/docs/en/agents-and-tools/tool-use/bash-tool)、[skills](https://code.claude.com/docs/en/skills) 和[代码执行](https://platform.claude.com/docs/en/agents-and-tools/tool-use/code-execution-tool)等原语，以多种方式构造工具。（你可以在 [@RLanceMartin 的新文章](https://x.com/RLanceMartin/status/2027450018513490419)中进一步了解 Claude API 上的程序化工具调用。）

那么，你该如何设计智能体的工具？是给它一个像 bash 或代码执行这样的通用工具？还是给它五十个专用工具，每个用例一个？

要设身处地站在模型的角度思考，不妨想象你拿到了一道困难的数学题。为了解出它，你会想要哪些工具？这取决于你自己的技能水平！

纸笔是最低要求，但你会受限于手工计算。计算器会更好，但你需要知道如何操作那些更高级的功能。最快、最强大的选择是计算机，但你必须懂得如何使用它来编写和执行代码。

这是一个设计智能体的有用框架。你想给它与其自身能力相匹配的工具。但你怎么知道这些能力是什么？你要留心观察、阅读它的输出、不断实验。你要学会像智能体一样观察。

如果你正在构建智能体，你会面临和我们一样的问题：何时添加工具、何时移除工具，以及如何区分两者。以下就是我们在构建 Claude Code 过程中给出的答案，包括我们最初走错的地方。

## 用 ASKUSERQUESTION 工具改进引导式提问

![标题为“寻找最佳平衡点”的示意图：一条从“无结构”到“过于僵化”的光谱。修改后的 markdown 输出位于“无结构”附近（自由但杂乱，难以格式化）。ExitPlanTool 参数位于“过于僵化”附近（计划已经形成，所以问题来得太晚）。AskUserQuestion 工具高亮在中间（结构化、可组合，并有清晰的 UI 界面）。](https://claude.dev/media/047bf332e6ff4962c8faee154feb4060e1f5a2b0cc73cf5235f9ce8c1d9e3890.png)

在构建 AskUserQuestion 工具时，我们的目标是提升 Claude 提问的能力（通常称为引导式提问，elicitation）。

虽然 Claude 可以直接用纯文本提问，但我们发现回答这些问题似乎要花费不必要的时间。我们该如何降低这种摩擦，并提高用户与 Claude 之间的沟通带宽？

### 尝试 1：修改 ExitPlanTool

我们尝试的第一种方法，是给 ExitPlanTool 添加一个参数，让它在计划之外附带一组问题。这是最容易实现的修复，但它让 Claude 感到困惑，因为我们同时要求它给出计划，又要求它给出关于该计划的一组问题。如果用户的回答与计划内容冲突怎么办？Claude 是否需要调用 ExitPlanTool 两次？我们知道这个策略行不通，于是回到原点重新设计。（你可以在[我们关于提示词缓存的文章](https://x.com/trq212/status/2024574133011673516)中进一步了解我们为什么要做 ExitPlanTool。）

### 尝试 2：更改输出格式

接下来，我们尝试更新 Claude 的输出指令，让它输出一种稍作修改的 markdown 格式来提问。例如，我们可以要求它输出一组项目符号问题，并在方括号中给出备选项。然后我们可以解析该问题，并将其格式化为面向用户的 UI。

Claude 通常能产出这种格式，但并不可靠。它会附加多余的句子、丢掉选项，或者干脆放弃整个结构。于是我们转向下一种方法。

### 尝试 3：AskUserQuestion 工具

![Claude Code 终端中的 AskUserQuestion 工具：Paradigm、Theme、Snacks、Indentation 和 Submit 标签页，问题“Which programming paradigm do you prefer for this project?”，以及带编号的选项：Functional、Object-Oriented、Procedural、Mixed、Type something 和 Chat about this。](https://claude.dev/media/155e8e285e14309b55a9f5342ffd62d3bfb45be1a66d48c2496818836cb4062a.png)

最终，我们决定创建一个 Claude 可以在任何时候调用的工具，但会特别提示它在计划模式期间调用。当该工具触发时，我们会显示一个模态框来展示问题，并阻塞智能体循环，直到用户作答。

这个工具让我们能够要求 Claude 输出结构化结果，并帮助确保 Claude 给用户提供多个选项。它也为用户提供了组合这项功能的方式，例如在 [Agent SDK](https://platform.claude.com/docs/en/agent-sdk/overview) 中调用它，或在 Skills 中引用它。

最重要的是，Claude 似乎喜欢调用这个工具，而且我们发现它的输出效果很好。毕竟，即使设计得再好的工具，如果 Claude 不知道如何调用它，也是没用的。

这是 Claude Code 中引导式提问的最终形态吗？我们对此表示怀疑。随着 Claude 能力越来越强，服务于它的工具也必须随之演进。下一节将展示一个案例：曾经有帮助的工具开始成为阻碍。

### 随能力演进：从 todos 到 tasks

![标题为“从 todos 到 tasks”的示意图：左侧是一个带有检查清单（set up project、write tests、implement feature、deploy）的单个智能体。一条标有“models improve”的箭头指向右侧，那里智能体 A 和智能体 B 共享带依赖关系的任务：任务 1 和任务 2 已完成并汇入进行中的任务 3，随后是任务 4。](https://claude.dev/media/6ec2a2426b22bc0a627a34ed01cf7db43d6b9ea3b67f824363f8b3511e4e52e8.png)

我们最初发布 Claude Code 时，意识到模型需要一个[待办事项列表](https://platform.claude.com/docs/en/agent-sdk/todo-tracking)来保持正轨。待办事项可以在开始时写下，并在模型完成工作时逐项勾选。为此，我们给 Claude 提供了 TodoWrite 工具，它可以写入或更新待办事项，并将其展示给用户。

但即便在那时，我们也经常看到 Claude 忘记自己该做什么。为了适应这一点，我们每 5 轮插入一次系统提醒，提醒 Claude 它的目标。

随着模型改进，它们发现待办事项列表具有局限性。收到待办列表的提醒会让 Claude 认为它必须固守该列表，而不是在意识到需要改变方向时修改它。我们还看到 Opus 4.5 在使用子智能体方面变得强得多，但子智能体如何在共享的待办列表上协调呢？

看到这一点，我们用 [Task 工具](https://x.com/trq212/status/2014480496013803643)替换了 TodoWrite 功能。待办事项侧重于让模型保持正轨，而任务则帮助智能体彼此沟通。任务可以包含依赖关系、在子智能体之间共享更新，模型也可以修改和删除它们。

随着模型能力提升，你的模型曾经需要的工具现在可能正在约束它们。重要的是[不断重新审视先前的假设](https://claude.dev/blog/the-new-rules-of-context-engineering-for-claude-5-generation-models/)，判断需要哪些工具。这也是为什么坚持支持一小组能力特征相当相似的模型是有用的。

## 设计搜索界面

我们构建过的最具影响力的工具，是那些让 Claude 找到自己上下文的工具。

Claude Code 最初在内部发布时，我们使用 RAG：向量数据库会预先索引代码库，执行框架会在每次响应前检索相关片段并交给 Claude。虽然 RAG 强大且快速，但它需要索引和设置，并且在各种不同环境中可能很脆弱。最重要的是，Claude 是被*给予*这些上下文的，而不是自己找到上下文。

但如果 Claude 能在网上搜索，为什么它不能也搜索你的代码库呢？通过给 Claude 一个 Grep 工具，我们可以让它搜索文件并自行构建上下文。

随着 Claude 变得更聪明，只要给它合适的工具，它构建上下文的能力就越来越强。

当我们引入 [Agent Skills](https://agentskills.io/home) 时，我们将渐进式披露（progressive disclosure）的理念正式化，它允许智能体通过探索逐步发现相关上下文。

Claude 现在可以读取 skill 文件，而这些文件又可以引用模型能够递归读取的其他文件。事实上，Skills 的一个常见用途就是为 Claude 增加更多搜索能力，例如给它提供如何使用 API 或查询数据库的说明。

在一年时间里，Claude 从几乎无法自行构建上下文，发展到能够跨多层文件进行嵌套搜索，以找到它所需的确切上下文。

渐进式披露现在是我们常用的一种技术，用于在不添加工具的情况下添加新功能。下一节我们将解释原因。

## 渐进式披露：CLAUDE CODE GUIDE 智能体

Claude Code 目前有约 20 个工具，我们团队经常重新审视是否全部都需要，才能让 Claude 发挥最大效力。添加新工具的门槛很高，因为这会多给模型一个需要思考的选项。

例如，我们注意到 Claude 对如何使用 Claude Code 了解得不够。如果你问它如何添加 MCP，或者某个斜杠命令是做什么的，它无法回答。

我们本可以把所有这些信息都放进系统提示词，但考虑到用户很少问这些，这会增加上下文腐化（context rot），并干扰 Claude Code 的主要工作：写代码。

于是，我们尝试了渐进式披露：给 Claude 一个指向其文档的链接，让它可以在需要时加载并搜索。这有效，但 Claude 会把大段文档拉进上下文，只为找到一个用户本可一句话就得到的答案。

因此我们构建了 Claude Code Guide——一个每当用户询问 Claude Code 本身时 Claude 就会调用的子智能体。该子智能体在自己的上下文中进行文档搜索，遵循关于如何搜索、提取什么的详细指令，并且只交回答案。主智能体的上下文保持干净。

虽然这不是完美的解决方案（当你问 Claude 如何设置它自己时，它仍然可能困惑），但我们得以在不添加新工具的情况下，向 Claude 的行动空间添加内容。

### 像智能体一样观察是一门艺术，而非科学

为你的模型设计工具，既是科学，也是艺术。它在很大程度上取决于你使用的模型、智能体的目标以及它所运行的环境。

我们最好的建议？经常实验、阅读你的输出、尝试新事物。最重要的是，试着像智能体一样观察。

_立即开始使用 [Claude Code](https://claude.com/product/claude-code)。_

**_关于作者：_** _Thariq Shihipar 是 Anthropic 的技术员工，从事 Claude Code 相关工作。_
