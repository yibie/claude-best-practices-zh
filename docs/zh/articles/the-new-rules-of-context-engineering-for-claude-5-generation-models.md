---
title: "Claude 5 代模型的上下文工程新规则"
source_url: "https://claude.dev/blog/the-new-rules-of-context-engineering-for-claude-5-generation-models/"
publisher: "claude.dev"
type: "blogPost"
date: "2026-07-24"
products: ["Claude Code","Claude Platform"]
read_time: 3
excerpt: "我们为更先进的模型删除了 Claude Code 系统提示词中超过 80% 的内容。如何将我们学到的经验应用到你在 Claude Code 中以及自建智能体时的上下文工程中。"
fetched_at: "2026-11-18"
---

# Claude 5 代模型的上下文工程新规则
我之前写过如何最好地[为最新一代 Claude 5 模型编写提示词](https://claude.com/blog/a-field-guide-to-claude-fable-finding-your-unknowns)，并与它们迭代协作，以发现你想构建的东西。

但当你向 Claude 发送一条消息时，提示词只是它获得的上下文的一小部分。你的大部分上下文是由系统提示词、Skills、CLAUDE.md 文件、记忆和其他来源组装而成的。我们称之为[上下文工程](https://www.anthropic.com/engineering/effective-context-engineering-for-ai-agents)，它对你在使用 Claude Code 或构建自己的智能体时产生的结果有很大影响。

与提示词不同，上下文会普遍地跨许多请求使用，因此它无法那么具体。你如何为 Claude 构建这些通用的提示词和指导，尤其是在你不知道用户的提示词可能是什么的情况下？

随着 Claude 自身能力的演进，这可能出奇地困难。最近，我们注意到在为最新一代 Claude 模型编写提示词的方式上出现了巨大跃升。对于 Claude Opus 5 和 Claude Fable 5 等模型，我们删除了 [Claude Code](https://claude.com/product/claude-code) 系统提示词中超过 80% 的内容，而我们的编码评估没有出现可测量的损失。

以下是我们学到的关于为这类新模型编写提示词的经验，以及你如何利用它来更新你的上下文工程。我们已将这些最佳实践放入 `claude doctor`；在 Claude Code 中使用 `/doctor` 命令来调整你的 skills 和 CLAUDE.md 文件的规模。

## 解除对 Claude 的束缚

总体而言，我们发现我们通过系统提示词、CLAUDE.md 文件和 skills 对 Claude Code 施加了过度约束。

例如，当我们阅读自己内部使用 Claude Code 的对话记录时，我们看到单个请求中存在几条相互冲突的信息，比如“酌情保留文档”，或“不要添加注释”，因为我们的系统提示词、skills 和用户请求彼此冲突。

![一个组装好的上下文，包含一行系统提示词“酌情保留文档”、一行 skill“不要添加注释”，以及一条用户请求“就让它像旧的那样工作”。](https://claude.dev/media/a0c1f3923f1e92004785e35257d3feed5081264767d0a99fa5eb397e2fb6f2e2.png)

一般来说，Claude 能够解读用户的意图以得出正确答案，但 Claude 必须先更仔细地思考这些重叠且冲突的信息，才能决定该怎么做。

虽然这些约束曾经是避免最坏情况所必需的，但我们后来发现可以删除其中许多约束，让模型转而利用周围的上下文和判断力。

此外，Claude Code 现在拥有多得多的工具。Claude 过去依赖 CLAUDE.md 作为记忆、信息和指导的来源。现在我们有了记忆、artifacts 和 skills，Claude 可以用它们来创造跨会话加载和共享上下文的新方式。

## 过去与现在

有许多以前的上下文工程最佳实践已经变成了迷思。包括：

![六条旧规则被划掉，每条都指向其替代方案：给 Claude 规则 → 给 Claude 判断力；给 Claude 示例 → 设计接口；全部前置 → 使用渐进式披露；重复自己 → 简单的工具描述；记忆放在 CLAUDE.md 文件中 → 自动记忆；简单的规格说明 → 丰富的参考。](https://claude.dev/media/aaa82d5934e084f1e509ac1679c26d0d2338d6c995c1c2f349fc12b8a0fd1a9c.png)

### 过去：给 Claude 规则

### 现在：让 Claude 使用判断力

当我们最初推出 Claude Code 时，我们需要确保 Claude 避免最坏情况，例如删除文件。这意味着我们会给出特别强的指导，而这些指导可能并不总是成立。例如，在系统提示词中我们过去会说：

_在代码中：默认不写注释。永远不要写多段 docstring 或多行注释块——最多一行短注释。除非用户要求，不要创建规划、决策或分析文档——从对话上下文中工作，而不是中间文件。_

但对于某一部分提示词，这条指导会是错误的。就文档而言，用户可能有自己的偏好，或者非常复杂代码的特定部分可能需要多行注释块。

不过，如果没有这些针对旧模型的护栏，Claude 写的注释在许多情况下会不正确，我们不得不接受这种权衡。但更新的模型有更好的判断力，无需明确的规则就能很好地处理这些决策。

在新的系统提示词中我们说：_编写读起来像周围代码的代码：匹配其注释密度、命名和惯用法。_

### 过去：给 Claude 示例

### 现在：设计接口

工具使用的头号规则是给 Claude 提供如何使用它们的示例。对于我们的最新模型，我们发现提供示例实际上会把它们限制在某个探索空间内。

![之前：一个 TodoWrite 工具描述，约 9,100 个字符，包含何时使用的列表和示例。之后：一段简短描述“为当前会话创建并更新任务列表”，带有一个状态枚举 pending、in\_progress 和 completed，以及一条规则：同一时间只有一个任务处于 in\_progress。](https://claude.dev/media/8bb6f9365532bb8b19443ad00f230444087a452f776232d05045f1c6c63c3de8.png)

与其使用示例，不如更多地思考你的工具、脚本和文件的设计——Claude 有哪些参数，它们如何能更具表现力？

例如，在 Todo 工具示例中，仅将 status 列为 pending、in\_progress 和 completed 之间的枚举，就向 Claude 提示了如何使用它。关于保持一个条目处于 in\_progress 的说明有助于定义我们要求的行为。

### 过去：全部前置

### 现在：使用渐进式披露

由于 Claude Code 专注于编码，我们的系统提示词包含了如何进行代码审查和验证的详细信息。这些信息并不总是需要，但当需要时，它们是至关重要的信息。

此后，Claude Code 已经非常擅长使用渐进式披露——在正确的时间加载正确的上下文。例如，我们将验证和代码审查移入它们自己的 skills，Claude Code 可以有选择地调用它们。

但渐进式披露不仅仅用于 skills，我们也将其用于工具。我们的一些工具是“延迟加载”的，这意味着智能体必须先使用 ToolSearch 搜索它们的完整定义，然后才能使用它们。这使我们能够拥有更多工具（例如我们的 Task 工具），它们在需要之前不占用上下文。

同样的方法可以应用于你自己的 CLAUDE.md 和 Skill.md 文件。一个常见的迷思是，你想把这些文件做成一个中央仓库，收录你_可能_遇到的每一个已知实践，因为否则 Claude 就找不到它。相反，[考虑拥有一棵可以在正确时间加载的文件树](https://claude.com/blog/a-harness-for-every-task-dynamic-workflows-in-claude-code)。

### 过去：重复自己

### 现在：简单的工具描述

早期的 Claude 模型有时可能需要重复的指令，或者更可能听从其上下文窗口末尾的指令，而不是开头的指令。这意味着我们的系统提示词有时会在主系统提示词中引用工具，同时在工具描述中也有说明。

我们发现可以删除这些重复的示例，并将如何使用工具的说明放在工具描述中，而不是系统提示词中。

### 过去：记忆放在 CLAUDE.md 文件中

### 现在：自动记忆

我们过去鼓励用户通过使用 # 快捷键自动写入他们的 `CLAUDE.md`，将内容保存到 Claude 的记忆中。现在，Claude 会自动保存与工作和你相关的记忆。

### 过去：简单的规格说明

### 现在：丰富的参考

在计划模式中，Claude Code 严重依赖包含计划的 markdown 文件。将这些文件存储为计划有助于 Claude 在需要时参考它们。另一个类似的最佳实践是将规格说明存储在代码库中，供 Claude 在跨较长项目工作时参考。

但我们发现 Claude 能够处理越来越复杂的参考。Claude 可以引用由我们新的 artifacts 功能创建的 [HTML artifacts](https://claude.dev/blog/using-claude-code-the-unreasonable-effectiveness-of-html/)，而不是简单的 markdown 文件。

你也可以以代码的形式给 Claude 提供参考。规格说明也可以是一个详细的测试套件，或者另一个代码库中 Claude 可能移植的函数。

评分标准（rubrics）是另一种形式的参考。评分标准允许 Claude 通过使用[动态工作流](https://claude.com/blog/a-harness-for-every-task-dynamic-workflows-in-claude-code)并启动带有这些评分标准的验证器智能体，来尝试并验证你在特定领域的品味（例如，好的 API 设计是什么样的）。

## 将其应用到你的上下文中

把这一切综合起来，当你组装上下文时，它看起来是什么样的？

![上下文窗口被画成一个堆栈：你的提示词在最上面，然后是参考，例如 @ 提及的文件、规格说明、原型图、代码库和 artifacts，接着是系统提示词、CLAUDE.md 文件、skills 和记忆。](https://claude.dev/media/6c6b396594b664244e31fe5ba0c37619accc4777be823e699906c7a641dfcc60.png)

### 系统提示词

系统提示词与产品上下文紧密相关。它告诉 Claude 它在什么产品中运行、它在做什么。对于 Claude Code，你很可能永远不会修改它，但如果你在[构建自己的智能体执行框架](https://claude.com/resources/articles/building-agents-when-to-fold-subagents-into-your-main-agent-loop)，这就是你应该花大量时间的地方。

### CLAUDE.md

保持你的 CLAUDE.md 轻量，简要描述你的仓库是做什么的，但把大部分 token 花在代码库内部的陷阱上。例如，你可能组织代码，将类型保存在一个单一的大文件中，而不放在其他地方。避免陈述 Claude 通过查看你的文件系统或仓库就能知道的“显而易见”的事情。

大量使用渐进式披露，例如，如果你有若干关于如何验证工作的独特说明，创建一个验证 skill 并从你的 CLAUDE.md 中引用它。

### Skills

把 [skills 视为轻量级指南](https://claude.dev/blog/lessons-from-building-claude-code-how-we-use-skills/)，让 Claude 在需要时找到信息。避免让它们过度约束，除非在非常重要的领域。

对于较长的 skills，尽量使用渐进式披露——将其分成许多文件并拆分出来。

当 skills 编码了你、你的团队或产品特有的特定观点、知识或最佳实践时，效果最好。

### 参考

你可以 @ 提及文件，将它们作为参考包含进来。参考允许 Claude 查阅关于当前计划的深入信息。

这可能是规格说明文件、原型图，甚至整个代码库。一般来说，你应该优先选择代码形式的文件，因为它以 Claude 非常熟悉的语言为其提供清晰、高保真的说明。例如，设计的 HTML 原型图通常比设计的描述或截图产生更好的结果。

## 尝试简化

在你的系统提示词、skills 和 CLAUDE.md 文件中，你可能需要像我们一样进行简化。我们推出了一个名为 `claude doctor` 的新命令，它也能帮助你自动完成这项工作。有关专门为更先进模型编写提示词的更多细节，请查看我们的 [Fable 实战指南](https://claude.com/blog/a-field-guide-to-claude-fable-finding-your-unknowns)。

_本文由 Anthropic 技术团队成员 Thariq Shihipar 撰写。_
