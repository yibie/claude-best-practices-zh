---
title: "Claude for Excel 与 PowerPoint 能力进阶"
source_url: "https://claude.com/resources/articles/claude-excel-powerpoint-updates"
publisher: "claude.com"
type: "blogPost"
date: "2026-03-11"
products: ["Claude Enterprise"]
read_time: 5
excerpt: "Claude for Excel 与 PowerPoint 现在可在所有打开的文件之间共享完整上下文，Skills 让任何工作流都能即刻复用。"
fetched_at: "2026-11-18"
---

# Claude for Excel 与 PowerPoint 能力进阶
_**更新：** Claude for Word 测试版现已在 Team 和 Enterprise 方案中提供。（2026 年 4 月 10 日）_

从今天起，[Claude for Excel](https://claude.com/claude-in-excel) 与 [Claude for PowerPoint](https://claude.com/claude-in-powerpoint) 会在所有打开的文件之间共享对话的完整上下文，因此 Claude 在一个应用中执行的每个操作，都会参考另一个应用中正在发生的一切。

Skills（技能）现在也可在 Excel 和 PowerPoint 加载项中使用，并且 Claude for Excel 与 PowerPoint 可通过三大领先云平台使用：Amazon Bedrock、Google Cloud 的 Vertex AI 和 Microsoft Foundry。

这些更新让 Claude 能够在任务、电子表格和幻灯片之间自由切换，使你以更高的效率和质量工作，无需在每一步都重新解释。

## 在 Excel 与 PowerPoint 之间共享同一段对话

Claude 可以在一次连续的对话中跨多个 Excel 和 PowerPoint 文件传递上下文——读取单元格值、写入公式、合并数据集、编辑幻灯片，并在打开的 Excel 和 PowerPoint 文件之间延续用户对话。

财务分析师可以从一个打开的工作簿和其他数据源中提取可比公司的财务数据。在此基础上，他们可以在 Excel 中搭建交易可比公司表，将估值摘要放入推介材料，并起草给 MD 的邮件——无需切换标签页，也无需在每一步重新解释数据集。减少工具之间的来回切换，是更快交付最终成果的关键。

## 用 Skills 将最佳实践变成一键操作

[Skills](https://support.claude.com/en/articles/12512180-use-skills-in-claude) 可将完整的工作流变成一键操作。当团队中有人摸索出进行差异分析或使用公司模板制作客户演示文稿的正确方法时，将其保存为 skill 就能让这一流程在今后即刻复用。



我们已提供一套预加载的入门 Skills，覆盖最常见的 Excel 和 PowerPoint 用例。对于 Excel，入门 Skills 覆盖财务分析中最常出现的工作流：

-   审计模型中的公式错误和资产负债表完整性
-   构建并填充 LBO、DCF 和三表模型模板
-   运行可比公司分析
-   清理杂乱的电子表格数据——某个区域、活动工作表或整个文件

对于 PowerPoint，入门 Skills 覆盖分析之后的演示层工作：

-   构建竞争格局演示文稿，包括市场定位和同行深度分析
-   用新信息或额外数据更新现有演示文稿
-   审查投资银行演示文稿的数字一致性、数据与叙述的匹配度以及语言润色

通过桌面端或 Web 应用在 Claude 中已设置好的每个 skill——无论是个人的还是组织范围的——都能像 MCP connectors 一样在加载项中开箱即用。Excel 和 PowerPoint 的入门 Skills 也可通过 [Financial Analysis 插件](https://github.com/anthropics/financial-services-plugins/tree/main/financial-analysis/skills)获取，该插件会自动安装到两个加载项中。添加到该插件的新 Skills 无需任何额外设置即可使用。

最后，[instructions](https://support.claude.com/en/articles/12512180-use-skills-in-claude) 用于处理应始终生效的、应用层面的持久偏好。这可能包括在 Excel 中始终使用公司的数字格式、将 PowerPoint 项目符号保持在一行以内，或标记引用硬编码假设的单元格。Instructions 可以设置一次并自动应用，无需额外提示。Claude 也可以帮你编写和编辑 instructions。

## 部署灵活性

Claude for Excel 与 PowerPoint 现在可以在客户合规体系所在之处满足其需求。组织可以使用 Claude 账户访问这两个加载项，也可以通过现有的 LLM 网关将流量路由到运行在 Amazon Bedrock、Google Cloud 的 Vertex AI 或 Microsoft Foundry 上的 Claude 模型。请参阅[指南](https://support.claude.com/en/articles/13945233-use-claude-in-excel-and-powerpoint-with-an-llm-gateway)，了解如何通过 LLM 网关使用 Claude for Excel 与 PowerPoint。

Claude 还[原生驱动 Excel 中的 Agent Mode](https://support.microsoft.com/en-gb/topic/use-claude-with-agent-mode-in-excel-b2c3b3ec-154b-484b-84d0-914a80df395a)，因此 Microsoft 365 Copilot 客户可以与 Copilot 并肩构建、编辑和分析工作簿。

## 开始使用

所有付费方案的 Mac 和 Windows 用户都可以在测试版中体验 [Claude for Excel](https://claude.com/claude-in-excel)（[参见指南](https://support.claude.com/en/articles/12650343-use-claude-for-excel)）与 [Claude for PowerPoint](https://claude.com/claude-in-powerpoint)（[参见指南](https://support.claude.com/en/articles/13521390-use-claude-in-powerpoint)）之间改进后的通信。Excel 和 PowerPoint 中的 Skills 也在所有付费方案中提供。要了解充分利用这些新工具的最佳实践，请[注册我们的网络研讨会](https://claude.com/resources/webinars/best-practices-for-claude-in-excel-and-powerpoint)。

我们为与 Microsoft 的合作感到自豪，并希望帮助更多人共同体验 Microsoft 365 与 Claude 的强大能力。

‍
