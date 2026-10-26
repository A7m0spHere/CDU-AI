---
term: "界面（UI）"
en: "User Interface"
category: "frontend"
aliases: ["UI", "用户界面", "界面"]
definition: "你在屏幕上看到和操作的一切：按钮、输入框、文字与颜色。"
example: "同一个报名表，按钮大一点、提示清楚一点，填错的人就少——这就是界面设计的影响。"
youMaySay: "为什么有的页面一看就会用，有的怎么都找不到按钮？"
scenario:
  title: "报名页改版"
  steps:
    - label: "旧版界面"
      body: "按钮小、提示少，同学频繁问怎么填。"
      note: "界面影响操作。"
    - label: "改版对比"
      body: "按钮放大、标签写清，错误提示更具体。"
      meta: "可视化对比"
    - label: "观察效果"
      body: "填错率下降，但仍要测试真实流程。"
quiz:
  - question: "界面设计的核心目标是？"
    options:
      - text: "好看"
        correct: false
      - text: "让人能顺利完成操作"
        correct: true
      - text: "颜色丰富"
        correct: false
    explain: "界面服务于任务完成。"
agentPrompt: "请检查这个表单页面的可用性问题，按「找不到、看不懂、填错」三类列出，并给出修改建议。"
order: 1
related: ["component"]
updated: "2026-10-26"
sources:
  - title: "UI · MDN Glossary"
    url: "https://developer.mozilla.org/en-US/docs/Glossary/UI"
basis: "desk-research"
aiUsage: "drafted"
---

## 是什么

界面（UI）是软件露在外面的部分：布局、控件、文字与视觉样式，也是你点击和输入的地方。

## 什么时候会遇到

评价一个工具「好不好用」、改页面样式、和设计稿对照时。

## 和 AI 的关系

AI 能生成界面代码或设计建议，但好看不等于好用；操作是否顺手仍要真人试。

## 想深入再看

相关词条：组件、响应式布局。
