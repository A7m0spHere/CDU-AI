---
term: "任务规划"
en: "Task Planning"
category: "agents"
aliases: ["Task Planning", "任务拆解", "规划"]
definition: "把大目标拆成可执行的小步骤，再按顺序推进或试错调整。"
example: "「做一份社团招新方案」会被拆成定目标、查往届资料、写流程、列预算、排版几步。"
order: 3
related: ["ai-agent", "workflow"]
updated: "2026-10-26"
sources:
  - title: "Building effective agents · Anthropic"
    url: "https://www.anthropic.com/engineering/building-effective-agents"
basis: "desk-research"
aiUsage: "drafted"
---

## 一句话说清

任务规划是 Agent 先想清楚「分几步做」，再逐步执行；中途发现不对，就调整计划。

## 打个比方

像出门旅行先列行程：先订票、再订房、再安排景点，顺序错了会返工。

## 它是怎么运作的

模型根据目标生成步骤清单，每步调用相应工具；执行后根据结果决定继续、重试还是改计划。

## 你会碰到它的场景

- 复杂的多文件任务；
- 需要先查资料再写作的流程；
- 计划里出现「第一步……第二步……」。

## 常见误解

- 以为计划越细越好：太细容易卡死，关键是可执行；
- 以为规划一次就定：好计划是边走边调的；
- 以为有规划就不会跑偏：目标模糊时，计划也会歪。

## 想再深入一点

规划能力与长上下文、工具反馈质量强相关，复杂任务常配合人工检查点。
