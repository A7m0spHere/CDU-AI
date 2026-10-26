---
term: "Token"
en: "Token"
category: "basics"
aliases: ["token", "词元"]
definition: "模型切分与计量文字的单位，也是最常见的计费单位。"
example: "同一段中文，不同模型切出的 token 数不一样，所以「按 token 计费」的价格表不能直接比。"
youMaySay: "为什么同一个问题，有时会提示我「额度不够了」？"
scenario:
  title: "长文档分析耗掉大量额度"
  steps:
    - label: "粘贴长文"
      body: "把几十页课程资料一次粘进对话框，提问细节。"
      note: "文字会先被切成 token 再处理。"
    - label: "看到用量提示"
      body: "页面提示本次消耗了大量 token，剩余额度明显减少。"
      meta: "用量面板"
    - label: "拆分提问"
      body: "改成先摘要、再分段问，每次只带相关章节。"
      note: "同样的任务，token 消耗会小很多。"
quiz:
  - question: "关于 token，哪种说法正确？"
    options:
      - text: "一个汉字一定等于一个 token"
        correct: false
      - text: "token 是模型计量文字的单位，不同模型切法不同"
        correct: true
      - text: "token 越多说明回答质量越高"
        correct: false
    explain: "token 是计量单位，不等于字数，也不代表质量。"
agentPrompt: "请估算下面这段文字大约有多少 token，并说明这只是估算、不同模型会有差异。"
order: 3
related: ["llm", "usage-based-billing"]
updated: "2026-10-26"
sources:
  - title: "Token counting · Anthropic"
    url: "https://platform.claude.com/docs/en/build-with-claude/token-counting"
basis: "desk-research"
aiUsage: "drafted"
---

## 一句话说清

Token 是模型处理文字的最小单位。中文里一个字或一个词可能是一个 token，英文里常见一个词根或词缀。

## 打个比方

像快递按「件」计费：不是按字数，而是按打包后的件数，不同公司打包方式还不一样。

## 它是怎么运作的

模型先把文字切成 token 再计算；上下文窗口、输入输出长度、计费都按 token 数算。

## 你会碰到它的场景

- 试用额度用完时看到「已使用 X 万 token」；
- 长文档粘贴后提示超出上限；
- 对比不同模型价格时发现计价单位一样、切法不同。

## 常见误解

- 以为一个汉字就是一个 token：不一定；
- 以为 token 越多回答越好：只是长度，不代表质量；
- 以为价格可以直接比：不同模型切法与单价都不同。

## 想再深入一点

可以用官方 token 计数工具估算：同一段文字在不同模型下的 token 数不同。
