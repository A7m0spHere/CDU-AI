---
term: "组件"
en: "Component"
category: "frontend"
aliases: ["Component", "组件化", "UI 组件"]
definition: "拼成页面的积木块；一个按钮、一张卡片都可以是组件。"
example: "页面里十个一样的「报名」按钮，其实是同一个组件被用了十次。"
youMaySay: "为什么改一个按钮，要动好几个文件？"
scenario:
  title: "统一按钮样式"
  steps:
    - label: "重复代码"
      body: "每个页面都写了一遍按钮样式。"
      note: "难以维护。"
    - label: "抽成组件"
      body: "把按钮做成组件，统一传参。"
      meta: "复用"
    - label: "一处修改"
      body: "改组件即全站生效。"
quiz:
  - question: "组件化的主要好处是？"
    options:
      - text: "页面更好看"
        correct: false
      - text: "复用与统一维护"
        correct: true
      - text: "加载更快"
        correct: false
    explain: "组件化是工程手段，解决复用与维护。"
agentPrompt: "请把下面这段重复的按钮代码抽成一个组件，说明需要哪些参数，以及如何替换原有调用。"
order: 2
related: ["ui", "responsive-design"]
updated: "2026-10-26"
sources:
  - title: "Your first component · React 官方文档"
    url: "https://react.dev/learn/your-first-component"
basis: "desk-research"
aiUsage: "drafted"
---

## 是什么

组件是页面里可复用的独立单元：按钮、输入框、卡片、导航栏。多个组件拼成页面。

## 什么时候会遇到

页面里同样的按钮出现很多次、改一处要改很多文件时；前端代码里的「组件」目录。

## 和 AI 的关系

AI 生成页面时常按组件组织代码，方便复用；但组件划分不合理时，改起来更乱。

## 想深入再看

相关词条：界面、响应式布局。
