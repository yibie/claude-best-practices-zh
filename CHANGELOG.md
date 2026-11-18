# 更新日志

本仓库按 LLM Wiki 协议维护：`[ADD]` 为新增加的知识，`[FIX]` 为对既有内容的修正，`[SRC]` 为来源变化。

## 2026-11-18 · v1.0 首次编译

- `[ADD]` 抓取 claude.com/resources/best-practices 全部 231 条资源清单（144 篇文章 / 14 份指南 / 73 场网络研讨会）。
- `[ADD]` 落地 173 篇英文原文快照到 `raw/`，58 条无正文的录播/报名页仅保留摘要。
- `[ADD]` 全部 173 篇译为中文（约 95 万字），保存到 `docs/zh/`，结构校验：标题、代码块、链接数量与原文一致。
- `[ADD]` 从 173 篇译文中抽取 1075 个原始概念，合并同义项后得到 100 个规范概念，写入 `wiki/`。
- `[ADD]` 生成 202 条概念关系，导出 `mindmap/graph.json`、`knowledge-graph.mmd`、交互图谱与思维导图。
- `[ADD]` `wiki/INDEX.md` 主题清单、`docs/README.md` 译文总目录、GitHub Pages 入口页。
