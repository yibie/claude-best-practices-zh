---
title: "Claude 模型详解：为你的用例选择最佳模型"
source_url: "https://claude.com/resources/articles/claude-models-explained-choosing-the-best-model-for-your-use-case"
publisher: "claude.com"
type: "blogPost"
date: "2026-07-24"
products: ["Claude Code","Claude Cowork","Claude Design","Claude Enterprise","Claude Platform"]
read_time: 8
excerpt: ""
fetched_at: "2026-11-18"
---

# Claude 模型详解：为你的用例选择最佳模型
## 我们的建议：从最智能的模型开始

我们最常听到的问题之一是「[这个工作负载该选哪个模型？](https://claude.dev/blog/which-claude-model-should-you-build-with/)」。随着我们发布越来越多的模型类别和版本，这个问题的答案也变得更加细致。

本文涵盖这些细节，包括每个模型类别的说明、选择模型时要问的关键问题，以及其他最佳实践。

但先抛开这些细节，我们的默认建议是：从最智能的正式可用模型开始，再通过 effort level 来调节性能与成本。

对于更智能的模型，[单任务成本](https://claude.dev/blog/what-a-task-costs-on-opus-5-5/)往往更低，尤其是在较低的 effort level 下，即使每 token 价格更高。这是因为能力更强的模型通常用更少的轮次和更少的思考时间就能把大多数任务做对。从小模型起步还会让你更难区分模型失败和配置失败。

当然，当出现对延迟或成本更敏感的用例时，你可以测试更低层级的模型，直到找到最合适的那个。

有些组织也可能选择从最具成本效益的模型开始，逐级向上，直到满足质量门槛。我们在模型选择的文档中收录了这两种[方向性方法](https://platform.claude.com/docs/en/about-claude/models/choosing-a-model)。

## Claude 模型家族

Claude 模型家族是 Anthropic 的 AI 模型阵容——Fable、Opus、Sonnet 和 Haiku——各自在智能、速度和成本之间做出不同的平衡。选得好，意味着让模型与任务相匹配。

### Mythos / Fable

Mythos 是 Anthropic 能力最强的模型类别，在各领域都具备前沿能力。该模型类别在编程、长时程智能体任务，以及解决 AI 此前无法可靠处理的问题方面尤为出色。

Mythos 类别以同一底层模型的两个封装形式发布。Claude **Mythos** 面向处理两用网络安全和生物学工作的[受信任组织](https://www.anthropic.com/glasswing)，而 Claude **Fable** 则附加了额外的防护措施，使该模型可供公众安全使用。两者都要求[有限的数据留存，以确保安全使用](https://privacy.claude.com/en/articles/15425996-data-retention-practices-for-covered-models)。

### Opus

Opus 是我们面向推理密集型的企业任务的强大模型类别。Opus 模型在 GDPval-AA（知识工作）和 Terminal-Bench 2.1（智能体式编程）等关键行业基准测试中始终名列前茅。

Opus 与 Fable 之间的选择表面上可能并不清晰，因为两者都擅长编程、长时程智能体和知识工作。在现实场景中，Fable 这样更大的模型往往拥有更多的智慧、创造力和写作能力，尽管其基准测试分数与 Opus 等模型相近。

一般的经验法则是：如果你的评估（eval）或内部测试显示 Opus 在某些任务上吃力，那么答案就是 Fable。如果 Opus 已经达到质量门槛，那么它的速度和价格特征可能使它成为更好的选择。

### Sonnet

Sonnet 是我们面向日常任务的多用途模型类别。Sonnet 在性能、成本和速度之间取得平衡，适用于最广泛的通用用例，包括多智能体编排设置中的高并发子智能体。

### Haiku

Haiku 是我们成本最低、速度最快的模型类别。Haiku 模型专为延迟和成本至关重要的高频工作负载而设计。

## 如何为你的工作负载选择最佳的 Claude 模型

我们的模型类别并不专精于某一类工作。我们不建议财务用这个模型类别、科学用那个模型类别。每个 Claude 模型都经过训练，在编程、智能体任务和知识工作等领域表现出色。

各模型类别之间的主要差异在于它们能可靠承担的问题有多难，以及这种能力在价格和速度上的代价。选择模型时，请问：

**这个任务有多难？** 如果它通常需要大量时间、涉及多个步骤，或是此前未被解决的问题，那么更适合能力更强的模型类别。

**延迟需求是什么？** 如果模型涉及高频的面向客户的工作负载，那么 Sonnet 通常是最佳选择。

**访问限制是什么？** Mythos 仅向 [Project Glasswing](https://www.anthropic.com/glasswing) 下的组织提供。并非所有组织都会向所有角色开放所有模型类别。

**单位经济性如何？** 更高的生产量可能更适合较低层级的模型，尤其是当评估显示这些任务能够令人满意地完成时。[各模型的每 token 定价不同](https://platform.claude.com/docs/en/about-claude/models/overview)，并且会根据其能力和 effort level 产生不同的单任务成本。

effort level 也会影响质量、速度和成本之间的平衡。更高层级的模型在更高 effort 下提供最佳性能，而更高层级的模型在较低 effort 下有时可能比更小的模型更高效。



曲线仅为示意，并非根据基准测试数据绘制。



曲线仅为示意，并非根据基准测试数据绘制。

要了解更多，请阅读[在 Claude Code 中选择 Claude 模型和 effort level](https://claude.com/resources/articles/claude-model-and-effort-level-in-claude-code)。

## 用 advisor 策略组合各模型优势

[advisor 策略](https://claude.com/resources/articles/the-advisor-strategy)允许更快、成本更低的工作模型调用更智能的模型来检查其计划并评估其工作，从而提升性能。

这种方法只在需要时对执行器模型进行指导，能大幅提升性能。例如，在 SWE-bench Pro 上，搭配 Fable 5 作为 advisor 的 Sonnet 5 与 Fable 5 的分数相差在 10% 以内，而成本仅为整项任务全程使用 Fable 5 的 63%。

## 评估和基准测试如何帮助选择模型

判断模型能力是否满足需求的两种常见方式是使用标准基准测试和自定义评估。

基准测试是一组预先确定的任务或场景，通常针对特定领域，并带有已知的解决方案。它们可以作为评估跨模型类别和跨提供商能力的有用方向性指引。挑战在于评估强大的模型（如 Opus 和 Fable）时，它们几乎能解出测试中的所有问题（通常称为饱和）。

在这些情况下，我们建议组织在真实工作负载上使用模型，或用自己的评估来测试它们，从而决定哪个模型是正确选择。通常，评估是从生产环境中精选的一组问题——包括你当前工具无法胜任的困难任务，并配有你的团队定义的成功的标准。



这正是前沿模型的能力和创造力开始与同类以及彼此拉开差距的地方。我们已经就开发[自定义智能体评估](https://www.anthropic.com/engineering/demystifying-evals-for-ai-agents)的最佳实践写了大量内容。

## 做出明智的选择

AI 模型选择没有放之四海而皆准的方法，这正是我们提供多个模型类别的原因。归根结底，选择模型的最佳方式是了解每个模型类别的基础知识，并深入理解你的用例。这意味着构建、维护和部署强有力的评估。
