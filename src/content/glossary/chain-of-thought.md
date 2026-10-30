---
term: "思维链"
en: "Chain-of-Thought"
category: "prompt"
aliases: ["Chain-of-Thought", "CoT", "逐步推理"]
definition: "推理时生成的一连串中间步骤；思维链提示会用示例或指令引导模型生成这些步骤。"
example: "算社团活动预算时，让 AI 先列每项开销和计算过程，再给总额，方便你逐项核对哪里算错了。"
youMaySay: "它给的答案看着对，但我不知道是怎么来的，能信吗？"
scenario:
  title: "核对预算计算"
  steps:
    - label: "要求写过程"
      body: "让 AI 先列每项开销与计算，再给总额。"
      note: "步骤可检查。"
    - label: "逐项核对"
      body: "发现它把一项数量乘错了。"
      meta: "过程暴露错误"
    - label: "修正后复算"
      body: "改数量重新计算，再抽查一遍。"
quiz:
  - question: "要求模型写推理步骤，最大的好处是？"
    options:
      - text: "保证结论一定正确"
        correct: false
      - text: "过程可检查，便于发现错误"
        correct: true
      - text: "让回答更短"
        correct: false
    explain: "步骤提高可检查性，不保证正确。"
agentPrompt: "请一步步列出计算过程再给结论，标明每一步的数据来源；最后单独列出可能算错的地方。"
order: 4
related: ["prompt", "hallucination"]
updated: "2026-10-30"
sources:
  - title: "Chain-of-Thought Prompting Elicits Reasoning in Large Language Models (arXiv:2201.11903)"
    url: "https://arxiv.org/abs/2201.11903"
  - title: "Let Claude think (chain of thought prompting) · Anthropic"
    url: "https://platform.claude.com/docs/en/build-with-claude/prompt-engineering/chain-of-thought"
basis: "desk-research"
aiUsage: "drafted"
---

## 一句话说清

思维链指推理时生成的一连串中间步骤；思维链提示则通过示例或指令引导模型生成这些步骤。它在一些多步推理任务中能改善表现，但写出的解释不一定忠实反映内部推理。

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
- 以为写出步骤就一定提高正确率：效果取决于模型与任务，解释也可能看似合理却有错；
- 以为所有问题都该用：简单问题强行展开反而啰嗦。

## 想再深入一点

「一步步想」是这类提示的通俗说法，研究上常称为思维链提示（Chain-of-Thought），最早在推理任务上被系统验证。
