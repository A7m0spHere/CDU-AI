---
term: "截断"
en: "Truncation"
category: "basics"
aliases: ["Truncation", "输出截断", "回答被切断"]
definition: "回答写到一半被字数或 token 上限切断，话说不完。"
example: "让 AI 写完整报告，结果最后一句突然断掉——输出长度撞到了上限。"
youMaySay: "回答怎么写到一半就没了？"
scenario:
  title: "长报告生成"
  steps:
    - label: "要求长文"
      body: "让 AI 写一份完整报告。"
      note: "输出有长度上限。"
    - label: "被截断"
      body: "最后一句突然停住。"
      meta: "max tokens"
    - label: "分段生成"
      body: "先要提纲，再逐段写，最后合并校对。"
quiz:
  - question: "输出被截断后，最好的补救方式是？"
    options:
      - text: "让它「继续」并期待无缝衔接"
        correct: false
      - text: "分段生成并在合并时校对"
        correct: true
      - text: "换一个更贵的模型"
        correct: false
    explain: "分段加校对比续写更可靠。"
agentPrompt: "请先给我报告提纲，我确认后再按小节逐个生成，每节不超过 400 字。"
order: 10
related: ["context-window", "rate-limit"]
updated: "2026-10-30"
sources:
  - title: "Messages API（max_tokens）· Anthropic"
    url: "https://platform.claude.com/docs/en/api/messages"
basis: "desk-research"
aiUsage: "drafted"
---

## 一句话说清

截断是模型的输出达到长度上限后被迫停止：不是它不想写，而是这次能生成的空间用完了。

## 打个比方

像作文纸写满了：内容没写完，也只能停笔。

## 它是怎么运作的

每次请求可设最大输出长度（如 max tokens）；回答达到上限即停止，可能停在句子中间。

## 你会碰到它的场景

- 长文写作、代码生成；
- 基础版限制输出长度；
- 续写时前后风格不一致。

## 常见误解

- 以为截断是网络断了：通常是长度上限；
- 以为让它「继续」就能无缝接上：可能重复或跑偏；
- 以为上限越大越好：也受模型与套餐约束。

## 想再深入一点

长任务分段要：先要提纲，再逐段生成，最后统一校对。
