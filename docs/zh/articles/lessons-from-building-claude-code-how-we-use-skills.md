---
title: "构建 Claude Code 的经验：我们如何使用 Skills"
source_url: "https://claude.dev/blog/lessons-from-building-claude-code-how-we-use-skills/"
publisher: "claude.dev"
type: "blogPost"
date: "2026-06-03"
products: ["Claude Code"]
read_time: 2
excerpt: "我们在 Anthropic 内部构建并扩展数百个 Skills 的过程中学到了什么。"
fetched_at: "2026-11-18"
---

# 构建 Claude Code 的经验：我们如何使用 Skills

Skills 已成为 [Claude Code](https://claude.com/product/claude-code) 中使用最广泛的扩展点之一。它们灵活、易于创建，也易于分发。

但这种灵活性也让人难以判断什么做法最有效。哪些类型的 Skills 值得制作？如何组织一个 Skill 的结构？什么时候该与他人分享？

我们在 Anthropic 内部广泛使用 Claude Code 中的 Skills，目前有数百个在活跃使用中。以下是我们关于如何用 Skills 加速开发的经验总结。

## 什么是 SKILLS？

Skills 是包含指令、脚本和资源的文件夹，智能体可以发现并使用它们，从而更准确、更高效地完成任务。本文假设你已了解 Skills 的基础知识；如果你是新手，请先从我们的 [Skilljar 上的智能体 Skills 入门课程](https://anthropic.skilljar.com/introduction-to-agent-skills)开始。

我们常听到的一个误解是，Skills 只是「Markdown 文件」。实际上它们是文件夹，可以包含脚本、资源、数据等，智能体可以发现、探索和操作这些内容。

在 Claude Code 中，Skills 还拥有[多种配置选项](https://code.claude.com/docs/en/skills#frontmatter-reference)，包括注册动态钩子（hooks）。

我们发现，Claude Code 中一些最有效的 Skills 都充分利用了这些配置选项和文件夹结构。

## SKILLS 的类型

在梳理了 Anthropic 内部所有 Skills 之后，我们注意到它们可以归为九类。最好的 Skills 能清晰地归入其中一类；而那些试图做太多事情的 Skills 往往横跨多类，反而让智能体感到困惑。这不是一份权威清单，但它是一个有用的框架，可以帮助你发现自己的 Skills 库中的空白。

![一个三乘三的 Skills 类别网格，附有示例 Skill 名称：库与 API 参考、产品验证、数据与分析、业务自动化、脚手架与模板、代码质量与审查、CI/CD 与部署、事故运行手册、基础设施运维。](https://claude.dev/media/8c0b43b7a1f0aefab9af8990f3d69eb961d4c5eef12c1e72584828787e57cb5f.png)

**图 A** Claude Code 团队对内部 Skills 进行了分类，发现它们可以归入九个不同的类别。

### 1\. 库与 API 参考

这类 Skills 说明如何正确使用某个库、CLI 或 SDK。它们既可以是针对内部库的，也可以是针对 Claude Code 有时难以处理的常见库的。这类 Skills 通常包含一个参考代码片段文件夹，以及一份 Claude 在编写脚本时应避免的常见陷阱清单。

示例包括：

-   `billing-lib` — 你的内部计费库：边界情况、易错点等。
-   `internal-platform-cli` — 你的内部 CLI 封装器的每个子命令，并附有何时使用它们的示例。
-   `sandbox-proxy` — 为开发工作配置你所在组织的出口网关：哪些主机可达、如何调试「连接被拒绝」错误、如何添加允许列表条目。

### 2\. 产品验证

这类 Skills 描述如何测试或验证你的代码是否正常工作。它们通常与 playwright、tmux 或其他外部工具配合使用以进行验证。

[验证类 Skills](https://claude.com/resources/articles/building-verification-loops-in-claude-code-with-skills) 对 Claude 在内部的输出质量产生了最显著可衡量的影响。值得让一名工程师花一周时间专门把你的验证类 Skills 打磨到极致。

可以考虑一些技巧，比如让 Claude 录制其输出的视频，这样你就能确切看到它测试了什么；或者对每一步的状态强制执行程序化断言。这些通常通过在 Skill 中包含各种脚本来实现。

示例包括：

-   `signup-flow-driver` — 在无头浏览器中跑完注册 → 邮箱验证 → 上手（onboarding）流程，并在每一步设置钩子来断言状态
-   `checkout-verifier` — 用 Stripe 测试卡驱动结账 UI，验证发票确实落到了正确的状态
-   `tmux-cli-driver` — 用于交互式 CLI 测试，即你要验证的东西需要 TTY 的场景

### 3. 数据获取与分析

这类 Skills 连接你的数据和监控栈。它们可能包含用凭据获取数据的库、特定的仪表盘 ID 等，以及关于常见工作流或获取数据方式的说明。

示例包括：

-   `funnel-query` — 「我要 join 哪些事件才能看到注册 → 激活 → 付费」以及真正含有规范 user\_id 的那张表
-   `cohort-compare` — 比较两个群组的留存率或转化率，标记统计上显著的差异，并链接到分群定义
-   `grafana` — 数据源 UID、集群名称、问题 → 仪表盘查找表
-   `datadog` — 字段参考（@request\_id 与 trace\_id）、服务列表、指标前缀约定

### 4\. 业务流程与团队自动化

这类 Skills 把重复性工作流自动化成一条命令。它们通常是相当简单的指令，但可能对其他 Skills 或 MCP 有较复杂的依赖。对于这类 Skills，把之前的结果保存到日志文件中，有助于模型保持一致，并对工作流此前的执行情况进行反思。

示例包括：

-   `standup-post` — 汇总你的工单跟踪系统、GitHub 活动和此前的 Slack 消息 → 格式化的站会内容，仅包含增量
-   `create-<ticket-system>-ticket` — 强制校验 schema（有效的枚举值、必填字段）以及创建后的工作流（通知审查者、在 Slack 中链接）
-   `weekly-recap` — 已合并的 PR + 已关闭的工单 + 部署 → 格式化的回顾帖

### 5\. 代码脚手架与模板

这类 Skills 为代码库中某个特定功能生成框架样板。你可以把这些 Skills 与可组合的脚本结合使用。当你的脚手架包含无法完全由代码覆盖的自然语言要求时，它们尤其有用。

示例包括：

-   `new-<framework>-workflow` — 用你的注解脚手架出一个新的服务/工作流/处理器
-   `new-migration` — 你的迁移文件模板加上常见陷阱
-   `create-app` — 新的内部应用，预先接好你的认证、日志和部署配置

### 6\. 代码质量与审查

这类 Skills 在你所在组织内强制执行代码质量，并帮助审查代码。它们可以包含确定性的脚本或工具，以获得最大的稳健性。你可能希望将这些 Skills 作为钩子的一部分或在 GitHub Action 中自动运行。

-   `adversarial-review` — 启动一个全新视角的子智能体进行批判，实施修复，反复迭代，直到发现的问题降级为吹毛求疵
-   `code-style` — 强制执行代码风格，尤其是 Claude 默认做得不好的那些风格。
-   `testing-practices` — 关于如何编写测试以及测试什么的说明。

### 7\. CI/CD 与部署

这类 Skills 帮助你在代码库中获取、推送和部署代码。它们可能会引用其他 Skills 来收集数据。

示例包括：

-   `babysit-pr` — 监控一个 PR → 重试不稳定的 CI → 解决合并冲突 → 启用自动合并
-   `deploy-<service>` — 构建 → 冒烟测试 → 带错误率比较的渐进式流量推广（rollout）→ 出现回归时自动回滚
-   `cherry-pick-prod` — 隔离的 worktree → cherry-pick → 冲突解决 → 带模板的 PR

### 8\. 运行手册

这类 Skills 接收一个症状（例如 Slack 讨论串、告警或错误签名），走完一个多工具的调查过程，并生成一份结构化报告。

示例包括：

-   `<service>-debugging` — 为你的高流量服务映射症状 → 工具 → 查询模式
-   `oncall-runner` — 获取告警 → 检查常见的可疑点 → 格式化发现
-   `log-correlator` — 给定一个请求 ID，从所有可能接触过它的系统中拉取匹配的日志

### 9\. 基础设施运维

这类 Skills 执行日常维护和运维流程，其中一些涉及破坏性操作，需要护栏（guardrail）来保护。这些护栏让工程师在关键操作中更容易遵循最佳实践。

示例包括：

-   `<resource>-orphans` — 查找孤立的 pod/卷 → 发布到 Slack → 观察期 → 用户确认 → 级联清理
-   `dependency-management` — 你所在组织的依赖审批工作流
-   `cost-investigation` — 「为什么我们的存储/出口账单激增」，附上具体的存储桶和查询模式

## 制作 SKILLS 的技巧

一旦你决定了要制作哪个 Skill，该如何编写它？以下是 Claude Code 团队关于制作 Skills 的一些最佳实践、技巧和诀窍。

### 不要陈述显而易见的内容

Claude 已经会写代码，也能读懂你的代码库。一个只是重复 Claude 默认做法的 Skill，只会增加上下文却不带来价值。如果你要发布一个主要关于知识的 Skill，请聚焦于那些能把 Claude 推出其常规思维模式的信息。

[前端设计 Skill](https://github.com/anthropics/skills/blob/main/skills/frontend-design/SKILL.md) 就是一个很好的例子；它由 Anthropic 的一位工程师通过与客户反复迭代、改进 Claude 的设计品味而构建，避免了 Inter 字体和紫色渐变之类的经典套路。

### 建立一个陷阱（Gotchas）章节

![同一个 Billing Lib Skill 文件在第 1 天、第 2 周和第 3 个月的样子。一个 Gotchas 章节出现，并从一行（按比例分配向下取整）增长到四行。](https://claude.dev/media/16acf64a5f80810ad01275e7a7de64b689ff947b145ee1b188f328e614cdfe98.png)

任何 Skill 中信号最强的内容就是 Gotchas 章节。这些章节应当从 Claude 在使用你的 Skill 时遇到的常见失败点中积累而来。理想情况下，你会随着时间推移更新你的 Skill 来记录这些陷阱。

例如：

-   「`subscriptions` 表是只追加的。你要的那一行是版本号最高的那一行，而不是 `created_at` 最新的那一行。」
-   「这个字段在 API 网关里叫 `@request_id`，在计费服务里叫 `trace_id`。它们是同一个值。」
-   「即使 Stripe webhook 实际上没有处理，staging 也会返回 200。请检查 `payment_events` 获取真实状态。」

### 利用文件系统和渐进式披露

![一个队列调试 Skill 文件夹，其中 SKILL.md 是中心，stuck-jobs.md、dead-letters.md、retry-storms.md 和 consumer-lag.md 是分支。SKILL.md 持有一张症状到文件的映射表，告诉 Claude 该读哪个文件。](https://claude.dev/media/d70d147c4c600c297d350ebd7a76f110c879ca670f9e40adb83b05882f71dd8c.png)

**图 B** SKILL.md 文件指向若干其他文件，Claude 可以针对特定情况参考它们。例如，如果某个任务处于 pending 状态，它应当参考 stuck-jobs.md。

正如我们之前所说，Skill 是一个文件夹，而不仅仅是一个 Markdown 文件。你应当把整个文件系统视为一种[上下文工程和渐进式披露](https://claude.dev/blog/the-new-rules-of-context-engineering-for-claude-5-generation-models/)的形式。告诉 Claude 你的 Skill 里有哪些文件，它就会在适当的时机读取它们。

渐进式披露最简单的形式是指向其他供 Claude 使用的 Markdown 文件。例如，你可以把详细的函数签名和用法示例拆分到 `references/api.md` 中。

另一个例子：如果你的最终输出是一个 Markdown 文件，你可以在 `assets/` 中包含一个模板文件供复制和使用。

你可以拥有参考、脚本、示例等文件夹，帮助 Claude 更有效地工作。

### 避免过度束缚 Claude

Claude 通常会尽量遵循你的指令，而由于 Skills 高度可复用，你需要小心不要在指令中过于具体。给 Claude 它需要的信息，但要给它适应具体情况的灵活性。

例如：

![cherry-pick 指令的两个版本。过于规定性：六个编号步骤，逐一写出每条 git 命令。更好：『将提交 cherry-pick 到一个干净的分支上。解决冲突时保留原意。如果无法干净地落地，说明原因。』](https://claude.dev/media/f634d39724ba5a2785fa6a8aa5614a1e4654c1d278a2d73b0e3b7ce0a74d84c4.png)

**图 C** 说明目标和约束，而不是每一个步骤。

### 想清楚设置流程

![一个 standup-post 的 SKILL.md，其『Your config』章节运行一条 shell 命令读取 config.json，如果缺失则回显 NOT\_CONFIGURED；指令告诉 Claude 在未配置时询问 Slack 频道和一份示例站会内容，然后保存答案。](https://claude.dev/media/c24d1f6d68756396e649a2a1ee89dcde197dad5675e9b75cf17099064345486e.png)

**图 D** 上面的 Skill 被编写为：如果配置中没有包含 Slack 频道，就提示用户。

有些 Skills 可能需要用来自用户的上下文进行设置。例如，如果你要制作一个把站会内容发布到 Slack 的 Skill，你可能希望 Claude 询问发布到哪个 Slack 频道。

一个很好的做法是把这些设置信息存储到 Skill 目录下的 config.json 文件中，如上例所示。如果配置尚未设置，智能体就可以向用户询问信息。

如果你希望智能体呈现结构化的多选题，可以指示 Claude 使用 AskUserQuestion 工具。

### 为模型写描述，而不是为人写

当 Claude Code 启动一个会话时，它会构建一份包含所有可用 Skill 及其描述的列表。Claude 扫描这份列表来决定「这个请求有没有对应的 Skill？」这意味着 description 字段不是摘要，而是[对何时触发此 Skill 的描述](https://claude.com/resources/articles/improving-skill-creator-test-measure-and-refine-agent-skills)。

![babysit-pr 的两个 SKILL.md 描述。左侧：『一个用于在开发生命周期中监控拉取请求状态的综合工具。』右侧：『监控一个 PR 直到它合并。在「babysit」、「watch CI」、「make sure this lands」时触发。』](https://claude.dev/media/1debbf1fd04f39bcfeb62bcb458574268414bd0f519c4390d708bbac8f1b724e.png)

**图 E** 在描述中包含 Skill 的触发词（如「babysit」）会很有帮助。

### 帮助 Claude 记忆

![一个 ~/.claude/standups.log 文件，包含连续三天的带日期条目；onboarding 重设计讨论串在所有这些条目中都被高亮显示。](https://claude.dev/media/829d6345a17c88a8eb51d616918194402492d1afaba783b00e8b5fdf06b89edf.png)

**图 F** 这个文本日志文件帮助 Claude 记住过去的事件，比如审查 Sarah 的认证 PR。

有些 Skills 可以通过在其中存储数据来包含某种形式的记忆。你可以把数据存储在简单如只追加的文本日志文件或 JSON 文件，或复杂如 SQLite 数据库中。

例如，一个 `standup-post` Skill 可能维护一个 standups.log，记录它写过的每一条内容，这意味着下次你运行它时，Claude 会读取自己的历史记录，并能说出自昨天以来发生了什么变化。

你可以使用环境变量 `${CLAUDE_PLUGIN_DATA}` 获得一个稳定的目录来存储数据，在此处了解更多关于在 Skills 中持久化数据的内容：[https://code.claude.com/docs/en/plugins-reference#persistent-data-directory](https://code.claude.com/docs/en/plugins-reference#persistent-data-directory)。

### 存储脚本并生成代码

你能给 Claude 的最强大的工具之一就是代码。给 Claude 脚本和库，可以让它把轮次花在组合上，决定下一步做什么，而不是重建样板代码。

例如，在你的 `data-science` Skill 中，你可能有一个从事件源获取数据的函数库。为了让 Claude 进行复杂分析，你可以给它一组这样的辅助函数：

![lib/signups.py 包含三个辅助函数 fetch、by\_referrer 和 by\_landing\_page，它们的 docstring 记录了数据陷阱，例如 user\_id 在注册完成前为 null。](https://claude.dev/media/9306b89148d50e676d639a58b675a7461b8df96079f41db272558651be023f5f.png)

**图 G** 给 Claude 一个小型辅助函数库，并把陷阱写进 docstring 中。

然后 Claude 可以即时生成脚本，组合这些功能，为「周二发生了什么？」之类的提示词做更高级的分析。

![investigate.py，由 Claude 生成，导入这些辅助函数，按来源和落地页比较周一和周二的注册量，并得出结论：周二首页出了问题。](https://claude.dev/media/58c7ef840b2a94594f712995ad204a05360a28f0a02c74931a5c238c11426fa5.png)

**图 H** Claude 把这些辅助函数组合成一个针对当前问题的一次性脚本。

### 使用按需钩子

Skills 可以包含仅在 Skill 被调用时才激活、且仅在会话期间持续的钩子。对于你不想一直运行、但有时又极其有用的、更具倾向性的钩子，可以使用这种方式。

例如：

-   **`/careful`** — 通过 Bash 上的 PreToolUse 匹配器阻止 rm -rf、DROP TABLE、force-push、kubectl delete。你只希望在确定要接触生产环境时才启用它——一直开着会把你逼疯。
-   **`/freeze`** — 阻止任何不在特定目录中的 Edit/Write。在调试时很有用：「我想加日志，但我总是误『修』了不相关的代码。」

## 分发 SKILLS

Skills 最大的好处之一就是你可以与团队其他成员分享。

你可能想通过两种方式与他人分享 Skills：

-   把 Skills 检入你的仓库（位于 `./.claude/skills` 下）
-   制作一个**插件**，并拥有一个 Claude Code 插件市场，用户可以在其中上传和安装插件（在[文档](https://code.claude.com/docs/en/plugin-marketplaces)中了解更多）

对于跨相对较少仓库工作的小型团队，把 Skills 检入仓库效果很好。但每一个检入的 Skill 也会给模型的上下文增加一点负担。随着规模扩大，内部插件市场允许你分发 Skills，让你的团队决定安装哪些，并包含一个设置流程。

## 管理 SKILLS 市场

你如何决定哪些 Skills 进入市场？人们如何提交它们？

在 Anthropic，我们没有决定此事的集中团队；相反，我们试图有机地发现最有用的 Skills。如果有人有一个想让大家尝试的 Skill，他们可以把它上传到 GitHub 上的一个沙箱文件夹，并在 Slack 或其他论坛中指引人们去看。

一旦某个 Skill 获得了关注（这由 Skill 所有者决定），他们就可以提交一个 PR 把它移入市场。

## 组合 SKILLS

你可能想要有相互依赖的 Skills。例如，你可能有一个上传文件的文件上传 Skill，以及一个生成 CSV 并上传它的 CSV 生成 Skill。这种依赖管理目前尚未原生内置到市场或 Skills 中，但你只需按名称引用其他 Skills，模型就会在它们已安装时调用它们。

## 衡量 SKILLS

为了了解某个 Skill 的表现，我们使用一个 PreToolUse 钩子来记录公司内部的 Skill 使用情况（[示例代码在此](https://gist.github.com/ThariqS/24defad423d701746e23dc19aace4de5)）。这意味着我们可以找出那些受欢迎或触发不足（低于预期）的 Skills。

## 开始使用

Skills 的最佳实践仍在演进。我们大多数最好的 Skills 都始于几行内容和一条陷阱，然后因为人们在 Claude 遇到新的边界情况时不断补充而变得更好。

理解 Skills 的最佳方式就是开始动手、实验，看看什么对你有效。

-   查看[我们的 Skills 文档](https://code.claude.com/docs/en/skills)
-   [查找可自定义的示例 Skills](https://github.com/anthropics/skills)

_本文由 Thariq Shihipar 撰写，他是 Anthropic 的技术人员，从事 Claude Code 相关工作。_
