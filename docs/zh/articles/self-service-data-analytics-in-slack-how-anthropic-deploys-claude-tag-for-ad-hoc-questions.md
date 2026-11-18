---
title: "Slack 中的自助式数据分析：Anthropic 如何部署 Claude Tag 应对临时性问题"
source_url: "https://claude.com/resources/articles/self-service-data-analytics-in-slack-how-anthropic-deploys-claude-tag-for-ad-hoc-questions"
publisher: "claude.com"
type: "blogPost"
date: "2026-08-13"
products: ["Claude Tag"]
read_time: 2
excerpt: ""
fetched_at: "2026-11-18"
---

# Slack 中的自助式数据分析：Anthropic 如何部署 Claude Tag 应对临时性问题
在[上一篇文章](https://claude.com/resources/articles/how-anthropic-enables-self-service-data-analytics-with-claude)中，我们介绍了如何通过三类主要产物让 Claude 以约 95% 的准确率回答数据分析问题：

-   受治理的语义层；
-   一组编码了我们分析惯例的 skill 文件；以及
-   一套用于衡量表现的评估（eval）套件。

那篇文章聚焦于 [Claude Code](https://claude.com/product/claude-code)（我们数据科学家和数据工程师的主要开发界面），以及提升智能体式准确性的最佳实践。

本文讨论 Anthropic 的数据团队如何将这一基础应用到公司其他成员工作的地方——通过 [Claude Tag](https://claude.com/product/tag)（公开测试版），它是我们在 Slack 中数据分析智能体的基础。任何人都可以向它提出数据相关问题，并获得由**分析师所使用的同一套受治理定义**支撑的答案。



为便于说明而虚构重现的 Claude Tag 对话。其中的细节、名称和工具均非真实。

## 在 Slack 中部署数据分析智能体的最佳实践

让智能体变得_准确_，与让它_部署到非分析师也能使用的地方_，结果证明是相当不同的两件事。我们不再重复上一篇文章中关于准确性的建议，因为它们在这里同样适用。

相反，我们将介绍过去一年中在 Slack 中部署数据分析智能体的五项最重要经验，以及你应当如何思考分发、权限、数据新鲜度和可观测性。
