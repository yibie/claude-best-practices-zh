---
title: "2026 年提示词工程最佳实践"
source_url: "https://claude.com/resources/articles/best-practices-for-prompt-engineering"
publisher: "claude.com"
type: "blogPost"
date: "2025-11-10"
products: ["Claude apps"]
read_time: 20
excerpt: "借助 Claude 团队总结的提示词工程技巧，获得更好的 AI 结果。"
fetched_at: "2026-11-18"
---

# 2026 年提示词工程最佳实践
## 什么是提示词工程？

[提示词工程](https://platform.claude.com/docs/en/build-with-claude/prompt-engineering/claude-prompting-best-practices)是一门组织指令、让 AI 模型产出更好结果的手艺。它关乎你如何措辞查询、指定风格、提供上下文，并引导模型的行为以实现你的目标。

一条含糊的指令与一条精心设计的提示词之间的差别，可能就意味着泛泛的输出与你真正想要的结果之间的差距。结构糟糕的提示词可能需要多轮来回交流才能澄清意图，而工程化良好的提示词能让你一次到位。

它也是[上下文工程](https://www.anthropic.com/engineering/effective-context-engineering-for-ai-agents)的基本构建块，后者已成为使用 LLM 时日益重要的一环。不过，提示正在与[面向 Claude 5 代模型的上下文工程](https://claude.com/blog/the-new-rules-of-context-engineering-for-claude-5-generation-models)趋于融合——更少的脚手架，更多的内容策展。

为帮助你入门，我们汇总了团队的一些最佳实践，包括旨在立即改善你结果的实用方法。我们会从今天就能用上的简单习惯讲起，再扩展到适用于复杂项目的高级方法。

## 如何使用提示词工程

在最基本的层面上，提示词工程就是修改你传给 LLM 的查询。通常它只是在提出实际请求之前向查询中添加信息——但知道_哪些_信息才是_正确的_信息去分享，正是设计出优秀而有效的提示词的秘诀。

### 核心技巧

这些提示词工程技巧构成了有效 AI 交互的基础。持续使用它们，你就能立即看到响应质量的提升。

#### 明确且清晰

现代 AI 模型对清晰、明确的指令响应极佳。不要假设模型会推断出你想要什么——直接说出来。使用简单的语言，毫不含糊地说明你究竟想要什么。

**关键原则**：准确告诉模型你想看到什么。如果你想要全面的输出，就明确要求。如果你想要特定功能，就列出来。像 Claude 这样的现代模型尤其受益于明确的指示。

**示例：创建分析仪表盘**

**含糊**："创建一个分析仪表盘"

**明确**："创建一个分析仪表盘。尽可能包含更多相关功能和交互。超越基础，打造一个功能完备的实现。"

第二个版本明确要求全面的功能，并表明你希望模型超越最低要求。

**最佳实践**：

-   以直接的动作动词开头："写"、"分析"、"生成"、"创建"
-   跳过开场白，直奔请求
-   说明你希望输出包含什么，而不只是要处理什么
-   对质量和深度的预期要具体

#### 提供上下文和动机

解释某件事_为什么_重要，有助于 AI 模型更好地理解你的目标，并给出更有针对性的响应。这对能够推理你底层目标的新模型尤其有效。

**示例：格式偏好**

**效果较差**："绝不使用项目符号"

**效果更好**："我更喜欢自然段落形式的回答，而不是项目符号，因为我觉得流畅的行文更易读、更有对话感。项目符号对我随意的学习风格来说太正式、太像清单了。"

第二个版本帮助模型理解这条规则背后的理由，从而让它能对相关的格式选择做出更好的判断。

**何时提供上下文**：

-   解释输出的目的或受众
-   说明某些约束为何存在
-   描述输出将如何使用
-   表明你试图解决什么问题

#### 具体明确

提示词工程中的具体性，意味着用明确的准则和要求来组织你的指令。你对想要什么描述得越具体，结果就越好。

**示例：膳食计划**

**含糊**："为地中海饮食制定一份膳食计划"

**具体**："为糖尿病前期管理设计一份地中海饮食膳食计划。每日 1,800 卡路里，强调低升糖食物。列出早餐、午餐、晚餐和一份零食，并附完整的营养分解。"

**什么让提示词足够具体？**

包括：

-   明确的约束（字数、格式、时间线）
-   相关上下文（受众是谁、目标是什么）
-   期望的输出结构（表格、列表、段落）
-   任何要求或限制（饮食需求、预算限制、技术约束）

#### 使用示例

示例并非总是必要，但在解释概念或演示特定格式时它们大放异彩。也称为 one-shot 或 few-shot 提示，示例是展示而非讲述，能澄清仅靠描述难以表达的细微要求。

**对现代模型的重要提示**：Claude 4.x 及类似的先进模型会非常关注示例中的细节。确保你的示例与你想要鼓励的行为一致，并尽量减少你想要避免的任何模式。

**示例：文章摘要**

**无示例**："总结这篇文章"

```
以下是我想要的摘要风格示例：

文章：[关于 AI 监管的文章链接]
摘要：欧盟通过全面的《人工智能法案》，针对高风险系统。关键条款包括透明度要求和人工监督强制规定。2026 年生效。

现在用同样的风格总结这篇文章：[你的新文章链接]
```

**何时使用示例**：

-   期望的格式展示起来比描述起来更容易
-   你需要特定的语气或风格
-   任务涉及细微的模式或惯例
-   简单指令未能产生一致的结果

**专业提示**：从一个示例开始（one-shot）。只有当输出仍不符合你的需求时，才添加更多示例（few-shot）。

#### 允许 Claude 表达不确定性

明确允许 AI 表达不确定性，而不是猜测。这能减少幻觉并提高可靠性。

**示例**："分析这些财务数据并识别趋势。如果数据不足以得出结论，就如实说明，而不是推测。"

这个简单的补充让回答更可信，因为它允许模型承认局限性。

**[在 Claude 中试试](https://claude.ai/redirect/claudedotcom.v1.3835d50d-4369-4677-a754-7e8b09428283)这些技巧。**

## 高级提示词工程技术

这些核心习惯能让你走得很远，但你可能仍会遇到需要更精细方法的情况。当你构建智能体式解决方案、处理复杂数据结构，或需要拆解多阶段问题时，高级提示词工程技术便会大显身手。

### 预填 AI 的响应

预填让你替 AI 开始响应，从而引导格式、语气或结构。这项技术对于强制输出格式或跳过开场白尤其强大。

**何时使用预填**：

-   你需要 AI 输出 JSON、XML 或其他结构化格式
-   你想跳过对话式开场白，直奔内容
-   你需要保持特定的口吻或角色
-   你想控制 AI 如何开始其响应

**示例：强制 JSON 输出**

不使用预填时，Claude 可能会说："这是你要求的 JSON：{...}"

使用预填（API 用法）：

```
messages=[
    {"role": "user", "content": "Extract the name and price from this product description into JSON."},
    {"role": "assistant", "content": "{"}
]
```

AI 将从左花括号继续，只输出有效的 JSON。

**注意**：在聊天界面中，你可以通过非常明确的要求来近似实现："只输出有效的 JSON，不要任何开场白。以左花括号开始你的响应。"

### 思维链提示

思维链（CoT）提示是指在回答之前请求逐步推理。这项技术有助于那些受益于结构化思维的复杂分析任务。

**现代方法**：Claude 提供[扩展思考](https://www.anthropic.com/news/visible-extended-thinking)功能，可自动进行结构化推理。在可用时，扩展思考通常优于手动思维链提示。不过，理解手动 CoT 仍然有价值，适用于扩展思考不可用、或你需要可审查的透明推理的情况。

**何时使用思维链**：

-   扩展思考不可用（即免费的 [Claude.ai](http://claude.ai/redirect/claudedotcom.v1.3835d50d-4369-4677-a754-7e8b09428283) 方案）
-   你需要可审查的透明推理
-   任务需要多个分析步骤
-   你想确保 AI 考虑特定因素

思维链有三种常见实现方式：

**基础思维链**

只需在指令中添加"逐步思考"。

```
Draft personalized emails to donors asking for contributions to this year's Care for Kids program.

Program information:
<program>
{{PROGRAM_DETAILS}}
</program>

Donor information:
<donor>
{{DONOR_DETAILS}}
</donor>

Think step-by-step before you write the email.
```

**引导式思维链**

组织你的提示词，提供具体的推理阶段。

```
Think before you write the email. First, think through what messaging might appeal to this donor given their donation history. Then, consider which aspects of the Care for Kids program would resonate with them. Finally, write the personalized donor email using your analysis.
```

**结构化思维链**

使用标签将推理与最终答案分开。

```
Think before you write the email in <thinking> tags. First, analyze what messaging would appeal to this donor. Then, identify relevant program aspects. Finally, write the personalized donor email in <email> tags, using your analysis.
```

**注意**：即使扩展思考可用，明确的 CoT 提示对复杂任务仍可能有益。这两种方法互补，而非互斥。

### 控制输出格式

对于现代 AI 模型，有几种有效的方式可以控制响应格式：

**1. 告诉 AI 该做什么，而不是不该做什么**

与其说："不要在响应中使用 markdown"，不如说："你的响应应由流畅的行文段落组成"

**2. 让提示词的风格与期望的输出相匹配**

提示词中使用的格式风格可能影响 AI 的响应风格。如果你想要最少的 markdown，就减少提示词中的 markdown。

**3. 明确说明格式偏好**

要详细控制格式：

```
When writing reports or analyses, write in clear, flowing prose using complete paragraphs. Use standard paragraph breaks for organization. Reserve markdown primarily for inline code, code blocks, and simple headings.

DO NOT use ordered lists or unordered lists unless you're presenting truly discrete items where a list format is the best option, or the user explicitly requests a list.

Instead of listing items with bullets, incorporate them naturally into sentences. Your goal is readable, flowing text that guides the reader naturally through ideas.
```

### 提示词链

与前面的技术不同，提示词链无法在单个提示词中实现。链式将复杂任务拆解为更小的顺序步骤，每个步骤使用单独的提示词。每个提示词处理一个阶段，其输出馈入下一条指令。

这种方法通过让每个单独任务更简单，以延迟换取更高的准确性。通常这项技术会通过工作流或以编程方式实现，但你也可以在收到响应后手动提供提示词。

**示例：研究摘要**

1.  **第一个提示词**："总结这篇医学论文，涵盖方法、发现和临床意义。"
2.  **第二个提示词**："审查上述摘要的准确性、清晰度和完整性。给出分级反馈。"
3.  **第三个提示词**："根据以下反馈改进摘要：\[步骤 2 的反馈\]"

每个阶段都通过聚焦的指令增加精炼。

**何时使用提示词链**：

-   你有一个需要拆解为步骤的复杂请求
-   你需要迭代精炼
-   你在做多阶段分析
-   中间验证能带来价值
-   单个提示词产生不一致的结果

**权衡**：链式会增加延迟（多次 API 调用），但对复杂任务往往能大幅提高准确性和可靠性。

## 你可能听说过的技巧

一些在早期 AI 模型上流行的提示词工程技巧，对 Claude 这样的模型来说已不那么必要。不过，你可能仍会在旧文档中遇到它们，或在特定情况下发现它们有用。

### 用于结构的 XML 标签

XML 标签曾是向提示词添加结构和清晰度的推荐方式，尤其是在纳入大量数据时。虽然现代模型在没有 XML 标签的情况下更善于理解结构，但在特定情况下它们仍可能有用。

**示例**：

```
<athlete_information>
- Height: 6'2"
- Weight: 180 lbs
- Goal: Build muscle
- Dietary restrictions: Vegetarian
</athlete_information>

Generate a meal plan based on the athlete information above.
```

**XML 标签何时可能仍有帮助**：

-   你在处理混合多种内容类型的极其复杂的提示词
-   你需要绝对确定内容边界
-   你在使用较旧的模型版本

**现代替代方案**：对大多数用例而言，清晰的标题、空白和明确的措辞（"使用下面的运动员信息……"）效果一样好，且开销更少。

### 角色提示

角色提示在你措辞查询时定义专家人设和视角。虽然这可能有效，但现代模型已足够精细，生硬的角色提示往往不再必要。

**示例**："你是一名财务顾问。分析这个投资组合……"

**重要提醒**：不要过度约束角色。"你是一个乐于助人的助手"往往比"你是一位世界知名专家，只使用技术术语说话，从不犯错"更好。过于具体的角色会限制 AI 的有用性。

**角色提示何时可能有帮助**：

-   你需要在许多输出中保持一致的语气
-   你在构建需要特定人设的应用
-   你想为复杂主题设定领域专业框架

**现代替代方案**：通常，明确说明你想要什么视角更有效："分析这个投资组合，重点关注风险承受能力和长期增长潜力"，而不是分配一个角色。

[在 Claude 中试试](https://claude.ai/redirect/claudedotcom.v1.3835d50d-4369-4677-a754-7e8b09428283/new)。

## 综合运用

你现在已经单独看过各项技术，但它们的真正威力在你有策略地组合它们时才会显现。提示词工程的艺术不在于使用所有可用的技术——而在于为你的具体需求选择正确的组合。

**组合多种技术的示例**：

```
Extract key financial metrics from this quarterly report and present them in JSON format.

I need this data for automated processing, so it's critical that your response contains ONLY valid JSON with no preamble or explanation.

Use this structure:
{
  "revenue": "value with units",
  "profit_margin": "percentage",
  "growth_rate": "percentage"
}

If any metric is not clearly stated in the report, use null rather than guessing.

Begin your response with an opening brace: {
```

这条提示词组合了：

-   明确的指令（确切提取什么）
-   上下文（为什么格式很重要）
-   示例结构（展示格式）
-   允许表达不确定性（不确定时使用 null）
-   格式控制（以左花括号开始）

## 选择正确的技巧

并非每条提示词都需要所有技巧。以下是一个决策框架：

**从这里开始：**

1.  你的请求是否清晰明确？如果否，先改进清晰度
2.  任务是否简单？只使用核心技巧（具体、清晰、提供上下文）
3.  任务是否需要特定格式？使用示例或预填
4.  任务是否复杂？考虑拆解它（链式）
5.  是否需要推理？使用扩展思考（如可用）或思维链

‍**技巧选择指南**：

| 如果你需要…… | 使用…… |
| --- | --- |
| 特定的输出格式 | 示例、预填或明确的格式指令 |
| 逐步推理 | 扩展思考（Claude 4.x）或思维链 |
| 复杂的多阶段任务 | 提示词链 |
| 透明的推理 | 带结构化输出的思维链 |
| 防止幻觉 | 允许说"我不知道" |

## 排查常见提示词问题

即使是用心良苦的提示词也可能产生意外结果。以下是常见问题及修复方法：

-   **问题：响应过于泛泛** → 解决方案：增加具体性、示例，或明确要求全面的输出。让 AI"超越基础"。
-   **问题：响应跑题或抓不住重点** → 解决方案：更明确地说明你的实际目标。提供你为何这样问的上下文。
-   **问题：响应格式不一致** → 解决方案：添加示例（few-shot）或使用预填来控制响应的开头。
-   **问题：任务太复杂，结果不可靠** → 解决方案：拆分为多个提示词（链式）。每条提示词应做好一件事。
-   **问题：AI 包含不必要的开场白** → 解决方案：使用预填或明确要求："跳过开场白，直奔答案。"
-   **问题：AI 编造信息** → 解决方案：明确允许它在不确定时说"我不知道"。
-   **问题：你想要实现时 AI 却建议修改** → 解决方案：明确说明动作："修改这个函数"，而不是"你能建议一些修改吗？"

**专业提示**：从简单开始，只在需要时增加复杂度。测试每一项添加，看它是否真的改善了结果。

## 应避免的常见错误

从这些常见陷阱中学习，以节省时间并改进你的提示词：

-   **不要过度设计**：更长、更复杂的提示词并不总是更好。
-   **不要忽视基础**：如果你的核心提示词不清晰或含糊，高级技巧也帮不上忙。
-   **不要假设 AI 会读心**：明确说明你想要什么。留下模糊之处会给 AI 误解的空间。
-   **不要一次使用所有技巧**：选择能解决你具体挑战的技巧。
-   **不要忘记迭代**：第一条提示词很少能完美奏效。测试并改进。
-   **不要依赖过时的技巧**：XML 标签和生硬的角色提示对现代模型已不那么必要。从明确、清晰的指令开始。

## 提示词工程的考量

### 处理长内容

实施高级提示词工程的一个挑战是，它会通过额外的 token 用量增加上下文开销。示例、多条提示词、详细指令——它们都会消耗 token，而上下文管理本身就是一项技能。

记住在合理的时候使用提示词工程技巧，并证明其使用的合理性。关于有效管理上下文的全面指导，请查看我们关于[上下文工程](https://www.anthropic.com/engineering/effective-context-engineering-for-ai-agents)的博客文章。

**上下文感知的改进**：包括 Claude 4.x 在内的现代 AI 模型已显著提升上下文感知能力，有助于解决历史上模型难以同等关注长上下文所有部分的"中间迷失"问题。

**任务拆分为何仍然有帮助**：即使有这些改进，将大任务拆分为更小的离散块仍是一项有价值的技术——不是因为上下文限制，而是因为它帮助模型在非常具体的要求和范围内专注于做到最好。一个有明确边界的聚焦任务，始终比试图在单条提示词中完成多个目标能产生更高质量的结果。

**策略**：处理长上下文时，清晰地组织信息，将最关键细节放在开头或结尾。处理复杂任务时，考虑将其拆分为聚焦的子任务是否能提高每个组成部分的质量和可靠性。

### 提示词工程示例：好的提示词长什么样

提示词工程是一项技能，需要几次尝试才能掌握。知道你是否做对的唯一方法就是测试并观察。第一步就是自己动手试试。你会立刻看到使用与不使用我们这里介绍的提示词技巧的查询之间的差异。

要真正磨练你的提示词工程技能，你需要客观地衡量提示词的有效性。好消息是，这正是我们在 [anthropic.skilljar.com](https://anthropic.skilljar.com/claude-with-the-anthropic-api) 上的提示词工程课程所涵盖的内容。

**快速评估提示**：

-   输出是否符合你的具体要求？
-   你是一次尝试就得到结果，还是需要多次迭代？
-   多次尝试的格式是否一致？
-   你是否避免了上面列出的常见错误？

## 最后的建议

提示词工程归根结底是关于沟通：说出最能帮助 AI 清晰理解你意图的语言。从本指南前面介绍的核心技巧开始。持续使用它们，直到它们成为你的第二天性。只有当高级技巧能解决特定问题时，才将它们叠加进来。

记住：最好的提示词不是最长或最复杂的。而是以最少必要结构可靠实现你目标的那个。随着练习，你会培养出哪种技巧适合哪种情况的直觉。

对于你希望应用于每个会话而非每条提示词的指令，请将它们移入 [CLAUDE.md 文件、Skills 或其他引导方法](https://claude.com/resources/articles/steering-claude-code-skills-hooks-rules-subagents-and-more)。不过，向上下文工程的转变并不会削弱提示词工程的重要性。

事实上，提示词工程是上下文工程中的一个基本构建块。每条精心设计的提示词都会成为塑造 AI 行为的更大上下文的一部分，与对话历史、附件和系统指令一起，共同创造更好的结果。

今天就[在 Claude 中开始提示](https://claude.ai/redirect/claudedotcom.v1.3835d50d-4369-4677-a754-7e8b09428283/new)吧。

## 其他资源

-   [提示词工程文档](https://platform.claude.com/docs/en/build-with-claude/prompt-engineering/overview)
-   [交互式提示词工程教程](https://github.com/anthropics/prompt-eng-interactive-tutorial)
-   [提示词工程课程](https://anthropic.skilljar.com/claude-with-the-anthropic-api)
-   [上下文工程指南](https://www.anthropic.com/engineering/effective-context-engineering-for-ai-agents)
