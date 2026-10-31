---
term: "越狱"
en: "Jailbreak"
category: "safety"
aliases: ["Jailbreak", "越狱提示词"]
definition: "用话术绕过模型的使用限制，让它输出本来拒绝的内容。"
example: "用「假设你在写小说」之类的包装，诱导模型给出本应拒绝的内容，就是越狱尝试。"
youMaySay: "网上那些「越狱提示词」真的有用吗？"
scenario:
  title: "尝试绕过限制"
  steps:
    - label: "使用话术"
      body: "用角色扮演包装，要求输出被禁止的内容。"
      note: "旧话术常很快失效。"
    - label: "被拒绝"
      body: "模型仍拒绝，或给出安全提醒。"
      meta: "安全底线"
    - label: "记录风险"
      body: "不要继续尝试，理解拒绝的原因。"
quiz:
  - question: "关于越狱提示词，正确的态度是？"
    options:
      - text: "收藏起来反复使用"
        correct: false
      - text: "了解其风险，不用于获取违规内容"
        correct: true
      - text: "越狱成功说明模型更聪明"
        correct: false
    explain: "越狱可能带来违法与安全风险，模型也会修补。"
agentPrompt: "请解释为什么下面这个请求可能违反使用规则，并给出合规的替代做法。"
order: 2
related: ["prompt-injection"]
updated: "2026-11-01"
sources:
  - title: "Mitigate jailbreaks and prompt injections · Anthropic"
    url: "https://platform.claude.com/docs/en/test-and-evaluate/strengthen-guardrails/mitigate-jailbreaks"
  - title: "LLM01: Prompt Injection · OWASP"
    url: "https://genai.owasp.org/llmrisk/llm01-prompt-injection/"
basis: "desk-research"
aiUsage: "drafted"
reviewed: "2026-11-01"
reviewedBy: "AI 初审（负责人授权）"
reviewNote: "负责人确认修改概念区别；未实测具体模型的防护效果。"
---

## 一句话说清

越狱是用特定话术让模型绕过自身的安全限制，输出被禁止的内容或做出不该做的承诺。

## 打个比方

像用花言巧语让门卫放行：门没坏，但规则被绕过去了。

## 它是怎么运作的

攻击者利用模型对语境的敏感性，构造角色扮演、分步诱导、编码转换等话术；模型有时会跟着走。

## 你会碰到它的场景

- 网上流传的「越狱提示词」；
- 让 AI 假装没有限制；
- 产品更新后旧话术失效。

## 常见误解

- 以为越狱提示词永远有效：模型会修补；
- 以为越狱只是好玩：可能带来违法与安全风险；
- 以为被拒绝就是模型笨：拒绝往往是安全底线。

## 想再深入一点

越狱侧重绕过模型的安全限制；提示词注入侧重用输入中的指令改变系统原本的行为。注入既可能直接来自用户输入，也可能藏在网页或文件等外部内容中；两者可能重叠。
