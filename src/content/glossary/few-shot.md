---
term: "少样本示例"
en: "Few-shot Prompting"
category: "prompt"
aliases: ["Few-shot", "少样本", "示例提示"]
definition: "在问题里给几个「输入→输出」样例，让模型照着格式答。"
example: "整理课堂笔记时先给 AI 两条「原始记录→摘要」的示例，再让它按同样格式处理剩下的段落。"
youMaySay: "怎么让它每次输出的格式都一样？"
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
