---
term: "Agent 记忆"
en: "Agent Memory"
category: "agents"
aliases: ["Memory", "记忆", "长期记忆"]
definition: "让 Agent 跨轮次记住你的偏好、目标和已完成的事。"
example: "连续几天让 AI 帮忙记社团待办，它记得你上周定下的截止日期和负责人。"
youMaySay: "它怎么记得我上次说过什么？"
scenario:
  title: "跨天跟进待办"
  steps:
    - label: "第一次交代"
      body: "告诉助手周五前收集报名表。"
      note: "关键信息被摘要保存。"
    - label: "隔天追问"
      body: "它记得截止时间和负责人。"
      meta: "记忆跨会话"
    - label: "发现记错"
      body: "把错误信息纠正并让它更新记忆。"
quiz:
  - question: "Agent 记忆最常见的风险是？"
    options:
      - text: "完全无法保存信息"
        correct: false
      - text: "记住过时或错误的信息"
        correct: true
      - text: "只能记住文字不能记住图片"
        correct: false
    explain: "记忆会过时、记混，需要定期核对。"
agentPrompt: "请记住以下项目约定：每周五汇总报名表、负责人是小林、截止前一天提醒；之后每次回答都按这个约定。"
order: 4
related: ["ai-agent", "context-window"]
updated: "2026-10-26"
sources:
  - title: "Effective context engineering for AI agents · Anthropic"
    url: "https://www.anthropic.com/engineering/effective-context-engineering-for-ai-agents"
basis: "desk-research"
aiUsage: "drafted"
---

## 一句话说清

Agent 记忆是让系统在多轮、多次任务之间保留信息：偏好、约定、进度。它可以是上下文里的摘要，也可以是外部存储。

## 打个比方

像助理的笔记本：不是全记住，而是记下关键约定，下次接着用。

## 它是怎么运作的

常见做法是把重要信息摘要后存起来，需要时再取回放进上下文；窗口有限，所以必须筛选。

## 你会碰到它的场景

- 跨会话的助手记住你的写作偏好；
- 编程 Agent 记住项目约定；
- 产品里的「记忆」开关。

## 常见误解

- 以为记忆等于永久正确：可能记错、过时；
- 以为记忆越多越好：无关记忆会干扰判断；
- 以为所有产品都有记忆：很多只是当前会话有效。

## 想再深入一点

记忆和上下文窗口是两件事：窗口是这一次能看多少，记忆是跨次保留什么。
