---
term: "Pull Request"
en: "Pull Request"
category: "git"
aliases:
  - "PR"
  - "拉取请求"
  - "合并请求"
definition: "在代码托管平台上发起的变更提议，请求审阅并将来源分支的修改合并至目标分支。"
example: "完成文档修订后提交 Pull Request，平台会自动列出文件差异并运行校验，审阅通过后由维护者合并入主分支。"
order: 6
related:
  - "merge"
  - "branch"
  - "fork"
  - "issue"
updated: "2026-11-18"
sources:
  - title: "About pull requests · GitHub Docs"
    url: "https://docs.github.com/en/pull-requests/collaborating-with-pull-requests/proposing-changes-to-your-work-with-pull-requests/about-pull-requests"
basis: "desk-research"
aiUsage: "drafted"
reviewNote: "按极简维基体例重构正文与结构，待负责人复审。"
---

Pull Request（简称 PR，部分平台称为 Merge Request）是代码托管平台上用于提议代码或文档变更的协作机制。发起者指定来源[分支](/glossary/branch/)与目标分支，将一组[提交](/glossary/commit/)和修改说明公开呈现给协作者，待审阅讨论与自动化检查通过后，再由维护者执行[合并](/glossary/merge/)。

## 核心构成与审阅机制

与直接向主线推送修改不同，Pull Request 在改动进入目标分支前建立了一道可追溯的审阅缓冲区：

- **文件差异视图**（Diff）：集中展示此次变更涉及的文件增删与逐行对比，帮助审阅者快速定位改动范围。
- **行内讨论与修订迭代**：审阅者可针对具体代码行或段落提出修改意见；发起者在原分支继续推送新提交后，PR 页面会自动同步更新差异与讨论状态。
- **自动化检查状态**：[仓库](/glossary/repository/)通常会关联持续集成流程，将语法检查、构建结果和[测试用例](/glossary/test-case/)的通过情况直接显示在页面中，作为准入依据。

## 适用场景与权限路径

Pull Request 既用于同一仓库内部的团队协作，也是开源社区接纳外部贡献的标准入口。在内部协作中，成员从主分支切出功能分支完成修改后发起 PR，确保每项改动都经过同伴复核；在跨账号协作中，外部贡献者先通过 [Fork](/glossary/fork/) 获取个人副本，再跨仓库向原项目发起 PR，由原仓库维护者统一评估并决定是否合入。

## AI 辅助起草与核查边界

在准备或审阅 Pull Request 时，[大语言模型](/glossary/llm/)与[AI 编程助手](/glossary/coding-assistant/)常被用于根据代码差异自动生成改动摘要、梳理影响模块，或协助检查明显的语法疏漏与格式问题。

不过，AI 仅能提供辅助参考。模型在概括大型差异时可能出现[AI 幻觉](/glossary/hallucination/)或遗漏隐含副作用，PR 描述中声明的测试结果、修改动机与事实陈述必须由提交者亲自核实，最终的合入[验收](/glossary/acceptance/)责任也不能交由 AI 代为承担。

## 概念边界

- **发起请求不等于完成合并**：在维护者批准并执行合并之前，目标分支的内容不会发生任何变化，已发起的 PR 也可以随时被关闭或撤回。
- **不同于问题单**：Pull Request 承载的是具体的修改方案与代码实现，而故障报告、功能提议与前期讨论通常先通过 [Issue](/glossary/issue/) 进行记录与关联。
