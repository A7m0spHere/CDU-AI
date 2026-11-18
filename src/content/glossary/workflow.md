---
term: "工作流"
en: "Workflow"
category: "agents"
aliases:
  - "Workflow"
  - "流程编排"
  - "自动化流程"
definition: "按预先设计的步骤顺序、分支条件与数据流向编排任务，并在节点中接入 AI 模型、工具或人工确认的流程。"
example: "每天定时抓取新提交的用户反馈，经模型自动分类与摘要后写入表格，再将高优先级条目推送给相关负责人复核。"
order: 5
related:
  - "ai-agent"
  - "task-planning"
  - "tool-use"
  - "no-code-low-code"
updated: "2026-11-18"
sources:
  - title: "Building effective agents · Anthropic"
    url: "https://www.anthropic.com/engineering/building-effective-agents"
basis: "desk-research"
aiUsage: "drafted"
reviewNote: "按极简维基体例重构正文与结构，待负责人复审。"
---

在将[大语言模型](/glossary/llm/)接入实际业务时，直接用单次提问往往难以保证稳定性。**工作流**（Workflow）将复杂任务拆分为预先定义好的节点与流转规则，把模型的概率生成能力封装在可控的确定性流程之中。

## 常见编排模式与节点类型

工作流通常由输入触发器、规则判断逻辑、模型节点、[工具调用](/glossary/tool-use/)节点以及人工确认节点组合而成，常见组织模式包括：

| 编排模式 | 结构特点 | 典型适用场景 |
| --- | --- | --- |
| **顺序链式** | 前一节点输出经校验后作为下一节点输入 | 多步文本改写、抽取与格式转换 |
| **条件路由** | 先对输入分类，再分发至不同处理支路 | 客服分流、不同难度请求匹配不同模型 |
| **并行汇总** | 多个子任务同时执行，最后合并结果 | 多文档并行摘要、多视角交叉核验 |
| **评估优化** | 生成节点与检查节点构成有限循环直至达标 | 严格遵循[输出格式](/glossary/output-format/)或质量标准的生成 |

模型节点通常会结合[提示词模板](/glossary/prompt-template/)注入变量，以保证批量执行时指令结构一致。

## 与 AI Agent 及编排工具的关系

- **与 AI Agent 的区别**：工作流的控制流主要由人在开发期预设，何时分支、调用何种工具均有明确规则；[AI Agent](/glossary/ai-agent/)则将部分[任务规划](/glossary/task-planning/)权交给模型，在运行期动态决定下一步动作。两者并非对立，复杂系统常以工作流搭建主干，在特定开放环节嵌入 Agent 节点。
- **低代码与代码实现**：许多[无代码/低代码](/glossary/no-code-low-code/)平台提供可视化画布，允许通过拖拽节点串联模型与外部[API](/glossary/api/)；工程团队也可直接用代码编写同等逻辑以便纳入版本管理与测试。

## 适用边界与维护要求

- **适合规则相对稳定的任务**：若任务路径高度开放、无法预先穷举分支，强行编写庞大流程图反而会变得脆弱且难以维护。
- **不能免除持续维护**：上游输入分布变化、模型升级或外部接口改动都可能导致下游节点异常，仍需配合日志监控与[调试](/glossary/debugging/)。
- **控制成本与延迟**：节点过多会累积等待时间与[Token](/glossary/token/)消耗；能够用常规规则或脚本直接处理的逻辑，通常无需交由模型节点执行。
