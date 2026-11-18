---
title: "构建高效的智能体自动化"
source_url: "https://claude.dev/blog/building-effective-agent-automations/"
publisher: "claude.dev"
type: "blogPost"
date: "2026-10-08"
products: ["Claude Platform"]
read_time: null
excerpt: "一篇关于定时 Claude Managed Agents 自动化的参考实现演练，包含配置文件以及避免常见失败模式的六条规则。"
fetched_at: "2026-11-18"
---

# 构建高效的智能体自动化

随着 AI 加速我们的工作，跟上节奏变得越来越难。在 Anthropic，[简单的智能体自动化](https://claude.com/resources/articles/how-an-anthropic-japan-business-development-representative-runs-his-day)经常被用来帮忙。它们通常[按计划运行](https://claude.com/resources/articles/whats-new-in-claude-managed-agents)，在后台收集上下文，并主动告诉我们所需的信息。但构建高效的智能体自动化并不容易：它们可能在无人察觉的情况下失去对某个来源的访问权限，或者无法遵循我们的偏好。

使用 [Claude Managed Agents](https://platform.claude.com/docs/en/managed-agents/overview)（beta），我们构建了一个参考实现，它按计划读取自定义来源（例如 Slack 和 GitHub 仓库），跟踪自上次运行以来的变化，并发布你需要知道的内容（例如发布到 Slack）。在本文中，我们逐步讲解每个步骤，分享一个参考实现，并提供一条可在 [Claude Code](https://claude.com/product/claude-code) 中运行的命令，为你配置好该智能体。

## 获取代码

参考实现位于[此处](https://github.com/anthropics/claude-quickstarts/tree/main/managed-agents/daily-brief)。如需交互式演练，请在 Claude Code 中运行下面的命令。`claude-api` skill 可以按照本文的指导帮助设置该智能体：

PROMPT

/claude-api managed-agents-onboard https://claude.dev/blog/building-effective-agent-automations/

对于这个参考实现，你需要一个 Slack 应用（[从 manifest 创建](https://api.slack.com/apps?new_app=1&manifest_yaml=display_information%3A%0A%20%20name%3A%20Daily%20brief%0A%20%20description%3A%20Posts%20one%20short%20brief%20each%20weekday%20morning.%0Afeatures%3A%0A%20%20bot_user%3A%0A%20%20%20%20display_name%3A%20Daily%20brief%0A%20%20%20%20always_online%3A%20false%0A%20%20app_home%3A%0A%20%20%20%20home_tab_enabled%3A%20false%0A%20%20%20%20messages_tab_enabled%3A%20true%0A%20%20%20%20messages_tab_read_only_enabled%3A%20true%0Aoauth_config%3A%0A%20%20scopes%3A%0A%20%20%20%20bot%3A%0A%20%20%20%20%20%20-%20channels%3Ahistory%0A%20%20%20%20%20%20-%20chat%3Awrite%0Asettings%3A%0A%20%20org_deploy_enabled%3A%20false%0A%20%20socket_mode_enabled%3A%20false%0A%20%20token_rotation_enabled%3A%20false%0A)）和一个 [GitHub token](https://github.com/settings/personal-access-tokens/new)。提供的文件（如下所示）是 Claude API 资源的配置，包括智能体、其环境、记忆存储、vault 和部署。

CODEText

daily-brief/
├── agent.md                        model, tools, instructions
├── deployment.md                   schedule, time zone, budget, input message
├── environment.yaml                network allowlist
├── memory\_store\_preferences.yaml   user preferences
├── memory\_store\_state.yaml         the agent's bookmarks, ledger, notes, and run records
├── vault.yaml                      the vault that holds the credentials
├── claude-lock.json                resource IDs, written by ant apply
└── slack/manifest.yaml             one bot app

[`ant apply`](https://platform.claude.com/docs/en/cli-sdks-libraries/cli/apply) 是 ant CLI 中的一条命令，它会读取这些文件，在你的 Claude API 工作区（平台存储和运行这些资源的地方）中创建资源，并将 ID 记录到 `claude-lock.json` 中。

我们将在下面的章节中使用这条命令。配置完成后，该自动化会在 Anthropic 的基础设施上按计划运行，因此[你的机器上无需保持任何进程运行](https://claude.dev/blog/claude-code-in-the-cloud/)。

## 概览

我们将要构建的智能体有六个组成部分，按以下顺序介绍：

-   来源（Sources）—— 一个命名的读取位置列表
-   目标（Destination）—— 智能体可以写入的唯一位置
-   智能体（Agent）—— agent.md 中的模型、工具和运行步骤
-   计划（Schedule）—— 一个 cron 计划
-   记忆（Memory）—— 你的偏好和智能体自身的记忆
-   护栏（Guardrails）—— 在智能体只读取的地方给予只读访问权限，并为每次运行设置支出上限

![智能体的架构：计划唤醒智能体，智能体从其来源读取内容，并向一个目标发布简报供读者阅读。记忆保存智能体的状态和读者的偏好，护栏环绕在智能体周围。](https://claude.dev/media/fdbe45db5e3ce9afbb00bf62f87e64078a683800bc492d4ac6cf716a2d313a00.png)

## 来源

智能体读取两个默认来源：Slack 频道和 GitHub 拉取请求（PR）。频道和仓库列在你的 `preferences` 文件中。该模板可以扩展以使用其他来源。

![架构图中高亮显示来源。来源是只读的，通过 MCP 或 HTTPS 并使用来自 vault 的凭据访问，并为智能体提供输入。](https://claude.dev/media/d8508de61bb90f3bfccf6184dd3d7cbe9c65e2e76bd00477efd1620e3910dae7.png)

### 为智能体提供其专属的、限定范围的凭据

使用 [Managed Agents](https://platform.claude.com/docs/en/managed-agents/overview) 时，凭据存放在 [vault](https://platform.claude.com/docs/en/managed-agents/vaults) 中。智能体可以引用这些凭据，但真实值保留在 vault 中，位于 Claude 代码运行的[沙箱之外](https://claude.com/resources/articles/giving-companies-more-control-over-their-ai-agents-with-nvidia)（参见[此处](https://www.anthropic.com/engineering/managed-agents)和[此处](https://x.com/katelyn_lesse/status/2099315903884415400)）：

-   **MCP 服务器（GitHub）。** 智能体通过运行在沙箱之外的代理调用 MCP 工具。代理会找到 URL 与该服务器匹配的 vault 凭据。

-   **Shell（Slack）。** 智能体在沙箱内使用 bash 工具通过 curl 调用 Slack API。沙箱中只保存一个不透明的占位符 `$SLACK_BOT_TOKEN`。当请求离开沙箱时，平台会为你允许的主机替换为真实 token。

使用 `ant` CLI 和仓库中的模板文件创建 vault：

CODEShell

ant apply vault.yaml

这会在你的 Claude API 工作区（平台存储它的地方）中创建 vault，并将其 ID 记录到 `claude-lock.json` 中。然后使用 [TypeScript SDK](https://platform.claude.com/docs/en/cli-sdks-libraries/sdks/typescript) 将每个凭据添加到 vault 中。以下示例展示了添加 Slack 凭据：

CODETypeScript

const vaultId = process.env.VAULT\_ID!; // the vault's ID, from claude-lock.json

await client.beta.vaults.credentials.create(vaultId, {
  display\_name: "SLACK\_BOT\_TOKEN",
  auth: {
    type: "environment\_variable",
    secret\_name: "SLACK\_BOT\_TOKEN",
    secret\_value: process.env.SLACK\_BOT\_TOKEN!,
    networking: { type: "limited", allowed\_hosts: \["slack.com"\] },
    injection\_location: { header: true },
  },
});

创建 vault 并添加每个凭据后，将 vault 附加到部署。将 `claude-lock.json` 中的 vault ID 复制到部署文件 `deployment.md` 的 `vault_ids` 中。

### 从上次中断的地方继续读取

一个常见的错误是让智能体读取固定的时间窗口，比如“_过去 24 小时_”。运行晚了会留下空档，运行早了则会重复条目。相反，为每个来源给智能体一个书签。在每次运行结束时，智能体将它从每个来源读取到的最新条目的时间戳写入一个文件 `bookmarks.json`，每个来源一个条目：`"slack": "2026-09-14T13:02:11Z"`。

下一次运行从这些书签开始，因此其窗口会伸缩以覆盖自上次运行以来的所有内容。书签存放在名为 `state` 的[记忆存储](https://platform.claude.com/docs/en/managed-agents/memory)中：这是一个文本文件文件夹，平台会将其挂载到每次运行的沙箱中的 `/mnt/memory/` 下，并在运行之间保留。智能体使用其普通的文件工具读写它，`agent.md` 中的指令告诉它如何操作。

### 不要把读取失败误认为平静的一天

如果 MCP 服务器宕机或其 token 已过期，运行仍会启动，只是没有该服务器的工具。[会话会记录一个错误](https://claude.com/resources/articles/agent-observability-on-the-claude-platform)，但智能体从该来源看不到任何内容，并报告“没有新内容”。

`agent.md` 中的三条规则有助于解决这个问题。当某个来源失败时，智能体将：保持该来源的书签不变，用其他来源撰写简报，并在简报末尾用一行说明它无法读取的内容（“本次运行无法获取拉取请求”），以便让读者知晓。

## 目标

我们的模板发布到一个 Slack 频道，每次运行时发布一条带日期的帖子。

![架构图中高亮显示目标。在检查今天的简报尚未发布后，智能体发布到一个目标，该目标将简报传递给读者。](https://claude.dev/media/15481dc4dff01b4a613e8ff36039bc14036ab97781eddeaf749746533b97bd16.png)

智能体使用其沙箱中的 bash 工具发布到 Slack，使用与读取时相同的 bot token。

发布无需任何审批。智能体通过 bash 命令发送，内置的 bash 工具默认无需请求批准即可运行。`slack.com` 也在智能体[环境](https://platform.claude.com/docs/en/managed-agents/environments)（其运行的沙箱）的允许列表中。发布只需一个请求：

CODEShell

curl -s https://slack.com/api/chat.postMessage \\
  -H "Authorization: Bearer $SLACK\_BOT\_TOKEN" \\
  -H "Content-Type: application/json; charset=utf-8" \\
  -d '{"channel": "C0123456789", "text": "Daily brief, Tue Sep 15 ..."}'

### 在记录之前确认帖子已送达

一旦帖子得到确认，智能体就会更新其已报告条目的台账和书签。如果这些记录与实际发布的内容不符，可能会出两种问题。如果智能体记录了一条从未送达的帖子，书签会继续前进，那些条目就永远不会被报告。如果它因为不确定第一条帖子是否送达而再次发布，读者会收到两次相同的简报。

`agent.md` 中的三条规则可以防止这种情况。首先，智能体在频道的最近消息中查找今天的标题，如果该期已经存在就不发布。其次，只有当 Slack 返回 `"ok": true` 和消息 ts 时，帖子才算已发送。第三，智能体只有在确认之后才更新台账和书签。如果结果不明确，它会将本次运行标记为“可能已发布”，并且不做其他任何更改，这样就不会丢失任何内容。

智能体在其记忆存储中保留运行记录（`runs/<date>.md`）。它在发布前将运行标记为“发布中”，然后标记为“已发布”并附上消息 ID，或者标记为“可能已发布”。

## 智能体

在 Claude Managed Agents 中，[智能体](https://platform.claude.com/docs/en/managed-agents/agent-setup)是一个带版本的配置：一个模型、一个系统提示词和工具。每次运行都遵循其运行步骤并停止。

![架构图中高亮显示智能体：一个模型加上一个包含运行循环和判断规则的提示词。](https://claude.dev/media/8b00d803c6eee8a1c6419c15961f688cba2f6fbff5031e1bd0539725cba1780b.png)

在我们的参考实现中，智能体配置是 `agent.md`：

CODEMarkdown

\---
name: Daily brief
model: claude-sonnet-5-5
mcp\_servers:
  - type: url
    name: github
    url: https://api.githubcopilot.com/mcp/
tools:
  - type: agent\_toolset\_20260401
    configs:
      - name: web\_search
        enabled: false
      - name: web\_fetch
        enabled: false
  - type: mcp\_toolset
    mcp\_server\_name: github
    default\_config:
      permission\_policy:
        type: always\_allow
---
\[Eight numbered run steps; the full text is in agent.md in the repo.\]

frontmatter 提供智能体名称、模型、工具和 MCP 服务器。正文提供智能体指令。MCP 工具默认请求批准，而现场没有人来批准，因此 GitHub 工具集设置为 `always_allow`，GitHub token 为 `read-only`。

### 保持简报简短

`agent.md` 引导 Claude 保持简洁：

CODEText

4\. Decide. An item earns a line when the reader would act on it today, or it changes a decision they are about to make. When unsure, leave it out. Most days that is a few items, sometimes none. A count ("12 open reviews") is not an item; link the ones that are blocked. An item already in the ledger and still open is carried as one marked line ("still waiting, day 3"), not re-reported; a closed item is dropped without comment. Do not bring back a topic the preferences file has retired.

### 在发布前重新检查所有仍未关闭的事项

条目在智能体读取来源和发布之间可能发生变化。就在发布之前，`agent.md` 指示智能体重新检查每个条目的实时状态：

CODEText

5\. Verify. The world moved while you read. For every item you will report, re-check its live source just before posting: resolved since you read it, drop it; still open but changed, fix the line; cannot confirm, drop it and list it in the run record's cuts. One stale "still waiting on you" costs more trust than ten missing items, so never hedge an item's status: assert it or drop it. Every link is copied from the source's own link field (a pull request's html\_url, a Slack permalink), never assembled by hand.

## 计划

使用 [Claude Managed Agents](https://claude.com/platform/claude-managed-agents) 时，智能体只是一个配置文件；[部署](https://platform.claude.com/docs/en/managed-agents/scheduled-deployments)负责运行它。部署指定智能体、环境以及每次运行的第一条消息。它还包含计划、vault、记忆存储和预算。每次计划触发时，平台都会启动一个新的智能体[会话](https://platform.claude.com/docs/en/managed-agents/sessions)。

![架构图中高亮显示计划：一个定时部署，在每次运行时唤醒智能体。](https://claude.dev/media/a206f78f34b18dcf7a51bc9bca1acaaf3b68df80ee4034ff521cfbf353af7bc5.png)

在我们的模板中，部署记录在 `deployment.md` 中，第一条消息作为其正文：

CODEMarkdown

\---
name: Daily brief
agent: ./agent.md
environment\_id: ./environment.yaml
schedule:
  type: cron
  expression: "32 7 \* \* 1-5"
  timezone: America/New\_York
vault\_ids: \[vlt\_...\]   # the vault you create under Sources
resources:
  - path: ./memory\_store\_preferences.yaml
    access: read\_only
    instructions: The reader's preferences. Re-read them every run. Never write here.
  - path: ./memory\_store\_state.yaml
    access: read\_write
    instructions: Your state. Bookmarks, ledger, notes, proposals, and run records.
---

Write today's brief.
The reader's time zone is America/New\_York. Work out every date in that zone.

Follow your run steps in order. Today's edition is titled "Daily brief, <weekday\> <month\> <day\>".

这会创建部署，其中包含智能体、环境以及按路径指定的记忆存储。

CODEShell

ant apply deployment.md

如需在不等待计划的情况下测试，可使用 `ant beta:deployments run --deployment-id <id>` 手动启动一次运行，ID 来自 `claude-lock.json`。

### 在你的时区中计算日期

一个常见的 bug 是智能体将今天早上称为“昨天”，因为它在服务器的时区中计算日期。在 `deployment.md` 中，`timezone` 字段设置运行触发的时间，正文的第二行告诉智能体使用哪个时区来计算日期。

## 记忆

每次运行都在一个全新的沙箱中启动，对上一次运行没有任何记忆。没有记忆，反馈就无法留存。然而，过时的记忆可能会让智能体困惑：它会把一个已解决的条目报告为仍在等待，或者因为“已经报告过”而丢弃一个仍然未关闭的条目。

![架构图中高亮显示记忆。状态是智能体读写的内容，偏好是读者写入而智能体只读的内容。](https://claude.dev/media/30e51eab0381bb583fe355fe412162b4e8868643b8d58b2c76c4aa2d0eafea57.png)

我们的模板保留两个[记忆存储](https://platform.claude.com/docs/en/managed-agents/memory)，即挂载在 /mnt/memory/ 下的文件夹（参见来源）：

-   **preferences**（你的，智能体只读）：要读取哪些频道和仓库、要排除什么、长度上限、目标位置以及何时停止。

-   **state**（智能体的，读写）：书签、已报告内容的台账、每次运行一条记录、它提议对你偏好所做的更改，以及关于每个来源行为的笔记（“只返回最新的 50 个条目”）。

`ant apply deployment.md` 会创建 preferences 存储，但不会创建其中的文件。在第一次运行之前，使用仓库中的 `scripts/seed-preferences.sh` 将你的 preferences.md 写入其中。

### 在每次运行开始时重新读取你的偏好

一个常见问题是将偏好的副本固化到提示词中，这会持续应用你已经更改过的规则。让智能体在每次运行时重新读取文件。如果它无法读取该文件，它应该停止并说明情况，而不是按默认值运行。

### 保留已报告内容的台账，并报告变化

智能体保留一个台账 `ledger.md`，记录它已报告的每个条目，这样简报就不会重复。每一行记录该条目被报告的时间、来源、一个不会变化的 ID（Slack 消息时间戳或拉取请求编号）以及其最后已知状态：

CODEText

2026-09-09 slack:C0123456789 1788963600.000100 refund thread: customer waiting on a decision
2026-09-11 github 481 review blocked, day 2 (still waiting)
2026-09-11 slack:C0234567891 1789117333.000300 enterprise escalation: owner named, in progress

## 护栏

由于我们的自动化按计划在“后台”运行，我们对智能体能做什么以及能花多少设置了限制。

![架构图中高亮显示护栏：围绕智能体的边界，对轮次、时间和支出设置上限，并有一个有人关注的心跳。](https://claude.dev/media/746533f20f4e2bf093d08a04f368a8c5eca739de6579c384e9742b86d5385f50.png)

### 对它能做什么的限制

智能体会读取其他人写的消息和 issue，这些文本可能被解释为指令。限制智能体在遵循这些指令时可能造成的后果。在我们的示例中，GitHub token 和 `preferences` 存储是只读的，环境只能访问其允许列表中的主机。植入的指令仍然可以改变简报的内容，包括通过智能体在运行之间保留的笔记。但它无法写入 GitHub 或编辑你的规则。

Slack 是例外：同一个 token 既读取又发布，因此只在你需要它读取或发布的地方邀请该 bot。

### 根据真实运行设置支出上限

支出上限可以保护你免受失控成本的影响。从正常运行成本的三到五倍开始，然后根据真实数据逐步收紧。达到上限的运行会暂停而不是失败，因此上限设置过低看起来就像简报突然安静了。上限是 `deployment.md` 中的 [`budget`](https://platform.claude.com/docs/en/managed-agents/budgets)。每次运行都会获得全额，达到上限的运行会以 `budget_reached` 停止原因暂停：

CODEYAML

budget:
  type: limit
  max\_list\_cost:
    amount: "500" \# a string, in cents: "500" is $5.00
    currency: USD

## 开始使用

我们的参考实现归结为六条规则：

-   从书签读取每个来源，而不是固定的时间窗口。
-   将读取失败报告为无法读取，绝不要报告为平静的一天。
-   在发布前重新检查每个条目。
-   只有当 Slack 确认后才将帖子计为已发送，然后更新书签和台账。
-   每次运行都重新读取你的偏好，从智能体无法编辑的存储中读取。
-   在智能体只读取的地方给予只读访问权限，并限制每次运行的支出。

Claude Code 可以引导你完成本文提供的指导。首先，更新：

CODEShell

claude update

然后，使用 claude-api skill：

PROMPT

/claude-api managed-agents-onboard https://claude.dev/blog/building-effective-agent-automations/

claude-api skill 会阅读这篇文章，提出一个设置方案，将文件写入你项目中的 agents/ 文件夹，并使用 ant apply 创建资源。请将其视为起点，并根据你的来源、目标或记忆偏好自定义智能体。
