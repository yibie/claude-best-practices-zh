---
title: "Anthropic 如何用 Claude Code 运行大规模代码迁移"
source_url: "https://claude.com/resources/articles/ai-code-migration"
publisher: "claude.com"
type: "blogPost"
date: "2026-07-16"
products: ["Claude Code"]
read_time: 7
excerpt: "一份用 AI 智能体运行大型代码迁移的分步指南——包括 Bun 百万行 Zig 到 Rust 的移植。"
fetched_at: "2026-11-18"
---

# Anthropic 如何用 Claude Code 运行大规模代码迁移
代码迁移——将生产代码库移植到新语言的项目——直到最近还是需要多年投入的工作。

在过去一个月里，Anthropic 的多位开发者各自使用 Claude Fable 5、Claude Opus 4.8 和[动态工作流](https://claude.com/resources/articles/introducing-dynamic-workflows-in-claude-code)迁移了 10 个代码包，规模从数万行到数十万行代码不等。本文将介绍其中两个案例，以及这些项目总结出的最佳实践。

Bun 联合创始人、Anthropic 技术团队成员 Jarred Sumner 使用 Claude Code [将 Bun 从 Zig 迁移到 Rust](https://bun.com/blog/bun-in-rust)。不到两周就产出了百万行代码，合并前 Bun 现有测试套件在 CI 中 100% 通过。合并后有 19 个回归问题浮现，现已全部修复。Rust 移植版已于 6 月在 Claude Code 内发布。

Anthropic Labs 联合负责人 Mike Krieger 在一个周末内将一个 Python 代码库迁移为 165,000 行 TypeScript。这包括数百个智能体、八个阶段门禁、三轮对抗性审查，以及一次最终的等价性检查，将每条命令的输出与 Python 原版逐一比对。

Claude Code 的新能力改变了这些长期搁置项目的成本计算。以下是我们现在使用的六步流程，源自这些迁移给我们的经验教训。

核心洞见是：你不要去修代码。**你要修的是产出代码的那个流程（循环）**。

## 什么是 AI 代码迁移？

AI 代码迁移使用 AI 智能体将生产代码库移植到新语言或框架。工程师不再手工翻译文件，而是编写迁移规则和[验证循环](https://claude.com/resources/articles/building-verification-loops-in-claude-code-with-skills)；随后智能体进行翻译、编译和测试，直到新代码的行为与原版一致——将多年项目压缩到数周。

## **为什么以及何时迁移语言**

在直接进入_怎么做_之前，值得先讨论_何时_和_为什么_，因为围绕这些项目的假设已经发生了变化。

团队启动迁移，是因为从最初构建到当前项目之间环境发生了变化。要么某个已知的权衡已经变成限制，要么出现了更好的方案，要么原生态系统正在萎缩。

例如，Jarred 最初选择 Zig，是因为它提供了 C 级别的性能，同时极其简洁，非常适合一位独立创始人“在 LLM 出现之前，在奥克兰一间狭小公寓里用 1 年时间写出 Bun”。这种简洁性伴随着已知的权衡，[他在此文中有所论述](https://bun.com/blog/bun-in-rust#just-be-really-smart-and-don-t-make-mistakes)。

快进到 2026 年。Bun 的 CLI 月下载量超过 1000 万次，并在 Claude Code 内被广泛使用。

就在上个季度，这些权衡还不足以证明冻结路线图、投入资源进行一个多季度项目是合理的。迁移语言可以带来更小、更快、更安全的系统，但没人愿意为此买单。

软件工程师还不得不面对这些昔日巨型项目固有的职业风险。你可能要并行维护两个代码库数个季度甚至数年，如果最终结果是 90% 等价，你面对的麻烦比开始时还大。

而现在，最坏的情况就是你删掉分支，再试一次。

仍然需要有站得住脚的商业理由。虽然百万行迁移不再需要在四年项目周期内花费 300 万到 400 万美元的工程资源，但执行起来仍需花费数万到数十万美元甚至更多。例如，Bun 迁移消耗了 59 亿未缓存输入 token 和 6.9 亿输出 token——按 API 定价约 165,000 美元。Mike 移植的主体部分为 2700 万 token。



Jarred 的百万行 PR。

**然而，迁移的理由不再需要是生死攸关的。** 变更日志里一年的内存 bug 补丁，或者一个长期瓶颈，现在就能成为理由。

编译步骤是 Mike 项目的推动力。他团队开发的内部工具以单个二进制文件的形式交付给用户。用 Python 工具链生成该二进制文件，每个平台大约需要八分钟，每次发布在整个构建矩阵上总共要等待 30 分钟。移植后，同样的编译现在只需约两秒，二进制文件启动速度快 6 倍，团队还得以退役一条单独的部署流水线。

## **为什么 AI 改变了代码迁移的成本计算**

Claude Fable 5 是我们能力最强、已普遍可用的模型。Fable 和 Opus 4.8 尤其擅长通过子智能体来委派、指挥和验证并行工作流，同时为既定目标寻找多条路径。

大型代码迁移是这些先进模型特别有效的用例，因为：

-   **工作是可并行的**。工作可以跨数千个独立单元（如文件和 crate）执行，因此智能体可以同时工作，而不是一个等另一个。
-   **上下文清晰且全面**。旧代码为模型提供了极好的规格说明。它也是帮助构建翻译智能体所遵循指南的核心参考。
-   **有内置的裁判**。许多大型代码库都包含测试套件，智能体可以用它来验证工作。当验证是客观的时，智能体表现最佳，因为模型可以对着一个基准真相持续打磨数天，而无需人类来仲裁质量。
-   **队列会自己写出来**。当编译器或测试运行失败时，这就成为智能体要修复的下一个条目。
-   **它们要求一致性和边界情况处理**：流程的设计让偏差无处藏身：审查者会为每个发现引用其背后的规则，因此违规会变成一个队列条目，而不是悄无声息的偏离。而当智能体确实遇到边界情况时，修复会变成后续每个智能体都遵循的规则。

如下文所示，Mike 和 Jarred 都在迁移流程的关键步骤中使用了 Fable，特别是在**一种咨询模式**中，该模式使用多个模型类别来优化 token 消耗。

## **大型代码迁移的六个步骤**

_以下流程已泛化，以适用于多种语言和场景。更多细节，可阅读 [Jarred 的博客](https://bun.com/blog/bun-in-rust)。你也可以访问[迁移入门套件](https://github.com/anthropics/code-migration-kit-with-claude-code)。注意：入门套件是上述流程的泛化模板——并非这些具体移植实际运行所用的东西。_

### **前置条件**

开始迁移项目之前的一个前提条件，是要有一个强大的裁判，否则你就没有退出条件或成功衡量标准。

裁判必须能够以同等条件评估原始代码和目标代码。用原语言编写的测试套件往往依赖目标代码中不存在的内部函数。

要构建这个裁判：

-   **对现有测试分类**。使用 Claude 识别哪些测试可以表达为外部调用，哪些依赖不会移植的内部实现。
-   **为可移植性重写**。将面向外部的测试转换为可同时对原始代码和移植版运行的断言。使用对抗性智能体验证重写后的测试没有削弱断言。
-   **验证裁判**。对原始代码运行它以确认通过。然后对故意破坏的代码运行它以确认失败——一个抓不住破坏的裁判算不上裁判。

Jarred 有一个用第三种语言（TypeScript）编写的大型测试套件，但大多数项目不会如此。对于他的 Python 到 TypeScript 移植，Mike 创建了一个包含七个真实场景的等价性测试框架（harness），并将任何行为变化都视为需要修复的 bug。

在我们进入每个阶段之前，这张图可能有助于你跟上。这主要遵循 Jarred 的方法论，每个阶段都有审查和门禁。Mike 使用了类似的整体结构和类似的循环工作流，但他端到端地运行了整个迁移，根据结果修订规则和工作流，然后再次运行——每次都丢弃输出，直到第三次运行。



### **第 1 步——创建规则手册、依赖图和缺口清单**



在这个阶段，我们为迁移奠定基础：一份需要重构而非仅仅翻译的代码位置清单、一份如何翻译代码的规则手册，以及一份用于排序迁移实施工作流的依赖图。

顺序很重要：规则手册必须先于缺口清单。缺口清单由规则手册的默认值无法覆盖的内容来定义，两者在联合审计中一起测试。

#### **规则手册**

[规则手册](https://github.com/anthropics/code-migration-kit-with-claude-code/blob/main/templates/RULEBOOK.md)的确切形态取决于你必须在开始时做出的关键架构决策。其中首要的是：新代码是遵循相同结构，还是完全重新设计。

如果是前者（Jarred），规则手册主要是查找表，用于在语言之间翻译类型和惯用法，同时指向缺口清单以处理较难翻译的组件。如果是后者（Mike），它将是一份设计文档。

Jarred 通过与 Claude 对话创建了他的规则手册，为每个模糊领域形成策略。他还使用了八个子智能体，专门基于他自己的直觉来审查 8 类常见失败模式。

#### **依赖图**

你需要理解文件依赖关系，才能有效地为并行迁移拆分工作流，从而知道哪些文件先迁移，哪些文件应包含在同一批次中。有些语言和代码库有显式清单，使这变得容易，但对于遗留代码库和许多流行语言（如 C/C++ 和 Python），这些依赖关系需要被发现和映射。

Claude Code 可以部署智能体来创建并运行一个确定性的脚本来生成这张图。[迁移套件中的提示词](https://github.com/anthropics/code-migration-kit-with-claude-code/blob/main/prompts/01-dependency-map.md)使用一个工作流来创建审查并修复的循环。_注意：入门套件是本文所述流程的泛化模板——并非这些具体移植实际运行所用的东西。_

#### **缺口清单与怀疑论审查者**

新语言有不同于旧语言的要求，必须得到满足。对于 Zig 到 Rust，差异在于手动内存管理（C 和 C++ 也是如此）。例如：

Zig

```
fn readConfig(allocator: std.mem.Allocator) ![]u8 {
    const buf = try allocator.alloc(u8, 1024);
    // ...fill buf...
    return buf; // caller must free this — but only the comment says so
}

// A caller that forgets 'defer allocator.free(buf)' still compiles — the leak only surfaces at runtime.
```

Rust

```
fn read_config() -> Vec<u8> {
let buf = vec![0u8; 1024];
// ...fill buf...
buf // ownership moves to the caller; memory is freed automatically
}
// Use it after it's moved? Free it twice? Neither compiles.
// Forget to free it? There's no free call to forget — drop is automatic.
```

对于 Python 到 TypeScript，缺口在于接口和契约。Python 不要求声明它将接受什么形状的对象或返回什么，但 TypeScript 要求。例如：

Python

```
def register(handler):
    handler.setup()
    return handler.run({"retries": 3})

# Any object with .setup() and .run() works here. Which objects actually get passed in? Read the whole codebase to find out.
```

TypeScript

```
interface RunResult { ok: boolean }

interface Handler
{ setup(): void;
run(opts: { retries: number }): Promise<RunResult>;
}

function register(handler: Handler): Promise<RunResult> {
handler.setup();
return handler.run({ retries: 3 }); }

// The contract must be written down before this compiles
```

Jarred 和 Mike 都创建了缺口清单文件来捕获这些隐式知识。Jarred 预先清点了这些缺口，也就是我们这里所做的，而 Mike 选择先翻译，然后通过事后审计来创建缺口清单。你可能需要两者都做。

查看这个示例[用于创建缺口清单文件的 Claude Code 提示词](https://github.com/anthropics/code-migration-kit-with-claude-code/blob/main/prompts/02-gap-inventory.md)。

### **第 2 步——对规则进行压力测试**



这一步涉及一次小型迁移，作为更大规模迁移的“试航”。

在这一步中，Jarred 使用一个智能体按照规则手册翻译三个文件，一个智能体“像资深 Rust 工程师一样”翻译三个文件，一个智能体利用差异来创建新的翻译规则。在这个阶段，他发现了两个关键问题，如果扩散到全部 1,448 个文件，将会造成大量问题。

提示词可能看起来像[这样](https://github.com/anthropics/code-migration-kit-with-claude-code/blob/main/prompts/03-stress-test.md)。

这种压力测试**仅适用于保持结构的迁移**，即同一文件的两种翻译可以逐行比较。如果你的规则手册是一次重新设计——像 Mike 的那样——等效的测试是用对抗性审查者直接攻击设计文档，然后用一次性的端到端运行来验证它。

无论如何，丢弃任何翻译后的文件。目标是完善规则，而不是取得增量进展。

### **第 3 步——翻译所有内容**



对于剩余步骤，你运行相同的多智能体循环架构：实施、审查和修复。

你可以将实施者的工作下放给较小的模型，而让审查者使用较大的模型。例如，Mike 在为主迁移展开 12 个子智能体时使用了 Claude Sonnet。

工作队列应该是机械化的。一个批处理脚本通过检查翻译后的文件是否存在于磁盘上来决定哪些已完成，然后将待处理文件切片成批次交给实施者智能体。由于队列每次都是从磁盘重建的，迁移在构造上就是可恢复的。

在这个阶段，智能体可能会对它们做多少工作过于谨慎。修复方法可以是一条直白、强调性的提示词指令，并附上编译器会在下一步捕获错误的上下文。

翻译器无法自信执行的任何内容都会被标记为 // TODO(port): <reason>，留待第 4 步处理。从这里开始，待办清单会自己写出来：编译器枚举错误，冒烟测试发现崩溃，测试套件报告失败。

两个对抗性审查者使用独立的上下文评估实施者的工作，审查者之间的分歧会交给第三个智能体。当审查者不断在多个文件中发现同一个错误时，修复不是逐文件的。你在规则手册中加一句话，然后重新生成受影响的批次。规则手册在这一步中不断增长；代码永远不会被手工打补丁来对抗它。

这一步中需要注意的一个重要设计决策是编译器的位置。Mike 在每个循环内运行 TypeScript 编译器，因为它能在几秒内检查一个单元。Jarred 完全禁止编译器进入循环，将其推迟到下一步，因为 cargo 需要几分钟。

到这一步，大部分繁重工作已经完成，[提示词开始变短](https://github.com/anthropics/code-migration-kit-with-claude-code/blob/main/prompts/04-translation-kickoff.md)。

### **第 4、5、6 步——编译、运行并匹配行为**



这三个步骤共享相同的循环架构，且需要的人工判断逐步减少，所以我们一起介绍。

例如，**第 4 步**往往可能融入第 3 步，取决于语言和迁移规模。

根据编译步骤的规模和难度，智能体可能根本不运行这一步。Jarred 用一个编排器脚本执行这一步，在整个工作区调用一次编译器。然后“修复智能体”并行处理错误列表，并进行对抗性审查。构建再次运行，如此反复。

审查错误列表有助于发现可能需要调整的系统性问题。例如，Jarred 遇到了数千个 Rust 模块错误，这些错误在修复了 Zig 惰性编译所容忍的循环导入后浮现。他通过编码逻辑来分类应删除、移动或重构边界的依赖关系，从而修复了循环。

**第 5 步**也有一个类似于编译器错误列表的机械化真相来源：冒烟测试产生的崩溃。同样，循环的修复方法是将问题分组归类，在这种情况下是按根因对原因分组，由对抗性子智能体审查。

**第 6 步**也是我们故事的结尾，是比较两个代码库中程序的行为。

我们的文件现在已被翻译、编译并通过冒烟测试。现在是时候将它们分片，并对它们运行（来自前置条件阶段的）测试套件了。用“修复智能体”处理失败，它们会对照两个代码库审查失败的测试。对抗性审查者检查它们的修复。

这个循环中的下一个阶段是一个[构建守护进程](https://github.com/anthropics/code-migration-kit-with-claude-code/blob/main/scripts/build_daemon.sh)，它是唯一被允许重建二进制文件的进程。修复者编写补丁；守护进程将它们批处理，重建一次，重新运行受影响的测试，并将结果反馈回去。这将最昂贵的操作串行化，而不是让多个智能体独立触发它。

当同一个失败在许多测试中重复出现时，修复要上移：你修订产生该 bug 的规则，只重新生成该规则触及的文件。

Mike 的方法在这里很重要，因为许多开发者不会有现成或已移植的测试套件。Mike 让 Claude 创建了一个小脚本，对新移植版和原始 Python 代码库运行 7 个真实场景，并比对结果。每个失败的场景都有自己的修复智能体，循环一直运行到全部七个通过。

然后他更进一步。Claude 设计了自己的端到端测试套件，并在夜间自主运行，修复出错的地方并连续四个晚上重新运行。结果，它抓住了任何场景清单都无法预测的细微问题。

教训是：缺少测试套件并不阻碍这一步。如果你无法继承一个裁判，就让 Claude 构建一个。无论如何，你的原始代码库就是基准真相。

## **代码迁移最佳实践**

每一次运行都教给我们上一次没有的东西。可以打赌，你的下一次迁移会教给你本指南无法涵盖的东西。但有几条实践在每个项目中都站得住脚：

-   **不要盲目遵循本指南。** 每次迁移都不同。将其视为起点，在投入之前与 Claude 一起规划你的具体迁移。
-   **不要关注单个失败。** 单个失败是循环的职责。修复智能体会把它们逐一清除。你的注意力应放在模式上。
-   **让审查具有对抗性，让验证机械化。** 对抗性审查允许更长时间运行的任务，通常值得 token 消耗。让脚本——编译器、差异比对、测试套件——来当裁判。
-   **不要对所有事情都使用最大的模型。** token 消耗集中在你的循环中，所以要刻意设计它们。较小的模型能很好地处理高容量的实施展开；把你最大的模型留给审查者，以及任何编写其他智能体将遵循的规则的工作。
-   **把人力时间前置。** 规则手册和压力测试是最耗时的。之后的一切主要是清空队列。
-   **让工作队列机械化且可恢复。** 完成应该意味着“输出文件存在于磁盘上”。

## **审查循环结果，而不是代码**

Jarred 的 Bun 迁移现已投入生产，尽管每次迁移都有权衡。例如，约 4% 的 Rust 代码位于“unsafe”块内，主要是 C/C++ 边界处的单行指针操作。

但新代码库可衡量地更好。团队工具能检测到的每个内存泄漏都已修复：一项 2,000 次重复构建的基准测试从 6,745 MB 内存降至 609 MB。二进制文件在 Linux 和 Windows 上小了 19%。跨语言优化使其在 HTTP 服务和 next build、tsc 等真实工作负载上快了 2–5%。

考虑一下是否该重新计算你长期搁置的迁移的成本了。挑一个你一直忍受的代码库，问问 Claude 它的迁移流程会是什么样。

**_相关_**

-   _[迁移入门套件](https://github.com/anthropics/code-migration-kit-with-claude-code) 注意：入门套件是上述流程的泛化模板——并非这些具体移植实际运行所用的东西。_
-   _[代码现代化插件](https://github.com/anthropics/claude-plugins-official/tree/main/plugins/code-modernization) —— 用于[遗留代码现代化](https://claude.com/resources/guides/the-code-modernization-playbook)和框架升级，而非语言移植_
-   _[Claude Code 中的动态工作流](https://claude.com/resources/articles/introducing-dynamic-workflows-in-claude-code)_

‍
