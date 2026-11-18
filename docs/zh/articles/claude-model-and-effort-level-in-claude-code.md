---
title: "在 Claude Code 中选择 Claude 模型与 effort 级别"
source_url: "https://claude.com/resources/articles/claude-model-and-effort-level-in-claude-code"
publisher: "claude.com"
type: "blogPost"
date: "2026-07-07"
products: ["Claude Code"]
read_time: 3
excerpt: ""
fetched_at: "2026-11-18"
---

# 在 Claude Code 中选择 Claude 模型与 effort 级别
**要点**：

-   选择 Claude 模型即选择一组固定的权重，也就是模型的整体能力范围。虽然可以为模型提供上下文或对其加以引导，但模型的整体知识库与能力是固定的。
-   effort 的含义不止于「思考时间」。它控制 Claude 针对你的请求整体上做多少工作，包括读取的文件数量、使用的工具数量，以及在向你反馈之前会执行多少步骤。
-   常规任务选择较小的模型，更复杂或更模糊的任务选择较大的模型。先从各模型的默认 effort 级别开始，再根据你所做工作的类型调整出一个通用偏好，而不是逐个任务地调整。
-   如果 Claude 已掌握所有相关上下文、明确尝试过，却仍然出错，这就是该选择能力更强模型的信号。如果 Claude 出错是因为漏读文件、没有运行测试，或中途放弃重构，那就选择更高的 effort 级别。

## **Claude Code 的 effort 级别与模型选择**

Claude Code 提供两个看似都能「让答案更好」的设置：模型设置和 effort 级别。你可能会以为，像 Claude Fable 5 这样更大的模型会比 Claude Sonnet 输出更聪明，而更高的 effort 级别意味着 Claude 在回答前思考更久。

第一个假设是准确的。根据行业标准基准测试，我们最大的模型能力更强。

但 effort 的含义不只是「思考时间」。effort 级别控制 Claude 针对你的请求整体上做多少工作。这确实包括模型思考的时长，但也包括：

-   它读取多少个文件；
-   它做多少验证；以及
-   在向你反馈之前，它会把多步骤任务推进到多远。

在更高的 effort 下，Claude 在回到你面前之前会采取更多这类行动（例如读取文件、运行测试、反复核对）。在较低的 effort 下，它更倾向于向你索取更多上下文，而不是花 token 自己去弄清楚。
