---
term: "Issue（议题）"
en: "Issue"
category: "git"
aliases: ["Issue", "议题", "问题单"]
definition: "在仓库里记录问题、建议或任务，便于讨论和跟踪。"
example: "发现文档里的链接失效，开一个 Issue 说明页面和现象，维护者跟进处理。"
youMaySay: "有问题直接在群里说不行吗？"
scenario:
  title: "报告一个文档错误"
  steps:
    - label: "开 Issue"
      body: "写清页面地址、原文和问题现象。"
      note: "信息越具体，越容易被处理。"
    - label: "讨论"
      body: "维护者在 Issue 下追问、补充信息、分工处理。"
    - label: "关闭"
      body: "修复后关联对应提交，再把 Issue 关闭。"
quiz:
  - question: "Issue 最适合用来做什么？"
    options:
      - text: "存放大文件"
        correct: false
      - text: "记录和跟踪问题、建议与任务"
        correct: true
      - text: "替代代码仓库"
        correct: false
    explain: "Issue 是问题与任务的跟踪入口，不是文件存储。"
agentPrompt: "请帮我把这个文档问题整理成一条 Issue：标题、现象、页面地址、复现步骤和期望结果。"
order: 7
related: ["pull-request", "fork"]
updated: "2026-10-26"
sources:
  - title: "About issues · GitHub Docs"
    url: "https://docs.github.com/en/issues/tracking-your-work-with-issues/learning-about-issues/about-issues"
basis: "desk-research"
aiUsage: "drafted"
reviewed: "2026-11-01"
reviewedBy: "AI 初审（负责人授权）"
reviewNote: "AI 按定义、例子及参考资料初审；链接可访问，未逐项核验全部事实或实测产品。"
---

## 是什么

Issue 是仓库里的问题单：可以报告 bug、提建议、记录待办，每条有编号、状态和讨论记录。

## 什么时候会遇到

发现文档错误、想建议收录某个工具、或者维护者让你「开个 issue 描述一下」时。

## 和 AI 的关系

AI 能帮你把零散描述整理成结构清楚的 Issue，但现象、页面地址和复现步骤必须真实，不能编。

## 想深入再看

相关词条：Pull Request、Fork。
