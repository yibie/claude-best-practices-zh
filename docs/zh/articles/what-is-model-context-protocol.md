---
title: "什么是 Model Context Protocol？将 AI 连接到你的世界"
source_url: "https://claude.com/resources/articles/what-is-model-context-protocol"
publisher: "claude.com"
type: "blogPost"
date: "2025-10-31"
products: ["Claude apps"]
read_time: 10
excerpt: "使用 Model Context Protocol，无需自定义集成即可将 AI 助手连接到你的工具。"
fetched_at: "2026-11-18"
---

# 什么是 Model Context Protocol？将 AI 连接到你的世界
AI 模型的表现取决于提供给它的上下文。像 [Claude](https://claude.ai/redirect/claudedotcom.v1.6247ca95-22c0-4ce9-8348-9037a2461b07) 这样的 AI 助手可以回答问题并执行令人印象深刻的各种任务，但如果它们无法访问所需的数据或工具，它们能为你做的事情就受到限制。你通常通过从一个标签页复制粘贴上下文到另一个标签页来解决这个问题，无论是编辑 Google Drive 中的文档、回复 Slack 中的消息串，还是更新 IDE 中的代码。这个过程缓慢、手动，而且有遗漏重要上下文的风险。

**Model Context Protocol（MCP）** 提供了一个开放且广泛适用于所有 AI 应用和助手的解决方案。在本文中，你将了解 MCP 是什么、它如何工作以及为什么重要，还有它面向谁。你将看到 MCP 实际应用的示例，并了解如何立即开始使用 MCP 或基于 MCP 进行构建。

## 什么是 Model Context Protocol（MCP）？

**Model Context Protocol** 是一个开放标准，定义了 LLM 如何与外部系统通信。

把 MCP 想象成 **LLM 的 USB-C**。正如 USB-C 为你的手机、笔记本电脑和其他设备提供通用连接器一样，MCP 为 LLM 连接外部系统提供了通用格式。在 USB-C 之前，每个电子设备都有自己的线缆：iPhone 用 Lightning，Android 用 micro-USB，相机用专有连接器。随着越来越多的设备采用 USB-C，整个生态系统的连接变得无缝。

MCP 为 AI 集成带来了同样的简洁性。在 MCP 之前，每个应用和数据库都需要自定义代码才能与 LLM 连接。Google Drive 需要自己的集成，Slack 需要另一个，Figma 又需要另一个。现在，MCP 提供了一种单一的标准化格式，用于将这些工具连接到 Claude 和其他 AI 应用。



## MCP 从何而来？

MCP 由 David Soria Parra 和 Justin Spahr-Summers 在 Anthropic 创建。这个想法源于 David 对不断在 Claude Desktop 和他的集成开发环境（IDE）之间复制代码的沮丧。认识到这是一个典型的 M×N 问题——多个应用需要多个集成——David 向 Justin 提出了构建一个协议来解决这个问题的想法。他们基于流行的 Language Server Protocol 设计了 MCP，并在 Anthropic 的支持下于 2024 年 11 月将其开源，以确保整个 AI 生态系统都能受益。

## MCP 如何工作？

MCP 通过双端协作的方式工作。像 Claude 这样的 AI 智能体和聊天机器人创建 **MCP Clients**，以便连接到 Notion、Canva 或 Figma 等应用，这些应用通过 **MCP Servers** 提供其工具和数据。

通过构建 **MCP Client**，AI 智能体和聊天机器人可以访问社区构建的数千个 MCP Servers，为它们扩展能力提供了一条直接的路径。智能体还可以通过 [MCP tunnels](https://claude.com/resources/articles/claude-managed-agents-updates) 访问你防火墙后面的 MCP servers。通过构建 **MCP Server**，公司和开发者可以让他们的产品随时可供 AI 使用，开辟一条提供价值的新途径。

由于 MCP 是开源的，任何人都可以构建 MCP Server 或 Client。

## 为什么 MCP 很重要？

MCP 让 LLM 超越聊天，执行现实世界的任务：阅读邮件串并发送回复、访问代码库并部署更新，或者审阅设计简报并生成初稿。该协议为 LLM 连接外部系统、工具和应用以访问数据并采取行动奠定了基础。这提供了：

### AI 的通用兼容性

**AI 助手获得数千种工具的访问权限** —— 一旦 AI 助手实现了 MCP（通过 MCP client），它就能立即连接到数千个兼容 MCP 的应用，从专业编码工具到企业工作流平台，无需为每一个构建自定义集成。

**工具和应用一次性连接到所有 AI 助手** —— Notion、Figma 或 Asana 等公司构建一个 MCP server，即可与任何兼容的 AI 助手（即已实现 MCP client 的助手）配合使用。开发者只需为所有 AI 连接构建一个集成。

### 开放的、AI 原生的生态系统

**任何人都可以构建和分享** —— 作为开放标准，开发者或公司发布的 MCP servers 与任何 MCP client 兼容。这种开放性创造了一个繁荣的生态系统，拥有数千个社区构建的 servers，加速了 AI 助手可用的工具和应用的供应。

**让软件在设计上对 AI 可访问** —— 传统软件是为使用 Web 界面的人类构建的。MCP 提供了一个专为 AI 交互设计的并行接口，使应用能够真正成为 AI 原生。这意味着 AI 模型与人们已在使用的工具之间实现更好、更可靠的集成。

### 智能体的基础协议

MCP 为 AI 智能体构建了访问任意数量服务和工具的基础设施，实现真正的端到端任务自动化。随着越来越多的应用采用该协议，AI 智能体能够独立处理复杂的多步骤工作流的愿景变得越来越实际。

## MCP 面向谁？

开发者获得了一种标准化的方式来构建集成，一次构建即可与任何兼容的 AI 配合使用。企业获得了安全的、由 IT 控制的 AI 连接，可在整个组织内扩展。消费者可以立即将他们喜爱的工具连接到 AI，无需任何技术知识。

### 面向开发者：连接 AI 与应用的一个标准

开发者可以遵循单一标准将外部产品连接到自己的 AI 应用和智能体。这简化了构建集成的过程，增加了可连接产品的数量，并提高了生态系统中连接的整体质量和安全性。

正在构建一个需要连接许多应用的智能体？正在构建一个需要连接许多智能体的应用？MCP 为你提供对兼容工具生态系统的访问，并简化集成。

### 面向企业：跨组织安全、可扩展的 AI 连接

企业可以更有效地推动 AI 工具和应用的内部采用，因为 MCP 简化了将企业系统连接到 AI 的过程。这有助于在组织内让 AI 更加互联，扩展其对员工的能力和实用性。

### 面向消费者：即时访问你喜爱的工具

MCP 为最终用户提供其喜爱的 AI 助手与工作工具之间的无缝连接。它使自动化任务和避免跨标签页复制粘贴变得更加容易。简而言之，MCP 让 AI 对你的世界有更大的访问权限和连接性。

在 [Claude](https://claude.ai/redirect/claudedotcom.v1.6247ca95-22c0-4ce9-8348-9037a2461b07) 中，你可以立即连接到 MCP Servers，即 [**Connectors**](https://claude.com/partners/mcp)。这为你提供了一种直接的方式将 Claude 连接到你喜爱的工作应用。

## Connectors（MCP）实际应用

当你看到 MCP 与你已在使用的工具一起实际运行时，它的真正价值就变得清晰了。以下是一些 MCP 用于驱动 Claude 中集成的示例，这些集成被称为 **Connectors**：

### Claude 中的 Canva

Canva Connector 允许 Claude 直接在 Canva 中生成新设计。使用 MCP，Claude 可以连接到 Canva 提供的工具，在画布上生成设计。

### Claude 中的 Notion 和 Linear

使用 Notion 和 Linear Connectors，Claude 可以访问你在 Notion 中的页面，并使用它们来更新 Linear 中的工单。在这里，MCP 将非结构化上下文无缝转移到单独的项目管理系统中组织好的工单里。

### Claude Code 中的 Figma

Figma Connector 允许 Claude 访问 Figma 中的设计。这让 Claude Code 能够基于 Figma 中创建的设计，为网站、应用或用户界面创建可工作的原型。

### 可用的 Claude Connectors

Claude Connectors 包括以下集成：

-   **Notion** 用于工作区文档
-   **Linear** 用于问题跟踪
-   **Stripe** 用于支付数据
-   **Canva** 和 **Figma** 用于设计辅助
-   **Hubspot** 用于自动化 CRM 任务
-   **Sentry** 用于错误跟踪
-   ……以及更多

每个 connector 只需几秒钟即可配置完成，成为 Claude 工作上下文的一部分。在 Claude 之外，[开源 MCP Registry](https://modelcontextprotocol.io/) 上还有一个 MCP servers 生态系统。



## 开始探索 MCP

根据你的需求，有两条路径。

### Claude 中的 Connectors

[Connectors](https://claude.com/partners/mcp) 是预构建的，让 Claude 即时访问工具、数据库和应用，并为你提供一套新的能力。打开 [Claude](https://claude.ai/redirect/claudedotcom.v1.6247ca95-22c0-4ce9-8348-9037a2461b07/directory)，浏览可用的 connectors，点击即可添加。

### 构建自定义 MCP 连接

MCP 是开源的，这意味着任何人都可以采用 MCP 将 AI 连接到应用。[Model Context Protocol 文档](https://modelcontextprotocol.io/) 介绍了如何基于 MCP 进行构建。

## 入门

如果你想尝试 MCP，首先浏览一个你可以立即在 Claude 中使用的 Claude Connector。

如果 MCP server 尚不存在，创建自己的 server 需要一些工作，但如果你了解 TypeScript 或 Python，也不算太复杂。[Model Context Protocol 快速入门](https://modelcontextprotocol.io/quickstart) 提供了可用的示例，你可以根据自己的需求进行修改。
