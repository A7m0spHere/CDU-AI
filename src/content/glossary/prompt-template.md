---
term: "提示词模板"
en: "Prompt Template"
category: "prompt"
aliases:
  - "Prompt Template"
  - "提示词框架"
  - "模板"
definition: "将提示词中的固定指令结构与可变输入槽位分离，以便在不同数据或任务中重复使用的标准化框架。"
example: "编写周报整理模板时，将受众、字数和分点格式固定为骨架，每次仅替换占位符中的原始工作记录即可生成报告。"
order: 7
related:
  - "prompt"
  - "few-shot"
  - "output-format"
updated: "2026-11-18"
sources:
  - title: "Prompt library · Anthropic"
    url: "https://platform.claude.com/docs/en/resources/prompt-library/library"
basis: "desk-research"
aiUsage: "drafted"
reviewNote: "按极简维基体例重构正文与结构，待负责人复审。"
---

在高频重复使用 AI 处理同类任务时，每次重新编写完整指令容易遗漏关键约束并导致结果波动。提示词模板通过抽取[提示词](/glossary/prompt/)中的共性规则作为固定骨架，将具体文本、参数或背景材料留作可替换变量，从而保证输出稳定性并提升复用效率。

## 基本构成

一个完整的提示词模板通常将静态约束与动态变量区分开来：

- **固定骨架部分**：预先写明的任务目标、[角色设定](/glossary/role-prompting/)、推理要求与[输出格式](/glossary/output-format/)规范，决定每次输出的基线标准。
- **动态占位符**：使用 `{{文本}}`、`<输入>` 等标记划定的待填充区域，在执行时填入当次需要处理的具体材料、目标受众或参数条件。
- **内置示范样例**：面向复杂格式或特定判断口径的模板，常在骨架中预置少量[少样本示例](/glossary/few-shot/)作为参照。

## 常见应用场景

- **个人与团队文档复用**：用于会议纪要整理、文献摘要、固定格式通告撰写等周期性工作，避免多人协作时风格不一。
- **系统提示与工作流集成**：在构建[系统提示词](/glossary/system-prompt/)或自动化[工作流](/glossary/workflow/)时，程序可将用户输入自动填入模板变量后再发送给模型处理。

## 局限与概念边界

- **不具备永久通用性**：更换底层[大语言模型](/glossary/llm/)版本或调整业务目标后，原有模板的措辞和约束强度往往需要重新测试与调优。
- **规则过载会分散注意力**：在模板中堆砌过多细碎禁止项，反而可能稀释核心任务要求，并增加不必要的 [Token](/glossary/token/) 消耗。
- **不能替代人工校验**：模板主要保障流程规范与格式统一，无法自动判断输入材料的质量，也无法确保每次生成结果完全正确。
