---
title: "引导 Claude Code：何时使用 CLAUDE.md、Skills、钩子（hooks）与子智能体"
source_url: "https://claude.com/resources/articles/steering-claude-code-skills-hooks-rules-subagents-and-more"
publisher: "claude.com"
type: "blogPost"
date: "2026-06-18"
products: ["Claude Code"]
read_time: 5
excerpt: ""
fetched_at: "2026-11-18"
---

# 引导 Claude Code：何时使用 CLAUDE.md、Skills、钩子（hooks）与子智能体
Claude 的设计目标是按照你的工作方式工作，而在 Claude Code 中，你可以对它进行自定义。

有七种方法可以指示 Claude 的行为：CLAUDE.md 文件、规则（rules）、[**Skills（技能）**](https://code.claude.com/docs/en/skills)、[**子智能体**](https://code.claude.com/docs/en/sub-agents)、[**钩子（hooks）**](https://code.claude.com/docs/en/hooks-guide)、输出样式（output styles），以及追加系统提示词。

每种方法控制：

-   指令何时加载到上下文中；
-   它是否能在长会话中持续存在（上下文压缩（compaction）行为）；以及
-   它携带多大的权威性。

下表简要总结了各方法之间的关键差异，而本文则提供更多细节和决策框架，帮助你确定每条 Claude 指令应该放在哪里。

| 方法 | 加载时机 | 上下文压缩行为 | 上下文成本 | 使用场景 |
| --- | --- | --- | --- | --- |
| CLAUDE.md（根目录） | 会话开始时；在整个会话期间保留在上下文中 | 记忆化。读取一次并缓存供会话使用；上下文压缩后缓存清除并重新读取 | 高。每一行无论是否相关都会消耗 token | 构建命令、目录布局、monorepo 结构、编码约定、团队规范 |
| CLAUDE.md（子目录） | 按需加载，当 Claude 读取该子目录下的文件时 | 丢失，直到再次触及该子目录 | 低。仅当处理相关子目录时才消耗上下文 | 子目录特有的约定 |
| 规则（rules） | 会话开始时（用户级规则）或仅在触及匹配文件时（路径限定） | 上下文压缩时重新注入 | 中。除非路径限定，否则始终开启 | 特定约束或约定（例如，所有 API 处理程序必须用 Zod 验证输入） |
| Skills | 会话开始时加载名称和描述；调用该技能时加载完整正文 | 已调用的 Skills 在共享预算内重新注入；最旧的先丢弃 | 低。仅在调用时加载完整正文；受已调用 Skills 之间共享的 token 预算约束 | 流程性工作流（部署或发布检查清单） |
| 子智能体 | 会话开始时加载名称、描述和工具列表；正文仅在通过 Agent 工具调用时加载 | 只有最终消息（摘要加元数据）返回主会话 | 低。在被调用前主上下文零成本；在自身隔离的上下文窗口中运行 | 并行运行工作，或应在隔离环境中运行且只返回摘要的侧任务（深度搜索、日志分析、依赖审计） |
| 钩子（hooks） | 在生命周期事件上触发 | 完全绕过上下文压缩 | 低。配置存在于主上下文之外；部分输出可能返回（例如，阻断性错误） | 确定性自动化：运行 linter、完成时发布到 Slack、阻断命令、在 PreCompact 时备份聊天历史 |
| 输出样式（output styles） | 会话开始时；注入到系统提示词中 | 永不压缩 | 高。占用上下文窗口，但会覆盖默认系统提示词 | 重大角色变更（从代码助手变为通用助手） |
| 追加系统提示词 | 会话开始时；作为 CLI 标志传入 | 永不压缩；仅适用于该次调用 | 中。会话中首次请求后缓存 | 语气、响应长度、格式偏好 |

滑动查看更多

## 传递指令的七种方法

有七种方式可以自定义 Claude Code 的行为：CLAUDE.md 文件用于始终开启的项目上下文，规则用于硬性约束，Skills 用于可复用的流程，子智能体用于委派工作，钩子（hooks）用于确定性自动化，而输出样式或系统提示词追加用于全局变更。

每种方法都在上下文成本与权威性之间进行权衡。这些方法影响 Claude 的行为，而另外两个调节项——[你选择的模型和努力级别](https://claude.com/resources/articles/claude-model-and-effort-level-in-claude-code)——控制它的能力有多强以及它工作有多努力。

### CLAUDE.md 文件

CLAUDE.md 是项目根目录下的一个 Markdown 文件。它在会话开始时加载到上下文中，并在整个会话期间保留在那里。

构建命令、目录布局、monorepo 结构、编码约定和团队规范都自然地适合放在这里。

有两种类型，它们的加载方式不同：

-   **始终加载**：第一种是根目录 CLAUDE.md 文件，可以放在共享仓库中，和/或保存在本地用于你对特定项目的个人偏好。所有这些文件在会话开始时加载，不会在长会话中丢失或降级。当 Claude Code 压缩对话时，它会重新读取这些文件。
-   **按需加载**：位于你初始化会话的文件夹之下子目录中的 CLAUDE.md 文件。例如，`app/api/CLAUDE.md` 在 Claude 读取 `app/api` 下的文件时加载，而不是在会话开始时。它与路径限定规则共享上下文压缩行为：在再次触及该子目录之前一直丢失。



当 Claude 读取该目录内的文件时，cwd 之下的所有子目录 CLAUDE.md 文件都会加载。

在共享仓库中，CLAUDE.md 会像任何无主配置文件一样增长：每个团队追加自己的指令，什么都不删除。成本会随规模复利增长。

每一行都会加载到在该仓库中工作的每位工程师的每个会话中，无论它是否与他们的任务相关。这会消耗 token 并稀释对真正重要指令的遵循度。随着文件增长，将团队特定的约定推入路径限定规则，将流程推入 Skills，让它们仅在相关时加载。

**提示：** 将 CLAUDE.md 保持在 200 行以内，给它指定一个负责人，并像审查代码一样审查对它的更改。内容本身应遵循与任何提示词相同的规则：[编写有效的提示词](https://claude.com/resources/articles/best-practices-for-prompt-engineering)意味着要明确、解释约束背后的原因，并展示示例。

把这个文件看作是为 Claude 提供代码库的概览，或者作为一个索引，指向 Claude 在需要时可以找到更多信息的其他文件。

在 monorepo 中，为每个团队的目录提供自己的子目录 CLAUDE.md，这样团队只加载自己的约定，开发者可以使用 claudeMdExcludes 设置跳过他们从不接触其代码的团队的文件。

对于必须应用于组织中每个仓库的标准——安全策略、合规要求——可以通过 MDM 或配置管理将集中管理的 CLAUDE.md 部署到开发者机器上，并且它不能被个人设置排除。

关于设置 CLAUDE.md 的更多内容，请参阅我们的博客文章 [CLAUDE.md 文件：为你的代码库自定义 Claude Code](https://claude.com/resources/articles/using-claude-md-files)。
