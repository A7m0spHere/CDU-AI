---
term: "系统提示词"
en: "System Prompt"
category: "prompt"
aliases: ["System Prompt", "系统消息", "系统指令"]
definition: "产品或开发者预先提供的高优先级指令，用来设定角色、语气和行为边界。"
example: "自建社团助手时，开发者预先写明「只引用已确认的活动信息」，这类规则可以放在系统提示词里。"
youMaySay: "为什么同一个模型，换个产品就像换了个人？"
scenario:
  title: "两个产品两种态度"
  steps:
    - label: "同一问题"
      body: "向两个产品问同一问题，收到不同回答。"
      note: "模型版本、工具与产品指令都可能影响结果，不能只归因于系统提示词。"
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
updated: "2026-10-30"
sources:
  - title: "Giving Claude a role with a system prompt · Anthropic"
    url: "https://platform.claude.com/docs/en/build-with-claude/prompt-engineering/system-prompts"
basis: "desk-research"
aiUsage: "drafted"
---

## 一句话说清

系统提示词是产品或开发者预先提供的指令，用来规定模型的角色、语气和限制。它通常不显示在普通聊天界面里，是否持续作用取决于产品如何管理后续请求。

## 打个比方

像门店的服务规定：顾客点什么是一回事，店里提前定好的流程和红线是另一回事，两样一起决定最后端上来什么。

## 它是怎么运作的

你发消息前，产品已经把系统提示词和你的输入拼在一起交给模型。在多数产品里它有更高的优先级，但它不是安全边界——遇到足够强的诱导，规则也可能被绕过。

## 你会碰到它的场景

- 同一个模型在不同产品里谨慎程度不同；
- 用 API 或自建助手时，角色、语气、禁止事项都写在系统提示词里；
- Agent 产品会用它规定工具使用和确认流程。

## 常见误解

- 以为看不到就不存在：产品可能在后台提供这类指令；
- 以为写了规则就绝对安全：规则会被绕过，重要操作还要人来确认；
- 以为系统提示词等于你的问题：它只是背景设定，具体任务仍要你写清楚。

## 想再深入一点

不同 API 的传法不同：有的使用 system 消息，有的使用专门的 system 参数。以所用 API 的官方文档为准；普通用户消息里的角色扮演，也不会自动变成系统级指令。
