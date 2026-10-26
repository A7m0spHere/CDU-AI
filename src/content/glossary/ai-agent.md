---
term: "AI Agent"
en: "AI Agent"
category: "agents"
aliases: ["智能体", "AI 智能体", "Agent"]
definition: "能自己拆任务、调工具、多步执行，直到完成目标的 AI 系统。"
example: "让它「查下周三天气并写进班级通知」，它会自己搜索、整理、起草，而不是只回一段话。"
order: 1
related: ["tool-use", "task-planning"]
updated: "2026-10-26"
sources:
  - title: "Building effective agents · Anthropic"
    url: "https://www.anthropic.com/engineering/building-effective-agents"
basis: "desk-research"
aiUsage: "drafted"
---

## 一句话说清

AI Agent 是把模型、工具和执行流程组合起来的系统：你给目标，它自己决定步骤、调用工具、检查结果。

## 打个比方

像实习生：你交代目标，他自己查资料、跑腿、写初稿，做完向你汇报。

## 它是怎么运作的

模型负责判断下一步做什么，程序负责真正执行（搜索、读文件、发请求），结果再回到模型继续判断，循环直到完成或放弃。

## 你会碰到它的场景

- 自动整理资料、生成报告；
- 编程助手自动改多个文件、跑测试；
- 客服、运维等自动化流程。

## 常见误解

- 以为 Agent 一定比聊天强：多步执行放大了出错概率；
- 以为可以完全放手：重要操作要人确认；
- 以为它能自己装工具：工具由平台提供并授权。

## 想再深入一点

Agent 的能力边界取决于工具权限与流程设计，不只看模型。
