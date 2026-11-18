---
title: "使用 Claude Platform 降低成本并提升性能"
source_url: "https://claude.com/resources/articles/reducing-cost-and-improving-performance-with-claude-platform"
publisher: "claude.com"
type: "blogPost"
date: "2026-09-08"
products: ["Claude Platform"]
read_time: 16
excerpt: "调整提示词缓存、指令与 effort 设置，可以在不牺牲应用性能的前提下降低 Claude 的成本。"
fetched_at: "2026-11-18"
---

# 使用 Claude Platform 降低成本并提升性能
_**更新：** 本文最初发布于 2026 年 9 月 8 日，其中包含反映使用 Opus 5 和 Sonnet 5 的成本与性能的基准测试。此后我们重新运行了其中若干基准测试，以纳入或突出于 2026 年 9 月 22 日发布的 Opus 5.5。_

性能和成本通常被视为一种权衡：想少花钱，就得接受更差的结果。在实践中，我们发现许多使用 Claude Platform 的应用可以通过三项修正在不牺牲性能的情况下降低成本：最大化提示词缓存命中率、在升级到前沿 Claude 模型时移除提示词中的反模式，以及根据任务校准 effort。我们已将这些指导写入 [`claude-api` skill](https://github.com/anthropics/skills/tree/main/skills/claude-api)。在本文中，我们展示 Claude Code 配合 `claude-api` 如何常常找到在保持或提升性能的同时降低成本的方法。

## **提示词缓存**

在 Claude 生成回复之前，它首先会将你的提示词处理为一种内部工作状态。这一步称为 _prefill_，是处理输入中开销较大的部分。提示词缓存会保存该状态（键值缓存，即 KV 缓存）：当请求以相同前缀开始时，Claude 会读回该状态，而不是重新计算。缓存读取的[计费仅为](https://platform.claude.com/docs/en/about-claude/pricing)完整输入价格的一小部分。

要确保有效使用提示词缓存，有几个实际考虑。第一，提示词缓存固定绑定到特定模型。第二，提示词缓存读取必须在提示词的整个跨度上做到_逐字节一致_。最后，提示词缓存有[有限的生存时间](https://platform.claude.com/docs/en/build-with-claude/prompt-caching#ttl-support)（TTL）。

考虑到这些要点，有一些实用建议：

-   **避免在对话中途更改 effort 或 thinking 设置**。这些设置会在你的内容之前渲染进提示词，因此属于缓存前缀的一部分。具体到 Claude Opus 5 和 Fable 5.1，你可以[在对话中途更新 effort](https://platform.claude.com/docs/en/build-with-claude/effort#changing-effort-mid-conversation) 而不破坏缓存。
-   **将易变的值排除在前缀之外**。系统提示词中的动态时间戳或 ID 可能在多次模型调用之间变化，从而破坏缓存。
-   **避免会自行重排的工具定义**。使用 Claude Messages API 时，[提示词按固定顺序组装](https://platform.claude.com/docs/en/build-with-claude/prompt-caching#structuring-your-prompt)，工具定义渲染在最顶部。对工具定义的任何更改都会破坏缓存。
-   **分叉对话时要小心**。只有当分叉的前缀逐字节一致、位于同一模型上并使用相同 effort 时，子智能体和分支才会共享父级的缓存。
-   **避免同步工具调用和存活时间超过缓存 TTL 的子智能体**。如果智能体阻塞在长时间运行的工具调用或子智能体上，缓存可能在结果返回之前就过期。下一轮必须重写缓存，按正常输入价格的 1.25 倍（1 小时缓存为 2 倍）计费，而不是便宜的读取价格。

### 如何修复

我们[积累](https://claude.com/blog/lessons-from-building-claude-code-prompt-caching-is-everything)了一些提示词缓存管理的经验：

-   **仔细监控你的提示词缓存命中率**。[Claude Console](https://platform.claude.com/docs/en/build-with-claude/cache-diagnostics) 提供提示词缓存诊断，包括提示词缓存未命中的原因（图 1）。如果命中率意外下降，[缓存诊断 API](https://platform.claude.com/docs/en/build-with-claude/cache-diagnostics) 会准确告诉你两个请求在哪里发生了分歧。



图 1. Claude Console 可以通过比较连续请求并准确识别提示词前缀发生分歧的位置，来诊断意外的提示词缓存未命中。

-   **延迟加载很少使用的工具**。预先声明所有工具，但将很少使用的工具标记为 [defer\_loading](https://platform.claude.com/docs/en/agents-and-tools/tool-use/tool-use-with-prompt-caching#defer-loading-and-cache-preservation)：它们会留在缓存前缀之外，只有当 Claude 通过工具搜索查找它们时才会被追加到对话中，从而保留缓存。
-   **将系统提示词更新作为消息应用**。[Claude Platform](https://platform.claude.com/docs/en/build-with-claude/mid-conversation-system-messages#when-to-use-a-mid-conversation-system-message) 允许你在对话中途以消息形式添加系统指令，而不是编辑系统提示词，从而保留缓存。
-   **安排请求布局，让稳定的部分保持稳定**。先放置静态上下文（工具定义和系统提示词），再在其后放置不断增长的对话（图 2）。



图 2. 组织提示词，确保动态内容追加到稳定前缀的末尾。

-   **在提示词缓存本来就会被破坏时更改模型或 effort**。某些操作（例如[上下文压缩](https://platform.claude.com/docs/en/build-with-claude/compaction)）本来就会重写大部分缓存（对话）。这是切换模型或 effort 的[好时机](https://cognition.com/blog/devin-fusion)，因为无论如何你都要为一次未命中付费。
-   **随着对话增长移动缓存断点**。使用 Claude Platform，你可以设置[自动缓存](https://platform.claude.com/docs/en/build-with-claude/prompt-caching#automatic-caching)，自动将缓存断点应用到最后一个可缓存块。
-   **预热缓存**。为降低延迟，发送一个带有 `max_tokens: 0` 和显式缓存断点的请求。这会处理提示词并将其写入缓存，而不生成任何内容。如果你在会话开始时运行它（例如用户正在输入时），第一个真实请求就会命中已预热的缓存。
-   **不要超过提示词缓存 TTL**。5 分钟缓存 TTL 从请求开始时计算。如果智能体阻塞在运行时间超过 5 分钟的工具调用或子智能体请求上，父级的缓存会在结果返回之前过期。在这种情况下，考虑在前缀上[设置 1 小时 TTL](https://platform.claude.com/docs/en/about-claude/models/optimizing-for-cost-and-intelligence)。

## **指令**

提示词可能积累了一些用于修补模型弱点的指令。这些指令可能相对于[最新 Claude 模型](https://x.com/trq212/status/2080710971228918066)的能力发生漂移。以下是一些常见的提示词“反模式”，它们会束缚前沿 Claude 模型，并可能无意中增加成本：

-   **验证仪式**。诸如“_double-check your work_”或“_verify twice before responding_”之类的指令常常被前沿模型按字面理解，从而浪费 token。
-   **彻底性和强调增强器**。“_Be maximally thorough_”、“_CRITICAL: YOU MUST ALWAYS…_”在与前沿模型协作时可能导致冗长和额外的工具调用。
-   **强制流程和草稿纸脚手架**。固定步骤流程（例如“_think step by step in a scratchpad_”）或推理模板是前沿模型不需要的仪式。这种脚手架可能叠加在原生推理之上，消耗不必要的 token。
-   **过时的示例**。针对旧模型失败模式调优的少样本示例，可能教会前沿模型在不需要的请求上模仿长推理链。
-   **相互矛盾的规则**。前沿模型更擅长遵循指令。相互矛盾的指令（“always refund within policy” vs. “never issue refunds without escalation”）可能被前沿模型更按字面遵循，导致性能下降。
-   **过时的配置**。为旧一代 Claude 编写的设置（例如手动 thinking 预算）在升级到前沿模型时可能被 Claude Platform 拒绝。

### **如何修复**

我们更新了 `claude-api` skill，新增了一个用于留意这些反模式的命令。在 Claude Code 中，针对你的提示词、skills 或工具描述运行 `/claude-api prompt-audit`。该审计覆盖工作目录中的所有内容，包括调用 Claude API 的应用代码以及 Claude Code 自身的配置（例如 [CLAUDE.md](http://claude.md/) 或 skills）。

例如，我们在一个客户支持基准测试上测试了从 Opus 4.8 到 Opus 5.5 的模型迁移。我们从一个干净的提示词开始，一次植入一个反模式（一个已弃用的 thinking 设置、一对相互矛盾的退款规则、一个手动草稿纸、“verify twice”、“be maximally thorough”，以及一个强制的六步流程），得到六个遗留提示词。

我们在 Opus 4.8 上、在仅更改模型 ID 的 Opus 5.5 上，以及在每个提示词运行一次 `/claude-api prompt-audit` 后的 Opus 5.5 上分别运行了每个提示词（图 3 显示了六个提示词的平均值）。



图 3 | 从 Opus 4.8 迁移到 Opus 5.5 期间提示词反模式的影响。

从 Opus 4.8 迁移到 Opus 5.5 将成本降低了约 18%。这是因为 Opus 5.5 的[输入 token 和提示词缓存读取](https://platform.claude.com/docs/en/about-claude/pricing)比 Opus 4.8 更便宜。

在 Opus 5.5 上，验证仪式（“_verify twice_”）通过在每次退款时重复订单查询，使用了不必要的 token。强调增强器（“_be maximally thorough_”）变成了数十次不需要的知识库搜索。

运行 `/claude-api prompt-audit` 移除了反模式，额外降低了 9% 的成本。成本下降是因为消除了额外的工具调用和重复推理。准确率上升了约 2 个百分点，原因有三。已弃用的 thinking 设置使 API 直接拒绝每一个路由请求。相互矛盾的退款规则导致 Opus 5.5 扣留了四笔本应退款的款项，同时要求客户确认。手动草稿纸与 Opus 5.5 的内置 thinking 发生冲突：在三张工单上，它把工具调用写进了推理中，却从未执行。

## **Effort**

[Effort](https://platform.claude.com/docs/en/build-with-claude/effort) 告诉 Claude“要花多大力气”。在低 effort 下，Claude 通常更快得出结论。在高 effort 下，Claude 会在回答前进行斟酌、验证并探索替代方案。

单个模型在不同 effort 级别下的成本与性能表现可能各不相同。例如，Claude Fable 5 在 FrontierCode Diamond（最难的 50 个任务）上以低 effort 获得 11.5% 的得分，单任务成本为 $5.35。在最高 effort 下，Fable 5 获得 30.9%，单任务成本为 $19.00；更改 effort 使得分提高约 2.7 倍（+19 分），成本约为 3.5 倍（图 4）。

在 Claude Fable 5.1 上，Humanity's Last Exam（不使用工具）显示出陡峭的曲线，最后一步收益递减。它在低 effort 下得分约 53%，每题成本约 $0.30；在最高 effort 下得分约 61%，成本约 $2.23；最后一步升到最高 effort 只增加约半分，成本却增加 46%。这一增益落在基准测试的运行间噪声范围内，因此你花了更多钱却没有可测量的收益。



图 4. Fable 5 在 FrontierCode Diamond 上不同 effort 级别的性能与成本对比。

Effort 可能朝任一方向校准错误：

-   **假设越高总是越好**。高 effort 可能导致_过度_思考。Claude 花在斟酌上的时间超过任务所需，这会增加成本/延迟，并可能降低答案质量。只有当仍有证据可找时，斟酌才有帮助。
-   **偏向低 effort**。设置得太低，Claude 会在获得足够证据之前就停止。它进行的工具调用更少，因此可能根据第一个搜索结果而不是第三个来回答。它在困难步骤上思考更少，并跳过它通常会自行运行的检查。答案看起来完成了，但建立在部分信息之上。

### **如何修复**

有一些有用的方法来校准 effort：

-   **以较低 effort 测试更强的模型**。低 effort 下的更强模型可能比高 effort 下工作的较弱模型更便宜。例如，在 CursorBench 3.2 上，低 effort 的 Claude Fable 5.1 [在性能上匹配](https://www-cdn.anthropic.com/0339e6a7c5c7b87f5c07798616dc32c215d14235/Claude%20Fable%205.1%20&%20Claude%20Mythos%205.1%20System%20Card.pdf)高 effort 的 Fable 5，而成本只有三分之一（图 5）。两件事使较新的模型更便宜：在低 effort 下它每个任务做的工作更少，并且 Fable 5.1 的提示词缓存读取价格为每百万 token $0.25，而 Fable 5 为 $1.00。即使按 Fable 5 的价格，低 effort 的 Fable 5.1 成本也会低约 40%。



图 5. Fable 5 与 Fable 5.1 在 CursorBench 3.2 上不同 effort 级别的对比。

-   **理解你的任务形态。** 在[一系列 effort 级别](https://platform.claude.com/docs/en/about-claude/models/optimizing-for-cost-and-intelligence#tune-effort)上测量应用性能，是理解你特定任务成本-性能权衡的有用方法。在未饱和的评估中，不同 effort 级别下平坦的性能-成本曲线表明该任务不受 thinking 算力约束；增加 effort 没有益处。

这种校准通常涉及跨模型和 effort 级别运行评估。在 Claude Code 中，`/claude-api hillclimb` 会为你执行这种搜索：它将你的评估拆分为训练集和测试集，提出配置更改，并读取失败的训练样本来修复发现的问题。

我们在一个客户支持基准测试上运行了它，从 Opus 4.8 的默认（高）effort 开始。爬山器首先尝试低 effort 的 Opus 5，应用 prompt-audit 移除强制工具调用仪式、草稿纸步骤和相互矛盾的规则。这以 98.9% 的训练准确率超过了 Opus 4.8 基线，并将单工单成本降至 2.6 美分。



图 6. 爬山通过更新模型选择、effort 和提示词来改善成本与性能。

然后它降到低 effort 的 Sonnet 5，成本更低，每工单 1 美分，但准确率降至 88.9%。通过阅读失败的训练工单，Claude 在提示词中添加了路由规则和退款上限交叉引用，使 Sonnet 5 在相同成本下回到 98.9%。

在搜索从未见过的 14 张留出工单上，最终配置得分为 90.5%，而原始设置为 78.6%，成本约为五分之一。

## **自动化降低成本**

提示词缓存、指令和 effort 是降低成本的常见杠杆。我们的[文档](https://platform.claude.com/docs/en/about-claude/models/optimizing-for-cost-and-intelligence#cut-spend-without-losing-quality)涵盖了更多内容。为了对使用 Claude API 的应用代码进行整体成本审计，我们新增了 `/claude-api cost-optimize`：它会分析你的支出流向，应用成本削减措施，并且如果你提供评估，还会展示节省与性能之间的权衡。

`cost-optimize` 首先找出你的 token 流向：如果你有 Claude Admin API key，则从组织的[用量与成本报告](https://platform.claude.com/docs/en/manage-claude/usage-cost-api)中获取；如果你的应用记录了每次 API 响应中的 usage 对象，则从该对象获取；如果两者都没有，则通过阅读你的请求构建代码并进行估算。

然后它对可用的节省进行排序，从提示词缓存开始，削减每个请求携带的内容（包括 prompt-audit）、限制输出，以及[批处理](https://platform.claude.com/docs/en/build-with-claude/batch-processing)无人值守的工作。如果你提供评估，它会更进一步，计算不同 effort 级别和模型选择下的成本与性能。

我们在四个公开基准测试上运行了它，以 Opus 5.5 作为基线（图 7）：

-   **LegalBench**（成本降低约 67%）：`cost-optimize` 找到缓存部分提示词的机会，设置低 effort，并通过成本更低的 [Batch API](https://platform.claude.com/docs/en/about-claude/pricing) 处理任务。Thinking token 下降约 84%，准确率变化不到一个百分点，成本下降约 67%。
-   **tau2-bench retail**（成本降低约 73%）：`cost-optimize` 发现约 93% 的提示词可以被缓存，在通过率不变的情况下将支出降低约 73%。
-   **OfficeQA Pro**（成本降低约 72%）：`cost-optimize` 应用了 [Batch API](https://platform.claude.com/docs/en/about-claude/pricing)，并将过大的文档裁剪到最相关的部分，成本降低约 72%，得分没有显著变化。
-   **SWE-bench Verified**（成本降低约 24%）：`cost-optimize` 发现提示词缓存已经应用，因此节省来自将 effort 设置为 medium 并将智能体的输出限制为几句简洁的话。两者合计将成本降低约 24%。



图 7 | 使用 /claude-api cost-optimize 后各基准测试的成本与性能变化。

## **开始使用**

当你已迁移到前沿 Claude 模型并想对照它检查现有提示词时，从 `/claude-api prompt-audit` 开始。它会扫描你工作目录中的提示词、skills 和工具描述。这可以是调用 Claude API 的应用代码，也可以是 Claude Code 的配置（CLAUDE.md、skills）。它会移除束缚前沿模型的常见反模式。

当你的应用使用 Claude API 并想要成本审计时，使用 `/claude-api cost-optimize`。它会分析 token 支出，然后测试不同的杠杆：它会应用 prompt-audit，但也会检查通过提示词缓存、批处理无人值守工作或限制输出来降低成本的方法。如果你提供评估，它会衡量 effort 和模型选择的权衡。

最后，使用 `/claude-api hillclimb` 对成本与性能进行迭代搜索。给定一个评估，Claude 会将其拆分为训练集和测试集，然后提出旨在降低成本同时保持基线性能的应用更新。Claude 读取失败的训练案例来指导搜索，最终配置在留出的测试集上评分。

了解更多：

-   参阅我们的文档，[此处](https://platform.claude.com/docs/en/about-claude/models/optimizing-for-cost-and-intelligence#cut-spend-without-losing-quality)
-   参阅我们的 cookbook，[此处](https://platform.claude.com/cookbook/cost-optimization-cost-optimization#prompt-caching)
