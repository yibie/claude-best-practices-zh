---
title: "Claude Code 高级用户定制：如何配置钩子（hooks）"
source_url: "https://claude.com/resources/articles/how-to-configure-hooks"
publisher: "claude.com"
type: "blogPost"
date: "2025-12-11"
products: ["Claude Code"]
read_time: 14
excerpt: "了解如何配置 Claude Code 钩子（hooks），以自动化重复性任务、强制执行项目规则，并向你的编码会话注入动态上下文。"
fetched_at: "2026-11-18"
---

# Claude Code 高级用户定制：如何配置钩子（hooks）

即便是顺畅的 [Claude Code](https://www.claude.com/product/claude-code) 工作流，也会随着时间推移积累摩擦点。每次 Claude 写入文件，[Prettier](https://prettier.io/) 都需要手动运行。每次它运行 npm test，都会弹出同样的权限提示。每个会话开始时，都要把同样的样板项目上下文粘贴到第一条消息里。

好消息是？[钩子（hooks）](https://code.claude.com/docs/en/hooks-guide) 能消除这些摩擦点。它们是你可配置的触发器，在特定操作之前或之后触发，让你能够把自定义逻辑、脚本和命令直接注入 Claude 的操作中。

本文面向已经熟悉 Claude Code 基础知识的开发者，介绍进阶配置。读完之后，你将了解八种钩子类型、每种类型的使用场景、如何配置它们，以及出问题时如何调试。

让我们开始吧。

## **什么是钩子？**

钩子是你创建的自定义 shell 命令，当 Claude Code 会话中发生目标事件时自动执行，例如 Claude 即将写入文件，或你提交了一条提示词。你可以为大量场景指定钩子：在操作执行前拦截、注入智能体上下文、自动化审批，或在操作发生前阻止它。

钩子在设置文件中配置，使用 JSON 结构，包含事件名、匹配器（用于筛选哪些工具触发钩子）以及要运行的命令。它们在你的本地环境中以你的用户权限执行，通过 stdin 接收触发事件的信息，并通过退出码和 stdout 回传信息。这让你无需修改工具本身，就能精确控制 Claude Code 的行为。

## **为什么在 Claude Code 中使用钩子？**

钩子解决三类问题。

第一，**它们消除了重复的手动步骤**。不必每次文件变更后都运行格式化工具，PostToolUse 钩子会自动处理。不必第一百次批准 npm test，PermissionRequest 钩子会自动批准它。

第二，**钩子自动强制执行项目专属规则**。你可以在危险命令执行前阻止它们，在写入前校验文件路径，或确保遵循命名约定。这些护栏每次都会运行，而不只是在你记得检查时才运行。

第三，**钩子无需手动操作即可注入动态上下文**。SessionStart 钩子可以把当前的 git 状态和 TODO 列表提供给 Claude。UserPromptSubmit 钩子可以把你的冲刺优先级附加到每个请求上。Claude 始终掌握信息，无需你反复说明。

## **Claude Code 钩子类型及其使用场景**

Claude Code 提供八种钩子事件，覆盖会话的完整生命周期，从启动、工具执行到结束。每种都在特定时刻触发，让你精确控制自动化何时运行。选择正确的钩子取决于你想达成什么目标。

**钩子一览**

如果不需要图注，可以删除这一行
| 钩子 | 触发时机 | 常见用途 |
| --- | --- | --- |
| PreToolUse | 工具执行之前 | 阻止危险命令、校验文件路径、自动批准安全操作 |
| PermissionRequest | 权限对话框出现之前 | 自动批准测试命令、阻止访问敏感文件 |
| PostToolUse | 工具完成之后 | 运行格式化工具、触发 linter、记录文件变更 |
| PreCompact | 上下文压缩（compaction）之前 | 备份对话记录、保留重要决策 |
| SessionStart | 会话开始或恢复时 | 注入 git 状态、加载 TODO 列表、设置环境上下文 |
| Stop | Claude 完成响应时 | 验证任务完成情况、运行测试、生成摘要 |
| SubagentStop | 子智能体完成时 | 校验子智能体输出、触发后续操作 |
| UserPromptSubmit | 你提交提示词时 | 注入冲刺上下文、校验请求、添加动态上下文 |

### **PreToolUse**

这是最常用的钩子，在 Claude 选定要使用的工具之后、工具实际执行之前触发。你的脚本可以检查计划中的操作，并批准、阻止、请求用户确认或修改参数，使用匹配器筛选哪些工具触发此钩子。

这个 PreToolUse 示例在文件写入执行前对其进行评估。Claude 根据指定标准审查计划中的操作，并可基于提示词逻辑批准、阻止或标记问题。

```
{
  "hooks": {
    "PreToolUse": [
      {
        "matcher": "Write",
        "hooks": [
          {
            "type": "command",
            "command": "/path/to/validate-file-path.sh"
          }
        ]
      }
    ]
  }
}
```

何时使用 PreToolUse：

-   阻止危险的 Bash 命令，如 rm -rf 或强制推送
-   自动批准安全、重复的操作，以减少提示疲劳
-   在写入前校验文件路径，防止意外覆盖文件
-   修改工具输入，注入项目专属默认值

### **PermissionRequest**

此钩子在 Claude 通常会显示权限对话框时触发。它拦截你即将看到确认提示的那一刻，让你的脚本决定是允许、拒绝，还是仍然询问用户。

```
{
  "hooks": {
    "PermissionRequest": [
      {
        "matcher": "Bash(npm test*)",
        "hooks": [
          {
            "type": "command",
            "command": "/path/to/validate-test-command.sh"
          }
        ]
      }
    ]
  }
}
```

此示例自动批准任何以 npm test 开头的 Bash 命令。匹配器模式可以包含参数，以实现更精细的控制。

何时使用 PermissionRequest：

-   自动批准你每个会话要运行几十次的测试命令
-   阻止对生产配置文件的写入访问
-   允许对特定目录的读取操作而无需提示
-   拒绝任何匹配危险模式的命令

### **PostToolUse**

在工具成功完成后立即触发。你的脚本会收到关于发生了什么的信息，包括工具输出，使用匹配器筛选哪些工具触发它。

这个 PostToolUse 示例对 Claude 写入或编辑的任何文件运行 Prettier。匹配器中的管道语法意味着它对 Write 和 Edit 两种工具都会触发。

```
{
  "hooks": {
    "PostToolUse": [
      {
        "matcher": "Write|Edit",
        "hooks": [
          {
            "type": "command",
            "command": "prettier --write \"$CLAUDE_TOOL_INPUT_FILE_PATH\""
          }
        ]
      }
    ]
  }
}
```

何时使用 PostToolUse：

-   每次文件写入后运行 Prettier、Black 或 gofmt，以强制执行格式化
-   将所有文件修改记录到审计轨迹
-   在代码变更后触发 linter 并显示警告
-   在特定操作完成时发送通知

### **PreCompact**

在 Claude 压缩对话上下文以释放空间之前触发。压缩会总结对话中较早的部分，这意味着一些细节会丢失。此钩子让你有机会在此之前保留信息。

这个 PreCompact 示例在自动压缩前备份对话记录。匹配器可以是 "auto" 或 "manual"，以便区分自动压缩和用户触发的压缩事件。

```
{
  "hooks": {
    "PreCompact": [
      {
        "matcher": "auto",
        "hooks": [
          {
            "type": "command",
            "command": "/path/to/backup-transcript.sh"
          }
        ]
      }
    ]
  }
}
```

何时使用 PreCompact：

-   在总结前将完整对话记录备份到文件
-   提取并保存重要决策或代码片段
-   记录会话里程碑以供后续回顾

### **SessionStart**

在 Claude Code 启动新会话或恢复现有会话时触发。你的脚本输出的任何内容都会添加到对话上下文中，因此 Claude 启动时就已经加载了这些信息。

```
{
  "hooks": {
    "SessionStart": [
      {
        "hooks": [
          {
            "type": "command",
            "command": "git status --short && echo '---' && cat TODO.md"
          }
        ]
      }
    ]
  }
}
```

每个会话开始时，Claude 都已了解你当前的 git 状态和 TODO 列表。Stdout 会自动成为上下文。

何时使用 SessionStart：

-   向 Claude 提供你当前的 git 分支和最近的提交
-   加载你的 TODO 列表或冲刺待办事项的内容
-   注入环境专属的配置细节

### **Stop**

在 Claude 完成响应、通常会等待你下一次输入时触发。你的脚本可以检查 Claude 产出了什么，并判断任务是否真正完成。

脚本可以返回带有 "continue": true 的 JSON，让 Claude 继续工作，这对多步骤工作流很有用：

```
{
  "hooks": {
    "Stop": [
      {
        "hooks": [
          {
            "type": "prompt",
            "prompt": "Review whether the task is complete. If all requirements are met, respond with 'complete'. If work remains, respond with 'continue' and specify what still needs to be done."
          }
        ]
      }
    ]
  }
}
```

何时使用 Stop：

-   强制 Claude 继续工作，直到清单中的所有事项都完成
-   在认为任务完成前验证测试是否通过
-   在会话结束时触发摘要生成
-   在停止前检查生成的代码是否能够编译

### **SubagentStop**

此钩子在通过 Task 工具创建的子智能体完成时触发。工作方式与 Stop 相同，但专门在子智能体完成其操作时触发（而非主智能体）。SubagentStop 的配置与 Stop 钩子结构相同：

```
{
  "hooks": {
    "SubagentStop": [
      {
        "hooks": [
          {
            "type": "prompt",
            "prompt": "Evaluate the subagent's output. Verify the task was completed correctly and the results meet quality standards. If the output is satisfactory, respond with 'accept'. If issues exist, respond with 'reject' and explain what needs to be fixed."
          }
        ]
      }
          ]
  }
}
```

何时使用 SubagentStop：

-   校验子智能体输出是否符合质量标准
-   基于子智能体结果触发后续操作
-   记录子智能体活动以供调试或审计

### **UserPromptSubmit**

在你提交提示词时、Claude 处理它之前触发。你的脚本通过 stdout 输出的任何内容都会连同你的提示词一起添加到 Claude 的上下文中，这使得 UserPromptSubmit 适合动态注入 Claude 应考虑的信息。

在此示例中，每次你提交提示词，Claude 都会收到你的冲刺上下文文件的内容。这让 Claude 始终了解当前优先级，无需你重新说明。

```
{
  "hooks": {
    "UserPromptSubmit": [
      {
        "hooks": [
          {
            "type": "command",
            "command": "cat ./current-sprint-context.md"
          }
        ]
      }
    ]
  }
}
```

何时使用 UserPromptSubmit：

-   在每次提交提示词时注入当前冲刺上下文或项目优先级
-   在提示词到达 Claude 之前对其进行校验
-   基于内容阻止某些类型的请求
-   添加动态上下文，如最近的错误日志或测试结果

## **配置与文件位置**

钩子存放在三个层级的 JSON 设置文件中。项目级钩子放在仓库内的 .claude/settings.json 中，可与团队共享。用户级钩子放在 ~/.claude/settings.json 中，适用于你的所有项目。本地项目钩子放在 .claude/settings.local.json 中，用于你不想提交的个人配置。

项目级设置优先于用户级设置。此外还有企业管理的策略设置，用于组织级控制。完整细节请参阅 Claude Code 设置信息。

**专业提示：** 这也是你可以为 Claude 操作设置细粒度权限的同一个文件，可在项目、用户或本地层级设置。例如，你可以明确允许 Claude 读取某个目录中的所有文件，这样就不必每次都批准，或者阻止对敏感文件的任何修改。

## **匹配器语法**

匹配器是你筛选哪些工具可以触发钩子的方式。它们仅适用于 PreToolUse、PostToolUse 和 PermissionRequest 钩子。

简单字符串匹配完全符合你的预期："Write" 只匹配 Write 工具。

例如：

```
{
  "hooks": {
    "PreToolUse": [
      {
        "matcher": "Write",
        "hooks": [
          {
            "type": "command",
            "command": "your-command-here"
          }
        ]
      }
    ]
  }
}
```

管道语法让你匹配多个工具："Write|Edit" 对两者都触发，而通配符匹配所有内容："\*" 或空字符串匹配所有工具。

**注意：** 匹配器区分大小写，因此 "bash" 不会匹配到 Bash 工具。

如需更精细的控制，参数模式如 "Bash(npm test\*)" 可以匹配特定的命令参数。MCP 工具模式遵循 "mcp\_\_memory\_\_.\*" 格式，用于 Model Context Protocol 工具。

## **输入、输出与结构化响应**

### **钩子接收什么**

所有钩子都通过 stdin 接收 JSON，其中包含会话信息和事件专属数据。常见字段包括：session\_id、transcript\_path、cwd、permission\_mode 和 hook\_event\_name。

此外，与工具相关的钩子还会接收 tool\_name 和 tool\_input。这些数据让你的脚本能够做出明智的响应决策。

### **钩子如何响应**

退出码决定基本结果。退出码 0 表示成功，stdout 要么作为 JSON 被处理，要么添加到上下文中。退出码 2 表示阻塞性错误：stderr 成为错误消息，操作被阻止。

其他退出码表示非阻塞性错误，stderr 在详细模式下显示。

除退出码外，钩子还可以返回结构化 JSON 以获得更多控制。字段包括：decision（approve、block、allow 或 deny）、reason（向 Claude 显示的解释）、continue（用于 Stop 钩子强制继续）以及 updatedInput（在执行前修改工具参数）。

## **环境与执行**

钩子可以访问环境变量，包括：CLAUDE\_PROJECT\_DIR 表示项目根路径，CLAUDE\_CODE\_REMOTE 在 Web 环境中为 true，CLAUDE\_ENV\_FILE 供 SessionStart 钩子持久化变量。你 shell 中的标准环境变量也可访问。

另外值得注意的是：钩子默认超时为 60 秒，可按钩子配置。当多个钩子匹配同一事件时，它们并行运行。相同的命令会自动去重。

## **安全注意事项**

钩子以你的用户权限执行任意 shell 命令。Claude Code 包含一项保护措施：直接编辑钩子配置文件需要在 /hooks 菜单中审查后才能生效。这防止恶意代码悄悄向你的配置中添加钩子。

但是，如果你配置并批准了钩子，它们将以你的权限级别执行。

**专业提示：** 在任何环境中运行任何命令之前，请考虑风险。如果你打算通过钩子运行命令，请考虑以下良好实践：校验并清理来自 stdin 的输入、为 shell 变量加引号以防止注入、为脚本使用绝对路径，以及避免处理 .env 或凭据等敏感文件。

## **调试与测试**

Claude Code 将所有内容记录到对话记录文件中，无需任何设置即可了解工具调用和响应。每个钩子都会收到一个 transcript\_path 字段，指向包含完整会话历史的 JSONL 文件。你可以使用 SessionStart 钩子记录每个对话记录的位置：

```
{
  "hooks": {
    "SessionStart": [
      {
        "hooks": [
          {
            "type": "command",
            "command": "jq -r '\"Session: \" + .transcript_path' >> ~/.claude/sessions.log"
          }
        ]
      }
    ]
  }
}
```

然后 tail 该对话记录，实时观察 Claude 的工作：`tail -f /path/to/transcript.jsonl | jq` 。

### **钩子专属调试**

对于钩子专属调试，请向钩子脚本添加日志。对话记录文件会显示 Claude 做了什么，但不会显示你的钩子为何采取批准或阻止操作。

只需一点额外工作，你就可以添加一个小型 bash 脚本，包装你的工具并记录额外信息。例如，log-wrapper.sh：

```
#!/bin/bash
LOG=~/.claude/hooks.log
INPUT=$(cat)

TOOL=$(echo "$INPUT" |
 jq -r '.tool_name // "n/a"')
EVENT=$(echo "$INPUT" | jq -r '.hook_event_name // "n/a"')

echo "=== $(date) | $EVENT | $TOOL ===" >> "$LOG"

echo "$INPUT" | "$1"
CODE=$?

echo "Exit: $CODE" >> "$LOG"
exit $CODE
```

这个小包装脚本将 stdin 捕获到变量中，记录时间戳和工具名，然后将输入管道传给实际工具。

写好 log-wrapper.sh 后，你可以在钩子中把它前置到工具调用之前：

```
{
  "hooks": {
    "PreToolUse": [
      {
        "matcher": "Bash",
        "hooks": [
          {
            "type": "command",
            "command": "log-wrapper.sh your-tool-command.py"
          }
        ]
      }
    ]
  }
}
```

**专业提示：** 更多调试技巧，请参阅 Claude Code 调试文档。

## **构建你自己的钩子**

从一个简单的钩子开始，解决你工作流中实际存在的摩擦点。PostToolUse 格式化钩子是个不错的首选，因为反馈即时且可见。一旦它运行正常，再根据你的经验进行扩展。

完整的参考文档（包括所有可用字段和进阶模式），请参阅官方钩子文档。

钩子让你能够塑造 Claude Code 以匹配你的工作流，而不是让你的工作流去适应工具。你在配置钩子上的投入，每个会话都会有回报。

_立即开始使用钩子定制你的 [Claude Code](https://www.claude.com/product/claude-code) 工作流。_
