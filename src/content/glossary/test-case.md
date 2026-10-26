---
term: "测试用例"
en: "Test Case"
category: "testing"
aliases: ["Test Case", "测试案例", "用例"]
definition: "一组「输入什么、应该得到什么」的具体检查条目。"
example: "报名表测试用例：留空姓名应提示错误；填完整应提交成功；重复学号应被拒绝。"
youMaySay: "怎么证明它真的没坏？"
scenario:
  title: "报名表自测"
  steps:
    - label: "列出场景"
      body: "留空、填错格式、正常提交、重复提交。"
      note: "覆盖常见输入。"
    - label: "执行检查"
      body: "逐条对照预期结果。"
      meta: "具体条目"
    - label: "记录结果"
      body: "把不通过的场景转成 bug 清单。"
quiz:
  - question: "测试用例应该包含什么？"
    options:
      - text: "只写「测试一下」"
        correct: false
      - text: "具体输入与预期结果"
        correct: true
      - text: "只写页面地址"
        correct: false
    explain: "用例的核心是输入与预期。"
agentPrompt: "请为这个报名表生成测试用例，覆盖空值、格式错误、重复提交和正常提交，用表格输出。"
order: 2
related: ["bug", "acceptance"]
updated: "2026-10-26"
sources:
  - title: "Test case · ISTQB 术语表"
    url: "https://glossary.istqb.org/en_US/term/test-case"
basis: "desk-research"
aiUsage: "drafted"
---

## 是什么

测试用例是具体的检查条目：给定输入，预期输出是什么；用来判断功能有没有坏。

## 什么时候会遇到

交付前自测、让 AI 帮忙列测试清单、修完 bug 后确认没影响别处。

## 和 AI 的关系

AI 能快速生成测试用例，但用例是否覆盖真实场景要人判断；通过测试也不代表没有问题。

## 想深入再看

相关词条：Bug、验收。
