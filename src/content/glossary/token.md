---
term: "Token"
en: "Token"
category: "context"
aliases: ["词元", "文本令牌"]
definition: "Token 是模型读取和生成文字、标点或代码时使用的计数单位。"
example: "一个汉字不一定正好等于一个 Token；用量会影响上下文长度、速度和费用。"
order: 3
related: ["context-window", "token-cost", "streaming-response"]
updated: "2026-10-19"
sources:
  - title: "阿里云 · Token 计算"
    url: "https://help.aliyun.com/zh/open-search/search-platform/developer-reference/token-calculation"
---

## 一句话说清

模型不按「字」处理文字，而是先把文字切成一串小片段，再按片段读、按片段写。这个片段就是 Token，它同时是长度单位、计费单位和速度单位。

## 打个比方

快递按重量计费，不管箱子里装的是书还是衣服。汉字、英文、标点、代码符号都要「上秤称一称」。

## 它是怎么运作的

1. 文本先被切成 Token 序列，常见的词可能是一整个，生僻词会被拆成几段。
2. 模型按这些片段逐个生成下一个片段。
3. 上下文窗口、账单、生成速度，全都按这个单位计算。

## 你会碰到它的场景

- 想把一份长报告塞进去，先估算会不会超。
- 看 API 账单时，发现输入和输出的单价不一样。
- 长对话越来越慢、越来越贵。

## 常见误解

- 以为一个字就是一个 Token。一个 Token 可能对应一个或多个汉字，一个汉字也可能被拆成多个 Token；不同模型和文本的切法不同。
- 以为 Token 就是字数。它是处理单位，不是字数。
- 以为看不见就不用管。长对话的费用就是这样涨上去的。

## 想再深入一点

中文没有适用于所有模型的「汉字数换算 Token」固定比例。估算长度时，使用目标模型的 tokenizer（把文本切成 Token 的工具）或官方计数接口；核对实际用量时查看服务返回的 usage（用量）字段。换模型后要重新估算，不能把某个模型的经验比例当作通用余量。
