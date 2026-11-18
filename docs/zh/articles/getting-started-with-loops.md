---
title: "循环工程：循环入门"
source_url: "https://claude.com/resources/articles/getting-started-with-loops"
publisher: "claude.com"
type: "blogPost"
date: "2026-06-30"
products: ["Claude Code"]
read_time: 2
excerpt: "了解 Claude Code 团队如何定义智能体循环，并获得从基于轮次到基于目标、基于时间以及主动式循环的实用指导——以及何时使用每种循环。"
fetched_at: "2026-11-18"
---

# 循环工程：循环入门
## 循环入门

现在有很多关于循环工程、或者说"设计循环"而非直接提示编码智能体的讨论。如果你花些时间在 X 上试图弄清楚循环到底是什么，你会看到多种不同的答案。

在 Claude Code 团队，我们将**循环定义为智能体重复执行工作周期，直到满足停止条件**。我们根据以下几点对几种不同类型的循环进行分类：

-   它们如何被触发
-   它们如何停止
-   使用了哪种 Claude Code 原语
-   每种循环最适合什么类型的任务。

我们将介绍主要的循环类型、何时使用每种类型，以及如何在管理 token 用量的同时保持代码质量。并非所有任务都需要复杂的循环；从最简单的方案开始，有选择地使用这些模式。

## **基于轮次的循环**

![Di](https://assets.claude.com/84b1736ddd601209f65849c09d999d15bb4ccb96.png)

-   **触发方式**：用户提示词。
-   **停止条件**：Claude 判断已完成任务或需要更多上下文。
-   **最适合**：不属于常规流程或计划的较短任务。
-   **用量管理方式**：编写具体的提示词，并使用 Skills（技能）改进验证，以减少轮次。**‍**

你发送的每个提示词都会启动一个手动循环，由你指导每一轮。Claude 收集上下文、采取行动、检查其工作、必要时重复，然后响应。我们称之为智能体循环。

例如，让 Claude 创建一个点赞按钮。它读取你的代码、进行编辑、运行测试，然后交回它*认为*可用的东西。接着你手动检查工作，并编写下一个提示词。

你可以通过将手动步骤编码为 SKILL.md 来改进验证步骤，让 Claude 能够端到端地检查更多自己的工作。（关于在此类自动化中如何在 Skills、钩子（hooks）和子智能体之间选择，请参阅我们的[引导 Claude Code](https://claude.com/resources/articles/steering-claude-code-skills-hooks-rules-subagents-and-more)指南。）

这应包括工具或 Connectors，让 Claude 能够*看到*、*测量*或*交互*结果。检查越量化，Claude 就越容易自我验证。

例如，在你的 SKILL.md 文件中，你可以指定：

```
---
name: verify-frontend-change
description: Verify any UI change end-to-end before declaring it done.
---

# Verifying frontend changes
Never report a UI change as complete based on a successful edit alone. Verify it the way a human reviewer would:

1. Start the dev server and open the edited page in the browser.

2. Interact with the change directly. For a new control (button, input, toggle): click it, confirm the expected state change, and screenshot before/after.

3. Check the browser console: zero new errors or warnings.

4. Use the Chrome Devtools MCP, run a performance trace and audit Core Web Vitals.

If any step fails, fix the issue and rerun from step 1 — do not hand back partially verified work.
```

## **基于目标的循环（/goal）**



-   **触发方式**：实时手动提示词。
-   **停止条件**：达成目标或达到最大轮次。
-   **最适合**：具有可验证退出标准的任务。
-   **用量管理方式**：设定具体的完成标准和明确的轮次上限，"尝试 5 次后停止"。

有时，单轮不够，尤其是对于更复杂的任务。智能体在能够迭代时表现更好。你可以通过用 /goal 定义"完成"是什么样子，来延长 Claude 持续迭代的时间。

当你定义成功标准时，Claude 不必自行判断什么是"足够好"而提前结束循环。每次 Claude 尝试停止时，一个评估模型会检查你的条件，并将其送回继续工作，直到达成目标或达到你定义的轮次。

这就是为什么确定性的标准如此有效，例如通过的测试数量或达到某个分数阈值。

例如：

```
/goal get the homepage Lighthouse score to 90 or above, stop after 5 tries.
```

## **基于时间的循环（/loop 和 /schedule）**

-   **触发方式**：指定的时间间隔。
-   **停止条件**：你取消它，或工作完成（PR 合并、队列为空）。
-   **最适合**：重复性工作，或与外部环境/系统交互。
-   **用量管理方式**：设置更长的间隔，或基于事件而非时间做出反应。

有些智能体式工作是重复性的：任务保持不变，只有输入变化。例如，每天早上总结 Slack 消息。其他工作依赖于外部系统，与外部系统交互的一种简单方式是按间隔检查它并对变化做出反应。例如，一个可能收到代码审查或 CI 失败的 PR。

对于这些情况，你可以用 \`/loop\` 触发 Claude 何时运行，它会按间隔重新运行提示词。例如：

```
/loop 5m check my PR, address review comments, and fix failing CI
```

\`/loop\` 在你的计算机上运行，所以如果你关机，它就会停止。你可以通过用 \`/schedule\` 创建例程，将循环移到云端。

## **主动式循环**



-   **触发方式**：事件或计划，无需实时人工参与。
-   **停止条件**：每个任务在达成目标时退出。例程本身会一直运行，直到你将其关闭。
-   **最适合**：定义明确的重复性工作流：缺陷报告、问题分诊、迁移、依赖升级等。
-   **用量管理方式**：将例程路由到更小、更快的模型，并将能力最强的模型用于需要判断的决策。

上述原语，连同其他 Claude Code 功能，如**自动模式**和**动态工作流**（研究预览），可以组合成一个用于长时程工作的循环。

例如，要处理传入的反馈，你可以使用：

1.  **\`/schedule\`**（研究预览）运行一个检查新报告的例程
2.  **\`/goal\`** 定义"完成"是什么样子，并用 **Skills** 记录如何验证
3.  **动态工作流**编排智能体，对每份报告进行分诊、修复并审查修复
4.  **自动模式**让例程无需停下来请求权限即可运行

综合起来，一个提示词可以像这样：

```
/schedule every hour: check #project-feedback for bug reports. /goal: don't stop until every report found this run is triaged, actioned, and responded to. When fixing a bug, use a workflow to explore three solutions in parallel worktrees and have a judge adversarially review them.
```

## **保持代码质量**

循环输出的质量取决于其周围的系统。在设计系统时：

-   **保持代码库本身整洁**：Claude 会遵循你代码库中已有的模式和约定。
-   **给 Claude 一种验证自己工作的方式**：用 [Skills](https://code.claude.com/docs/en/skills) 将对你和你的团队而言"好"的标准编码下来。
-   **让文档易于获取**：框架和库的文档包含最新的最佳实践。
-   **使用第二个智能体进行代码审查**：拥有全新上下文的审查者偏见更少，且不受主智能体推理的影响。你可以使用内置的 \`/code-review\` 技能或面向 GitHub 的 [Code Review](https://code.claude.com/docs/en/code-review)。编写代码的循环需要检查代码的循环——参见[Anthropic 如何保障 AI 原生 SDLC 的安全](https://claude.com/resources/articles/how-anthropic-secures-its-ai-native-software-development-lifecycle)。

当单个结果未达到标准时，不要止步于修复单个问题，尝试将其编码下来，以改进系统，造福所有未来的迭代。

## **管理 token 用量**

为了管理 token 用量，循环应有明确的边界：

-   **为任务选择合适的原语和模型**：较小的任务不需要多个智能体或循环。有些任务可以使用更便宜、更快的模型。
-   **定义明确的成功和停止标准**：具体说明"完成"是什么样子，以便 Claude 能更快（但不会太快）找到解决方案。
-   **在大规模运行前先试点**：动态工作流可以生成数百个智能体。先在较小的工作切片上评估用量。
-   **对确定性工作使用脚本**：运行脚本比推理步骤更便宜。例如，一个 PDF 技能可以附带一个表单填写脚本，让 Claude 每次运行，而不是重新推导代码。
-   **不要比你需要的更频繁地运行例程**：将间隔与你所关注事物的变化频率相匹配
-   **审查用量**：\`/usage\` 命令按 Skills、子智能体和 MCP 细分近期用量，不带参数的 \`/goal\` 显示目前的轮次和 token 用量，\`/workflows\` 显示每个智能体的 token 用量，你可以随时停止一个智能体。

你的[模型和努力程度](https://claude.com/resources/articles/claude-model-and-effort-level-in-claude-code)选择是影响循环成本的最大杠杆之一。

## **入门**

总结如下：

| 循环 | 你交出的部分 | 何时使用 | 使用 |
| --- | --- | --- | --- |
| 基于轮次 | 检查 | 你在探索或做决定 | 自定义验证 Skills |
| 基于目标 | 停止条件 | 你知道"完成"是什么样子 | /goal |
| 基于时间 | 触发器 | 工作按计划在你的项目之外发生 | /loop、/schedule |
| 主动式 | 提示词 | 工作是重复性的且定义明确 | 以上所有，以及动态工作流 |

要开始使用循环，看看你已经在做的工作。选择一个你是瓶颈的任务，问问自己可以交出哪一部分：你能编写验证检查吗？目标足够清晰吗？工作是否按计划到来？

一旦有了想法，运行循环，观察结果，比如它在哪里停滞或过度延伸，不要害怕迭代。

更多信息，请阅读 Claude Code 文档中关于[并行运行智能体](https://code.claude.com/docs/en/agents)的内容，以及 [loop](https://code.claude.com/docs/en/goal)、[schedule](https://code.claude.com/docs/en/routines)、[goal](https://code.claude.com/docs/en/goal) 和[动态工作流](https://code.claude.com/docs/en/workflows#orchestrate-subagents-at-scale-with-dynamic-workflows)页面。要让你的检查在多个会话之间可重复，请参阅[使用 Skills 在 Claude Code 中构建验证循环](https://claude.com/resources/articles/building-verification-loops-in-claude-code-with-skills)。

_本文由 Delba de Oliveira 和 Michael Segner 撰写_
