---
term: "输出格式"
en: "Output Format"
category: "prompt"
aliases:
  - "Output Format"
  - "结构化输出"
  - "格式约束"
definition: "在指令中预先约定模型回复的组织结构、标记语法或数据格式，以提升结果可读性与可解析性的约束方法。"
example: "提取多份产品参数时，要求模型严格按「型号｜价格｜续航」三列表格输出，并将缺失项统一标注为「未提供」。"
order: 6
related:
  - "prompt"
  - "few-shot"
  - "api"
updated: "2026-11-18"
sources:
  - title: "Prompt engineering overview · Anthropic"
    url: "https://platform.claude.com/docs/en/build-with-claude/prompt-engineering/overview"
  - title: "Structured outputs · Anthropic"
    url: "https://platform.claude.com/docs/en/build-with-claude/structured-outputs"
basis: "desk-research"
aiUsage: "drafted"
reviewNote: "按极简维基体例重构正文与结构，待负责人复审。"
---

未加约束时，[大语言模型](/glossary/llm/)往往倾向于返回整段自然语言叙述。通过在[提示词](/glossary/prompt/)中指定结构规范，可将回答约束为清单、表格、特定标记语言或机器可读的数据交换格式，减少人工二次整理或程序解析的成本。

## 常见格式类型

| 格式类型 | 典型形态 | 主要适用场景 |
| --- | --- | --- |
| **排版结构类** | 分点清单、Markdown 表格、固定章节标题 | 信息对比、摘要整理与直接阅读展示 |
| **数据交换类** | JSON、XML、YAML、CSV | 接入 [API](/glossary/api/)、批量提取字段与下游程序处理 |
| **长度与风格类** | 字数上限、禁用客套话、仅输出结论 | 摘要卡片、标题生成与嵌入式界面展示 |

## 实现方式与稳定性提升

不同任务对格式严格程度的要求不同，常用控制手段包括：

- **自然语言与示例约束**：在指令中列出必需字段名、数据类型及缺失值占位规则，复杂结构可搭配[少样本示例](/glossary/few-shot/)演示期望样式。
- **产品级结构化输出**：在开发场景中，许多模型接口提供专门的 JSON 模式或 Schema 约束机制，通过解码阶段限制确保输出符合预定语法结构。

## 局限与概念边界

- **结构合规不等于内容准确**：格式整齐的表格或合法 JSON 同样可能填入错误数值或编造字段内容，仍需校验 [AI 幻觉](/glossary/hallucination/)与关键事实。
- **过度约束可能挤占推理空间**：过早强制要求仅输出简短结果，有时会限制模型展开分析；复杂任务常需先允许思考过程，再按格式提取最终结论。
- **纯提示词约束存在破损风险**：仅靠文字要求生成 JSON 时，模型仍可能附带额外说明文字或遗漏标点，接入程序前应配合语法校验。
