---
term: "知识截止"
en: "Knowledge Cutoff"
category: "basics"
aliases: ["Knowledge Cutoff", "训练截止", "知识有效期"]
definition: "训练资料的最后时间点；之后发生的事模型没学过。"
example: "问 AI 今年校历的放假安排，它可能按往年的规律编一个——因为训练数据里没有今年的通知。"
youMaySay: "它说的「今年」到底是哪一年？"
scenario:
  title: "问今年的校历"
  steps:
    - label: "直接问日期"
      body: "问 AI 今年寒假从哪天开始，它给了一个具体日期。"
      note: "日期可能是按往年规律推的。"
    - label: "核对官方通知"
      body: "打开教务处通知，发现日期完全不同。"
      meta: "教务处官网"
    - label: "以后先问截止"
      body: "凡涉及日期、政策，先问它的知识截止到什么时候。"
      note: "截止后的事一律自己核对。"
quiz:
  - question: "关于知识截止，哪种理解正确？"
    options:
      - text: "截止之后的事模型一定完全不知道"
        correct: false
      - text: "截止后的事模型只能推测，需外部核实"
        correct: true
      - text: "模型会自动每天更新知识"
        correct: false
    explain: "截止后的事并非全错，但有规律可循不代表可靠。"
agentPrompt: "请先说明你的知识截止时间，再回答下面的问题；涉及截止后的事件请明确标注「需要核实」。"
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
