---
term: "对话助手"
en: "Chatbot"
category: "tools"
aliases: ["Chatbot", "聊天机器人", "AI 助手"]
definition: "以聊天形式使用 AI 的产品，例如网页版的 DeepSeek、Kimi。"
example: "打开网页或 App，输入一句话就得到回复——这就是对话助手最常见的形态。"
youMaySay: "网页版和 App 里的 AI，是同一个东西吗？"
scenario:
  title: "同一模型的两种入口"
  steps:
    - label: "网页提问"
      body: "在网页版让 AI 总结一份材料。"
      note: "产品自带历史记录与设置。"
    - label: "换 App"
      body: "在手机 App 里问同样的问题。"
      meta: "不同入口"
    - label: "对比结果"
      body: "回答风格略有差异，因产品设定与版本不同。"
quiz:
  - question: "对话助手和模型的关系是？"
    options:
      - text: "产品就是模型本身"
        correct: false
      - text: "产品在模型外还加了界面、规则和工具"
        correct: true
      - text: "模型由用户自己训练"
        correct: false
    explain: "产品是模型加界面与规则的组合。"
agentPrompt: "请用三句话总结这份材料，面向没上过这门课的同学，不要使用教材里的术语缩写。"
order: 1
related: ["api", "llm"]
updated: "2026-10-26"
sources:
  - title: "Claude Help Center · Anthropic"
    url: "https://support.claude.com/en/"
basis: "desk-research"
aiUsage: "drafted"
reviewed: "2026-10-31"
reviewedBy: "A7m"
reviewNote: "负责人确认保留原文；记录保存与同步依产品而异，未逐一核验来源。"
---

## 一句话说清

对话助手是把模型包装成聊天界面的产品：你发消息，它回消息，可以连续追问。

## 打个比方

像柜台后的店员：你问一句它答一句，能不能办成事取决于它背后接了什么工具。

## 它是怎么运作的

产品在模型外面加界面、历史记录、系统提示和联网等能力。你用的是整套产品，不只是模型。

## 你会碰到它的场景

- 写作业提纲、改文案、翻译、总结；
- 上传文件让它读；
- 用同一个模型的不同产品，感受差别很大。

## 常见误解

- 以为产品名就是模型名：同名模型在不同产品里表现不同；
- 以为聊天记录永远在：换设备或清缓存可能丢失；
- 以为基础版和付费版只是快慢：额度和功能往往不同。

## 想再深入一点

网页版面向人操作，API 面向程序调用，两者计费与能力边界不同。
