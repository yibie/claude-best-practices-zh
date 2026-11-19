---
title: "云端 Claude Code：云会话实战指南"
source_url: "https://claude.dev/blog/claude-code-in-the-cloud/"
publisher: "claude.dev"
type: "blogPost"
date: "2026-10-06"
products: ["Claude Code"]
read_time: null
excerpt: "当 Claude Code 在自己的机器上运行时，会发生哪些变化，哪些工作流因此受益，以及如何一次就成功连接 GitHub。\n\n\n"
fetched_at: "2026-11-18"
---

# 云端 Claude Code：云会话实战指南

你大概是在自己笔记本电脑的终端里运行 [Claude Code](https://claude.com/product/claude-code)。那个会话在三个方面依赖这台笔记本：

-   它共享你的工作树，因此同一个仓库上的两个会话可能编辑相同的文件，并争抢同一个端口。
-   它使用你的凭据运行。
-   当你的电脑休眠或 Wi-Fi 断开时，它就会停止。

[云会话](https://code.claude.com/docs/en/claude-code-on-the-web)在一台独立的机器上运行 Claude Code。每个任务都会获得一台全新的虚拟机，你的仓库被克隆到一个新分支上，并且你的环境设置已经完成。

你可以从 [claude.ai/code](https://code.claude.com/docs/en/web-quickstart)、[Claude 移动应用](https://code.claude.com/docs/en/mobile)、[Desktop 应用](https://code.claude.com/docs/en/desktop#run-long-running-tasks-in-the-cloud)、你的[终端](https://code.claude.com/docs/en/claude-code-on-the-web#from-terminal-to-cloud)以及 [Slack](https://code.claude.com/docs/en/slack) 启动一个云会话。之后你可以在浏览器、移动应用和 Desktop 中跟进它。工作完成后，它会留在一个分支上，你可以把它变成一个拉取请求（PR）。

云会话随你的 Pro、Max、Team 或 Enterprise 套餐提供，无需额外费用：云机器不单独收费，会话与 Claude Code 的其他部分共用相同的用量限制。取决于你的套餐，组织所有者可能需要先[开启云会话](https://claude.ai/admin-settings/claude-code)。

为了撰写本指南，我在一个小型示例仓库上运行了四个真实的云会话。它们的对话记录、差异和耗时贯穿全文。截图中的仓库和用户是虚构的。工作内容、输出和数字都来自这些会话。

云会话的主要优势之一是你可以同时运行多个任务，而它们不会互相干扰。下面是我在 16 秒内启动的三个任务，每个都在自己的机器上。在我的笔记本电脑上，我得一个接一个地运行它们，或者花时间让它们互不干扰。

![三个云会话在三台虚拟机上的时间线，彼此在 16 秒内启动。经过一段斜线填充的设置条后，不稳定测试修复在 65 秒时完成，测试套件运行了 40 次、0 次失败；文档重写在 62 秒时完成，修复了 5 个文档错误；结构化日志改动在 87 秒时完成，输出 JSON 日志并新增 5 个测试。](https://claude.dev/media/58bd02532f8c5914f4dc430c84caddcb4158c4dc7b2905bcf602c9cb439ab5e2.png)

**图 A**同一仓库上三个云会话的真实时间线，以从首次启动起的秒数计。斜线填充的条是重建示例仓库的设置步骤（正常使用时由 GitHub 克隆替代），每个点是一次工具调用。

## 三个任务，一个仓库，三台机器

示例仓库是 **tidepool**，一个小型 Node API，用于预测三个虚构港口的潮汐。它有三个普通的问题：一个测试大约每四次运行失败一次，API 文档描述了代码已不再读取的参数，日志器通过拼接字符串来构建日志行。

我在 16 秒内启动了三个云会话，每个问题一个。我是以编程方式启动它们的，而且因为 tidepool 不在 GitHub 上，每个会话首先根据其提示词中的文件重建仓库。对于真实仓库，你会跳过这一步，而从终端启动时，每个会话就是一条 `claude --cloud` 命令。缩短后，三个提示词是：

```shell
claude --cloud "npm test fails maybe one run in four. Find the flaky test, fix the root cause in the code (not the test), and prove it by running the suite at least 30 times in a row."
claude --cloud "docs/API.md is out of date with src/server.js. Rewrite it so every endpoint, parameter, default and response shape matches the code. Start the server and run each curl example to check it."
claude --cloud "Make src/logger.js emit one JSON object per line, keep LOG_LEVEL, and log method, path, status and duration_ms as fields. Add a test for the logger."
```

这些会话分别运行了 61、65 和 72 秒，三个都在第一个启动后 87 秒时完成。重建仓库大约占每次运行的 三分之一 到略多于一半。以下是结果。

-   **不稳定测试。** Claude 在 `TtlCache.get` 中发现了一个竞态。缓存在加载器完成后才存储值，因此在加载期间对同一个键的第二次 `get` 会再次调用加载器。Claude 修改缓存以存储进行中的 promise，在加载失败时删除条目，并连续运行 `npm test` 40 次，零失败。
-   **文档。** Claude 启动了服务器，对每个端点运行 curl，并发现旧文档有五处错误。它列出了 API 从不返回的字段，记录了代码忽略的 `days` 参数，在高度实际以米为单位时却给出了英尺，跳过了 `/next-high` 端点，并遗漏了错误响应。它还发现格式错误的 `from=` 值会返回空列表和 200 状态码，并将其记录为注意事项，而不是修改未被要求改动的服务器代码。
-   **日志器。** Claude 编写了 JSON 日志器，将请求日志改为结构化字段，并新增了五个测试。它的提交带着一个失败的测试进去了，因此 Claude 重新运行缓存测试八次，看到其中五次失败，并将失败追溯到第一个会话正在修复的同一个竞态。它提出了相同的修复，但没有改动缓存，因为这超出了它的任务范围，并在总结中说明测试套件并不干净。

**图 E**同一本地构建的 20 秒录屏：在三个会话之间点击，然后滚动日志器会话的对话记录

日志器的结果说明了为什么云会话适合并行工作。每个会话都有自己的仓库副本、自己的进程和自己的分支。文档会话和日志器会话各自启动了 API 服务器进行测试，彼此互不影响。在单台笔记本电脑上，两个智能体在同一个检出中工作会编辑相同的文件，并且除非各自选择自己的端口，否则会在端口上冲突。

由于这种隔离，日志器会话无法访问第一个会话正在进行的缓存修复。按文件边界拆分并行任务，按合理的顺序合并分支，并预期某个会话会报告另一个会话已经在修复的问题。

## Claude Code 云会话的内部机制

云会话是在 Anthropic 管理的基础设施上运行的 Claude Code 会话，或者通过[自托管环境](https://code.claude.com/docs/en/self-hosted-environments)在你组织自己的机器上运行。下图展示了各个部分。之后的四个要点会改变你的工作方式。

![你从浏览器、手机、Desktop、终端、Slack 或 routine 启动会话。它在一台全新的虚拟机中运行，你的仓库被克隆到一个 claude 分支上，Claude Code 处于自动模式，并应用你的环境设置。GitHub 流量经过一个代理，该代理将你的 token 保存在虚拟机之外；其他流量经过一个应用网络允许列表的安全代理。结果是得到一个分支和一个拉取请求。](https://claude.dev/media/7c0f2a65796202281cbc6ededff3f0dbfe216aca98e3831640eec064e2b85165.png)

**图 F**云会话的解剖。智能体能接触的一切都在虚拟机内部。你的 GitHub token 和网络策略在虚拟机外部。

-   **每个任务都有自己的机器。** 一台全新的虚拟机，你的仓库被克隆到一个新分支上，因此会话无法触碰彼此的文件或端口。参见[已安装的工具](https://code.claude.com/docs/en/cloud-environments#installed-tools)。
-   **你的 GitHub token 从不进入虚拟机。** 一个代理持有它，会话获得一个短期凭据，只能推送到它自己的工作分支。参见 [GitHub 代理](https://code.claude.com/docs/en/cloud-environments#github-proxy)。
-   **仓库的 Claude 配置会随之而来。你的个人配置不会。** `CLAUDE.md`、规则、Skills（技能）、智能体和命令随仓库一起传输，而你的 `~/.claude` 留在你的笔记本电脑上。参见[云会话中的设置](https://code.claude.com/docs/en/settings#settings-in-cloud-sessions)。
-   **空闲虚拟机会被回收。** 重新打开会话，你会得到一台全新的虚拟机，对话已恢复，因此请提交你在意的工作。参见[环境过期](https://code.claude.com/docs/en/claude-code-on-the-web#environment-expired)。

有关规格、[权限模式](https://code.claude.com/docs/en/permission-modes)和网络级别，请参见[云环境文档](https://code.claude.com/docs/en/cloud-environments)。

## 本地还是云端？

云会话不会取代本地会话，大多数人两者都用。下表展示了它们的差异，之后的段落说明各自适合的时机。

|  | 本地会话 | 云会话 |
| --- | --- | --- |
| 运行于 | 你的机器 | 每个任务一台全新的虚拟机 |
| 笔记本休眠或离线 | 会话停止 | 会话继续运行 |
| 一个仓库上的多个任务 | 需要分开的 worktree、端口和小心处理 | 每个任务一台虚拟机和一条分支 |
| 智能体能访问什么 | 你的用户账户能访问的一切，包括 SSH 密钥、云 CLI 和 `~/.claude` | 仓库、你设置的网络级别、你启用的 Connectors，以及会话范围的 GitHub 凭据 |
| 从哪里启动或跟进 | 那台机器，或通过远程控制从手机 | 浏览器、手机、Desktop、终端、Slack、API 调用或定时计划 |
| 审批 | 任何模式，包括逐命令审批 | 自动、接受编辑或计划 |
| 以什么结束 | 你的工作树中的更改 | 一条分支，以及你想要的拉取请求 |
| 计算 | 你的机器 | 不单独收取计算费用；使用你套餐的限制 |

当任务需要只有你机器才有的东西时，留在本地。这包括带有真实本地数据的数据库、通过 VPN 访问的服务、GPU、手机模拟器，或你桌上的硬件。对于紧凑的视觉循环，你希望几秒内在自己的浏览器中看到每个更改，也留在本地；当你的组织使用[零数据留存（ZDR）](https://code.claude.com/docs/en/zero-data-retention)时同样如此，该设置会关闭云会话。

有两个功能介于两者之间。**远程控制**将会话保留在你的机器上，并让你从手机或浏览器操控它。**[自托管环境](https://code.claude.com/docs/en/self-hosted-environments)**（Team 和 Enterprise 的 beta 版）在你组织自己的基础设施上运行云会话，因此它们可以访问私有网络。

如果以上都不适用，该任务就是云端的良好候选。下一节介绍最能从中受益的工作流。

## 适合云会话的七种工作流

这些工作流利用了表中的差异：每个任务一台独立的机器、你离开时仍在运行的会话，以及结束时供你审查的分支。

### 1\. 并行清理积压

假设你有五个小的、不相关的修复。在本地，你会一个接一个地做，或者设置五个 worktree 并让它们的端口和安装互不干扰。在云端，你会启动五个会话并审查五个分支。

```shell
claude --cloud "Fix the flaky test in auth.spec.ts"
claude --cloud "Update the API documentation"
claude --cloud "Refactor the logger to use structured output"
```

`claude --cloud` 会在你当前分支克隆你的 GitHub 远程仓库，因此请先推送你的本地提交。在虚拟机启动期间，CLI 会显示设置步骤的实时清单，并排队你输入的任何内容。

把每个任务写成一个自包含的工单，说明哪里有问题、完成是什么样子，以及如何证明。不稳定测试的提示词指明了它的证明：连续运行测试套件至少 30 次。会话运行了 40 次。

当任务属于一个更大的工作时，一个**[项目](https://claude.com/blog/projects-redesigned)**（Pro 和 Max 的公开 beta）会运行一个协调者对话，为你启动和跟踪云会话。然后它按状态对它们分组：工作中、等待你、准备审查。

### 2\. 让它证明修复

不稳定测试是需要反复证明的工作的最清晰案例：你必须一遍又一遍地运行测试套件，而你不希望这个循环占用你正在工作的机器。在云端，Claude 修补了缓存，并在一条命令中运行了整个测试套件 40 次。

![不稳定测试会话的 Bash 步骤：对 src/cache.js 的补丁，缓存进行中的 promise，然后一个循环运行测试套件 40 次，输出 runs=40 fails=0。](https://claude.dev/media/6ce551ccd1a1cd64a0f9c0fb8b8116e1ca1e260a9f5de861de798e0fe578afe6.png)

**图 G**四十次运行，零失败：不稳定测试会话的真实命令和输出，在本地运行的 claude.ai/code 界面中重放。Claude 修补了 src/cache.js，并在一个步骤中循环运行完整测试套件 40 次。路径显示在 /home/user 下。

虚拟机不收取计算费用，其 CPU 也不是你的，因此要求彻底的证明。运行测试套件 200 次，在 50 个提交中二分查找回归，运行缓慢的集成测试层，或者像文档会话那样启动应用并用 curl 访问它。

Claude 的每一轮仍然计入你的套餐，但一条命令中的长时间测试运行成本很低。[前台命令](https://code.claude.com/docs/en/cloud-environments)默认在 2 分钟后超时（最多 10 分钟），然后继续在后台运行最多 30 分钟。你可以在环境的变量中通过 `BASH_DEFAULT_TIMEOUT_MS` 和 `BASH_MAX_TIMEOUT_MS` 提高默认值。

### 3\. 在办公桌前规划，在云端构建，在终端中收尾

对于较大的更改，先在来回沟通成本低的地方就方案达成一致。以计划模式启动 Claude，一起制定计划，提交计划并推送。

```shell
claude --permission-mode plan
```
```shell
# ...agree on the plan, save it to docs/migration-plan.md, commit and push...
claude --cloud "Execute the migration plan in docs/migration-plan.md"
```

当云会话构建时，你的终端可以自由处理其他工作。完成后，将会话拉下来手动完成。

```shell
claude --teleport            # pick a cloud session
claude --teleport <session-id>
```

Teleport 会检查你在同一个仓库中，获取会话的分支，检出它，并将整个对话加载到你的终端。你需要一个干净的工作树（它会提供暂存选项），并且分支必须已推送。在 Claude Code 内部，`/teleport`（或 `/tp`）打开相同的选择器，`/tasks` 然后 `t` 也可以。Desktop 应用则相反，其 **Open in** 菜单将本地会话发送到云端。

### 4\. 从手机查看进度

Claude 应用中的 Code 标签页连接到相同的会话。从手机上，你可以启动任务、跟进、操控它、回答 Claude 提出的问题，或告诉 Claude 关注一个拉取请求。

手机适合那些等你到键盘前就会忘记的问题。我给第四个会话提了一个你会在手机上输入的问题：tidepool 如何预测潮汐，它在时间窗口的边缘可能如何出错？它运行代码来检查答案，并发现了一个真实的 bug。循环从不检查第一个或最后一个样本，因此 API 会漏掉恰好落在窗口开始处的高潮。

### 5\. 将 CI 失败和审查评论交给 Claude

在仓库上安装 Claude GitHub App 后，云会话可以关注一个拉取请求并对其发生的情况采取行动。在 claude.ai/code 会话的 CI 栏中，开启 **Auto-fix**。你也可以在终端中于 PR 分支上运行 `/autofix-pr`，让移动应用关注该 PR，或将 PR URL 粘贴到会话中。

Claude 会为失败的检查和审查评论推送清晰的修复，并解释它改了什么。对于任何模糊或架构性的问题，它会询问你。审查线程上的回复以你的 GitHub 用户名发布，并标注为 Claude Code。Claude 不会收到与基础分支合并冲突的通知，因此请让它 rebase。它的评论也可能触发评论驱动的自动化，例如 Atlantis。

### 6\. 无需自己启动就开始工作

**routine**（研究预览）是若干保存的资源，旨在完成一个任务，例如提示词、仓库、Connectors 和环境。每次运行都是一个云会话，由触发器启动。触发器可以是定时计划（最频繁为每小时）、对 routine 自身端点的 HTTP 调用，或 GitHub 事件，例如拉取请求打开或发布。你可以在 claude.ai/code/routines、Desktop 应用中，或通过 CLI 中的 `/schedule` 创建一个。Routine 运行时不出现审批提示，默认推送到以 `claude/` 为前缀的分支。

有两个较小的工具在这里有帮助。你可以从任何已登录的机器（包括 CI 作业）向正在运行的会话排队一个后续消息。

```shell
claude -p "The integration tier is green now; rebase on main and push" --cloud <session-id>
```

你也可以为预填的会话添加书签。像 `claude.ai/code?prompt=Triage+the+newest+issues&repositories=acme-labs/tidepool` 这样的 URL 会打开 claude.ai/code，提示词和仓库已经填好。

### 7\. 运行你并不完全信任的代码

贡献者的拉取请求、新依赖的安装脚本，或你五分钟前克隆的仓库，都可能运行你尚未阅读的代码。在你的笔记本电脑上，这些代码在你的 SSH 密钥、云 CLI 会话和浏览器配置文件旁边运行。在云会话中，它在一台一次性虚拟机中运行，没有这些东西，只有会话范围的 GitHub 凭据，以及你可以收窄的网络。

将环境的网络访问设置为 **None** 以获得最严格的运行，或保持 **Trusted**，它允许包注册表、GitHub 和主要云 SDK 主机。即使在 None 下，Claude Code 仍会向 Anthropic API 发送请求，因此数据可以以这种方式离开虚拟机，会话仍然可以推送到自己的分支。所有出站流量都经过一个记录主机名的代理。

## 连接 GitHub 而不卡住

如果你的第一个云会话出了问题，GitHub 是最可能的原因。大多数问题来自云会话需要两个独立的 GitHub 权限。

-   **使用 GitHub 登录**告诉 Claude 你是谁。
-   **在账户或组织上安装 Claude GitHub App** 设定 Claude 在那里能看到哪些私有仓库。

公共仓库只需第一个。私有仓库需要第二个，在拥有它们的账户或组织上。如果你连接了 GitHub 但缺少一个私有仓库，通常是因为 App 没有安装在拥有它的账户或组织上。

| 你连接了什么 | 公共仓库 | 你的私有仓库 | 组织的私有仓库 | Auto-fix、GitHub 触发器、项目 |
| --- | --- | --- | --- | --- |
| 仅使用 GitHub 登录 | 是 | 否 | 否 | 否 |
| \+ 在你的个人账户上安装 App | 是 | 是 | 否 | 你的仓库 |
| \+ 在组织上安装 App（所有者批准） | 是 | 仅当也在你的账户上时 | 是 | 组织仓库 |
| `/web-setup`（你的 `gh` token） | 是 | 是 | 你的 token 能访问的任何仓库 | 否，需要 App |

### 路径 A：在浏览器中连接（推荐）

在 [claude.ai/connect-github](https://claude.ai/connect-github) 连接你的 GitHub 账户，然后在拥有你仓库的账户或组织上安装 Claude GitHub App。对于组织，通常需要所有者批准安装。[快速入门](https://code.claude.com/docs/en/web-quickstart)逐步介绍了每个步骤。

如果 GitHub 没有把你送回 claude.ai/code，[claude.ai/connect-github](https://claude.ai/connect-github) 的连接页面可以显示常见原因的简短清单。其中之一是单点登录步骤，如果你跳过它，组织的仓库会被隐藏。

![“Didn't finish connecting”屏幕，有五条提示：登录正确的 GitHub 账户，在单点登录步骤中授权每个组织，如果你看到 GitHub connection not completed 就重新开始，先连接你自己的账户并让所有者稍后批准组织访问，或从终端运行 /web-setup。](https://claude.dev/media/0855b55ac62191f9b92cd9f5f1d5ab2d8181b03eb155678dd859cc7c8f8722ed.png)

**图 L**如果 GitHub 没有把你送回来：产品自带的清单，用于中断的 GitHub 连接，来自本地运行的 claude.ai/code 界面中的快速设置上手流程

Auto-fix、GitHub 触发的 routine 和项目也依赖 App，因此即使你以其他方式连接，也要安装它。

### 路径 B：从终端使用 /web-setup 连接

如果你已经在使用 `gh` CLI，在 Claude Code 内运行 `/web-setup`，将你的 `gh` token 发送到你的 Claude 账户。会话随后可以访问该 token 能访问的任何仓库，无论是否安装 App。参见[从终端连接](https://code.claude.com/docs/en/web-quickstart#connect-from-your-terminal)了解操作步骤。在 Team 和 Enterprise 套餐上，所有者必须先开启[快速设置](https://code.claude.com/docs/en/claude-code-on-the-web#quick-setup-for-team-and-enterprise)。

### 路径 C：为一次性任务跳过 GitHub

在没有 GitHub 远程的仓库中，或未安装 App 的仓库中运行 `claude --cloud`，Claude Code 会上传你的仓库捆绑包而不是克隆它。只有当你的 GitHub 连接对该仓库有推送权限时，会话才能推送回去。文档列出了[捆绑包包含和不包含的内容](https://code.claude.com/docs/en/claude-code-on-the-web#send-local-repositories-without-github)。

### 如果你运行 Team 或 Enterprise

所有者有一份简短的清单：在 [claude.ai/admin-settings/connectors](https://claude.ai/admin-settings/connectors) 开启 GitHub Connector，在 [Claude Code 管理员设置](https://claude.ai/admin-settings/claude-code) 中允许云会话，在组织的仓库上安装 Claude GitHub App（或批准成员的请求），并决定是否开启[快速设置](https://code.claude.com/docs/en/claude-code-on-the-web#quick-setup-for-team-and-enterprise)。有 IP 允许列表或 GitHub Enterprise Server 的组织有额外步骤。参见关于 [IP 允许列表](https://code.claude.com/docs/en/claude-code-on-the-web#limitations)和 [GitHub Enterprise Server](https://code.claude.com/docs/en/github-enterprise-server)的文档。

### 如果仍然不工作

| 你看到什么 | 原因 | 修复 |
| --- | --- | --- |
| 选择器中缺少一个私有仓库 | App 没有安装在拥有它的账户或组织上，或其仓库访问权限排除了它 | 在那里安装 App，或在你的 GitHub 设置中将该仓库添加到 App 的 Repository access |
| 错误提示你必须是组织所有者才能链接它 | 组织阻止了成员资格检查，通常是因为待处理的 App 权限请求、IP 允许列表或 SAML 单点登录 | 所有者在组织的 GitHub App 设置中接受待处理的权限请求，为已安装的 GitHub App 开启 IP 允许列表继承，或（在 SAML 下）授予 Claude 访问组织的权限 |
| 连接后立即缺少组织的仓库 | 组织使用 SAML 单点登录，且其授权步骤被跳过 | 在 GitHub 的“Single sign-on to your organizations”步骤中，继续之前点击每个组织旁边的 **Authorize**。如果你已经跳过，在你的 GitHub 设置中为该组织授权 Claude，然后重新连接 |
| 每个云会话都因身份验证错误失败 | 你的 Claude 组织使用 IP 允许列表 | 请支持团队豁免 Anthropic 托管服务 |

对于其他任何情况，请参见文档中的[故障排除](https://code.claude.com/docs/en/claude-code-on-the-web#troubleshooting)，包括[连接 GitHub 后没有出现仓库](https://code.claude.com/docs/en/web-quickstart#no-repositories-appear-after-connecting-github)。要完全断开 GitHub，请使用 claude.ai/customize/connectors。

## 给会话提供检查自己工作所需的条件

一个能运行你的测试的会话会在交回工作之前检查自己的工作。否则，你审查的是没人运行过的更改。本指南演示中的大部分价值来自 Claude 运行东西：测试套件 40 次、服务器及其 curl、窗口边缘的潮汐计算。十分钟的环境设置给 Claude 提供运行这些检查的方法。

![Add cloud environment 对话框，名称为 tidepool，Trusted 网络访问，LOG\_LEVEL=debug，以及一个用 apt-get 安装 shellcheck 的设置脚本。](https://claude.dev/media/aba93ba97b08d40ee9705338d22e861ed592cc8a7e32b8ddd715b6545b3c4fcd.png)

**图 M**在 claude.ai/code 界面中添加云环境，本地运行并使用示例值：名称、网络访问级别、.env 格式的变量，以及设置脚本

-   **从 Default 环境开始。** 它使用 Trusted 网络访问，没有变量和设置脚本，这对大多数 JavaScript、Python、Go 和 Rust 仓库已经足够。
-   **为机器使用设置脚本。** 它以 root 身份在 Claude Code 启动前运行，因此 `apt install` 可以工作。它必须以 0 退出，否则会话不会启动，并且应在约五分钟内完成，以便环境被缓存。之后，新会话从磁盘上带有你的工具的快照启动。当你更改脚本或允许的主机时，缓存会重建，大约每七天一次。
-   **为项目使用 [SessionStart 钩子（hooks）](https://claude.com/resources/articles/how-to-configure-hooks)。** 将 `npm install` 和类似步骤放在仓库 `.claude/settings.json` 中的钩子里，这样它们在本地和云端的运行方式相同。如果某个步骤只应在云端运行，请检查 `CLAUDE_CODE_REMOTE`。仓库钩子在单仓库会话中加载。
-   **按会话启动服务。** 缓存存储文件。之前运行的进程不会在缓存中存活。让 Claude 运行 `service postgresql start`，或在 SessionStart 钩子中执行。
-   **选择能工作的最窄网络级别。** Trusted 覆盖常见注册表。使用 Custom 添加私有注册表，仅在任务需要开放互联网时使用 Full。更改会在约一分钟内到达正在运行的会话。
-   **将机密排除在共享变量之外。** 环境变量对使用该环境的任何人可见。在 Pro 和 Max 上，环境的 API 凭据会为指定主机的请求附加一个密钥，在虚拟机外部，因此密钥从不放在变量中。
-   **将命令放在 CLAUDE.md 中。** 你的个人 `~/.claude` 不会到达云虚拟机。如果 Claude 需要知道如何运行集成测试，仓库必须说明。

## 值得养成的习惯

-   **一个任务，一个会话。** 小而独立的会话更容易审查，丢弃成本也更低。
-   **要求证据。** 指明证明任务完成的命令，并在查看差异之前阅读 Claude 的总结。
-   **在 `claude --cloud` 之前推送。** 虚拟机从 GitHub 克隆，因此未推送的提交不会到达它。
-   **在长任务中随时提交。** 空闲虚拟机会被回收。
-   **在差异视图中审查。** 内联评论会批量进入你的下一条消息，**Create PR** 可以打开完整 PR、草稿或 GitHub 的撰写页面。
-   **在 Claude 工作时操控。** 你在 Claude 工作时发送的消息会排队，你可以撤回排队的消息。
-   **共享会话。** 在 Team 和 Enterprise 上，将会话的可见性设置为 Team，以便审查者可以阅读更改是如何做出的。来自云会话的提交带有一个 `Claude-Session` trailer，链接回对话记录。
-   **注意你的限制。** 并行会话会并行消耗你的套餐限制，因此五个会话的使用速度大约是一个的五倍。Routine 有自己的每小时上限，[项目](https://code.claude.com/docs/en/claude-projects)每天最多可以启动 200 个新线程。

## 常见问题

**谁可以使用云会话？** Pro、Max 和 Team 套餐，以及拥有高级席位或 Chat + Claude Code 席位、使用 claude.ai 账户登录的 Enterprise 用户。它们不适用于 Console API 密钥或第三方提供商。参见[云会话文档](https://code.claude.com/docs/en/claude-code-on-the-web)。

**我的数据去哪里？** Anthropic 存储会话对话记录，保留时间取决于你的套餐和模型改进设置。虚拟机在空闲后被回收，删除会话会删除其数据。参见[数据使用](https://code.claude.com/docs/en/data-usage)和[安全](https://code.claude.com/docs/en/security)。

**Claude 会用我的云会话数据训练吗？** 云会话遵循与 Claude Code 其他部分相同的政策。在 Team、Enterprise 和 API 上，除非你的组织选择加入，Anthropic 不会用你的代码或提示词训练模型。在 Free、Pro 和 Max 上，这取决于你的[模型改进设置](https://claude.ai/settings/data-privacy-controls)。参见[数据使用](https://code.claude.com/docs/en/data-usage)。

**它能处理我的大型仓库吗？** 虚拟机大约有 4 个 vCPU、16 GB 内存和 30 GB 磁盘。将繁重的安装放在[设置脚本](https://code.claude.com/docs/en/cloud-environments#setup-scripts)中，以便它们运行一次并进入缓存的快照。

**GitLab 或 Bitbucket 呢？** `claude --cloud` 可以从任何 git 仓库上传捆绑包，但会话无法推送回这些主机。Team 和 Enterprise 支持 [GitHub Enterprise Server](https://code.claude.com/docs/en/github-enterprise-server)。参见[平台限制](https://code.claude.com/docs/en/claude-code-on-the-web#limitations)。

**并行分支冲突时会发生什么？** 会话彼此不知道。合并一个分支，然后[向下一个会话发送后续消息](https://code.claude.com/docs/en/claude-code-on-the-web#send-follow-ups-from-the-cli)，例如 `claude -p "rebase on main and fix any conflicts" --cloud <session-id>`。

**我会失去本地工具吗？** 用户级配置不会传输，因此将团队需要的内容移入仓库：在 `.claude/` 下提交 Skills 和命令，将项目级 MCP 服务器添加到 `.mcp.json`，并在 `CLAUDE.md` 中记录测试命令。[云会话中的设置](https://code.claude.com/docs/en/settings#settings-in-cloud-sessions)列出了每个会话读取的内容。

## 五分钟开始

设置大约需要五分钟。之后，你可以交出一个任务，合上笔记本电脑，回来时得到一个准备好审查的分支。

1.  打开 claude.ai/code，或在 Claude Code 中使用你的 claude.ai 账户运行 `/login`。
2.  连接 GitHub，并在你的仓库所在处安装 Claude GitHub App。
3.  选择仓库和 Default 环境。
4.  从你的积压中给 Claude 一个任务，并附上证明它完成的命令。
5.  关闭标签页。稍后从手机查看进度，然后在 claude.ai/code 审查差异并创建拉取请求。
