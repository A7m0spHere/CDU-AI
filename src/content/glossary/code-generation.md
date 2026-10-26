---
term: "代码生成"
en: "Code Generation"
category: "vibecoding"
aliases: ["Code Generation", "AI 写代码", "生成代码"]
definition: "AI 根据描述写出程序代码，从片段到完整小项目都有。"
example: "把「读取 CSV 并画出柱状图」描述给 AI，它给出完整脚本，你负责运行和检查。"
youMaySay: "它一次能写出多少代码？"
scenario:
  title: "生成数据处理脚本"
  steps:
    - label: "描述输入输出"
      body: "说明数据在哪、要什么结果。"
      note: "越具体越可用。"
    - label: "得到脚本"
      body: "生成完整代码，但有版本兼容问题。"
      meta: "需运行验证"
    - label: "修到能跑"
      body: "按报错调整，最后自己跑通。"
quiz:
  - question: "AI 生成代码后，哪种做法最稳妥？"
    options:
      - text: "直接部署"
        correct: false
      - text: "运行、理解并检查后再使用"
        correct: true
      - text: "只看注释"
        correct: false
    explain: "生成代码必须验证。"
agentPrompt: "请为下面这个数据处理任务写一个脚本，附上运行说明与可能失败的地方；先用小样本验证。"
order: 3
related: ["debugging", "coding-assistant"]
updated: "2026-10-26"
sources:
  - title: "Evaluating Large Language Models Trained on Code (arXiv:2107.03374)"
    url: "https://arxiv.org/abs/2107.03374"
basis: "desk-research"
aiUsage: "drafted"
---

## 是什么

代码生成是 AI 根据描述或上下文产出代码：补全一行、写一个函数，或搭出完整小项目。

## 什么时候会遇到

用编程助手写作业工具、做数据处理、改页面样式时；代码评审里也会看到 AI 生成的片段。

## 和 AI 的关系

AI 生成初稿，人负责跑通、理解和修改。生成代码可能过时、有漏洞或与项目风格不符，不能直接上线或交作业。

## 想深入再看

生成之后通常要调试，相关词条：调试、Bug。
