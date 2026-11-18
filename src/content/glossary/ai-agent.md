---
term: "AI Agent"
en: "AI Agent"
category: "agents"
aliases:
  - "智能体"
  - "AI 智能体"
  - "Agent"
definition: "以大语言模型为决策核心，能够在授权范围内自主规划步骤、调用工具并依据反馈推进目标的 AI 系统。"
example: "收到「整理近一周项目动态并生成周报」的指令后，系统自主检索文档、汇总要点并输出成稿，仅在发送前请求人工确认。"
order: 1
related:
  - "tool-use"
  - "task-planning"
  - "agent-memory"
  - "workflow"
updated: "2026-11-18"
sources:
  - title: "Building effective agents · Anthropic"
    url: "https://www.anthropic.com/research/building-effective-agents"
basis: "desk-research"
aiUsage: "drafted"
reviewNote: "按极简维基体例重构正文与结构，待负责人复审。"
---

不同于单轮问答的[对话助手](/glossary/chatbot/)，AI Agent 将[大语言模型](/glossary/llm/)与外部执行环境结合，围绕给定目标持续感知环境、判断下一步行动并消化执行结果，直到任务完成、超出步数上限或交由人工接管。

## 核心构成与运行循环

一个典型的 AI Agent 通常由决策核心与外围运行框架共同组成，并在「推理—行动—观察」的循环中推进任务：

| 构成部分 | 主要职责 | 说明 |
| --- | --- | --- |
| **决策核心** | 理解目标、评估状态并决定下一步操作 | 通常由具备推理能力的语言模型担任 |
| **规划机制** | 拆解复杂目标并动态调整执行路径 | 对应[任务规划](/glossary/task-planning/)能力 |
| **工具接口** | 读取信息、修改文件或调用外部服务 | 依赖[工具调用](/glossary/tool-use/)与协议接入 |
| **状态与记忆** | 保留当前上下文及跨轮次的偏好或经验 | 结合上下文与[Agent 记忆](/glossary/agent-memory/)实现 |

每轮循环中，模型根据当前上下文输出思考结论或工具指令，由宿主程序执行并返回真实结果；模型据此修正判断，而非在首次生成时就一次性写完所有答案。

## 与工作流及多智能体的关系

- **与工作流的区别**：[工作流](/glossary/workflow/)通常由开发者预先规定节点顺序与分支条件，路径可控；AI Agent 则由模型在运行期自主决定调用哪些步骤，更适合路径难以穷举的开放式任务。实际系统中，两者常混合使用。
- **向多智能体延伸**：当单一 Agent 面临职责过多或上下文过载时，系统可将检索、编码、审查等职能拆分为多个协同角色，构成[多智能体](/glossary/multi-agent/)架构。在软件工程场景中，现代[AI 编程助手](/glossary/coding-assistant/)已广泛采用 Agent 模式自动读写文件并运行测试。

## 自主边界与典型风险

- **权限来自宿主授权**：Agent 并不能自行获取或安装工具，其可执行范围严格受限于运行环境开放的接口与沙箱权限。
- **错误会随步骤放大**：单步推理偏差、[AI 幻觉](/glossary/hallucination/)或外部工具异常可能沿执行链条累积，同时推高[Token](/glossary/token/)消耗与耗时。
- **高风险操作需人工确认**：面对覆盖数据、发送外部消息或[提示词注入](/glossary/prompt-injection/)等安全风险，生产环境通常在关键节点设置人工审批。
