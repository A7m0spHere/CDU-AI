---
term: "原型"
en: "Prototype"
category: "product"
aliases: ["Prototype", "样品", "低保真原型"]
definition: "先做出来的粗糙样品，用来看方向对不对，不求完善。"
example: "用 AI 十分钟生成一个能点的报名页草图，先问同学「这样填顺不顺」，就是原型。"
youMaySay: "先做个能点的样子，真的有必要吗？"
scenario:
  title: "先做原型再开发"
  steps:
    - label: "快速原型"
      body: "用 AI 生成一个能点的页面草图。"
      note: "低成本试方向。"
    - label: "同学试用"
      body: "发现字段太多、流程太长。"
      meta: "暴露问题"
    - label: "改完再做"
      body: "按反馈简化后再正式开发。"
quiz:
  - question: "原型的价值主要在于？"
    options:
      - text: "可以直接当成品交付"
        correct: false
      - text: "低成本验证方向与流程"
        correct: true
      - text: "让代码更好看"
        correct: false
    explain: "原型用来试错，不是成品。"
agentPrompt: "请为这个报名流程画一个低保真原型说明：页面、字段、按钮和跳转关系，先不写代码。"
order: 2
related: ["requirements", "acceptance"]
updated: "2026-10-26"
sources:
  - title: "Prototyping · Interaction Design Foundation"
    url: "https://www.interaction-design.org/literature/topics/prototyping"
basis: "desk-research"
aiUsage: "drafted"
---

## 是什么

原型是低成本的第一版：能点、能看、能试，但细节和健壮性都不完整。

## 什么时候会遇到

做页面或工具前先画草图、用 AI 快速生成可点的版本给同学试用。

## 和 AI 的关系

AI 让做原型变得很快，但原型不是成品：拿原型当交付物、承诺「马上能用」会伤信任。

## 想深入再看

相关词条：需求、验收。
