---
term: "Vibe Coding"
en: "Vibe Coding"
category: "vibecoding"
aliases: ["Vibe Coding", "氛围编程", "跟着感觉编程"]
definition: "一种依靠自然语言让 AI 编写和修改程序、以快速试用和反复调整为主的开发方式；最初的用法强调较少关注生成的代码细节。"
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
updated: "2026-10-31"
sources:
  - title: "What is vibe coding? · IBM"
    url: "https://www.ibm.com/think/topics/vibe-coding"
  - title: "Vibe coding · OpenSSF Glossary"
    url: "https://glossary.openssf.org/vibe-coding/"
basis: "desk-research"
aiUsage: "drafted"
reviewed: "2026-10-31"
reviewedBy: "A7m"
reviewNote: "AI 辅助审核后负责人确认；未逐一核验全部来源。"
---

## 是什么

Vibe Coding 是用自然语言让 AI 编写和修改程序，通过试用结果不断调整。最初的用法强调较少关注生成的代码细节。这个词现在也有人泛指 AI 辅助编程；但认真检查和维护代码的开发方式，不应一概理解为最初意义上的 Vibe Coding。

## 什么时候会遇到

想快速做个报名页、计算器、小工具，又不想从语法学起时；同学之间也会说「先 vibe 一个原型」。

## 和 AI 的关系

AI 负责生成与修改代码，你负责判断「跑起来对不对、是不是真要这样」。能跑不代表安全或便于维护，实际使用前还要检查数据、权限和代码。

## 想深入再看

接下来可以看代码生成、调试和原型这几个词。
