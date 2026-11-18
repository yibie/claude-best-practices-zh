---
title: "智能体执行框架设计：驾驭 Claude 智能的 3 种模式"
source_url: "https://claude.com/resources/articles/harnessing-claudes-intelligence"
publisher: "claude.com"
type: "blogPost"
date: "2026-04-02"
products: ["Claude Platform"]
read_time: 11
excerpt: "构建在智能、延迟与成本之间取得平衡的应用。"
fetched_at: "2026-11-18"
---

# 智能体执行框架设计：驾驭 Claude 智能的 3 种模式

Anthropic 的联合创始人之一 Chris Olah [表示](https://www.darioamodei.com/post/the-urgency-of-interpretability)，像 Claude 这样的生成式 AI 系统更多是"生长"出来的，而非"构建"出来的。研究人员设定条件来引导其生长，但最终涌现出的确切结构或能力并不总是可预测的。

这给基于 Claude 构建应用带来了挑战：[智能体执行框架（agent harness）编码了](https://www.anthropic.com/engineering/harness-design-long-running-apps)关于 Claude 无法独立完成哪些事情的假设，但随着 Claude 能力不断增强，这些假设会逐渐过时。

智能体执行框架是模型外围的软件脚手架：包括循环、工具、[上下文管理](https://claude.com/resources/articles/context-management)以及护栏，它们将原始智能转化为可工作的智能体。智能体执行框架设计就是决定哪些内容应放入该脚手架、以及随着模型进步哪些内容可以移除的实践。

在本文中，我们分享三种模式，供团队在构建应用时使用，以便跟上 Claude 不断演进的能力，同时平衡延迟与成本：利用它已知的能力、追问可以停止做什么、以及在智能体执行框架中谨慎设定边界。

### **1\. 依靠模型，而非执行框架：利用 Claude 已知的能力**

我们建议使用 Claude 熟悉掌握的工具来构建应用。

2024 年底，Claude 3.5 Sonnet 在 SWE-bench Verified 上达到 49%——当时属于[最先进水平](https://www.anthropic.com/engineering/swe-bench-sonnet)——仅使用了 [bash 工具](https://platform.claude.com/docs/en/agents-and-tools/tool-use/bash-tool)和一个用于查看、创建和编辑文件的[文本编辑器工具](https://platform.claude.com/docs/en/agents-and-tools/tool-use/text-editor-tool)。Claude Code 正是建立在这些相同的工具之上。[Bash](https://platform.claude.com/docs/en/agents-and-tools/tool-use/bash-tool) 并非为构建智能体而设计，但它是 Claude _知道_如何使用、并且随着时间推移用得越来越好的工具。



Claude 各模型版本在 SWE-bench Verified 基准测试上的得分，凸显了其演进过程。

我们看到 Claude 将这些通用工具组合成解决不同问题的模式。例如，[Agent Skills](https://agentskills.io/home)、[程序化工具调用](https://platform.claude.com/docs/en/agents-and-tools/tool-use/programmatic-tool-calling)和[记忆工具](https://platform.claude.com/docs/en/agents-and-tools/tool-use/memory-tool)都是基于 bash 和文本编辑器工具构建的。



程序化工具调用、Skills 和记忆都是我们 bash 与文本编辑器工具的组合。

### **2\. 精简你的智能体执行框架：追问可以停止做什么**

[智能体执行框架编码了](https://www.anthropic.com/engineering/harness-design-long-running-apps)关于 Claude 无法独立完成哪些事情的假设。随着 Claude 能力增强，这些假设应当被检验。

**让 Claude 编排自己的行动**

一个常见的假设是，每个工具结果都应流回 Claude 的[上下文窗口](https://platform.claude.com/docs/en/build-with-claude/context-windows)以指导下一步行动。以 token 形式处理工具结果可能缓慢、昂贵且不必要——如果它只需要传递给下一个工具，或者 Claude 只关心输出中的一小部分。



Claude 调用工具，工具在环境中执行。

设想读取一张大表来推理其中某一列：整张表都进入上下文，Claude 为每一行不需要的数据付出 token 成本。可以在工具设计中通过[硬编码过滤器](https://platform.claude.com/docs/en/about-claude/models/migration-guide#additional-recommended-changes)来解决。但这并未解决一个事实：智能体执行框架正在做出一个_编排决策_，而 Claude 处于更有利的位置来做出该决策。

给 Claude 一个[代码执行](https://platform.claude.com/docs/en/agents-and-tools/tool-use/code-execution-tool)工具（例如 [bash 工具](https://platform.claude.com/docs/en/agents-and-tools/tool-use/bash-tool)或[特定语言的 REPL](https://platform.claude.com/docs/en/agents-and-tools/tool-use/code-execution-tool)）可以解决这个问题：它允许 Claude 编写代码来表达工具调用及其之间的逻辑。不再由执行框架决定每个工具调用结果都以 token 形式处理，而是由 Claude 决定哪些结果传递、过滤或管道到下一次调用，而无需触碰上下文窗口。只有代码执行的输出才会到达 Claude 的上下文窗口。



Claude 可以编写代码来表达工具调用及其之间的逻辑。

编排决策从执行框架转移到模型。由于代码是 Claude 编排行动的通用方式，一个强大的编码模型也是一个强大的_通用_智能体。Claude 在使用此模式的[非编码评估](https://claude.com/resources/articles/improved-web-search-with-dynamic-filtering)中表现出色：在 BrowseComp——一个测试智能体网页浏览能力的[基准测试](https://arxiv.org/abs/2504.12516)——上，赋予 Opus 4.6 过滤自身工具输出的能力，将准确率从 45.3% 提升到 61.6%。

**让 Claude 管理自己的上下文**

任务特定的上下文引导 Claude 使用 bash 和文本编辑器工具等通用工具。一个常见的假设是，[系统提示词](https://platform.claude.com/docs/en/release-notes/system-prompts)应当手工编写任务特定的指令。问题在于，预先加载指令的提示词无法跨众多任务扩展：每增加一个 token 都会消耗 [Claude 的注意力预算](https://www.anthropic.com/engineering/effective-context-engineering-for-ai-agents)，而且用很少使用的指令预加载上下文是一种浪费。

赋予 Claude 访问 [Skills](https://platform.claude.com/docs/en/agents-and-tools/agent-skills/overview) 的能力可以解决这个问题：每个 skill 的 YAML frontmatter 是一段预先加载到上下文窗口中的简短描述，提供该 skill 内容的概览。如果任务需要，Claude 可以调用读取文件工具来逐步披露完整的 skill。



Claude 可以使用 Skills 逐步披露与任务相关的上下文。

Skills 赋予 Claude 自由组装自己上下文窗口的能力，而[上下文编辑](https://platform.claude.com/docs/en/build-with-claude/context-editing)则相反，提供了一种选择性地移除已过时或无关上下文（例如旧的工具结果或思考块）的方式。

借助[子智能体](https://code.claude.com/docs/en/sub-agents)，Claude 越来越擅长判断何时分叉到一个全新的上下文窗口，以隔离特定任务的工作。[借助 Opus 4.6](https://www-cdn.anthropic.com/0dd865075ad3132672ee0ab40b05a53f14cf5288.pdf)，生成子智能体的能力使 BrowseComp 的结果比最佳单智能体运行提升了 2.8%。

**让 Claude 持久化自己的上下文**

长时间运行的智能体可能超出单个[上下文窗口](https://platform.claude.com/docs/en/build-with-claude/context-windows)的限制。一个常见的假设是，记忆系统应依赖模型周围的检索基础设施。我们的许多工作都集中在为 Claude 提供简单的方式，让它_自行选择_要持久化哪些内容。

例如，[上下文压缩（compaction）](https://platform.claude.com/docs/en/build-with-claude/compaction)让 Claude 总结其过去的上下文，以在长时程任务中保持连续性。经过多次发布，Claude 在选择记住什么方面越来越好。例如，[在 BrowseComp](https://www-cdn.anthropic.com/14e4fb01875d2a69f646fa5e574dea2b1c0ff7b5.pdf)（一个智能体式搜索任务）上，无论我们给 Sonnet 4.5 多少压缩预算，它都停留在 43%。然而 Opus 4.5 在相同设置下提升到 68%，Opus 4.6 达到 84%。

[记忆文件夹](https://platform.claude.com/docs/en/agents-and-tools/tool-use/memory-tool)是另一种方法，允许 Claude 将上下文写入文件，之后按需读取。我们看到 Claude 将其用于智能体式搜索。在 BrowseComp-Plus 上，给 Sonnet 4.5 一个记忆文件夹[将准确率从 60.4% 提升到 67.2%](https://www-cdn.anthropic.com/bf10f64990cfda0ba858290be7b8cc6317685f47.pdf)。



Claude 可以将上下文持久化到记忆文件夹。

[长时程游戏](https://www.youtube.com/watch?v=CXhYDOvgpuU)，例如 Pokémon，是 Claude 使用记忆文件夹能力提升的一个例子。Sonnet 3.5 将记忆当作流水账，记录非玩家角色（NPC）说了什么，而非什么重要。经过 14,000 步后，它有 31 个文件——包括两个关于毛毛虫宝可梦的近乎重复的文件——而且仍在第二个城镇：

```
caterpie_weedle_info:
- Caterpie 和 Weedle 都是毛毛虫宝可梦。
- Caterpie 是一只没有毒的毛毛虫宝可梦。
- Weedle 是一只有毒的毛毛虫宝可梦。
- 此信息对未来的遭遇和战斗至关重要。
- 如果我们的宝可梦中毒了，应尽快前往宝可梦中心治疗。
```

后来的模型写的是战术笔记。Opus 4.6 在相同的步数下，有 10 个文件组织到目录中，获得三枚道馆徽章，以及一个从自身失败中提炼的学习文件：

```
/gameplay/learnings.md:
- Bellsprout 睡眠+缠绕组合：在 Sleep Powder 命中前用 BITE 快速击倒。
  别让它完成布置！
- 第一世代背包限制：最多 20 个物品。进入地下城前丢弃不需要的 TM。
- 旋转地砖迷宫：不同的进入 y 坐标通向不同的目的地。
  尝试所有入口并串联穿过多个区域。
- B1F y=16 墙壁已确认在所有 x=9-28 处均为实心（第 14557 步）
```

### **3\. 在执行框架设计中谨慎设定边界**

智能体执行框架为 Claude 提供结构，以强制执行 UX、成本或安全方面的要求。

**设计上下文以最大化缓存命中**

[Messages API](https://platform.claude.com/docs/en/build-with-claude/working-with-messages) 是无状态的。Claude 无法看到之前轮次的对话历史。这意味着智能体执行框架需要在每一轮为 Claude 打包新的上下文，连同所有过去的行动、工具描述和指令。

提示词可以基于设定的[断点](https://platform.claude.com/docs/en/build-with-claude/prompt-caching)进行缓存。换句话说，Claude API 将断点之前的上下文写入缓存，并检查该上下文是否匹配任何先前的缓存条目。

由于缓存 token 的[成本是基础输入 token 的 10%](https://platform.claude.com/docs/en/about-claude/pricing)，以下是智能体执行框架中帮助最大化缓存命中的几条原则：

| 原则 | 描述 |
| --- | --- |
| 静态在前，动态在后 | 对请求排序，使稳定内容（系统提示词、工具）排在前面。 |
| 用消息承载更新 | 在消息中追加 `<system-reminder>`，而非编辑提示词。 |
| 不要更换模型 | 避免在会话中途切换模型。缓存是模型特定的；切换会破坏缓存。如果需要更便宜的模型，请使用子智能体。 |
| 谨慎管理工具 | 工具位于缓存前缀中。添加或移除一个工具会使缓存失效。如需动态发现，请使用**工具搜索**，它以追加方式工作而不破坏缓存。 |
| 更新断点 | 对于多轮应用（例如智能体），将断点移到最新消息以保持缓存最新。为此请使用**自动缓存**。 |

**使用声明式工具实现 UX、可观测性或安全边界**

Claude 不一定了解应用的安全边界或 UX 界面。Claude 发出工具调用，由执行框架处理。bash 工具赋予 Claude 广泛的程序化能力来执行操作，但它只给执行框架一个命令字符串——每个操作都是相同的形态。将操作提升为专用工具，可以给执行框架一个操作特定的钩子，带有类型化参数，它可以拦截、把关、渲染或审计。

需要安全边界的操作自然是专用工具的候选。可逆性通常是一个好的标准，难以逆转的操作（例如外部 API 调用）可以通过用户确认来把关。像 `edit` 这样的写入工具可以包含陈旧性检查，以免 Claude 覆盖自上次读取以来已更改的文件。



专用工具可用于基于安全、UX 或可观测性考量的操作。

当操作需要呈现给用户时，工具也很有用。例如，它们可以渲染为模态框，向用户清晰地展示问题、给用户多个选项，或阻塞智能体循环直到用户提供反馈。

最后，工具对可观测性很有用。当操作是类型化工具时，执行框架获得结构化参数，可以记录日志、追踪（trace）和重放。

将操作提升为工具的决策应持续重新评估。例如，Claude Code 的[自动模式](https://www.anthropic.com/engineering/claude-code-auto-mode)（在本文发布时处于研究模式）为 bash 工具提供了安全边界：它让第二个 Claude 读取命令字符串并判断其是否安全。这种模式可以_减少_对专用工具的需求，且只应用于用户信任总体方向的任务。对于某些高风险操作，专用工具仍然有其价值。

### 智能体执行框架设计的未来

Claude 智能的前沿始终在变化。关于 Claude 无法做什么的假设，需要在其能力的每一次阶跃变化时重新检验。

我们看到这种模式反复出现。在我们为[长时程任务构建的一个智能体](https://www.anthropic.com/engineering/harness-design-long-running-apps)中，Sonnet 4.5 会在感知到上下文限制临近时过早收尾。我们添加了重置来清空上下文窗口，以解决这种"上下文焦虑"。在 Opus 4.5 中，该行为消失了。我们为补偿而构建的上下文重置已成为智能体执行框架中的累赘。

移除这些累赘很重要，[因为它可能成为瓶颈](http://www.incompleteideas.net/IncIdeas/BitterLesson.html)，限制 Claude 的表现。随着时间推移，我们应用中的结构或边界应基于这个问题来修剪：_我可以停止做什么？_

_要使用本文讨论的所有工具和模式，请查看[我们的 claude-api skill](https://github.com/anthropics/skills/tree/main/skills/claude-api)。_

### 致谢

作者：Lance Martin，Claude Platform 团队技术员工。特别感谢 Thariq Shihipar、Barry Zhang、Mike Lambert、David Hershey 和 Daliang Li 就本文所涉主题进行的有益讨论。感谢 Lydia Hallie、Lexi Ross、Katelyn Lesse、Andy Schumeister、Rebecca Hiscott、Jake Eaton、Pedram Navid 和 Molly Vorwerck 的编辑审阅与反馈。
