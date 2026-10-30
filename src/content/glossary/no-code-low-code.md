---
term: "无代码/低代码"
en: "No-code / Low-code"
category: "vibecoding"
aliases: ["No-code", "Low-code", "零代码", "低代码"]
definition: "用拖拽和配置代替写代码来做工具的开发路线。"
example: "用现成平台拖几个表单和按钮，做出社团报名收集页，不用写代码。"
youMaySay: "拖拽做出来的东西，能撑住真实使用吗？"
scenario:
  title: "搭社团报名收集页"
  steps:
    - label: "拖拽搭建"
      body: "用平台拼出表单与提交按钮。"
      note: "简单场景很快。"
    - label: "遇到限制"
      body: "复杂校验做不了，需要写少量脚本。"
      meta: "低代码补脚本"
    - label: "评估数据归属"
      body: "数据存在平台方，导出与权限要确认。"
quiz:
  - question: "无代码/低代码的主要边界是？"
    options:
      - text: "完全不能做表单"
        correct: false
      - text: "复杂逻辑与数据归属受平台限制"
        correct: true
      - text: "只能手机端使用"
        correct: false
    explain: "平台能力与数据位置是主要边界。"
agentPrompt: "请评估下面这个需求用低代码平台能否完成，列出平台限制与需要人工处理的部分。"
order: 4
related: ["vibe-coding", "deployment"]
updated: "2026-10-30"
sources:
  - title: "Microsoft Power Platform 官方文档"
    url: "https://learn.microsoft.com/en-us/power-platform/"
basis: "desk-research"
aiUsage: "drafted"
---

## 是什么

无代码/低代码是用可视化配置搭应用：无代码几乎不写代码，低代码在关键处补少量脚本。

## 什么时候会遇到

做报名表、审批流、数据看板时；平台宣传「拖拽即可上线」。

## 和 AI 的关系

AI 可以帮助这类平台理解需求，但复杂逻辑仍受平台能力限制。数据可能由平台托管，也可能自行部署，要核对实际方案、导出方式与权限。

## 想深入再看

相关词条：Vibe Coding、部署。
