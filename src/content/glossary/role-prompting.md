---
term: "角色设定"
en: "Role Prompting"
category: "prompt"
aliases:
  - "Role Prompting"
  - "角色扮演"
  - "人设"
definition: "在提示词中为模型指定特定身份、视角或受众对象，以调整回答口吻与表达方式的提示技巧。"
example: "将一份技术故障说明改写为面向普通用户的公告时，要求模型以「耐心的一线客服」身份重新组织措辞。"
order: 5
related:
  - "prompt"
  - "system-prompt"
  - "prompt-template"
updated: "2026-11-18"
sources:
  - title: "Giving Claude a role with a system prompt · Anthropic"
    url: "https://platform.claude.com/docs/en/build-with-claude/prompt-engineering/system-prompts"
basis: "desk-research"
aiUsage: "drafted"
reviewNote: "按极简维基体例重构正文与结构，待负责人复审。"
---

通过在[提示词](/glossary/prompt/)中明确「你是谁」或「面向谁回答」，模型会相应调整词库选择、句式风格、详略程度与论证立场。这一做法常用于对齐阅读门槛、模拟对话情景或统一文本基调。

## 作用机制与设定维度

角色描述作为上下文条件进入模型后，会引导[大语言模型](/glossary/llm/)从训练分布中激活与该身份相匹配的表达模式。完整的角色设定通常包含三个维度：

- **身份与专业背景**：规定回答者的立场与知识表达口径，例如技术审稿人、编辑或法律条款解读助手。
- **目标受众特征**：明确信息接收方的背景水平，如初学者、跨部门协作者或未成年人，从而控制术语密度。
- **语气与互动方式**：约束语言风格为严谨客观、简明直接或启发式提问。

## 写入位置与生效范围

角色设定可置于[系统提示词](/glossary/system-prompt/)或普通用户消息中，但其实际持续时间取决于对话上下文的传递方式：

- **置于系统级指令**：通常在多轮对话中持续生效，适合作为[对话助手](/glossary/chatbot/)或专用工具的长期人设。
- **置于单轮对话消息**：若后续请求未保留历史上下文或出现了优先级更高的指令，先前设定的角色可能逐渐弱化或被覆盖。

## 局限与概念边界

- **只改变表达，不增加知识**：赋予模型「资深专家」身份不能突破其训练范围，也无法消除 [AI 幻觉](/glossary/hallucination/)或保证事实准确。
- **不授予真实系统权限**：角色扮演仅停留在文本生成层面，模型不会因被设定为管理员或审核员而获得访问外部系统或执行操作的能力。
- **不能替代任务约束**：仅有身份设定往往不足以保证结果可用，具体的任务目标、边界条件与[输出格式](/glossary/output-format/)仍需单独写明。
