---
term: "上下文窗口"
en: "Context Window"
category: "prompt"
aliases: ["Context Window", "上下文长度", "窗口"]
definition: "模型一次能读进去的文字总量；超出部分会被挤掉或截断。"
example: "把 80 页的课程 PDF 一次粘进对话框问细节，后面的内容可能根本没进入模型视野。"
youMaySay: "聊到后面它怎么把我前面说的事忘了？"
scenario:
  title: "长对话丢失最初设定"
  steps:
    - label: "开头设定"
      body: "先说明「回答控制在 100 字以内」。"
      note: "设定进入上下文。"
    - label: "聊了很多轮"
      body: "对话越来越长，后面的回答又开始长篇大论。"
      meta: "早期内容被挤出"
    - label: "重复关键要求"
      body: "把关键约束重新贴一次，或新开会话只带必要材料。"
quiz:
  - question: "对话变长后模型忘记早期要求，主要因为？"
    options:
      - text: "模型故意不遵守"
        correct: false
      - text: "早期内容超出上下文窗口被挤掉"
        correct: true
      - text: "网络延迟"
        correct: false
    explain: "窗口有限，长对话会把早期内容挤出视野。"
agentPrompt: "请记住以下三条约束并在整个对话中遵守：回答不超过 100 字、先给结论、不确定就说不确定。"
order: 3
related: ["prompt"]
updated: "2026-10-26"
sources:
  - title: "Context windows · Anthropic"
    url: "https://platform.claude.com/docs/en/build-with-claude/context-windows"
basis: "desk-research"
aiUsage: "drafted"
---

## 一句话说清

上下文窗口是模型一次能「看到」的文字上限，按 token 计算：你的问题、历史对话、粘贴的资料、模型的回答都算在里面。

## 打个比方

像一张一次只能摊开固定页数的书桌：资料太多，早先摊上去的会被挤到桌外，模型就看不到了。

## 它是怎么运作的

每轮对话都会把之前的内容一起重新交给模型；对话越长、资料越多，越接近上限。超限时产品会截掉最早的内容、压缩摘要，或者直接报错。

## 你会碰到它的场景

- 长文档问答时，问的细节在文档后半段却答不准；
- 聊了很久之后，模型忘了最初设定的要求；
- 一次粘贴多个代码文件，后面的文件「像没被看到」。

## 常见误解

- 以为窗口大就等于读得懂：内容都在，也可能抓错重点；
- 以为超出后会自动去查资料：不会，它只能基于窗口内的内容回答；
- 以为聊天记录永久有效：换个会话，上下文就清空了。

## 想再深入一点

窗口大小按 token 计，不同模型不一样。长任务更稳的做法是先摘要、再分段提问，把关键结论写回提示词里。
