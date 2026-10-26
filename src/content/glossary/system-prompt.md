---
term: "系统提示词"
en: "System Prompt"
category: "prompt"
aliases: ["System Prompt", "系统消息", "系统指令"]
definition: "提前设定角色与规则的指令，用户通常看不到，但一直生效。"
example: "同一个模型，网页版里拒绝帮你写课程论文，换成另一个产品却照写——差别往往在系统提示词。"
youMaySay: "为什么同一个模型，换个产品就像换了个人？"
scenario:
  title: "两个产品两种态度"
  steps:
    - label: "同一问题"
      body: "在 A 产品里问敏感问题被婉拒，在 B 产品里却直接回答。"
      note: "产品设定的规则不同。"
    - label: "查看设置"
      body: "在 B 产品里看到「自定义角色 / 指令」设置项。"
      meta: "产品设置"
    - label: "自己写规则"
      body: "在自建助手里把边界写进系统提示词，并测试是否被绕过。"
quiz:
  - question: "系统提示词的主要作用是？"
    options:
      - text: "替用户输入问题"
        correct: false
      - text: "在用户提问前设定角色、语气和限制"
        correct: true
      - text: "存储聊天记录"
        correct: false
    explain: "系统提示词是产品预先设定的背景规则。"
agentPrompt: "请以「社团活动助手」的身份回答：只提供已确认的活动信息，不确定时先问我，不要编造时间地点。"
order: 2
related: ["prompt", "role-prompting"]
updated: "2026-10-26"
sources:
  - title: "Giving Claude a role with a system prompt · Anthropic"
    url: "https://platform.claude.com/docs/en/build-with-claude/prompt-engineering/system-prompts"
basis: "desk-research"
aiUsage: "drafted"
---

## 一句话说清

系统提示词是产品（或开发者）在你提问之前就设定好的指令，用来规定模型的角色、语气和限制。你在聊天框里看不到它，但每条回答都受它影响。

## 打个比方

像门店的服务规定：顾客点什么是一回事，店里提前定好的流程和红线是另一回事，两样一起决定最后端上来什么。

## 它是怎么运作的

你发消息前，产品已经把系统提示词和你的输入拼在一起交给模型。在多数产品里它有更高的优先级，但它不是安全边界——遇到足够强的诱导，规则也可能被绕过。

## 你会碰到它的场景

- 同一个模型在不同产品里谨慎程度不同；
- 用 API 或自建助手时，角色、语气、禁止事项都写在系统提示词里；
- Agent 产品会用它规定工具使用和确认流程。

## 常见误解

- 以为看不到就不存在：它一直在生效；
- 以为写了规则就绝对安全：规则会被绕过，重要操作还要人来确认；
- 以为系统提示词等于你的问题：它只是背景设定，具体任务仍要你写清楚。

## 想再深入一点

API 里通常用 system 角色传系统提示词，用 user 角色传你的问题；网页版产品替你写好了前者。
