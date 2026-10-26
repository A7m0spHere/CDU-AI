---
term: "需求"
en: "Requirements"
category: "product"
aliases: ["Requirements", "需求分析", "用户需求"]
definition: "把「想做什么」说清楚：给谁用、解决什么问题、做到什么算完。"
example: "「做个社团报名表」不是需求；「给 200 名新生报名，要收集专业和联系方式，截止后能导出」才是。"
youMaySay: "到底要做什么，我们自己都说不清。"
scenario:
  title: "社团要做报名工具"
  steps:
    - label: "模糊目标"
      body: "「做个报名的东西」。"
      note: "没写下来的需求不算需求。"
    - label: "追问细节"
      body: "多少人用、收集哪些字段、截止后怎么导出。"
      meta: "需求澄清"
    - label: "写成清单"
      body: "把必须做与不做分别列出，确认后再动手。"
quiz:
  - question: "一份可执行的需求至少要说清什么？"
    options:
      - text: "用什么编程语言"
        correct: false
      - text: "给谁用、解决什么问题、什么算完成"
        correct: true
      - text: "页面用什么颜色"
        correct: false
    explain: "用户、问题与完成标准是需求的核心。"
agentPrompt: "请根据下面的想法帮我写一份需求清单，分成「必须有」「暂不做」「待确认」三部分。"
order: 1
related: ["prototype", "acceptance"]
updated: "2026-10-26"
sources:
  - title: "Requirements · Atlassian"
    url: "https://www.atlassian.com/agile/product-management/requirements"
basis: "desk-research"
aiUsage: "drafted"
---

## 是什么

需求是对目标的明确描述：用户是谁、痛点是什么、哪些必须做到、哪些不做。

## 什么时候会遇到

和同学合作做工具、向 AI 描述任务、验收前对标准时。

## 和 AI 的关系

需求越清楚，AI 越少瞎猜；但 AI 不会替你判断值不值得做，也不会自动发现没写出来的需求。

## 想深入再看

相关词条：原型、验收。
