---
term: "少样本示例"
en: "Few-shot Prompting"
category: "prompt"
aliases:
  - "Few-shot"
  - "少样本"
  - "示例提示"
definition: "在提示词中提供少量输入与输出示范，引导模型按特定格式、口径或规律完成同类任务的提示方式。"
example: "在整理会议纪要时，先附上两条「原始记录→摘要条目」的对照示例，再要求模型按相同字段与语气处理其余文本。"
order: 3
related:
  - "prompt"
  - "output-format"
  - "prompt-template"
updated: "2026-11-18"
sources:
  - title: "Use examples (multishot prompting) · Anthropic"
    url: "https://platform.claude.com/docs/en/build-with-claude/prompt-engineering/multishot-prompting"
  - title: "Prompt engineering（Few-shot prompting）· Hugging Face"
    url: "https://huggingface.co/docs/transformers/main/tasks/prompting"
basis: "desk-research"
aiUsage: "drafted"
reviewNote: "按极简维基体例重构正文与结构，待负责人复审。"
---

在向[大语言模型](/glossary/llm/)发出指令时，除直接描述任务规则外，还可在[提示词](/glossary/prompt/)中嵌入若干完整样例，使模型通过上下文学习（In-context Learning）归纳目标风格、字段顺序与判断尺度，无需额外执行[微调](/glossary/fine-tuning/)即可适配具体任务。

## 提示范式与示例数量

按提示词中附带示范样例的数量，常见做法可分为三类：

| 提示方式 | 样例数量 | 适用场景与特点 |
| --- | --- | --- |
| **零样本**（Zero-shot） | 0 个 | 依赖指令文字直接作答，适合常见且规则明确的任务 |
| **单样本**（One-shot） | 1 个 | 给出单一参考标准，用于快速校准基本格式或语气 |
| **少样本**（Few-shot） | 2 至数个 | 展示多组边界或变体，适合分类口径、结构化抽取与风格迁移 |

## 设计原则与效果影响

少样本示例的作用在于消除规则描述中的歧义，其效果取决于样例本身的设计质量：

- **覆盖典型与边界情况**：仅展示单一类型的样例容易导致模型机械套用，包含不同类别或常见特例更有助于泛化。
- **保持格式与口径一致**：所有样例的分隔符、字段命名及[输出格式](/glossary/output-format/)应保持统一，避免示范内部互相矛盾。
- **结合文字约束使用**：示例适合传递隐性风格，硬性规则与禁止事项仍需配合明确的文字说明。

## 局限与概念边界

- **示例错误会放大偏差**：模型会直接模仿示范中的逻辑或格式漏洞，错误样例会直接污染后续输出。
- **占用上下文并增加成本**：每增加一组样例都会消耗更多 [Token](/glossary/token/) 并占用[上下文窗口](/glossary/context-window/)，并非越多越好。
- **不改变模型底层能力**：少样本示例仅在单次请求内引导生成方向，不会修改模型参数，也不等同于长期记忆或事实校验。
