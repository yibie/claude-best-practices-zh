---
title: "Brex 如何借助 Claude Code 提升代码质量与生产力"
source_url: "https://claude.com/resources/articles/how-brex-improves-code-quality-and-productivity-with-claude-code"
publisher: "claude.com"
type: "blogPost"
date: "2025-10-30"
products: ["Claude Code"]
read_time: 9
excerpt: "了解 Claude Code 如何通过让编程更简单、更易上手，打破技术团队与非技术团队之间的壁垒。"
fetched_at: "2026-11-18"
---

# Brex 如何借助 Claude Code 提升代码质量与生产力

两年前，Andy Reed 以内容设计师的身份加入 [Brex](https://www.brex.com/) 时，他从未想过自己会写代码、开发 Figma 插件。

"如果没有 [Claude Code](https://claude.com/product/claude-code)，我不知道过去一个月里我连一半的工作都完不成，"Reed 说道。

但这正是 Reed 拥抱 [Claude Code](https://claude.com/product/claude-code)——Anthropic 的智能体式编程解决方案——之后发生的事，而他的故事只是这家智能金融平台正在改变公司工作方式的众多例子之一。

为了解更多，我们与三位 Brex 团队成员聊了聊他们如何使用 Claude Code：

-   Hércules Gimenes，Product AI 团队软件工程负责人
-   Sumeet Marwaha，数据与分析负责人
-   Andy Reed，高级内容设计师

这些对话呈现出的，不仅仅是生产力提升的故事——尽管团队反馈在特定任务上效率提升了 3-4 倍。它更关乎从根本上重新构想公司如何协同工作，以简化工作流、激发创造性的问题解决，并推动大规模协作。

## 以智能体式编程实现思维转变

对 Hércules Gimenes 和 Product AI 团队而言，Claude Code 的意义远不止一款新工具。

"Claude Code 带来了一种思维转变，"他解释道。"你不再是驾驶座上的人，而是 Claude 所引入变更的审查者。你在引导愿景和方向。"

Anthropic 自身对这一转变的实践见 [The AI-native SDLC playbook](https://claude.com/resources/articles/the-ai-native-sdlc-playbook)

关于 Claude Code 团队自身如何处理审查，见 [How the Claude Code team does code review](https://claude.dev/blog/solving-code-review-at-anthropic/)

这一转变重新定义了 Brex 内部"写代码"的含义——这正是公司 AI 优先原则的落地体现。工程师不再把时间花在实现细节上，而是专注于架构和问题解决。结果如何？不只是更快的代码，而是更好的代码。

"我不觉得自己用 Claude Code 节省了时间，"Gimenes 说。"我更多是在打磨问题本身。你可以在同样的时间内为同一个问题尝试三种方案，而在第三种方案之后，你对问题的理解清晰得多，接口也干净得多。"

## 打破技术与非技术角色之间的壁垒

当 Product AI 团队在探索提升代码质量的新方法时，Reed 也有了自己的顿悟。

作为一名内容设计师，他在 Claude Code 中发现了意想不到的东西：独立性。

过去，更新一个简单的字符串意味着提交工单、等待工程师处理。现在，Reed 可以直接提交 PR，但真正的转变发生在他着手一个长期搁置在待办列表中的项目时：将全面的内容规范集成到 Brex 设计系统的每一个组件中。

"如果手动做，我大概要花几周甚至几个月，"Reed 解释道。借助 Claude Code，他几天就完成了这个项目，系统性地将从内部风格指南、无障碍标准和外部最佳实践中提取的内容专属规范添加进去。

影响波及了各个团队。工程师和设计师现在可以直接在工具中使用内容规范，无需再反复交叉查阅，错误也在发生之前就被减少。这是一个虽小却有力的智能金融实践案例：系统在后台运行，让人们专注于更高价值的创造性工作。

## 让数据访问在整个组织内普及

与此同时，Sumeet Marwaha 的数据与分析团队正在解决另一个不同但同样重要的挑战：让 Brex 的每个人都能访问数据，而不仅仅是 SQL 专家。

该团队构建了 Brex Explorer，一个由 Claude Code 和 MCP 服务器驱动的 text-to-SQL 界面。现在，一位销售经理可以用自然语言提问："在佛罗里达州杰克逊维尔，有多少客户的 Brex 账户余额超过 1000 万美元，并且是在过去一年内完成上手（onboarding）的？"系统会翻译查询、执行查询并汇总结果。

真正的倍增效应来自他们的 AI 数据工程智能体。过去需要专业知识才能完成的任务，比如添加数据表并完成所有必要的文件修改和测试配置，现在任何工程师都能完成。

"这相当于大约 4 倍的速度提升，同时贡献人数可能翻了一倍，"Marwaha 指出。Claude Code 已在全组织范围内达到 50% 的采用率，Marwaha 希望在本月底达到 100%。

## 拥有一个"万能工具"的意外收获

随着 Brex 各团队采用 Claude Code，一些令人惊喜的用例浮现出来。在一次公司黑客松上，Gimenes 使用 Claude Code 的无头模式在短短几小时内构建了一个复杂的提交智能体，而这通常需要数天的开发。

Reed 发现自己现在能构建以前从未想过能做的工具，比如一个根据 Brex 标准自动审查设计的 Figma 插件。"感觉就像我有了世界上最好的实习生，"他说。

但也许最重要的意外收获是 Claude Code 作为组织知识库的角色。Brex 使用 Kotlin 和 Bazel 的复杂 monorepo 结构，理解不同系统之间如何连接一直是个挑战。现在，Claude Code 充当了一个"神谕"，可以即时回答关于代码库功能的问题。

"传统上，设计会议会讨论某个东西应该如何运作，但没有人真正理解它是怎么做出来的，"Reed 解释道。"现在我有了这个神谕，就放在我的另一个显示器上。"

## 在全公司推广 Claude Code 最佳实践

随着 Claude Code 在 Brex 的采用范围不断扩大，各团队总结出的最佳实践已成为标准：

-   **结构化的上下文管理**：monorepo 中的每个主要目录现在都有[自己的 CLAUDE.md 文件](https://claude.com/resources/articles/using-claude-md-files)，包含领域专属上下文。新工程师无需依赖口口相传的知识，就能了解 Mastercard 集成细节或银行监管规定。
-   **自动化文档**：Product AI 团队实施了 CI/CD 检查，用于验证代码变更是否可能使文档过时，并提示更新。"拥有最新的文档是一件你可以信赖的事——这非常强大，"Gimenes 强调。
-   **上下文感知命令**：团队创建了可自动加载相关上下文的自定义命令。例如，/submit-pr 命令会在执行前获取 git 状态、最近的变更以及相关 PR 信息。
-   **从探索开始**："能够找到你需要的东西，这不再只存在于某位资深工程师的脑子里，"Marwaha 观察到。"它在代码库里，所有人都能访问。"

## Claude Code 在 Brex 的未来

Brex 各团队已经在规划下一代应用：

-   数据团队正准备着手以前不敢碰的项目，比如分析数万亿条信用卡交易明细数据点——这项工作在 Claude Code 使其可行之前过于繁琐，不值得投入。他们还在开发角色专属智能体，包括一个用于支持 RevOps 任务的智能体。
-   Product AI 团队设想更复杂的上下文管理，让文档自动更新，上下文保持去中心化却又易于访问。

从内容设计师构建技术工具，到数据分析师普及数据访问，Claude Code 已成为 Gimenes 口中的"万能工具"——有助于将 Brex 的领域知识与外部最佳实践相结合。

这也凸显了一种强大的二元性：Brex 为客户提供的智能金融，帮助他们更明智地消费、更快速地行动，与塑造 Brex 团队内部工作方式的理念如出一辙——赋能每位员工以速度和信心去构建，无论其技术背景如何。
