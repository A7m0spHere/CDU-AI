---
term: "输出格式"
en: "Output Format"
category: "prompt"
aliases: ["Output Format", "结构化输出", "格式约束"]
definition: "要求回答以清单、表格、JSON 等固定结构给出。"
example: "让 AI 把课程表整理成「星期｜时间｜课程｜地点」四列表格，方便直接抄进手账。"
youMaySay: "怎么让它别写一大段，直接给我能复制的表格？"
scenario:
  title: "课程表整理"
  steps:
    - label: "描述结构"
      body: "要求输出「星期｜时间｜课程｜地点」四列表格。"
      note: "列名越明确越稳。"
    - label: "检查字段"
      body: "发现「地点」列有空值。"
      meta: "格式对不代表内容全"
    - label: "补充规则"
      body: "要求「缺失信息填待确认，不要猜」。"
quiz:
  - question: "要求模型输出固定格式时，哪种做法更可靠？"
    options:
      - text: "只说「整理成表格」"
        correct: false
      - text: "给出列名、顺序，必要时附一个示例"
        correct: true
      - text: "要求写得越长越好"
        correct: false
    explain: "结构明确、附示例更稳定；格式对不代表内容对。"
agentPrompt: "请把下面的信息整理成四列表格：星期、时间、课程、地点；缺失的填「待确认」，不要编造。"
order: 6
related: ["few-shot", "prompt"]
updated: "2026-10-30"
sources:
  - title: "Prompt engineering overview · Anthropic"
    url: "https://platform.claude.com/docs/en/build-with-claude/prompt-engineering/overview"
  - title: "Structured outputs · Anthropic"
    url: "https://platform.claude.com/docs/en/build-with-claude/structured-outputs"
basis: "desk-research"
aiUsage: "drafted"
---

## 一句话说清

输出格式就是规定回答长什么样：列表、表格、分点、JSON、字数上限，都算。

## 打个比方

像填表而不是自由发挥：格子画好了，信息就不容易漏。

## 它是怎么运作的

你在提示词里描述结构，模型按结构组织文字。格式越明确（列名、字段、顺序），结果越稳定；复杂结构最好附一个小例子。

## 你会碰到它的场景

- 把杂乱信息整理成表格；
- 要一份能直接粘进文档的分点清单；
- 给程序用的固定字段结果（JSON）。

## 常见误解

- 以为格式对内容就对：结构整齐也可能填错值，关键字段要抽查；
- 以为说得越复杂越好：字段太多容易漏，先定必需字段；
- 以为 JSON 一定合法：模型可能少逗号、编字段，粘进程序前先验证。

## 想再深入一点

格式要求可以写在提示词里，也可以配一个示例（少样本）。需要程序解析时，优先用产品提供的结构化输出能力，并做好校验。
