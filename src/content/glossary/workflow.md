---
term: "工作流"
en: "Workflow"
category: "agents"
aliases: ["Workflow", "流程编排", "自动化流程"]
definition: "把任务拆成步骤，并按预先设计的规则组织执行；步骤中可以调用 AI、工具或由人参与。"
example: "每周把课程群消息汇总成周报：抓取、总结、排版三步固定下来自动执行。"
youMaySay: "这个每周都要做的事，能不能自动跑？"
scenario:
  title: "自动汇总周报"
  steps:
    - label: "设计流程"
      body: "抓取群消息、总结、排版三步固定。"
      note: "规则明确才适合自动化。"
    - label: "定时执行"
      body: "每周五自动运行，产出草稿。"
      meta: "按预设走"
    - label: "处理异常"
      body: "接口变动导致失败，流程卡住并报警。"
quiz:
  - question: "工作流和 Agent 的关键区别是？"
    options:
      - text: "工作流不需要模型"
        correct: false
      - text: "工作流通常按预先设计的规则编排；Agent 通常有更大的空间决定后续行动"
        correct: true
      - text: "Agent 不能调用工具"
        correct: false
    explain: "工作流可以有条件分支和模型判断；Agent 通常有更大的行动决策空间，两者也可以结合。"
agentPrompt: "请把「每周汇总课程群消息」设计成一个固定工作流，列出步骤、输入输出和失败时的处理方式。"
order: 5
related: ["ai-agent", "task-planning"]
updated: "2026-10-31"
sources:
  - title: "Building effective agents · Anthropic"
    url: "https://www.anthropic.com/engineering/building-effective-agents"
basis: "desk-research"
aiUsage: "drafted"
reviewed: "2026-10-31"
reviewedBy: "A7m"
reviewNote: "AI 辅助审核后负责人确认；未逐一核验全部来源。"
---

## 一句话说清

工作流是把步骤和判断规则提前定好，让系统按流程自动执行；每一步可以调用模型或工具。

## 打个比方

像流水线：每个工位做什么是固定的，原料进去，成品出来。

## 它是怎么运作的

整体流程和允许的路径由人预先设计；其中可以有条件分支、模型判断、工具调用或人工确认。

## 你会碰到它的场景

- 定时汇总、自动分类、批量处理；
- 产品里的「自动化」「流程编排」；
- 与 Agent 的区别：预先设计规则与更灵活地决定后续行动。

## 常见误解

- 以为工作流等于 Agent：工作流通常按预设规则编排，Agent 通常有更大的空间决定下一步，两者也可以结合；
- 以为搭好就一劳永逸：输入变化、接口变动都要维护；
- 以为出错会自己修：多数流程只会卡住或报错。

## 想再深入一点

重复、规则明确的任务可以优先考虑工作流；开放式任务可以考虑 Agent，也要结合成本、风险与可控性选择。
