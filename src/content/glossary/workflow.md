---
term: "工作流"
en: "Workflow"
category: "agents"
aliases: ["Workflow", "流程编排", "自动化流程"]
definition: "把多个 AI 与工具步骤固定成流水线，按设定自动跑。"
example: "每周把课程群消息汇总成周报：抓取、总结、排版三步固定下来自动执行。"
order: 5
related: ["ai-agent", "task-planning"]
updated: "2026-10-26"
sources:
  - title: "Building effective agents · Anthropic"
    url: "https://www.anthropic.com/engineering/building-effective-agents"
basis: "desk-research"
aiUsage: "drafted"
---

## 一句话说清

工作流是把步骤和判断规则提前定好，让系统按流程自动执行；每一步可以调用模型或工具。

## 打个比方

像流水线：每个工位做什么是固定的，原料进去，成品出来。

## 它是怎么运作的

流程由人设计：先做什么、什么条件下走哪个分支、失败怎么处理。模型在其中承担理解与生成，不负责改流程。

## 你会碰到它的场景

- 定时汇总、自动分类、批量处理；
- 产品里的「自动化」「流程编排」；
- 与 Agent 的区别：流程固定 vs 自行决策。

## 常见误解

- 以为工作流等于 Agent：工作流按预设走，Agent 自己决定下一步；
- 以为搭好就一劳永逸：输入变化、接口变动都要维护；
- 以为出错会自己修：多数流程只会卡住或报错。

## 想再深入一点

重复、规则明确的任务优先用工作流；开放式任务才需要 Agent 的自主决策。
