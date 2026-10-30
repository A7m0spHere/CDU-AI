---
term: "调试"
en: "Debugging"
category: "testing"
aliases: ["Debugging", "排错", "找 bug"]
definition: "找出程序为什么不按预期工作并修好它的过程。"
example: "页面点了按钮没反应，先看报错、再定位到那一行代码——这就是调试。"
youMaySay: "它说「已修复」，就真的修好了吗？"
scenario:
  title: "页面按钮没反应"
  steps:
    - label: "描述现象"
      body: "告诉 AI 点了没反应，附上报错。"
      note: "复现步骤很关键。"
    - label: "得到修改"
      body: "它改了事件绑定，但引入了新问题。"
      meta: "修复可能带来新问题"
    - label: "回归验证"
      body: "重新测试原功能和相邻功能。"
quiz:
  - question: "AI 修复 bug 后，你必须做的是？"
    options:
      - text: "相信它说修好了"
        correct: false
      - text: "自己复现验证并检查相邻功能"
        correct: true
      - text: "直接提交"
        correct: false
    explain: "修复需要验证，可能引入新问题。"
agentPrompt: "请根据下面的报错和代码分析原因，给出最小修改方案，并说明如何验证不会影响其他功能。"
order: 3
related: ["bug", "code-generation"]
updated: "2026-10-30"
sources:
  - title: "Debugging · Visual Studio Code 官方文档"
    url: "https://code.visualstudio.com/docs/editor/debugging"
basis: "desk-research"
aiUsage: "drafted"
---

## 是什么

调试是定位并修复程序问题的过程：复现问题、缩小范围、验证修复。

## 什么时候会遇到

AI 生成的代码跑不起来、结果不对、样式错位时；和「测试」不同，测试负责发现，调试负责修。

## 和 AI 的关系

可以把报错和代码交给 AI 分析，但它说「修好了」要你自己复现确认；它也可能改出新问题。

## 想深入再看

相关词条：Bug、代码生成。
