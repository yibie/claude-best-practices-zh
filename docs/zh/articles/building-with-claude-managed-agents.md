---
title: "智能体界面的演进：使用 Claude Managed Agents 构建"
source_url: "https://claude.com/resources/articles/building-with-claude-managed-agents"
publisher: "claude.com"
type: "blogPost"
date: "2026-06-10"
products: ["Claude Platform"]
read_time: 16
excerpt: "随着模型智能与智能体执行框架（harness）的演进，Anthropic 的 Claude Managed Agents 让团队能够在生产环境中可靠地大规模构建和部署智能体。以下是团队使用它的原因与方式。"
fetched_at: "2026-11-18"
---

# 智能体界面的演进：使用 Claude Managed Agents 构建

把一个智能体投入生产，光有好的提示词远远不够。智能体需要有地方运行它写出的代码，需要凭据来访问你的数据，需要可观测的会话，还需要能随用量扩展的基础设施。在应用 AI（Applied AI）团队，我们的工作横跨产品、研究与基于 Claude 构建的客户之间——我们反复看到同一个规律：基础设施是原型与生产级智能体的分水岭。太多时候，团队把开发周期消耗在安全、状态管理、权限控制和执行框架调优上。

[Claude Managed Agents](https://platform.claude.com/docs/en/managed-agents/overview) 是我们用于构建和部署生产级智能体的一套可组合 API，它将为性能调优的智能体执行框架与生产基础设施配对，让团队能在几天而非几个月内从原型走向上线。本文将介绍 Anthropic 智能体构建模块的演进、我们为什么构建 Claude Managed Agents，以及团队如今如何在生产中使用它。

## **演进智能体架构**

2023 年我们向开发者开放 Claude 时，API 刻意保持简单：token 进，token 出。你发送提示词，Claude 返回补全结果，执行框架和底层基础设施由你自己构建。

多年来 API 不断丰富，但底层的约定从未改变：一次请求、一次模型轮次，由你的应用决定接下来发生什么。很长一段时间里，这已经足够。总结文档、分类工单、改写一段文字——这类工作舒适地落在单轮之内。

然而随着时间推移，人们想交出去的任务不再适配这种模式。他们希望 Claude 把任务一路推进到底：查资料、采取行动、查看变化、决定下一步。他们还希望 Claude 在_工作已经运行所在的系统内部_运作，比如代码库、内部 wiki 或工单系统。

用 API 把 Claude 变成智能体，意味着你要自己构建循环：问模型该做什么、运行工具、把结果喂回去、重复。你需要负责构建和部署智能体脚手架，而它可能随模型演进而需要调优。对于需要完全定制的智能体，这种方式是合理的。但对于更可预测、复杂度更低的智能体式工作负载，随着模型和产品不断演进，持续优化执行框架变得繁琐。

[Claude Code](https://claude.com/product/claude-code) 是我们在 2025 年推出的智能体式编码工具，让 Claude 直接与你的代码库交互，它包含了我们自己版本的那套执行框架：循环、工具执行、子智能体、上下文管理，以及让它成为高效智能体的丰富能力。开发者自然希望在自己的智能体上、跨各个领域，获得类似的执行框架机制。

为了让团队能在 Claude Code 执行框架之上构建智能体，我们发布了 [Claude Agent SDK](https://code.claude.com/docs/en/agent-sdk/overview)。Claude Agent SDK 让开发者能在运行 Claude Code 的同一套机制上构建自己的智能体，而不必维护自研循环。对许多团队来说，这正是智能体变得实用的时刻：执行框架到来时就已经为 Claude 调优好，并带有基础设施原语，而且随着 Claude Code 的演进而持续改进。

然而，即便有了执行框架，在生产环境中部署智能体仍可能因以下几个原因而充满挑战：

-   **托管与扩展。** 智能体在哪里运行？一个进程能为多小时的任​​务存活多久？用量增长时由什么来扩展？
-   **会话管理。** 智能体的历史与进度存放在哪里？一次运行能否在中断后存活并无碍地恢复？你能否回溯并检查之前会话中发生了什么？
-   **文件系统管理。** 做真正的工作意味着产出工件：编辑代码、写入文件、构建输出。智能体从哪里获得可操作的工作区？该工作区在两次运行之间会发生什么？
-   **执行隔离。** Claude 写出的代码必须在某处执行。如果出错，影响范围有多大？在生产中你真正愿意信任的边界是什么？
-   **凭据。** 智能体需要访问你的系统。它如何在不向自己生成的代码暴露专有信息的前提下获得这种访问？
-   **可观测性。** 当一个智能体自主工作一小时并做出意外之举时，你能否重建它走过的每一步？

借助 Agent SDK，上述生产基础设施的许多要素通过 Claude Code 的机制提供。智能体获得真实可用的文件系统，会话状态持久化在本地或外部存储上，可观测性可通过 OpenTelemetry 导出到你已在运行的任何监控栈中。

然而，随着团队越来越多地构建走出本地开发、进入生产的智能体，他们需要一种能够大规模部署并具备托管基础设施的方式。而随着模型及其周边执行框架变得更先进——运行更久、执行更多代码、触及更多系统、采取更多行动——扩展、安全和沙箱化变得更加困难。

其中若干障碍源于一个共同的架构选择：智能体执行框架常常运行在_与其操作的文件系统相同的容器内_。容器必须先启动（付出启动成本），Claude 才能思考；智能体连同代码执行紧挨着你的凭据；容器死亡时，运行也随之死亡。

Managed Agents 通过[将大脑与双手解耦](https://www.anthropic.com/engineering/managed-agents)解决了这些问题。调用 Claude 的执行框架与执行代码的沙箱分开运行，而会话——一份记录每次模型调用、工具调用和结果的仅追加日志——连接两者。Claude 可以在任何容器存在之前就开始推理，沙箱与你的凭据保持距离，整个运行可以在任何时候从其会话中重建。

## **何时以及为何使用 Claude Managed Agents**

使用 Managed Agents 构建时，用户定义任务、工具和护栏，Anthropic 在我们的基础设施上运行智能体，并处理底层的智能体循环：如何为智能体提供调用工具的执行环境、出错时如何恢复、多智能体编排等等。

当执行框架不随模型智能一同演进时，[智能体就会崩溃](https://www.anthropic.com/engineering/harness-design-long-running-apps)。在 Claude Sonnet 4.5 上，智能体在接近上下文末尾时会急于收尾，把工作草草截断，而不是利用剩余的余量——这种模式被称为「上下文焦虑」。我们的解决办法是在执行框架中加入上下文重置，内置了一个假设：Claude 在接近上限时需要帮助才能保持连贯。这个假设没能撑到下一个模型。在 Claude Opus 4.5 上，该行为消失了，而我们加入的重置只是额外开销。

对大多数组织而言，维护执行框架是一种无法让产品差异化的开销。执行框架必须针对特定的模型行为进行调优；上下文压缩（compaction）、工具执行和缓存等原语在 Claude 上的工作方式与其他模型不同。借助 Claude Managed Agents，执行框架随模型一同演进，让团队专注于真正能让智能体差异化的东西：**上下文管理与领域专业知识。**

为了让开发者能够配置构建高效智能体所需的上下文和工具，Managed Agents 围绕三种主要资源构建：智能体、环境和会话。_智能体_是一种配置：模型、提示词、一组工具，以及围绕它们的护栏。_环境_是智能体运行所在的执行上下文：沙箱容器、其网络规则，以及其中预装的软件包，托管在我们的云上或你控制的​​基础设施上。每次运行是一个_会话_，它将一个智能体与一个环境配对，并获得自己独立的沙箱实例。会话在服务端持久化其完整的事件历史、沙箱状态和输出，因此长时间运行的工作可以暂停、干净地恢复，并在事后逐步追踪。借助 Managed Agents，你可以一次性定义智能体和环境，然后随着工作负载增长，针对同一配置运行多个会话。

## **在 Managed Agents 上为生产与规模而构建**

在应用 AI 团队内部，我们看到智能体在 Anthropic 内部以及客户系统中从原型走向生产，横跨编码、财务、支持、法务以及其他十几个领域。这让我们清晰地看到，是什么把演示与生产就绪的智能体区分开来，以及团队常常卡在哪里。

下面，我们分享在 Claude Managed Agents 这类托管服务上构建的最常见理由：

**1. 凭据被隔离在沙箱之外。** 当一切都在一个容器中运行时，Claude 生成的代码就紧挨着你的凭据，因此提示词注入可能诱使模型读取自身环境，从而泄露 token。我们可以通过在同一容器内设置强健的护栏来防范这一点，但解耦架构提供了一种安全得多的方式：将凭据完全隔离在沙箱之外。用于 MCP、CLI 和 GitHub 仓库等工具的 token 存放在独立的保险库中，由代理按需获取并解密。Managed Agents 提供开箱即用的 [Vaults](https://platform.claude.com/docs/en/managed-agents/vaults) 来处理凭据，因此你无需运行自己的密钥存储、无需在每次调用时传输 token，也不会搞不清智能体是代表哪个最终用户行事。Vault 凭据在存储前通过信封加密保护，检索时需要签名请求 token 进行验证。

**2. 消除沙箱开销带来更低延迟。** 延迟是许多企业团队最关心的指标，因为用户能敏锐感受到等待 Claude 响应的时刻。没有 Managed Agents 架构时，每个会话都必须启动容器，即便是智能体只需思考、从不运行工具的会话。这段启动时间被浪费了，用户会感受到首次响应前的延迟。借助 Managed Agents，Claude 立即开始推理，同时环境并行启动，从不运行工具的会话完全跳过容器。这意味着用户无需等待容器启动就能看到第一个 token，而环境在智能体需要运行东西时已经就绪。在我们的测试中，这将首 token 时间在中位情况（p50）下缩短了约 60%，在最慢情况（p95）下缩短了 90% 以上。

**3. 可靠、持久的会话，支撑会话管理、可观测性与记忆。** Managed Agents 不以请求/响应方式思考，而是以_事件_为单位。会话是一条持续的事件流：每次模型调用、工具调用和结果都被追加到一份位于运行智能体的进程之外的日志中。借助这种架构，智能体工作时事件实时流入，你能获得实时更新；你可以在之后恢复任何会话，而无需管理数据库或保存点。除非你删除会话，否则历史在交互之间得以保留；会话空闲时其容器会被检查点保存，以便你能从暂停处干净地继续。而且由于整个运行本身就是一份事件记录，可观测性和记忆随之而来：Claude Developer Console 提供智能体会话的原生可视化时间线视图，以及让你深入检查任何对话记录的调试体验。Managed Agents 还附带 Memory 和 Dreaming 等功能，同样利用这种会话持久性。[Dreaming](https://platform.claude.com/docs/en/managed-agents/dreams) 是一个定时流程，会审查你的智能体会话和记忆存储，提取模式并整理记忆，让你的智能体随时间改进。Dreaming 在会话之间精炼记忆，通过读取持久化的会话日志，从反复出现的错误和用户偏好中学习改进。

**4. 在 Anthropic 托管或自托管云容器上的灵活性。** 默认情况下，使用 Managed Agents，你可以将编排和工具执行都委托给 Anthropic 托管的云容器。这让托管和扩展变得简单轻松，提供更快的生产路径。由于 Managed Agents 中大脑与双手解耦，双手可以位于任何地方，包括你的虚拟私有云（VPC）内部。因此，我们也为希望控制工具执行的团队提供[自托管沙箱](https://platform.claude.com/docs/en/managed-agents/self-hosted-sandboxes)，让智能体的代码、文件系统和网络出口永不离开其环境。我们还提供 [MCP 隧道](https://platform.claude.com/docs/en/agents-and-tools/mcp-tunnels/overview)，让你将 Claude 连接到运行在你私有网络内的 Model Context Protocol（MCP）服务器。因此，自托管沙箱控制_智能体代码在哪里执行_，MCP 隧道控制_Anthropic 如何到达你网络中的 MCP 服务器_，让你能够精确控制哪些内容留在你的边界之内。

Claude Managed Agents 内置的可观测性控制台记录每一个事件，因此你可以拖动时间线、打开任意步骤并阅读其原始载荷。

除这些功能外，其他能力还包括让智能体依据评分标准给自己的工作进行评分的 outcomes、多智能体编排、权限策略和 webhook。在[此处](https://platform.claude.com/docs/en/managed-agents/overview)了解更多。

### **客户如今如何在 Managed Agents 上构建**

在各行各业，客户已经用 Claude Managed Agents 在生产中交付智能体。以下是几个例子：

-   [Notion](https://claude.com/customers/notion) 在 Managed Agents 上运行其 Custom Agents：团队直接从任务板把工作分配给 Claude，Claude 收集每项任务相关的文档、会议记录和关联数据，完成的代码、演示文稿和站点回到工作区供审阅。数十项任务并行运行，其团队称一个早期原型把大约十二小时的工作变成了二十分钟。
-   [Rakuten](https://claude.com/customers/rakuten) 使用 Managed Agents 在产品、销售、市场和财务领域交付专家智能体，每个都在约一周内上线。
-   [Sentry](https://claude.com/customers/sentry) 将其 Seer 调试智能体与一个负责编写补丁并开启 PR 的 Claude 智能体配对，由一名工程师在数周而非数月内构建完成。
-   [Asana](https://claude.com/resources/articles/claude-managed-agents) 构建了能在项目内领取任务的 AI Teammates，[Atlassian](https://claude.com/resources/articles/claude-managed-agents) 则将开发者智能体放入 Jira 工作流。

## **开始使用 Claude Managed Agents**

我们构建 Managed Agents，是为了让通过 Claude Code 和 [platform.claude.com](http://platform.claude.com/) 上的 Claude Developer Console 启动智能体尽可能简单。例如，Console 的快速入门让你可以从智能体模板开始，或用自然语言描述一个智能体，然后在几分钟内把它变成一个可以保护和部署的生产就绪智能体。

platform.claude.com 上的智能体快速入门：从模板开始，或描述你想构建的内容。

几步之后：智能体已创建，环境已配置，会话已上线。控制台实时流式展示运行过程。

在 Claude Code 中，[/claude-api skill](https://platform.claude.com/docs/en/agents-and-tools/agent-skills/claude-api-skill) 默认提供，为 Claude 提供在 Claude Managed Agents 上构建应用的详细、最新的参考资料。我们强烈建议你利用它来获取设置 Managed Agents 应用的最佳实践。运行 /claude-api managed-agents-onboard 开始，通过访谈式引导从零搭建一个新的 Managed Agent。

## **构建托管智能体的未来**

随着团队分享他们在 Managed Agents 上构建的东西，我们看到他们过去花在生产基础设施上的时间，如今转向了让智能体差异化的地方：管理上下文，并为用户量身定制体验。现在，当新模型发布时，你更新智能体以使用它，重跑你的评估（eval），然后交付改进，而无需触碰底层的架构。

我们很期待看到你构建的东西。

**_[开始使用](https://platform.claude.com/docs/en/managed-agents/overview) Claude Managed Agents。_**

_本文由 Anthropic 应用 AI 团队的技术人员 Gagan Bhat 和 Isabella He 撰写。他们感谢 Hema Thanki、Jess Yan 和 Molly Vorwerck 的贡献。_
