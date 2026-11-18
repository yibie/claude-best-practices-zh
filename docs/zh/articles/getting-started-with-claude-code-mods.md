---
title: "Claude Code mods 入门"
source_url: "https://claude.dev/blog/getting-started-with-claude-code-mods/"
publisher: "claude.dev"
type: "blogPost"
date: "2026-10-01"
products: ["Claude Code"]
read_time: null
excerpt: ""
fetched_at: "2026-11-18"
---

# Claude Code mods 入门
mod 是一个小型 JavaScript 或 TypeScript 文件，运行在你的 [Claude Code](https://claude.com/product/claude-code) 会话中。它可以观察正在发生的事、改变 Claude Code 的行为，或者在终端或桌面应用中绘制自己的 UI。你不需要先学 API 就能试一个。运行 `claude`，然后描述你想要的 mod。当它询问时允许热重载，这一轮结束时 mod 就会出现。

Claude Code 已经允许你改变它的很多行为：设置、权限规则、斜杠命令、Skills（技能）和状态栏。mod 走得更远：它们可以重写或替换 Claude Code 的行为，并绘制自定义 UI。在底层，mod 是随插件一起分发的钩子（hooks），每一个都能实时看到你会话中的每个事件。

这让 mod 成为一种让 Claude Code 贴合你工作方式的手段。你可以加一个你时常查看的读数，在让你紧张的命​​令前放一道护栏，或者为你喜欢的阅读方式构建一个审查视图。

本指南从空文件夹开始构建一个 mod，**Token Weather**，一个绘制在提示词上方的上下文窗口实时预报。它大约 80 行。然后会介绍两个更大的 mod，**Blast Radius** 和 **Replay Theater**，展示 API 还能做什么。三个 mod 的完整代码都在 [anthropics/claude-code-playground](https://github.com/anthropics/claude-code-playground/tree/main/claude-code/mods)。

**图 A**Token Weather、Blast Radius 和 Replay Theater，在终端会话中依次出现

![一行终端色带循环显示三种预报：Clear 为黄色太阳，Showers 为蓝色雨伞，Storm 为粉色闪电，每个都带有 200k 中的 token 计数以及最近几轮的小柱状图。](https://claude.dev/media/eaee11951bbed827ef89ee535abfbbed7277b67a65044ea277ade9e9acd1d3b5.png)

**图 B**上下文窗口逐渐填满时 Token Weather 的色带：18% 时为 Clear，67% 时为 Showers，81% 时为 Storm

**需要 Claude Code 2.1.287 或更高版本。** mod 默认开启，无需打开任何开关。API 可能在不同版本之间变化。每次 Claude Code 加载 mod 时，它都会把适用于你的构建的类型声明写入该 mod 的 `.claude-plugin/types/` 文件夹，这些声明就是你所用版本的权威依据。

## MOD 如何工作

mod 是一个 Claude Code 插件，其行为位于一个 JavaScript 或 TypeScript 模块中：

-   该文件夹是一个普通插件，带有 `.claude-plugin/plugin.json` 清单。
-   `hooks/hooks.json` 在 `modules` 下指定一个模块。
-   该模块导出 `register(on, options)`。在其中，`on(event, matcher?, hook)` 添加一个钩子。

每个钩子的形状都相同：

CODEJavaScript

on("tool.call", { tool: "Bash" }, async ($, e, next) => {
  // $    the mods API: ui, session, state, store, fs, process, clock, http, tool, command, model, ...
  // e    this event's input, as plain data
  // next passes e to the other plugins and then to Claude Code's own behavior
  return next(e);
});

钩子形成一条链，就像中间件。你的钩子运行，`next(e)` 把事件交给下一个插件，在最底层 Claude Code 做它本来就会做的事。一个钩子可以做三件事之一：

钩子形成一条链

一个事件经过你的钩子，然后经过其他插件，最后到达 Claude Code

| 动作 | 方式 | 示例 |
| --- | --- | --- |
| **观察** | `const r = await next(e); /* look */ return r` | 记录每次文件编辑。每轮之后取一次读数。 |
| **重写** | `return next({ ...e, command: safer })` | 改变链中其余部分看到的内容。 |
| **应答** | 不调用 `next`，直接 `return { deny: "…" }` | 拒绝一次工具调用。自己提供某个命令或工具。 |

事件覆盖工具调用、提交时的提示词、轮次的开始和结束、会话的开始和结束、斜杠命令，以及 `ui.render`：界面绘制时的每一个片段。该模块在自己的沙箱中运行，没有 DOM，也没有 Node，因此它之外的一切都要通过 `$` 访问。

**这与设置钩子有何不同。**[设置钩子](https://claude.com/resources/articles/how-to-configure-hooks)会为每个事件运行一个 shell 命令，并通过 stdin 和 stdout 传递 JSON。mod 只加载一次，并留在会话中。它可以保持状态、绘制随事件更新的 UI，并回调 Claude Code：打开一个窗格、运行一个进程、注册一个斜杠命令，或注册一个模型可以调用的工具。

**Claude Code 自己也在用它们。**Claude Code 的一些自身功能就是以 mod 形式构建的，包括 AGENTS.md 支持和对话旁的 `/diff` 窗格。它们的源码及测试位于公开的 [anthropics/claude-code](https://github.com/anthropics/claude-code) 仓库的 `mods/` 目录下，因此你可以阅读团队是如何构建它们的。

## 构建你的第一个 MOD：TOKEN WEATHER

Token Weather 在每轮之后读取上下文窗口的填充程度，并在提示词上方绘制一行：一个天气图标、百分比、窗口已用的 token 数、最近几轮的小图表，以及上一轮增加了多少。

| 已用 | 预报 |
| --- | --- |
| 低于 25% | ☀ Clear |
| 25–49% | ☁ Cloudy |
| 50–74% | ☂ Showers |
| 75–89% | ☇ Storm |
| 90% 及以上 | ↯ Compact soon |

下面是它在真实会话中的样子。每一轮读取更多文件，色带从 ☀ Clear 变为 ☂ Showers 再变为 ☇ Storm：

**图 C**Token Weather 在三轮完整终端会话中的表现：200k 窗口的 18%，然后 67%，然后 81%

### 捷径：让 Claude 来构建

你可以跳过这六个步骤。Claude Code 知道如何编写 mod，所以你可以描述你想要的 mod，让它来完成工作。用 `claude` 启动一个会话，粘贴下面的提示词：

CODEText

Make me a Claude Code mod called token-weather: a live forecast of my context window, shown in the band above the prompt.

What it should show, on one line:
- A weather icon and word for how full the context window is: under 25% ☀ Clear (yellow), 25–49% ☁ Cloudy (cyan), 50–74% ☂ Showers (blue), 75–89% ☇ Storm (magenta), 90% and up ↯ Compact soon (red).
- The percentage used, then the tokens used out of the window, like "134.4k / 200k".
- A small chart of the last 12 turns, drawn with ▁▂▃▄▅▆▇█.
- How much the last turn added, like "▲ +98.3k last turn".

It should update after every turn.

Claude 会询问一次是否为该会话开启热重载。允许它，当 Claude 的轮次结束时，色带就会出现在提示词上方。从那时起，每次更改都会就地重新加载，所以你可以继续要求调整（"让 Storm 从 70% 开始"、"在末尾加上美元成本"），并观察色带变化。该 mod 只在这个会话中加载，它的文件夹之后会被清理，所以要保留它，请把文件夹复制出来，像任何插件一样安装（[第 6 步](#step-6-share-it)）。

注意，提示词只描述了你想要看到的内容。你不需要了解 API 就能写一个。Claude Code 内置的 mod 编写指南涵盖了具体做法：在哪里保存状态以便在重载后存活、如何用 `claude plugin validate` 检查插件，以及要钩住哪些事件。改一改"它应该显示什么"那几行，它就是你的 mod，而不是我们的。

如果你更想先看看它是怎么组装的，或者想检查 Claude 写了什么，请继续阅读。

### 第 1 步：创建文件夹

检查你的 Claude Code 版本是否足够新：

CODEShell

claude --version   \# 2.1.287 or later

创建这个目录结构：

CODEText

token-weather/
├── .claude-plugin/
│   ├── plugin.json
│   └── types/            (written by Claude Code when it loads the mod)
├── hooks/
│   ├── hooks.json
│   └── token-weather.mjs
├── types/
│   └── index.d.ts        (added in step 3)
└── tests/
    └── token-weather.test.ts   (added in step 5)

`.claude-plugin/plugin.json` 是一个标准的插件清单：

CODEJSON

{
  "name": "token-weather",
  "version": "0.1.0",
  "description": "A live forecast of the context window, drawn above the prompt.",
  "author": { "name": "You" }
}

`hooks/hooks.json` 指向该模块。一个 mod 恰好有一个：

CODEJSON

{
  "modules": \["./token-weather.mjs"\]
}

### 第 2 步：绘制一些东西

提示词正上方的色带是一个名为 `AbovePrompt` 的组件。Claude Code 自己不在那里绘制任何东西，所以它是一个很好的第一个目标。钩住它的 `ui.render` 事件并返回一个元素树：

CODEJavaScript

// hooks/token-weather.mjs
export function register(on) {
  on("ui.render", { component: "AbovePrompt" }, ($, e, next) => {
    const { Box, Text } = $.ui.resolve(e);
    return Box({
      paddingX: 1,
      children: \[Text({ color: "yellow", bold: true, children: "☀  Clear skies" })\],
    });
  });
}

这些元素不是全局的。`$.ui.resolve(e)` 返回正在绘制的界面的构造函数，因为 Claude Code 绘制的每个界面支持的集合略有不同。JSX 也可以使用，以 `h` 作为工厂函数。

加载插件启动一个会话：

CODEShell

claude --plugin-dir ./token-weather

"☀ Clear skies" 出现在提示词上方。保持会话打开。该文件夹被监视，所以每次保存都会就地重新加载模块，无需重启。这个快速反馈循环正是编写 mod 的大部分乐趣所在。

**提示：**一旦你了解了形状，就像[捷径](#the-shortcut-let-claude-build-it)那样向 Claude 描述下一个 mod。它会把插件写入一个在同一会话中热重载的文件夹。

### 第 3 步：读取真实数字并保存在 `$.state` 中

`$.session.usage()` 返回与状态栏相同的数字。`context.tokens` 是上一次响应所依据的输入，`context.window` 是模型的窗口，`context.percent` 是前者除以后者。该调用是免费的：只有当你请求 `breakdown` 时，它才会发送 token 计数请求。

在会话开始时以及每轮之后取一次读数：

CODEJavaScript

on("session.start", async ($, e, next) => {
  const result = await next(e);
  await takeReading($);
  return result;
});

on("turn.complete", async ($, e, next) => {
  const result = await next(e);
  if (!e.agentId) {
    await takeReading($); // main-loop turns only, not subagents
  }
  return result;
});

两个钩子都先调用 `next(e)`，然后观察。两者都不改变发生的事。

**读数保存在哪里。**模块级的 `let readings = []` 看起来是显而易见的选择，但热重载是一次全新的加载：`register` 再次运行，`session.start` 再次触发，模块变量从头开始。把历史记录放在 `$.state` 中。它在整个会话期间在宿主中保存命名值，并且能在重载后存活。

CODEJavaScript

// Held by the host, so the history survives a hot reload of this file.
const readings = { plugin: "token-weather", key: "readings" };

async function takeReading($) {
  const { context } = await $.session.usage();
  if (!context?.window) return;
  const tokens = context.tokens ?? 0;
  const percent = context.percent ?? Math.round((tokens / context.window) \* 100);
  const { value: history = \[\] } = await $.state.get(readings);
  await $.state.set(readings, \[...history, { tokens, window: context.window, percent }\].slice(-HISTORY));
}

状态值在插件的**类型契约**中声明，这是一个清单指向的小型 `.d.ts` 文件。添加 `types/index.d.ts`：

CODETypeScript

export type TokenWeatherReading = { tokens: number; window: number; percent: number };

declare module "claude-code" {
  interface PluginState {
    "token-weather": { readings: TokenWeatherReading\[\] };
  }
}

然后在 `plugin.json` 中添加 `"types": "./types/index.d.ts"`。如果你跳过这一步，`claude plugin validate` 会用一个指明修复方法的错误阻止你：`token-weather.readings is not declared: the manifest's types contract must name it in interface PluginState { … }`。

作为回报，你免费获得重绘。在渲染钩子运行时进行的 `$.state.get` 会订阅该绘制，因此之后每次 `$.state.set` 都会重绘色带。你永远不需要调用 `$.ui.invalidate`。

### 第 4 步：绘制预报

这是完整的模块：

CODEJavaScript

// Token Weather: a live forecast of the context window, above the prompt.

const HISTORY = 12;
const BARS = "▁▂▃▄▅▆▇█";
const FORECAST = \[
  { upTo: 25, icon: "☀", word: "Clear", color: "yellow" },
  { upTo: 50, icon: "☁", word: "Cloudy", color: "cyan" },
  { upTo: 75, icon: "☂", word: "Showers", color: "blue" },
  { upTo: 90, icon: "☇", word: "Storm", color: "magenta" },
  { upTo: Infinity, icon: "↯", word: "Compact soon", color: "red" },
\];

// Held by the host, so the history survives a hot reload of this file.
const readings = { plugin: "token-weather", key: "readings" };

export function register(on) {
  on("session.start", async ($, e, next) => {
    const result = await next(e);
    await takeReading($);
    return result;
  });

  on("turn.complete", async ($, e, next) => {
    const result = await next(e);
    if (!e.agentId) {
      await takeReading($); // main-loop turns only, not subagents
    }
    return result;
  });

  on("ui.render", { component: "AbovePrompt" }, async ($, e, next) => {
    const { value: history = \[\] } = await $.state.get(readings);
    if (e.props.hasSurvey || history.length === 0) {
      return next(e);
    }
    const { Box, Text } = $.ui.resolve(e);
    return band(Box, Text, history, e.props.bodyColumns);
  });
}

async function takeReading($) {
  const { context } = await $.session.usage();
  if (!context?.window) return;
  const tokens = context.tokens ?? 0;
  const percent = context.percent ?? Math.round((tokens / context.window) \* 100);
  const { value: history = \[\] } = await $.state.get(readings);
  await $.state.set(readings, \[...history, { tokens, window: context.window, percent }\].slice(-HISTORY));
}

function band(Box, Text, history, columns) {
  const now = history\[history.length - 1\];
  const f = FORECAST.find((b) => now.percent < b.upTo);
  const parts = \[
    Text({ color: f.color, bold: true, children: \`${f.icon}  ${f.word}\` }),
    Text({ children: \`  ${now.percent}% of context\` }),
    Text({ dimColor: true, children: \`  ${short(now.tokens)} / ${short(now.window)}\` }),
  \];
  if (columns >= 60) {
    parts.push(Text({ dimColor: true, children: "   last turns " }));
    parts.push(Text({ color: f.color, children: sparkline(history) }));
    if (history.length > 1) {
      parts.push(Text({ dimColor: true, children: trend(history) }));
    }
  }
  return Box({ flexDirection: "row", paddingX: 1, children: parts });
}

function sparkline(history) {
  const top = Math.max(...history.map((r) => r.tokens), 1);
  return history.map((r) => BARS\[Math.floor((r.tokens / top) \* (BARS.length - 1))\]).join("");
}

function trend(history) {
  const delta = history\[history.length - 1\].tokens - history\[history.length - 2\].tokens;
  if (delta === 0) return "  steady";
  return delta > 0 ? \`  ▲ +${short(delta)} last turn\` : \`  ▼ ${short(-delta)} last turn\`;
}

function short(n) {
  if (n >= 1\_000\_000) return \`${+(n / 1\_000\_000).toFixed(1)}M\`;
  if (n >= 1\_000) return \`${+(n / 1\_000).toFixed(1)}k\`;
  return String(n);
}

有三个细节值得复制到你自己的 mod 中：

-   **组件的 props 在 `e.props` 上。**`hasSurvey` 告诉你某个调查想要这个色带，所以钩子用 `next(e)` 让位给它。`bodyColumns` 是色带的真实宽度，当窗格停靠在对话记录旁边时，它比终端窄。按它来调整树的大小。只有 `e.component`、`e.surface`、`e.requestId` 和 `e.viewport` 位于 `e` 的顶层。
-   **没有东西可绘制时就放行。**返回 `next(e)` 把色带交还给 Claude Code 和其他 mod。
-   **使用单宽符号，而不是 emoji。**☀ ☁ ☂ ☇ ↯ 在每种终端字体中都能对齐。

保存文件，正在运行的会话就会拾取它。在几轮读取大文件之后，色带会从 Clear 变为 Showers 再变为 Storm，正如本节开头的录屏所示。

### 第 5 步：验证和测试

`claude plugin validate` 以与 Claude Code 相同的方式读取清单和模块源码，并报告模块钩住了什么、调用了什么：

CODEText

$ claude plugin validate ./token-weather
  > types ./types/index.d.ts declares state: token-weather.readings
  > ./token-weather.mjs hooks: session.start, turn.complete, ui.render{component=AbovePrompt}
  > ./token-weather.mjs calls: $.session.usage (via takeReading), $.state.get, $.state.set (via takeReading), $.ui.resolve
  > ./token-weather.mjs state writes: token-weather.readings
  > ./token-weather.mjs state reads: token-weather.readings
√ Validation passed

`claude plugin test` 针对真实的 Claude Code 运行时运行插件的 `*.test.ts` 文件。测试用 `on` 注册的钩子在链中运行于 mod _之后_，并桩掉 Claude Code 会给出的回答，因此你可以精确控制 `$.session.usage()` 返回什么：

CODETypeScript

// tests/token-weather.test.ts
import { describe, expect, test } from "claude-code/testing";

describe("token-weather", () => {
  test("the band follows the context window", async ($, on) => {
    // Hooks registered here run after the mod and stub what Claude Code would answer.
    let tokens = 36\_100;
    on("session.start", ($, e) => ({ cwd: e.cwd }));
    on("session.usage", () => ({
      value: { startedAt: 0, rateLimits: \[\], context: { tokens, window: 200\_000, percent: Math.round(tokens / 2\_000) } },
    }));
    on("turn.complete", () => ({ text: "" }));

    await $.session.start({ surface: "terminal", isInteractive: true, cwd: "/work" } as any);
    const ui = await $.ui.mount({
      plugin: "token-weather",
      surface: "terminal",
      component: "AbovePrompt",
      props: { hasSurvey: false, isWorking: false, maxRows: 10, bodyColumns: 120 },
    } as any);
    expect(await ui.find({ type: "Text", text: /Clear/ })).toBeDefined();

    tokens = 134\_400;
    await $.turn.complete({ reason: "answer", answer: "ok", durationMs: 1 } as any);
    expect(await ui.find({ type: "Text", text: /Showers/ })).toBeDefined();
    expect(await ui.find({ type: "Text", text: /67% of context/ })).toBeDefined();
    expect(await ui.find({ type: "Text", text: /▲ \\+98\\.3k last turn/ })).toBeDefined();
    await ui.unmount();
  });
});

CODEText

$ claude plugin test ./token-weather
(pass) token-weather > the band follows the context window
 1 pass
 0 fail

该测试还检查了第 3 步中的重绘行为。色带在 `turn.complete` 之后更新，而 mod 从未请求重绘。

mod 是一个插件，所以它以相同的方式分发。把它放进一个市场，这可以简单到一个带有 `.claude-plugin/marketplace.json` 的文件夹：

CODEJSON

{
  "name": "my-mods",
  "owner": { "name": "You" },
  "plugins": \[{ "name": "token-weather", "source": "./token-weather" }\]
}

CODEShell

claude plugin marketplace add ./my-mods
claude plugin install token-weather@my-mods --scope user

要将你的版本与完成的版本进行比较，请参阅 anthropics/claude-code-playground 中的[完整的 Token Weather mod](https://github.com/anthropics/claude-code-playground/tree/main/claude-code/mods/token-weather)。

## 分享你的 MOD

mod 是一个 Claude Code 插件，所以你像分享任何其他插件一样分享它，没有什么新东西要学。把 mod 放在一个带有市场文件的 GitHub 仓库中，该仓库就成为你的市场。任何人都可以从它安装，你可以用普通的 push 更新它。

在 Claude Code 中安装需要三条命令：

CODEText

/plugin marketplace add your-org/my-mods
/plugin install token-weather@my-mods
/reload-plugins

mod 在你重新加载时启动。如果它没有出现，重启 Claude Code。

mod 是在你机器上的 Claude Code 内运行的代码，拥有与 Claude Code 相同的访问权限，并且由它的发布者编写，而不是 Anthropic。所以像安装软件包一样安装 mod：先阅读仓库，只从你信任的人那里安装。在你运行命令之前，什么都不会被安装。

Claude 目录接受包含 mod 的插件，你可以在 [claude.ai/directory/manage](https://claude.ai/directory/manage) 提交你的插件，这样人们无需你提供链接就能找到它。

## 另外两个 MOD

Token Weather 只观察和绘制。接下来的两个 mod 会介入事件、打开窗格并接受输入。

两者的完整代码都在 anthropics/claude-code-playground 中：[Blast Radius](https://github.com/anthropics/claude-code-playground/tree/main/claude-code/mods/blast-radius) 和 [Replay Theater](https://github.com/anthropics/claude-code-playground/tree/main/claude-code/mods/replay-theater)，每个都有一个解释其构建方式的 README。

### Blast Radius：在运行前看清危险命令会改变什么

当 Claude 用 `rm -rf`、`git reset --hard`、`git clean`、强制推送或数据库迁移调用 Bash 时，Blast Radius 会拦住该调用。它算出该命令会触及什么，并打开一个带有 **Proceed** 和 **Cancel** 的窗格。按 `2`，Claude 会收到一个带有原因的拒绝。按 `1`，命令按原样运行。

**图 D**Blast Radius 拦住 rm -rf build，并列出它将删除的 9 个文件（1.1 MB）。Cancel 拒绝它；第二次尝试时，Proceed 运行它。

它使用三个钩子：Bash 上的 `tool.call`，以及 `Pane` 和 `AbovePrompt` 上的 `ui.render`。它的核心是上表中的"应答"动作：

CODEJavaScript

on("tool.call", { tool: "Bash" }, async ($, e, next) => {
  const risk = classify(String(e.command ?? ""));
  if (risk === null) return next(e);                 // everything else runs as normal

  const report = await measure($, risk, await $.session.cwd());  // git status, git clean -n, du, ...
  held = { command: e.command, risk, report, decision: null };
  const opened = await $.ui.open({ id: "blast-radius", title: "Blast Radius", focus: true });
  if (!opened.isPlaced) held.where = "band";         // too narrow for a pane: draw above the prompt

  while (held.decision === null && !next.signal.aborted) {
    await $.process.run(\["sleep", "0.25"\]);          // time inside $ calls doesn't count against the hook's time limit
  }
  if (held.decision === "proceed") return next(e);   // let it run
  return { deny: \`Blast Radius held this command: the user pressed Cancel. It would have: ${report.summary}.\` };
});

它教了什么：

-   **用 `$.process.run` 做试运行。**报告来自工具自己的命令：`git status --porcelain`、`git clean -n`、`git log HEAD..origin/main`、`showmigrations`。参数以 argv 数组传入，因此路径中的任何内容都不会作为 shell 代码运行。
-   **拦住一个调用。**钩子每次分派有 10 秒自己的时间，但在 `$` 调用内等待的时间不计入。循环等待短暂的 `sleep` 进程，直到按钮的 `onPress` 设置决定，并在 `next.signal` 中止时放弃（你按了 Esc）。
-   **带热键的按钮。**`Button({ label: "Proceed", hotkey: "1", onPress })` 可以通过点击、Tab 加 Enter，或数字键工作。
-   **降级到色带。**终端在足够宽时会把窗格停靠在对话记录旁边。当 `$.ui.open` 回答 `isPlaced: false` 时，同一份报告会绘制在提示词上方：

![一个没有侧边窗格的终端：提示词上方一个黄色边框的框显示命令、它将丢弃的两个有未提交更改的文件，以及带编号的 Proceed 和 Cancel 选项。](https://claude.dev/media/ac53d89fc2dbe36603c30639b12fdc7edcfba5072b9b417e656a65a2d196cc37.png)

**图 E**在 120 列时，Blast Radius 在提示词上方的色带中绘制其针对 git reset --hard 的报告

它是一个安全网，不是权限系统。它读取命令文本，所以 `$(…)`、别名和调用 `rm` 的脚本会绕过它。要硬性阻止，请使用权限规则。

### Replay Theater：逐步查看上一轮的编辑

当一轮运行时，Replay Theater 记录每次 Edit 和 Write 调用：文件，以及之前和之后的文本。当这一轮结束时，提示词上方会出现一个提示。按 `r`（或输入 `/replay`），一个窗格会一次一个 diff 地走过这些编辑，带有一条带编号的步骤条和 **Prev**、**Next** 和 **Close** 按钮。

**图 F**Replay Theater：跨 3 个文件的 5 次编辑重命名后的提示，然后是窗格中的步骤 1 到 5

它从不阻止或改变编辑。它观察：

CODEJavaScript

on("tool.call", async ($, e, next) => {
  if (EDIT\_TOOLS.has(e.tool)) state.pending.push(...(await stepsFor($, e)));  // old/new text → diff
  return next(e);                                                              // the edit runs untouched
});

on("turn.start", ($, e, next) => { if (!e.agentId) state.pending = \[\]; return next(e); });

on("turn.complete", async ($, e, next) => {
  const r = await next(e);
  if (!e.agentId && state.pending.length) state.replay = state.pending;       // one replay per turn
  return r;
});

on("session.start", async ($, e, next) => {
  const r = await next(e);
  await $.command.register({ name: "replay", description: "Step through the last turn's file edits" });
  return r;
});
on("command.run", { command: "replay" }, async ($, e) => ({ text: (await openReplay($)) ? "Replaying" : "No edits" }));

它教了什么：

-   **配对事件。**`turn.start` 和 `turn.complete` 把编辑括起来，每轮形成一次回放，`e.agentId` 把子智能体的轮次排除在分组之外。
-   **注册一个斜杠命令。**在 `session.start` 中调用 `$.command.register`，然后在 `command.run` 上应答它。
-   **读取文件。**对于 Write，`$.fs.read` 在写入落地前获取旧内容，所以 diff 是真实的。
-   **放置是界面的职责。**在全屏模式下，窗格停靠在右侧。在 80 列时，它内联打开在提示词上方。mod 在两种情况下绘制相同的树。

![一个高终端窗口，提示词上方有一个品红色边框的框：一条带编号的步骤条、文件 greet.js、一行 diff，以及 Prev、Next 和 Close 按钮。](https://claude.dev/media/bb2b908077c752f4e43672b5d5e7b0d262756bf27303d0884634cd142487f996.png)

**图 G**80 列时的 Replay Theater，内联绘制在提示词上方

## 四个值得保留的习惯

-   **依靠 Claude Code 为你编写的类型。**每次加载你的 mod 时，Claude Code 都会把适用于你的构建的声明写入该 mod 的 `.claude-plugin/types/` 文件夹，所以你的编辑器和 `tsc -p` 无需额外步骤即可工作。它们是每个事件、`$` 上的每个方法以及每个元素的 props 的参考。
-   **从 `e.props` 读取 props。**`hasSurvey`、`bodyColumns` 以及其他都在那里，而不是在 `e` 本身。
-   **为热重载做规划。**每次保存都会再次运行 `register` 和 `session.start`，所以把数据放在 `$.state` 中，而不是模块变量中。
-   **当绘制不显示时，读日志。**运行 `claude --debug`，寻找一行说某个钩子返回了无法通过校验的树。

## 你会 MOD 什么？

这里的三个 mod 各自来自一个问题：_我的上下文有多满？_、_这个命令即将删除什么？_，以及 _Claude 刚刚改了什么？_你的问题会不同，而这正是重点。一些可以开始的点子：

-   来自 `$.session.usage()` 的成本或速率限制计量器，用 `$.ui.status` 作为状态栏
-   一个 `prompt.submit` 钩子，把团队约定添加到每个提示词
-   一个列出 Claude 本会话读取过的文件的窗格，作为它所见内容的实时地图
-   一个专注计时器，在长轮次结束时用 `$.ui.toast` 发送一个 toast
-   一个针对你的技术栈调整的 `tool.call` 护栏，例如生产 kubectl 上下文或 `terraform apply`

做了一个你现在每天都用的 mod？在 X 或 LinkedIn 上发布它，附上它运行时的 GIF 或截图，让其他开发者看到什么是可能的。把插件放进一个市场（[分享你的 mod](#sharing-your-mod)）并链接到它，这样任何喜欢它的人都能用三条命令安装它。
