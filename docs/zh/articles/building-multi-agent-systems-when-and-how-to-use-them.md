---
title: "构建多智能体系统：何时使用以及如何使用"
source_url: "https://claude.com/resources/articles/building-multi-agent-systems-when-and-how-to-use-them"
publisher: "claude.com"
type: "blogPost"
date: "2026-01-23"
products: ["Claude Platform","Claude Code"]
read_time: 17
excerpt: "虽然单智能体系统能有效处理大多数企业工作流，但多智能体架构可以为你的组织释放额外价值。了解何时以及如何使用它们。"
fetched_at: "2026-11-18"
---

# 构建多智能体系统：何时使用以及如何使用
## 什么是多智能体系统？

多智能体系统是一种架构，其中多个 LLM 实例在各自独立的对话上下文中运行，并通过代码进行协调。每个智能体负责任务中一个独立的切片——例如，一个子智能体负责研究，而一个编排器负责规划——这样可以保护上下文、支持并行工作，并实现单个智能体无法维持的专业化。

存在多种协调模式（智能体集群、基于能力的系统以及消息总线架构），但本文聚焦于编排器-子智能体模式：一种分层模型，由主导智能体派生并管理针对特定子任务的专用子智能体。这种模式提供了直接的协调模型，对于刚接触多智能体系统的团队来说是一个很好的起点。我们将在下一篇文章中详细探讨其他模式。

如今，多智能体系统常常被应用于单个智能体会表现更好的场景，不过随着模型不断改进，这一判断也在持续演变。在 Anthropic，我们看到一些团队投入数月构建精心设计的多智能体架构，最终却发现对单个智能体改进提示词就能达到同等效果。

在构建多智能体系统并与将其部署到生产环境的团队合作之后，我们总结出三种多智能体始终优于单智能体的情形：上下文污染导致性能下降时、任务可以并行运行时，以及专业化能改善工具选择或任务聚焦时。在这些情形之外，协调成本通常超过收益。参见[何时将子智能体收回主智能体循环](https://claude.com/resources/articles/building-agents-when-to-fold-subagents-into-your-main-agent-loop)。

在本文中，我们分享如何识别单智能体的极限、找出多智能体系统大放异彩的三种场景，以及避免常见的实现错误。

## 从单智能体开始的理由

一个设计良好、配备合适工具的单智能体所能完成的工作远超许多开发者的预期。

多智能体系统会引入额外开销。每增加一个智能体，就多一个潜在故障点、多一套需要维护的提示词、多一个意外行为的来源。

我们观察到，一些团队构建了精心设计的多智能体系统，为规划、执行、审查和迭代分别设置独立的智能体，最终却发现每次交接都会丢失上下文，而且花在协调上的 token 比执行还多。在我们的测试中，对于同等任务，多智能体实现通常比单智能体方法多消耗 3-10 倍的 token。这种开销源于跨智能体复制上下文、智能体之间的协调消息，以及为交接而总结结果。

## 多智能体系统的决策框架

当多智能体架构能够解决单个智能体无法克服的特定约束时，它才具有价值。这意味着多智能体架构应保留给那些能带来明确收益、足以证明额外成本合理的情形。托管基础设施也可以为你处理这一点（参见 [Claude Managed Agents 中的多智能体编排](https://claude.com/resources/articles/new-in-claude-managed-agents)）。

以下模式代表了我们在这些投入上持续观察到正向回报的情形。

### 上下文保护

大语言模型的上下文窗口是有限的，随着上下文增长，响应质量可能下降。当一个智能体的上下文累积了来自某个子任务、却与后续子任务无关的信息时，就会发生上下文污染。子智能体提供了隔离，每个子智能体都在自己干净的上下文中专注于其特定任务。

设想一个客户支持智能体，它需要在诊断技术问题的同时检索订单历史。如果每次订单查询都向上下文添加数千个 token，智能体对技术问题的推理能力就会下降。

‍

**单智能体方法：**

```
# Single agent accumulates everything in context
conversation_history = [
    {"role": "user", "content": "My order #12345 isn't working"},
    {"role": "assistant", "content": "Let me check your order..."},
    # Tool result adds 2000+ tokens of order history
    {"role": "user", "content": "... (order details, past purchases, shipping info) ..."},
    {"role": "assistant", "content": "Now let me diagnose the technical issue..."},
    # Context is now polluted with order details the agent doesn't need
]
```

智能体必须在推理技术问题的同时，在上下文中维持 2000+ 个无关的订单历史 token，这会稀释注意力并降低响应质量。

‍

**多智能体方法：**

```
from anthropic import Anthropic

client = Anthropic()

class OrderLookupAgent:
    def lookup_order(self, order_id: str) -> dict:
        # Separate agent with its own context
        messages = [
            {"role": "user", "content": f"Get essential details for order {order_id}"}
        ]
        response = client.messages.create(
            model="claude-sonnet-4-5",
            max_tokens=1024,
            messages=messages,
            tools=[get_order_details_tool]
        )
        # Returns only essential information
        return extract_summary(response)

class SupportAgent:
    def handle_issue(self, user_message: str):
        if needs_order_info(user_message):
            order_id = extract_order_id(user_message)
            # Get only what's needed, not full history
            order_summary = OrderLookupAgent().lookup_order(order_id)
            # Inject compact summary, not full context
            context = f"Order {order_id}: {order_summary['status']}, purchased {order_summary['date']}"

        # Main agent context stays clean
        messages = [
            {"role": "user", "content": f"{context}\n\nUser issue: {user_message}"}
        ]
        response = client.messages.create(
            model="claude-sonnet-4-5",
            max_tokens=2048,
            messages=messages
        )
        return response
```

订单查询智能体处理完整的订单历史并提取摘要。主智能体只接收它实际需要的 50-100 个 token，从而保持上下文聚焦。

当子任务产生大量上下文（超过 1000 个 token）但其中大部分信息与主任务无关时，当子任务定义明确、对需要提取哪些信息有清晰标准时，以及对于需要先过滤再使用的查询或检索操作时，上下文隔离最为有效。

### 并行化

并行运行多个智能体可以让你探索比单个智能体所能覆盖的更大搜索空间。这种模式已被证明对搜索和研究任务尤其有价值。

Anthropic 的研究团队在[我们如何构建多智能体研究系统](https://www.anthropic.com/engineering/multi-agent-research-system)中记录了这一点。主导智能体分析查询，并派生多个子智能体并行调查不同方面。每个子智能体独立搜索，然后返回提炼后的发现。通过允许在更大的信息空间中探索，多智能体搜索相比单智能体方法已显示出显著的准确率提升。

核心实现将问题分解为相互独立的方面，并发运行子智能体，然后综合结果。

```
import asyncio
from anthropic import AsyncAnthropic

client = AsyncAnthropic()

async def research_topic(query: str) -> dict:
    # Lead agent breaks query into research facets
    facets = await lead_agent.decompose_query(query)

    # Spawn subagents to research each facet in parallel
    tasks = [
        research_subagent(facet)
        for facet in facets
    ]
    results = await asyncio.gather(*tasks)

    # Lead agent synthesizes findings
    return await lead_agent.synthesize(results)

async def research_subagent(facet: str) -> dict:
    """Each subagent has its own context window"""
    messages = [
        {"role": "user", "content": f"Research: {facet}"}
    ]
    response = await client.messages.create(
        model="claude-sonnet-4-5",
        max_tokens=4096,
        messages=messages,
        tools=[web_search, read_document]
    )
    return extract_findings(response)
```

这种覆盖面的提升是有代价的。对于同等任务，多智能体系统通常比单智能体方法多消耗 3 到 10 倍的 token。这是因为每个智能体都需要自己的上下文，智能体之间必须交换消息来协调，而且结果在智能体之间传递时必须进行总结。虽然与顺序执行所有工作相比，并行有助于缩短总执行时间，但由于总计算量的大幅增加，多智能体系统整体上往往比单智能体系统耗时更长。

并行化的主要收益是彻底性，而非速度。当你需要在大型信息空间中搜索，或调查复杂问题的多个角度时，并行智能体比在上下文限制内工作的单个智能体能够覆盖更多范围。代价是更高的 token 用量和通常更长的总执行时间，以换取更全面的结果。

### 专业化

不同任务有时受益于不同的工具集、系统提示词或专业领域。与其让单个智能体访问数十个工具，不如使用与其职责相匹配的聚焦工具集的专用智能体，这样可以提高可靠性。

#### **工具集专业化**

当智能体可访问的工具过多时，性能会下降。三个信号表明工具专业化会有帮助：

1.  **数量。** 工具过多的智能体（通常 20+ 个）难以选择合适的工具。
2.  **领域混淆。** 当工具跨越多个不相关的领域（数据库操作、API 调用、文件系统操作）时，智能体会混淆哪个领域适用于给定任务。
3.  **性能下降。** 添加新工具会降低现有任务的性能，这表明智能体已达到其工具管理能力的上限。

#### **系统提示词专业化**

不同任务有时需要不同的人设、约束或指令，而这些在合并时会相互冲突。客户支持智能体需要富有同理心和耐心；代码审查智能体需要精确和批判性。合规检查智能体需要严格遵循规则；头脑风暴智能体需要创造性灵活性。当单个智能体必须在相互冲突的行为模式之间切换时，将其分离为具有定制系统提示词的专用智能体可以产生更一致的结果。

每个专用智能体的效果取决于其指令——那些改善单个智能体输出的[提示词工程最佳实践](https://claude.com/resources/articles/best-practices-for-prompt-engineering)同样适用于每个子智能体的系统提示词。

#### **领域专业知识专业化**

有些任务受益于深厚的领域上下文，而这些上下文会让通才智能体不堪重负。法律分析智能体可能需要关于判例法和监管框架的大量上下文。医学研究智能体可能需要关于临床试验方法的专业知识。与其将所有领域上下文加载到单个智能体中，专用智能体可以携带与其特定职责相关的聚焦专业知识。

**示例：多平台集成。** 设想一个集成系统，智能体需要跨 CRM、营销自动化和消息平台工作。每个平台有 10-15 个相关 API 端点。拥有 40+ 个工具的单个智能体常常难以正确选择，会混淆跨平台的相似操作。拆分为具有聚焦工具集和定制提示词的专用智能体可以解决选择错误。

```
from anthropic import Anthropic

client = Anthropic()

# Specialized agents with focused toolsets and tailored prompts
class CRMAgent:
    """Handles customer relationship management operations"""
    system_prompt = """You are a CRM specialist. You manage contacts,
    opportunities, and account records. Always verify record ownership
    before updates and maintain data integrity across related records."""
    tools = [
        crm_get_contacts,
        crm_create_opportunity,
        # 8-10 CRM-specific tools
    ]

class MarketingAgent:
    """Handles marketing automation operations"""
    system_prompt = """You are a marketing automation specialist. You
    manage campaigns, lead scoring, and email sequences. Prioritize
    data hygiene and respect contact preferences."""
    tools = [
        marketing_get_campaigns,
        marketing_create_lead,
        # 8-10 marketing-specific tools
    ]

class OrchestratorAgent:
    """Routes requests to specialized agents"""
    def execute(self, user_request: str):
        response = client.messages.create(
            model="claude-sonnet-4-5",
            max_tokens=1024,
            system="""You coordinate platform integrations. Route requests to the appropriate specialist:
- CRM: Contact records, opportunities, accounts, sales pipeline
- Marketing: Campaigns, lead nurturing, email sequences, scoring
- Messaging: Notifications, alerts, team communication""",
            messages=[
                {"role": "user", "content": user_request}
            ],
            tools=[delegate_to_crm, delegate_to_marketing, delegate_to_messaging]
        )
        return response
```

这种模式反映了有效的专业协作：拥有与其角色相匹配工具的专家，比试图在所有领域维持专业知识的通才协作得更有效。然而，专业化引入了路由复杂性。编排器必须正确分类请求并委派给正确的智能体，错误路由会导致糟糕的结果。维护多个专用智能体也增加了提示词维护开销。当领域可以清晰分离且路由决策明确无歧义时，专业化效果最好。

## 单智能体架构不再够用

除了通用框架之外，某些具体信号表明单智能体模式已不再够用：

**接近上下文限制。** 如果智能体经常使用大量上下文且性能正在下降，上下文压力可能是瓶颈。请注意，上下文管理的最新进展（[例如上下文压缩（compaction）](https://platform.claude.com/cookbook/tool-use-automatic-context-compaction)）正在减轻这一限制，使单个智能体能够在长得多的时程内维持有效记忆。

**管理大量工具。** 当智能体拥有 15-20+ 个工具时，模型会花费大量上下文和注意力来理解其选项。在采用多智能体架构之前，考虑使用 [Tool Search Tool](https://docs.anthropic.com/en/docs/agents-and-tools/tool-use/tool-search-tool)，它让 Claude 按需动态发现工具，而不是预先加载所有定义。这可以[将 token 用量减少多达 85%](https://www.anthropic.com/engineering/advanced-tool-use)，同时提高工具选择准确率。

**可并行的子任务。** 当任务自然分解为独立部分时（跨多个来源研究、为多个组件编写测试），并行子智能体可以带来显著的加速。

这些阈值会随着模型改进而变化。当前的限制代表实用指南，而非根本性约束。

## 以上下文为中心的分解

采用多智能体架构时，最重要的设计决策是如何在智能体之间划分工作。我们观察到团队经常做出错误的选择，导致协调开销抵消了多智能体设计的收益。

关键洞见是：在分解工作时，采用**以上下文为中心的视角**，而非以问题为中心的视角。

**以问题为中心的分解（往往适得其反）。** 按工作类型划分（一个智能体编写功能，另一个编写测试，第三个审查代码）会产生持续的协调开销。每次交接都会丢失上下文。编写测试的智能体不了解为何做出某些实现决策，代码审查者也缺乏探索和迭代的上下文。

**以上下文为中心的分解（通常有效）。** 按上下文边界划分意味着处理某个功能的智能体也应处理其测试，因为它已经拥有必要的上下文。只有当上下文可以真正隔离时，才应拆分工作。

这一原则源于对多智能体系统失败模式的观察。当智能体按问题类型拆分时，它们会玩起"传话游戏"，来回传递信息，每次交接都会降低保真度。在一项按软件开发角色（规划者、实现者、测试者、审查者）划分智能体的实验中，子智能体花在协调上的 token 比实际工作还多。

**有效的分解边界包括：**

-   **独立的研究路径。** 调查"亚洲市场趋势"与"欧洲市场趋势"可以并行进行，无需共享上下文。
-   **具有清晰接口的独立组件。** 有了定义良好的 API 契约，前端和后端工作可以并行进行。
-   **黑盒验证。** 只需要运行测试并报告结果的验证器不需要实现上下文。

**有问题的分解边界包括：**

-   **同一工作的顺序阶段。** 同一功能的规划、实现和测试共享太多上下文。
-   **紧密耦合的组件。** 需要不断来回沟通的组件应属于同一个智能体。
-   **需要共享状态的工作。** 需要频繁同步理解的智能体应保持在一起。

## 验证子智能体模式

一种在各领域都持续有效的多智能体模式是**验证子智能体**。这是一个专用智能体，其唯一职责是测试或验证主智能体的工作。

值得注意的是，能力更强的编排器模型（如 Claude Opus 4.5）越来越能够直接评估子智能体的工作，而无需单独的验证步骤。然而，在使用能力较弱的编排器时、当验证需要专用工具时，或当你希望在工作流中强制执行明确的验证检查点时，验证子智能体仍然有价值。

验证子智能体之所以成功，是因为它们避开了传话游戏问题。验证本质上需要最少的上下文传递，因此验证器可以对系统进行黑盒测试，而无需了解其构建的完整历史。

### 实现多智能体系统

主智能体完成一个工作单元。在继续之前，它派生一个验证子智能体，并提供要验证的产物、明确的成功标准以及执行验证的工具。

验证器不需要理解产物为何这样构建。它只需要确定产物是否满足指定标准。

```
from anthropic import Anthropic

client = Anthropic()

class CodingAgent:
    def implement_feature(self, requirements: str) -> dict:
        """Main agent implements the feature"""
        messages = [
            {"role": "user", "content": f"Implement: {requirements}"}
        ]
        response = client.messages.create(
            model="claude-sonnet-4-5",
            max_tokens=4096,
            messages=messages,
            tools=[read_file, write_file, list_directory]
        )
        return {
            "code": response.content,
            "files_changed": extract_files(response)
        }

class VerificationAgent:
    def verify_implementation(self, requirements: str, files_changed: list) -> dict:
        """Separate agent verifies the work"""
        messages = [
            {"role": "user", "content": f"""
Requirements: {requirements}
Files changed: {files_changed}

Run the test suite and verify:
1. All existing tests pass
2. New functionality works as specified
3. No obvious errors or security issues

You MUST run the complete test suite before marking as passed.
Do not mark as passing after only running a few tests.
Run: pytest --verbose
Only mark as PASSED if ALL tests pass with no failures.
"""}
        ]
        response = client.messages.create(
            model="claude-sonnet-4-5",
            max_tokens=4096,
            messages=messages,
            tools=[run_tests, execute_code, read_file]
        )
        return {
            "passed": extract_pass_fail(response),
            "issues": extract_issues(response)
        }

def implement_with_verification(requirements: str, max_attempts: int = 3):
    for attempt in range(max_attempts):
        result = CodingAgent().implement_feature(requirements)
        verification = VerificationAgent().verify_implementation(
            requirements,
            result['files_changed']
        )

        if verification['passed']:
            return result

        requirements += f"\n\nPrevious attempt failed: {verification['issues']}"

    raise Exception(f"Failed verification after {max_attempts} attempts")
```

### 多智能体系统应用

验证子智能体适用于：

-   **质量保证。** 运行测试套件、对代码进行 lint 检查、根据 schema 验证输出。
-   **合规检查。** 验证文档是否满足政策要求，根据规则检查输出。
-   **输出验证。** 在交付前确认生成的内容符合规范。
-   **事实核查。** 让单独的智能体验证生成内容中的声明或引用。

### 过早宣告成功的问题

验证子智能体最显著的失败模式是在没有彻底测试的情况下将输出标记为通过。验证器运行一两个测试，观察到它们通过，就宣布成功。

缓解策略包括：

-   **具体标准。** 指定"运行完整测试套件并报告所有失败"，而不是"确保它能工作"。
-   **全面检查。** 要求验证器测试多个场景和边界情况。
-   **负面测试。** 指示验证器尝试应当失败的输入并确认它们确实失败。
-   **明确指令。** "你必须在标记为通过之前运行完整测试套件"这一指令至关重要。如果没有对全面验证的明确要求，验证智能体会走捷径。

## 在单智能体与多智能体系统之间选择

多智能体系统很强大，但并非普遍适用。在增加多个协调智能体的复杂性之前，请确认：

1.  **存在真正的约束**，且多智能体能够解决，例如上下文限制、并行化机会或专业化需求。
2.  **分解遵循上下文，而非问题类型。** 按工作需要什么上下文来分组工作，而不是按工作是什么类型。
3.  **存在清晰的验证点**，子智能体可以在不需要完整上下文的情况下验证工作。

我们的建议？从能起作用的最简单方法开始，只在有证据支持时才增加复杂性。

_这是多智能体系统系列文章的第一篇。关于单智能体模式的更多内容，参见[构建有效的智能体](https://www.anthropic.com/engineering/building-effective-agents)。关于上下文管理策略，参见[面向 AI 智能体的有效上下文工程](https://www.anthropic.com/engineering/effective-context-engineering-for-ai-agents)。关于我们如何构建多智能体研究系统的深入探讨，参见[我们如何构建多智能体研究系统](https://www.anthropic.com/engineering/multi-agent-research-system)。_

## 致谢

由 Cara Phillips 撰写，Paul Chen、Andy Schumeister、Brad Abrams 和 Theo Chu 参与贡献。
