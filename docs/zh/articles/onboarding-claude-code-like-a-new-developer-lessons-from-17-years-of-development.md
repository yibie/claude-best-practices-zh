---
title: "像对待新开发者一样上手 Claude Code：来自 17 年开发经验的启示"
source_url: "https://claude.com/resources/articles/onboarding-claude-code-like-a-new-developer-lessons-from-17-years-of-development"
publisher: "claude.com"
type: "blogPost"
date: "2026-04-28"
products: ["Claude Code"]
read_time: 10
excerpt: "MacCoss Lab 用这套方法让新开发者上手 70 万行的代码库，它同样适用于 Claude Code。Brendan MacLean 是一位 Claude 开发者大使，他所在的实验室参与了我们的 Claude for Open Source 计划，以下是他采用的做法。"
fetched_at: "2026-11-18"
---

# 像对待新开发者一样上手 Claude Code：来自 17 年开发经验的启示
[Skyline](https://skyline.ms/home/software/Skyline/wiki-page.view?name=team) 是一款开源蛋白质分析软件，由华盛顿大学 MacCoss Lab 的首席开发者 Brendan MacLean 维护，自 2008 年起持续开发至今。Skyline 帮助研究人员检测并定量血浆和组织等样本中的蛋白质，这对生物标志物发现、疾病研究和药物开发至关重要。MacCoss Lab 的代码库包含 70 万行以上的 C# 代码，由一个小团队维护了 17 年，每晚运行 20 万项以上的自动化测试。



一幅用 Blender 制作的西雅图天际线 3D 插画，代表华盛顿大学 MacCoss Lab 的所在地，Brendan MacLean 和他的团队自 2008 年起在这里开发和维护 Skyline。Claude 帮助 Brendan 在背景中加上了 Claude 标志。图片由 MacCoss lab 提供。

近三十年来，Brendan 一直是 Skyline 的纽带，带领数十名本科生、研究生和博士后融入实验室。\*

随着开发者的加入与离开，代码库吸收了他们的贡献。到 2024 年，它已背负起一个长期项目常见的种种负担。随着人员更替，某些区域变得无人敢碰。

在数十年培养实验室成员的过程中，Brendan 深知如何让研究人员快速熟悉实验室庞大的代码库。但他没想到的是，把这套方法用在 AI 工具上，竟能让 Skyline 的代码库重新变得可管理。

## 同样的上手问题，不同类型的开发者

Brendan 曾怀疑，现代 AI 编程工具能否像一款专为 C# 语言和环境打造的工具那样理解 C# 代码。

早期在浏览器中使用 Claude.ai 的实验印证了这一判断。他会描述一个问题，得到回复，然后把整个 C# 文件复制回项目，把范围限制在他无需引用项目代码就能描述的封闭问题上。

"一旦改动变得更细碎，这就变得非常费劲，"Brendan 说。

每次与 Claude.ai 的会话都像是从零开始，因为它不了解 Skyline 是什么、各组件之间如何关联，也不了解 17 年的开发积累了什么。

这正是 Brendan 在带领新开发者上手时遇到的相同体验，于是他有了一个想法。

"我可以像对待一名实习开发者那样，通过 Claude Code 把 Claude 引入我的大型项目：讲清楚足够的内容，让它完成一个成功的有限项目，并为下一次迭代产出更好的上下文，"Brendan 说。

他把所有 AI 上下文移入一个独立仓库 [pwiz-ai](https://github.com/ProteoWizard/pwiz-ai)，与代码库分开存放，这样它就能适用于所有分支和时间点。根目录下的 `CLAUDE.md` 文件负责环境搭建，并指引 Claude 找到相关文档：可以把它看作"地形概览"，而非专业知识本身。

专业知识则放在 [Skills（技能）](https://agentskills.io/home) 中，这是一种为智能体赋予能力和专业知识的开放格式。例如，他的 `debugging` 技能旨在把 Claude 从他所称的"猜测加试错"模式中拉出来，推动它在尝试任何修复之前先做根因分析。Skills 可以手动或自动触发；Brendan 为他最关键的一些技能设置了明确的触发条件——`debugging` 技能的描述写着"在调查缺陷、失败或异常行为时始终加载"。



pwiz-ai 仓库结构，展示上下文、Skills 和 MCP 集成如何连接到 Skyline 的代码库。图片由 MacCoss lab 提供。

上下文建立之后，教 Claude 熟悉调试代码库的种种细节所需的成本就大幅降低了。Claude 已经知道代码是做什么的。交互从理解开始，而不是从零开始。

"曾经看似一大顾虑的问题——'Claude 无法真正了解我的大型项目'——变得越来越清晰：上下文不过是又一件需要维护和扩充的产物，"Brendan 说。

## 减少技术债，加速开发

Skyline 中一个为期一年、旨在构建 Files View 面板的项目——这是一个新界面，用于显示所有与文档相关的文件，并支持文件系统监控和拖放整理——在负责它的开发者离开后一直未完成。Brendan 用 Claude Code 接手了它。

两周后，项目完成了，所有最终提交都由 Claude 共同署名。

"以那种状态搁置的先前工作，通常最终都被丢弃了，"Brendan 说。在学术实验室里，开发者流动频繁——研究生毕业、博士后离开、实习生夏天结束就走。过去，任何进行中的工作都会永远被搁置。

三年前，Brendan 在失去维护 Skyline 夜间测试管理模块的开发者后，停止为该模块添加功能。该模块用 Java 编写，是 LabKey Server 科学数据门户的一部分。最近，在让一位熟练的 LabKey 开发者用 Claude Code 编写了搭建文档之后，Brendan 花了不到一天时间，就加上了他多年来一直想要的功能，并用 CSS 更新了页面布局——过去他只会请设计师来做这些。

新的基础设施也随之而来。

Skyline 2000 多张教程图片的截图复现现已完全自动化，且几乎 100% 可复现；借助 Claude Code 扩展出了仅显示差异的视图和像素变化放大功能，以及一个由 Claude 用 C# 编写的 MCP 服务器，让它能够"看到"这些差异。Claude Code 每天早上生成一份每日摘要，显示测试失败、异常和未关闭的支持讨论串，这些信息从 Skyline 的夜间测试基础设施中提取，在 Brendan 坐下来工作之前就送到他的收件箱。

Claude 还用 Python 编写了 MCP 服务器来实现这一能力，数据来自 LabKey Server 上三路相互独立的关系数据流、团队邮件，以及 GitHub 上带发布标签的代码。



一封由 Claude Code 自动生成的每日摘要邮件，数据来自 Skyline 的夜间测试基础设施。图片由 MacCoss lab 提供。

Brendan 的开发者们现在几乎不自己写代码，而主要是在指挥 Claude Code，并用这个工具自主生成自动化脚本和 MCP 实现。例如，实验室里一位曾对智能体式编程工具持怀疑态度的开发者，构建并发布了一个新的绘图扩展——一个用于可视化离子淌度数据的 mobilogram 面板——并把功劳归于 Claude Code。



mobilogram 面板用 Claude Code 构建，将离子淌度数据与质谱结果并排可视化。图片由 MacCoss lab 提供。

"我看到几乎每个人都在接手有趣的新功能，而这些功能他们过去可能觉得自己被其他工作埋没，根本无暇尝试，"Brendan 说。

## 给处理遗留代码库的开发者的建议

基于 17 年带领开发者上手的经验，以及一年多来将同样的方法应用于 Claude Code，以下是 Brendan 想对处理遗留代码库的开发者说的话。

**上下文是你最好的朋友**

Claude 生成的待办清单和计划不会跨会话保留。[上下文](https://www.anthropic.com/engineering/effective-context-engineering-for-ai-agents)才是会保留的东西，而它必须被刻意维护。这是大多数开发者跳过的部分，也是大多数开发者的成效停滞不前的原因。

"要明白，如果你不记录'上下文'，Claude 就无法学习。不要指望魔法，"Brendan 说。"要投入精力构建和维护你的上下文层。并像对待任何其他项目产物一样对待它：对它做版本管理、扩充它、维护它。"

Brendan 把 AI 上下文放在独立仓库中，因为它的增长速度与代码不同，并且适用于所有分支和时间点——把它放在代码仓库里正变得越来越受限。把上下文放在同一个仓库里也是一种可行的选择；关键在于它要有版本管理、得到维护，并在需要时可用。

**投入精力构建你的技能库**

用 [Skills](https://claude.ai/redirect/claudedotcom.v1.01e807aa-2df7-44d9-a8ac-b93ce913b9f9/skills) 来编码任何 Claude 实例都能加载的领域知识。Brendan 的 Skills 遵循"引用而非内嵌"的原则：每个技能都指向一个中央文档知识库，而不是复制内容，从而保持轻量、易于维护。

他最常用的几个包括：一个 `skyline-development` 技能，让 Claude 熟悉该项目及其文档；一个 `version-control` 技能，编码项目特定的提交和 PR 约定；以及一个 `debugging` 技能，旨在把 Claude 从"猜测加试错"模式中拉出来，推动它在尝试任何修复之前先做根因分析。

**当数据访问是关键时，使用 MCP 集成**

在 Claude 需要访问真实数据的地方构建 [MCP 集成](https://claude.com/resources/articles/what-is-model-context-protocol)：测试结果、异常报告、支持讨论串。

对开源项目而言，构建和维护上下文层有着特别的分量。没有上手预算，没有书面记录之外的机构记忆，也无法保证任何贡献者明年还在。上下文一旦建立，就对每位贡献者可用，并以人类机构知识永远无法做到的方式贯穿项目的整个生命周期。`pwiz-ai` 仓库本身就是一件开源产物——它属于项目而非任何一位贡献者，并且比所有构建它的人存续得更久。

## 十七年的上手经验，一个结论

你不会把 70 万行的代码库交给新员工，还指望他第一天就出成果。你会给他找一个范围有限的项目，带他走一遍，随着他理解的加深再扩大他的范围。

正如 Brendan 所体会到的，你与 Claude 一起构建的上下文也是同样的道理。

一旦对代码库足够了解，工程师就能跨分支、跨时间点工作。Claude 在获得足够的上下文和指引后，也能做到同样的事。

_\*Anthropic 联合创始人 Dario Amodei 曾是 MacCoss Lab 的成员。_
