---
title: "使用 Claude Code：花好你的 effort"
source_url: "https://claude.dev/blog/spending-your-effort/"
publisher: "claude.dev"
type: "blogPost"
date: "2026-09-25"
products: ["Claude Code"]
read_time: null
excerpt: "effort 究竟是什么，以及在 Claude Code 中何时该用哪一档——来自我对三个构建版本的亲身测试，以及对 Opus 5.5 和 Fable 5.1 上 Terminal-Bench 3.0 的深入分析。"
fetched_at: "2026-11-18"
---

# 使用 Claude Code：花好你的 effort

我们最新的 Claude 模型最出色的地方之一，是它们能响应 effort，而不会在 Claude Code 中[破坏提示词缓存](https://claude.dev/blog/lessons-from-building-claude-code-prompt-caching-is-everything/)，但我从用户那里收到了很多关于这方面的问题。[effort 究竟是什么](https://claude.com/blog/claude-model-and-effort-level-in-claude-code)，什么时候该用哪一档 effort？我们为什么需要 effort？

为了回答这个问题，我决定深入研究评估（eval），并在日常工作中亲自测试不同 effort 档位的表现。

总的来说，我发现 effort 是一种很好的方式，用来调节 Claude 做多少验证和边界情况测试，以及动用多少它自己的判断。在验证和边界情况测试更有价值的领域，比如硬件、代码审查和安全，额外的 effort 能带来更好的结果。

对于常规软件工程，我采用的循环是：让模型先采访我，然后在低 effort 下实现，审查它构建出的东西，最后在高 effort 下运行验证。

## EFFORT 是什么？

从高层来看，effort 让模型大致了解你希望它在任务上花多少算力。它多少与你对任务难度的判断相关。

可以这样想：如果有人让你在连续 12 小时内完成某件事，你可能会认为他们只是想让你去做，并且非常努力地去做。如果有人让你在 1 小时内完成同样的任务，你会尽量给他们一个满足任务要求的最佳版本，然后预期在此基础上迭代。

或者，你可能会反驳说，这个任务至少需要 3 小时，然后花 3 小时交付它。

你应该以同样的方式理解 effort。Claude 总是会尽量合理地完成你的任务，但更高的 effort 意味着 Claude 会在判断和验证上采取更多独立行动。

## EFFORT 曲线

Fable 5.1 和 Opus 5.5 的 effort 曲线是我们目前最好的：在每一档，基准测试分数和消耗的 token 都有提升。

Terminal-Bench 3.0

按 effort 设置划分的通过率与 token 消耗关系

**图 A** Terminal-Bench 3.0，每个模型使用相同的 70 个任务（4 个 GPU 任务被排除在外）。Opus 5.5 大约在三周后运行，响应上限为 128k token，且无法访问 GitHub 或 PyPI；Opus 5 的最高点是其 effort-120 运行。

但这在实践中意味着什么？为了评估这一点，我在不同 effort 档位下尝试了几个任务，并仔细研究了基准测试。

## 带着 EFFORT 构建

理解模型工作方式的最好方法就是做实验。我在 Opus 5.5 上以几个不同的 effort 档位做同样的任务，以了解它会做哪些工作。我在各种各样的工作上做了这件事，但这里用几个玩具示例来说明。

### 规格不明确的构建任务

如果我让 Claude“构建一个个人健身和锻炼追踪应用”，effort 会极大地改变应用的完善程度，但也会导致 Claude 在过程中做出更多选择。在低 effort 下，健身应用只是一个日志和一个简单的图表。在更高的 effort 档位下，应用更复杂，细节更多。在最高 effort 下，还会有一张热力图。

如果我想要一个简单的起点来迭代，低 effort 就能做到。最高 effort 则适用于我想要 Claude 最好的一次性成果。

### 规格较简略的设计任务

如果我有一个已经相当明确的任务，但我想让 Claude 做一些探索呢？举个例子，我试着让它重新设计 [Claude Code](https://claude.com/product/claude-code) 中的 `/config` 菜单。每一轮的想法大致相同：使用子菜单和更好的搜索。

在低 effort 下（耗时 1 分钟），我得到了一个交互式草图，传达了想法，但看起来不太像 Claude Code。

在最高 effort 下（耗时 28 分钟），我得到了一个看起来非常像 Claude Code 的模型稿，以及一系列不同流程的演示。

如果我的目标是迭代并给出反馈，低 effort 会快得多。但最高 effort 能立刻给我一个精致得多的东西。对于这个特定任务，我认为我更喜欢用低 effort 来理解 Claude 的构想。

### 规格高度明确的构建任务

如果我给 Claude 很多细节呢？我试着让 Claude 就健身应用对我进行深入采访，然后把这份规格交给不同模型在不同 effort 档位下实现。

我发现，给定这份规格后，模型的表现相似得多。我得到的设计看起来相当相似，实现也类似，但细节不同；在最高 effort 下，Claude 花了一些时间简化了其中一些细节。

### 要点

对于常规软件工程，尤其是新功能开发，effort 档位很大程度上取决于我想在多大程度上参与其中。低 effort 让 Claude 快速给出一个起点，更高的 effort 档位会完成更多工作，但 Claude 也会替我做出更多假设。

我一直在使用的一个特别有效的功能开发循环是：

-   给 Claude 一份规格，让它就我遗漏的任何细节采访我
-   在低 effort 下实现
-   审查以确保它正确把握了要点，按需在低 effort 下迭代
-   在高 effort 下验证和测试

## EFFORT 档位如何影响困难任务的输出

但这些显然是玩具示例，Claude 完全有能力完成它们。那么当区别在于 Claude 能否完成任务时呢？

要找到这些困难的问题，你必须去看基准测试，所以我深入研究了一个我喜欢的：Terminal-Bench 3.0，一个社区来源的基准测试。

Terminal-Bench 3.0 的问题大致可以分为安全、硬件、ML、科学、软件、运维和媒体等类别。你可以在这里看到所有问题：[https://github.com/harbor-framework/terminal-bench/releases/tag/v3.0.0](https://github.com/harbor-framework/terminal-bench/releases/tag/v3.0.0)。它们来自社区，所以任何人都可以贡献。

值得一读，以了解这些模型面临的问题类型。我发现自己对其中许多任务的范围和雄心感到惊讶。它们比我通常面对的任务复杂得多。

例如，其中一些任务包括：

-   **硬件**（`retro-console-soc`）：用 Verilog 构建一个 8 位游戏主机，能装进一块小型 FPGA 并渲染测试 ROM。
-   **科学**（`takens-embedding-lean`）：在 Lean 4 中形式化证明 Takens 嵌入定理。
-   **ML**（`mp-checkpoint-consolidation`）：将混合专家检查点的 16 个分片合并为一个文件，使其能复现参考 logits。
-   **运维**（`intrastat-meldung`）：端到端地完成一家公司的月末欧盟贸易统计申报。
-   **媒体**（`layout-config-recreation`）：将一张海报图像重建为可编辑的布局文件。

### 当存在许多边界情况时，更高的 effort 档位有帮助

我阅读 Terminal-Bench 3.0 结果的主要收获是：**对于有大量隐藏边界情况的任务，更高的 effort 效果最好。**

一个清晰的例子是 `html-js-filter`，这是一个 Terminal-Bench 3.0 任务，要求实现一个 HTML 净化器，能剥离所有将 JavaScript 偷运进页面的方式。Fable 5.1 从低 effort 的 1/5 提升到 xhigh 的 5/5。¹

低 effort 的典型尝试大约需要 2 分钟。这些尝试中的每一个都大致一遍就写出了过滤器，然后针对一个手写页面进行了测试。

高 effort 的运行大约在 33 分钟内完成。在我追踪的那次运行中，它对自己的初稿进行了对抗性审查，然后阅读了已安装解析器的源代码以检查 bug，运行了许多干净的测试用例，直到它们给出的输出与输入相同，运行了标准的 XSS 测试套件，最后编写了一个随机文档模糊测试器。

对于像 HTML 净化器这样边界情况繁多的东西，这种额外的 effort 非常值得。[为彻底性花费更多 token](https://claude.dev/blog/what-a-task-costs-on-opus-5-5/)对于具有高生产要求的复杂任务（如性能优化或安全审查）也是合理的。

但你不需要为每个任务都付出这种程度的 effort。

下图显示了所有 Terminal-Bench 3.0 结果及其失败方式，涵盖不同模型和 effort 档位。总体而言，提高 effort 往往会减少因遗漏边界情况（紫色块）导致的失败，但无法修复模型方法错误（蓝色块）的情况。

Effort

Fable 5.1 低 effort：140 通过，2 在我机器上能跑，7 过拟合示例，10 接近但不精确，40 其测试遗漏的 bug，45 误读需求，31 错误或不完整的修复，32 搞错领域规则，25 选错解读，38 其他失败，共 370 次尝试。

Fable 5.1 最高 effort：214 通过，1 在我机器上能跑，3 过拟合示例，6 接近但不精确，14 其测试遗漏的 bug，26 误读需求，10 错误或不完整的修复，24 搞错领域规则，47 选错解读，25 其他失败，共 370 次尝试。

**图 B** 每个方块是一次尝试。失败类型来自模型评判，是近似值。

### effort 有帮助的问题领域

在 Terminal-Bench 3.0 上评估这些模型时，对我来说最有趣的收获之一是，有些问题领域比其他领域从 effort 中获益更多。你可以在下图中看到细分：

Fable 5.1，低 effort → 最高 effort 的通过率：

安全 64% → 87%，硬件 34% → 75%，ML 54% → 73%，科学 41% → 61%，软件 43% → 56%，媒体 18% → 30%，运维 12% → 22%

。

**图 C** 通过率。低 effort 汇总每个模型最低的两档设置，最高 effort 汇总最高的三档，因为类别较小。

为了说明这一点，我从 Terminal-Bench 3.0 的不同领域挑选了几个问题，Opus 5.5 在低 effort 下失败但在高 effort 下成功——主要因为它测试并考虑了边界情况：

**`mvcc-lsm-compaction`**：一个 Terminal-Bench 3.0 任务，要求根据崩溃报告修复存储引擎的 bug，同时不破坏 compaction。Opus 5.5 从低 effort 的 0/5 提升到 xhigh 的 4/5。

在低 effort 下（每次尝试约一分钟），Claude 会在构建或运行复现器之前就编辑代码，并且没有检查它的新测试是否能捕获原始 bug。

在 xhigh 下（约 11 分钟），Claude 先复现了崩溃，针对一个从不执行 compaction 的参考实现编写了随机测试，并检查了它的测试在半成品修复上会失败。

**`cli-2ph-simplex`**：一个 Terminal-Bench 3.0 任务，要求用 Python 编写一个 CLI 线性规划求解器。Opus 5.5 从低 effort 的 0/5 提升到高 effort 的 5/5。

低 effort 的尝试一遍就写出了求解器，用几个小问题检查了一下，在大约 10k token 时停止。在最后的消息中，Claude 警告说它在大问题上可能很慢，但没有检查。

在高 effort 的尝试中，Claude 针对一个单独的暴力求解器在随机问题上测试其求解器，然后对更大的问题进行计时，遇到了运行时间过长或崩溃的情况，并重新设计了它的搜索。

**`gsea-proteomics`**：一个 Terminal-Bench 3.0 任务，要求对蛋白质组学数据进行基因集富集分析（GSEA），以找出八种处理中哪些类似于目标组织。Opus 5.5 从低 effort 的 0/5 提升到高 effort 的 4/5。

在低 effort 下，Claude 选择了一种听起来合理的数据准备方式，用那种方式运行了分析，并报告了结果。

在高 effort 下，Claude 尝试了两种数据准备方式，注意到显著处理的列表发生了变化，并在选择正确方式之前深入探究了原因。

如果用户在循环中，Claude 可能会询问用户如何设置问题，但在没有用户参与的情况下，高 effort 表现更好。

### 何时在 Claude Code 中使用不同的 effort 档位

以下是我关于何时使用哪一档 effort 的经验法则：

-   **低**：当我想要快速响应并保持参与时，例如头脑风暴、草图、简单更改
-   **中**：用于我大部分的常规软件工程工作，例如新功能实现。
-   **高**：用于验证很重要或存在边界情况的工作，例如在遗留代码库中修复 bug。
-   **最高**：当我希望 Claude 完全自主地解决困难问题时，例如端到端构建和验证一个应用，在关键软件中寻找安全漏洞。

根据你的任务，甚至可以在对话中途使用 Claude Code 中的 `/effort` 来改变 Opus 5.5 和 Fable 5.1 的 effort，并告诉我这是否符合你的直觉。

_¹ 关于数字的说明：这些来自我们自己的内部运行，每个任务 5 次尝试，Fable 5.1 关闭了我们的生产安全干预；在 Claude 产品中，Fable 5.1 的防护措施会将一些安全请求交给 Opus。安全任务也在没有互联网访问的情况下运行，因此这里的每任务计数不会与公开排行榜或发布文章一致。示例来自单次运行，有些是在中间 effort 设置下。_
