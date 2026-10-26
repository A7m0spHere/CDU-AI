---
term: "响应式布局"
en: "Responsive Design"
category: "frontend"
aliases: ["Responsive Design", "自适应", "移动端适配"]
definition: "同一套页面自动适配手机、平板和电脑屏幕。"
example: "社团报名页在电脑上是两列，在手机上变成一列——这就是响应式布局在起作用。"
youMaySay: "电脑上好好的页面，手机上怎么挤成一团？"
scenario:
  title: "手机打开报名页"
  steps:
    - label: "电脑预览"
      body: "两列布局，看起来正常。"
      note: "桌面宽度大。"
    - label: "手机打开"
      body: "内容挤成一列，按钮点不到。"
      meta: "屏幕变窄"
    - label: "调整布局"
      body: "改为单列、加大触控区域，重新预览。"
quiz:
  - question: "响应式布局要解决的核心问题是？"
    options:
      - text: "让页面在各类屏幕上都可用"
        correct: true
      - text: "让页面颜色更好看"
        correct: false
      - text: "减少代码行数"
        correct: false
    explain: "适配不同屏幕尺寸与操作方式。"
agentPrompt: "请检查这个页面的移动端布局问题，列出手机宽度下的排版与触控问题并给出修改建议。"
order: 3
related: ["ui", "component"]
updated: "2026-10-26"
sources:
  - title: "Responsive design · MDN"
    url: "https://developer.mozilla.org/en-US/docs/Learn_web_development/Core/CSS_layout/Responsive_Design"
basis: "desk-research"
aiUsage: "drafted"
---

## 是什么

响应式布局让同一个页面根据屏幕宽度调整排版：手机上单列，电脑上多列。

## 什么时候会遇到

手机打开网页要放大缩小、按钮点不到时；做页面时被要求「适配移动端」。

## 和 AI 的关系

AI 可以生成响应式代码，但不同尺寸下的实际效果要自己预览；触屏操作习惯也要单独考虑。

## 想深入再看

相关词条：界面、组件。
