---
title: "面向财务的 Cowork 与插件"
source_url: "https://claude.com/resources/articles/cowork-plugins-finance"
publisher: "claude.com"
type: "blogPost"
date: "2026-02-24"
products: ["Claude Enterprise"]
read_time: 6
excerpt: "为财务工作的实际运作方式打造的新插件，以及可随你从 Excel 到 PowerPoint 再到最终交付物一路流转的跨应用工作流。"
fetched_at: "2026-11-18"
---

# 面向财务的 Cowork 与插件
今天我们宣布 [Cowork](https://claude.com/product/cowork) 的更新，包括[新插件](https://claude.com/resources/articles/cowork-plugins)，让整个企业内的团队都能按照自己想要的工作方式塑造 Claude。作为其中的一部分，我们继续在[近期更新](https://claude.com/resources/articles/opus-4-6-finance)的基础上，扩展 Claude 能为金融服务做的事情。

Claude 现在可以[跨 Excel 和 PowerPoint 工作](https://claude.com/resources/articles/claude-excel-powerpoint-updates)——在应用之间携带上下文，端到端完成多步骤的财务任务。我们还推出了五个新的财务插件、面向 FactSet 和 MSCI 的新 MCP 连接器，以及来自 LSEG 和 S&P Global 的合作伙伴创建的插件。

对财务专业人士而言，这意味着一个端到端的工作流——从跨市场数据提供商开展研究，到更新模型，再到构建演示文稿——现在可以在单个会话中完成，无需切换工具，也不会在中途丢失上下文。

## 从数据到交付物

财务相关的工作分布在许多不同的地方。交易备忘录取自模型，模型取自数据，而数据又反过来汇入演示文稿。Claude 现在可以在 Excel 和 PowerPoint 之间移动而不丢失上下文——检索数据、更新模型、构建交付物，作为一个连续的任务完成。

股票分析师可以要求 Claude 分析财报、更新财务模型并构建摘要幻灯片——全程无需切换工具。当输入发生变化时，Claude 会自动更新工作流的其余部分。

Claude 跨 Excel 和 PowerPoint 工作的功能现已在 Mac 和 Windows 上以研究预览形式向所有付费计划开放。



## 新的财务插件

我们推出了五个由 Anthropic 构建的新插件，以及若干由合作伙伴构建的插件。每个插件都带来了与该职能实际运作方式相关的领域专业知识、预期的输出质量和工流模式。

这 5 个由 Anthropic 开发的插件现均已在我们的[公共仓库](https://github.com/anthropics/financial-services-plugins)中提供。

-   首先，**财务分析**插件支持所有财务分析师都需要的基础工作流，涵盖市场与竞争研究、财务建模，以及 PowerPoint 模板创建和质量检查。

其他插件支持关键财务职能特有的工作流：

-   **投资银行**帮助银行家处理交易工作流：审阅交易文件、构建可比公司分析，以及准备推介材料。
-   **股票研究**加速研究工作流——解析财报电话会议记录、根据新指引更新财务模型，以及起草研究报告。
-   **私募股权**为交易获取和尽职调查而构建。Claude 可以审阅大量文档集、提取标准化财务数据、建模情景，并按照投资标准对机会进行评分。**‍**
-   **财富管理**帮助顾问大规模地分析投资组合、识别偏离和税务敞口，并生成再平衡建议。

除了这五个插件之外，财务专业人士还依赖专有数据和专业平台，这些是任何通用插件都无法复制的。我们的合作伙伴构建了自己的连接器和插件，将机构数据直接带入 Claude 的上下文，因此用户的工作流建立在其团队已经信任的确切数据源之上。

## 合作伙伴主导的连接器和插件

除了我们已支持的现有财务 MCP [连接器](https://claude.com/connectors#connectors)之外，两个新的 MCP 连接器让 Claude 可以直接访问机构数据平台。

-   **FactSet** 连接器将实时市场数据、基本面分析、盈利预测和研究洞察带入 Claude，以可信的机构级数据增强用户的财务分析和投资研究工作流。
-   **MSCI** 连接器将 MSCI 可信的指数数据带入 Claude，使用户能够访问 MSCI 的专有指数数据，并快速获得关于指数表现、敞口、成分和方法论的洞察。

若干合作伙伴也在推出自己的插件，可在上述同一个[金融服务插件仓库](https://github.com/anthropics/financial-services-plugins)中找到。

-   **S&P Global** 插件将 Capital IQ Pro 带入 Claude 的上下文。技能包括公司速览表、行业交易摘要和财报电话会议预览。
-   **LSEG** 插件让财务专业人士可以直接在 Claude 中访问 LSEG 的市场数据和分析。使用实时收益率曲线构建 DCF 模型，使用实时新闻起草晨间简报，使用当前跨资产定价对投资组合进行再平衡，并使用实际融资经济情况分析交易。适用于拥有有效 LSEG 数据权益的用户。

## 开始使用

所有由 Anthropic 开发的插件——财务分析、投资银行、股票研究、私募股权和财富管理——现已可用，可在我们的[公共财务插件仓库](https://github.com/anthropics/financial-services-plugins)中找到，来自 LSEG 和 S&P Global 的合作伙伴开发的插件也在其中。你可以直接安装它们，或将它们作为起点，根据你公司的具体工作流、术语和需求进行定制。

要将 Claude 连接到 FactSet、MSCI 或其他企业数据源，请访问 Claude 设置中的连接器目录。在那里，管理员可以授权连接并将其打包成插件供其团队使用。

要开始使用 Claude 跨 Excel 和 PowerPoint 工作，请下载 Claude for Excel 和 Claude for PowerPoint 加载项。要更全面地了解 Cowork 和插件在各职能中的更新，请参阅[配套博客文章](https://claude.com/resources/articles/cowork-plugins-across-enterprise)。

‍

‍
