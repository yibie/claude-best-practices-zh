---
title: "在 Claude Code 中用 Skills 构建验证循环"
source_url: "https://claude.com/resources/articles/building-verification-loops-in-claude-code-with-skills"
publisher: "claude.com"
type: "blogPost"
date: "2026-07-22"
products: ["Claude Code"]
read_time: 5
excerpt: "如何把你手动执行的检查变成 Skills，让 Claude 自己闭合反馈循环。"
fetched_at: "2026-11-18"
---

# 在 Claude Code 中用 Skills 构建验证循环

大多数[智能体式编程](https://claude.com/resources/articles/introduction-to-agentic-coding)会话都遵循一个循环：你提出一项改动，Claude 收集上下文、采取行动、验证结果，如有需要，再回到收集更多上下文的步骤。

验证是智能体在回复之前检查自身工作的方式。Claude 已经能通过观察代码库中的确定性信号完成一部分验证，包括类型检查器、linter、测试和运行时错误。Claude 无法推断的部分，就变成了你手动检查某个功能时所采取的步骤。

不过，这些手动步骤可以转化为验证循环。在 [Claude Code](https://claude.com/product/claude-code) 中，验证循环是一个迭代过程，Claude 在其中检查并尝试修复工作。

![智能体循环示意图：1. 收集上下文，2. 采取行动，3. 验证结果。](https://assets.claude.com/5dd20c12d10d8e9e337f413fa1466f39a80296d0.png)

智能体循环：1. 收集上下文，2. 采取行动，3. 验证结果。

在本文中，我们介绍最常见的几类验证循环，并展示我们在 Anthropic 内部使用的做法。然后，我们会演示如何把你已经在做的手动检查编码为 Skills，让 Claude 自己闭合反馈循环，而你可以去做别的事情，让它自行迭代。

刚接触智能体循环？请先阅读[循环入门](https://claude.com/resources/articles/getting-started-with-loops)。

## 什么是验证循环？

验证循环是一个重复的周期，AI 智能体在其中检查自己的工作——运行测试、linter 或自定义检查——并在继续之前修复失败的部分。在 Claude Code 中，验证循环可以打包为 Skills，这样每次会话都会自动应用相同的检查，而不必依赖人去记住它们。

## 内置的验证循环

在深入设计自定义验证循环之前，先了解 Claude 对多种验证循环的内置支持会很有帮助。常见功能和做法包括：

-   **/verify skill**：构建、运行并观察你的应用中的改动。
-   **工具链**：Claude 会尝试捕获并响应你提供的任何工具（例如 linter）的错误码和警告。一个好做法是在 CLAUDE.md 中列出你确切的构建和测试命令，这样 Claude 就不必去推断它们。
-   **代码审查（研究预览）**：一项托管的多智能体服务，会在你启用的仓库中对 PR 运行自动审查。你可以手动修复发现的问题并推送，或者通过在发现的问题下评论 @claude 来闭合循环（前提是你已经设置并配置了下面的 GitHub Actions）。
-   **GitHub Actions**：定义一个调用 Claude 并附带验证 skill 的任务，你本地运行的相同检查就会在每次推送或 PR 时触发。
-   **规范校验**：一个 skill，帮助对照仓库中的 markdown 规范验证每项改动，并尝试修复违规之处。
-   **Claude Managed Agents 中的评分标准（beta）**：一项托管的智能体式服务，允许使用独立的评分智能体对照评分标准验证结果。失败会自动回到返工环节。

## 编写验证循环

当你有一个现有项目，并且发现每次 Claude 为你实现新功能时，你都在做同样的小修正，那就是时候把这些步骤变成你自己的自定义验证循环了。第一步是写下你发现自己每次都在做的所有事情。

如果你在启动一个新项目、需要弄清楚项目应该如何运作，道理也是一样。用平实的语言写出最佳实践版本，就像你在第一天交给新队友那样。

如果你难以把验证检查本身表述清楚，可以先向 Claude 询问最佳实践，再在此基础上修改。你的版本可能在几个具体点上有所不同，而这些差异正是你想要捕捉的。

**专业提示**：检查不必是定性的才能归入此类。「拒绝任何删除列却没有回填步骤的迁移」是一条确定性规则，通用 linter 抓不到，但项目专用的 linter 能抓到。任何你一直不得不手动执行的检查，都值得被捕获为一个循环。

## 把它做成 skill

把重复步骤编码为验证循环最常见的方式，是把它写成一个 [skill](https://claude.com/resources/articles/complete-guide-to-building-skills-for-claude)，而创建 skill 最快的方式是安装 skill-creator 插件，让 Claude 来访谈你：

示例：

```
/skill-creator Create a skill for verifying frontend changes end-to-end. Interview me about my workflow.
```

你也可以通过在项目的 .claude/skills/ 中放入一个 markdown 文件来手写 skill。最简单的验证 skill 只需几行 frontmatter 加一个正文：

```
# .claude/skills/verify-log-hygiene/SKILL.md
---
name: verify-log-hygiene
description: Check that error logs include the request ID and never
  include the request body. Use when the diff touches error handling
  or logging.
allowed-tools: [Read, Edit, Grep]
---
Read the error-handling paths in the current diff.

For each log call on an error path, confirm it includes the request ID
and does not pass the request body, headers, or any user-supplied payload.

Report each violation with file:line, then fix it: add the request ID
where it's missing and strip the payload from the log call.
```

完整的 schema 及其背后的理念见我们的 [skill 构建完整指南](https://claude.com/resources/articles/complete-guide-to-building-skills-for-claude)。

## 让检查匹配其运行位置

接下来要确定的是验证循环如何启动：独立、内嵌、链式，还是绑定到 PR。

### 独立

你在产物存在之后刻意调用它。独立 skill 适用于那些并非每次都适用的横切检查：提交前的安全扫描、PR 前的无障碍审计、跨仓库的许可证头验证。任何你希望在许多工作流中可用、但不想在每次代码改动时都触发的检查。

代价是，每次调用仍然是你必须记得去执行的一步。当你发现自己在每次改动后都运行它时，就说明独立模式已经不够用了。此时，这套流程已经值得一个永久的归宿：内嵌它或链式它。

### 内嵌

作为产出 skill 的一部分自动触发。该检查属于某个特定工作流，而该工作流现在无需你要求就会运行它。

最简单的版本是在产出 skill 的正文末尾追加一行：

```
# .claude/skills/scaffold-component/SKILL.md
---
name: scaffold-component
description: Scaffold a new React component under src/components/, including the component file, its co-located test, and an index export. Use when the user asks to create a new component.
allowed-tools: [Read, Write, Edit, Bash, Glob]
---

# Scaffold a new React component

Given a component name (PascalCase), create the following under `src/components/<Name>/`:

1. `<Name>.tsx`: function component with a typed props interface and a default export.
2. `<Name>.test.tsx`: React Testing Library test that renders the component and asserts it mounts without throwing.
3. `index.ts`: re-export the default and any named exports.

Follow the patterns in `src/components/Button/` as the reference. Match the import alias style (`@/components/...`) used throughout the codebase.

# code continues...

After creating the component file, run eslint on it and
address any errors before reporting completion.
```

在一个新任务上调用该 skill，确认新增的步骤作为输出的一部分运行，以此验证内嵌是否生效。如果没有生效，说明该 skill 的描述或前面的指令没有把追加的检查带进来。

内嵌只适用于你能编辑的 skill：你自己写的，或者安装在项目级别、SKILL.md 文件由你掌控的。内置 skill 和插件管理的 skill（更新时会被覆盖的那种）不适用于这种模式；对于这些，改用链式。

对于跨工作流的检查，跳过内嵌；这些检查适合独立模式，这样你可以从任何上下文中调用它们。

### 链式

一个 skill 在其末尾调用另一个 skill，多次经过验证的交接会端到端运行。

Anthropic 的 Claude Code 团队成员在日常工作中使用这种模式：/code-review 查找 bug，/simplify 清理 diff，一个 /verify skill 确认端到端行为，如果改动涉及 UI，还有一个自定义的 /design skill 对照 DESIGN.md 文件中的规范进行检查。

链式也是你为无法修改的 skill 添加验证的方式：构建一个自定义包装 skill，先调用原始 skill，再调用你的验证 skill，如下所示：

```
# .claude/skills/safe-refactor/SKILL.md
Run /simplify on the current diff first.
When /simplify finishes, invoke /verify-no-public-api-changes.
```

原本是一个习惯（「我总是在 /simplify 之后运行 /verify」），现在变成了一份约定（「/simplify 完成时总是运行 /verify」）。这条链自行运行整个开发周期。只有当某些事情升级回你这里时，你才介入。

当各步骤足够独立、你有时想单独运行其中一个而不运行其他时，可以跳过链式；链式用灵活性换取自动化。链式验证循环可能增加 token 消耗，因此最好在广泛部署之前先测试这些循环。

### 在每个 PR 上

一旦这条链对你自己的改动足够稳固，同样的流程就可以在每个 PR 上运行。队友的改动会通过与你相同的关卡，无论他们是否记得调用这条链。这套基础设施与你已经写好的链属于同一类东西，只是更进一步：相同的 Skills、相同的评分标准、相同的标准，不依赖作者的勤勉来应用。

这时，验证不再是个人的基础设施，而成为[团队基础设施](https://claude.com/resources/articles/how-claude-code-works-in-large-codebases-best-practices-and-where-to-start)。你为了每周给自己省两分钟而写下的检查，现在在每次改动上为每个人每周省两分钟。当这条链仍在变动时，先不要设置全 PR 范围的关卡；每一次调整都会成为团队可见的事件。

一旦你掌握了这套流程，就可以扩展你的循环工程了。无论你在自动化什么、在什么环境中，验证循环的创建过程都是一致的：

1.  选出你这周最常做的手动后续步骤。
2.  先试用内置的 /verify skill，看看它是否对你的流程有帮助。
3.  用平实的语言写出流程，就像你在第一天交给新队友那样。
4.  交给 skill-creator，或者自己把 markdown 文件放入 .claude/skills/。
5.  在一个新任务上调用它，确认检查作为输出的一部分运行，必要时迭代。
6.  尝试 skill 链式，创建端到端的验证流程。

你能为 Claude 编码的规则越多，Claude 的回复就越经常在第一次尝试时就接近你想要的结果。你不再需要反复处理的那些修正，现在可以把你的注意力释放出来，用于那些没有 skill 能替你写下的、独特而专属的工作。

**_在 [Claude Code](https://www.anthropic.com/product/claude-code) 中开始使用验证循环_**。

_本文由 Claude Code 团队成员 Delba de Oliveira 撰写。_
