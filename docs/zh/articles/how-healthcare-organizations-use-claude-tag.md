---
title: "医疗健康组织如何使用 Claude Tag"
source_url: "https://claude.com/resources/articles/how-healthcare-organizations-use-claude-tag"
publisher: "claude.com"
type: "blogPost"
date: "2026-09-14"
products: ["Claude Tag"]
read_time: 11
excerpt: "Insight Health、Tennr 和 Medallion 如何借助 Claude Tag 构建人机团队。"
fetched_at: "2026-11-18"
---

# 医疗健康组织如何使用 Claude Tag

医疗健康组织正在使用 [Claude Tag（beta）](https://support.claude.com/en/articles/15594475-what-is-claude-tag)，它把 Claude 作为[队友](https://academy.claude.com/courses/building-effective-human-agent-teams)引入 Slack，帮助这些组织分诊生产环境告警、维护内部工具，并回答关于付款方规则的问题。虽然 Claude Tag 目前尚未纳入 Anthropic 的[商业伙伴协议](https://support.claude.com/en/articles/8114513-business-associate-agreements-baa-for-commercial-customers)（BAA）覆盖范围，但已有若干医疗健康组织在完全不接触受保护健康信息（PHI）的频道和连接器中使用它。

在频道中 @Claude，它就会读取该话题串、使用你已连接的工具有完成工作，并回报结果。它会记住每个频道中发生的事情，因此长时程的工作无需反复说明；只要你允许，它还能监视某个频道并在需要时自行介入。

管理员决定 Claude Tag 在哪些地方工作、能访问什么，因此医疗团队可以让 Claude Tag 远离存放 PHI 的频道和系统：

-   Claude Tag 可以默认关闭，**仅在获批频道中启用**，同时禁用私信，并**按频道限定连接器范围**。
-   Claude Tag 不会读取整个 Slack——它只能看到工作区成员能看到的内容。它可以读取工作区的公开频道并按关键词搜索，但无法访问未被邀请加入的私有频道。
-   **访问捆绑包（access bundles）**让团队可以在一个频道中连接代码库和问题跟踪器这类数据源，同时让 EHR、临床系统和患者沟通内容保持不可访问。进一步了解 Claude Tag 的[智能体身份访问模型](https://claude.com/resources/articles/agent-identity-access-model)及其完整架构，见[安全与数据处理文档](https://claude.com/docs/claude-tag/concepts/security-and-data?open_in_browser=1)，关于医疗健康组织的最佳实践可阅读[此处](https://claude.com/docs/claude-tag/admins/healthcare)。

激活 Claude Tag 并将其关联到 GitHub 的企业组织可获得 25,000 美元的 Claude Tag 额度（10 个及以上席位的 Team 组织为 2,500 美元）；请注意这些额度将于 2026 年 10 月 1 日到期。额度详情见[此处](https://support.claude.com/en/articles/15575654-claude-tag-launch-promo-for-claude-team-and-enterprise)。

以下是 Insight Health、Tennr 和 Medallion 目前如何使用 Claude Tag 构建[人机团队](https://claude.com/resources/articles/building-effective-human-agent-teams)。

#### **在 Insight Health 运行事件响应**

Insight Health 打造了 MagicDocs，这是一款面向专科医疗机构的 AI 转诊协调器。MagicDocs 读取收到的患者文档（传真、转诊单、预授权申请、化验结果和病历），提取临床细节，将每份文档匹配到正确的患者，并把结构化数据写入 EHR。该公司服务覆盖 56 个专科的 1,100 多家机构。

随着 Insight Health 客户群的增长，生产环境告警分诊占用了其精简工程团队本希望投入更高价值工作的时间。因此在过去三个月里，该公司在无 PHI 的工程与支持频道中运行 Claude Tag，由它调查生产告警、提交工单并对工单去重、审查 PR，并在话题串之间传递上下文。

在高频的生产告警频道中，他们将 Claude Tag 与第二个智能体 Zeus（由 Insight Health 基于 Claude Agent SDK 构建）配对，把事件从首次通知推进到经过测试的修复。两个智能体的访问权限刻意不同：Claude Tag 能看到代码库和 Linear，因此了解代码模式和工单历史；Zeus 运行在公司受 BAA 覆盖的 Claude API 组织上，因此可以查询生产数据，并在数据到达 Slack 之前对 PHI 做脱敏。告警到达时，两个智能体展开调查——查询生产数据、对照代码和近期部署进行检查、与过往工单比对——同时在 Slack 话题串中汇报进展。一旦定位根因，它们会提交草稿 PR 并监控测试，最后由工程师审查并合并。Claude Tag 的频道记忆在此很有价值：它能把新的投诉识别为已有修复待合的已知问题，回忆起数周前的调查，并无需提示地遵循常设指令。

"Slack 频道里的每个人都能看到两个智能体的推理过程以及它们如何分工，"Insight Health 联合创始人兼 CTO Saran Siva 说。"这种透明度建立了信任，也教会团队如何从智能体身上获得最大价值。"自 Claude Tag 上线以来，Insight Health 关键告警频道中 97% 的告警在无需工程师介入的情况下关闭，让团队得以专注于核心产品工作。

除事件之外，Insight Health 团队还将 Claude Tag 用于招聘、供应商谈判准备、合同审查（对照通话记录核查条款）以及一般业务运营。

#### **在 Tennr 维护内部工具**

Tennr 是一个患者编排平台，通过自动化入院、文档、授权和排程等工作（这些工作否则会拖慢诊疗进程），帮助医疗机构更快将患者送入合适的诊疗场景。Claude Tag 常驻其内部工具中，帮助非技术团队搭建和维护定制的内部应用。

在 Tennr 这样快速成长的公司里，内部工具建得多快就死得多快，因为没人有余力维护它们。2026 年 7 月，Tennr 在构建内部工具时采取了不同的做法。它上线了 recruiting.tennr.com——一个用 Claude Code 构建的内部录用通知展示门户——并通过一个专门的 Slack 频道让 Claude Tag 成为其主要维护者。如今，真正使用该工具的人（招聘人员、People 团队成员、招聘经理和 RevOps）用平实的英语 @Claude 提出需求，Claude 便提交代码变更、部署并回报结果。他们可以直接迭代这个工具，而无需把工程师从产品工作中抽走。

在大约一个月里，团队以这种方式交付了 15 个以上工单：根据上传的 PDF 单页材料构建的福利深度介绍板块、链接到 Dropbox Sign 的"在此签署录用通知"横幅、目标奖金字段，以及自助式管理员控制项。当一个公开暴露的副本 API 被标记时，Claude 当天就将其锁定。当一个 Ashby 导入缺陷不断重置有效录用通知上的股权时，Claude 修复了该缺陷并传播了更正后的数值。当另一个缺陷短暂地向候选人错误显示浮动薪酬时，Claude 未经要求便在频道内发布通知，说明受影响的时间窗口和补救措施。它还编写了上手文档，并负责该工具的权限管理。

团队在频道内教会了 Claude 自己的运维惯例，包括一套 emoji 状态图例，以及一种工单格式：编号工单、请求人、提交链接、截图和实时测试链接。Claude 此后一直沿用这些惯例。招聘人员用自然语言提交相当于工程工单的需求，有时只是一张截图，就能在一小时内拿回生产环境变更。"Claude Tag 是让内部工具真正可行的关键，"Tennr 业务运营与战略副总裁 Abe Griffiths 说。"有了 Claude 通过 Slack 频道担任工具的管家，真正使用工具的人可以直接迭代它，而无需把工程师从产品工作中抽走。"

推广很快，因为基础已经具备。Tennr 只允许 PHI 出现在有限的一组私有频道中，因此广泛添加 Claude Tag 并未引入新的数据问题。让 Claude Tag 容易被批准的是按频道限定范围。

"在录用通知工具频道里，我们希望 Claude 主动：修问题、改代码、跳过 PR 审查、直接发布，"Griffiths 说。"这种姿态显然不适用于比如产品频道或工程频道，在那里 Claude 的角色更接近信息收集或帮我们保持条理。能够逐个频道划出这些界线，意味着我们可以在低风险的地方赋予 Claude 真正的自主权，而不必在所有地方都授予。"

#### **在 Medallion 积累付款方专业知识**

Medallion 为医疗健康组织自动化服务提供方资质认证、执照办理和付款方注册。这些工作很大程度依赖冷僻且无文档记录的规则：哪些付款方要求一个团体在注册前必须拥有最低数量的已认证服务提供方、各州特有的法规，以及工程师在把某个流程固化进产品之前需要得到答案的数十个类似问题。过去，这些答案掌握在一小群内部医疗健康领域专家手中，为核心产品开发决策造成了持续的人为瓶颈。

Claude Tag 如今处在这个循环中，打破了知识孤岛。当工程师在 Slack 中提出付款方规则问题时，Claude Tag 会依据过往专家回复、历史数据和非结构化的内部资源作答。专业知识在频道中积累，而不是只存在于某个人的脑子里。

"当它没有把握时，它会 @ 合适的专家，而专家的回复会成为未来相关主题答案的基础，"CTO Armaan Sarkar 说。

是什么让他们放心推广 Claude Tag？Sarkar 指出，关键在于选对无 PHI 的工作流、专家审查和自动化验证。Claude Tag 在政策层面运作：问题关乎付款方规则和流程，而非个别患者或服务提供方。它不单独作答：专家提供监督和纠正，每一次交流都发生在公司任何人都可审计的 Slack 频道中。而且输出会在下游得到检查，因为 Medallion 的系统会使用这些政策来执行自身经过审计和验证的操作。

#### **开始使用**

上述团队都从同一个起点出发：工程、产品、运营或招聘频道，配上一两个连接器，在公开话题串而非私信中工作，以便整个团队都能审查并接续上下文。

阅读 Claude Tag 面向医疗健康组织的最佳实践（[此处](https://claude.com/docs/claude-tag/admins/healthcare)），然后从一个频道开始。为某个告警或支持工程频道开启 Claude Tag，连接 GitHub，让团队与之协作两周后再扩大允许列表。

**_开始使用 [Claude Tag](https://support.claude.com/en/articles/15594475-what-is-claude-tag)。_**
