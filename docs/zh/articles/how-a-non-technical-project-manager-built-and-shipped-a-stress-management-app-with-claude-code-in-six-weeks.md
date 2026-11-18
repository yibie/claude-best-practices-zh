---
title: "一位非技术项目经理如何在六周内用 Claude Code 构建并发布一款压力管理应用"
source_url: "https://claude.com/resources/articles/how-a-non-technical-project-manager-built-and-shipped-a-stress-management-app-with-claude-code-in-six-weeks"
publisher: "claude.com"
type: "blogPost"
date: "2026-05-01"
products: ["Claude Code"]
read_time: 8
excerpt: "Kostiantyn Vlasenko 着手构建 Respiro 时从未写过一行代码。仅仅一个多月后，他的产品就登上了 App Store。"
fetched_at: "2026-11-18"
---

# 一位非技术项目经理如何在六周内用 Claude Code 构建并发布一款压力管理应用
_在我们的系列栏目 **Day zero: founder stories** 中，我们介绍一些全球最有趣、最鼓舞人心的初创公司背后的构建者。本文聚焦 Kostiantyn Vlasenko——[Claude Opus 4.6 Hackathon](https://claude.com/resources/articles/meet-the-winners-of-our-built-with-opus-4-6-claude-code-hackathon) 的获奖者，也是 Respiro 的创造者。_

在加入本次采访的视频通话前十五分钟，Kostiantyn Vlasenko 感到紧张。不过，他太专注于思考自己想说什么，以至于实际上并没有注意到自己的焦虑——但他的手机注意到了。

“应用检测到了这一点并提醒我，‘老兄，你直接去做一个简短的箱式呼吸练习就行。箱式呼吸以前帮你缓解过压力，’”他说。

这款应用 [Respiro](https://apps.apple.com/us/app/respiro-stress-relief/id6758023997) 就是 Vlasenko 的作品。尽管他是一位拥有十年经验的项目经理，但直到 2026 年 2 月他决定为 [Built With Opus 4.6 Claude Code Hackathon](https://cerebralvalley.ai/e/claude-code-hackathon?tab=guest-list) 构建一个项目之前，他从未发布过一行代码。一个月后，Respiro（一款基于科学方法进行压力管理的 iOS 应用）已在 Apple App Store 上线，拥有数百名用户，其运行架构包含 15 个以上专门的子智能体，全部由 Vlasenko 自己构建和编排。

他用 Claude Code 在 72 小时内完成了这一切，没有团队，也没有编程经验。

## 没有应用能解决的问题

作为 [Mythical Games](https://mythicalgames.com/) 的项目经理，常驻基辅的 Vlasenko 十年来一直在应对利益相关方的压力、团队动态以及产品发布的无情节奏。他发现呼吸技巧和正念有助于控制自己的压力水平；但他找不到一款能在真正感到压力的时刻介入的压力管理工具。

“现有的应用会提醒我在晚上 10 点之类的时段做深呼吸。但它们并不理解我*现在*就有压力，”他解释道。当时他正在乌克兰西部的山区度假，想法逐渐清晰：构建一款应用，实时检测来自个人设备的压力信号，然后在你最需要的时刻，用引导式正念呼吸练习进行干预。唯一的问题是，他不知道如何构建应用。

## 像管理人一样管理智能体

当时，Vlasenko 正在使用 Claude 自动化工作任务，比如更新 Jira、在 Slack 中发布会议纪要，而且他最近才开始使用 Claude Code CLI。“然后我想，好吧，我熟悉我的团队成员如何用 Claude 写代码。为什么我不能也这样做呢？”他说。

他很快意识到，自己的项目管理背景比编程技能更重要。“我在管理真人方面有大量经验，”他说。“我意识到这其实是同一回事，只不过是在我的 IDE 里管理智能体，而且我真的很惊讶它竟然如此简单。”

Vlasenko 开玩笑说，他的第一个提示词基本上就是*嘿 Claude，给我一个能让我压力更小的应用*，但即便如此，他说最初的结果也让他惊叹。“哇，这太厉害了。它不只是在我脑子里，它*现在*就在我的手机里，而且它能用！”

但 Vlasenko 并没有止步于此。他用 Claude 研究智能体系统如何运作、哪些 Apple API 可以为他的压力检测逻辑提供数据，然后让 Claude 帮助搭建了一个多智能体架构：一个 TCA 架构师智能体、一个 Swift 开发者智能体、一个 Metal 专家、一个代码审查者等等，全部在不同模块上并行运行。

Claude 还让转向变得毫无痛苦：当 Respiro 最初基于 React Native 的 MVP 因为 Vlasenko 没有 Android 手机可测试而出现问题时，他用 Claude Code 在几个小时内用 Swift 从零重写了这款应用。

他说，总而言之，从最初的想法到功能完整、可上架 App Store 的 Respiro 版本，只用了不到六周。

## 从 Claude Code 代码到 App Store

构建应用是一回事。发布它则是另一回事，而 Vlasenko 以前从未走过 Apple Developer Program 的流程。他用 Claude 一步步引导他完成了这个有时令人困惑的过程。

“当我卡住时，我可以直接截个图问 Claude，‘嘿，我该点这里吗？’”他说。他用同样的方法设置了其他第三方服务，比如用于日志记录的 Sentry 和用于分析的 Amplitude。“我会告诉 Claude，*我已经完成了登录，这是 API key*，99% 的情况下 Claude 第一次就搞定了，”Vlasenko 说。他继续说，剩下 1% 的情况，“我只需要在第一个提示词里进一步细化、把需求说得更清楚，再多试几次 Claude 就能给我想要的结果。”

事实上，Vlasenko 认为 [Claude 的视觉能力](https://platform.claude.com/docs/en/build-with-claude/vision)是它最被低估的功能。“你给 Claude 发一张截图让它分析，它会告诉你它看到了什么。然后你可以借此让 Claude 引导你完成哪怕是最复杂的 UX，”他解释道。“比如，我需要在 Meta 上创建一个 API token，我当时完全迷失在他们的界面里，但 Claude 真的理解，并引导你到所有需要去的地方。”

Respiro 的营销也是 Claude 协助完成的。当 Vlasenko 需要分析时，Claude 不仅集成了 Amplitude 的基础 SDK，还搭建了完整的用户漏斗、留存指标以及日活和月活的活跃追踪。当他需要内容时，Claude 开始为他撰写博客文章，并帮他制作 TikTok。Claude 还提出了一个 Vlasenko 说自己绝不会想到的增长策略：联系心理学家和正念练习者，让他们向客户推荐 Respiro。他试了。奏效了。练习者们开始推荐这款应用。

## 工作中的创始人模式

Vlasenko 在构建 Respiro 过程中培养的技能，并不只用于他的副业项目。他现在在 Mythical Games 的日常工作中提交代码发布并直接交付功能。此外，他还成为自己在构建 Respiro 时形成的开发流程的内部倡导者，与工程团队分享他的 Claude 文件夹和工作流。

“他们大多数人回来说，‘嘿，这个工作流比我现在的要好得多！’”他指出。因此，Mythical 现在有一个小型内部团队完全通过 Claude 交付工作。不过，Vlasenko 观察到，对所有相关人员来说，这并非完全没有摩擦的转变。“对一些工程师来说，很难转变心态，不去完全控制每一行代码，”他说。“对我来说这很容易，因为我没有深厚的编程背景，这感觉就是一种自然的工作方式。”

对 Vlasenko 来说，构建 Respiro 的经历抹去了可能与不可能之间的所有界限。他正在把语音引导练习和动作练习加入应用的下一版本，依据的是 Claude 帮他撰写的路线图，并在完成日常工作后投入七八个小时进行编码。

“我会说 Claude Code 是我的新瘾，”他说。

| The Claude Code Day Zero Questionnaire™ |
| --- |
| 在这个环节，我们向创始人提出同样一些轻松的问题，以了解更多键盘背后的人。 |
| --- |
| 谁或什么激励着你？ | LeBron James。他的自律、稳定性和长期心态极具启发性。他不仅仅依靠天赋；他通过不懈的专注和执行力打造了史上最伟大的职业生涯之一。还有 Warren Buffett——领域完全不同，但核心特质相同：数十年间的耐心、稳定性和思维清晰。我真的很钦佩那些不是靠运气、而是靠长期保持稳定而取得伟大成就的人。 |
| 如果能回到过去，你会做什么不同的事，为什么？ | 我希望自己能更早意识到，构建产品其实是容易的部分。传达它的价值要难得多！如今，构建高质量的东西出奇地容易，尤其是有了 Claude 这样的工具。但让人们理解它为什么重要、为什么他们应该在意——那才是真正的挑战。 |
| 如果有人写一本关于你创业历程的书，书名会是什么？ | “Autonomous by Design” |
| 你的工作空间是什么样的？ | 大约 70% 的时间，我在连接了外接显示器、键盘和鼠标的 MacBook 上工作。大约 20% 的时间只在我的笔记本电脑上，当我不在家时。还有大约 10%——用我的手机，通常是我有了一个想法不想等的时候。另外，我的猫经常在桌上陪着我（并确保我不会连续工作太多小时）。 |
| 你现在开着多少个浏览器标签页？ | 现在——大约 5 个。我尽量保持最少。通常，我会在后台播放一个 YouTube 视频——我喜欢听真实犯罪或创始人播客。我还积极运营一个 Threads 账号，在那里分享我在构建的东西、实验、Claude 工作流，并帮助他人搭建自己的系统。 |
