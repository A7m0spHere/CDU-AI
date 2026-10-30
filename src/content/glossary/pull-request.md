---
term: "Pull Request"
en: "Pull Request"
category: "git"
aliases: ["PR", "拉取请求", "合并请求"]
definition: "请求把某个分支的改动合并进目标分支，附说明供人审阅。"
example: "改完文档后发起 PR，维护者在页面上看差异、留评论、决定是否合并。"
youMaySay: "PR 和直接提交有什么区别？"
scenario:
  title: "提交一次文档修改"
  steps:
    - label: "发起 PR"
      body: "选择来源分支与目标分支，写清改了什么、为什么改。"
      note: "一个 PR 只做一件事，便于审阅。"
    - label: "等待审阅"
      body: "维护者看差异、提问题，自动检查同时运行。"
      meta: "审阅 + 自动检查"
    - label: "合并或修改"
      body: "按意见修改后合并，或关闭这个 PR。"
quiz:
  - question: "Pull Request 的核心作用是？"
    options:
      - text: "自动写好代码"
        correct: false
      - text: "在合并前让人审阅并讨论改动"
        correct: true
      - text: "备份仓库"
        correct: false
    explain: "PR 是审阅与讨论的入口，合并与否由维护者决定。"
agentPrompt: "请按模板帮我写这个 PR 的说明：改了什么、为什么改、怎么验证、还有哪些不确定的地方。"
order: 6
related: ["fork", "merge", "issue"]
updated: "2026-10-26"
sources:
  - title: "About pull requests · GitHub Docs"
    url: "https://docs.github.com/en/pull-requests/collaborating-with-pull-requests/proposing-changes-to-your-work-with-pull-requests/about-pull-requests"
basis: "desk-research"
aiUsage: "drafted"
---

## 是什么

Pull Request（PR）是「请求把我的改动合进目标分支」：页面上能看到具体差异、讨论记录和检查结果，由维护者决定是否合并。

## 什么时候会遇到

向开源项目贡献、团队协作改同一份仓库、课程项目要求「提 PR」而不是直接交文件时。

## 和 AI 的关系

AI 能帮你整理改动说明、回应审阅意见，但 PR 里的事实陈述与验证结果要你自己确认，不能代签。

## 想深入再看

相关词条：Fork、合并、Issue。
