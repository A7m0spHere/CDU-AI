---
term: "知识截止"
en: "Knowledge Cutoff"
category: "basics"
aliases: ["Knowledge Cutoff", "训练截止", "知识有效期"]
definition: "厂商说明的模型训练知识时间边界；不代表该日期前的事都知道，也不限制外部查证。"
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
    - label: "先找一手来源"
      body: "涉及校历或政策时，先查官方通知；需要截止信息时看所用模型的官方说明。"
      note: "模型自述的截止时间也可能不准确。"
quiz:
  - question: "关于知识截止，哪种理解正确？"
    options:
      - text: "截止之后的事模型一定完全不知道"
        correct: false
      - text: "不能只靠训练知识确认新事件，但可以利用提供的资料或检索结果"
        correct: true
      - text: "模型会自动每天更新知识"
        correct: false
    explain: "知识截止描述训练知识，不是系统获取外部信息的日期上限；引用的外部资料仍需核对。"
agentPrompt: "请根据我提供的官方通知回答下面的问题，并注明发布日期；如果支持联网，可以检索补充。找不到当前有效依据时标注「未核实」，不要只凭旧知识猜测。"
order: 5
related: ["llm", "hallucination"]
updated: "2026-10-30"
sources:
  - title: "Models overview（含 reliable knowledge cutoff）· Anthropic"
    url: "https://platform.claude.com/docs/en/about-claude/models/overview"
basis: "desk-research"
aiUsage: "drafted"
reviewed: "2026-11-01"
reviewedBy: "A7m"
reviewNote: "负责人确认保留原文；示例中训练数据缺失的原因未经实证。"
---

## 一句话说清

知识截止是厂商说明的模型训练知识时间边界。之后的新事件不能仅靠这些知识确认，但模型仍可以读取用户提供的新资料，或利用产品接入的检索工具。

## 打个比方

像一本较早印刷的年鉴：今年的新消息不在书里，但你可以另附一份最新通知，请助手对照阅读。

## 它是怎么运作的

模型厂商在某个时间点收集并清洗数据训练模型，之后不再自动更新。产品可以提供联网搜索，但那是另加的工具，不是模型本身记住了新事。

## 你会碰到它的场景

- 问近期新闻、新政策、新版本，回答像旧闻；
- 问「今年」的考试安排，得到往年的写法；
- 产品提示「我的知识截止到某年某月」。

## 常见误解

- 以为模型会每天自动更新训练知识：检索到新资料不等于重新训练；
- 以为截止后的事都答不了：有规律的事仍可能猜对，但不可靠；
- 以为联网就万事大吉：检索结果也要核对来源和日期。

## 想再深入一点

不同模型、不同版本的截止时间不同，官方模型介绍页通常会标注。
