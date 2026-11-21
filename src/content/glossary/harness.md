---
term: "Harness"
en: "Agent Harness"
category: "agents"
aliases:
  - "Agent Harness"
  - "运行框架"
  - "执行控制层"
definition: "围绕大语言模型搭建的运行与控制机制，负责管理上下文、工具调用、权限校验和跨步骤状态延续。"
example: "同样接入 DeepSeek 模型，有的产品只能聊天，有的则依靠 Harness 接管文件读写、执行命令并在出错时重试。"
order: 8
related:
  - "ai-agent"
  - "tool-use"
  - "task-planning"
  - "agent-memory"
updated: "2026-11-21"
sources:
  - title: "Effective harnesses for long-running agents · Anthropic"
    url: "https://www.anthropic.com/engineering/effective-harnesses-for-long-running-agents"
  - title: "Harness engineering: leveraging Codex in an agent-first world · OpenAI"
    url: "https://openai.com/index/harness-engineering/"
basis: "desk-research"
aiUsage: "drafted"
contributors: ["A7m0spHere"]
reviewNote: "整理工程实践中的 Harness 概念，说明尚无统一中文译名与单一标准定义，待负责人复审。"
---

Harness 目前在中文 AI 社区尚未形成完全统一的固定译名，常被称作 Agent 运行框架或执行控制层。它指包裹在[大语言模型](/glossary/llm/)外围的一整套软件基础设施与控制逻辑，用来组织模型与外部环境之间的持续交互，使单纯输出文本的模型能够真正作为 [AI Agent](/glossary/ai-agent/) 稳定执行多步骤任务。

## 核心职责与常见构成

模型本身主要负责根据输入信息进行推理与决策，而将决策落地的脏活与控制工作则由 Harness 承担：

| 职责模块 | 核心作用 | 常见工程手段 |
| --- | --- | --- |
| **上下文与状态管理** | 跨轮次或跨会话保持进度与环境感知 | 裁剪和摘要[上下文窗口](/glossary/context-window/)、维护任务清单与进度文件 |
| **工具调度与执行** | 将模型输出解析为实际操作并回传结果 | 对接[工具调用](/glossary/tool-use/)、本地命令、浏览器或 [MCP](/glossary/mcp/) |
| **权限与安全约束** | 防止模型越权修改或破坏环境 | 结合[沙盒](/glossary/sandbox/)、目录白名单与高危操作人工确认 |
| **测试与反馈闭环** | 检验结果是否达到预期并触发纠偏 | 运行自动检查、端到端[验收](/glossary/acceptance/)或借助版本控制回溯 |

## 为什么同一个模型表现差异很大

在实际产品中，即便底层接入同一版本的语言模型，不同客户端或编程助手完成长任务的成功率往往相差明显。原因在于，模型只负责单步判断，而任务拆解节奏、错误信息是否准确回传、失败后如何重试、跨轮次如何保留[Agent 记忆](/glossary/agent-memory/)，都直接取决于外围 Harness 的设计质量。

## 概念边界

- **不等同于模型或提示词本身**：Harness 是确定性的工程系统与脚手架，用来约束和辅助具有概率随机性的语言模型。
- **尚属演进中的工程术语**：业界对 Harness 的边界划分仍在发展中，不同产品可能侧重编排循环、沙盒隔离或长期状态存储中的某几部分，目前并无唯一官方标准定义。
- **无法突破模型能力上限**：优秀的 Harness 能减少跑偏和上下文丢失，但不能凭空赋予底层模型它原本不具备的推理或知识能力。
