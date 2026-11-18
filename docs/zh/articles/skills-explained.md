---
title: "Skills 详解：Skills 与提示词、Projects、MCP 和子智能体的对比"
source_url: "https://claude.com/resources/articles/skills-explained"
publisher: "claude.com"
type: "blogPost"
date: "2026-03-05"
products: ["Claude apps","Claude Platform"]
read_time: 16
excerpt: "Skills 是创建自定义 AI 工作流和智能体的日益强大的工具，但它们在 Claude 技术栈中处于什么位置？我们解释何时该用哪种工具——以及它们如何协同工作。"
fetched_at: "2026-11-18"
---

# Skills 详解：Skills 与提示词、Projects、MCP 和子智能体的对比

自从推出 [Skills](https://www.anthropic.com/news/skills) 以来，人们一直很有兴趣了解 Claude 智能体式生态系统的各个组件如何协同工作。

无论你是在 [Claude Code](https://www.claude.com/product/claude-code) 中构建复杂的工作流、使用 API 创建企业解决方案，还是在 [Claude.ai](http://claude.ai/redirect/claudedotcom.v1.2c959c19-e6c2-4cf1-8c13-7d4a004eb071) 上最大化你的生产力，了解该选用哪种工具——以及何时使用——都能改变你与 Claude 协作的方式。

本指南逐一拆解每个构建模块，解释何时该用哪种工具，并展示如何将它们组合起来，构建强大的智能体式工作流。

## **理解你的智能体式构建模块**

### **什么是 Skills？**

Skills 是包含指令、脚本和资源的文件夹，Claude 会在与任务相关时动态发现并加载它们。可以把它们想象成专业化的培训手册，赋予 Claude 在特定领域的专业知识——从处理 Excel 电子表格到遵循你组织的品牌指南。

**Skills 如何工作：** 当 Claude 遇到一项任务时，它会扫描可用的 Skills 以寻找相关匹配。Skills 使用[渐进式披露](https://claude.dev/blog/lessons-from-building-claude-code-how-we-use-skills/)：元数据首先加载（约 100 token），提供刚好足够的信息让 Claude 知道某个 Skill 是否相关。完整指令在需要时加载（<5k token），捆绑的文件或脚本仅在需要时加载。

**何时使用 Skills：** 当你需要 Claude 一致且高效地执行专业化任务时，选择 Skills。它们非常适合：

-   **组织工作流**：品牌指南、合规流程、文档模板
-   **领域专业知识：** Excel 公式、PDF 操作、数据分析
-   **个人偏好：** 笔记系统、编码模式、研究方法

**示例：** 创建一个[品牌指南 Skill](https://github.com/anthropics/skills/tree/main/skills/brand-guidelines)，其中包含你公司的配色方案、排版规则和布局规范。当 Claude 创建演示文稿或文档时，它会自动应用这些标准，无需你每次都进行说明。

[了解更多](https://support.claude.com/en/articles/12512176-what-are-skills)关于 Skills 的信息，并查看[我们不断扩充的 Skills 库](https://github.com/anthropics/skills)。

### **什么是提示词？**

[提示词](https://docs.claude.com/en/prompt-library/library)是你在对话过程中用自然语言向 Claude 提供的指令。它们是短暂的、对话式的、反应式的——你在当下提供上下文和方向。

**何时使用提示词：** 在以下情况使用提示词：

-   一次性请求："总结这篇文章"
-   对话式调整："把语气改得更专业一些"
-   即时上下文："分析这些数据并找出趋势"
-   临时指令："将其格式化为项目符号列表"

**示例：**

_请对这段代码进行全面安全审查。我希望关注：_

_1\. 常见漏洞，包括：_

-   _注入缺陷（SQL、命令、XSS 等）_
-   _身份验证和授权问题_
-   _敏感数据暴露_
-   _安全配置错误_
-   _访问控制失效_
-   _加密失败_
-   _输入验证问题_
-   _错误处理和日志记录问题_

_2\. 对于你发现的每个问题，请提供：_

-   _严重程度（严重/高/中/低）_
-   _代码中的位置（行号或函数名）_
-   _说明为什么它是安全风险以及可能如何被利用_
-   _具体的修复建议，尽可能附上代码示例_
-   _防止类似问题的最佳实践指导_

_3\. 代码上下文：\[描述代码的功能、语言/框架以及运行环境——例如，"这是一个处理用户身份验证并处理支付数据的 Node.js REST API"\]_

_4\. 其他考虑因素：_

-   _是否存在任何 OWASP Top 10 漏洞？_
-   _代码是否遵循\[特定框架/语言\]的安全最佳实践？_
-   _是否存在任何具有已知漏洞的依赖项？_

_请按严重程度和潜在影响对发现的问题进行优先级排序。_

**专业提示：** 提示词是你与 Claude 交互的主要方式，但它们不会跨对话持久保存。对于重复的工作流或专业知识，考虑将提示词转化为 Skills 或项目指令。

**何时改用 Skill：** 如果你发现自己在多个对话中反复输入相同的提示词，那就是时候创建一个 Skill 了。将反复出现的指令（如"使用 OWASP 标准审查这段代码的安全漏洞"或"用执行摘要、关键发现和建议来格式化这份分析"）转化为 Skills。这样可以省去每次重新解释流程的麻烦，并确保执行的一致性。

查看我们的[提示词库](https://docs.claude.com/en/prompt-library/library)、[提示最佳实践](https://claude.com/resources/articles/best-practices-for-prompt-engineering)或[我们的智能提示词生成器](https://claude.ai/redirect/claudedotcom.v1.2c959c19-e6c2-4cf1-8c13-7d4a004eb071/public/artifacts/3796db7e-4ef1-4cab-b70c-d045778f23ec)来开始使用。

### **什么是 Projects？**

[Projects](https://support.claude.com/en/articles/9517075-what-are-projects)在所有付费 Claude 套餐中可用，是自包含的工作区，拥有自己的聊天记录和知识库。每个项目包含一个 200K 上下文窗口，你可以在其中上传文档、提供上下文，并设置适用于该项目内所有对话的自定义指令。

**Projects 如何工作：** 你上传到项目知识库的所有内容都会在该项目内的所有聊天中可用。Claude 会自动使用这些上下文来提供更有依据、更相关的回复。当你的项目知识接近上下文限制时，Claude 会无缝启用检索增强生成（RAG）模式，将容量扩展最多 10 倍。

**何时使用 Projects：** 当你需要以下内容时，选择 Projects：

-   **持久上下文：** 应为每次对话提供信息的背景知识
-   **工作区组织：** 为不同计划设置独立的上下文
-   **团队协作：** 共享知识和对话历史（在 Team 和 Enterprise 套餐中）
-   **自定义指令：** 项目特定的语气、视角或方法

**示例：** 创建一个"Q4 产品发布"项目，包含市场调研、竞品分析和产品规格。该项目的每次聊天都能访问这些知识，无需你重新上传或重新解释上下文。

**何时改用 Skill：** Projects 为 Claude 提供针对特定工作内容的持久上下文——你公司的代码库、一项研究计划、一个持续进行的客户合作。Skills 则教 Claude 如何做某事。一个 Project 可能包含你产品发布的全部背景信息，而一个 Skill 可以教 Claude 你团队的写作标准或代码审查流程。如果你发现自己在多个 Projects 中复制相同的指令，这就是一个信号：应该改为创建一个 Skill。

[了解更多](https://support.claude.com/en/articles/9517075-what-are-projects)关于 Projects 的信息。[在 Claude Code 中，项目的工作方式现已不同](https://claude.com/resources/articles/projects-redesigned)。

### **什么是子智能体？**

[子智能体](https://docs.claude.com/en/docs/claude-code/sub-agents)是专业化的 AI 助手，拥有自己的上下文窗口、自定义系统提示词和特定的工具权限。子智能体在 Claude Code 和 Claude Agent SDK 中可用，可独立处理离散任务并将结果返回给主智能体。

**子智能体如何工作：** 每个子智能体以自己的配置运行——你定义它做什么、如何解决问题以及可以访问哪些工具。Claude 会根据子智能体的描述自动将任务委派给合适的子智能体，你也可以明确请求某个特定的子智能体。

**何时使用子智能体：** 在以下情况使用子智能体：

-   **任务专业化：** 代码审查、测试生成、安全审计
-   **上下文管理：** 在卸载专业化工作的同时保持主对话聚焦
-   **并行处理：** 多个子智能体可以同时处理不同方面
-   **工具限制：** 将特定子智能体限制为安全操作（例如只读访问）

**示例：**

```
创建一个 code-reviewer 子智能体，可访问 Read、Grep 和 Glob 工具，但不能访问 Write 或 Edit。当你修改代码时，Claude 会自动委派给该子智能体进行质量和安全审查，而不会带来意外代码更改的风险。
```

**何时改用 Skill：** 如果多个智能体或对话需要相同的专业知识——比如安全审查流程或数据分析方法——请创建一个 Skill，而不是将该知识内置到各个子智能体中。Skills 是可移植、可复用的，而子智能体是为特定工作流专门构建的。使用 Skills 来传授任何智能体都能应用的专业知识；当你需要具有特定工具权限和上下文隔离的独立任务执行时，使用子智能体。

[了解更多](https://code.claude.com/docs/en/sub-agents)关于子智能体的信息。

### **什么是 MCP？**



MCP 在 AI 应用与你现有的工具和数据源之间创建了一个通用连接层。

Model Context Protocol（MCP）是一个开放标准，用于将 AI 助手连接到数据所在的外部系统——内容存储库、业务工具、数据库和开发环境。

**MCP 如何工作：** MCP 提供了一种标准化方式，将 Claude 连接到你的工具和数据源。无需为每个数据源构建自定义集成，你只需针对单一协议进行构建。MCP 服务器暴露数据和能力；MCP 客户端（如 Claude）连接到这些服务器。

**何时使用 MCP：** 当你需要 Claude 执行以下操作时，选择 MCP：

-   访问外部数据：Google Drive、Slack、GitHub、数据库
-   使用业务工具：CRM 系统、项目管理平台
-   连接到开发环境：本地文件、IDE、版本控制
-   与自定义系统集成：你的专有工具和数据源

**示例：** 通过 MCP 将 Claude 连接到公司的 Google Drive。现在 Claude 可以搜索文档、读取文件并引用内部知识，无需手动上传——连接会持续存在并自动更新。

**何时改用 Skill：** MCP 将 Claude 连接到数据；Skills 教 Claude 如何处理这些数据。如果你在解释*如何*使用某个工具或遵循流程——比如"查询我们的数据库时，始终先按日期范围过滤"或"用这些特定公式格式化 Excel 报告"——那就是 Skill。如果你需要 Claude 首先能够*访问*数据库或 Excel 文件，那就是 MCP。将两者结合使用：MCP 用于连接，Skills 用于流程性知识。

[了解更多](https://www.anthropic.com/news/model-context-protocol)关于 MCP 的信息，并查看关于如何构建 MCP 服务器的[文档](https://modelcontextprotocol.io/docs/develop/build-server)。

## **它们如何协同工作**

真正的威力在你组合这些构建模块时才会显现。每个模块都有独特的用途，它们共同创造出复杂的智能体式工作流。

### **对比：选择合适的工具**

| 特性 | Skills | 提示词 | Projects | 子智能体 | MCP |
| --- | --- | --- | --- | --- | --- |
| **提供什么** | 流程性知识 | 即时指令 | 背景知识 | 任务委派 | 工具连接 |
| **持久性** | 跨对话 | 单次对话 | 项目内 | 跨会话 | 持续连接 |
| **包含内容** | 指令 + 代码 + 资源 | 自然语言 | 文档 + 上下文 | 完整智能体逻辑 | 工具定义 |
| **何时加载** | 按需动态加载 | 每轮对话 | 项目内始终加载 | 被调用时 | 始终可用 |
| **可包含代码** | 是 | 否 | 否 | 是 | 是 |
| **最适合** | 专业化专业知识 | 快速请求 | 集中化上下文 | 专业化任务 | 数据访问 |

### **示例智能体式工作流：研究智能体**

让我们构建一个结合多个构建模块的综合研究智能体。这个示例展示了如何组装并激活一个用于竞品分析的智能体。

**第 1 步：设置你的 Project**

创建一个"竞争情报"项目并上传：

-   行业报告和市场分析
-   竞品产品文档
-   来自你 CRM 的客户反馈
-   以往的研究摘要

添加项目指令：

_从我们产品战略的角度分析竞争对手。关注差异化机会和新兴市场趋势。用具体证据和可操作的建议呈现发现。_

**第 2 步：通过 MCP 连接数据源**

为以下内容启用 MCP 服务器：

-   Google Drive（访问共享研究文档）
-   GitHub（审查竞品开源仓库）
-   Web 搜索（获取实时市场信息）

**第 3 步：创建专业化 Skills**

创建一个"competitive-analysis" Skill：

```
# My Company GDrive Navigation Skill

## Overview
Optimized search and retrieval strategy for Meridian Tech's Google Drive structure. Use this skill to efficiently locate internal documents, research, and strategic materials.

## Drive Organization

**Top-level structure:**
- `/Strategy & Planning/` - OKRs, quarterly plans, board decks
- `/Product/` - PRDs, roadmaps, technical specs
- `/Research/` - Market research, competitive intel, user studies
- `/Sales & Marketing/` - Case studies, pitch decks, campaign materials
- `/Customer Success/` - Implementation guides, success metrics
- `/Company Ops/` - Policies, org charts, team directories

**Naming conventions:**
- Format: `YYYY-MM-DD_DocumentName_vX`
- Final versions marked with `_FINAL`
- Drafts include `_DRAFT` or `_WIP`

## Search Best Practices

1. **Start broad, then filter** - Use folder context + keywords
2. **Target document owners** - Sales materials from Sales/, not root
3. **Check recency** - Prioritize documents from last 6 months for current strategy
4. **Look for "source of truth"** - Files with `_FINAL`, `_APPROVED`, or in `/Archives/Official/`

## Research Agent Workflow

1. Identify topic category (product, market, customer)
2. Search relevant folder with targeted keywords
3. Retrieve 3-5 most recent/relevant documents
4. Cross-reference with `/Strategy & Planning/` for context
5. Cite sources with file names and dates
```

**第 4 步：配置子智能体（仅限 Claude Code/SDK）**

创建专业化子智能体：

`market-researcher` 子智能体：

```
name: market-researcher
description: Research market trends, industry reports, and competitive landscape data. Use proactively for competitive analysis.
tools: Read, Grep, Web-search
---
You are a market research analyst specializing in competitive intelligence.

When researching:
1. Identify authoritative sources (Gartner, Forrester, industry reports)
2. Gather quantitative data (market share, growth rates, funding)
3. Analyze qualitative insights (analyst opinions, customer reviews)
4. Synthesize trends and patterns

Present findings with citations and confidence levels.
```

`technical-analyst` 子智能体：

```
name: technical-analyst
description: Analyze technical architecture, implementation approaches, and engineering decisions. Use for technical competitive analysis.
tools: Read, Bash, Grep
---
You are a technical architect analyzing competitor technology choices.

When analyzing:
1. Review public repositories and technical documentation
2. Assess architecture patterns and technology stack
3. Evaluate scalability and performance approaches
4. Identify technical strengths and limitations

Focus on actionable technical insights that inform our product decisions.
```

**第 5 步：激活你的研究智能体**

现在当你问 Claude："分析我们的前三大竞争对手如何定位他们的新 AI 功能，并找出我们可以利用的差距"

以下是会发生的事情：

1.  **项目上下文加载**：Claude 访问你上传的研究文档并遵循项目指令
2.  **MCP 连接激活**：Claude 在你的 Google Drive 中搜索最近的竞品简报并拉取 GitHub 数据
3.  **Skills 启用**：competitive-analysis Skill 提供分析框架
4.  **子智能体执行**（在 Claude Code 中）：market-researcher 收集行业数据，同时 technical-analyst 审查技术实现
5.  **提示词细化**：你提供对话式指导："特别关注医疗保健领域的企业客户"

**结果：** 一份全面的竞品分析，它从多个数据源中提取信息、遵循你的分析框架、利用专业知识，并在整个研究项目中保持上下文。

## **常见问题**

#### **Skills 如何工作？**

Skills 使用[渐进式披露](https://www.anthropic.com/engineering/equipping-agents-for-the-real-world-with-agent-skills)来保持 Claude 的高效。在处理任务时，Claude 首先扫描 Skill 元数据（描述和摘要）以识别相关匹配。如果某个 Skill 匹配，Claude 会加载完整指令。最后，如果该 Skill 包含可执行代码或参考文件，这些内容仅在需要时加载。

这种架构意味着你可以拥有许多 Skills 而不会压垮 Claude 的上下文窗口。Claude 在需要时精确访问它所需的内容。

#### **Skills 与子智能体：何时使用哪种**

**使用 Skills 当：** 你希望任何 Claude 实例都能加载和使用某项能力。Skills 就像培训材料——它们让 Claude 在所有对话中更擅长特定任务。

**使用子智能体当：** 你需要为特定目的设计的完整、自包含的智能体，它们[独立处理工作流](https://claude.com/resources/articles/building-agents-when-to-fold-subagents-into-your-main-agent-loop)。子智能体就像拥有自己上下文和工具权限的专业化员工。

**结合使用当：** 你希望子智能体具备专业知识。例如，一个代码审查子智能体可以使用 Skills 来获取特定语言的最佳实践，将子智能体的独立性与 Skills 的可移植专业知识结合起来。

#### **Skills 与提示词：何时使用哪种**

**使用提示词当：** 你在给出一次性指令、提供即时上下文，或进行对话式来回交流。提示词是反应式的、短暂的。

**使用 Skills 当：** 你有需要反复使用的流程或专业知识。Skills 是主动的——Claude 知道何时应用它们——并且跨对话持久保存。

**结合使用：** 提示词和 Skills 自然互补。使用 Skills 提供基础专业知识，然后使用提示词为每个任务提供特定上下文和细化。

#### **Skills 与 Projects：何时使用哪种**

**使用 Projects 当：** 你需要应为关于特定计划的所有对话提供信息的背景知识和上下文。Projects 提供始终加载的静态参考资料。

**使用 Skills 当：** 你需要仅在相关时激活的流程性知识和可执行代码。Skills 提供按需加载的动态专业知识，节省你的上下文窗口。

**结合使用当：** 你既想要持久上下文又想要专业化能力。例如，一个包含产品规格和用户研究的"产品开发"项目，结合用于创建技术文档和分析用户反馈数据的 Skills。

**关键区别：** Projects 说的是"这是你需要知道的内容"。Skills 说的是"这是做事的方法"。Projects 提供你在其中工作的知识库。Skills 提供在任何地方都能工作的能力——任何对话、任何项目。

#### **子智能体可以使用 Skills 吗？**

可以。在 Claude Code 和 Agent SDK 中，子智能体可以像主智能体一样访问和使用 Skills。这创造了强大的组合，让专业化子智能体利用可移植的专业知识。

例如，你的 python-developer 子智能体可以使用 pandas-analysis Skill 按照你团队的约定执行数据转换，而你的 documentation-writer 子智能体使用 technical-writing Skill 一致地格式化 API 文档。

## **开始使用**

准备好使用 Skills 构建了吗？以下是开始的方法：

**[Claude.ai](https://claude.ai/) 用户：**

-   在设置 → 功能中启用 Skills
-   在 claude.ai/projects 创建你的第一个项目
-   尝试将项目知识与 Skills 结合用于你的下一个分析任务

**API 开发者：**

-   在[文档](https://docs.anthropic.com/)中探索 Skills 端点
-   查看我们的 [skills cookbook](https://platform.claude.com/cookbook/skills-notebooks-01-skills-introduction)

**Claude Code 用户：**

-   通过[插件市场](https://code.claude.com/docs/en/plugin-marketplaces)安装 Skills
-   查看我们的 [skills cookbook](https://platform.claude.com/cookbook/skills-notebooks-01-skills-introduction)
