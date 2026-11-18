---
title: "使用 Claude 构建商务智能体"
source_url: "https://claude.com/resources/articles/claude-for-commerce-agents"
publisher: "claude.com"
type: "blogPost"
date: "2026-09-02"
products: ["Claude Platform"]
read_time: 5
excerpt: "在 Claude 上运行购物智能体的零售商发现，购物车金额最高提升了 35%，购物者完成购买的可能性提高了 60%。"
fetched_at: "2026-11-18"
---

# 使用 Claude 构建商务智能体

全球许多大型[零售商](https://claude.com/resources/articles/j-crew-style-advisor-with-claude)、市场平台、电商平台和旅游公司都在使用 Claude 构建让购物更轻松的智能体。Shopify、Priceline 等企业客户已经拥有这样的智能体：消费者可以用自然语言描述自己想要的东西，让 AI 搜索、找到、比较并购买。

今天，我们推出一套蓝图，帮助在 Claude 上构建商务智能体。它包含工程团队在几天内让商务智能体跑起来所需的执行框架（harness）、模式和护栏，并提供了面向零售、旅游、电信和票务平台的购物智能体与商家智能体的参考实现。它还包含一个 Claude Code 插件，帮助你快速上手。

代码可以部署在你已经使用 Claude 构建的环境里，包括 Claude API、Amazon Bedrock、Microsoft Foundry 或 Google Cloud Vertex AI。你也可以与我们的解决方案和生态合作伙伴合作，例如 Accenture、Mastercard 和 Visa，他们正与我们携手，帮助客户和商家社区利用这些蓝图。

该蓝图[现已可用](https://github.com/anthropics/commerce-agents)，每个垂直行业都有[在线演示](https://claude.com/solutions/commerce)，还有一篇关于其构建方式的[工程深度解析](https://claude.com/resources/articles/the-anatomy-of-effective-commerce-agents)，正好赶上假日季规划。



在 ACME 零售示例中运行的购物智能体。

## 蓝图包含什么

该仓库包含购物智能体和商家智能体的完整可运行实现，可使用 [Messages API](https://platform.claude.com/docs/en/intro)、[Agent SDK](https://code.claude.com/docs/en/agent-sdk) 或 [Claude Managed Agents](https://platform.claude.com/docs/en/managed-agents/overview)（beta）构建。你可以在写任何代码之前，先在自助演示中看到它们运行，然后与 Claude Code 协作，将它们定制到你的商品目录、政策、品牌等。

### 购物智能体

购物智能体运行在你的应用或网站内部。蓝图包含商品目录、购物车、结账、客户偏好和订单历史的集成点，支付则留给你自己处理，无论是你现有的结账流程还是智能体式支付提供商。

客户可以说“我需要一个帐篷、一个睡袋和一个炉子，周末带两个孩子去露营”，智能体就能据此完成任务。以下是它能做的事：

-   搜索商品目录并组装合适的商品组合，包括多商品请求。
-   记住客户的偏好，并据此调整推荐。
-   在对话中直接展示商品、对比和购物车，而不只是文字。
-   构建购物车并交给结账流程。
-   在同一对话中回答客户服务问题，比如订单在哪里、如何退货或换货、退款政策怎么说，而不是把客户引导到支持页面。

该智能体带有护栏，旨在将价格和商品限制在真实的商品目录数据范围内，并避免操纵性的追加销售模式。在仓库中，这些以 Skills（技能）和工具的形式提供，涵盖商品目录搜索、多商品规划、深度研究、个性化、客户服务和对话内 UI。

### 商家智能体

商家智能体为经营店铺的人提供支持。用户可以问“我们应该给哪些商品打折来清掉上一季的库存？”，并基于自己的数据得到答案。以下是它能做的事：

-   回答关于销售表现的问题，比如什么卖得好、什么卖不动。
-   跟踪库存并主动标记问题，比如某件商品在促销开始前就要售罄。
-   基于店铺自己的销售历史推荐定价和促销。
-   起草营销活动，推动需要动销的商品。

当智能体主动建议某项变更时，需要有人批准后才会正式生效，这意味着用户拥有最终决定权，而他们的智能体在持续关注店铺。在仓库中，这些能力以 Skills 的形式提供，涵盖销售分析、商品目录与库存管理、营销与促销，以及图表和仪表盘等门户内 UI。



## 全行业信赖

服务于购物者、旅行者、订阅用户和商家的公司都在 Claude 上构建和运行智能体。以下是他们对使用 Claude 构建商务智能体的评价：

## 开始使用

该蓝图现已可用。[联系我们的销售团队](https://claude.com/contact-sales)了解更多、预约演示，或讨论如何为你的组织落地实施。

1.  在 [github.com/anthropics/commerce-agents](https://github.com/anthropics/commerce-agents) fork 该仓库。
2.  阅读工程深度解析：[claude.com/blog/the-anatomy-of-effective-commerce-agents](https://claude.com/resources/articles/the-anatomy-of-effective-commerce-agents)。(https://claude.com/resources/articles/the-anatomy-of-effective-commerce-agents)
3.  查看各垂直行业演示，并在 [claude.com/solutions/commerce](https://claude.com/solutions/commerce) 申请一场工作会。

注册我们的[网络研讨会](https://claude.com/resources/webinars/building-claude-commerce-agents)，观看深度解析，我们将分享现场演示、演示，并介绍商务构建者如何充分利用 Claude。
