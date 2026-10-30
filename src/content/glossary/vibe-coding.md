---
term: "Vibe Coding"
en: "Vibe Coding"
category: "vibecoding"
aliases: ["Vibe Coding", "氛围编程", "跟着感觉编程"]
definition: "用自然语言描述想法、让 AI 生成能跑代码的开发方式。"
example: "说一句「做个宿舍值日轮换的小页面」，AI 直接给出能打开的网页，这就是 vibe coding 的典型场景。"
youMaySay: "完全不懂代码，也能做出能用的东西吗？"
scenario:
  title: "做宿舍值日页"
  steps:
    - label: "描述需求"
      body: "说清页面要做什么、给谁用。"
      note: "需求越清，结果越准。"
    - label: "生成运行"
      body: "AI 给出代码，你按说明打开试跑。"
      meta: "先跑起来"
    - label: "验收修改"
      body: "发现问题就描述现象让它改，直到能用。"
quiz:
  - question: "Vibe Coding 中，人最不可省略的环节是？"
    options:
      - text: "背下所有代码"
        correct: false
      - text: "说清需求并验收结果"
        correct: true
      - text: "手动敲完每一行"
        correct: false
    explain: "AI 写代码，人负责定义与验收。"
agentPrompt: "请按以下需求生成一个可运行的小页面：宿舍值日轮换表，能添加成员、按周轮换；先给方案再给代码。"
order: 1
related: ["code-generation", "natural-language-programming"]
updated: "2026-10-26"
sources:
  - title: "What is vibe coding? · IBM"
    url: "https://www.ibm.com/think/topics/vibe-coding"
basis: "desk-research"
aiUsage: "drafted"
---

## 是什么

Vibe Coding 指用自然语言描述想要的东西，让 AI 写出能运行的代码；人主要负责说清需求、试跑和验收。

## 什么时候会遇到

想快速做个报名页、计算器、小工具，又不想从语法学起时；同学之间也会说「先 vibe 一个原型」。

## 和 AI 的关系

AI 负责生成与修改代码，你负责判断「跑起来对不对、是不是真要这样」。能跑不等于做对了，验收仍要靠人。

## 想深入再看

接下来可以看代码生成、调试和原型这几个词。
