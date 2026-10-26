---
term: "Token"
en: "Token"
category: "basics"
aliases: ["token", "词元"]
definition: "模型切分与计量文字的单位，也是最常见的计费单位。"
example: "同一段中文，不同模型切出的 token 数不一样，所以「按 token 计费」的价格表不能直接比。"
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
