---
title: "AI 原生 SDLC 实战手册"
source_url: "https://claude.com/resources/articles/the-ai-native-sdlc-playbook"
publisher: "claude.com"
type: "blogPost"
date: "2026-08-21"
products: ["Claude Enterprise","Claude Code","Claude Tag"]
read_time: 40
excerpt: "如何分阶段地用 AI 改造你的软件开发生命周期。\n\n‍"
fetched_at: "2026-11-18"
---

# AI 原生 SDLC 实战手册
更想要 PDF？

**本实战手册也提供下载** —— 同样的六个阶段、实战打法与完整示例，排版适合离线阅读或与团队分享。

[下载 PDF ↓](https://assets.claude.com/5f640b0ae71b855ddd9989d43952da707f62866f.pdf)

## 代码不再是瓶颈

各组织已经开始用 AI 以一年前难以想象的速度编写代码，但围绕代码的流程却没有以同样的速度改变。

许多工程团队仍然保留着同样的审批关卡、审查、交接和策略，这拖慢了使用 [Claude Code](https://claude.com/product/claude-code) 这类智能体式编码方案所带来的生产力提升。

软件开发生命周期（SDLC）是将软件从想法带到生产的流程。大多数组织运行的是同样六个阶段的某个版本，涵盖软件的计划、设计、构建、测试、部署和维护。传统上，每个阶段都是一个独立的阶段，由不同的角色负责。产品经理编写需求，技术架构师将其转化为设计，工程师构建设计，受监管企业的 QA 团队进行验证，发布团队负责发布，运维团队监控运行中的系统。工作通过文档、工单和签核在阶段之间流转。

传统的软件开发生命周期（SDLC）流程繁重，以确保每一步的可问责性和控制。然而，传统 SDLC 的设计初衷是在一个最耗时、最昂贵的阶段是编写和实现代码的时代最大化效率，而如今情况已不再如此。PRD、估算仪式和产品安全审查的存在，都是为了在可能长达数周、数月或数季度的开发工作中强制达成一致。

传统 SDLC 还具有一些假设每一步都由人执行的控制措施。创造最大价值的组织已经围绕智能体式 AI 现在能做的事情重建了流程，同时确保人类始终留在环路中。在本指南中，我们介绍了我们的应用 AI 团队在 SDLC 每个阶段内部集成 Claude 以加速开发、让流程运行更快的若干最佳实践，这些实践源自与客户的合作。

当代码不再是瓶颈，构建阶段的运行速度超出传统 SDLC 所能允许的范围时，三件事随之成立：

-   瓶颈转移到构建阶段左右两侧的步骤。主要是计划、审查/测试和部署，这些仍然以人的速度运行。
-   控制措施不再与现实匹配，变得难以处理。当代码是人写的时候，逐行审查是合理的，但一旦智能体编写了大部分 diff，这种方式就难以为继。
-   治理成本上升，因为例外情况仍然要通过每周或每月开会的会议和委员会来流转。



构建不再是约束——围绕它的人类速度步骤才是。人类速度的阶段保持其长度，而构建阶段压缩到数小时。

让我们以安全瓶颈为例。安全团队的规模是按人类产出配置的，因此当智能体成倍放大代码产出时，要么审查队列堆积，要么代码在审查不足的情况下发布。受监管的组织无法接受任何一种结果，因此其安全和策略检查必须跟上智能体的步伐。

为了更好地实现智能体式 AI 的生产力提升并保障其安全，传统 SDLC 生命周期需要经历与实现阶段同等程度的转型。

## 什么是 AI 原生 SDLC？

AI 原生 SDLC 是一个重新构想的流程，它将旧的控制目标与新的执行方式结合起来。流程不再是线性流转，而是变成一个循环，AI 嵌入到每一个点。AI 原生 SDLC 促进自动交接和后续打法的触发，帮助解决传统 SDLC 各阶段之间手动、笨拙的交接问题。

你也会听到这种转变被称为智能体式 SDLC、AI SDLC，或简称为智能体式软件开发——标签不同，但描述的是同一件事。



### AI 原生 SDLC 六个阶段中的转变

下表突出了传统 SDLC 与由 Claude 支持的 AI 原生 SDLC 之间的光谱两端。大多数组织处于两列之间的某个位置。

| 阶段 | 传统 SDLC | AI 原生 SDLC |
| --- | --- | --- |
| 计划 | 需求由委员会收集，通过研讨会和签核提炼，手工撰写 | Claude 直接从来源中综合痛点，并将其记录在 `intent.md` 中，该文件人类可读且机器可执行 |
| 设计 | 规格由分析师编写，由设计师解析 | 需求与设计压缩为与智能体的一次工作会话，由编码为 Skills 的标准引导，并在 git 中版本化 |
| 构建 | 测试和代码手写，文档在主开发完成后编写 | 测试和代码由 AI 生成，机构知识以版本化的机器可读 `CLAUDE.md` 文件和 Skills 维护 |
| 测试 | 阶段边界处的 QA 关卡 | 贯穿实现过程的持续评估（eval） |
| 部署 | 人类审查每一行代码，治理在审查周期中进行，往往不一致 | 多层智能体审查，人工审查保留给受监管和关键代码。治理在 AI 行动时强制执行，以钩子（hooks）作为审批关卡 |
| 维护 | 人类监视生产环境中的 bug | 智能体监控实时部署。任何被突破的控制带都会被诊断并作为新的 `intent.md` 写回循环 |

贯穿右列的主线是提交的产物。每个阶段结束时都会向版本控制写入一个产物（包括 `intent.md`、`spec.md`、`plan.md`、diff 及其测试、带有审查发现的 PR，以及事件记录），下一个阶段开始时读取它。在早期阶段，.md 文件是主要产物，因为产品负责人和智能体都能读取并基于同一个文件行动。从构建阶段开始，产物是代码及其记录。提交链也是审计轨迹：谁提出了什么要求、智能体产出了什么、谁批准了它。

人类仍然对每一个需要判断的决策负责。在智能体式 SDLC 世界中，人类的注意力随着必须审查的产物而转移。

每个阶段都提交一个下一个阶段可以读取的产物。意图、规格、计划、diff 和审查发现共同构成审计轨迹。

## 实战打法

实战打法是本手册的核心，分为六个非线性阶段（计划、设计、构建、测试、部署、维护），共同覆盖完整的生命周期。

每个打法涵盖：

-   什么发生了变化；
-   如何开始；
-   具体的实施步骤；
-   治理考量；以及
-   如何衡量它是否奏效。

这些步骤是模块化的，组织可以根据自身独特需求选择在不同时间优先转型不同阶段。每个打法在「前提条件」下列出其依赖项，依赖关系图进一步说明了这一点。

一个阶段以提交产物结束，该提交启动下一个阶段。被接受的 `intent.md` 触发需求与设计环节，被批准的 `spec.md` 触发计划模式，合并的 PR 触发流水线，生产中突破的控制带则写入下一个 `intent.md`，循环如此继续。

首先，你手动提示每一步，最终状态是一个循环，其中每个被接受的产物触发下一个关卡。人类的注意力集中在关卡上，审查智能体标记的内容，而不是从头开始每个阶段。



打法按阶段列出；箭头给出了采用它们的顺序。两者并不相同。从任何黏土色的打法开始——没有箭头指向它，所以它不需要任何前置。对于任何其他打法，指向它的箭头就是需要先采用的打法。

**01**

## 计划

想法不再等待有人把它写出来。意图被一次性捕获，用提出者自己的语言，作为版本控制的产物，下一个阶段可以据此行动。

### 捕获为 intent.md

启动软件开发流程的 `intent.md` 可以通过不同途径进入。一个人有了想法，提交了工单，或者通过告警浮现了事件（见阶段 6：维护）。

当一个人有了想法时，他们与 Claude 进行头脑风暴，产出一份 markdown 原型规格。在传统 SDLC 中，同一个人随后必须说服产品团队的一名成员与他们一起或代表他们把这个想法写出来。

Claude 生成的原型规格人类可读、受版本控制，并且可以立即被下一个阶段使用。原型规格保存为 `intent.md`。

无论意图源自事件触发还是智能体，步骤都相同：产品负责人在提交前审查并修正智能体编写的 `intent.md`。

传统一个想法要经过待办事项条目、用户故事、故事点和细化会议，然后才能有人对它采取行动。每次交接都会转移所有权，因此到达工程团队的内容与提出者的本意已经相隔数步。

AI 原生提出者与 Claude 进行头脑风暴，并将结果写为 `intent.md`，一份用提出者自己术语表达的原型规格。该产物包含想要什么、为什么，以及在什么约束下。重复的流程通过 Skills 编码。

如何开始

**前提条件**

无。

**基础设施**

为非工程师人员提供 Claude 访问权限（claude.ai 或 [Cowork](https://claude.com/product/cowork)）；一个商定的 `intent.md` 模板；一个共享的、受版本控制的意图存放处，由产品负责人关注。对于单个产品，最简单的存放处是产品仓库中的 `intent/` 文件夹。这种设置使产物链紧邻由其派生的代码。只有当意图跨越多个仓库时，专门的意图仓库才值得额外的开销，而在 monorepo 中它就是一个目录。阶段 3：构建的侧边栏介绍了这个存放处与已经保存记录的 Jira 或需求工具之间的关系。

设置这是一次性任务，由平台或工程团队完成。一名技术团队成员需要搭建意图存放处并决定谁可以写入，因为许多贡献者将来自整个组织。

一旦仓库存在，没有 git 经验的贡献者不需要直接使用 git。相反，连接到版本控制系统（例如 GitHub）的 Connectors 让 Claude 可以代表他们从 claude.ai 或 Cowork 提交 markdown 文件。

#### 如何执行

1.  提出者用自己的语言向 Claude 描述问题。提出者可以描述他们今天无法做到什么、谁受这个想法影响、更好的情况是什么样，或者什么不在范围内。不需要正式语言。
2.  头脑风暴直到想法具体化。Claude 会问分析师会问的问题：范围、用户、约束，以及成功是什么样子。
3.  让 Claude 使用组织的模板将结果写为 `intent.md`，该模板可以由技术团队成员设置为 Skill 并由负责人签核。这可以涵盖问题、提议的结果、受影响的用户和系统、约束以及开放问题。
4.  提出者修正 Claude 误解的任何内容。
5.  将 `intent.md` 提交到共享存放处。作者和时间戳加入记录，产品负责人从那里接手这个想法。

```
# Intent: claims status self-service
Author: J. Ortiz (claims operations). Status: draft.

## Problem
Customers phone the contact center to ask where their claim is.
Handlers spend roughly a third of call time on status-only queries.

## Proposed outcome
Customers see claim status, next step and expected date in the portal.

## Affected users and systems
Claims handlers, portal team, claims-core API.

## Constraints
No new PII in the portal session. Existing authentication only.

## Open questions
Do third-party loss adjusters need access too?
```

#### 治理考量

证据是已提交的 `intent.md`，其中列出了作者、时间戳和完整的修订历史。它记录在意图存放处的 git 历史中。产品负责人批准，将意图送入阶段 2：设计的接受或拒绝决策记录为合并或关闭审查。

如何衡量

**领先指标**

从首次对话到提交 `intent.md` 的时间，从意图存放处的 git 历史读取，其中记录了作者和时间戳。预期是从数周的引导和细化周期降至数小时。

**滞后指标**

存活率，即产品负责人接受进入阶段 2：设计而非关闭的 `intent.md` 文件占比。接受或拒绝决策记录为产物的合并或关闭的审查。此外，还有在同一变更的第一个 `spec.md` 提交之后对 `intent.md` 所做的更改数量。

**02**

## 设计

需求与设计合并为一次会话。策略在编写规格时应用，而不是在数周后的审查中才发现。

### 需求与设计

一旦产品负责人批准，Claude 就接手被接受的 `intent.md` 并产出一份需求与设计规格。这由组织在品牌、安全、合规和 UX 方面的 [Skills](https://code.claude.com/docs/en/skills) 引导。

产品负责人审查该规格，但不编写它。这个流程的目标是创建一份工程团队可以据此规划的规格，并标记出关注领域。

前端工作是最清晰的例子。一旦 `intent.md` 被接受，产品负责人就在 [Claude Design](https://claude.com/product/design)（beta）中根据 `intent.md` 制作设计原型，迭代原型，然后导出到 Claude Code 进行构建。

传统需求与设计是由不同团队运行的独立阶段。分析师将想法形式化为需求，设计师再将其解析为设计。这种分离是为了可问责性，但缓慢且有损耗。

AI 原生两个阶段在一次提示会话中完成。Claude 接手 `intent.md` 并产出需求与设计规格，受组织的 Skills 约束，并标记关注领域。

如何开始

**前提条件**

编写一个 `intent.md` 文件，将品牌、安全、合规和 UX 策略编写为 Skills。

**基础设施**

一名拥有 Claude 访问权限的产品负责人。不需要工程技能。

#### 如何执行

1.  产品负责人打开一个会话，确保组织的 Skills 可用，并附上 `intent.md`。
2.  产品负责人的提示词指向 `intent.md`，指明约束，并要求标记关注点。起初手动运行，然后将其固化为组织级斜杠命令。从那里开始，将意图存放处中 `intent.md` 的接受作为触发器，用一个非交互式任务在合并时触发，加载组织的 Skills 运行该环节，并将 `spec.md` 作为拉取请求（PR）提交（阶段 5：部署中的 CI/CD 打法涵盖了相关管道）。从那时起，产品负责人的首次参与就是审查。
3.  同一产品负责人对照想法审查规格。规格是否解决了所述问题，`intent.md` 中的开放问题是否得到回答或延续？
4.  首先处理被标记的关注点，因为它们是分析师会升级的点。产品负责人在工程团队看到规格之前与相应的策略负责人解决每一个。
5.  将 `spec.md` 与 `intent.md` 一起提交。这对文件记录了要求了什么以及决定了什么。
6.  产品负责人决定规格和意图是否进入构建，对于组织归类为较高风险的任何内容咨询技术负责人。始终由人类团队成员做出这个决定，接受规格就是启动阶段 3：构建中计划模式打法的关键。

#### 它看起来是什么样（提示词）

```
Read the attached intent.md and produce a requirements and design spec for integrating it into our existing codebase. Apply the skills available to you so the plan conforms to our brand guidelines, security policies and UX standards. Document the spec fully as spec.md, ready to hand to the engineering team. Describe clearly any areas of concern, especially where you cannot satisfy contradicting policies.
```

#### 治理考量

实时策略在编写规格时被读取和应用，而不是在数周后的审查中才发现。组织的 Skills 作为规格的约束被应用。规格、产生它的提示词，以及生效的 Skill 版本都记录在版本控制中。产品负责人签核规格，并将被标记的关注点转交给指定的策略负责人。

如何衡量

**领先指标**

同一变更从 `intent.md` 提交到 `spec.md` 提交之间的经过时间（两个 git 时间戳），与旧的需求加设计周期相比。

**滞后指标**

构建开始后的需求返工。统计同一变更在第一个 `plan.md` 提交之后日期的 `spec.md` 提交。Git 日志可以直接给出。

**03**

## 构建

没有经过批准的计划就不实现任何东西。机构知识变成智能体读取的文件，护栏以代码而非习惯的形式运行。

### Claude Code 计划模式作为默认起点

工程师在[计划模式](https://code.claude.com/docs/en/permission-modes)下启动 Claude Code 会话，将阶段 2：设计中批准的 `spec.md` 交给 Claude，让它采访他们，迭代计划直到工程师满意。

传统工程师阅读设计并开始编写代码。变更将如何进行，具体到哪些文件和哪些测试，留在工程师的头脑中，或者最多是工单评论。没有其他人可以审查它。审查者看到的第一件事是完成的 diff，到那时返工已经很慢。

AI 原生工作从 Claude 在计划模式中产出的书面计划开始，在计划模式中它可以读取代码库而不做任何更改。工程师在编写代码之前修正计划，批准的版本作为 `plan.md` 提交，供后续阶段对照检查。

如何开始

**前提条件**

意图产物（`intent.md` 或 `spec.md`）如果存在，以及 `CLAUDE.md` 文件有帮助。

**基础设施**

拥有仓库访问权限的 Claude Code。

#### 如何执行

1.  工程师在计划模式下与 Claude 启动会话。
2.  工程师将 `intent.md` 和 `spec.md` 交给 Claude，并要求一份实现计划，指明更改的文件、工作顺序以及证明它的测试。
3.  通过询问变更可能破坏什么、哪一步风险最大，以及 Claude 选择不做哪些其他选项来质询计划。
4.  迭代直到一个从未见过对话的工程师可以仅凭计划实现该变更。
5.  将批准的计划作为 `plan.md` 提交。计划加入审计轨迹，PR 审查打法（阶段 5：部署）对照它检查最终的 diff。
6.  接受计划并让 Claude 实现。有了可靠的计划，实现通常一次通过。
7.  当实现偏离计划时，在同一提交中更新 `plan.md`。考虑使用钩子来强制两者同步。

#### 它看起来是什么样（plan.md）

```
# Plan: claims status self-service (from intent.md 2026-06-02)

## Files that change
portal/src/claims/StatusPanel.tsx (new), claims-api/routes/status.py,
claims-api/tests/test_status.py

## Order of work
1. Add the status endpoint behind existing auth.
2. Panel against the endpoint.
3. Wire into the portal nav.

## Risks
The claims-core API rate-limits at 50 rps; the panel must cache.

## Proof
test_status.py covers the four claim states; screenshot matches the
approved mock.
```

#### 治理考量

设计审查在任何代码生成之前进行，此时改变方向仍然只是编辑文档的问题。计划模式本身强制执行这一点，因为在工程师接受计划之前 Claude 无法编辑文件。计划及其修订与接受者一起记录。常规变更由工程师批准，组织归类为较高风险的任何内容交给技术负责人或架构师。

如何衡量

**领先指标**
从首次实现通过即合并的变更比例，以及从计划批准到合并 PR 的时间，所需数据在 PR 元数据中。

**滞后指标**

每个变更的返工周期，同样来自 PR 元数据，以及合并的 diff 仍然匹配已提交 `plan.md` 的频率。

### Claude Code 自动模式

Claude Code 也可以在自动模式下运行，工程师批准计划后，一旦满意并迭代完成，Claude 应用每个更改而无需逐次编辑提示。随着后续打法中的护栏成熟（调优的 `CLAUDE.md`、编码策略的 Skills、阻止不安全操作的钩子，以及 Claude 可以运行的测试套件），自动接受成为常规工作的默认：紧凑的 `spec.md`、小的影响范围，以及测试已经覆盖的代码。

现在的转变是从用户观看智能体进行编辑并审查操作，转向在更长的自主会话之后审查产物。自动接受模式进一步实现了个人和团队在使用 worktree 时的并行性，并且对于自主运行 SDLC 和如阶段 6：维护所述闭合循环至关重要。

侧边栏

### 遗留系统与事实来源

_适用于流程产出的每一个产物。_

现有的 SDLC 流程可能已经在跟踪产物，只是不在 markdown 文件中。工作项可能在 Jira 中，需求在内置监管可追溯性的工具中，设计在 Figma 中，变更审批在变更委员会。这些系统很难被取代，因为审计员和监管机构已经接受它们，其他团队也依赖它们，所以 AI 原生 SDLC 必须围绕现有系统来适应。

在过渡到 AI 原生 SDLC 时，对于流程产出的每一个产物，指定一个系统作为事实来源，其他所有系统持有副本或指向原始文件的链接。以下配置可以设置为只有一个事实来源，选择因产物而异：

**仓库作为事实来源。** markdown 产物是权威记录，遗留系统引用提交中的文件。对于工程主导的组织，这可能是最干净的配置之一，因为所有记录都在一个工具中，有一个时间戳权威。

**遗留系统作为事实来源。** Jira、ServiceNow 或需求工具持有权威记录，markdown 产物是工作副本。Claude 在会话开始时读取记录，并在产生规格或计划的同一会话中通过 [MCP](https://code.claude.com/docs/en/mcp) 连接器将结果写回。

**链接作为最低标准。** 所有产物注明记录 ID，所有遗留记录包含 markdown 文件的提交 SHA。在过渡到 AI 原生 SDLC 时，链接是一个好的起点，接受存在两个事实来源。

遗留系统和 markdown 优先系统可以共存，只要两者之间有链接，或者声明其中一个为事实来源。

### CLAUDE.md

[`CLAUDE.md`](https://code.claude.com/docs/en/memory) 为 Claude 提供新加入者所需的上下文，涵盖约定、命令、架构，以及团队最常看到的错误。过去存在于人们头脑和 wiki 中的知识变成一个智能体在每次会话开始时读取的文件，由整个团队维护，并在每次犯错时迭代。

如何开始

**前提条件**

无。

**基础设施**

一个仓库、安装好的 Claude Code，以及一名熟悉代码库的工程师。

#### 如何执行

1.  在仓库中运行 `/init`。Claude 根据发现的内容生成一个起始 `CLAUDE.md`。
2.  将生成的文件裁剪到新加入者第一天需要的内容。保留构建、测试和 lint 命令，重要的约定，以及 Claude 一直搞错的事情。
3.  将 `CLAUDE.md` 检入仓库根目录的 git，以便整个团队共享一个版本，更改像代码一样被审查。
4.  一条工作规则在这里有帮助。当 Claude 第二次犯错时，纠正进入 `CLAUDE.md`。
5.  保持在一页以内，因为 Claude 在会话开始时读取全部内容，任何过时的内容都在无益地占用上下文。

#### 它看起来是什么样（CLAUDE.md）

```
# Payments service

## Commands
- Build: make build
- Test: make test (unit), make itest (integration, needs docker)
- Lint: make lint (runs in CI; fix before pushing)

## Conventions
- Java 21, Spring Boot 3. No new Lombok.
- Money is always BigDecimal, never double.
- Every endpoint needs an integration test in src/itest.

## Architecture
- api/ holds REST controllers, core/ holds domain logic,
  adapters/ talks to external systems.
- Kafka events are defined in schemas/; never edit generated classes.

## Things Claude gets wrong
- Do not bump dependency versions; the platform team owns them.
- The legacy v1/ package is frozen; changes go in v2/.
```

#### 治理考量

`CLAUDE.md` 受版本控制，因此智能体遵循的指令可审查、可审计。团队约定通过该文件应用，对其的更改记录在 git 历史中，代码所有者通过 PR 审查批准这些更改。

如何衡量

**领先指标**

Claude 重复 `CLAUDE.md` 本应捕获的错误的频率。对 `CLAUDE.md` 的纠正或更改应在 git 历史中跟踪。

**滞后指标**

团队新成员从 PR 历史到首次合并 PR 的时间。

### Skills 作为机构知识

Skills 是组织使其机构知识可操作的方式。指令是明确的、受版本控制的、广泛应用的，并在策略变化时集中更新。经验法则：为必须一致应用的机构知识编写 Skill；不要为属于 `CLAUDE.md` 或提示词的组件编写 Skill。

如何开始

**前提条件**

无必需项。拥有 `CLAUDE.md` 有帮助，因为它将智能体的工作知识保留在仓库中，但 Skill 不依赖它。

**基础设施**

一项有指定负责人和书面事实来源的策略。

#### 如何执行

1.  选择一条目前执行不一致的知识。这可以是安全标准、API 设计约定或品牌规则。
2.  将其编写为 Skill，一个包含 `SKILL.md` 的文件夹，其 frontmatter 说明何时触发，正文说明做什么。工程师根据策略负责人的事实来源编写它，使用 Claude 协助。
3.  将 Skill 放在仓库的 `.claude/skills/<name>/` 中，使其随代码发布，或通过[插件](https://code.claude.com/docs/en/plugin-marketplaces)在全组织分发。
4.  测试 Skill 是否触发。以不同方式让 Claude 执行相关任务，并确认每次 Skill 都加载。
5.  当策略变化时，更改 Skill 并让策略负责人签核更改。
6.  工程师在下次会话中自动获得新版本。

#### 它看起来是什么样（.claude/skills/secure-api-review/SKILL.md）

```
---
name: secure-api-review
description: Apply the API security standard. Use whenever creating or
  modifying an external-facing endpoint, reviewing API code, or
  generating an OpenAPI spec.
---
# Secure API review

When you create or change an API endpoint:
1. Authentication: every endpoint requires the gateway JWT;
   no anonymous routes outside /health.
2. Input validation: validate request bodies against the OpenAPI
   schema and reject unknown fields.
3. Audit: every state-changing endpoint emits an audit event with
   actor, action, entity and timestamp.
4. Data classification: fields tagged pii in the schema must never
   appear in logs or error messages.

Run scripts/check-endpoints.sh and include its output in your summary.
```

#### 治理考量

Skill 是一种控制，尽管是建议性的。它使 Claude 在编写代码时更可能应用策略，但没有任何东西强制会话遵守它。必须始终成立的策略需要在 Skill 背后有确定性的东西，例如阻止操作的钩子或在 PR 重新检查策略的审查环节。Skill 使违规变得罕见，钩子使违规几乎不可能。Skill 调用记录在会话追踪（trace）中，策略负责人像审查代码一样审查 Skill 更改。

如何衡量

**领先指标**

从策略负责人批准策略更改到更新的 Skill 合并的时间，取自 Skill 文件夹上的 PR。

**滞后指标**

引用该策略的 PR 审查发现，一旦 Skill 在编写代码时应用策略，这些发现应降至零。如果发现没有降至零，要么 Skill 没有触发，要么其文本已偏离官方策略。

### 钩子作为构建时护栏

Skill 是建议性控制，而[钩子](https://code.claude.com/docs/en/hooks)是其背后的确定性层。Claude 的大多数操作在实现期间是文件编辑和 shell 命令，因此构建阶段是钩子最常触发的地方。

构建阶段的钩子可以：

-   阻止对受保护路径的编辑，例如生成的类或冻结的包；
-   在文件编辑后运行格式化和 linter，使偏差永不累积；
-   将凭据排除在 diff 之外。

为任何必须无例外成立的策略 Skill 提供支持。钩子在每个匹配的操作上运行，因此构建阶段的钩子应该快速并限定在更改的文件上。较重的检查如完整测试套件属于提交或 PR。

要求人类批准的钩子属于阶段 5：部署中的关卡，因为构建期间的审批提示会让人重新回到所有并行运行的会话的关键路径上。

### 并行会话与子智能体

一名工程师可以同时驱动多个工作流。

并行会话是另一个完整的 Claude Code 实例，在自己的 [git worktree](https://code.claude.com/docs/en/worktrees) 中处理单独的任务。每个独立会话对其他会话一无所知，引导它们的工程师是它们唯一的共享点。

[子智能体](https://code.claude.com/docs/en/sub-agents)在单个会话内作为有作用域的助手运行，拥有自己的上下文窗口和工具限制，适合在多个任务中重复出现的工作，例如验证应用按预期运行。

并行会话提高工程师可以同时进行的任务数量，而子智能体让每个会话专注于自己的任务。工程师的工作是引导和审查所有这些。

传统一名工程师一次处理一个任务，每天或每周有相当一部分时间花在构建、测试和审查者上。等待时在任务之间切换是可能的，但上下文切换足够累人，很少有人选择这样做。

AI 原生一名工程师同时运行多个 Claude 会话，每个在自己的 worktree 中处理自己的任务。重复的工作变成拥有自己上下文和工具限制的子智能体。工程师的工作转向编排，最终转向构建和监控循环。

如何开始

**前提条件**

`CLAUDE.md`，因为所有会话都读取该文件。反馈循环（阶段 4：测试）在这里也有帮助，因为当会话可以验证自己的工作后，需要的工程师监督更少。

**基础设施**

一个 git 仓库，因为隔离来自 worktree，以及调整好的权限设置，使会话不会因为组织认为安全的命令而等待审批提示。

#### 如何执行

1.  工程师将工作拆分为触及不同文件的任务，使用计划模式打法（阶段 3：构建）中的计划来查看工作在哪里是独立的。共享文件的任务在单个会话中依次运行。
2.  每个并行任务获得自己的 worktree，例如在一个终端中运行 `claude --worktree feature-auth`，在另一个终端中运行 `claude --worktree fix-rate-limit`。worktree 是在自己分支上的单独检出，防止会话在文件上冲突。
3.  两到三个会话是合理的起点。实际上限是一个人能正确审查多少工作流，因此只有在审查跟得上时才增加会话。
4.  将重复的工作变成子智能体，定义在 `.claude/agents/` 中的 markdown 文件里，每个都有名称、何时使用的描述，以及它可以触及的工具。示例包括一个代码简化器，在主智能体完成后去除不必要的复杂性；一个验证器，运行应用并检查行为；一个研究者，探索代码库并报告回来而不淹没主上下文。将定义检入 git，以便整个团队共享。

#### 它看起来是什么样（.claude/agents/verifier.md）

```
---
name: verifier
description: Runs the app and checks the change works before the session
  reports done
tools: Bash, Read
---
Start the app with make run. Exercise the changed behavior and the two
nearest neighboring flows. Report what you ran, what you saw, and any
behavior that does not match plan.md. Do not fix anything; report only.
```

#### 治理考量

更多会话意味着更多产出，因此控制必须来自仓库中的配置。那里的钩子和权限设置适用于所有会话，会话所做的被记录并归属于运行它的工程师。

如何衡量

**领先指标**

在审查质量保持的情况下每名工程师的并发会话数，从 OpenTelemetry 导出中统计，以及一天中用于引导而非等待的时间占比。

**滞后指标**

每名工程师每周合并的变更，与根据 PR 历史确定的返工率一起阅读。

**04**

## 测试

每个会话在人类看到之前检查自己的工作，引导智能体的配置像它编写的代码一样接受回归测试。

### 给 Claude 一个反馈循环

始终给 Claude 一种[验证自己工作](https://claude.com/resources/articles/building-verification-loops-in-claude-code-with-skills)的方式，无论是测试、构建还是截图差异。会话在工程师看到之前检查自己的工作并修正自己的错误。

反馈循环不应与验证器子智能体（阶段 3：构建）混淆。反馈循环在整个任务中运行，次数与工作需要的一样多。另一方面，验证器子智能体是打包最终检查的一种方式，在会话认为工作完成后运行一个全新的上下文窗口。这样结论不会被产生代码的假设所影响。

传统代码可用的信号来得很晚。CI 在几分钟后，测试人员在几天后，生产在几周后。当智能体产生代码时，晚到的信号意味着一个人必须检查其所有输出，而这个人成为瓶颈。

AI 原生会话获得一种在人类看到之前检查自己工作的方式。运行测试、运行构建、截图。Claude 迭代直到检查通过，因此到达工程师的内容已经通过了检查。设置循环是运行会话的工程师的责任，以下步骤是为他们编写的。

如何开始

**前提条件**

无。

**基础设施**

一个测试套件和一个构建，各自用一条命令在本地运行。对于 UI 工作，Claude 看到结果的方式至关重要，要么是浏览器工具，要么是通过 MCP 接入的截图工具。

#### 如何执行

1.  如果今天检查工作需要一系列命令和一些环境知识，将其包装成单个目标，如 "make test" 或 "npm test"，失败时以非零退出。
2.  在 `CLAUDE.md` 的 Commands 部分，列出每个命令及健康输出的示例。
3.  陈述一个目标并使其可量化，以便 Claude 无需询问你就能检查工作，例如："test\_status.py 中的所有测试通过"、"截图与附加的原型匹配"，或 "端点返回 200 并带有新字段"。
4.  对于 bug 修复，先编写失败的测试。让 Claude 将 bug 复现为测试，运行它，并确认它因你预期的原因失败。提交该测试。然后才让 Claude 在不编辑测试的情况下使其通过，最后一步的测试文件钩子强制执行此限制。在修复之前存在且智能体无法重写的测试，是 bug 已消失的证明。
5.  对于 UI 工作，用视觉检查闭合循环。给 Claude 一个浏览器或截图工具，给它原型，让它迭代。实现、截图、比较、调整。两到三轮是正常的，结果应该每轮都有改善。
6.  使验证成为「完成」的一部分。指令放在 `CLAUDE.md` 中。在报告任务完成之前运行测试，并展示输出。
7.  最后，循环本身需要保护，因为修复代码的智能体不能削弱对该代码的检查。在修复任务期间阻止编辑测试文件的钩子可以做到这一点。替代方案是在审查中检查 diff 并拒绝任何触及测试的更改。

#### 它看起来是什么样（CLAUDE.md 验证块）

```
## Verifying your work

- Build: make build (must finish with "Build succeeded")
- Test: make test (all green; never skip or delete a failing test)
- Lint: make lint (zero warnings)

Run all three before reporting any task complete, and paste the output.
If a test fails, fix the code, not the test.
```

治理考量

**强制执行什么**

在任务报告完成之前进行验证，以及在修复期间阻止智能体编辑测试文件，在组织希望保证的地方都实现为钩子。

**证据是什么**

"make test" 的字面输出、构建日志，或 Claude 运行并粘贴的截图差异，因此证据来自工具链。

**记录在哪里**

在会话记录中，OpenTelemetry 导出将其转发到组织的可观测性栈，以及在 PR 的检查运行中，审查者和任何后来的审计员都能看到。

**谁批准**

审查 PR 的代码所有者，由于机械证据已经附上，他们可以专注于意图和风险。

如何衡量

**领先指标**

智能体编写的变更的首次 CI 成功率，CI 系统已经支持。

**滞后指标**

每个 PR 的审查时间（来自 PR 元数据），一旦测试捕获了审查者过去捕获的内容，这应该下降，以及来自事件跟踪器的变更失败率。

### CI 中的持续评估

评估（eval）是 AI 原生版的阶段关卡 QA。在实践中，这意味着一个在智能体配置变化时运行的套件。当换入新模型或重写提示词时，评估套件说明智能体是否仍以相同标准完成工作。

评估应被视为一个活的套件。随着模型改进，曾经有区分度的用例不再有区分度，必须添加来自持续监控的新用例。

取决于用例，一些团队可能更愿意以固定节奏离线运行这些评估，而不是在每次更改时运行。以下步骤是针对持续评估的。

如何开始

**前提条件**

`CLAUDE.md` 和反馈循环（阶段 4：测试）。

**基础设施**

可以非交互式运行 Claude Code 的 CI，以及有评估运行预算的 API 密钥。

#### 如何执行

1.  平台工程师从最近的工作中收集 20 到 50 个真实任务及其预期/接受的结果。
2.  将每个任务编写为评估，即提示词加上定义可接受性的检查（测试通过、lint 干净、行为不变、策略遵循）。
3.  套件在 CI 中按计划非交互式运行，并在 `CLAUDE.md`、Skills 或钩子有任何更改时运行，因为该配置引导智能体，值得像代码一样接受回归测试。
4.  根据结果对配置更改设关卡。降低通过率的 Skill 更改在合并前接受审查。
5.  每个生产事件都获得一个评估，由拥有该事件的团队编写，并作为回归测试留在套件中。

#### 它看起来是什么样（.github/workflows/agent-evals.yml）

```
name: Agent evals
on:
  pull_request:
    paths: ['CLAUDE.md', '.claude/**']
  schedule:
    - cron: '0 2 * * *'
jobs:
  evals:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v4
      - run: npm install -g @anthropic-ai/claude-code
      - name: Run eval suite
        env:
          ANTHROPIC_API_KEY: ${{ secrets.ANTHROPIC_API_KEY }}
        run: |
          for eval in evals/*.json; do
            claude -p "$(jq -r '.prompt' $eval)" \
              --allowedTools "Read,Edit,Bash(make test)" \
              --output-format json > result.json
            ./evals/check.sh "$eval" result.json
          done
```

#### 治理考量

评估给 QA 一个能跟上智能体产出的关卡。通过率阈值作为合并检查强制执行，运行被记录以便随时间比较结果，拥有配置更改的团队批准它。

如何衡量

**领先指标**

评估通过率随时间的变化，由套件在每次运行时报告，以及生产事件成为永久评估所需的时间。

**滞后指标**

CI 中捕获的回归与生产中发现的回归相比，来自事件跟踪器。

**05**

## 部署

审查双向运行，治理在智能体行动时强制执行。智能体完成直到生产关卡之前的一切，不越过它。

### PR 审查循环中的 AI

Claude 既给出也接收审查。它根据组织的策略审查传入的 PR，并处理自己 PR 上的审查评论。这使工程师能够在 PR 审查中专注于行为，归结为判断意图和风险。

传统审查能力是按人类产出规划的。PR 等待审查者阅读全部内容，审查质量随审查者的负载而变化，作者追赶而积压增长。

AI 原生所有 PR 获得相同的审查环节集合，发现按严重程度排序。人类的注意力上移一层，关注变更是否实现了计划的意图以及风险是否可接受。

如何开始

**前提条件**

来自阶段 3：构建的更新后的 `CLAUDE.md` 文件；如果审查环节执行书面策略，则需要 Skills，以及定义好的子智能体。

**基础设施**

安装了 Claude 集成的仓库，要么是由管理员启用的托管[代码审查](https://code.claude.com/docs/en/code-review)服务，要么是在你自己的 CI 中运行的 [claude-code-action](https://code.claude.com/docs/en/github-actions)，在需要时通过 AWS Bedrock、Google Vertex 或 Microsoft Foundry 进行模型调用（CI/CD 打法涵盖部署选项）。要求代码所有者批准的分支保护策略也值得设置。

#### 如何执行

1.  托管的[代码审查](https://claude.com/resources/articles/code-review-is-now-generally-available)服务是最快的起点。管理员启用它并选择仓库。当你需要控制流水线或希望 API 调用通过你自己的云协议路由时，使用 claude-code-action 在你自己的 CI 中运行审查（CI/CD 打法涵盖相关管道）。
2.  技术负责人将审查策略编写为仓库根目录的 `REVIEW.md`，分为组织关心的环节：bug 和逻辑错误；安全和漏洞；对照规格（来自需求打法的 `spec.md`）、实现计划（来自计划模式打法的 `plan.md`）和设计原则的合规性。`REVIEW.md` 还定义了什么算作 Important 而非 Nit，以及跳过什么。
3.  技术负责人设置人类阈值。发现本身不批准或阻止 PR，分支保护仍然要求代码所有者批准。希望根据发现对合并设关卡的门平台工程师可以读取检查运行发布的严重程度计数，作为机器可读的统计。
4.  当审查者或作者在审查评论中标记 `@claude` 时，Claude 处理评论并推送修复。PR 线程记录请求和更改。这个修复循环通过 claude-code-action 运行。在托管服务中，评论 `@claude review` 则请求新的审查。对于 Claude 打开的 PR，更进一步，让 Claude 照看 PR 直到合并。团队将循环包装在自定义斜杠命令中，扫描 PR 上未解决的审查评论和失败的检查，处理它们并推送修复，直到 PR 变绿且只等待代码所有者批准。
5.  审查发现反馈到 `CLAUDE.md`。当审查第二次标记一个错误时，纠正作为该审查的一部分进入 `CLAUDE.md`，并且由于审查读取 `CLAUDE.md`，从下一个 PR 开始该错误就会被捕获。审查还会标记变更何时使 `CLAUDE.md` 过时。
6.  每月一次，技术负责人通过给发现评分来调整设置，使审查者改进，并在 `REVIEW.md` 中限制 Nit 数量。生成的路径和 CI 已经强制执行的任何内容被排除。

#### 它看起来是什么样（REVIEW.md）

```
# Review instructions

## Passes
Run three passes and tag each finding with its pass:
- Bugs: logic errors, broken edge cases, subtle regressions
- Security: injection risks, authentication gaps, PII in logs
- Compliance: the change matches spec.md, plan.md and our design principles

## What Important means here
Reserve Important for findings that would break behavior, leak data
or breach a policy. Style and naming are nits.

## Cap the nits
Report at most five nits per review; summarize the rest as a count.

## Do not report
Generated files under src/gen/ and anything CI already enforces.
```

#### 治理考量

职责分离得以保留，因为编写代码的智能体无法批准它。`REVIEW.md` 中的审查策略应用于所有 PR，发现、修复、评分和批准记录在 PR 历史中，因此 PR 就是审计记录。批准来自人类通过分支保护，以发现为依据。

关于这些控制措施在生产规模下如何组合，见[在 Anthropic 保障 AI 原生 SDLC 的安全](https://claude.com/resources/articles/how-anthropic-secures-its-ai-native-software-development-lifecycle)。

如何衡量

**领先指标**

首次审查时间，应降至分钟级，以及在没有人类触及分支的情况下解决的审查评论占比，数据直接存储在 Git 上。

**滞后指标**

合并前捕获的缺陷和漏洞与逃逸到生产的相比，来自 PR 历史和事件跟踪器。

### 钩子作为审批关卡

构建阶段使用钩子作为护栏，允许或阻止操作而无需人类参与（阶段 3：构建）。钩子也可以询问，暂停操作直到特定人员批准，这正是发布关卡所需要的。

该打法位于阶段 5：部署，因为发布关卡是最清晰的案例，但钩子并非部署专用：它们在 Claude 行动的任何地方运行。例如，钩子可以在阶段 3：构建期间阻止没有变更工单的迁移和基础设施编辑，并在阶段 4：测试期间阻止智能体在修复任务中编辑测试文件。

如何开始

**前提条件**

无。

**基础设施**

一份变更流程所需审批的书面清单。

#### 如何执行

1.  工程领导层与变更管理和合规部门列出必须保留的人类审批关卡，例如变更管理签核、发布授权，以及对受保护路径的编辑。
2.  平台工程师将每个关卡表达为钩子，一个在 Claude 行动之前运行的脚本，可以允许、询问或阻止。
3.  团队钩子放在 git 中的 `.claude/settings.json` 中，不可协商的钩子放在由平台或 IT 管理员拥有的托管设置中，个别工程师无法关闭它们。
4.  阻止应该解释自己，因此当钩子停止操作时，原因和审批途径出现在 Claude 的输出中。

#### 它看起来是什么样（.claude/settings.json）

```
{
    "hooks": {
      "PreToolUse": [
        {
          "matcher": "Bash",
          "hooks": [
            { "type": "command",
              "command": "${CLAUDE_PROJECT_DIR}/.claude/hooks/production-gate.sh" }
          ]
        }
      ]
    }
}
```

#### 以及关卡本身（.claude/hooks/production-gate.sh）

```
#!/bin/bash
# Production deploys require a named release authorization
cmd=$(jq -r '.tool_input.command' < /dev/stdin)
if [[ "$cmd" == *"deploy"* && "$cmd" == *"production"* ]]; then
   if [ -z "$RELEASE_APPROVAL" ]; then
     echo "Production deploys need a release authorization." >&2
     exit 2 # exit 2 blocks the action; the message goes to Claude
   fi
fi
exit 0
```

#### 治理考量

钩子就是审批关卡。关卡条件每次都强制执行，对所有人。允许和阻止决策带时间戳记录。关卡还定义了什么算作批准，无论是批准的变更工单还是发布经理的签核。

完整示例

### 受监管企业的托管设置

_由平台团队通过 MDM 或管理控制台部署；工程师无法编辑或覆盖其中任何内容。_

{ "permissions": { "deny": \[ "Read(.env\*)", "Read(./secrets/\*\*)", "WebFetch", "Bash(curl \*)", "Bash(wget \*)" \], "allow": \[ "Bash(git \*)", "Bash(make build)", "Bash(make test)", "Bash(make lint)" \], "disableBypassPermissionsMode": "disable" }, "allowManagedPermissionRulesOnly": true, "sandbox": { "enabled": true, "failIfUnavailable": true, "allowUnsandboxedCommands": false, "network": { "allowedDomains": \["git.internal.example.com", "registry.npmjs.org"\] }, "credentials": { "files": \[ { "path": "~/.ssh", "mode": "deny" }, { "path": "~/.aws/credentials", "mode": "deny" } \], "envVars": \[ { "name": "GITHUB\_TOKEN", "mode": "deny" } \] } }, "allowManagedHooksOnly": true, "disableSideloadFlags": true, "allowManagedMcpServersOnly": true, "strictKnownMarketplaces": \[ { "source": "github", "repo": "example-corp/approved-plugins" } \], "requiredMinimumVersion": "2.1.193" }

每一行在控制层面带来什么

`permissions.deny` 将机密排除在智能体的上下文之外，并通过工具阻止任意网络出口；`permissions.allow` 预先批准安全的内部循环，使拒绝列表不会变成提示疲劳。

`disableBypassPermissionsMode` 加上 `allowManagedPermissionRulesOnly` 意味着没有工程师、项目文件或命令行标志可以扩大规则。

`sandbox` 填补权限无法覆盖的空白。工具级的 WebFetch 拒绝不能阻止 shell 命令访问网络；操作系统级的域名允许列表直接阻止出口。

`failIfUnavailable` 和 `allowUnsandboxedCommands` 使沙箱成为关卡：当沙箱无法初始化时 Claude Code 拒绝启动，在沙箱内失败的命令不能在沙箱外重试。

`credentials` 填补拒绝规则留下的空白。`permissions.deny` 管理 Claude 的文件工具，但沙箱化的 shell 命令默认仍可读取 `~/.ssh` 或 `~/.aws/credentials`；此块拒绝这些读取，并从每个沙箱化命令的环境中剥离指定的机密。

`allowManagedHooksOnly` 意味着本打法中的审批关卡是唯一运行的钩子；本地任何东西都不能添加或替换它们。

`disableSideloadFlags` 和 `strictKnownMarketplaces` 意味着工程师机器上的每个 Skill、智能体、钩子和 MCP 服务器都通过组织批准的插件市场到达，绝不来自主目录。

`allowManagedMcpServersOnly` 使智能体的工具表面成为由平台团队拥有的允许列表。

`requiredMinimumVersion` 拒绝在低于批准下限的版本上启动，因此控制由组织实际评估过的构建强制执行。

将上述内容视为需要定制的起点，而非照抄的建议。每个拒绝都与能力权衡，正确的平衡取决于仓库的数据分类。设置参考文档记录了每个键，包括仅托管的键：[code.claude.com/docs/en/settings](https://code.claude.com/docs/en/settings)

如何衡量（针对钩子本身）

**领先指标**

在每个审批关卡等待的时间。每个钩子决策都写入 OpenTelemetry 导出，带有时间戳和允许或阻止的判定，因此每个关卡的等待可见。

**滞后指标**

钩子前后到达生产的关卡违规，来自事件跟踪器。

### CI/CD 集成与部署

在 CI/CD 流水线内非交互式运行 Claude Code，对执行进行沙箱化以便长时间运行的智能体安全运行，通过 MCP 集成暴露部署，并在智能体需要之前排练回滚路径。

传统流水线运行确定性脚本，任何需要判断的事情都等待人类。例如，分诊不稳定的测试、编写变更日志，或弄清楚构建为什么失败。部署和回滚是人类在压力下遵循的 runbook。

AI 原生Claude 在流水线内非交互式运行判断步骤，在具有作用域凭据的沙箱中。部署工具通过 MCP 暴露给智能体，因此编写和测试变更的工作流也可以发布它并回滚它，在组织为每个环境定义的关卡内。

如何开始

**前提条件**

PR 审查循环中的 Claude 和作为审批关卡的钩子，因为关卡必须在自动化加速任何东西通过它们之前存在。

**基础设施**

安装了 claude-code-action 的 CI 平台，或任何可以调用 `claude -p` 的运行器；通过 API 或 Bedrock、Foundry 或 Vertex 的模型访问，在流量必须留在组织云协议上的地方；用于部署目标的 MCP 服务器；用于智能体作业的沙箱配置文件，没有常设生产凭据。

#### 如何执行

1.  平台工程师从只读判断步骤开始。在流水线作业中使用 `claude -p` 分诊失败的构建、总结不稳定的测试，或起草变更日志。
2.  在现有门禁后添加写入步骤，用于修复 lint、更新生成的文档，或通过 `@claude` 提及处理审查评论等作业。智能体写入的任何内容都通过分支保护作为 PR 到达，智能体没有推送到 main 的途径。
3.  执行被沙箱化。智能体作业在网络策略下的容器中运行，使用短期作用域令牌，默认不持有生产凭据。
4.  通过 MCP 暴露部署。部署、状态和回滚成为工具，按环境限定作用域，因此智能体的部署能力是允许列表而非带凭据的 shell 脚本。
5.  按环境分层自主性。在开发中，智能体自由部署。在生产中，智能体准备发布，发布经理授权，钩子强制执行生产关卡。预发布环境处于中间位置。
6.  回滚应该是流水线中最常排练的路径，一条智能体可以运行且定期在预发布环境中演练的单一命令。闭合循环打法（阶段 6：维护）在控制带被突破时调用此回滚，因此必须事先证明。

#### 它看起来是什么样（流水线步骤）

```
- name: Triage failed build
  if: failure()
  run: >
    claude -p "Read the build log at out/build.log. Identify the most
    likely cause, say whether the failure looks flaky or real, and write a
    three-line summary for the PR thread." >> triage.md
```

#### 治理考量

治理原则是智能体可以行动到生产关卡，但不能通过它。以下控制强制执行这一原则。

-   分支保护将智能体写入的任何内容变成 PR，没有直接通往 main 的路径。
-   生产部署钩子阻止发布，直到指定的发布经理授权。每个非交互式运行以智能体自己的身份行动，因此流水线日志将智能体所做的与触发它的工程师所做的分开。
-   按环境的权限层级设置智能体在通往关卡的路上可以做多少。

如何衡量

**领先指标**

在不呼叫人类的情况下分诊的流水线故障占比，取自 CI/CD 流水线日志。

**滞后指标**

DevOps 研究与评估（DORA）指标，CI 系统和部署工具已经输出。

**06**

## 维护

循环闭合。触发器调用 Claude，调用路径中没有人员，它发现的内容作为 `intent.md` 重新进入流水线。

### 维护与闭合循环

到目前为止，我们讨论了如何将 Claude 添加到 SDLC 流程的每个阶段，每个阶段都需要人类启动初始步骤。然而，这个阶段将焦点转向 Claude 的自主运行以闭合循环。

例如，一个持续运行的监控智能体可以在 bug 工单被提出后创建一个 `intent.md`，并流经需求、计划、构建、测试和审查阶段。阶段 6：维护无头运行，阶段之间有独立的置信度关卡，一个确定性检查或对抗性审查智能体，决定前一阶段的输出是继续还是升级给人类。

传统维护是一个反应性阶段。所有工单或事件都等待人对其采取行动并重新启动流程。警报在凌晨 3 点触发，可能被错过，工单可能在待办事项中停留直到有人接手，如果另一场火先烧起来，事后行动可能根本到不了代码库。

AI 原生控制带突破、工单、频道消息或计划等触发器调用 Claude，路径中没有人员。Claude 诊断，仅通过受门禁的路径行动，并将其发现写为 `intent.md`，然后经过上述阶段。人们对这项工作分诊和审查，而不再需要启动它。

### 闭合循环

一个确定性脚本监视生产，并在控制带被突破时调用 Claude。对突破的监控是循环自主运行模式的有用示例，而本阶段末尾的 [Claude Tag](https://claude.com/product/tag)（公开 beta）部分涵盖了通过不同渠道到达的工作。

如何开始

**前提条件**

`Intent.md`，为循环提供结构化输出以重新启动。Claude 加速的 PR 审查、作为行动边界的钩子，以及 CI/CD 的回滚路径（最高自主层级调用）。

**基础设施**

检测脚本可以查询的指标存储（Prometheus、CI 系统的 API 或等效物）、对仓库的读取访问、在 CI 中非交互式运行 Claude Code 的方式，或用于接收 webhook 的服务的 [Agent SDK](https://platform.claude.com/docs/en/agent-sdk/overview)。

#### 如何执行

1.  服务所有者或平台工程师选择一个具有稳定滚动基线的指标，例如 CI 测试失败率、部署后 5xx 率或 PR 周期时间。
2.  他们编写检测脚本，通常是滚动窗口上的均值和标准差，配合规则（Western Electric 或类似规则），使控制带既能捕获缓慢漂移也能捕获尖峰。脚本受版本控制并经过单元测试，检测完全保持确定性，不涉及模型。
3.  响应层级在受版本控制的配置中定义（下面的 `bands.yaml`）。在 1σ 时脚本只记录，在 2σ 时以只读方式调用 Claude 诊断，在 3σ 时 Claude 可以行动，但只能通过向审查关卡打开 PR 或触发预先批准的 runbook。
4.  触发层可以是 GitHub 或 GitLab 中的计划工作流、来自现有监控栈的 webhook，或网络内的 Cron Job。Claude 无状态运行，要么作为 CI 运行器上的非交互式步骤，要么作为沙箱容器中的 Agent SDK 服务，CI/CD 打法涵盖部署和模型访问选项。由于运行是无状态且非交互式的，循环可以在没有人启动的情况下开始和结束。
5.  智能体以阶段 1：计划的格式将其诊断写为 `intent.md`，涵盖异常及其证据、提议的结果、受影响的系统以及任何开放问题。从那里，发现像其他任何东西一样经过流水线。
6.  服务所有者或值班工程师分诊队列，将面向产品的发现转交给产品负责人。立即修复、安排或驳回。驳回会调整控制带并帮助减少噪音。
7.  当修复发布时，为事件添加一个评估（持续评估打法），以确保此类问题在未来受到保护。

#### 它看起来是什么样（例如，监视 CI 测试失败率的 bands.yaml）

```
metric: ci_test_failure_rate
baseline: rolling_30d
rules: western_electric
tiers:
  1sigma: { action: log }
  2sigma: { action: diagnose,
            tools: "Read,Grep,Bash(gh run view *)" }
  3sigma: { action: propose,
            routes: [pull_request, runbook:rollback-deploy] }
```

#### 治理考量

层级边界从受版本控制的配置强制执行，权限和托管设置拒绝生产访问。调用、发现和分诊决策带时间戳记录。服务所有者分诊并批准发现，由此产生的变更经过正常的 PR 审查关卡，智能体可以触发的 runbook 已事先批准。

如何衡量

**领先指标**

从控制带突破到分诊队列中出现 `intent.md` 的时间，与旧的事件到事后行动的时间相比。检测脚本的日志有突破时间戳和事件层级。

**滞后指标**

成为合并修复的发现占比（分诊队列与实际 PR 历史对比），以及同类重复事件，随着修复向评估套件添加用例，这应该下降。

#### 示例

-   当 CI 测试失败率突破 3σ 时，智能体隔离不稳定的测试或打开回滚 PR，由审查关卡决定。
-   当部署后 5xx 率突破 3σ 且窗口内有部署时，智能体触发现有的回滚流水线。
-   当 PR 周期时间触发漂移规则时，智能体为工程领导层编写报告，这表明执行框架（harness）对流程指标和生产指标同样有效。

检测保持确定性。一旦控制带被突破就调用 Claude，层级设置它可以做什么。

### 定期代码库扫描

安全扫描是关于特定模型下代码库的时间点陈述，两半都会过时：代码每周都在变化，每一代模型都会发现前一代遗漏的漏洞。AI 原生的答案是按计划运行扫描，调用路径中没有人员，并将发现的内容通过与任何其他代码库变更相同的关卡。

[Claude Security](https://claude.com/product/claude-security) 是定期扫描的托管形式。连接一个 GitHub 仓库，扫描在 Anthropic 的基础设施上使用 Claude Mythos 5 运行，每个发现在报告之前都经过验证并附有置信度评级。建议的补丁在 Claude Code on the web 中审查和应用。组织无需访问模型本身即可获得发现。

传统安全扫描是一个事件，在发布或审计之前启动扫描。报告进入跟踪器，待办事项被手工处理直到下一个事件。其间编写的代码由 PR 审查捕获的任何内容覆盖。

AI 原生扫描按计划对每个连接的仓库运行，使用可用的最强模型，发现在任何人阅读之前经过验证。每个发现的处理方式与突破的控制带相同：适合一个 PR 的修复经过审查关卡，任何更大的变成 `intent.md`。覆盖率从上次运行算起，而不是从第一次

如何开始

**前提条件**

PR 审查关卡和作为审批关卡的钩子（[阶段 5：部署](#sd-s5)），以便发现像任何其他变更一样经过审查。来自[阶段 1：计划](#sd-s1)的 `intent.md` 格式，用于单个 PR 无法容纳的发现。

**基础设施**

Claude Security 在公开 beta 中可供 Claude Enterprise 组织使用。它需要在目标仓库（云托管的 github.com）上安装 Anthropic GitHub App，启用 Claude Code on the Web，打开 Extra Usage 并设置支出限制，为运行扫描的人员提供高级席位，并由管理员在 `claude.ai/admin-settings/claude-code` 开启该功能。扫描按 Mythos 5 费率按用量计费，因此支出限制应与仓库的大小和数量匹配。

#### 如何执行

1.  安全负责人连接仓库，并按仓库、服务或团队将它们组织成项目，以便从一开始就明确发现的所有权。
2.  对最关键仓库运行首次完整扫描，包括之前被其他工具或早期模型扫描过的仓库。将首次扫描视为基线。首次扫描可能会在被认为干净的代码中浮现发现。
3.  为每个项目设置计划。对于活跃开发的服务，每周是合理的默认值；在仓库很大或混合的情况下，将扫描限定到目录或分支。
4.  带着置信度评级分诊发现。带原因驳回，以便驳回被记录，同一发现在下次运行时不会作为新发现返回。
5.  对于有界的发现，在 Claude Code on the Web 中打开建议的补丁，审查它，并像任何其他变更一样通过 PR 审查关卡。提出修复的智能体没有途径批准它。
6.  对于任何比一个补丁更广泛的内容，例如架构弱点或跨服务重复的模式，以阶段 1 格式写为 `intent.md` 并从计划开始。
7.  当修复发布到生产时，将漏洞类别的评估添加到持续评估打法的套件中，以便引导智能体的配置从那时起针对该类别接受测试。
8.  将发现导出为 CSV 或 Markdown，或使用 webhook，以保持组织现有的跟踪器和审计系统作为记录系统，在审计员已经期望它们的地方。

#### 治理考量

扫描在组织的管理员控制下运行，意味着连接哪些仓库、谁持有扫描席位以及支出限制都由中央设置。每个发现都有验证结果和置信度评级，每个驳回都有原因，因此扫描历史是发现、修复和有意识接受的内容的审计记录。

修复通过 PR 审查关卡和分支保护到达生产，而不是从扫描本身。Claude Security 增强现有的静态分析和依赖扫描。确定性检查留在 CI 中，模型驱动的扫描覆盖那些检查并非为发现而构建的上下文相关漏洞。

如何衡量

**领先指标**
按计划连接的仓库占比，以及从发现被报告到其补丁进入 PR 审查关卡的时间，从扫描历史和 PR 元数据读取。

**滞后指标**

定期扫描发现的漏洞与生产中或外部报告发现的相比，来自事件跟踪器；以及经过多次运行的仓库每次扫描发现的趋势，随着修复和评估的积累这应该下降。

### 与 Claude Tag 一起值班

事件也可以通过其他方式到达，例如工作场所通信应用，如 Slack 或 Teams。事件可能看起来像晚上 10 点在事件频道上要求紧急修复的 Slack 消息，现在可以立即处理。Claude Tag（公开 beta，目前在 Slack 中可用）使 Claude 以自己的身份成为这些频道的成员，因此每个新事件都有一个第一响应者，响应本身成为循环的一部分和未来事件的记忆。

对话和机构知识留在频道中，频道中的任何人都可以引导和处理响应。任何团队成员都可以测试假设、探索新选项并实时调查，频道历史增加了可审计性。通过访问 MCP，Claude 验证指标已回到基线并在线程中确认，将事后分析写入受版本控制的经验文件，供未来的调查读取。

事件不是 Claude Tag 唯一接手的工作。在工单上通过 MCP 被标记或在频道中被询问，Claude 以同样的方式分诊工作。一个小的、有界的修复作为 PR 通过审查关卡到达，任何更大的写为 `intent.md` 供阶段 1：计划使用，此时循环开始自我喂养。见：[Claude Tag 如何在 Anthropic 为 CI/CD 值班](https://claude.com/resources/articles/ai-ci-cd-on-call)。



频道就是审计轨迹：请求、诊断、人类授权和修复都留在事件处理的地方。

## 结语

模型和执行框架（harness）已经变得更加先进，使组织不仅能够转型他们生产代码的方式，还能转型整个软件开发生命周期。

这种转型使人类判断保持在流程的核心，并考虑大型企业组织的治理和监管要求。

本指南整合了我们的应用 AI 团队每天为客户执行的许多真实最佳实践，我们希望你觉得它是一个实用且可操作的资源。

循环继续运行。人类判断保持在它之上。

### 资源与致谢

以下文档是平台团队设置这些控制所需的内容，大致按照你推广它们的顺序排列。

感谢 Jim Blackhurst、Will Steuk 和 Jamal Arif 对本指南的贡献，本指南受他们之前大量工作的启发并建立在其基础之上。
