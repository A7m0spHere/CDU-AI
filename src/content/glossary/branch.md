---
term: "分支"
en: "Branch"
category: "git"
aliases: ["Branch", "代码分支"]
definition: "从主线分出来的一条独立修改线，改完再合回去。"
example: "给社团工具加新功能前先开一个分支，改坏了也不影响正在用的版本。"
youMaySay: "为什么不直接在 main 上改？"
scenario:
  title: "加功能先开分支"
  steps:
    - label: "开出分支"
      body: "从 main 建一个专门做这个功能的分支。"
      note: "主线保持随时可用。"
    - label: "独立修改"
      body: "在分支上多次提交，不影响别人正在用的代码。"
    - label: "合并回去"
      body: "测试通过后发起合并，改动回到主线。"
quiz:
  - question: "分支的主要作用是？"
    options:
      - text: "让代码运行更快"
        correct: false
      - text: "隔离修改，让主线保持稳定"
        correct: true
      - text: "自动修复 bug"
        correct: false
    explain: "分支把未完成的改动隔离开，合并前不影响主线。"
agentPrompt: "请说明这个新功能应该基于哪个分支开发、分支怎么命名，以及合并前需要检查什么。"
order: 4
related: ["repository", "merge", "version-control"]
updated: "2026-10-30"
sources:
  - title: "About branches · GitHub Docs"
    url: "https://docs.github.com/en/pull-requests/collaborating-with-pull-requests/proposing-changes-to-your-work-with-pull-requests/about-branches"
basis: "desk-research"
aiUsage: "drafted"
reviewed: "2026-11-01"
reviewedBy: "AI 初审（负责人授权）"
reviewNote: "AI 按定义、例子及参考资料初审；链接可访问，未逐项核验全部事实或实测产品。"
---

## 是什么

分支是从主线（通常是 main）分出来的一条独立修改线：提交到这个分支的改动不会自动进入主线，改完可以合并回去。

## 什么时候会遇到

做新功能、修 bug、写文档前，同学让你「开个分支」；PR 页面里显示来源分支和目标分支时。

## 和 AI 的关系

AI 能在分支上帮你改代码，但要先确认当前分支和工作区状态；未提交的改动不一定被分支隔离，切换时可能被带过去或阻止切换。

## 想深入再看

相关词条：仓库、合并、Pull Request。
