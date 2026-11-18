---
title: "使用 CLAUDE.md 文件：为你的代码库定制 Claude Code"
source_url: "https://claude.com/resources/articles/using-claude-md-files"
publisher: "claude.com"
type: "blogPost"
date: "2025-11-25"
products: ["Claude Code"]
read_time: 13
excerpt: "一份实用指南，介绍如何使用 CLAUDE.md 文件来优化你对 Claude Code 的使用。"
fetched_at: "2026-11-18"
---

# 使用 CLAUDE.md 文件：为你的代码库定制 Claude Code

如果你使用 AI 编程智能体，你会面临同样的挑战：如何给它们足够的上下文，让它们理解你的架构、约定和工作流，而不必反复解释？

随着代码库增长，这个问题会不断加剧。复杂的模块关系、领域特定的模式和团队约定并不会轻易显现。你最终会在每次对话开始时重复解释相同的架构决策、测试要求和代码风格偏好。

[CLAUDE.md](https://www.anthropic.com/engineering/claude-code-best-practices) 文件通过为 Claude 提供关于你项目的持久上下文来解决这个问题。可以把它看作一个配置文件，Claude 会自动将其纳入每次对话，确保它始终了解你的项目结构、编码标准和偏好的工作流。

在本文中，我们将介绍如何组织你的 [CLAUDE.md](http://claude.md/)、分享最佳实践，以及充分利用 Claude Code 的技巧。

## 什么是 CLAUDE.md 文件？

CLAUDE.md 是一个特殊的配置文件，位于你的仓库中，为 Claude 提供项目特定的上下文。你可以把它放在仓库根目录以便与团队共享，放在父目录中以适配 monorepo 结构，或放在主文件夹中以便在所有项目中通用。

以下是你可能放在仓库中的一个 CLAUDE.md 示例：

````
# Project Context

When working with this codebase, prioritize readability over cleverness. Ask clarifying questions before making architectural changes.

## About This Project

FastAPI REST API for user authentication and profiles. Uses SQLAlchemy for database operations and Pydantic for validation.

## Key Directories

- `app/models/` - database models
- `app/api/` - route handlers
- `app/core/` - configuration and utilities

## Standards

- Type hints required on all functions
- pytest for testing (fixtures in `tests/conftest.py`)
- PEP 8 with 100 character lines

## Common Commands
```bash
uvicorn app.main:app --reload  # dev server
pytest tests/ -v               # run tests
```

## Notes

All routes use `/api/v1` prefix. JWT tokens expire after 24 hours.
````

配置良好的 CLAUDE.md 会改变 Claude 与你特定项目协作的方式。该文件有多种用途：提供架构上下文、建立工作流，以及将 Claude 连接到你的开发工具。每一次添加都应该解决你实际遇到的问题，而不是关于 Claude 可能需要什么的假设性问题。

该文件可以记录常用 bash 命令、核心工具、代码风格指南、测试说明、仓库约定、开发环境设置以及项目特定的警告。没有必需的格式。建议保持该文件简洁且易于人类阅读，把它当作人类和 Claude 都需要快速理解的文档。

你的 CLAUDE.md 文件会成为 Claude 系统提示词的一部分。每次对话开始时，这些上下文已经加载完毕，无需反复解释基本的项目信息。

## **开始使用 /init**

从零开始创建 CLAUDE.md 可能会让人望而生畏，尤其是在不熟悉的代码库中。

`/init` 命令通过分析你的项目并生成起始配置来自动化这个过程。

在任何 Claude Code 会话中运行 `/init`：

```
cd your-project
claude
/init
```

Claude 会检查你的代码库——读取包文件、现有文档、配置文件和代码结构——然后生成针对你项目定制的 CLAUDE.md。生成的文件通常包括构建命令、测试说明、关键目录以及它检测到的编码约定。

把 `/init` 看作起点，而非成品。生成的 CLAUDE.md 捕获了明显的模式，但可能遗漏你工作流特有的细节。审查 Claude 生成的内容，并根据你团队的实际做法进行完善。

你也可以在已有 CLAUDE.md 的项目上使用 `/init`。Claude 会审查当前文件，并根据它探索代码库时了解到的情况提出改进建议。

运行 `/init` 后，考虑以下后续步骤：

-   审查生成内容的准确性
-   添加 Claude 无法推断的工作流说明（分支命名约定、部署流程、代码审查要求）
-   删除不适用于你项目的通用指导
-   将文件提交到版本控制，让团队受益

`/init` 命令非常适合快速上手，但真正的价值在于随着时间推移对生成的文件进行迭代。当你使用 Claude Code 时，使用 `#` 键添加你发现自己反复输入的说明——这些添加会逐渐积累成一个真正反映你团队工作方式的 CLAUDE.md。

## 如何组织你的 CLAUDE.md

以下各节将向你展示如何组织内容以发挥最大效果：导航复杂架构、跟踪多步骤任务的进度、集成自定义工具，以及通过一致的工作流防止返工。

### 给 Claude 一张地图

为每个新任务解释你的项目架构、关键库和编码风格会变得很繁琐。你需要 Claude 在无需手动强化的情况下，对你的代码库结构保持一致的理解。

在 CLAUDE.md 中添加项目摘要和高层目录结构。这让 Claude 在浏览你的代码库时能立即找到方向。

一个显示关键目录的简单树形输出能帮助 Claude 理解不同组件所在的位置：

```
main.py
├── logs
│   ├── application.log
├── modules
│   ├── cli.py
│   ├── logging_utils.py
│   ├── media_handler.py
│   ├── player.py
```

包含关于主要依赖、架构模式以及任何非标准组织选择的信息。如果你使用领域驱动设计、微服务或特定框架，请记录下来。Claude 使用这张地图来更好地决定在哪里查找代码以及在哪里进行更改。

### 将 Claude 连接到你的工具

Claude 继承你的完整环境，但需要指导来了解使用哪些自定义工具和脚本。你的团队可能拥有专门的部署、测试或代码生成工具，Claude 应该了解它们。

在 CLAUDE.md 中记录你的自定义工具及使用示例。包括工具名称、基本使用模式以及何时调用它们。如果你的工具通过 `--help` 标志提供帮助文档，请提及这一点，以便 Claude 知道去查看。对于复杂工具，添加你团队经常使用的常见调用示例。

Claude 作为 MCP（Model Context Protocol）客户端运行，连接到扩展其能力的 MCP 服务器。通过项目设置、全局配置或签入的 `.mcp.json` 文件来配置这些。当工具未按预期出现时，`--mcp-debug` 标志有助于排查连接问题。

例如，如果你为组织配置了一个 Slack MCP 服务器，并且需要 Claude 了解如何使用它，请在 CLAUDE.md 中包含类似以下内容：

```
### Slack MCP
- Posts to #dev-notifications channel only
- Use for deployment notifications and build failures
- Do not use for individual PR updates (those go through GitHub webhooks)
- Rate limited to 10 messages per hour
```

了解更多关于 MCP [基础知识和最佳实践](https://claude.com/resources/articles/what-is-model-context-protocol)。

有关为 Claude Code 设置权限的更多信息，请参阅 [code.claude.com](https://code.claude.com/docs/en/settings) 上的 settings.json 文档。

### **定义标准工作流**

让 Claude 不经过规划就直接进行代码更改会导致返工。Claude 可能实现一个遗漏需求的方案、选择错误的架构方法，或做出破坏现有功能的更改。

你需要 Claude 在行动之前先思考。在 CLAUDE.md 中定义 Claude 应针对不同类型任务遵循的标准工作流。一个可靠的默认工作流在做出更改之前回答四个问题：

1.  这是关于当前状态的问题，需要先进行调查吗？
2.  这需要在实施前制定详细计划吗？
3.  缺少哪些额外信息？
4.  如何测试有效性？

具体的工作流可能包括针对功能的探索-规划-编码-提交，针对算法工作的测试驱动开发，或针对 UI 更改的视觉迭代。记录你的测试要求、提交消息格式以及任何审批步骤。当 Claude 事先了解你的工作流时，它会按照你团队的实际流程来组织工作，而不是猜测。

一个工作流说明示例可能是：

```
1) Before modifying code in the following locations: X, Y, Z
	- Consider how it might affect A, B, C
	- Construct an implementation plan
	- Develop a test plan that will validate the following functions...
```

## ‍**使用 Claude Code 的更多技巧**

除了配置 CLAUDE.md 文件之外，还有三种技巧可以改善你使用 Claude Code 的方式。

### **保持上下文新鲜**

随着时间推移，使用 Claude Code 会积累无关的上下文。早期任务的文件内容、不再重要的命令输出以及无关的对话会填满 Claude 的上下文窗口。随着信噪比下降，Claude 难以保持对当前任务的专注。

在不同任务之间使用 `/clear` 来重置上下文窗口。这会清除积累的历史记录，同时保留你的 CLAUDE.md 配置以及 Claude 以新鲜上下文处理新问题的能力。可以把它看作关闭一个工作会话并开启另一个。

当你完成认证调试并切换到实现新的 API 端点时，清除上下文。认证细节不再重要，反而会分散对新工作的注意力。

### **为不同阶段使用子智能体**

长对话会积累干扰新任务的上下文。你已经调试了一个复杂的认证流程，现在需要对同一代码进行安全审查。调试细节会影响 Claude 的安全分析，可能导致它忽略问题或专注于已经解决的关注点。

告诉 Claude 为不同的工作阶段使用[子智能体](https://code.claude.com/docs/en/sub-agents)。子智能体维护隔离的上下文，防止早期任务的信息干扰新分析。在实现支付处理器后，指示 Claude "使用子智能体对该代码进行安全审查"，而不是在同一对话中继续。

子智能体最适合每个阶段需要不同视角的多步骤工作流。实现需要架构上下文和功能需求；安全审查需要专注于漏洞的全新视角。上下文隔离让两种分析都保持敏锐。

### **创建自定义命令**

重复的提示词浪费时间。你发现自己一遍又一遍地输入"审查此代码的安全问题"或"分析此代码的性能问题"。每次你都需要记住能获得良好结果的确切措辞。

自定义斜杠命令将这些存储为 `.claude/commands/` 目录中的 markdown 文件。创建一个名为 `performance-optimization.md` 的文件，包含你偏好的性能优化提示词，它就会在任何对话中作为 `/performance-optimization` 可用。命令通过 $ARGUMENTS 或编号占位符（如 `$1` 和 `$2`）支持参数，让你传递特定文件或参数。

例如，`performance-optimization.md` 可能如下所示：

````
# Performance Optimization

Analyze the provided code for performance bottlenecks and optimization opportunities. Conduct a thorough review covering:

## Areas to Analyze

### Database & Data Access
- N+1 query problems and missing eager loading
- Lack of database indexes on frequently queried columns
- Inefficient joins or subqueries
- Missing pagination on large result sets
- Absence of query result caching
- Connection pooling issues

### Algorithm Efficiency
- Time complexity issues (O(n²) or worse when better exists)
- Nested loops that could be optimized
- Redundant calculations or repeated work
- Inefficient data structure choices
- Missing memoization or dynamic programming opportunities

### Memory Management
- Memory leaks or retained references
- Loading entire datasets when streaming is possible
- Excessive object instantiation in loops
- Large data structures kept in memory unnecessarily
- Missing garbage collection opportunities

### Async & Concurrency
- Blocking I/O operations that should be async
- Sequential operations that could run in parallel
- Missing Promise.all() or concurrent execution patterns
- Synchronous file operations
- Unoptimized worker thread usage

### Network & I/O
- Excessive API calls (missing request batching)
- No response caching strategy
- Large payloads without compression
- Missing CDN usage for static assets
- Lack of connection reuse

### Frontend Performance
- Render-blocking JavaScript or CSS
- Missing code splitting or lazy loading
- Unoptimized images or assets
- Excessive DOM manipulations or reflows
- Missing virtualization for long lists
- No debouncing/throttling on expensive operations

### Caching
- Missing HTTP caching headers
- No application-level caching layer
- Absence of memoization for pure functions
- Static assets without cache busting

## Output Format

For each issue identified:
1. **Issue**: Describe the performance problem
2. **Location**: Specify file/function/line numbers
3. **Impact**: Rate severity (Critical/High/Medium/Low) and explain expected performance degradation
4. **Current Complexity**: Include time/space complexity where applicable
5. **Recommendation**: Provide specific optimization strategy
6. **Code Example**: Show optimized version when possible
7. **Expected Improvement**: Quantify performance gains if measurable

If code is well-optimized:
- Confirm optimization status
- List performance best practices properly implemented
- Note any minor improvements possible

**Code to review:**
```
$ARGUMENTS
```
````

你不需要手动编写自定义命令文件。让 Claude 为你创建它们：

```
Create a custom slash command called /performance-optimization that analyzes code for database query issues, algorithm efficiency, memory management, and caching opportunities.
```

Claude 会将 markdown 文件写入 `.claude/commands/performance-optimization.md`，该命令将立即可用。

## **从简单开始，有意识地扩展**

很容易想立即创建一个全面的 CLAUDE.md。请抵制这种冲动。

CLAUDE.md 每次都会添加到 Claude Code 的上下文中，因此从[上下文工程](https://www.anthropic.com/engineering/effective-context-engineering-for-ai-agents)和[提示词工程](https://claude.com/resources/articles/best-practices-for-prompt-engineering)的角度来看，保持简洁。一种选择：将信息分解为单独的 markdown 文件，并在 CLAUDE.md 文件中引用它们。

不要包含敏感信息、API 密钥、凭据、数据库连接字符串或详细的安全漏洞信息——尤其是当你提交到版本控制时。由于 CLAUDE.md 会成为 Claude 系统提示词的一部分，请将其视为可能被公开共享的文档。

## **让 CLAUDE.md 为你服务**

CLAUDE.md 文件将 Claude Code 从通用助手转变为专门为你的代码库配置的工具。从基本的项目结构和构建文档开始，然后根据工作流中的实际摩擦点进行扩展。

最有效的 CLAUDE.md 文件解决真实问题：它们记录你反复输入的命令、捕获需要十分钟才能解释清楚的架构上下文，并建立防止返工的工作流。你的文件应该反映你团队实际开发软件的方式——而不是听起来不错但与现实不符的理论最佳实践。

将定制视为持续的实践，而非一次性的设置任务。项目会变化，团队会学到更好的模式，新工具会进入你的工作流。维护良好的 CLAUDE.md 会随你的代码库一起演进，持续减少在复杂软件上使用 AI 辅助时的摩擦。

**_立即开始使用 [Claude Code](https://www.claude.com/product/claude-code)。_**
