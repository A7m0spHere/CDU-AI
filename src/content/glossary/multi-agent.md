---
term: "多智能体"
en: "Multi-Agent"
category: "agents"
aliases: ["Multi-Agent", "多 Agent", "多代理"]
definition: "多个各有分工的 Agent 协作完成同一个任务。"
example: "一个负责查资料、一个负责写作、一个负责检查，最后汇总成一份报告。"
youMaySay: "多个 AI 一起上，是不是就更靠谱？"
scenario:
  title: "分工写调研报告"
  steps:
    - label: "分配角色"
      body: "一个查资料、一个写作、一个审查。"
      note: "分工边界要清楚。"
    - label: "发现问题"
      body: "写作 Agent 引用了查资料 Agent 编的数据。"
      meta: "错误会被传递"
    - label: "加审查规则"
      body: "要求每条结论附来源，审查者逐条核对。"
quiz:
  - question: "多智能体系统最容易出现的问题？"
    options:
      - text: "Agent 数量不够"
        correct: false
      - text: "错误在 Agent 之间传递放大"
        correct: true
      - text: "无法使用工具"
        correct: false
    explain: "多 Agent 会放大错误，不会自动纠错。"
agentPrompt: "请把任务拆给三个角色：资料、写作、审查；每条结论必须带来源，审查角色逐条核对后再汇总。"
order: 7
related: ["ai-agent", "workflow"]
updated: "2026-10-26"
sources:
  - title: "How we built our multi-agent research system · Anthropic"
    url: "https://www.anthropic.com/engineering/multi-agent-research-system"
basis: "desk-research"
aiUsage: "drafted"
---

## 一句话说清

多智能体是让多个 Agent 分工协作：有的规划、有的执行、有的审查，最后合并结果。

## 打个比方

像小组作业：分工明确效率高，但沟通成本和互相甩锅也会增加。

## 它是怎么运作的

由一个协调者分配任务，各 Agent 独立执行并把结果交回；也可能互相传递消息。最终质量取决于分工与汇总规则。

## 你会碰到它的场景

- 复杂研究报告、代码审查流程；
- 产品宣传「多 Agent 协作」；
- 一个任务里出现多个角色。

## 常见误解

- 以为 Agent 越多越强：错误也会被放大和传播；
- 以为会自动互相纠错：没有明确审查规则时，错误照样通过；
- 以为等于工作流：多智能体仍有自主决策成分。

## 想再深入一点

多 Agent 系统的关键是任务边界清晰、结果可验证，而不是堆数量。
