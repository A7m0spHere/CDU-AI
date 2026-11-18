---
term: "多智能体"
en: "Multi-Agent"
category: "agents"
aliases:
  - "Multi-Agent"
  - "多 Agent"
  - "多代理"
definition: "由多个具备不同分工与上下文的智能体协同完成复杂任务的系统架构。"
example: "处理长篇调研任务时，系统可拆出协调者与多个并行检索子智能体各自查阅资料，再将汇总后的有效信息交由统一节点整合输出。"
order: 7
related:
  - "ai-agent"
  - "task-planning"
  - "workflow"
  - "context-window"
updated: "2026-11-18"
sources:
  - title: "How we built our multi-agent research system · Anthropic"
    url: "https://www.anthropic.com/engineering/multi-agent-research-system"
basis: "desk-research"
aiUsage: "drafted"
reviewNote: "按极简维基体例重构正文与结构，待负责人复审。"
---

在单一[AI Agent](/glossary/ai-agent/)处理步骤繁多或跨度较大的任务时，大量检索结果与中间过程会持续堆积在同一个[上下文窗口](/glossary/context-window/)中，容易导致关键信息被稀释或触发[截断](/glossary/truncation/)。多智能体架构通过将复杂目标拆解给多个各自拥有独立指令、工具权限与局部上下文的智能体，以分工协作提升复杂任务的完成质量。

## 常见协作模式

根据任务依赖关系与质量校验要求，多智能体系统通常采用不同的组织结构：

| 协作模式 | 运行机制 | 典型适用场景 |
| --- | --- | --- |
| **中心协调模式** | 主节点负责[任务规划](/glossary/task-planning/)与分发，子节点独立执行后仅回传提炼结论 | 多源信息检索、并行调研与方案探索 |
| **流水线接力模式** | 各智能体按固定顺序依次承担起草、加工或格式化等单一环节 | 环节清晰、格式要求明确的内容或代码生成 |
| **对抗与评审模式** | 执行节点与校验节点分离，由独立评审方依据规则排查缺陷并退回修改 | 代码审查、事实核验与高可靠性任务 |

## 上下文隔离与权限分工

- **隔离中间过程**：每个子智能体只保留完成自身子任务所需的探索记录（例如多次试错的检索过程或冗长日志），仅将整理后的结果交回主协调者，从而避免无关细节挤占全局容量。
- **差异化角色与工具边界**：不同节点可配置专属的[系统提示词](/glossary/system-prompt/)与[工具调用](/glossary/tool-use/)范围，例如只读检索节点不具备写入或删除权限，以此缩小单点失误的影响面。

## 开销与概念边界

- **计算开销放大**：多节点间的上下文传递与重复背景加载会显著增加 [Token](/glossary/token/) 消耗与端到端响应延迟；对于简单直白的单步任务，多智能体架构反而会带来不必要的协调成本。
- **错误级联风险**：若节点间缺乏明确的验收标准，上游智能体产生的[AI 幻觉](/glossary/hallucination/)或错误前提会被下游节点当作既定事实继续放大，单纯增加智能体数量并不会自动实现互相纠错。
- **与工作流的区别**：[工作流](/glossary/workflow/)通常由开发者预先固定执行路径与分支条件，而多智能体系统允许节点在运行过程中依据中间结果动态调整分工与路由。
