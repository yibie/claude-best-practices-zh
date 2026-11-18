---
title: "用 Skills 构建智能体：为智能体装备专业化工作能力"
source_url: "https://claude.com/resources/articles/building-agents-with-skills-equipping-agents-for-specialized-work"
publisher: "claude.com"
type: "blogPost"
date: "2026-01-22"
products: ["Claude Code"]
read_time: 12
excerpt: "Skills 将领域专业知识打包成智能体可以访问和应用的文件——把通用智能体转变为知识渊博的专家，胜任真实工作。"
fetched_at: "2026-11-18"
---

# 用 Skills 构建智能体：为智能体装备专业化工作能力

过去一年发生了很多变化。MCP 成为智能体连接的标准，并迅速获得行业领导者和开发者社区的采用。[Claude Code 正式发布](https://www.anthropic.com/news/claude-3-7-sonnet)，作为通用编程智能体。我们还发布了 [Claude Agent SDK](https://www.anthropic.com/engineering/building-agents-with-the-claude-agent-sdk)，它现在开箱即用地提供了一个可用于生产的智能体。

但在构建和部署这些智能体的过程中，我们不断遇到同一个缺口：智能体拥有智能和能力，但并不总是具备有效处理真实工作所需的专业知识。这促使我们[创建了 Agent Skills](https://www.anthropic.com/engineering/equipping-agents-for-the-real-world-with-agent-skills)。Skills 是组织化的文件集合，将领域专业知识——工作流、最佳实践、脚本——打包成智能体可以访问和应用的格式。它们将一个能力出众的通才转变为知识渊博的专家。

在本文中，我们将解释为什么我们不再构建专用智能体，转而构建 Skills，以及这一转变如何改变我们对扩展智能体能力的思考方式。

## **新范式：代码就是你所需要的一切**

我们曾经认为，不同领域的智能体会看起来非常不同。一个编程智能体、一个研究智能体、一个用于财务、一个用于营销——每一个似乎都需要自己的工具和脚手架。业界最初接受了这种领域专用智能体的模式。但随着模型智能的提升和智能体能力的进步，我们转向了另一种方法。



我们逐渐认识到，代码不仅仅是一个用例，更是智能体完成几乎任何数字工作的接口。Claude Code 是一个编程智能体，但也是一个恰好通过代码工作的通用智能体。

设想用 Claude Code 生成一份财务报告。它可以调用 API 进行研究、将数据存储在文件系统中、用 Python 进行分析，并综合出洞察。所有这些都通过代码完成。脚手架变得像 bash 和文件系统一样简单。

但通用能力并不等同于专业知识。当我们开始将 Claude Code 用于真实工作时，一个缺口浮现了出来。

## **缺失的一环：领域专业知识**

你希望谁来帮你报税：一个从第一性原理出发搞明白的数学天才，还是一个处理过数千份申报表的资深税务专业人士？大多数人会选择税务专业人士。不是因为他们更聪明，而是因为他们拥有合适的专业知识。

如今的智能体就像那个数学天才：擅长对新情况进行推理，但往往缺乏资深专业人士积累的专业知识。在适当的指导下，它们能做出惊人的事情。然而，它们往往缺少重要的上下文，无法轻松吸收你所在组织的专业知识，也不会自动从重复任务中学习。

Skills 通过将领域专业知识打包成智能体可以逐步访问和应用的格式，弥合了这一缺口。

## **什么是 Agent Skills？**

Skills 为智能体打包领域专业知识和程序性知识。

```
anthropic_brand/
├── SKILL.md
├── docs.md
├── slide-decks.md
└── apply_template.py
```

Skills 的简洁是有意为之的。文件是一种通用原语，能与你已有的工具配合使用。你可以用 Git 对它们进行版本管理，将它们存储在 Google Drive 中，并与团队共享。这种简洁性也意味着 Skill 的创建不限于工程师。产品经理、分析师和领域专家已经在构建 Skills 来将他们的工作流编码化。

## **渐进式披露**

Skills 可以包含大量信息。为了保护上下文窗口并使 Skills 可组合，它们采用渐进式披露：在运行时，只有元数据（YAML frontmatter 中的名称和描述）会展示给模型。

```
---
name: Anthropic Brand Style Guidelines
description: Anthropic's official brand colors and typography…
---
```

如果 Claude 判断需要某个 Skill，它会读取完整的 SKILL.md 文件。如需更多细节，Skills 可以包含一个 references/ 目录，其中的支持文档仅在需要时加载。

这种三层方法意味着你可以为智能体装备数百个 Skills 而不会压垮其上下文窗口——元数据约 50 个 token，完整的 SKILL.md 文件约 500 个 token，参考文件 2,000+ 个 token 且仅在特别需要时加载。

## **Skills 可以将脚本作为工具包含在内**

传统工具存在问题：有些工具的说明写得不好，模型无法总是修改或扩展它们，而且它们往往会膨胀上下文窗口。另一方面，代码是自文档化的、可修改的，而且根本不需要放在上下文中。

这里有一个真实的例子：我们不断看到 Claude 编写相同的脚本来为幻灯片应用 Anthropic 样式。于是我们让 Claude 把它保存为供自己使用的工具：

```
# anthropic/brand_styling/apply_template.py
import sys
from pptx import Presentation

if len(sys.argv) != 2:
    print("USAGE: apply_template.py <pptx>")
    sys.exit(1)

prs = Presentation(sys.argv[1])
for slide in prs.slides:
    ...
```

slide-decks.md 中对应的文档只是引用了这个脚本：

```
## Anthropic Slide Decks
- Intro/outro slides
  - background color: `#141413`
  - foreground color: oat
- Section slides:
  - background color: `#da7857`
  - foreground color: `#141413`

Use the `./apply_template.py` script to update a pptx file in-place.
```

## **Skills 生态系统**

Skills 生态系统迅速崛起，到目前为止我们看到了三种主要类型的 Skills 正在被构建：

### **基础 Skills**

这些提供每个人都需要的基础能力：处理文档、电子表格、演示文稿等。它们编码了文档生成和操作的最佳实践。你可以通过探索[我们公共仓库中的基础 Skills](https://github.com/anthropics/skills/tree/main/skills/public) 来了解这在实践中的样子。

### **合作伙伴 Skills**

随着 Skills 标准化了智能体与专业能力的交互方式，各公司正在构建 Skills 使其服务可被智能体访问。[K-Dense](https://github.com/K-Dense-AI/claude-scientific-skills)、[Browserbase](https://github.com/browserbase/agent-browse)、[Notion](https://www.notion.so/notiondevs/Notion-Skills-for-Claude-28da4445d27180c7af1df7d8615723d0) 以及[许多其他公司](https://claude.com/resources/articles/organization-skills-and-directory)正在创建直接集成其服务的 Skills，在特定领域扩展 Claude 的能力，同时保持 Skills 格式的简洁性。

### **企业 Skills**

组织构建专有的 Skills，编码其内部流程和领域专业知识。Skills 有助于捕获特定的工作流、合规要求和机构知识，使智能体对企业工作有用。

## **我们看到的趋势**

随着 Skills 采用的增长，一些模式正在浮现，指向这一范式可能的发展方向。这些趋势塑造了我们对 Skill 设计的思考，以及我们正在构建的、支持 Skill 开发者的工具。

### **复杂度不断提升**

早期的 Skills 是简单的文档参考。现在我们看到复杂的多步骤工作流，跨多个工具协调数据检索、复杂计算和格式化输出。

-   **简单**："状态报告撰写器"（约 100 行）- 模板和格式化
-   **中等**："财务模型构建器"（约 800 行）- 数据检索、用 Python 进行 Excel 建模
-   **复杂**："RNA 测序流水线"（2,500+ 行）- 协调 HISAT2、StringTie、DESeq2 分析

### **Skills 与 MCP**

[Skills 和 MCP 服务器自然地协同工作](https://claude.com/resources/articles/extending-claude-capabilities-with-skills-mcp-servers)。一个竞争分析 Skill 可以协调网络搜索、通过 MCP 访问内部数据库、Slack 消息历史和 Notion 页面，来综合出一份全面的报告。

### **非开发者采用**

Skill 创建正在从工程师扩展到产品经理、分析师和各学科的领域专家。他们可以使用 skill-creator 工具在 30 分钟内创建并测试他们的第一个 Skill，该工具会以交互方式引导他们完成整个过程。我们正在努力让 Skill 创建更加易用，改进工具和模板，让任何人都能捕获和分享专业知识。

## **完整架构**

将所有部分整合在一起，新兴的智能体架构看起来是以下部分的组合：

1.  **智能体循环**：决定下一步做什么的核心推理系统
2.  **智能体运行时**：执行环境（代码、文件系统）
3.  **MCP 服务器**：与外部工具和数据源的连接
4.  **Skills 库**：领域专业知识和程序性知识



每一层都有明确的目的：循环负责推理，运行时负责执行，MCP 负责连接，Skills 负责引导。这种分离使系统易于理解，并允许每个部分独立演进。

设想一下，当你向这个架构中添加一个 Skill 时会发生什么。[前端设计 Skill](https://github.com/anthropics/claude-code/tree/main/plugins/frontend-design) 能即时转变 Claude 的前端能力。它提供关于排版、色彩理论和动画的专业指导，仅在构建 Web 界面时激活。渐进式披露意味着它只在相关时加载。添加新能力变得简单直接。

## **将 Skills 部署到新垂直领域**

这种通用智能体配备 MCP 服务器和 Skills 的新兴模式，已经在帮助我们将 Claude 部署到新的垂直领域。

### **金融服务**

在发布 Skills 后不久，我们为[金融服务领域的 Claude](https://www.anthropic.com/news/claude-for-financial-services) 增强了 Skills，使 Claude 对金融专业人士更有用：

-   **DCF 模型构建器**：构建贴现现金流模型，包含正确的 WACC 计算和敏感性分析
-   **可比公司分析**：生成包含相关倍数和基准比较的可比公司表格
-   **财报分析**：处理季度业绩并创建投资更新报告
-   **首次覆盖**：构建包含财务模型的综合研究报告
-   **尽职调查**：用标准化框架构建并购分析
-   **推介材料**：按照行业标准创建客户演示文稿

### **医疗与生命科学**

我们还为[医疗与生命科学产品](https://www.anthropic.com/news/healthcare-life-sciences)增强了 Skills，使 Claude 对研究人员、临床医生和医疗开发者更有用：

-   **生物信息学套件**：用于 scVI-tools 和 Nextflow 部署的 Skills，对管理基因组流水线和单细胞 RNA 测序至关重要
-   **临床试验方案生成**：加速临床研究的方案开发
-   **科学问题选择**：帮助研究人员识别和构建有影响力的研究问题
-   **FHIR 开发**：帮助开发者编写更准确的健康数据互操作性代码，以更少的错误更快地连接医疗系统
-   **事先授权审查**：通过交叉引用保险覆盖要求、临床指南和患者记录，减轻行政负担，加速患者获得所需护理

## **标准化 Agent Skills**

为了实现这一愿景，我们将 [Agent Skills](https://agentskills.io/) 发布为开放标准。与 MCP 一样，我们相信 Skills 应该可以跨工具和平台移植。无论你使用的是 Claude 还是其他 AI 平台，同一个 Skill 都应该能工作。我们一直在与生态系统成员合作制定该标准，我们很高兴看到早期的采用。

当有人第一次开始使用 AI 智能体时，它应该已经知道你和你的团队关心什么，因为 Skills 捕获并传递了这些专业知识。随着这一生态系统的成长，社区中其他人构建的 Skill 可以让你的智能体更有用、更可靠、更有能力——无论你使用的是哪个 AI 平台。

## **入门**

我们正逐渐形成一种通用智能体的架构，而 Skills 提供了一种发布和分享新能力的范式。真正的价值来自我们共同构建的集体知识库：捕获专业知识、跨团队传递它，并让每一个智能体都比上一个更有能力。

**资源：**

-   [Don’t Build Agents, Build Skills Instead](https://youtu.be/CEvIs9y1uog?si=yhYQH-ZTX0DfNdtm)（YouTube 视频）
-   [Skills 文档](https://platform.claude.com/docs/en/agents-and-tools/agent-skills/overview)
-   [GitHub 仓库](https://github.com/anthropics/skills)
-   [Skills cookbook](https://platform.claude.com/cookbook/skills-notebooks-01-skills-introduction)
-   [在 Claude 中使用 Skills](https://support.claude.com/en/articles/12512180-using-skills-in-claude)
-   [Skills API 快速入门](https://platform.claude.com/docs/en/build-with-claude/skills-guide)
-   [Skills 最佳实践文档](https://platform.claude.com/docs/en/agents-and-tools/agent-skills/best-practices)

### **致谢：**

Barry Zhang, Mahesh Murag, Keith Lazuka, Ryan Whitehead
