---
title: "面向法律行业的 Claude"
source_url: "https://claude.com/resources/articles/claude-for-the-legal-industry"
publisher: "claude.com"
type: "blogPost"
date: "2026-05-12"
products: ["Claude Cowork"]
read_time: 14
excerpt: ""
fetched_at: "2026-11-18"
---

# 面向法律行业的 Claude
_**更新：** Claude for Legal 现已包含[可直接用于法律工作的 artifacts](https://claude.com/resources/articles/introducing-artifacts-for-legal-work)。_

今年早些时候，我们发布了首个法律插件，此后数月间，法律专业人士已成为所有知识工作职能中 Claude Cowork 使用活跃度最高的用户群体。现在，我们在此基础上推出规模大得多的工具集。

法律工作依托一套特定的技术栈：合同生命周期系统、[研究平台](https://claude.com/resources/articles/working-at-the-frontier-how-thomson-reuters-builds-ai-for-high--stakes-professional-work)、文档管理、电子取证、数据室、律所专属先例，等等。Claude 现在通过几个关键构建模块与这一切相连。首先，[MCP connectors](https://claude.ai/redirect/claudedotcom.v1.ec721cde-65fe-4905-8ddd-61411b09ff37/directory/connectors) 将你的法律工作（与特定事项相关的文档、通信和记录）带入 Claude。其次，业务领域插件打包了律师最常执行的任务。最后，由于两者都构建在开放协议之上，律所和法务团队可以定制 Claude，使其匹配自己实际的执业方式。[了解 Anthropic 自己的法律团队如何与 Claude 协作](https://claude.com/resources/articles/how-anthropic-uses-claude-legal)

今天我们推出 20 多个新的 MCP connectors，将 Claude 与法律行业已经依赖的软件连接起来，以及 12 个针对特定法律工作和业务领域量身定制的新插件。最后，我们正在与 Free Law Project、Justice Technology Association 以及其他致力于让目前无法获得法律服务的人也能触及法律帮助的组织合作。

‍

## Claude 在法律团队工作的地方工作

Claude 在法律团队所在之处与其会合，直接在 Microsoft Word、Outlook、Excel 和 PowerPoint 中工作，并在全部四个应用之间携带上下文。在 Word 中完成的修订稿，在变成 Outlook 中的附函、Excel 中的交割清单或 PowerPoint 中的董事会摘要时，无需重新解释。

在 **Word** 中，Claude Skills（技能）——将团队实战手册和标准编码成的可复用指令——负责起草、修订，以及对照这些实战手册进行逐条条款比较，跟踪每一处更改并解释其背后的推理。它们还承担每一轮之间的机械性工作：在草稿发给对方之前清理内部评论，对签署副本做最终格式检查，以及从已批准的实战手册中提取备选措辞。

在 **Outlook** 中，Claude 对收到的事项工作进行分诊：标记合同请求、起草回复和附函，并安排后续跟进，避免事务堆积。

在 **Claude Cowork** 中，同样的 connectors 和插件可用于跨多个文档的工作：对一批合同进行分诊、为产品功能发布做合规审查，以及就监管动态为董事会起草说明。定时任务可以自动化重复性工作，例如每周的监管更新扫描或收件分诊。

借助 **Projects**，事项团队获得一个持久的工作空间，先例和既往草稿在每次对话之间得以保留。

## 覆盖法律技术栈的新 connectors

新的 MCP connectors 让 Claude 能够与法律团队已经依赖的系统交互。

**合同生命周期与起草**

-   **Definely**，为合同结构提供实时、确定性的访问以支持审查：解析定义、验证交叉引用、映射依赖关系，并运行结构化差异比较，以查看编辑如何在协议中传播；**‍**
-   **Docusign**，将 Claude 连接到你的协议数据，使你能够快速呈现续约日期和义务等关键条款，并编排贯穿合同生命周期的协议工作流，从起草到签署及签署后管理；
-   **Ironclad**，让 Claude 访问你的合同库和工作流，并用自然语言询问有关合同的问题，结果自动限定在每个用户的权限范围内。

**交易室与交易文档**：

-   **Box**，将 Claude 连接到存储在 Box 中的内容，以搜索和访问文件、查询文档、创建或更新内容，并提取元数据字段，同时执行现有的 Box 安全和访问策略；
-   **Datasite**，将 Claude 连接到你的 Datasite 虚拟数据室——每年促成数千笔并购交易的安全工作空间——以设置文件夹结构、邀请用户、搜索文档、跟踪买方问答，并审计数据室的就绪状态。

**文档管理：**

-   **iManage**，一个知识工作平台，为 Claude 提供受权限约束、可审计的受治理 iManage 内容访问，包括事项历史、文档和机构知识，无需批量导出或自定义集成；**‍**
-   **NetDocuments**，让 Claude 从你的 NetDocuments 存储库中搜索和检索文档，并基于你的先例起草新文档，完全尊重你组织的权限和治理策略。

**专家网络与技能：**

-   **Lawve AI**，提供由执业律师、法务顾问和法律技术专家编写的精选法律 AI 技能库，可在 Claude 内部搜索；
-   **The L Suite**，从其领先的法务顾问社区提供两个 MCP connectors：(1) Lloyd，允许 The L Suite 成员将 Claude 与 Braintrust 成员平台连接；(2) TopCounsel，基于 The L Suite 的专有数据集和排名算法，帮助任何法务顾问为特定事项找到合适的外部律师。

**电子取证与审查：**

-   **Consilio**，将客户自己的在办事项和 Consilio 的 Aurora Legal AI 置于 Claude 的指尖，每个响应都限定在用户已有权查看的范围内；
-   **Everlaw**，提供诉讼平台，让 Claude 使用元数据、关键词和文档类型从 Everlaw 项目中搜索、组织和检索文档，并提供直接审查链接；
-   **Relativity**，让 Claude 在其法律数据智能 AI 平台 RelativityOne 中建立事项、塑造工作区架构、治理访问并分析用量。

**受托级工作流：**

-   **Thomson Reuters**，将 Claude 连接到 CoCounsel Legal，这是一个受托级系统，可在所有主要业务领域进行端到端起草、研究、审查和验证，作为高风险法律工作的 AI 助手，以 Westlaw 一手法律、Practical Law 指引、KeyCite 和你自己的文档为基础，输出透明且可验证。

**法律研究与判例法：**

-   **Legal Data Hunter**，让 Claude 访问世界上增长最快的法律语料库：来自 160 多个司法管辖区的 3100 多万份文档，包括欧盟综合法、最高法院和宪法法院的判例法以及官方学说；
-   **Midpage**，将 Claude 连接到判例法数据库，用于复杂的法律研究、意见审查和工作成果，所有内容都超链接到真实来源以便轻松验证；
-   **Trellis**，让 Claude 直接访问美国最大的州初审法院数据集，包括案卷、裁决、判决和提交文件，用于法官和对方律师分析以及动议起草。

**法律 AI 助手：**

-   **Harvey**，将 Harvey 的法律智能带入 Claude，支持一般法律咨询、对 Vault 项目的分析，以及针对特定知识来源的研究问题；
-   **Solve Intelligence**，将 Claude 连接到专利和非专利文献、法律文本、SEP 技术标准和开放网络，用于现有技术检索、权利要求映射和专利起草。

**公共服务**

-   **BoardWise**，指导面临州委员会事务的持证专业人士：帮助他们了解截止日期、应对自身处境，并起草针对其司法管辖区量身定制的结构化回复信；
-   **Courtroom5**，为约 80% 在没有律师的情况下出庭的民事诉讼当事人提供法律指引，具备跨全部 50 个州的司法管辖区感知案件受理、截止日期计算和下一步指引；
-   **Descrybe**，为 Claude 提供处理一手法律的法律研究工具：按概念或引证搜索案件、检查处理状态、查找引用权威，并核验引用的原文表述；
-   **Free Law Project**，将 Claude 连接到 CourtListener 的数百万份美国法院意见、PACER 案卷、法官档案、口头辩论和引证数据。

## 业务领域插件

法律工作因你所处的岗位而异。我们发布 12 个业务领域插件（可从 Legal Marketplace [此处](https://github.com/anthropics/claude-for-legal)下载），每个都围绕特定法律角色构建。每个插件都以一段简短的设置访谈开始，了解你的执业情况：你的实战手册、你的升级链、你的风险校准、你的行文风格，因此 Claude 的答案不是通用的，而是为你的团队量身定制。这些包括：

-   **Commercial Legal** 对照你的实战手册审查供应商协议和 NDA，并为业务利益相关方提供通俗易懂的摘要来路由升级。
-   **Corporate Legal** 处理并购：跨数据室的尽职调查、披露附表、董事会同意书和交割清单。可配置用于董事会工作、上市公司治理或实体合规。
-   **Employment Legal** 涵盖招聘、解雇、劳动者分类、休假截止日期和调查，并起草内置州特定规则的政策。
-   **Privacy Legal** 对照你的实战手册审查数据处理协议（DPA）、对隐私影响评估（PIA）和数据保护影响评估（DPIA）进行分诊、在法定时限内准备数据主体访问请求（DSAR）的回复，并标记书面政策与实际做法之间的差距。
-   **Product Legal** 对照你的内部框架进行发布审查、检查营销声明是否有依据支撑，并回答来自业务各团队的风险问题。
-   **Regulatory Legal** 监控监管动态、按你的重大性阈值进行筛选、将新规则与你的政策库进行比较，并跟踪差距和评论截止日期。
-   **AI Governance Legal** 对照你的治理层级对 AI 用例进行分诊、运行影响评估、审查供应商 AI 条款，并可起草起始 AI 政策。
-   **IP Legal** 进行商标清查和自由实施分诊、起草和回复停止侵权函、处理 DMCA 下架和开源合规，并筛查发明披露。
-   **Litigation Legal** 管理事项受理和组合跟踪、法律保留、催告函、传票分诊、时间线、证词准备、特权日志和简报起草。
-   **Law Student** 提供苏格拉底式训练、案例摘要、IRAC 评分和律师资格考试准备，并包含司法管辖区特定差异。
-   **Legal Clinic** 管理客户受理、截止日期跟踪、案件备忘录和主管审查队列。
-   **Legal Builder Hub** 从公共注册表查找并安装社区构建的法律技能，在每次安装和更新时运行安全审查、许可证检查和新鲜度检查。

每个智能体模板都可以一键安装在 Cowork 或 Claude Code 中，并生成符合机构起草标准的输出。[其中一部分](https://github.com/anthropics/claude-for-legal)（Commercial Legal、Corporate Legal、Litigation Legal、Product Legal、Litigation Legal）还作为 cookbooks 提供，可作为 Managed Agents 部署在 Claude Platform 中用于程序化使用。团队可以叠加自己的先例和实战手册来定制技能。

每个法律组织的运作方式都不同，没有单一套插件能覆盖所有业务。插件和技能生态系统是开放协议，包括 **Box、Legal Quants、Lawve AI** 和 **Thomson Reuters** 在内的早期贡献者已经发布了自己的技能、插件和风格约定。任何合作伙伴都可以通过 [Directory](https://claude.ai/redirect/claudedotcom.v1.ec721cde-65fe-4905-8ddd-61411b09ff37/directory) 提交 connectors 和技能。

## 用 AI 让法律服务触手可及

许多人和小企业无法获得法律服务，而且这一差距正在扩大。我们正与 **Free Law Project**、**Justice Technology Association** 以及其他法律援助和公共服务组织合作，帮助让法律服务更可负担、更易获得。

符合条件的法律援助诊所、公设辩护人和非营利法律服务组织可以通过 [Claude for Nonprofits 项目](https://claude.com/solutions/nonprofits)获得大幅折扣的定价。BoardWise、Courtroom5、Descrybe 和 Free Law Project 的免费和低成本工具也可通过 MCP connectors 供 Claude 用户使用。

> “"大多数人在还来得及行使之前并不知道自己拥有法律权利。Claude 现在可以在他们所在之处与其会合——就在他们感到害怕、寻找答案的那一刻。" - Sonja Ebron，Courtroom5 首席执行官兼联合创始人”

## 在整个法律行业备受信赖

律所和法务团队已从测试 Claude 转向在其上运行自己的执业——而他们所依赖的法律工具也越来越多地构建在 Claude 之上。在二月份的 [Briefing: Enterprise Agents](https://www.anthropic.com/events/the-briefing-enterprise-agents-virtual-event) 上，Thomson Reuters 展示了基于 Claude Agent SDK 重建的 CoCounsel；随着今天的发布，这一集成实现了双向运行。Harvey、Solve Intelligence 以及下文提到的其他公司也在做同样的事。

这些更新构建在 Claude Opus 4.7 之上，这是我们面向法律推理和长文档工作最强大的公开可用模型。

以下是法律团队和生态系统合作伙伴告诉我们的关于与 Claude 协作的反馈：
