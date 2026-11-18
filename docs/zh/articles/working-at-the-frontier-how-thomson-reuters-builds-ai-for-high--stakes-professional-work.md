---
title: "在前沿工作：Thomson Reuters 如何为高风险专业工作构建 AI"
source_url: "https://claude.com/resources/articles/working-at-the-frontier-how-thomson-reuters-builds-ai-for-high--stakes-professional-work"
publisher: "claude.com"
type: "blogPost"
date: "2026-07-08"
products: ["Claude Platform","Claude Enterprise","Claude Code"]
read_time: 9
excerpt: "Thomson Reuters 首席技术官 Joel Hron 多年来一直将 AI 融入律师和会计师所信赖的产品之中。以下是他为何认为 Claude Fable 5 是知识工作领域 AI 能力边界的一次关键演进。\n\n‍"
fetched_at: "2026-11-18"
---

# 在前沿工作：Thomson Reuters 如何为高风险专业工作构建 AI
Thomson Reuters 是一家全球内容与技术公司，175 年多来一直为做出重大决策的专业人士和机构打造值得信赖的内容与技术。如今，同样的使命正在塑造该公司为法律、税务、会计、合规及其他高风险专业工作流构建 AI 的方式。

"我们是一家专注于那些要求准确与精确的职业的技术公司，"Thomson Reuters 首席技术官 Joel Hron 表示。

其产品正是这些职业赖以运转的参考工具：Westlaw 和 Practical Law 用于法律研究与实务指引，CoCounsel Legal 是 Thomson Reuters 的专业级法律 AI 平台，旨在让法律专业人士把工作做得更好，提供他们能够为之辩护的答案，以及具有真实价值的成果。Hron 在四年前加入 Thomson Reuters，当时他的创业公司被该公司收购，他工作于产品、技术与战略的交汇处。他说，在那段时间里，AI 重塑了构建软件的含义。选择合适的技术合作伙伴从未如此重要。

选择用哪些 LLM 来驱动这些产品，其标准异常具体。Hron 和他的团队评估一个新模型时，会问它的产出能否经受住律师在依赖它开展工作之前所施加的那一层专业审查。

### 为法律工作评估模型

很多公司都能构建[法律 AI 工具](https://claude.com/resources/guides/claude-for-the-legal-industry)，但能构建出律师愿意署上自己名字的工具的公司要少得多。Thomson Reuters 为专业 AI 带来了通用系统难以轻易复制的三项优势：权威内容、深厚的领域专业知识，以及工作流集成。

Hron 说，律师之所以能信赖 Westlaw 的答案，原因并不在于模型本身。它来自数十年精心整理的判例法、全球 2,700 多名领域专家每天对这些内容进行标注和增强的工作，以及 Thomson Reuters 在 Claude 等模型之上构建的评估（eval）。"最终工作成果的责任，仍然由那位人类专业人士承担。"

Claude 是有价值的模型合作伙伴，但专业级系统来自 Anthropic 的前沿模型与 Thomson Reuters 的权威内容、深厚领域专业知识、工作流集成和评估基础设施的结合。

Thomson Reuters 将这种方法称为 Fiduciary-Grade AI™：以权威内容为基础、由深厚领域专业知识塑造、直接嵌入专业工作流的 AI，因此在高风险场景下，其产出是透明的、可验证的、可辩护的。

正是这种责任归属，使得在此处验证比流畅度更为重要。Thomson Reuters 围绕智能体重建了法律研究，这些智能体针对的是"不只是搜索，也不只是检索，而是引证校验与验证"。要求是系统能够帮助校验引证并清晰地呈现来源，使专业人士能够自信地审查、验证并运用自己的判断。

这一变化体现在客户的反馈中。Hron 说，过去"要花几十个小时"的研究，现在"几分钟内"就能完成，为专业人士提供一个高质量的起点，他们可以据此评估、完善并采取行动。"深度研究彻底改变了人们思考法律研究的方式。"

### 构建智能体优先的产品

对 Thomson Reuters 而言，构建智能体并不是要造一个更聪明的聊天机器人。它体现的是一种交付现有产品的新方式。Hron 和他的团队着手教一个智能体使用公司过去以独立软件形式提供的所有工具。如今，单个智能体可以同时访问数百个公司工具。

这一转变改变了 Thomson Reuters [评估模型](https://claude.com/resources/webinars/evals-for-ai-agents-how-product-builders-get-the-most-out-of-every-new-model)的方式。"我们对 Claude 的重大考验，是真正评估它在制定计划并有效、正确地使用这些工具方面有多出色，"他说。

CoCounsel Legal 展示了这种形态。它过去要一个接一个地运行各项独立技能。在 [Claude Agent SDK](https://claude.com/resources/articles/building-agents-with-the-claude-agent-sdk) 上重建之后，它现在能够实时地跨工具和内容源进行规划、委派和编排，因此专业人士可以定义目标成果，而不必规定每一个步骤。客户数据仍受保护，不会被用于训练第三方模型。

Hron 将这一选择追溯到两家公司最初合作的方式。Thomson Reuters 是 Anthropic 最早的企业客户之一，而决定性因素并不是某项基准测试。"最打动我们的一点是 Anthropic 构建企业 AI 的方式，"他说，并提到了透明度、安全性和负责任的 AI 开发。第一个验证点是法律领域的深度研究，这是双方团队共同构建的，因为双方都注意到 Anthropic 的工程师使用这些工具的方式，与 Thomson Reuters 已经在交付的方式如出一辙。

### 知识工作对模型的要求



公司内部的产品、运营和业务团队使用 Claude Cowork 进行流程自动化和轻量级原型设计。

在这些项目中，Hron 的团队确定了模型在赢得 Thomson Reuters 信任之前必须做到的四件事。

首先，作为 CoCounsel Legal 系统的一部分，模型必须核验自己的引证。系统不能只是检索到一个来源就继续往下走，而必须在将发现呈现给人类进行最终审查和验证之前，校验它所引用的内容。

在这个系统中，模型还必须在长长的工具调用链中保持稳定。更长的任务要求在长时间运行中具备更好的上下文管理和可靠的工具调用。模型必须在许多步骤和许多系统之间保持线索连贯，使智能体完成真正的工作，而不是中途停滞。

它还必须把人带入工作之中，而不只是给出答案。对于最难的任务，Hron 希望模型能够"把人带入工作成果的开发循环中，而不是仅仅依赖智能体一次性给出答案"。

最后，它必须为 Thomson Reuters 团队此前没有余力处理的工作腾出时间。Hron 说，Thomson Reuters 正在为复杂的法律工作开发高级起草能力，包括动议起草，以及专业人士原本要"花上数天或数周打磨"的提交文件。这项任务"一直需要过多的上下文和精确度"，此前的模型无法胜任。有了 Claude Fable 5，它现在触手可及。

### AI 的投资回报

Hron 对 AI 的投资回报持一种反主流的观点，其他正在推广模型的领导者或许会觉得有用。"如果你过于针对回报率计算做优化，就会只见树木不见森林，"他说。他希望团队先感受到文化和思维方式的转变，然后再去调整单任务成本。一旦这种思维转变发生，回报自然会随之而来。

他仍然追踪传统的工程指标，比如 DevOps 研究与评估（DORA）以及从想法到上线的时长，并指出一个基于 Claude 构建的内部错误修复工具，将一次生产问题从三小时的根因分析变成了四分钟的修复。"能在几分钟而非几小时内恢复健康状态，这是实质性的差别。"

据 Hron 所说，更深层的变化在于工作本身。

"写代码这一行为不再是工作本身，"Hron 在谈到他的工程师时说；如今最重要的技能是系统思维、判断力和品味。他看到同样的模式正在向工程之外蔓延，AI 让人变得"更加 T 型"，能够横跨产品、设计和财务，而不是固守单一领域。

### 下一步



Thomson Reuters 的员工使用 Claude Code 快速熟悉代码库并构建长时间运行的智能体。

Hron 和他的团队渴望借助 Claude Fable 5 和未来的 Claude 模型突破边界：更长时程的工作、更好的上下文管理，以及他们在智能体运行的整个任务链中都能依赖的工具调用。

他同样渴望在自己的工作中使用这些模型。Claude Code 让他"重新变得技术性得多"，能在几分钟而非一天之内熟悉一个他数月未碰的代码库，而他会借助 Claude Cowork 站在 CFO 或战略官的角度来压力测试各种想法。

这些正是 Claude Fable 5 这类模型所围绕构建的方向，而对于最终必须在法庭上站得住脚的工作，Hron 认为这是接下来值得推进的前沿。毕竟，专业 AI 必须在"差不多对"并不够用的环境中工作。

**开始使用 [Claude Fable 5](https://platform.claude.com/docs/en/about-claude/models/introducing-claude-fable-5-and-claude-mythos-5)。**
