---
title: "用 MCP 构建触达生产系统的智能体"
source_url: "https://claude.com/resources/articles/building-agents-that-reach-production-systems-with-mcp"
publisher: "claude.com"
type: "blogPost"
date: "2026-04-22"
products: ["Claude Platform"]
read_time: 12
excerpt: ""
fetched_at: "2026-11-18"
---

# 用 MCP 构建触达生产系统的智能体

智能体的价值取决于它能触达哪些系统。在把智能体连接到外部系统这件事上，团队往往会收敛到三种做法——直接调用 API、CLI 和 MCP。本文说明这三种做法各自适用于什么场景、为什么生产环境中的智能体往往会选择 MCP，以及如何有效地构建这些集成。

## 将智能体连接到外部系统

我们通常看到三种将智能体连接到外部系统的路径：直接调用 API、CLI 和 MCP。每种做法都有其适用之处，取决于你在构建什么。关键区别在于智能体与服务之间是否存在一个公共层，以及这个层能覆盖多远。

### 直接调用 API

智能体直接调用你的 API——要么在代码执行沙箱中编写发起 HTTP 请求的代码，要么通过一个通用的函数调用工具。这是大多数团队的起点，对于单个智能体对接单个服务，或者少量不需要跨智能体平台复用的集成来说，它运行良好。

问题会在规模化时开始显现。由于智能体与服务之间没有公共层，每一对智能体–服务组合都会变成一个定制集成，各自处理自己的认证、工具描述和边界情况——这就是 M×N 集成问题。

### 命令行界面（CLI）

智能体在 shell 中运行你的命令行工具。这种方式快速、轻量，并且依托于已有的工具链。它非常适合本地环境和沙箱容器——任何有文件系统和 shell 的地方。这提供了一个公共层，但这个层很薄。

CLI 在触达移动端、Web 或云托管平台时会遇到硬性限制，因为这些平台不提供容器，而认证由 CLI 自身的机制处理——通常是磁盘上的凭据文件。它最适合本地环境中快速、宽松的集成。

### Model Context Protocol（MCP）

MCP 以协议的形式提供公共层。智能体连接到一个暴露你系统能力的服务器，认证、发现和丰富的语义都被标准化。一个远程服务器就能触达任何兼容的客户端（Claude、ChatGPT、Cursor、VS Code 等），并适用于任何部署环境。

它需要多一些前期投入。回报是集成具备可移植性，并提供功能丰富的智能体集成所需的语义。

## 生产环境中的智能体运行在云端

生产环境中的智能体越来越多地运行在云端，以便扩展并持续运行。它们需要触达的系统同样托管在云端：你的数据所在之处、工作被追踪之处，以及你的基础设施运行之处。这些系统往往是远程的、位于认证之后，而 MCP 正是在这里提供公共层。当这些系统位于私有网络而非公共互联网时，[Claude Managed Agents 中的 MCP tunnels](https://claude.com/resources/articles/claude-managed-agents-updates) 通过仅出站的连接将智能体连接到它们——无需暴露端口或公共端点。

我们已经在采用情况中看到了这一点。[MCP SDK](https://modelcontextprotocol.io/docs/sdk) 最近的月下载量已超过 3 亿次，而年初为 1 亿次，在企业界和流行的智能体式平台中都有强劲的采用。每天有数百万人将 MCP 与 Claude 一起使用，该协议支撑了我们近期发布的许多内容，包括 [Claude Cowork](https://claude.com/product/cowork)、[Claude Managed Agents](https://claude.com/resources/articles/claude-managed-agents) 以及 [Claude Code 中的 channels](https://code.claude.com/docs/en/channels)。
‍
随着 MCP 持续支撑生产环境的智能体式系统，我们分享一些把这些集成做好的模式：从构建高级服务器到上下文高效的客户端，以及 Skills 在哪些方面对协议形成补充。

## 构建高效的 MCP 服务器

我们的[目录](https://claude.ai/redirect/claudedotcom.v1.696c1b80-fe84-4eca-b413-9ca3a7bb4cd9/directory/connectors)中有 200 多个 MCP 服务器，每天有数百万人使用。通过与在该协议上构建的企业和开发者紧密合作，我们发现了若干决定智能体能否可靠使用某个服务器的设计模式。

### 构建远程服务器以实现最大覆盖

远程服务器才能带来分发能力——它是唯一能同时运行在 Web、移动端和云托管智能体上的配置，也是每个主流客户端都针对其优化的形态。构建远程服务器，让智能体无论在哪里运行都能使用你的系统。

### 围绕意图而非端点来组织工具

更少但描述良好的工具，始终优于对 API 的穷举式镜像。不要把你的 API 一对一地包装成 MCP 服务器——围绕意图组织工具，让智能体用几次调用就能完成任务，而不是把许多原语拼接起来。一个 create\_issue\_from\_thread 工具胜过 get\_thread + parse\_messages + create\_issue + link\_attachment。参见[为智能体编写有效的工具](https://www.anthropic.com/engineering/writing-tools-for-agents)了解完整模式。

### 当你的接口面很大时，为代码编排而设计

如果你的服务需要数百种不同的操作，例如 Cloudflare、AWS 或 Kubernetes，按意图分组的工具集很可能无法覆盖。相反，应暴露一个接受代码的薄工具面：智能体编写一段简短脚本，你的服务器在沙箱中针对你的 API 运行它，只返回结果。[Cloudflare 的 MCP 服务器](https://github.com/cloudflare/mcp)是参考示例——两个工具（search 和 execute）以约 1K token 覆盖约 2,500 个端点。

### 在有益之处提供丰富的语义

[MCP Apps](https://modelcontextprotocol.io/extensions/apps/overview) 是第一个官方协议扩展，它让工具可以返回交互式界面，例如图表、表单或仪表盘，全部内联渲染在聊天界面中。提供 MCP apps 的服务器，其采用率和留存率往往显著高于只返回文本的服务器。用它在你产品的 UI 真正重要的时刻，把它呈现在智能体或最终用户面前——该扩展已在 Claude.ai、Claude Cowork 以及许多其他顶级 AI 工具中得到支持。

‍[Elicitation](https://modelcontextprotocol.io/specification/2025-11-25/client/elicitation) 让你的服务器在工具调用中途暂停，向用户请求输入。[Form 模式](https://modelcontextprotocol.io/specification/2025-11-25/client/elicitation#form-mode-elicitation-requests)发送一个简单的 schema，由客户端渲染原生表单——用它来请求缺失的参数、确认破坏性操作或消除选项歧义。[URL 模式](https://modelcontextprotocol.io/specification/2025-11-25/client/elicitation#url-mode-elicitation-requests)把用户交给浏览器——用它来完成下游 OAuth、支付，或收集任何绝不应经过 MCP 客户端的凭据。两者都能让用户留在流程中，而不是被送到设置页面。Form 模式得到广泛支持；URL 模式在 Claude Code 中受支持，更多客户端正在跟进。

### 依托标准化认证

标准化认证让 MCP 对云托管智能体变得实用。如果你的服务器需要 OAuth，最新的 [MCP 规范](https://modelcontextprotocol.io/specification/2025-11-25)支持用 [CIMD](https://modelcontextprotocol.io/specification/2025-11-25/basic/authorization#client-id-metadata-documents)（Client ID Metadata Documents）进行客户端注册——它为用户提供快速的首次认证流程，并大幅减少意外的重新认证提示。这是我们推荐的认证方式，该能力已在 MCP SDK、Claude.ai 和 Claude Code 中得到支持，并正在全行业广泛采用。

用户完成授权后，下一个问题是云托管智能体如何在运行时持有并复用这些 token。[Claude Managed Agents](https://platform.claude.com/docs/en/managed-agents/overview) 中的 [Vaults](https://platform.claude.com/docs/en/managed-agents/vaults#mcp-oauth-credential) 解决了这一点：注册一次用户的 OAuth token，在创建会话时通过 ID 引用该 vault，平台就会把正确的凭据注入每个 MCP 连接，并代你刷新它们——无需构建密钥存储，也无需在每次调用时传递 token。

## 让 MCP 客户端更上下文高效

MCP 标准化了 AI 智能体（[_客户端_](https://modelcontextprotocol.io/docs/develop/build-client#python)）如何连接并使用它们所需的工具和数据源（[_服务器_](https://modelcontextprotocol.io/docs/develop/build-server)）。服务器安全地暴露一系列能力，而客户端负责编排它们并管理上下文。如果你在构建 MCP 客户端，请用渐进式披露的模式让它上下文高效。

### 通过工具搜索按需加载工具定义

[工具搜索](https://platform.claude.com/docs/en/agents-and-tools/tool-use/tool-search-tool)推迟把所有工具加载到上下文中，而不是预先加载。这允许智能体在运行时搜索目录，在需要时拉入相关工具。在我们的[测试](https://www.anthropic.com/engineering/advanced-tool-use)中，工具搜索往往能把工具定义的 token 减少 85% 以上，同时保持较高的选择准确率。



用工具搜索减少上下文用量。来源：advanced tool use

### 通过程序化工具调用在代码中处理工具结果

[程序化工具调用](https://www.anthropic.com/engineering/code-execution-with-mcp)在代码执行沙箱中处理工具结果，而不是把它们原样返回给模型。这让智能体可以在代码中跨调用进行循环、过滤和聚合，只有最终输出进入上下文。在我们的测试中，这在复杂的多步工作流上把 token 用量减少了约 [37%](https://platform.claude.com/docs/en/agents-and-tools/tool-use/programmatic-tool-calling)。

这些模式在多个服务器之间可以自然地组合：更精简的上下文、更少的往返、更快的响应。完整解析参见[_高级工具调用_](https://www.anthropic.com/engineering/advanced-tool-use)。

## 将 MCP 服务器与 Skills 搭配使用

[Skills 与 MCP 是互补的](https://claude.com/resources/articles/skills-explained)。MCP 让智能体能够访问来自外部系统的工具和数据，而 Skills 教会智能体_如何_使用这些工具来完成实际工作的程序性知识。能力最强的智能体两者兼用，而 Skills 让 MCP 服务器能够扩展到少数几个连接之外。组合它们有两种通用模式：

### 将 Skills 和 MCP 服务器打包为插件

Claude 的[插件](https://code.claude.com/docs/en/plugins-reference#plugin-components-reference)是一个有用的抽象，让开发者可以把 Skills、MCP 服务器、钩子（hooks）、LSP 服务器和专用子智能体打包在一种易于使用的分发方式中。使用这种方法是以最小摩擦统一多个上下文提供者的最佳方式。

将 MCP 服务器与 Skills 结合，能让 Claude 更像领域专家那样行事。通过 MCP 获取你的工具，并赋予 Claude 端到端编排工作流的 Skills。参见我们为 Cowork 提供的[数据插件](https://claude.ai/redirect/claudedotcom.v1.696c1b80-fe84-4eca-b413-9ca3a7bb4cd9/directory/plugins/data%40knowledge-work-plugins)作为示例，它由 10 个 Skills 和 8 个 MCP 服务器组成，用于 Snowflake、Databricks、BigQuery、Hex 等应用。



将 Skills 与 MCP 结合。来源：Extending Claude’s capabilities with skills and MCP servers

### 从 MCP 服务器分发 Skills

提供方在其 MCP 服务器之外同时发布一个 Skill 正变得越来越普遍，这样智能体既能获得原始能力，也能获得一份有明确主张的实战手册（playbook）来用好它们。[Canva](https://claude.com/connectors/atlassian)、[Notion](https://claude.com/connectors/notion)、[Sentry](https://claude.com/connectors/sentry) 等目前已在 Claude 中这样做，在我们的[网页目录](https://claude.com/connectors)中把 Skill 列在其连接器旁边。

为了让这种搭配在每个客户端上都可移植，MCP 社区正在积极制定一个[扩展](https://github.com/modelcontextprotocol/experimental-ext-skills)，用于直接从服务器交付 Skills。这样客户端就能自动继承相关专业知识，并与其所依赖的 API 一起进行版本管理。我们预计，随着该扩展趋于稳定，这种模式将得到广泛采用。

## 不断累积的层

我们以连接智能体到外部系统的三条路径开篇。在实践中，成熟的集成会同时提供三者：API 作为基础，CLI 用于本地优先的环境，MCP 用于基于云的智能体。

随着生产环境中的智能体迁移到云端，MCP 成为关键层，也是那个会不断累积的层。如今，一个远程服务器就能触达任何部署环境中的每个兼容客户端，认证、交互性和丰富的语义都由协议处理。随着更多客户端采用该规范、更多扩展落地其中，同一个服务器无需你发布任何新东西就能变得更强。

在构建集成时，如果你的目标是让云端的生产智能体触达你的系统，那就构建一个 MCP 服务器，并用上述模式把它做到出色。每一个基于 MCP 构建的集成都在强化生态：需要独自解决的边界情况更少，需要维护的定制集成更少。

### 致谢

感谢 Den Delimarsky、David Soria Parra、Henry Shi、Felix Rieseberg、Conor Kelly、Molly Vorwerck、Andy Schumeister、Kevin Garcia、Amie Rotherham、Matt Samuels、Angela Jiang、Katelyn Lesse、AJ Rebeiro 和 Jess Yan 对本文的贡献。
