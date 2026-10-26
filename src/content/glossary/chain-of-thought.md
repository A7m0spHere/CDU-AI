---
term: "思维链"
en: "Chain-of-Thought"
category: "prompt"
aliases: ["Chain-of-Thought", "CoT", "逐步推理"]
definition: "让模型把推理步骤一步步写出来，而不是直接甩结论。"
example: "算社团活动预算时，让 AI 先列每项开销和计算过程，再给总额，方便你逐项核对哪里算错了。"
youMaySay: "它给的答案看着对，但我不知道是怎么来的，能信吗？"
order: 5
related: ["prompt", "hallucination"]
updated: "2026-10-26"
sources:
  - title: "Chain-of-Thought Prompting Elicits Reasoning in Large Language Models (arXiv:2201.11903)"
    url: "https://arxiv.org/abs/2201.11903"
  - title: "Let Claude think (chain of thought prompting) · Anthropic"
    url: "https://platform.claude.com/docs/en/build-with-claude/prompt-engineering/chain-of-thought"
basis: "desk-research"
aiUsage: "drafted"
---

## 一句话说清

思维链是一种提示技巧：要求模型先写推理过程、再给结论。好处是过程可检查，你能看到它在哪一步开始跑偏。

## 打个比方

像数学题要求写过程分：答案对错之外，过程让你知道是真会还是蒙对。

## 它是怎么运作的

模型按「先分析、再计算、后结论」的顺序生成文字，前面的步骤会成为后面结论的依据。但步骤是生成出来的解释，不一定是它内部的真实计算过程。

## 你会碰到它的场景

- 多步计算：预算、绩点换算、报销；
- 逻辑排查：为什么程序报错、通知哪里前后矛盾；
- 需要你复核的中等难度问题。

## 常见误解

- 以为写了步骤就可信：步骤也可能编，仍要抽查关键数字；
- 以为思维链等于更聪明：它主要提高可检查性，不保证正确率；
- 以为所有问题都该用：简单问题强行展开反而啰嗦。

## 想再深入一点

「一步步想」是这类提示的通俗说法，研究上常称为思维链提示（Chain-of-Thought），最早在推理任务上被系统验证。
