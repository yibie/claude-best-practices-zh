---
title: "在 Claude 和 Claude Code 中充分发挥 Opus 5.5 的能力"
source_url: "https://claude.dev/blog/getting-the-most-out-of-opus-5-5/"
publisher: "claude.dev"
type: "blogPost"
date: "2026-09-22"
products: ["Claude Code","Claude apps"]
read_time: null
excerpt: "如何在 Claude 应用和 Claude Code 中为 Opus 5.5 编写提示词、引导长时程运行，并检查结果。"
fetched_at: "2026-11-18"
---

# 在 Claude 和 Claude Code 中充分发挥 Opus 5.5 的能力
Opus 5.5 与你现有的 Claude 使用方式配合得很好。不过有几处行为有所不同：它能更长时间自主工作，会直白地告诉你它做了什么，并且在每次回复前都会先思考。本指南介绍如何在 Claude 应用和 [Claude Code](https://claude.com/product/claude-code) 中与 Opus 5.5 协作，包括如何为模型编写提示词、引导长时程运行，以及检查结果。

## 先试试这些

**在首次使用 Opus 5.5 的会话中值得尝试的三件事**

1.  把整个任务交出去。说明“完成”是什么样子，以及你希望它在何时停下来询问。然后让它自己工作。
2.  删掉“仔细思考”之类的句子。Opus 5.5 在每次回复前已经会先思考。
3.  长时程运行结束时，先读它需要你做什么。

## 1\. 如何提问

### 说明“完成”是什么样子，然后让它运行

**做法。** 在一条消息里给出整个任务。指明终点，比如“测试通过”或“每个端点都已迁移”。然后让它自己跑。

**为什么在 Opus 5.5 上重要。** Opus 5.5 在长时间、多部分的工作上比 Opus 5 更能持续下去。与之前的 Opus 模型相比，它最大的提升在于多步骤工作，比如在大型仓库中贯彻一项改动直到测试通过。早期测试者让它长时间运行编码任务达数小时，几乎无需监督。有了清晰的终点，它就知道何时算完成。

**怎么做。** 例如在 Claude Code 中：

PROMPT

```text
Migrate the payment endpoints from the old client to the new one.
Done means: every endpoint uses the new client, the old client is deleted, and the test suite passes.
Stop and ask me only if a test fails for a reason you can't explain.
```

![示例提示词被分成三个带标签的方框：整个任务（把支付端点从旧客户端迁移到新客户端）、终点（高亮显示：每个端点都使用新客户端，旧客户端被删除，测试套件通过），以及何时停止（仅当测试因你无法解释的原因失败时）。页脚：“在一条消息里给出整个任务。指明终点。然后别去打扰它。”](https://claude.dev/media/88d75704ac7ad2bde70a2a5cb1fd5c1800228810397be996b1dbfd91b61a047e.png)

**图 A**一条消息：整个任务、终点，以及何时停止。

### 别再让它“努力思考”

**做法。** 从你的提示词和已保存的指令中删掉“仔细思考”“一步一步思考”以及类似的句子。

**为什么在 Opus 5.5 上重要。** Opus 5.5 在回复前总会先思考，并由它自己决定思考多少。你不需要要求它思考。我们在某聊天产品中的测试显示，删掉“仔细思考”这句话后，回复开始得更快，质量没有明显下降。

**怎么做。** 删掉这句话。对于简单问题想要快速回答，就直接说明：“直接回答。”要在 Claude Code 中改变它的思考量，请[更改 effort 设置](https://claude.dev/blog/spending-your-effort/)。

### 向正在运行的任务追加内容

**做法。** 如果你在运行中途想起了什么，可以在它工作时输入一条后续消息。

**为什么在 Opus 5.5 上重要。** 现在的运行轮次更长，因此重新开始代价更大。

**怎么做。** 在 Claude Code 中，在 Claude 工作时输入消息并按回车键，例如：“Also keep the old endpoint names as aliases.”

### 对于设计工作，点名你不想要的风格

**做法。** 当你要求一个页面、一个应用或一个 Artifact 时，列出你希望排除的设计习惯。

**为什么在 Opus 5.5 上重要。** 没有设计方向时，Opus 5.5 会退回到几种默认风格。“避免千篇一律的外观”这类笼统指令大多只是用一种默认替换另一种默认。列出具体模式效果要好得多。

**怎么做。** 点名这些模式：

PROMPT

```text
Build a personal website with placeholder content.
Don't use a cream or off-white background, italic accent words in headings, numbered "01 / 02 / 03" section labels, monospace labels, or pill-shaped buttons.
```

然后看看它改用了什么。如果你也不喜欢，就把它加到列表里再问一次。

## 2\. 在 Claude Code 中引导长时程运行

### 告诉它你希望哪些地方停下来

**做法。** 在[你的 CLAUDE.md 文件](https://claude.com/resources/articles/using-claude-md-files)中写一条简短规则，说明何时停下来询问、何时继续推进。

**为什么在 Opus 5.5 上重要。** Opus 5.5 在工作时会持续向你汇报。在长任务中，它有时会停下来汇报而不是继续推进：一份点明下一步却不去执行的总结、一个继续的提议，或一组并不阻塞工作的选项。它会遵循点名这些停顿的指令。你也要点名你想要的停顿。

**怎么做。** 把下面这段加到 CLAUDE.md 中，并根据你的项目调整：

PROMPT

```text
When a step doesn't need my input, keep going. Put status notes in the same message as your next action.
Stop and ask only when you can't continue without me, or before anything destructive: deleting data, force-pushing, or changing anything outside this repository.
```

![一张标题为“告诉它你希望哪些地方停下来”的 CLAUDE.md 卡片，包含两个方框。继续推进：当某一步不需要我的输入时，继续推进，并把状态说明与你的下一步操作放在同一条消息里。停下来询问：仅当你没有我就无法继续时，或在任何破坏性操作之前：删除数据、强制推送，或更改此仓库之外的任何内容。页脚：“根据你的项目调整它。对破坏性命令也要保持权限提示开启。”](https://claude.dev/media/33679878db758a7730f1bb8988328df623e2aca8acec93a4bb6ecba3bc37ee43.png)

**图 B**CLAUDE.md 规则：何时继续推进，何时停下来询问。

如果某次运行以“Want me to continue?”停下，回复“continue”。如果这种情况经常发生，上面的规则会有帮助。

一条继续推进的规则意味着更少的停顿，所以对任何有风险或难以撤销的操作，要保留你自己的检查。上面规则的最后一行就做到了这一点。对破坏性命令也要保持权限提示开启。

对于结对编程，你可能想要相反的：开始前给一行计划，结束时给一段简短回顾。那就改为在 CLAUDE.md 中这样写。Opus 5.5 两种都能遵循。

### 让它把大工作拆分给子智能体

**做法。** 对于大型代码库上的审计、迁移或审查，让 Opus 5.5 [把工作拆分给子智能体](https://claude.dev/blog/a-harness-for-every-task-dynamic-workflows-in-claude-code/)并检查每个结果。

**为什么在 Opus 5.5 上重要。** 早期测试者让 Opus 5.5 在长时间审计和迁移中协调并行子智能体，几乎无需监督。

**怎么做。**

PROMPT

```text
Audit every service in services/ for the retry bug in the linked issue.
Give each service to its own subagent. When a subagent reports back, check its evidence before you accept it.
Finish with one table: service, affected yes or no, and the evidence.
```

![标题为“把每个服务交给各自的子智能体”的示意图。提示词“Audit every service in services/ for the retry bug in the linked issue”分发给四个子智能体。它们的报告汇入一个“检查其证据”步骤（“当子智能体回报时，在接受之前检查其证据”），然后一个箭头指向“以一张表收尾”，即一张空表，列为 Service、Affected yes or no 和 The evidence。](https://claude.dev/media/96f05d24a6728ed462139b2430e36c897ec36d8777109fb73ce839e6db266427.png)

**图 C**分发给子智能体，检查每个子智能体的证据，然后以一张表收尾。

### 把任务列表保存在文件里

**做法。** 对于耗时较长的运行，让 Opus 5.5 把任务列表保存在一个文件里，并随进展更新。然后读这个文件，而不是翻看滚动记录，来了解运行进行到哪了。

**为什么在 Opus 5.5 上重要。** 现在的运行轮次更长。长时程运行会填满上下文窗口，Claude Code 随后会总结较早的轮次。文件中的列表能经受住这一点，并让你一眼看出哪些已完成、哪些还剩。

**怎么做。**“在 TASKS.md 中维护一份清单。每完成一项就勾掉，并把你发现的任何新事项加进去。”

## 3\. 检查结果

### 先读它需要你做什么

**做法。** 长时程运行结束时，先找 Claude 在等你处理的事项，比如它留给你决定的问题，或它想让你批准的改动。然后再读 Claude 总结的其余部分。

**为什么在 Opus 5.5 上重要。** Opus 5.5 对工作的汇报比 Opus 5 更清晰。它的更新和最终总结会用平实的语言说明它做了什么、发现了什么，以及它需要你做什么。

**怎么做。** 要改变总结的格式，就在 CLAUDE.md 中说明，例如：“每次运行结束时用三个标题收尾：Blocked on me、Changed、Found。”

### 让它审查代码

**做法。** 在人工审查之前，让 Opus 5.5 审查一个 diff 或一个拉取请求（PR）。

**为什么在 Opus 5.5 上重要。** 一位早期测试者说，Opus 5.5 在最低 effort 下发现的 bug 比 Opus 5 在高 effort 下还多，误报也更少。它还会用平实的语言解释自己的改动，因此它的拉取请求描述更容易审查。

**怎么做。** 把这段提示词交给 Claude：

PROMPT

```text
Review the diff on this branch against main.
List only problems you'd block the merge for. For each one, give the file and line, why it's wrong, and how to show it fails.
```

### 让它标出无法确认的内容

**做法。** 对于研究和分析，让它说明哪些内容它找不到或无法核实。

**为什么在 Opus 5.5 上重要。**“我找不到这个”值得一读，而主动要求它标出，就更容易发现这类内容。

**怎么做。** 在请求中加上“标出任何你无法确认的内容，并说明你在哪里找过”。这在 Claude 研究报告和 Claude Code 中都有效。

## 4\. 在 Claude 应用中

首先，确认模型选择器显示的是 Opus 5.5。

**做法。** 附上图表、示意图、截图或幻灯片。不要重新输入数字。

**为什么在 Opus 5.5 上重要。** Opus 5.5 读取图表、示意图和截图比 Opus 5 更准确，而且无需额外步骤。它还更擅长理解依赖图像中位置关系的含义：箭头连接的是哪些方框、示意图的两个版本之间有什么变化，或日历截图中会议何时开始和结束。

**怎么做。** 附上图片并问一个具体问题：“这些服务中哪些直接调用了 billing API？”

### 让它检查一份长文档

**做法。** 给它一份长计划、报告或演示文稿，让它找出错误。

**为什么在 Opus 5.5 上重要。** Opus 5.5 比之前的 Opus 模型更注重细节。在我们的测试中，它在一个很长的规划讨论串中发现了日期落在错误星期几的问题，以及演示文稿中图表与数字不一致的问题。

**怎么做。** 提交提示词：“检查这份演示文稿中任何自相矛盾之处：数字、日期和名称。引用每个问题并说明其位置。”

### 索取成品文件

**做法。** 当你想要电子表格或文档时，索取文件，而不是大纲。

**为什么在 Opus 5.5 上重要。** Opus 5.5 制作的电子表格和文档在分享前需要的编辑比 Opus 5 的更少。

**怎么做。**“把它做成一个我可以分享的电子表格：每个供应商一行，列为成本、合同结束日期和负责人。”

### 在项目中，说明哪些回答已经确定

**做法。** 如果长对话中的后续问题感觉变慢，加一条指令，说明先前的回答已经确定。

**为什么在 Opus 5.5 上重要。** 在长对话中，Opus 5.5 在思考一个简短的后续问题时，有时会回头重看先前的回答。这会拖慢回复。

**怎么做。** 把下面这段加到项目的指令中：

PROMPT

```text
Once you have answered something, treat that answer as done. Focus on what I'm asking now, and don't go back over an earlier answer unless I ask about it or point out a problem with it.
```

在长时间分析类项目中不要加这条，因为后面的步骤可能暴露前面步骤中的错误。

## 5\. 当消息被标记时

Opus 5.5 是首个在发布时即配备 Fable 级生物与网络安全防护的 Opus 模型。在 Claude 应用和 Claude Code 中，大多数被标记的消息会转到较旧的模型，你的工作在那里继续。在源代码中查找安全漏洞是允许的，日常的健康和教育问题也应仍然可以正常处理。这些防护有时会标记合法的工作，我们正在调整它们以减少错误标记。如果你被切换了，以下是你将看到的内容以及该怎么做。

### 在 Claude 应用中

**你会看到什么。** 一条以“Switched to”开头的通知，以及较旧模型的名称。Claude 在该模型上回答，对话会留在该模型上。

**该怎么做。**

-   要回到 Opus 5.5，在模型选择器中选择它。如果先前的消息仍在对话中，它可能再次被标记。开始新对话可以避免这一点。
-   要让它先询问你，请前往“设置”，然后“功能”，关闭“Switch models when a message is flagged”。你会看到一张带选项的“paused”卡片。

这项检查覆盖对话中的所有内容，包括文件和搜索结果。因此标记可能来自较早的内容，而不只是你最后一条消息。

### 在 Claude Code 中

**你会看到什么。** 一条指明较旧模型的通知。会话在该模型上继续。

**该怎么做。**

-   运行 /model 切换回来。
-   按两次 Esc 编辑你最后一条消息并重试。
-   要让它先询问你，运行 /config 并更改“Switch models when a message is flagged”。
-   如果标记有误，运行 /feedback。

### 不要让它把推理过程展示在回复中

**做法。** 从你的提示词和指令中删掉要求在回复中复现其内部推理的请求。

**为什么在 Opus 5.5 上重要。** 要求在回复中复现其内部推理的请求可能会被拒绝。它属于被标记的类别之一。

**怎么做。** 改为向 Claude 索取你需要的内容，例如：“用三句话解释你为什么选择这种方法。”

## 6\. 速度

### 当你需要等待每条回复时，开启 fast mode

**做法。** 在 Claude Code 中，对于来回交互的工作使用 fast mode，即你读完每条回复后再发送下一条消息。

**为什么在 Opus 5.5 上重要。** fast mode 在发布时作为研究预览提供给 Opus 5.5。你得到的是同一个模型，文本到达得更快。它需要开启额外用量，且每 token 的成本高于标准模式。

**怎么做。** 在 Claude 中输入 /fast。

## 你的 Opus 5.5 检查清单

在下一次长任务之前过一遍这份清单。

![检查清单以卡片形式呈现，包含四组复选框项目：Asking、Long runs in Claude Code、Checking 和 Flags。同样的项目以文本形式列在下方。](https://claude.dev/media/70157ea87e7b847039bcb94cd8d1d5c83262cae578fc24bca80b91f7f98dbf56.png)

**图 D**检查清单一览。

**Asking**

-   任务说明了“完成”是什么样子
-   提示词或已保存的指令中没有“think hard”之类的句子
-   设计请求列出了要排除的风格
-   图表和截图是附上的，而不是重新输入的

**Long runs in Claude Code**

-   CLAUDE.md 说明了何时停止、何时继续推进，以及在任何破坏性操作前停止
-   对破坏性命令仍保持权限提示开启
-   大型审计和迁移拆分给子智能体
-   任务列表保存在文件中

**Checking**

-   先读报告中“需要你做什么”的部分
-   在人工审查之前先跑一轮审查
-   研究类回答标出了无法确认的内容

**Flags**

-   你知道如何切换回来：模型选择器，或 /model
-   “Switch models when a message is flagged”已按你的意愿设置

开始用 [Opus 5.5](https://www.anthropic.com/claude-opus-5-5) 构建吧！

_感谢 Molly Vorwerck 审阅。_
