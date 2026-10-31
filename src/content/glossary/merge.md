---
term: "合并"
en: "Merge"
category: "git"
aliases: ["Merge", "合并分支", "代码合并"]
definition: "把一个分支的改动并入另一个分支。"
example: "功能分支测试通过后合并回 main，PR 页面会显示「已合并」。"
youMaySay: "合并之后那个分支还要留着吗？"
scenario:
  title: "功能分支合回主线"
  steps:
    - label: "确认差异"
      body: "检查分支相对主线的改动，看有没有冲突。"
      note: "双方修改无法自动合并时会产生冲突，需要人工处理。"
    - label: "执行合并"
      body: "在 PR 页面点合并，或在本地合并后再推送。"
    - label: "清理分支"
      body: "删除已经合并的分支，保持仓库清爽。"
quiz:
  - question: "合并时出现冲突，通常因为？"
    options:
      - text: "网络太慢"
        correct: false
      - text: "两个分支改了同一处内容"
        correct: true
      - text: "提交说明太长"
        correct: false
    explain: "双方对同一处的修改无法自动合并时，需要人工处理冲突。"
agentPrompt: "请帮我检查这个分支与 main 的差异，列出可能的合并冲突点并给出处理建议。"
order: 8
related: ["branch", "pull-request"]
updated: "2026-11-01"
sources:
  - title: "About pull request merges · GitHub Docs"
    url: "https://docs.github.com/en/pull-requests/collaborating-with-pull-requests/incorporating-changes-from-a-pull-request/about-pull-request-merges"
  - title: "git-merge · Git"
    url: "https://git-scm.com/docs/git-merge"
basis: "desk-research"
aiUsage: "drafted"
reviewed: "2026-11-01"
reviewedBy: "AI 初审（负责人授权）"
reviewNote: "负责人确认修改冲突说明；未针对所有合并策略实测。"
---

## 是什么

合并是把一个分支上的改动并入另一个分支：比如把功能分支合回 main，改动正式进入主线。

## 什么时候会遇到

PR 显示「可以合并」、本地把分支合回主线、看到「冲突（conflict）」提示时。

## 和 AI 的关系

AI 能帮你分析差异和冲突原因，但保留哪一版、业务上哪个对，要你自己决定；合并后还要跑一遍验证。

## 想深入再看

相关词条：分支、Pull Request。
