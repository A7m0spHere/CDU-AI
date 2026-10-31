---
term: "AI Agent"
en: "AI Agent"
category: "agents"
aliases: ["智能体", "AI 智能体", "Agent"]
definition: "能围绕目标决定部分步骤，并在授权范围内调用工具、执行和检查任务的 AI 系统；任务也可能失败、暂停或需要人确认。"
example: "让它「查下周三天气并写进班级通知」，它会自己搜索、整理、起草，而不是只回一段话。"
youMaySay: "它说「我来处理」，到底会自己做什么？"
scenario:
  title: "让 Agent 查天气写通知"
  steps:
    - label: "下达目标"
      body: "要求「查下周三天气并写进班级通知」。"
      note: "目标包含多个步骤。"
    - label: "自动执行"
      body: "它先搜索天气，再起草通知。"
      meta: "多步调用工具"
    - label: "人工确认"
      body: "发布前你核对天气来源与措辞。"
quiz:
  - question: "AI Agent 与普通聊天最主要的区别是？"
    options:
      - text: "回答更长"
        correct: false
      - text: "能自己拆步骤并调用工具执行"
        correct: true
      - text: "不需要模型"
        correct: false
    explain: "Agent 的核心是多步执行与工具调用。"
agentPrompt: "请把「整理本周社团待办」拆成可执行步骤，逐步完成，并在发布任何内容前等我确认。"
order: 1
related: ["tool-use", "task-planning"]
updated: "2026-11-01"
sources:
  - title: "Building effective agents · Anthropic"
    url: "https://www.anthropic.com/research/building-effective-agents"
basis: "desk-research"
aiUsage: "drafted"
reviewed: "2026-11-01"
reviewedBy: "A7m"
reviewNote: "负责人确认修改定义并保留其余内容；未实测具体产品。"
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
