---
term: "思维链"
en: "Chain-of-Thought"
category: "prompt"
aliases:
  - "Chain-of-Thought"
  - "CoT"
  - "逐步推理"
definition: "模型在推理阶段生成的连续中间分析步骤，以及通过提示引导其逐步推演再给出结论的方法。"
example: "核对多笔活动开销时，要求模型先逐项列出计算式与小计，再汇总总金额，以便逐行定位可能出错的步骤。"
order: 4
related:
  - "prompt"
  - "few-shot"
  - "hallucination"
updated: "2026-11-18"
sources:
  - title: "Chain-of-Thought Prompting Elicits Reasoning in Large Language Models (arXiv:2201.11903)"
    url: "https://arxiv.org/abs/2201.11903"
  - title: "Let Claude think (chain of thought prompting) · Anthropic"
    url: "https://platform.claude.com/docs/en/build-with-claude/prompt-engineering/chain-of-thought"
  - title: "Measuring faithfulness in Chain-of-Thought reasoning · Anthropic"
    url: "https://www.anthropic.com/news/measuring-faithfulness-in-chain-of-thought-reasoning"
basis: "desk-research"
aiUsage: "drafted"
reviewNote: "按极简维基体例重构正文与结构，待负责人复审。"
---

面对多步算术、逻辑推导或条件判断等复杂任务时，直接要求[大语言模型](/glossary/llm/)输出最终答案往往容易出错。通过[提示词](/glossary/prompt/)或[少样本示例](/glossary/few-shot/)引导模型先展开中间推理过程，可将复杂问题拆解为连续的子步骤，使后续结论建立在前序生成的中间文本之上。

## 核心机制与常见形式

思维链的核心在于用中间计算文本换取更稳定的多步推导，实际应用中主要包含两种形态：

- **提示词引导**：通过「请一步步分析」等零样本指令，或提供包含推导过程的少样本样例，触发模型按步骤输出。
- **原生推理过程**：部分推理型模型在内部设计上默认先生成思考过程再输出正式回答，用户界面中常以可折叠的思考过程展示。

## 适用场景与优势

- **多步计算与条件推理**：如税费核算、日程冲突排查、多条件筛选等需要连续依赖前一步结果的问题。
- **辅助过程复核**：将隐含判断显性化后，使用者可以逐行检查列式、假设或逻辑跳跃，定位具体出错环节，而不必只面对单一结论。

## 局限与概念边界

- **过程合理不代表事实正确**：生成的中间步骤同样可能包含编造的前提或计算失误，仍可能出现 [AI 幻觉](/glossary/hallucination/)，关键数字与逻辑仍需人工核验。
- **未必忠实反映内部计算**：研究表明，模型写出的推理文本有时只是对答案的事后解释，并不总是严格对应其神经网络内部的真实决策路径。
- **增加输出开销**：展开中间步骤会显著增加生成长度与 [Token](/glossary/token/) 消耗，在简单事实查询中反而造成响应变慢与信息冗余。
