---
term: "自然语言编程"
en: "Natural Language Programming"
category: "vibecoding"
aliases: ["Natural Language Programming", "用说话编程"]
definition: "直接用说话的方式让计算机做事，不必先学编程语法。"
example: "对着 AI 说「把这张表按成绩排序并统计及格率」，它写脚本完成——这就是自然语言编程的思路。"
youMaySay: "以后是不是不用学编程了？"
scenario:
  title: "用说话处理表格"
  steps:
    - label: "描述任务"
      body: "「把这张表按成绩排序，统计及格率」。"
      note: "任务描述要具体。"
    - label: "生成脚本"
      body: "AI 给出处理脚本，你运行检查。"
      meta: "翻译成代码"
    - label: "修正歧义"
      body: "「及格」标准没说清，补充 60 分后重跑。"
quiz:
  - question: "自然语言编程没有降低哪项要求？"
    options:
      - text: "写代码的门槛"
        correct: false
      - text: "把问题想清楚的门槛"
        correct: true
      - text: "安装软件的门槛"
        correct: false
    explain: "表达含糊，结果也会含糊。"
agentPrompt: "请把下面这句话改写成更精确的任务描述，补全对象、范围、判断标准与输出格式。"
order: 2
related: ["vibe-coding"]
updated: "2026-10-30"
sources:
  - title: "Evaluating Large Language Models Trained on Code (arXiv:2107.03374)"
    url: "https://arxiv.org/abs/2107.03374"
basis: "desk-research"
aiUsage: "drafted"
reviewed: "2026-11-01"
reviewedBy: "A7m"
reviewNote: "负责人确认保留原文；所引论文侧重自然语言生成代码，未覆盖术语的全部用法。"
---

## 是什么

自然语言编程指用日常语言表达计算任务，由系统翻译成可执行步骤或代码，而不是人手写语法。

## 什么时候会遇到

用 AI 做表格处理、批量改文件名、生成小工具时；产品宣传「说句话就能做应用」也是这个思路。

## 和 AI 的关系

AI 承担「把话翻译成代码」这一步，但表达含糊时结果也会含糊；想清楚要什么，仍是最难的部分。

## 想深入再看

可以继续看 Vibe Coding 与代码生成。
