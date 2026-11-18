---
title: "通过 Skills 改进前端设计"
source_url: "https://claude.com/resources/articles/improving-frontend-design-through-skills"
publisher: "claude.com"
type: "blogPost"
date: "2025-11-12"
products: ["Claude apps"]
read_time: 13
excerpt: "使用 Claude 和 Skills 构建更丰富、更定制化前端设计的最佳实践。"
fetched_at: "2026-11-18"
---

# 通过 Skills 改进前端设计

你可能会注意到，当你让 LLM 在没有指导的情况下构建落地页时，它几乎总是会采用 Inter 字体、白底上的紫色渐变以及极简的动画。

问题出在哪？[分布收敛（Distributional convergence）](https://en.wikipedia.org/wiki/Convergence_of_random_variables)。在采样过程中，模型根据训练数据中的统计模式预测 token。安全的设计选择——那些普遍适用、不会冒犯任何人的选择——主导了网络训练数据。在没有方向指引的情况下，Claude 会从这个高概率中心进行采样。

对于构建面向客户产品的开发者来说，这种千篇一律的审美会削弱[品牌识别度](https://claude.com/resources/articles/claude-design-stays-on-brand-for-daily-work)，并使 AI 生成的界面一眼就能被认出——从而被轻易否定。

### 可引导性挑战

好消息是，Claude 在[正确的提示](https://claude.com/resources/articles/best-practices-for-prompt-engineering)下具有高度的可引导性。告诉 Claude「避免使用 Inter 和 Roboto」或「使用氛围感背景而不是纯色」，结果会立即改善。这种对指导的敏感性是一种特性；这意味着 Claude 能够适应不同的设计语境、约束和审美偏好。

但这带来了一个实际挑战：任务越专业，你需要提供的上下文就越多。对于前端设计，有效的指导涵盖排版原则、色彩理论、动画模式和背景处理。你需要在多个维度上明确指定要避免哪些默认值、偏好哪些替代方案。

你可以把这一切都塞进系统提示词里，但那样每个请求——调试 Python、分析数据、写邮件——都会携带前端设计上下文。问题就变成了：如何恰好在需要时向 Claude 提供领域特定的指导，而不为不相关的任务带来永久的上下文开销？

## **Skills：动态上下文加载**

这正是 [Skills](https://www.anthropic.com/news/skills) 的设计目的：按需提供专业上下文，而不产生永久开销。[一个 skill](https://claude.com/resources/articles/skills-explained) 是一个文档（通常是 Markdown），包含指令、约束和领域知识，存储在指定目录中，Claude 可以通过简单的文件读取工具访问。Claude 可以利用这些 Skills 在运行时动态加载所需信息，逐步增强其上下文，而不是预先加载所有内容。

当配备了这些 Skills 以及读取它们所需的工具后，Claude 可以根据手头的任务自主识别并加载相关的 Skills。例如，当被要求构建落地页或创建 React 组件时，Claude 可以加载前端设计 skill 并即时应用其指令。这是核心的心智模型：Skills 是按需激活的提示词和上下文资源，为特定任务类型提供专业指导，而不产生永久的上下文开销。

这让开发者能够收获 Claude 可引导性的好处，而不必通过将跨多个任务的各种指令塞进系统提示词来使上下文窗口过载。正如我们[之前所解释的](https://www.anthropic.com/engineering/effective-context-engineering-for-ai-agents)，上下文窗口中过多的 token 会导致性能下降，因此保持上下文窗口内容精简和聚焦对于激发模型的最佳表现极其重要。Skills 通过使有效的提示词可复用且情境化来解决这个问题。

## **通过提示获得更好的前端输出**

我们可以通过创建一个前端设计 skill，在不产生永久上下文开销的情况下，从 Claude 获得显著更好的 UI 生成结果。核心洞见是像前端工程师那样思考前端设计。你越能将审美改进映射到可实施的前端代码，Claude 就越能执行得好。

利用这一洞见，我们确定了几个有针对性的提示效果良好的领域：排版、动画、背景效果和主题。这些都能清晰地转化为 Claude 可以编写的代码。在提示词中实施这些并不需要详细的技术指令，只需使用有针对性的语言，引导模型更批判性地思考这些设计维度，就足以激发更强的输出。这与我们在[上下文工程](https://www.anthropic.com/engineering/effective-context-engineering-for-ai-agents)博客文章中所提供的指导密切相关——在正确的高度上提示模型，避免两个极端：低高度的硬编码逻辑（如指定确切的十六进制颜色代码）和假设共享上下文的模糊高高度指导。

### **排版**

为了看到实际效果，让我们先来看排版作为我们可以通过提示影响的一个维度。下面的提示词专门引导 Claude 使用更有趣的字体：

```
<use_interesting_fonts>
Typography instantly signals quality. Avoid using boring, generic fonts.

Never use: Inter, Roboto, Open Sans, Lato, default system fonts

Here are some examples of good, impactful choices:
- Code aesthetic: JetBrains Mono, Fira Code, Space Grotesk
- Editorial: Playfair Display, Crimson Pro
- Technical: IBM Plex family, Source Sans 3
- Distinctive: Bricolage Grotesque, Newsreader

Pairing principle: High contrast = interesting. Display + monospace, serif + geometric sans, variable font across weights.

Use extremes: 100/200 weight vs 800/900, not 400 vs 600. Size jumps of 3x+, not 1.5x.

Pick one distinctive font, use it decisively. Load from Google Fonts.
</use_interesting_fonts>
```

**使用基础提示词生成的输出：**



**使用基础提示词加排版部分生成的输出**



‍

有趣的是，使用更有趣字体的指令似乎也鼓励模型改进设计的其他方面。

仅排版一项就能带来显著改善，但字体只是一个维度。整个界面的统一审美呢？

### **主题**

我们可以通过提示影响的另一个维度是受知名主题和美学启发的设计。Claude 对流行主题有丰富的理解；我们可以利用这一点来传达我们希望前端体现的特定美学。以下是一个示例：

```
<always_use_rpg_theme>
Always design with RPG aesthetic:
- Fantasy-inspired color palettes with rich, dramatic tones
- Ornate borders and decorative frame elements
- Parchment textures, leather-bound styling, and weathered materials
- Epic, adventurous atmosphere with dramatic lighting
- Medieval-inspired serif typography with embellished headers
</always_use_rpg_theme>
```

这产生了以下 RPG 主题的 UI：



排版和主题表明有针对性的提示是有效的。但手动指定每个维度很繁琐。如果我们能把所有这些改进组合成一个可复用的资产呢？

### **一个通用提示词**

同样的原则延伸到其他设计维度：为动效（动画和微交互）提供提示能增加静态设计所缺乏的精致感，而引导模型选择更有趣的背景则能创造深度和视觉趣味。这正是综合性 skill 大放异彩的地方。

将这一切整合在一起，我们开发了一个约 400 token 的提示词——足够紧凑，加载时不会膨胀上下文（即使作为 skill 加载时也是如此）——它能显著改善排版、色彩、动效和背景方面的前端输出：

```
<frontend_aesthetics>
You tend to converge toward generic, "on distribution" outputs. In frontend design,this creates what users call the "AI slop" aesthetic. Avoid this: make creative,distinctive frontends that surprise and delight.

Focus on:
- Typography: Choose fonts that are beautiful, unique, and interesting. Avoid generic fonts like Arial and Inter; opt instead for distinctive choices that elevate the frontend's aesthetics.
- Color & Theme: Commit to a cohesive aesthetic. Use CSS variables for consistency. Dominant colors with sharp accents outperform timid, evenly-distributed palettes. Draw from IDE themes and cultural aesthetics for inspiration.
- Motion: Use animations for effects and micro-interactions. Prioritize CSS-only solutions for HTML. Use Motion library for React when available. Focus on high-impact moments: one well-orchestrated page load with staggered reveals (animation-delay) creates more delight than scattered micro-interactions.
- Backgrounds: Create atmosphere and depth rather than defaulting to solid colors. Layer CSS gradients, use geometric patterns, or add contextual effects that match the overall aesthetic.

Avoid generic AI-generated aesthetics:
- Overused font families (Inter, Roboto, Arial, system fonts)
- Clichéd color schemes (particularly purple gradients on white backgrounds)
- Predictable layouts and component patterns
- Cookie-cutter design that lacks context-specific character

Interpret creatively and make unexpected choices that feel genuinely designed for the context. Vary between light and dark themes, different fonts, different aesthetics. You still tend to converge on common choices (Space Grotesk, for example) across generations. Avoid this: it is critical that you think outside the box!
</frontend_aesthetics>
```

在上面的示例中，我们首先给 Claude 提供关于问题和我们试图解决什么的一般上下文。我们发现给模型这种高层次的上下文是一种有用的提示策略，可以校准输出。然后我们确定之前讨论的改进设计的各个向量，并给出有针对性的建议，鼓励模型在所有这些维度上更具创造性地思考。

我们还在末尾加入了额外的指导，以防止 Claude 收敛到另一个局部最大值。即使有明确的指令避免某些模式，模型也可能默认选择其他常见选项（例如排版上的 Space Grotesk）。最后「跳出框框思考」的提醒强化了创造性变化。

### **对前端设计的影响**

激活此 skill 后，Claude 的输出在多种前端设计类型上都有所改善，包括：

**示例 1：SaaS 落地页**



AI 生成的 SaaS 落地页，使用通用的 Inter 字体、紫色渐变和标准布局。未使用 Skills。



AI 生成的前端，使用与上图相同的提示词并加上前端 skill，现在具有独特的排版、统一的配色方案和分层背景。

**示例 2：博客布局**



AI 生成的博客布局，使用默认系统字体和纯白背景。未使用 Skills。



AI 生成的博客布局，使用相同的提示词以及前端 skill，采用编辑风格的字体、氛围深度和精致的间距。

**示例 3：管理后台**



AI 生成的管理后台，使用标准 UI 组件，视觉层次极少。未使用 Skills。

‍



AI 生成的管理后台，使用粗体排版、统一的深色主题和有目的的动效，使用相同的提示词并加上前端 skill。

## **通过 Skills 改进 [claude.ai](http://claude.ai/redirect/claudedotcom.v1.3f5f95af-5fa6-484b-add2-30aac3e55e56) 中的 Artifacts 质量**

设计品味并不是唯一的限制。Claude 在构建 Artifacts 时还面临架构约束。[Artifacts](https://support.claude.com/en/articles/9487310-what-are-artifacts-and-how-do-i-use-them) 是 Claude 创建并与你的对话一起显示的交互式、可编辑内容（如代码或文档）。

除了上面探讨的设计品味问题之外，Claude 还有另一个默认行为，限制了它在 [claude.ai](http://claude.ai/redirect/claudedotcom.v1.3f5f95af-5fa6-484b-add2-30aac3e55e56) 中生成出色前端 Artifacts 的能力。目前，当被要求创建前端时，Claude 只是构建一个包含 CSS 和 JS 的单一 HTML 文件。这是因为 Claude 理解前端必须是单一 HTML 文件才能正确渲染为 Artifacts。

正如你会预期一个人类开发者如果只能在一个文件中编写 HTML/CSS/JS，就只能创建非常基础的前端一样，我们假设如果给 Claude 使用更丰富工具的指令，它就能生成更令人印象深刻的前端 Artifacts。

这促使我们创建了一个 [web-artifacts-builder skill](https://github.com/anthropics/skills/blob/main/web-artifacts-builder/SKILL.md)，它利用 Claude [使用计算机](https://claude.com/resources/articles/create-files)的能力，引导 Claude 使用多个文件和现代 Web 技术（如 [React](https://react.dev/)、[Tailwind CSS](https://tailwindcss.com/) 和 [shadcn/ui](https://ui.shadcn.com/)）来构建 Artifacts。在底层，该 skill 暴露了一些脚本，用于 (1) 帮助 Claude 高效地搭建一个基本的 React 仓库，(2) 在编辑完成后使用 [Parcel](https://parceljs.org/) 将所有内容打包成单个文件，以满足单 HTML 文件的要求。这是 Skills 的核心优势之一——通过让 Claude 访问执行样板操作的脚本，Claude 能够在提高可靠性和性能的同时最小化 token 用量。

借助 web-artifacts-builder skill，Claude 可以利用 shadcn/ui 的表单组件和 Tailwind 的响应式网格系统来创建更全面的 Artifact。

**示例 1：白板应用**

例如，当被要求创建一个白板应用而没有 web-artifacts-builder skill 时，Claude 输出了一个非常基础的界面：



另一方面，使用新的 web-artifacts-builder skill 时，Claude 开箱即用地生成了一个更简洁、功能更丰富的应用，包括绘制不同的形状和文本：



‍

**示例 2：任务管理应用**

同样地，当被要求创建一个任务管理应用时，没有该 skill 的情况下，Claude 生成了一个功能可用但非常简陋的应用：



使用该 skill 后，Claude 生成了一个开箱即用功能更丰富的应用。例如，Claude 包含了一个「创建新任务」表单组件，允许用户为任务设置关联的分类和截止日期：





‍

要在 [Claude.ai](http://claude.ai/redirect/claudedotcom.v1.3f5f95af-5fa6-484b-add2-30aac3e55e56) 中试用这个新 skill，只需启用该 skill，然后在构建 Artifacts 时让 Claude「使用 web-artifacts-builder skill」。

## **通过 Skills 优化 Claude 的前端设计能力**

这个前端设计 skill 展示了一个关于语言模型能力的更广泛原则：模型通常具有超出其默认表现的能力。Claude 拥有强大的设计理解力，但分布收敛在没有指导的情况下掩盖了它。虽然你可以将这些指令添加到系统提示词中，但这意味着每个请求都携带前端设计上下文，即使这些知识与手头任务无关。相反，使用 Skills 将 Claude 从一个需要持续指导的工具转变为一个为每个任务带来领域专业知识的工具。

Skills 也是高度可定制的——你可以创建适合你特定需求的自己的 Skills。这允许你定义想要固化到 skill 中的确切原语，无论是你公司的设计系统、特定的组件模式，还是行业特定的 UI 惯例。通过将这些决策编码到一个 Skill 中，你将智能体思维的组成部分转化为整个开发团队可以利用的可复用资产。该 skill 成为持续存在并扩展的组织知识，确保跨项目的一致质量。

这种模式超越了前端工作。任何 Claude 尽管拥有更广泛理解却产生通用输出的领域，都是 Skill 开发的候选对象。方法是一致的：识别收敛的默认值，提供具体的替代方案，在正确的高度构建指导，并通过 Skills 使其可复用。

对于前端开发，这意味着 Claude 可以在无需逐请求提示词工程的情况下生成独特的界面。要开始使用，请探索我们的[前端设计 cookbook](https://github.com/anthropics/claude-cookbooks/blob/main/coding/prompting_for_frontend_aesthetics.ipynb) 或试用我们在 Claude Code 中的[新前端设计插件](https://github.com/anthropics/claude-code/tree/main/plugins/frontend-design)。

**受到启发了吗？要创建你自己的前端 skills，请查看我们的 [skill-creator](https://github.com/anthropics/skills/tree/main/skill-creator)。**

‍

**致谢**
由 Anthropic 应用 AI 团队撰写：Prithvi Rajasekaran、Justin Wei 和 Alexander Bricken，以及我们的市场合作伙伴 Molly Vorwerck 和 Ryan Whitehead。

‍
