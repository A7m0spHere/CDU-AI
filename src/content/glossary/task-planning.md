---
term: "任务规划"
en: "Task Planning"
category: "agents"
aliases: ["Task Planning", "任务拆解", "规划"]
definition: "把大目标拆成可执行的小步骤，再按顺序推进或试错调整。"
example: "「做一份社团招新方案」会被拆成定目标、查往届资料、写流程、列预算、排版几步。"
youMaySay: "这么大的任务，它真的知道先做什么吗？"
scenario:
  title: "做社团招新方案"
  steps:
    - label: "生成计划"
      body: "Agent 先列：定目标、查往届资料、写流程、列预算、排版。"
      note: "计划可检查。"
    - label: "执行中调整"
      body: "发现往届资料缺失，改为访谈学长。"
      meta: "计划随反馈调整"
    - label: "阶段确认"
      body: "每完成一步向你汇报，再继续。"
quiz:
  - question: "任务规划中最应该警惕的是？"
    options:
      - text: "计划太短"
        correct: false
      - text: "目标模糊导致计划整体跑偏"
        correct: true
      - text: "步骤有编号"
        correct: false
    explain: "目标不清时，规划越细错得越远。"
agentPrompt: "请先把「办一场迎新分享会」拆成步骤清单，标注每步的产出和风险，等我确认后再执行。"
order: 3
related: ["ai-agent", "workflow"]
updated: "2026-10-26"
sources:
  - title: "Building effective agents · Anthropic"
    url: "https://www.anthropic.com/engineering/building-effective-agents"
basis: "desk-research"
aiUsage: "drafted"
reviewed: "2026-11-01"
reviewedBy: "AI 初审（负责人授权）"
reviewNote: "AI 按定义、例子及参考资料初审；链接可访问，未逐项核验全部事实或实测产品。"
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
