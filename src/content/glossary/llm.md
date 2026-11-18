---
term: "大语言模型"
en: "Large Language Model"
category: "basics"
aliases:
  - "LLM"
  - "大模型"
  - "语言模型"
definition: "基于海量语料训练、具备大规模参数，并通过概率预测生成与理解自然语言的深度学习模型。"
example: "在输入一段需求描述后，模型根据前文语境依次预测后续词元，连续生成结构完整的分析报告或程序代码。"
order: 2
related:
  - "token"
  - "training-data"
  - "context-window"
  - "hallucination"
updated: "2026-11-18"
sources:
  - title: "A Survey of Large Language Models (arXiv:2303.18223)"
    url: "https://arxiv.org/abs/2303.18223"
basis: "desk-research"
aiUsage: "drafted"
reviewNote: "按极简维基体例重构正文与结构，待负责人复审。"
---

大语言模型（LLM）是当前[对话助手](/glossary/chatbot/)与各类智能应用的核心计算引擎。它通过自回归方式逐个预测文本序列中的下一个 [Token](/glossary/token/)，将长篇回答拆解为连续的概率接龙过程，从而支撑问答、摘要、翻译及[代码生成](/glossary/code-generation/)等通用任务。

## 核心工作机制

- **预训练与规律习得**：模型在海量的[训练数据](/glossary/training-data/)上执行下一词预测等自监督任务，将语法结构、常识知识与推理模式压缩进神经网络参数中。
- **对齐与指令遵循**：经由有监督[微调](/glossary/fine-tuning/)与偏好对齐后，模型学会理解[提示词](/glossary/prompt/)意图，按人类期望的格式与安全边界组织输出。
- **上下文条件生成**：推理阶段，模型读取[上下文窗口](/glossary/context-window/)内的全部输入与历史消息，结合[温度](/glossary/temperature/)等采样参数逐步输出后续词元。

## 模型与产品层的分工

| 层级 | 核心职责 | 典型表现 |
| --- | --- | --- |
| **基础模型** | 提供语言理解、模式推理与基础生成能力 | 决定知识边界、多语言水平与原生推理上限 |
| **系统提示与模板** | 设定角色、输出格式与交互规则 | 通过[系统提示词](/glossary/system-prompt/)规范同一模型在不同场景的表达方式 |
| **外部工具与工作流** | 补充实时信息、执行计算或操作外部系统 | 接入[AI 搜索](/glossary/ai-search/)与[工具调用](/glossary/tool-use/)突破纯文本生成限制 |

## 演进方向与局限

- **多模态与智能体扩展**：现代大模型正从纯文本向融合图像、音频的[多模态](/glossary/multimodal/)演进，并作为推理核心驱动具备自主规划能力的 [AI Agent](/glossary/ai-agent/)。
- **固有限制**：纯模型本身不具备实时记忆与联网能力，受限于[知识截止](/glossary/knowledge-cutoff/)时间，且在缺乏可靠依据时仍可能产生[AI 幻觉](/glossary/hallucination/)。

## 概念边界

- **不等同于对话应用**：模型是底层计算引擎，用户日常使用的网页或客户端产品则是在模型之上叠加了界面、检索与安全过滤的完整系统。
- **参数规模不直接决定一切**：更大的参数量通常带来更强的表达容量，但实际表现同样高度依赖语料质量、对齐策略以及[开源模型](/glossary/open-source-model/)或闭源服务的工程优化。
