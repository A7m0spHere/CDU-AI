---
term: "Bug（缺陷）"
en: "Bug"
category: "testing"
aliases: ["Bug", "缺陷", "程序错误"]
definition: "程序行为与预期不一致的地方，小到错别字，大到数据丢失。"
example: "报名页点了「提交」没反应，控制台报错——这就是一个 Bug。"
youMaySay: "昨天还好好的，今天怎么就坏了？"
scenario:
  title: "改样式改坏了功能"
  steps:
    - label: "修改样式"
      body: "调整按钮颜色与布局。"
      note: "小改动也可能影响功能。"
    - label: "功能失效"
      body: "按钮被遮挡，点击无效。"
      meta: "回归问题"
    - label: "定位修复"
      body: "对比改动记录，恢复点击区域并复测。"
quiz:
  - question: "修复一个 bug 后，最需要担心的是？"
    options:
      - text: "修复太慢"
        correct: false
      - text: "修复引入新的 bug"
        correct: true
      - text: "代码行数变少"
        correct: false
    explain: "修复本身也可能带来回归问题。"
agentPrompt: "请根据下面的现象和最近改动，帮我判断最可能的原因，并给出验证是否修好的步骤。"
order: 1
related: ["test-case", "debugging"]
updated: "2026-10-26"
sources:
  - title: "Defect · ISTQB 术语表"
    url: "https://glossary.istqb.org/en_US/term/defect"
basis: "desk-research"
aiUsage: "drafted"
reviewed: "2026-11-01"
reviewedBy: "AI 初审（负责人授权）"
reviewNote: "AI 按定义、例子及参考资料初审；链接可访问，未逐项核验全部事实或实测产品。"
---

## 是什么

Bug 是程序的实际行为和预期不一致：算错、卡住、显示错误、数据丢失都算。

## 什么时候会遇到

页面点不动、结果不对、AI 改完代码后又坏别的地方时。

## 和 AI 的关系

AI 能帮忙定位和修复，但修复本身也可能引入新 bug；复现步骤和预期结果描述得越清楚，越容易修对。

## 想深入再看

相关词条：测试用例、调试。
