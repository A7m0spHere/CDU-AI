---
term: "角色设定"
en: "Role Prompting"
category: "prompt"
aliases: ["Role Prompting", "角色扮演", "人设"]
definition: "给模型一个身份与口吻，比如「你是耐心的辅导员」。"
example: "让 AI「用宿管阿姨的口吻」写宿舍安全提醒，措辞会立刻接地气。"
youMaySay: "让它假装专家，回答是不是就更专业了？"
scenario:
  title: "换口吻写通知"
  steps:
    - label: "普通提问"
      body: "直接让 AI 写宿舍安全提醒，语气像说明书。"
      note: "表达方式取决于提示。"
    - label: "加角色"
      body: "要求「用宿管阿姨的口吻，对新生说话」。"
      meta: "角色设定"
    - label: "对比效果"
      body: "内容差不多，但更接地气；涉及规定仍要核对原文。"
quiz:
  - question: "角色设定改变的主要是什么？"
    options:
      - text: "模型掌握的知识"
        correct: false
      - text: "表达的语气、视角与举例方式"
        correct: true
      - text: "模型的权限"
        correct: false
    explain: "角色影响表达，不增加知识或权限。"
agentPrompt: "请分别用「辅导员」和「同班同学」两种口吻写同一份通知，内容事实保持一致。"
order: 6
related: ["prompt", "system-prompt"]
updated: "2026-10-26"
sources:
  - title: "Giving Claude a role with a system prompt · Anthropic"
    url: "https://platform.claude.com/docs/en/build-with-claude/prompt-engineering/system-prompts"
basis: "desk-research"
aiUsage: "drafted"
---

## 一句话说清

角色设定是告诉模型「你现在是谁、对谁说话」，从而改变用词、语气和看问题的角度。

## 打个比方

像演员拿到角色：同一句台词，演医生和演新生说出来完全不同。

## 它是怎么运作的

角色描述会进入提示词，影响模型选择哪些词汇、举什么例子、从什么立场组织内容。它改变的是表达方式，不改变模型掌握的事实。

## 你会碰到它的场景

- 把同一份通知改成「给新生看的」或「给家长看的」；
- 让 AI 扮演面试官，提前练答辩；
- 让解释更通俗：「用给初中生讲的方式解释」。

## 常见误解

- 以为「你是专家」就更准确：角色不增加知识，只改变表达；
- 以为角色能获得权限：模型不会因为你设定身份就真的能查成绩、进系统；
- 以为角色设定可以替代具体要求：口吻之外，任务、格式、边界仍要写清楚。

## 想再深入一点

在 API 里，角色设定通常写在系统提示词里，一次设定、全程生效；写在普通提问里则只影响这一轮。
