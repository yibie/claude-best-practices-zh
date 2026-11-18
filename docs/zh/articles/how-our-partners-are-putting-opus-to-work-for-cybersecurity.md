---
title: "我们的合作伙伴如何将 Opus 用于网络安全"
source_url: "https://claude.com/resources/articles/how-our-partners-are-putting-opus-to-work-for-cybersecurity"
publisher: "claude.com"
type: "blogPost"
date: "2026-05-21"
products: ["Claude Security","Claude Platform"]
read_time: 8
excerpt: "了解 Wiz、Palo Alto Networks 和 Accenture 等公司如何使用 Claude Opus 更快地发现并修复漏洞，并大规模部署 AI 防御。"
fetched_at: "2026-11-18"
---

# 我们的合作伙伴如何将 Opus 用于网络安全
AI 正在改变安全漏洞被发现和被利用的速度，而最明确的应对方式是让安全团队将能力强大的模型用于自身的防御。

当我们[推出 Claude Security 公开测试版](https://claude.com/resources/articles/claude-security-public-beta)时，我们也分享了一批基于 Claude Opus 构建的技术与服务合作伙伴，因为对每个团队来说，实现采用的最快路径各不相同：有些团队可能直接使用 Claude，有些通过他们已经在运行的平台使用，还有些通过熟悉其环境的服务合作伙伴使用。

其中多项产品现已上线，早期结果展示了前沿模型防御在实践中的样子。

## 早期结果

合作伙伴报告称，由 Opus 驱动的防御能力在内部和客户环境中均取得了显著提升：

-   每周对超过 150,000 个生产资产进行持续渗透测试，每周发现数千个经确认的高危和严重级别问题，且零误报（Wiz，客户生产环境）。
-   相当于一年的渗透测试工作量在不到三周内完成（Palo Alto Networks，内部测试）。
-   安全测试覆盖率从约 10% 提升至 80% 以上，覆盖 1,600 个应用和 500,000+ 个 API，扫描周转时间从 3–5 天缩短至不到一小时（Accenture，在其自有基础设施上）。

这些工作分为三个领域：大规模进攻性测试、弥合发现与修复漏洞之间的差距，以及将受治理的 AI 部署到生产环境。

## 生产规模的持续进攻性测试

进攻性测试意味着像对手一样攻击你自己的系统，从而先发现可被利用的路径。

Wiz [Red Agent](https://www.wiz.io/blog/red-agent-claude-opus) 是一款 AI 驱动的攻击者，它使用 Opus 在生产 Web 应用和 API 上像人类渗透测试人员一样推理。它分析应用逻辑、串联步骤，并适应实时服务器响应，以发现传统扫描器遗漏的逻辑驱动型缺陷。它每周持续运行于超过 150,000 个生产资产，发现数千个高危和严重级别问题，每个问题都通过可利用性证明和来自 Wiz Security Graph 的业务上下文进行验证。"安全团队不再受限于数据不足，而是受限于对数据的行动能力，"Wiz AI 与威胁研究副总裁 Alon Schindel 表示。"通过将前沿模型嵌入 Wiz Agents，我们使组织能够以 AI 的速度进行防御。"

[Unit 42 Frontier AI Defense](https://www.paloaltonetworks.com/unit42/ai-advantage) 是 Palo Alto Networks 的专家主导服务，使用 Opus 发现隐藏漏洞、梳理它们如何串联成关键攻击路径，并制定加固路线图以抵御 AI 驱动的攻击。该服务将暴露面分析与经过基准测试的机器速度防御蓝图以及实操转型工作相结合。"随着攻击者将前沿模型武器化以自动化网络攻击，防御必须更快，"Palo Alto Networks Unit 42 高级副总裁 Sam Rubin 表示。

CrowdStrike 的 [Frontier AI Readiness and Resilience Service](https://www.crowdstrike.com/en-us/services/ai-security-services/frontier-ai-readiness-and-resilience/) 将同类能力带到超过 60% 的《财富》500 强企业所信赖的平台上，将 Opus 与 CrowdStrike 的 AI Red Team Services 和专有智能体框架相结合，持续在客户应用中搜寻潜在的零日漏洞、验证发现结果，并在新代码进入生产环境之前加速修复。

> ""Anthropic 的 Claude Opus 等前沿模型正在赋予防御者一年前还不存在的能力优势，将漏洞管理一路前移。" - Mark Manglicmot，CrowdStrike 全球咨询服务副总裁"

## 弥合发现与修复之间的差距

发现漏洞与修复漏洞之间的差距正是大部分漏洞暴露所在，因为分类、优先级排序、补丁测试和跨团队交接都需要时间。

Accenture 的 [Cyber.AI](https://newsroom.accenture.com/news/2026/accenture-and-anthropic-team-to-help-organizations-secure-scale-ai-driven-cybersecurity-operations) 是一个智能体式平台，将资产、身份、威胁和控制连接成单一运营模型，由 Opus 在其中进行推理，以持续循环的方式运行检测、优先级排序和修复。Accenture 首先在内部进行了大规模验证：在其自有全球 IT 基础设施上，将安全测试覆盖率从约 10% 提升至 80% 以上，覆盖 1,600 个应用和 500,000+ 个 API，并将扫描周转时间从 3–5 天缩短至不到一小时——这些结果支撑了 Cyber.AI 如今向客户交付的能力。

> ""企业领导者正在应对历史上变化最快、最复杂的网络威胁格局。我们正与 Anthropic 合作，交付客户保持领先所需的工具。" - Harpreet Sidhu，Accenture 网络安全全球负责人"

TrendAI™ [Vision One](https://www.trendmicro.com/en_us/business/products/one-platform.html) 使用 Opus 辅助的漏洞研究，帮助遍布 185 个国家的企业识别暴露面并通过虚拟补丁缓解风险。经验证的发现结果还会流入 TrendAI Zero Day Initiative 进行协调披露，帮助在厂商补丁可用之前最多 96 天保护处于风险中的系统。"随着 AI 加速漏洞发现，防御者面临的真正挑战变成大规模修复，"TrendAI 首席平台与业务官 Rachel Jin 表示。"我们与 Anthropic 一起，帮助客户在攻击者利用这一差距之前，通过缓解措施和虚拟补丁降低风险。"

Deloitte 的[持续威胁暴露管理（CTEM）](https://www.deloitte.com/global/en/services/consulting-risk/services/deloitte-cyber-attack-surface-management.html)构建于 Deloitte Ascend™ 之上，将发现、验证、优先级排序和修复作为一个工作流运行，包括在无补丁可用时的对策设计。Opus 的代码推理和自动化稳定性测试让团队有信心在数小时内而非数天或数周内完成修复。"构建于 Ascend 之上的 CTEM 旨在帮助降低漏洞修复中的决策延迟，"Deloitte 合伙人兼美国网络负责人 Adnan Amjad 表示，"这一差距决定是攻击者还是防御者赢得窗口期。"

## 将受治理的 AI 投入生产

智能体式 AI 用例的新格局给许多团队带来了新挑战。如果没有清晰的框架，为部署设置控制措施、审计证据和自主边界，往往会让安全领域的 AI 采用停留在试点困境中。

PwC 的 [Claude Native Cybersecurity 产品](https://www.pwc.com/us/en/technology/alliances/anthropic.html)同时解决 CISO 提出的两个问题：让 AI 安全地进入生产环境，以及实现网络职能本身的现代化。Secure AI Adoption 帮助企业在数周而非数个季度内从沙箱走向生产，提供部署、治理和审计证据，帮助 CISO 和 CRO 有信心地为团队带来创新。Scaled Frontier Defense 将 Opus 驱动的智能体式推理集成到现有的漏洞管理、检测、安全工程和 GRC 工作流中，在既定护栏和可审计性范围内实现自主执行。

> ""这是网络安全的决定性时刻，AI 驱动的转型已成为保持韧性和竞争力的必要条件，" - Morgan Adamski，PwC 美国网络、数据与技术负责人"

## 不断壮大的生态系统

BCG、Infosys 和 SentinelOne 也在基于 Opus 构建防御性网络产品，我们将在这些产品可用时分享更多信息。

上述每一项产品都运行在相同的底层 Opus 能力之上：对代码进行推理、理解哪些暴露面会转化为现实世界风险，以及维持长时程智能体式工作流。我们很高兴与这些合作伙伴一起，通过最适合安全团队的接入点，将前沿防御带给更多安全团队。

_了解更多关于 [Claude 安全用例](https://claude.com/solutions/security)的信息。_

‍
