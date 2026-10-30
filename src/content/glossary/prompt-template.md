---
term: "提示词模板"
en: "Prompt Template"
category: "prompt"
aliases: ["Prompt Template", "提示词框架", "模板"]
definition: "把常用指令写成可复用框架，换任务只改细节。"
example: "把「总结课程资料」的要求写成模板：读者大一、保留公式、输出三段，每次只换材料。"
youMaySay: "每次都要重写一遍要求，有没有省事的办法？"
scenario:
  title: "每周实验报告"
  steps:
    - label: "总结固定要求"
      body: "把「读者大一、保留公式、三段结构、不写结论外推」整理成模板。"
      note: "固定部分沉淀下来。"
    - label: "套用模板"
      body: "每周只替换实验材料，输出保持稳定。"
      meta: "模板复用"
    - label: "定期调整"
      body: "换课程后修改模板约束，避免过期要求。"
quiz:
  - question: "提示词模板最适合什么场景？"
    options:
      - text: "一次性提问"
        correct: false
      - text: "同一类任务反复出现、要求稳定"
        correct: true
      - text: "完全开放的发散创作"
        correct: false
    explain: "模板把重复要求固定下来，适合高频同类任务。"
agentPrompt: "请根据下面的要求帮我写一个每周实验报告整理模板，留出「实验材料」空位，并说明哪些部分需要我每次替换。"
order: 7
related: ["prompt", "few-shot"]
updated: "2026-10-26"
sources:
  - title: "Prompt library · Anthropic"
    url: "https://platform.claude.com/docs/en/resources/prompt-library/library"
basis: "desk-research"
aiUsage: "drafted"
---

## 一句话说清

提示词模板是把反复用到的指令固定下来：角色、格式、约束写好，具体任务留空，下次只换材料。

## 打个比方

像请假条模板：抬头、事由、时间、落款都是固定的，每次只填日期和原因。

## 它是怎么运作的

模板把「每次都一样的要求」和「每次都不一样的内容」分开。固定的部分保证输出稳定，空出来的部分留给具体任务。

## 你会碰到它的场景

- 每周的实验报告整理；
- 社团活动通知的固定格式；
- 同一类资料的批量摘要。

## 常见误解

- 以为模板一次写好就永久有效：任务变了、模型换了，模板也要调；
- 以为模板能代替思考：模板保证格式，判断仍要你自己做；
- 以为模板越细越好：约束太多会把真正重要的要求挤掉。

## 想再深入一点

模板配合少样本示例更稳；把模板存成文档或笔记，比每次翻聊天记录可靠。
