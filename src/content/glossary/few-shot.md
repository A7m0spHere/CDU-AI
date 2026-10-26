---
term: "少样本示例"
en: "Few-shot Prompting"
category: "prompt"
aliases: ["Few-shot", "少样本", "示例提示"]
definition: "在问题里给几个「输入→输出」样例，让模型照着格式答。"
example: "整理课堂笔记时先给 AI 两条「原始记录→摘要」的示例，再让它按同样格式处理剩下的段落。"
youMaySay: "怎么让它每次输出的格式都一样？"
scenario:
  title: "统一笔记格式"
  steps:
    - label: "给两条样例"
      body: "先贴两条「录音原文→整理后的笔记」，再让它处理第三段。"
      note: "样例说明格式与颗粒度。"
    - label: "检查输出"
      body: "格式基本一致，但有一条把推测写成了事实。"
      meta: "内容仍需核对"
    - label: "补一句规则"
      body: "加一句「不确定的内容标注待核实」再试。"
quiz:
  - question: "少样本示例最擅长教会模型什么？"
    options:
      - text: "事实准确性"
        correct: false
      - text: "输出格式、口径与颗粒度"
        correct: true
      - text: "联网能力"
        correct: false
    explain: "示例主要传递格式与风格，不保证事实正确。"
agentPrompt: "请按下面两条示例的格式处理第三段材料；不确定的内容标注「待核实」，不要补造。"
order: 4
related: ["prompt", "output-format"]
updated: "2026-10-26"
sources:
  - title: "Use examples (multishot prompting) · Anthropic"
    url: "https://platform.claude.com/docs/en/build-with-claude/prompt-engineering/multishot-prompting"
basis: "desk-research"
aiUsage: "drafted"
---

## 一句话说清

少样本示例是在提问时附上两三条示范，让模型从例子里推断你想要的格式、口径和颗粒度——不是让它背答案，而是让它照着样子做。

## 打个比方

像给新同事看两份填好的报销单：不用说一堆规则，照着样板填就不容易走样。

## 它是怎么运作的

模型从示例中找规律：字段顺序、语气、详略。示例越贴近真实任务，输出越稳定；示例本身有错，模型也会跟着错。

## 你会碰到它的场景

- 把课堂录音整理成固定格式的笔记；
- 给一堆社团报名信息打统一标签；
- 让 AI 按你之前的写法改写通知。

## 常见误解

- 以为例子越多越好：两三条有代表性的通常够用，堆多了反而稀释重点；
- 以为给了例子就不用说要求：例子教格式，不保证事实正确；
- 以为示例可以随便编：示范错了，结果就错。

## 想再深入一点

一个例子都不给叫零样本，给例子叫少样本。结构化要求高时，示例加一句文字说明通常比只给例子更稳。
