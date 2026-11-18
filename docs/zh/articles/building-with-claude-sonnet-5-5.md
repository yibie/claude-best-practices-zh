---
title: "使用 Claude Sonnet 5.5 构建"
source_url: "https://claude.dev/blog/building-with-claude-sonnet-5-5/"
publisher: "claude.dev"
type: "blogPost"
date: "2026-09-28"
products: ["Claude Platform"]
read_time: null
excerpt: "何时选择 Sonnet 而非 Opus、它的成本是多少，以及如何调优它。"
fetched_at: "2026-11-18"
---

# 使用 Claude Sonnet 5.5 构建
Claude Sonnet 5.5 是继 [Opus 5.5](https://claude.dev/blog/getting-the-most-out-of-opus-5-5/) 之后，Claude 5.5 家族中的第二个模型。它相比 Sonnet 5 是一次明显的升级，更聪明、更高效，速度也快了 30%。每 token 的价格保持不变，而且由于 Sonnet 5.5 完成同样的工作通常需要的 token 少得多，对大多数工作而言成本最多可降低 30%。

![两块分别标着 Claude Sonnet 5 和 Claude Sonnet 5.5 的空白画布被一笔一笔地填满，每块画布下方都有一个不断累加的画笔引擎调用计数，同时每个模型编写的代码绘制出一幅城市天际线的日落鸟瞰图。最后画面定格为并排的四块面板：那张照片，以及 Claude Sonnet 5、Claude Sonnet 5.5 和 Claude Opus 5.5 各自的画作。](https://claude.dev/media/dca9efdc2515061f31f7244c9c4825c7e29f9e8d9b0b0da5e1259a4bca669d3d.jpg)

**图 A** Lance Martin 的代码作画演示：每个模型编写代码，重绘同一张照片。从左到右：照片、Claude Sonnet 5、Claude Sonnet 5.5 和 Claude Opus 5.5。

_感谢 [@jkeatn](https://x.com/jkeatn) 提供代码作画相关的想法，感谢 [@IceSolst](https://x.com/IceSolst) 提供参考图片。_

本指南讲的是如何用这个模型来构建。想试用的话，按原样运行下面这个请求：

CODEPython

import anthropic

client = anthropic.Anthropic()

response = client.messages.create(
    model="claude-sonnet-5-5",
    max\_tokens=4096,
    messages=\[
        {
            "role": "user",
            "content": "Analyze the trade-offs between microservices and monolithic architectures",
        }
    \],
    output\_config={"effort": "medium"},
)

for block in response.content:
    if block.type == "text":
        print(block.text)

这个循环按类型读取每个内容块，因为 Sonnet 5.5 默认会思考，所以响应可能以一个 `thinking` 块开头，而读取 `content[0].text` 的代码会因此出错。

## 在 SONNET 5.5 与 OPUS 5.5 之间选择

在 Claude 5.5 家族中，Opus 5.5 是为需要审慎判断的复杂工作而打造的。对于范围明确的日常任务，比如修复 bug 和快速迭代功能，请使用 Sonnet 5.5。它还能制作精美的文档、幻灯片和电子表格，并且对设计有很强的眼光。它的速度使其非常适合快速迭代。[Claude Haiku 5.5](https://claude.dev/blog/which-claude-model-should-you-build-with/) 将在未来几周加入这个家族，面向高用量、低延迟的工作流。

| 你的工作负载 | 从哪个模型开始 |
| --- | --- |
| 范围明确的日常编码：修复 bug、快速迭代功能、对照需求进行验证 | Sonnet 5.5 |
| 高用量的日常开发 | Sonnet 5.5 |
| 精美的文档、幻灯片和电子表格，例如单页文档、图表、摘要幻灯片、文档编辑和电子表格清理，这类工作设计眼光会有帮助 | Sonnet 5.5 |
| 你反复运行的、定义明确的智能体任务：调查、审查、起草 | Sonnet 5.5 |
| 需要审慎判断的复杂工作，包括长时程智能体式编码和知识工作 | Opus 5.5 |
| 最困难的问题，你需要最强的智能 | Opus 5.5 |

> "在 Epic 的早期测试中，Claude Sonnet 5.5 达到了你对更高层级模型所期待的质量标准，在一次系统设计审计和一次数据流审查中都经受住了考验。这个新模型处理了数万行游戏系统架构代码，保持了响应迅捷，完成了耗时数小时的任务，而且所需的提示指导更少。"（Daniel Vogel，Epic Games 首席运营官）

当任务有明确的规格和验证结果的方法时，Sonnet 5.5 最为合适。正如[提示指南](https://platform.claude.com/docs/en/build-with-claude/prompt-engineering/prompting-claude-sonnet-5-5)所说，"对于最困难的长时程工作，Opus 模型是更好的选择。"

## 定价

| 每百万 token | Sonnet 5.5 | Opus 5.5 |
| --- | --- | --- |
| 输入 | $2 | $4 |
| 输出 | $10 | $20 |
| 缓存写入，5 分钟 | $2.50 | $5 |
| 缓存写入，1 小时 | $4 | $8 |
| 缓存读取 | $0.20 | $0.20 |

Sonnet 5.5 的所有价格，包括批处理和提示词缓存，都与 Sonnet 5 相同，因此更换模型 ID 不会改变你的每 token 账单。仅限美国境内推理（`inference_geo: "us"`）按标准价格的 1.1 倍计费。

虽然每 token 的价格不变，但总账单会变化，因为如前所述，Sonnet 5.5 每个任务通常比 Sonnet 5 使用更少的 token。

请注意，不同产品界面对 Sonnet 可能设有不同的默认 effort，例如 Claude Platform 上为 high，而 [Claude Code](https://claude.com/product/claude-code) 中为 medium。

Sonnet 5.5 使用高分辨率图像档位，长边最高 2576 像素，一张 2000×1500 的图像消耗的 token 约为 Sonnet 4.6、Sonnet 4.5 或 Haiku 4.5 上的 2.5 倍。如果你不需要那样的细节，请在发送前先缩小尺寸。

## 模型详情

| 详情 | Sonnet 5.5 |
| --- | --- |
| **模型 ID** | 在 Claude API、Claude Platform on AWS、Google Cloud 和 Microsoft Foundry 上为 `claude-sonnet-5-5`；在 Amazon Bedrock 上为 `anthropic.claude-sonnet-5-5` |
| **上下文窗口** | 1M token，原生，无需 beta 标头 |
| **最大输出** | 128k token；在 Message Batches API 上配合 `output-300k-2026-03-24` beta 标头最高可达 300k |
| **知识截止日期** | 2026 年 6 月 |
| **思考** | 默认开启（自适应思考）；`between_tools` 会关闭前置思考 |
| **Effort 级别** | `low`、`medium`、`high`、`xhigh`、`max` |
| **默认 effort** | Claude API 上为 `high`；Claude Code 中为 `medium` |
| **分词器** | 与 Sonnet 5 相同 |
| **最小可缓存提示词** | 512 token（Sonnet 5 上为 1,024） |
| **速率限制** | 与 Sonnet 5 分开，默认档位值相同 |
| **Priority Tier** | 在 Claude API 上可用 |
| **数据留存** | 符合条件的客户可使用零数据留存 |

Claude API 默认使用 `high`，让你从强劲的结果起步。从这里开始，做评估，然后选择你的工作负载所需的 effort 级别。如果你忍不住想用 `xhigh` 或 `max` effort，请记住 Sonnet 5.5 会思考更久、花费更多。在某些任务上，你可能会失去 Sonnet 之所以有用的一些特质：它在质量、速度和成本之间的平衡。那种情况下，请考虑 Opus 5.5。

## 从 SONNET 5 迁移

思考默认开启。如果你之前运行 Sonnet 5 时关闭了思考，可以用 `between_tools` 关闭前置思考。下面的第 1 步展示了做法。

把模型 ID 改为 `claude-sonnet-5-5`，然后逐一处理五项破坏性变更和一项响应结构变更。[Sonnet 5.5 迁移指南](https://platform.claude.com/docs/en/models/sonnet-5-5/migration-guide)完整介绍了每一项。

Claude Code 也可以替你完成迁移。运行 `/claude-api migrate this project to claude-sonnet-5-5` 来调用内置的 [Claude API skill](https://platform.claude.com/docs/en/agents-and-tools/agent-skills/claude-api-skill#migrating-to-a-newer-claude-model)，它会在你的代码库中应用模型 ID 替换和破坏性的参数变更。

### 1\. 用 between\_tools 关闭前置思考

在 Sonnet 5.5 上，不带 `thinking` 字段的请求会以自适应思考运行，而 `thinking: {"type": "disabled"}` 会返回 400 错误。请改为发送新的 `between_tools` 设置。使用 `between_tools` 时，思考只发生在工具调用之间，总响应时间相同或更快。

CODEPython

\# Before: Claude Sonnet 5
client.messages.create(
    model="claude-sonnet-5",
    max\_tokens=16000,
    thinking={"type": "disabled"},
    output\_config={"effort": "xhigh"},
    messages=\[{"role": "user", "content": "..."}\],
)

\# After: Claude Sonnet 5.5
client.messages.create(
    model="claude-sonnet-5-5",
    max\_tokens=16000,
    thinking={"type": "between\_tools"},
    output\_config={"effort": "high"},
    messages=\[{"role": "user", "content": "..."}\],
)

这个示例还把 effort 从 `xhigh` 降到了 `high`，因为 `between_tools` 有以下限制：

-   `between_tools` 在 `low`、`medium` 和 `high` effort 下可用。在 `xhigh` 或 `max` 下会返回 400 错误；要在这些级别运行，请使用自适应思考。
-   它不接受其他字段。随它一起发送 `display`、`budget_tokens` 或 `block_binding` 会返回 400 错误。
-   使用 `between_tools` 时，effort 不能在对话中途改变。要逐轮改变 effort，请使用自适应思考。
-   模型在工具调用之间写出的简短进度更新仍会以 `thinking` 块的形式返回，带有摘要文本。请按类型读取内容块，并将这些块连同助手轮次的其他内容原样传回。没有工具时，响应只包含文本。
-   它在所有提供 Sonnet 5.5 的平台上都可用，无需 beta 标头。如果你的 SDK 版本没有定义 `between_tools`，请更新它。

如果你用 `between_tools` 关闭了前置思考，那么对于没有工具、但需要几步推理的请求，请改用自适应思考。

### 2\. 用 auto 加严格工具替换强制 tool\_choice

类型为 `any` 或 `tool` 的 `tool_choice` 会返回 400 错误，在 token 计数端点上也是如此。请发送 `auto`，把工具标记为 `strict: true` 使其输入符合 schema，并在提示词中说明何时使用它：

CODEPython

weather\_tool = {
    "name": "get\_weather",
    "description": "Get the current weather in a given location",
    "input\_schema": {
        "type": "object",
        "properties": {"location": {"type": "string"}},
        "required": \["location"\],
        "additionalProperties": False,
    },
    "strict": True,
}

client.messages.create(
    model="claude-sonnet-5-5",
    max\_tokens=1024,
    tools=\[weather\_tool\],
    tool\_choice={"type": "auto"},  \# was {"type": "tool", "name": "get\_weather"}
    messages=\[
        {"role": "user", "content": "What's the weather in Paris? Use the get\_weather tool."}
    \],
)

严格工具调用要求每个对象上都设置 `additionalProperties: false`。

### 3\. 保持对话只追加

Sonnet 5.5 的思考块与模型和对话绑定。Sonnet 5.5 能读取 Sonnet 5 的思考块，因此从 Sonnet 5 切换到 Sonnet 5.5 的对话会保留其推理。其他模型都无法读取 Sonnet 5.5 的思考块。

### 4\. 将计算机使用迁移到工具集

在 Claude API 和 Google Cloud 上，Sonnet 5.5 仅通过 `{"type": "computer_toolset_20260801"}` 支持计算机使用；声明 `computer_20251124` 的请求会返回 400 错误。请从请求中移除 `anthropic-beta: computer-use-2025-11-24` 标头，并在 SDK 中移除 `betas` 参数，通过标准客户端而非 beta 命名空间调用 Messages API。替换 `tools` 条目，并更新你的智能体循环，以处理成员 `tool_use` 块、批量操作以及结果上的 `toolset_name`。如果你发送了 `fine-grained-tool-streaming-2025-05-14` beta 标头，也请移除它，因为它与工具集条目一起出现时会返回 400 错误；改为在每个需要它的工具上设置 `eager_input_streaming: true`。Amazon Bedrock 仍然接受 `computer_20251124`。

### 5\. 检查你的顾问配对

使用顾问工具时，Sonnet 5.5 执行器会拒绝 Opus 4.8、Opus 4.7 和 Sonnet 5 作为顾问。可接受的顾问包括 Opus 5.5、Opus 5 以及 Sonnet 5.5 自身。来自每个可接受顾问的建议都会以加密形式返回，作为 `advisor_redacted_result` 块，因此你的代码无法读取建议文本。

### 6\. 从思考块读取工具调用之间的文本

这项变更不会导致错误，但 UI 可能不再显示模型在工具调用之间的备注。这些备注如果超过一两句话，会以进度更新 `thinking` 块的形式返回，而在默认 `display` 下它们是空的。

使用自适应思考时，将 `thinking.display` 设为 `"updates"`（beta，需 `thinking-display-updates-2026-08-18` 标头）或 `"summarized"`，并在其后的 `tool_use` 块之前渲染每个非空的 `thinking` 块。使用 `between_tools` 时，文本返回时不带 `display`。

Sonnet 5.5 还新增了逐消息 effort（beta）、对话中途系统消息和对话中途工具变更（beta）。如果你是从 Sonnet 4.6 或更早版本，或从 Haiku 4.5 迁移，[迁移指南](https://platform.claude.com/docs/en/models/sonnet-5-5/migration-guide)为每个起始模型都提供了检查清单。

## 调优

### 重新运行你的 effort 扫描

Effort 级别经过了重新校准，因此某个级别产生的思考量不再与 Sonnet 5 上相同，你原来的设置不会沿用。除非你的工作负载是智能体式的或对延迟敏感，否则从 `high` 开始。对于智能体式编码和多步工具调用，规格明确的任务从 `medium` 开始，更难或更长的任务则转向 `high`。对于聊天和其他对延迟敏感的工作，从 `medium` 或 `low` 开始。只有在你的评估显示质量提升的地方才使用 `xhigh` 或 `max`。

思考会计入 `max_tokens`，所以要留出空间。对于智能体式编码，将 `max_tokens` 设为 128,000，即模型的最大值，并流式返回响应。想减少思考，就降低 effort 级别，因为在系统提示词中要求模型少思考并不能可靠地减少思考。

### 移除 Sonnet 5 的变通做法

现有的 Sonnet 5 提示词应该无需改动就能表现良好。如果你的提示词带有变通做法，例如拒答引导、工具调用重试补丁或"不要偷懒"，请移除它们并重新运行你的评估，然后再调优其他任何东西。

### 在低 effort 下要求真实检查

Sonnet 5.5 通常会在报告变更完成之前检查自己的工作，但在 `low` effort 下，它有时会跳过一项实际检验该变更的检查。如果你看到变更被报告为完成却没有测试或构建输出，提示指南建议使用下面这段系统提示词：

CODEText

When you change code that can be run, built, or type-checked, run a real
check that exercises the change before reporting it done: the project's
tests, type-checker, or build, or the changed command itself. A syntax-only
check, or a check command that failed to start, does not count; if all
that is missing is the project's declared dependencies, install them with
its own package manager and lockfile (e.g. npm install, pip
install -r requirements.txt), never via sudo or the system package manager,
unless told not to. Only if no real check can run here, say which one you
did not run and why instead of reporting the change as done.

### 用 thinking.display 展示进度

不要要求模型在响应中写出它的推理，因为那会招致 `reasoning_extraction` 拒答。改为读取摘要化的思考：

CODEPython

thinking={"type": "adaptive", "display": "summarized"}

如果希望单独展示面向用户的进度备注，请使用 `display: "updates"`（beta）。如果你希望在可预测的节点获得更新，例如在第一次工具调用前给出一行、在结尾给出简短回顾，请在系统提示词中说明。

### 缓存更多提示词

最小可缓存提示词降至 512 token，因此更短的系统提示词和工具定义现在也符合条件。缓存读取的成本是输入价格的十分之一。在请求之间改变顶层 effort 会[使缓存失效](https://claude.dev/blog/lessons-from-building-claude-code-prompt-caching-is-everything/)；要以不同级别运行某一轮，请使用逐消息 effort（beta），它会保留缓存。

## 拒答与回退

在我们的自动化行为审计中，Sonnet 5.5 在大多数对齐与诚实性指标上优于或持平 Sonnet 5。它也是首个具备与我们最强模型类似网络安全防护措施的 Sonnet 模型。大多数常规软件开发不受影响。

被拒答的请求返回 HTTP 200，带有 `stop_reason: "refusal"`，`stop_details` 会指明五个类别之一：`cyber`、`bio`、`frontier_llm`、`reasoning_extraction` 或 `general_harms`。服务端回退（`fallbacks: "default"`，beta，Claude API）会在 Sonnet 5 上重试 `cyber` 和 `frontier_llm` 拒答。它不会重试另外三类。你也可以使用 SDK 中间件或自己的重试逻辑。

对于合法的安全工作，Cyber Verification Program 很快将扩展到包含 Sonnet 5.5。

## 可用性

Claude Sonnet 5.5 即日起在以下平台可用。在开发者平台上，请使用这些模型 ID：

-   Claude API，为 `claude-sonnet-5-5`
-   Amazon Bedrock，为 `anthropic.claude-sonnet-5-5`
-   Claude Platform on AWS，为 `claude-sonnet-5-5`
-   Google Cloud，为 `claude-sonnet-5-5`
-   Microsoft Foundry，为 `claude-sonnet-5-5`，仅限 Global Standard 部署

### 在 Claude Code 中

从 Claude Code v2.1.284（Agent SDK for TypeScript v0.3.284 或更高版本）起，`sonnet` 别名在 Claude API 上解析为 Sonnet 5.5。它默认以 `medium` effort 运行，原生支持 1M 上下文窗口。在 Claude Code 中你无法为 Sonnet 5.5 关闭思考，effort 决定模型思考多少。Sonnet 5.5 没有快速模式。`default` 模型仍是 Opus 5.5，因此对于范围明确的任务，用 `/model sonnet` 切换。

希望你喜欢试用 Sonnet 5.5，一如既往，欢迎分享反馈。
