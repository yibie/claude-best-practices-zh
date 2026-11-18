---
title: "在 Google Cloud 上管理 Claude Code 的成本并展示投资回报"
source_url: "https://claude.com/resources/articles/how-to-manage-costs-and-demonstrate-roi-for-claude-code-on-google-cloud"
publisher: "claude.com"
type: "blogPost"
date: "2026-10-27"
products: ["Claude Code"]
read_time: 17
excerpt: "在 Google Cloud 上管理 Claude Code 成本并衡量投资回报的最佳实践。"
fetched_at: "2026-11-18"
---

# 在 Google Cloud 上管理 Claude Code 的成本并展示投资回报

随着组织将越来越多的工作交给 Claude Code，支出也随之增长，平台团队需要一种既能控制成本、又能了解影响的方式。受近期与 Google Cloud 联合举办的[一场网络研讨会（在新标签页中打开）](https://www.anthropic.com/webinars/how-to-control-costs-and-show-roi-for-claude-code-on-google-cloud)启发，我们分享使用 Claude Code 的组织如何在 Google Cloud 上更好地跟踪和优化这些考量，包括三个核心杠杆：控制（control）、跟踪（track）和证明（prove）。

## 管理 Claude Code 支出的控制手段

Google Cloud 上的 Claude 采用按用量计费，因此你的账单反映了开发者在 Google Cloud 环境中使用 Claude 的程度。采用率驱动用量；用量是你付费的对象，也是价值体现之处。

你的 Claude Code 账单由任务消耗的 token 数量和处理这些任务的模型共同决定。token 消耗随任务复杂度和对话长度而增长。聊天是一问一答的对话。像 Claude Code 这样的智能体式工具，相对于聊天而言每个任务消耗更多 token，因为它在做多步骤工作：读取文件、运行工具，并在整个任务范围内进行推理。同时，每个模型都有自己的每 token 价格，因此[将模型与任务匹配](https://claude.com/blog/claude-model-and-effort-level-in-claude-code)是另一项主要的成本控制手段。

通过 [Claude apps gateway](https://claude.com/blog/introducing-the-claude-apps-gateway) 和 Google Cloud 服务，可以了解影响组织每月账单的 token 和模型选择。你可以通过三个独立的杠杆来治理支出和管理成本：

-   **控制（Control）**。建立护栏，引导用量，同时不过度限制访问、意外地挡住用户。
-   **跟踪（Track）**。在账单到来之前，对支出发生的位置以及将继续流向的位置进行细粒度监督。
-   **证明（Prove）**。识别组织从这些 token 支出中获得的价值，并精确归因其来源。

以下是如何将这套 control -> track -> prove 框架应用到你自己在 Google Cloud 上的 Claude Code 部署中。

![展示 control - track - prove 类别及各自所用工具的图示](https://assets.claude.com/50faca60a22f422f7c0f5e9d2f4177a1ea483448.png)

### **治理工具箱**

Google Cloud 上的 Claude 自带用于控制、跟踪和证明支出价值的工具与能力。

![展示 Google Cloud 原生能力与 Claude Code + Claude apps gateway 附加能力的图示](https://assets.claude.com/b3266f5cebd6e2613593339d21200b3a7c034b9a.png)

Google Cloud 已经提供了许多原生能力，可用于跟踪和控制你的 Claude 支出：

-   **按项目计费**。允许你为 Claude Code 托管一个专用项目，作为跟踪成本的清晰方式。
-   **账单预算与提醒**。允许你设置预算提醒，并在实际支出超过你定义的阈值时收到通知。
-   **支出上限（预览版）**。允许你强制执行服务级别的 Google Cloud 支出预算，并能够手动解除上限。
-   **BigQuery 导出**。让你可以将 Claude 支出与其余云成本一起分析。
-   **配额**。Google Cloud 上的 Claude 模型对每个模型系列和端点位置都有每分钟的请求数、输入 token 和输出 token 限制。
-   **预置吞吐量**。为预留容量支付固定费用，而非按需付费。

Claude Code 和 Claude apps gateway 增加了各自的跟踪与控制能力。该网关是一个自托管服务，随开发者已经在使用的同一个 `claude` 二进制文件一同发布，运行在你的 Google Cloud 项目中，位于 Claude Code 与 Google Cloud 上的 Claude 之间。开发者通过你的身份提供商（例如 Google Workspace）登录，因此每个请求都携带经过验证的身份。这让你可以按 IdP 组设置模型允许列表，并按用户、IdP 组或组织设置按天、周或月的支出上限。

以下是如何选择并组合各项能力，以管理衡量组织在 Google Cloud 上使用 Claude 的 AI 投资成本与投资回报的三个杠杆：

#### 杠杆 1：控制

控制杠杆的核心是提供护栏，引导开发者使用 Claude Code，而不是用任意的上限来限制他们。

引导而非限制很重要，因为高成本的会话未必是坏事——事实上，它们往往价值很高，在 Claude Code 中尤其如此。这些会话通常来自你的高级用户，他们走在最前沿，使用新的工作流，从 Claude 获得大量价值，也完成了大量工作。

浪费往往出现在高支出用户中处于中间的那一大批人身上。例如，他们用 Fable 处理 Sonnet 就能轻松应对的日常事务。或者他们可能忘了某个已不再关心的定时任务，但它仍然在自动运行。

有四项功能为你提供护栏，用来引导用户而不是限制他们：

-   **[支出限制（在新标签页中打开）](https://code.claude.com/docs/en/claude-apps-gateway-spend-limits)。** Claude apps gateway 允许你按用户、按 IdP 组或组织范围设置按天、周或月的支出上限。组和组织上限是每位开发者的默认值，由每个成员继承，而不是共享池。
-   **阈值提醒。** 与 Claude apps gateway 配合使用时，Google Cloud 上的 Claude Code 会在开发者接近上限时发出警告，先是超过 75%，再是超过 95%。这些是面向开发者的 CLI 内警告，而 Google Cloud Billing 提醒则是面向管理员的。达到上限时，网关会返回 429，直到周期重置或管理员提高上限，你可以通过网关的管理 API 编写脚本提高上限。
-   **模型默认值与允许列表。** 通过 Claude apps gateway 按 IdP 组指定可用的模型，网关会在服务端对每个请求强制执行允许列表。我们发现设置模型默认值效果很好，因为大多数人会沿用模型默认值；如果他们想切换模型，通常是有原因的。你可以将模型默认值与模型允许列表搭配使用，或以其替代允许列表。
-   **网关管理 API。** 网关提供[用于支出限制的管理 API（在新标签页中打开）](https://code.claude.com/docs/en/claude-apps-gateway-spend-limits)，因此你可以通过编程方式设置和更改上限，例如使用工单工作流。

![展示支出上限生命周期的各阶段的图示](https://assets.claude.com/d1ded8cd5410c90e62905f650bf2a4e09df4cdce.png)

组合这些能力来控制你的整体账单，但请记住，控制只是第一个杠杆。每 token 价格并不能给你全貌。最重要的指标是单任务成本，可以通过跟踪用量来监控和分析。

#### 杠杆 2：跟踪

这个杠杆的核心是看清支出流向何处以及如何被使用。好消息是，你可以跨组织跟踪 Claude Code 的用量、成本和工具活动。主要的跟踪策略包括：

-   **用量与成本可观测性。** [Claude Code 的 OpenTelemetry 指标和事件（在新标签页中打开）](https://code.claude.com/docs/en/monitoring-usage)报告用量和估算成本，并按 Skill、插件、智能体和 MCP 服务器细分。通过 OpenTelemetry Protocol（OTLP）将它们发送到你已经在运行的工具，例如 Google Cloud Monitoring，可通过 OpenTelemetry 收集器或由 Claude apps gateway 转发（用于集中式 OpenTelemetry 配置）。
-   **最终用户用量视图。** 开发者可以在 Claude Code 中直接看到自己的支出，并在触及限制之前收到用量警告。
-   **数据导出到你现有的系统。** Google Cloud Billing 导出到 BigQuery，让你可以按模型和 token 类型筛选 Claude SKU，将 Claude 支出与其余云和 AI 支出放在一起。OTel 流向你的 O11y 技术栈，网关管理 API 可以将支出限制状态直接送入你的工单系统。

![展示 Google Cloud 上 Claude Code 遥测的图示](https://assets.claude.com/f2ab59204d683994ef32ddc5b4e6f1167389a800.png)

Claude Code 无论运行在开发者机器上还是云工作站上，只要启用即可导出 OpenTelemetry，包括会话、活跃时间、代码行数、提交、拉取请求（PR）、token 和成本，并按用户、团队和模型细分。最新版本的 Claude Code 还按技能、插件、智能体和 MCP 服务器细分用量，因此你不仅能看到 Claude Code 的整体用量，还能看到组织内部哪些技能和插件被采用。使用 Claude apps gateway，你无需配置每台机器。在网关上设置遥测目标，它就会为已登录的开发者开启遥测。它还会为每次导出打上开发者登录时验证过的邮箱和 IdP 组标签，而不是客户端配置的值。

要将用量归因到你自己的成本中心和部门，请设置 OTEL\_RESOURCE\_ATTRIBUTES 环境变量（例如 department=engineering,cost\_center=eng-123）。Claude Code 会将这些标签添加到每个指标和事件中，因此你可以按它们筛选和聚合。这些指标会带着这些自定义属性进入 Google Cloud Monitoring（或其他监控解决方案，如 Grafana 或 Splunk）。

![仪表盘的截图](https://assets.claude.com/201a89049ce753ac7e42f8518d1db7908b40a91a.png)

Cloud Monitoring 中的 Claude Code 用量仪表盘，基于 Claude Code 的 OpenTelemetry 指标构建。使用示例数据做的示意性复现。

典型的采用视图显示活跃开发者、过去 24 小时的会话数以及消耗的 token 总量。橙色框显示开发者触及网关强制执行的支出上限时被阻止的请求。该指标与你现有的工单系统配合良好，可形成允许开发者申请提高上限的工作流。

如需现成的 Cloud Monitoring 仪表盘，请参阅 [Claude Code 监控模板（在新标签页中打开）](https://github.com/GoogleCloudPlatform/monitoring-dashboard-samples/tree/master/dashboards/claude-code)，它将 Claude Code 的 OpenTelemetry 指标转化为采用情况、编码活动以及 token 用量和估算支出的单一视图，让你在 Google Cloud 上推广 Claude Code 时按用户和模型跟踪用量与成本。你可以直接在 Cloud Monitoring 控制台中复制此模板。

要在 Google Cloud 上设置自定义 Claude Code 遥测，请从 [Claude Code OTel 快速入门（在新标签页中打开）](https://github.com/Google-Cloud-AI/partner-ai-anthropic/tree/main/01-quickstart/otlp-to-telemetry-api)开始。用它配置 Claude Code 将 OpenTelemetry 直接导出到 Google Cloud Observability 套件，包括 Cloud Logging 和 Cloud Monitoring。该快速入门还会将日志路由到分区 BigQuery 表，每种事件类型一张表（API 请求、工具决策、工具结果、助手响应和已完成的钩子执行），并提供 SQL 查询，用于按开发者/模型统计支出、工具成功率和延迟、钩子等待时间、按轮次和按会话的分析。

#### 杠杆 3：证明

控制杠杆治理并分配用量与成本；跟踪杠杆让你可视化这些支出。证明杠杆则是你为 Google Cloud 上的 Claude Code 将用量映射到投资回报（ROI）的方式。

平台工程师最关心在 Claude Code 中衡量的指标包含在三个维度中：用量、开发者满意度和影响。

**采用与用量**指标衡量人们如何在组织中使用 Claude，包括你的激活用户及其每周和每日用量。这些指标揭示了使用深度、用户随时间的留存情况以及谁是 Claude Code 高级用户等信息。这些指标均源自 Claude Code OTel 数据。

**满意度**指标监控工程师的用户体验，包括他们对 Claude Code 的满意度、感知到的时间节省、对输出的信心以及他们可能遇到的任何摩擦。满意度指标来自推广前后进行的简短调查，随后是持续的用户回访。

**影响**指标评估 Claude 如何带来可衡量的工程成果，将吞吐量、周期时间和审查速度与基线进行比较，并对特定工作内容进行定性衡量。

### **一组起步的影响指标**

以下是一组起步的影响指标，分为三个领域：时间、投入和数量。

**时间**衡量工作交付的速度：PR 周期时间（从开启 -> 合并）以及代码审查周转时间。

**投入**衡量每项变更需要多少工作：每个 PR 的审查迭代次数、每个 PR 的审查评论和返工。

**数量**衡量释放出的产能带来了什么：每位工程师的 PR 数、部署频率，以及具名工作内容：你的团队用释放出的产能交付的具体待办事项。这些在计数之外增加了定性视角。

这些是方向性的参考点，而非规则，但它们是衡量 Claude Code 在组织中影响的一个良好起点。你需要的基线已经存在：源代码控制和工单中的交付历史。

### **定义你的工作单元**

这些指标大多统计 PR，但修复一个拼写错误和发布一个功能都算一个 PR。因此，应统计已定义类别的已合并 PR：Claude 开启 PR，由人决定是否发布。诸如 hotfix 或 feature release 之类的标签、工单 ID 以及 Claude 是否参与，使这些 PR 在你已经运行的系统里易于查找。并非每个工作单元都是 PR；服务切换或在根源上已解决的事件就是例子。同样的规则适用：统计一件完成的事，以及它落在哪里（即交付位置）。

## Claude Code 原生遥测

在建立成本治理和用量跟踪之后，下一步是将它们映射到投资回报。Claude Code 的原生遥测帮助你捕获贡献和生产力指标，记录组织正在获得的价值。

![展示 Claude Code 原生遥测的图示，分三列：用量、成本、贡献/生产力。](https://assets.claude.com/5d1a4e740237e04f4524c9ff169e0f70def7c5ab.png)

Claude Code 的 OTel 指标让你可以跟踪或推导代码建议接受率、修改的代码行数、创建的提交、创建的 PR、每单位输出的成本以及每位用户的 PR 数。

所有这些原生指标都提供有用且可操作的信息。当与通过 Google Cloud 上 Claude Code 遥测捕获的已记录事件（如用户提示词和工具决策）配合时，这些信息会变得更有价值。例如，记录用户提示词是了解用户群体试图构建什么的好方法，因为并非每个工作单元都必然是 PR。请注意，由于内容可能敏感，用户提示词不会自动记录；你必须明确选择启用。

一个例子是，如果你是 SRE，使用 Claude Code 排查事件；如果你是销售工程师，为现场演示生成示例数据。这些会话不会产生 PR，但它们确实加速了这些团队的工作流。请记住，Claude Code 的 PR 指标统计的是 Claude Code _创建_ 的 PR，而不是最终合并的 PR。你的源代码控制和工单系统仍然是已交付内容的记录，因此请将 Claude Code 遥测与 GitHub 或 GitLab 以及你的工单跟踪器关联起来，以获得全貌。

以下是部分 Google Cloud 上的 Claude 客户使用 Claude Code 所取得的可衡量影响。

-   [Delivery Hero（在新标签页中打开）](https://claude.com/customers/delivery-hero)的一个团队对 100 个 UI 组件的设计系统进行了全面改造。Claude Code 在几分钟内完成了通常需要一名工程师一周时间的工作。
-   [Shopify（在新标签页中打开）](https://claude.com/customers/shopify)的工程师使用 Claude Code 构建得更快，但非工程师也能在几分钟而非几天内构建内部工具。Claude Code 正在扩大 Shopify 中能够构建的人群，而不仅仅是加速已经在构建的人。
-   [Fifth Dimension（在新标签页中打开）](https://cloud.google.com/customers/fifth-dimension-anthropic)的工程师普遍在 Google Cloud 上使用 Claude Code。他们合计每月编写超过 300,000 行代码，接受率达 98%。

## 开始使用

本文的目标是帮助你熟悉现有的工具和能力，以管理 Google Cloud 上 Claude Code 的成本并展示投资回报。作为平台工程师，这套系统不仅用于注意和观察用户群体的行为。它还为你提供动态调整治理和设置所需的知识。

这是一个持续循环：从合理的默认值开始，例如组织范围的支出上限、默认模型和模型允许列表，然后随着用量数据的到来按角色和团队进行细化。通过跟踪实际使用并将指标与你从 Claude Code 获得的价值相关联，你可以将这些交付给需要分析使用 Claude Code 的投资回报和业务影响的利益相关方。

![展示 Control - Track - Prove 框架持续循环的图示](https://assets.claude.com/9a83ef407d2df018b107f8108d1955ad70702d7f.png)

随着我们委托给 Claude 的工作量和工作类型不断加深和多样化，组织如何使用 Google Cloud 上的 Claude Code 以及从该用量中获得的价值都将不断演变。这里概述的 **control → track → prove** 框架是衡量 Claude Code 部署各个方面和成果的稳定起点。

以下资源可帮助你入门：

-   [有效管理成本（在新标签页中打开）](https://code.claude.com/docs/en/costs)
-   [监控用量和成本（在新标签页中打开）](https://code.claude.com/docs/en/monitoring-usage)
-   [Claude apps gateway 支出限制（在新标签页中打开）](https://code.claude.com/docs/en/claude-apps-gateway-spend-limits)
-   [在 Google Cloud 上部署 Claude apps gateway（在新标签页中打开）](https://code.claude.com/docs/en/claude-apps-gateway-on-gcp)
-   [创建、编辑或删除预算和预算提醒（在新标签页中打开）](https://code.claude.com/docs/en/claude-apps-gateway-on-gcp)
-   [管理支出上限预算 | Cloud Billing（在新标签页中打开）](https://docs.cloud.google.com/billing/docs/how-to/budgets-spend-caps)
