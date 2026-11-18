---
title: "Claude 值班：Claude Tag 如何成为 Anthropic 应对 CI/CD 故障的第一响应者"
source_url: "https://claude.com/resources/articles/ai-ci-cd-on-call"
publisher: "claude.com"
type: "blogPost"
date: "2026-08-18"
products: ["Claude Tag"]
read_time: 13
excerpt: "我们持续集成团队的一位工程师详细介绍了他在 Anthropic 构建的、用于支撑 CI 事件响应的智能体。"
fetched_at: "2026-11-18"
---

# Claude 值班：Claude Tag 如何成为 Anthropic 应对 CI/CD 故障的第一响应者
_[用我们的搭建套件配置你自己的 Claude 值班](https://github.com/anthropics/oncall-kit)。_

## 面向 CI/CD 的 AI 事件响应：Claude 在 Anthropic 值班

几周前，我正在值班，我的同事晚上 10 点在 Slack 上给我发消息：一个新服务上大约 44 个测试没有触发。

过去，我会停下手里的事，坐到笔记本电脑前，疲惫地叹口气，然后开始长达一小时的排查与修复流程。但现在，我的工作流完全不同了：我拉入 @Claude，问它看到了什么。

在这个案例中，Claude 发现这些测试是在当天早上某个功能开关被打开后消失的，并且还发现回滚是安全的。我请同事回滚了该开关。3 分钟后，Claude 在 Slack 上通知我，确认跳过规则确实已被移除，错误率也回到了基线。

为清晰起见，基于真实对话重新绘制。

过去几个月里，Claude Tag 一直是 Anthropic 应对 CI/CD 故障的值班第一响应者。这不仅改善了我们的社交生活，还让每一起 CI 事件都有了即时第一响应者：在最近每一起有情况报告的事件中，Claude 都撰写了第一份情况报告，**通常会在 15 分钟内发布首份分析。**

在本文中，我们将介绍我们构建了什么以及它如何运作，这样你也可以自己搭建，不再害怕轮到自己值班。

## **我们的 Claude 值班配置**

在深入事件响应流程的每个阶段之前，我先在这里给出配置的整体概览，以便你在我们补充细节时能把握全局。

值班智能体需要**记忆**，这样它才能记住已经做过什么；需要**连接与访问权限**，这样它才能调查、理解并采取行动；需要**日程**，这样它才知道何时重新开始工作；还需要**指令**，这样它才知道该做什么。

[Claude Tag](https://claude.com/product/tag) 是我们值班智能体的骨干。Claude Tag 在我们的值班 Slack 频道中保存记忆，并提供在事件期间逐轮下发指令的界面。Claude 还会实时响应值班频道及其他频道中的事件。例程的调度，也就是 Claude 定期执行的操作，也在这个频道上通过自然语言提示词完成，例如“每周一美国东部时间上午 9:00 运行 CI 交接”。

[Claude Tag 拥有自己的服务账号](https://claude.com/resources/articles/agent-identity-access-model)，并可访问 Anthropic CI 工程师所需的工具，例如 Datadog 或 Grafana。这由管理员为该频道一次性配置完成（[方法见此](https://claude.com/docs/claude-tag/admins/setup-overview#choose-which-tools-to-connect)）。

除了值班频道，我们还让 Claude 监视其他相关频道，这些频道同样将 Claude Tag 设为成员，这样它就能获取额外上下文，例如服务告警、配置变更或 PR 更新。

常驻指令以 Markdown 文件形式作为 Skills（技能）存放在一个 GitHub 仓库中。这样多位队友可以共同迭代，我们也能像管理代码一样管理变更。其中还包含路由指令、策略以及作为自我改进循环一部分的经验教训日志等关键信息。

这套配置我们花了几小时，而不是几天。我们在 GitHub 上创建了一个通用的[值班搭建套件](https://github.com/anthropics/oncall-kit)，可以帮助你上手搭建类似的智能体。它会把你自己团队的事件历史转化为分诊实战手册（playbook），并在你的事件频道中留下一个只读的 Claude，由它来诊断、升级并学习。[你可以观看它基于一个虚构团队的历史运行](https://github.com/anthropics/oncall-kit/blob/main/test-fixtures/RUNBOOK.md)，大约十分钟。

用 TL;DR 的方式总结步骤：

-   你需要 [Claude Team 或 Claude Enterprise](https://support.claude.com/en/collections/9387370-team-and-enterprise-plans) 套餐
-   组织所有者需要通过 Claude Tag 将 Claude 添加到值班 Slack 频道
-   组织所有者还需要帮助将值班 Slack 频道中的 Claude 连接到合适的 Connectors、GitHub 仓库，并配置 [Claude Code Remote](https://code.claude.com/docs/en/remote-control)。
-   将 Claude 添加到你的事件频道，并指示它监视事件并立即分诊

现在，让我们深入了解在事件的每个阶段，这种转变具体是什么样子。

## **检测**

Claude 不仅改变了你响应事件的方式，也改变了你最初检测事件的方式。过去，检测事件主要有两种失败模式。

人类很难始终具备前瞻性，去设置阈值完美的规则。当你没有足够的数据来分析流量模式时，这尤其困难。

为了解决这个问题，我们让 Claude 在新服务上线的最初几天分析数据和传入告警，以建议补充规则，并微调那些过于宽泛或过于狭窄的规则。

检测事件的第二种主要失败模式是告警疲劳：检查和甄别每一条触发的告警很繁琐。然而，Claude 不会像人类那样疲劳。

Claude 会监视每个告警频道中的每一条相关告警，并按照[根目录 oncall.md 文件](https://github.com/anthropics/oncall-kit/blob/main/templates/ONCALL.md)中的标准判断是可以等到早上，还是需要呼叫值班人员。例如，在根据数据分析调优之后，文件中的一条规则可以是：“如果错误率超过 2% 且持续超过 5 分钟，并且不在已知部署窗口内，则呼叫值班人员，否则写入 lessons.md。”

Claude 值班告警流程还有另外两种触发方式：

-   CI 团队成员可以在值班频道中报告问题，正如开头 44 个测试缺失的例子；或者
-   公司任何人都可以通过内部页面开启事件。如果该事件被标记为 CI 基础设施事件，就会为该事件创建一个 Slack 频道，我们的值班 Claude 会接手处理。



这里的关键要点是：告警流程是确定性的，而值班升级则同时包含确定性路径和智能体式路径。

## **分诊**

让 Claude 过滤告警噪音是一回事，但真正节省时间的是调查。Claude 会在事件开启后中位 14 分钟内发布首份有证据支撑的分析，在最快的情况下，它会在首份报告中于 4 分钟内指出根本原因。

当告警升级为事件后，Claude 通常已经在我们 Slack 频道中准备好了一个有证据支撑的假设供我们审阅。Claude Tag 会启动一个[动态工作流](https://claude.com/blog/a-harness-for-every-task-dynamic-workflows-in-claude-code)，其中编排器智能体会启动执行器子智能体，去调查每个依赖项和事实来源。

对我们来说，这些是 Grafana、我们的日志存储、PagerDuty、GitHub、Kubernetes 和 Slack 事件频道，全部通过 [MCP Connectors](https://code.claude.com/docs/en/mcp) 连接。Claude 可以并行追踪多条线索，帮助降低 MTTR（平均解决时间）。

执行器将发现结果报告回编排器智能体，后者综合信息并以连贯的情况报告（SITREP）呈现出来。



编排器和执行器智能体并非盲目搜索。它们由一个调查 Skill 引导，其中包含[针对每类 bug 的更详细参考 Markdown 文件](https://github.com/anthropics/oncall-kit/tree/main/skills/triage)。

例如，一个针对影子分歧 bug 的 617 行调查 Skill 编码了我在典型调查中采取的每一步。我是在其中一次事件中与 Claude 逐轮排查问题，然后让它根据那段经历创建了这个文件。

Lessons.md 也会引导 Claude 的排查。这个 Markdown 文件是我们解决过的每一起事件的持续日志：发生了什么、根本原因、修复方法，以及值得记住的坑。Claude 会自动向其中追加内容。每次新的调查都从阅读它开始，因此 Claude 的第一个假设会从最近发生过的事情出发。

如果同一种模式出现足够多次，我们就会把它提升到调查 Skill 本身中。我最喜欢的一条是 Claude 写关于我的。我在查看指标之前就先从配置文件做出了假设，现在 lessons.md 文件中写道：“先查询数据，再提出理论。配置告诉你可能出什么问题；指标告诉你实际出了什么问题。”

即使有这些工具和上下文，Claude 也不总是第一次就做对。人类的直觉和经验很重要。Claude Tag 允许团队以多人协作模式排查事件。我们中任何一方都可以实时引导调查或补充假设，共同进行。



为清晰起见，基于真实对话重新绘制。

## **解决**

如果 Claude 能升级和排查告警，它也能修复它们吗？这个问题的答案因团队而异，但以下是我们做法。

我们团队内的大多数部署都在功能开关之后进行。我在 Claude Code 中创建了一个单独的智能体，拥有我的权限，能够在每个功能开关之后进行渐进式部署。

我们发布（rollout）流程的第一阶段通常涉及 Claude 管理金丝雀流量、监视问题，并自动调高或调低某个功能开关的流量。这完全可以单独写一篇文章，所以我不在这里展开。

Claude Tag 帮助我团队的其他解决路径包括：

-   告知我们是否需要排空或隔离 Kubernetes 集群的某些部分；
-   指导我们如何扩容部分基础设施以应对需求激增（这种情况很少见，但当 Claude 给出确切的缓解措施时非常有帮助）；以及最常见的，
-   以 PR 形式提供修复，值班人员可以审查、合并，然后部署，从而快速解决。

## **验证、沟通与交接**

Claude 使用与调查时相同的许多 MCP Connectors 和工具来验证修复是否按预期生效。作为 oncall.md 中常驻指令的一部分，它会向 lessons.md 写入事后复盘，并用于交接情况报告。

为了在多个事件之间传达完整图景，我们创建了一个名为 ci-weather 的智能体。它汇总每个事件 Slack 频道的信息、构建指标、合并队列统计和部署延迟。然后它会向一个公司任何人都能阅读的公开频道发布新闻编辑室风格的报告。现在，我们的工程师在判断是否应该暂缓合并，或试图回答“CI 出了什么问题？”时，可以查阅那个频道，而不是来 ping 我们。

一句实话：我们需要多次迭代报告格式。Claude 可以一次性生成一个产出状态报告的 Skill，但让它可读的是团队特有的品味。这是人类沟通，不是管道工程。



最后，虽然 Claude 在 lessons.md 中为自己保留日志，我们也希望每周一为人类生成交接报告。Claude 会生成每日和每周摘要，这样团队中一位成员可以接续另一位成员的工作。

## **从监视事件到监视事件响应系统**

我们的软件工程师平均[每季度交付的代码量是 2021 到 2025 年期间的 8 倍](https://www.anthropic.com/institute/recursive-self-improvement)。虽然我们保持了高质量标准（每个 PR 都有具名的人类负责人，每次变更都需要批准才能合并，每次变更都经过同一套 CI 关卡），但跟上智能体式编码的唯一方式就是智能体式 CI。

Claude 承担了我工作中繁琐的部分，即非工作时间的打扰和事件沟通，同时让我能专注于真正推动系统可靠性提升的中长期架构变更。

我们构建的东西最棒的一点是它并不零散。我们的值班流程就在 Slack 中，而现在 Claude 也加入了这个频道。

如何开始：

-   你需要 [Claude Team 或 Claude Enterprise](https://support.claude.com/en/collections/9387370-team-and-enterprise-plans) 套餐
-   组织所有者需要通过 Claude Tag 将 Claude 添加到值班 Slack 频道
-   组织所有者还需要帮助将值班 Slack 频道中的 Claude 连接到合适的 Connectors、GitHub 仓库，并配置 [Claude Code Remote](https://code.claude.com/docs/en/remote-control)。
-   将 Claude 添加到你的事件频道，并指示它监视事件并立即分诊

_[用我们的搭建套件配置你自己的 Claude 值班](https://github.com/anthropics/oncall-kit)。_

_本文由 Anthropic 技术人员 Sachin Malhotra 撰写，Anthropic 员工 Michael Segner 亦有贡献。_
