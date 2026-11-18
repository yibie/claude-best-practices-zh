---
title: "通过 Skills 和 MCP 服务器扩展 Claude 的能力"
source_url: "https://claude.com/resources/articles/extending-claude-capabilities-with-skills-mcp-servers"
publisher: "claude.com"
type: "blogPost"
date: "2025-12-19"
products: ["Claude apps","Claude Platform"]
read_time: 11
excerpt: "了解 Skills 与 MCP 如何协同工作，构建遵循你的工作流、并能有效使用外部系统与平台的智能体。"
fetched_at: "2026-11-18"
---

# 通过 Skills 和 MCP 服务器扩展 Claude 的能力
_**更新：** 我们已将 [Agent Skills](https://agentskills.io/) 发布为跨平台可移植的开放标准。（2025 年 12 月 18 日）_

自[推出 Skills](https://claude.com/resources/articles/skills) 以来，客户问得最多的两个问题是："Skills 和 MCP 如何协同工作？什么时候该用其中一个而不是另一个？"

[Model Context Protocol (MCP)](https://modelcontextprotocol.io/docs/getting-started/intro) 将 Claude 连接到第三方工具，而 Skills 则教会 Claude 如何用好这些工具。将两者结合，你就能构建遵循团队工作流的智能体，而不是需要不断纠正的通用流程。

例如，通过 MCP 连接到 Notion 可以让 Claude 搜索你的工作区。再添加一个用于会议准备的 Skill，Claude 就知道该从_哪些_页面获取内容、_如何_格式化准备文档，以及你的团队在交付会议纪要方面有哪些标准。这个连接因此变得有用，而不仅仅是可用。

在本文中，我们将拆解 Skills 与 MCP 之间的关系，说明如何将二者结合来构建遵循你的工作流、产出稳定结果的智能体，并介绍几个它们在实践中协同工作的真实案例。

## **理解 Skills 与 MCP**

你走进一家五金店，想修一个坏掉的柜子。店里什么都有（木胶、夹具、替换铰链），但知道该买哪些东西、以及如何使用它们，是另一个问题。

MCP 就像是可以进入各个货架通道的权限。而 Skills 则像是一位员工的专业知识。如果你不知道该买什么、也不知道怎么用，再多的库存也帮不上忙。Skill 就像那位乐于助人的员工，带你走完整个修理过程，为你指出正确的材料，并示范正确的技巧。

更具体地说，MCP 服务器让 Claude 能够访问你的外部系统、服务和平台，而 Skills 则提供 Claude 有效利用这些连接所需的上下文，教会 Claude 在获得这些访问权限之后该做什么。

没有 Skills 提供的上下文，Claude 只能猜测你想要什么。有了 Skill，Claude 就能遵循你的实战手册（playbook）。

## **为什么 Skills 和 MCP 能很好地协同工作**

MCP 负责连接性：安全、标准化地访问外部系统。无论你连接的是 GitHub、Salesforce、Notion，还是你自己的内部 API，MCP 服务器都能让 Claude 触达你的工具和数据。

Skills 负责专业性：将原始的工具访问转化为可靠结果的领域知识和工作流逻辑。Skill 知道何时查询你的 CRM、在结果中该关注什么、如何格式化输出，以及哪些边界情况需要不同的处理方式。

这种分离让架构保持可组合性。单个 Skill 可以编排多个 MCP 服务器，而单个 MCP 服务器也可以支撑数十个不同的 Skill。添加一个新连接，现有的 Skill 就能将其纳入。改进一个 Skill，它就能在你所有已连接的工具上生效。

#### **当你将 Skills 和 MCP 结合使用时，你会获得：**

**清晰的发现路径**：Claude 不再猜测该去哪里查找。一个会议准备 Skill 可能会规定：先查看项目页面，然后是之前的会议纪要，最后是利益相关方档案。一个研究 Skill 可能会说：从共享盘开始，与 CRM 交叉比对，然后用网络搜索填补空白。Skill 将关于哪些来源对哪些任务重要的机构知识编码其中。

**可靠的编排**：多步骤工作流变得可预测。没有 Skill 时，Claude 可能会在确认是否已获取全部信息之前就拉取数据并格式化。Skills 明确定义了顺序，因此 Claude 每次都以相同的方式执行工作流。

**一致的性能**：输出真正达到标准。通用结果需要编辑。Skills 定义了你的团队眼中"完成"是什么样子：正确的结构、正确的细节程度、适合你受众的正确语气。

随着时间推移，团队会积累起相互关联的 Skills 和连接集合，让 Claude 在其特定领域具备专业能力。

**延伸阅读**：Tim O'Reilly 谈 [MCP 和 Skills 对开源 AI 意味着什么](https://www.oreilly.com/radar/what-mcp-and-claude-skills-teach-us-about-open-source-for-ai/)



Skills 与 MCP 如何协同工作：MCP 提供工具访问，Skills 提供工作流逻辑。

#### **Skills 与 MCP 可能重叠的地方**‍

MCP 服务器可能包含以工具使用提示和常见任务提示词形式存在的指令。这让工具特定的知识贴近工具本身。不过，这些指令在设计上应保持通用。

经验法则：MCP 指令涵盖如何正确使用服务器及其工具。Skill 指令涵盖如何针对特定流程或在多服务器工作流中使用它们。

例如，一个 Salesforce MCP 服务器可能会规定查询语法和 API 格式。而一个 Skill 则会规定先检查哪些记录、如何将它们与 Slack 对话交叉比对以获取近期上下文，以及如何为你的团队流水线评审组织输出结构。

在组合 MCP 服务器和 Skills 时，要注意指令冲突。如果你的 MCP 服务器说返回 JSON，而你的 Skill 说格式化为 Markdown 表格，Claude 就得猜测哪个才是对的。让 MCP 负责连接性，让 Skills 负责呈现、顺序和工作流逻辑。

**延伸阅读**：了解 Skills 如何使用[渐进式披露](https://www.anthropic.com/engineering/equipping-agents-for-the-real-world-with-agent-skills)按需加载上下文，以及[程序化工具调用](https://www.anthropic.com/engineering/advanced-tool-use)来高效编排 MCP 工具。

## **结合使用 Skills 和 MCP 的真实案例**

现在我们来看看 Skills 和 MCP 在真实工作流中如何结合。我们将介绍两个例子：金融分析师拉取实时市场数据用于公司估值，以及项目经理使用 Notion 的 Meeting Intelligence Skill 进行会议准备。

在这两个案例中，MCP 服务器提供对工具的访问，而 Skills 定义如何使用它们。

#### **财务分析：自动化公司估值 Skill**

[Anthropic 发布了一套预构建 Skills](https://www.anthropic.com/news/advancing-claude-for-financial-services)，用于常见财务工作流，包括可比公司分析。可比公司分析是一种标准估值方法。做可比公司分析的分析师要花数小时从多个来源拉取财务指标、应用相同的估值方法，并格式化输出以满足合规标准。这项工作重复、易错，正是那种能从 Skills 和 MCP 协同工作中受益的工作流。

**Skill**：[可比公司分析](https://www.anthropic.com/news/advancing-claude-for-financial-services)自动化这一估值工作流，从多个来源拉取数据、应用一致的方法，并按特定标准格式化输出。

**MCP 服务器**：连接到 S&P Capital IQ、Daloopa 和 Morningstar 以获取实时市场数据

**工作流**：

1.  Skill 确定要查询哪些数据源（发现）
2.  MCP 连接拉取实时财务数据
3.  Skill 应用方法并格式化输出（编排）
4.  Skill 对照合规要求进行验证（输出表现）

#### **会议准备：Notion 的 Meeting Intelligence Skill**

会议准备很繁琐。你需要从多个地方拉取上下文，比如项目文档、之前的会议纪要和利益相关方信息，然后将其综合成一份预读材料和议程。这是那种你每次都得重新解释一遍的多步骤流程。

**Skill**：[Meeting Intelligence](https://notiondevs.notion.site/notion-skills-for-claude) 定义要搜索哪些页面、如何组织输出、包含哪些章节

**MCP 服务器**：Notion 连接，用于搜索、读取和创建页面

**工作流**：

1.  Skill 确定要搜索的相关页面，包括项目、之前的会议、利益相关方信息（发现）
2.  MCP 连接从 Notion 搜索并检索内容
3.  Skill 组织两份文档：内部预读材料和对外议程（编排）
4.  MCP 连接将两份文档保存到 Notion，并做好组织和链接
5.  Skill 确保输出符合格式标准（输出表现）

## **何时使用 Skills 与 MCP**

**‍**Skills 和 MCP 解决不同的问题，但针对特定工作流决定用哪个并不总是显而易见。

#### **何时使用 Skills**

Skills 捕获那些否则只存在于你脑海中的知识，或者每次有新成员加入团队时都要重新解释的知识。它们最适合：

-   **涉及工具的多步骤工作流**：从多个来源拉取内容、然后创建结构化文档的会议准备
-   **一致性很重要的流程**：每次都必须遵循相同方法的季度财务分析、带有强制检查点的合规审查
-   **你想捕获并分享的领域专业知识**：研究方法、代码审查标准、写作指南
-   **在团队成员离开后仍应延续的工作流**：编码为可复用指令的机构知识

#### **何时使用 MCP 服务器**

MCP 扩展 Claude 可以访问和使用的内容。当你需要以下内容时，使用 MCP：

-   **实时数据访问**：搜索 Notion 页面、读取 Slack 消息、查询数据库
-   **在外部系统中执行操作**：创建 GitHub issue、更新项目管理工具、发送通知
-   **文件操作**：读写 Google Drive、访问本地文件系统
-   **API 集成**：连接没有原生 Claude 支持的服务

如果你在解释_如何_做某件事，那是 Skill。如果你需要 Claude _访问_某样东西，那是 MCP。

‍

#### **_快速参考表：Skills 与 MCP 的区别_**

|  | Skills | MCP |
| --- | --- | --- |
| **它是什么** | 程序性知识 | 工具连接性 |
| **它做什么** | 教会 Claude _如何_做某件事 | 让 Claude 能够_访问_某样东西 |
| **何时加载** | 按需加载，在相关时 | 一旦连接便始终可用 |
| **包含内容** | 指令、脚本、模板、资源 | 工具、资源、提示词 |
| **token 行为** | 按需加载，保留上下文 | 定义在前期加载 |
| **最适合** | 工作流、标准、方法论 | 数据访问、API 调用、外部操作 |

## **常见问题**

#### **Skills 会取代 MCP 吗？**

不会。Skills 和 MCP 解决不同的问题。MCP 提供与外部工具和数据的连接性。Skills 提供如何有效利用这种连接性的程序性知识。大多数强大的工作流会同时使用两者。

#### **一个 Skill 可以使用多个 MCP 服务器吗？**

可以。单个 Skill 可以同时协调多个 MCP 服务器。一个技术竞争分析 Skill 可能会搜索 Google Drive 获取内部研究、从 GitHub 拉取竞争对手仓库，并通过网络搜索收集市场数据。

#### **我可以为一个 MCP 服务器构建多个 Skills 吗？**

可以。Skill 可以提升你从单个 MCP 连接中获得的价值。Notion 通过为会议准备、研究、知识捕获和从规格到实现分别提供独立的 Skill 展示了这一模式——可在[此处](https://claude.com/connectors/notion)查看。

## **开始使用**

准备好用 Skills _和_ MCP 来构建了吗？以下是如何开始：

**使用 Skills：**

-   在 [claude.ai](https://claude.ai/redirect/claudedotcom.v1.7bcb2cf6-7056-4458-9e5d-c435063fa088) 的 Settings → Capabilities 中启用 Skills
-   浏览 [Skills 库](https://github.com/anthropics/skills)获取预构建示例
-   阅读 [Skills 文档](https://docs.anthropic.com/en/docs/agents-and-tools/agent-skills)

**使用 MCP：**

-   浏览适用于你的工具的 [MCP 服务器](https://github.com/modelcontextprotocol/servers)
-   阅读 [MCP 文档](https://modelcontextprotocol.io/introduction)
-   通过 [MCP 快速入门](https://modelcontextprotocol.io/quickstart)构建你自己的服务器

**结合两者：**

-   连接一个 MCP 服务器，然后添加一个使用它的 Skill

## **相关文章**

探索更多关于使用 Claude 智能体式能力构建的洞见。

-   [Skills 详解：Skills 与提示词、Projects、MCP 和子智能体的对比](https://claude.com/resources/articles/skills-explained)
-   [通过 Skills 改进前端设计](https://claude.com/resources/articles/improving-frontend-design-through-skills)
-   [用 Agent Skills 为真实世界装备智能体](https://www.anthropic.com/engineering/equipping-agents-for-the-real-world-with-agent-skills)

‍

‍

‍
