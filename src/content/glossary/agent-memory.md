---
term: "Agent 记忆"
en: "Agent Memory"
category: "agents"
aliases: ["Memory", "记忆", "长期记忆"]
definition: "让 Agent 跨轮次记住你的偏好、目标和已完成的事。"
example: "连续几天让 AI 帮忙记社团待办，它记得你上周定下的截止日期和负责人。"
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
