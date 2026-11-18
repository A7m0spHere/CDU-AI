---
term: "合并"
en: "Merge"
category: "git"
aliases:
  - "Merge"
  - "合并分支"
  - "代码合并"
definition: "在版本控制中将一个分支上的提交历史与文件修改整合进另一个目标分支的操作。"
example: "功能分支经审阅与测试确认无误后被合并入主分支，两个分支的独立修改由此汇合为统一的后续提交历史。"
order: 8
related:
  - "branch"
  - "pull-request"
  - "commit"
  - "version-control"
updated: "2026-11-18"
sources:
  - title: "About pull request merges · GitHub Docs"
    url: "https://docs.github.com/en/pull-requests/collaborating-with-pull-requests/incorporating-changes-from-a-pull-request/about-pull-request-merges"
  - title: "git-merge · Git"
    url: "https://git-scm.com/docs/git-merge"
basis: "desk-research"
aiUsage: "drafted"
reviewNote: "按极简维基体例重构正文与结构，待负责人复审。"
---

在[版本控制](/glossary/version-control/)系统中，合并是将两条分叉历史重新汇合的核心操作。系统会查找来源[分支](/glossary/branch/)与目标分支的最近共同祖先，比对双方各自产生的[提交](/glossary/commit/)差异，并将来源分支的修改整合进目标分支，使分散完成的功能开发或缺陷修复进入同一条代码基线。

## 常见合并方式

根据项目对提交历史可读性与分支拓扑的不同要求，代码托管平台与版本控制工具通常支持三种主流合并策略：

| 合并方式 | 历史记录形态 | 适用场景 |
| --- | --- | --- |
| **常规合并**（Merge Commit） | 生成新的汇聚提交，完整保留分支分叉轨迹 | 需要保留完整开发过程与阶段节点的协作项目 |
| **快进合并**（Fast-Forward） | 目标分支指针直接前移，不产生额外合并节点 | 目标分支在此期间无新提交，追求线性历史 |
| **压缩合并**（Squash and Merge） | 将来源分支多次零碎提交合并为单个提交合入 | 清理试错提交，常用于 [Pull Request](/glossary/pull-request/) 合入主线 |

## 合并冲突与人工决策

当两条分支恰好修改了同一文件的相同或相邻区域，或者一方修改了另一方已删除的文件时，系统无法自动判定保留哪一侧改动，此时会触发**合并冲突**（Merge Conflict）并暂停操作，等待人工介入处理。

在排查冲突时，[AI 编程助手](/glossary/coding-assistant/)能够快速解释冲突标记上下两段代码的差异并提出整合建议。但最终保留哪一版实现、多处逻辑如何衔接属于业务判断与代码责任，不能盲目采用 AI 给出的覆盖方案；完成冲突解决后，仍需重新执行[调试](/glossary/debugging/)与[测试用例](/glossary/test-case/)，确认合并后的整体行为符合预期。

## 概念边界

- **不同于变基**（Rebase）：合并通过新增汇聚节点或前移指针整合修改，会如实保留历史分叉；变基则是将当前分支的提交逐个重新应用到目标分支顶端，从而改写为线性提交历史。
- **无冲突合并不等同于功能正确**：自动合并成功仅说明两侧修改在文本行位置上互不重叠，并不保证两段代码在语义逻辑、接口参数或运行时状态上彼此兼容。
