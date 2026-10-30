---
term: "AI 搜索"
en: "AI Search"
category: "tools"
aliases: ["AI Search", "AI 搜索引擎", "联网搜索"]
definition: "把检索和 AI 总结结合的工具，回答里常带来源链接。"
example: "问「学校今年转专业政策」，AI 搜索会先找网页再总结，并列出参考链接。"
youMaySay: "它给的链接，是不是就代表说对了？"
scenario:
  title: "查转专业政策"
  steps:
    - label: "提问"
      body: "问 AI 搜索今年的转专业条件。"
      note: "先检索再总结。"
    - label: "点开来源"
      body: "发现引用的是去年的通知。"
      meta: "来源过期"
    - label: "回到官网"
      body: "打开教务处最新通知核对。"
quiz:
  - question: "AI 搜索给出引用链接时，应该怎么用？"
    options:
      - text: "有链接就可以直接相信"
        correct: false
      - text: "点开核对发布时间与适用范围"
        correct: true
      - text: "链接越多结论越可靠"
        correct: false
    explain: "链接存在不等于支持结论，要核对日期与范围。"
agentPrompt: "请检索并总结下面的问题，逐条给出来源链接与发布时间；找不到官方来源的部分标注「未核实」。"
order: 4
related: ["hallucination", "chatbot"]
updated: "2026-10-26"
sources:
  - title: "Web search tool · Anthropic"
    url: "https://platform.claude.com/docs/en/agents-and-tools/tool-use/web-search-tool"
basis: "desk-research"
aiUsage: "drafted"
---

## 一句话说清

AI 搜索是「先检索、再总结」的工具：它把搜到的网页内容交给模型整理，答案通常附来源。

## 打个比方

像先帮你翻资料、再写综述的助手：比直接聊天的模型多了「查」这一步。

## 它是怎么运作的

先把问题拆成检索词，抓取网页片段，再由模型汇总。来源是否可靠、摘要是否忠实，仍要人判断。

## 你会碰到它的场景

- 查政策、活动、价格等会变化的信息；
- 需要对比多个来源；
- 答案里带编号链接。

## 常见误解

- 以为有链接就可信：链接可能不支持结论；
- 以为一定比聊天准：检索错、摘要偏都会出错；
- 以为能替代官方通知：关键信息回到原文确认。

## 想再深入一点

看引用时先点开链接，核对发布时间与适用范围，再决定信不信。
