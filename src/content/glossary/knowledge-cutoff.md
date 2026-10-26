---
term: "知识截止"
en: "Knowledge Cutoff"
category: "basics"
aliases: ["Knowledge Cutoff", "训练截止", "知识有效期"]
definition: "训练资料的最后时间点；之后发生的事模型没学过。"
example: "问 AI 今年校历的放假安排，它可能按往年的规律编一个——因为训练数据里没有今年的通知。"
order: 5
related: ["llm", "hallucination"]
updated: "2026-10-26"
sources:
  - title: "Models overview（含 reliable knowledge cutoff）· Anthropic"
    url: "https://platform.claude.com/docs/en/about-claude/models/overview"
basis: "desk-research"
aiUsage: "drafted"
---

## 一句话说清

知识截止是模型训练数据覆盖到的时间边界。截止之后发生的事，模型没有直接学过，只能靠推测或联网检索。

## 打个比方

像一本几年前印刷的年鉴：今年的事不在里面，你可以问它，但它只能根据旧规律猜。

## 它是怎么运作的

模型厂商在某个时间点收集并清洗数据训练模型，之后不再自动更新。产品可以提供联网搜索，但那是另加的工具，不是模型本身记住了新事。

## 你会碰到它的场景

- 问近期新闻、新政策、新版本，回答像旧闻；
- 问「今年」的考试安排，得到往年的写法；
- 产品提示「我的知识截止到某年某月」。

## 常见误解

- 以为模型会自己更新：不会，除非产品联网检索；
- 以为截止后的事都答不了：有规律的事仍可能猜对，但不可靠；
- 以为联网就万事大吉：检索结果也要核对来源和日期。

## 想再深入一点

不同模型、不同版本的截止时间不同，官方模型介绍页通常会标注。
